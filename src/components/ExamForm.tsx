import { useState, type SyntheticEvent } from 'react';

const SAYISAL_SUBJECTS = [
  'İşlem Yeteneği',
  'Sayı Kümeleri',
  'Ardışık Sayılar',
  'Faktöriyel',
  'Basamak Kavramı',
  'Bölme-Bölünebilme',
  'Asal Sayılar',
  'EBOB-EKOK',
  'Rasyonel Sayılar',
  'Denklemler',
  'Eşitsizlikler',
  'Mutlak Değer',
  'Üslü Sayılar',
  'Köklü Sayılar',
  'Çarpanlara Ayırma',
  'Oran-Orantı',
  'Sayı Problemleri',
  'Kesir Problemleri',
  'Yaş Problemleri',
  'Yüzde Problemleri',
  'Kar-Zarar',
  'Karışım Problemleri',
  'İşçi Problemleri',
  'Havuz Problemleri',
  'Hareket Problemleri',
  'Tablo-Grafik',
  'Kümeler',
  'Fonksiyonlar',
  'İşlem',
  'Permütasyon',
  'Kombinasyon',
  'Olasılık',
  'Sayısal Mantık',
  'Üçgenler',
  'Dörtgenler',
  'Çember-Daire',
  'Analitik Geometri',
  'Katı Cisimler',
];

const SOZEL_SUBJECTS = [
  'Sözcükte Anlam',
  'Cümlede Anlam',
  'Paragraf',
  'Dil Bilgisi',
  'Anlatım Biçimleri',
  'Sözel Mantık',
];

const PUBLISHERS = [
  'Olcay Küçükçelik (Benim Hocam)',
  'Matematiğin İlacı',
  'Geometrinin İlacı',
  'Yektug (Yasin Kara)',
  'Apotemi',
  'Acil Matematik',
  'Anamorfik Yayınları',
  'Yediiklim Prestij',
  'Tasarı Yayınları',
  'İnformal (Kara Kutu)',
  'Diğer',
];

interface SubjectEntry {
  subject_name: string;
  category: 'sayisal' | 'sozel';
  correct: number;
  wrong: number;
  blank: number;
}

export default function ExamForm() {
  const [name, setName] = useState('');
  const [publisher, setPublisher] = useState('');
  const [examDate, setExamDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [activeTab, setActiveTab] = useState<'genel' | 'sayisal' | 'sozel'>('genel');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  // Genel sayılar
  const [sayisalCorrect, setSayisalCorrect] = useState(0);
  const [sayisalWrong, setSayisalWrong] = useState(0);
  const [sayisalBlank, setSayisalBlank] = useState(0);
  const [sozelCorrect, setSozelCorrect] = useState(0);
  const [sozelWrong, setSozelWrong] = useState(0);
  const [sozelBlank, setSozelBlank] = useState(0);

  // Konu detayları
  const [subjectData, setSubjectData] = useState<Record<string, SubjectEntry>>({});

  const sayisalNet = sayisalCorrect - sayisalWrong / 4;
  const sozelNet = sozelCorrect - sozelWrong / 4;
  const totalNet = sayisalNet + sozelNet;

  function updateSubject(
    name: string,
    category: 'sayisal' | 'sozel',
    field: 'correct' | 'wrong' | 'blank',
    value: number,
  ) {
    setSubjectData((prev) => ({
      ...prev,
      [name]: {
        subject_name: name,
        category,
        correct: field === 'correct' ? value : prev[name]?.correct || 0,
        wrong: field === 'wrong' ? value : prev[name]?.wrong || 0,
        blank: field === 'blank' ? value : prev[name]?.blank || 0,
      },
    }));
  }

  async function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!name.trim()) {
      setToast({ msg: 'Deneme adı gerekli!', type: 'error' });
      return;
    }

    setSaving(true);
    try {
      const subjects = Object.values(subjectData).filter(
        (s) => s.correct > 0 || s.wrong > 0 || s.blank > 0,
      );

      const res = await fetch('/api/exams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          publisher,
          exam_date: examDate,
          sayisal_correct: sayisalCorrect,
          sayisal_wrong: sayisalWrong,
          sayisal_blank: sayisalBlank,
          sozel_correct: sozelCorrect,
          sozel_wrong: sozelWrong,
          sozel_blank: sozelBlank,
          notes,
          subjects,
        }),
      });

      if (!res.ok) throw new Error('Kayıt başarısız');

      const data = await res.json();
      setToast({
        msg: `Deneme kaydedildi! Toplam Net: ${data.total_net.toFixed(1)}`,
        type: 'success',
      });
      setTimeout(() => (window.location.href = '/'), 1500);
    } catch {
      setToast({ msg: 'Bir hata oluştu!', type: 'error' });
    } finally {
      setSaving(false);
    }
  }

  function renderSubjectGrid(subjects: string[], category: 'sayisal' | 'sozel') {
    return (
      <div className="space-y-1">
        {/* Header */}
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-2 border-b border-white/[0.06] px-1 pb-2">
          <div className="text-[11px] font-bold tracking-wide text-slate-500 uppercase">Konu</div>
          <div className="text-center text-[11px] font-bold tracking-wide text-emerald-500 uppercase">
            Doğru
          </div>
          <div className="text-center text-[11px] font-bold tracking-wide text-red-400 uppercase">
            Yanlış
          </div>
          <div className="text-center text-[11px] font-bold tracking-wide text-slate-500 uppercase">
            Boş
          </div>
        </div>
        {subjects.map((subj) => (
          <div
            key={subj}
            className="grid grid-cols-[2fr_1fr_1fr_1fr] items-center gap-2 rounded-lg px-1 py-1 transition-colors hover:bg-white/[0.02]"
          >
            <div className="text-[13px] font-medium text-slate-300">{subj}</div>
            <input
              type="number"
              min={0}
              className="w-full rounded-md border border-white/[0.08] bg-white/[0.04] px-2 py-1.5 text-center text-sm text-slate-100 transition-colors outline-none focus:border-emerald-500"
              placeholder="0"
              onChange={(e) =>
                updateSubject(subj, category, 'correct', parseInt(e.target.value) || 0)
              }
            />
            <input
              type="number"
              min={0}
              className="w-full rounded-md border border-white/[0.08] bg-white/[0.04] px-2 py-1.5 text-center text-sm text-slate-100 transition-colors outline-none focus:border-red-400"
              placeholder="0"
              onChange={(e) =>
                updateSubject(subj, category, 'wrong', parseInt(e.target.value) || 0)
              }
            />
            <input
              type="number"
              min={0}
              className="w-full rounded-md border border-white/[0.08] bg-white/[0.04] px-2 py-1.5 text-center text-sm text-slate-100 transition-colors outline-none focus:border-slate-500"
              placeholder="0"
              onChange={(e) =>
                updateSubject(subj, category, 'blank', parseInt(e.target.value) || 0)
              }
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Üst bilgiler */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div>
          <label className="mb-2 block text-xs font-semibold tracking-wide text-slate-400 uppercase">
            Deneme Adı *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Örn: Tasarı DGS Deneme 1"
            className="w-full rounded-lg border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm text-slate-100 transition-all outline-none placeholder:text-slate-600 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30"
            required
          />
        </div>
        <div>
          <label className="mb-2 block text-xs font-semibold tracking-wide text-slate-400 uppercase">
            Yayınevi
          </label>
          <select
            value={publisher}
            onChange={(e) => setPublisher(e.target.value)}
            className="w-full cursor-pointer appearance-none rounded-lg border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm text-slate-100 transition-all outline-none focus:border-violet-500"
          >
            <option value="" className="bg-slate-900">
              Seçiniz...
            </option>
            {PUBLISHERS.map((p) => (
              <option key={p} value={p} className="bg-slate-900">
                {p}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-2 block text-xs font-semibold tracking-wide text-slate-400 uppercase">
            Tarih
          </label>
          <input
            type="date"
            value={examDate}
            onChange={(e) => setExamDate(e.target.value)}
            className="w-full rounded-lg border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm text-slate-100 transition-all outline-none focus:border-violet-500"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg bg-white/[0.03] p-1">
        {(['genel', 'sayisal', 'sozel'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`flex-1 cursor-pointer rounded-md py-2.5 text-center text-sm font-semibold transition-all ${
              activeTab === tab
                ? 'bg-violet-500 text-white'
                : 'text-slate-400 hover:bg-white/[0.04] hover:text-slate-100'
            }`}
          >
            {tab === 'genel'
              ? '📊 Genel'
              : tab === 'sayisal'
                ? '🔢 Sayısal Konular'
                : '📝 Sözel Konular'}
          </button>
        ))}
      </div>

      {/* Genel Tab */}
      {activeTab === 'genel' && (
        <div className="space-y-6">
          {/* Sayısal özet */}
          <div className="rounded-2xl border border-white/[0.06] bg-slate-900/60 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold">🔢 Sayısal</h3>
              <div
                className={`text-2xl font-extrabold ${sayisalNet >= 0 ? 'text-emerald-400' : 'text-red-400'}`}
              >
                {sayisalNet.toFixed(1)} net
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="mb-1 block text-xs font-semibold text-emerald-400">Doğru</label>
                <input
                  type="number"
                  min={0}
                  max={50}
                  value={sayisalCorrect}
                  onChange={(e) => setSayisalCorrect(parseInt(e.target.value) || 0)}
                  className="w-full rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-center text-lg font-bold text-emerald-300 transition-all outline-none focus:border-emerald-400"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-red-400">Yanlış</label>
                <input
                  type="number"
                  min={0}
                  max={50}
                  value={sayisalWrong}
                  onChange={(e) => setSayisalWrong(parseInt(e.target.value) || 0)}
                  className="w-full rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-center text-lg font-bold text-red-300 transition-all outline-none focus:border-red-400"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-400">Boş</label>
                <input
                  type="number"
                  min={0}
                  max={50}
                  value={sayisalBlank}
                  onChange={(e) => setSayisalBlank(parseInt(e.target.value) || 0)}
                  className="w-full rounded-lg border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-center text-lg font-bold text-slate-300 transition-all outline-none focus:border-slate-500"
                />
              </div>
            </div>
          </div>

          {/* Sözel özet */}
          <div className="rounded-2xl border border-white/[0.06] bg-slate-900/60 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold">📝 Sözel</h3>
              <div
                className={`text-2xl font-extrabold ${sozelNet >= 0 ? 'text-emerald-400' : 'text-red-400'}`}
              >
                {sozelNet.toFixed(1)} net
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="mb-1 block text-xs font-semibold text-emerald-400">Doğru</label>
                <input
                  type="number"
                  min={0}
                  max={50}
                  value={sozelCorrect}
                  onChange={(e) => setSozelCorrect(parseInt(e.target.value) || 0)}
                  className="w-full rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-center text-lg font-bold text-emerald-300 transition-all outline-none focus:border-emerald-400"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-red-400">Yanlış</label>
                <input
                  type="number"
                  min={0}
                  max={50}
                  value={sozelWrong}
                  onChange={(e) => setSozelWrong(parseInt(e.target.value) || 0)}
                  className="w-full rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-center text-lg font-bold text-red-300 transition-all outline-none focus:border-red-400"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-400">Boş</label>
                <input
                  type="number"
                  min={0}
                  max={50}
                  value={sozelBlank}
                  onChange={(e) => setSozelBlank(parseInt(e.target.value) || 0)}
                  className="w-full rounded-lg border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-center text-lg font-bold text-slate-300 transition-all outline-none focus:border-slate-500"
                />
              </div>
            </div>
          </div>

          {/* Toplam net */}
          <div className="rounded-2xl border border-violet-500/20 bg-gradient-to-r from-violet-500/10 to-blue-500/10 p-6 text-center">
            <div className="mb-1 text-sm font-semibold tracking-wider text-slate-400 uppercase">
              Toplam Net
            </div>
            <div
              className={`text-5xl font-black ${totalNet >= 0 ? 'bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent' : 'text-red-400'}`}
            >
              {totalNet.toFixed(1)}
            </div>
            <div className="mt-2 text-xs text-slate-500">
              Sayısal: {sayisalNet.toFixed(1)} + Sözel: {sozelNet.toFixed(1)}
            </div>
          </div>

          {/* Not */}
          <div>
            <label className="mb-2 block text-xs font-semibold tracking-wide text-slate-400 uppercase">
              Notlar
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Bu deneme hakkında notların..."
              rows={3}
              className="w-full resize-none rounded-lg border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm text-slate-100 transition-all outline-none placeholder:text-slate-600 focus:border-violet-500"
            />
          </div>
        </div>
      )}

      {/* Sayısal Konular Tab */}
      {activeTab === 'sayisal' && (
        <div className="rounded-2xl border border-white/[0.06] bg-slate-900/60 p-6">
          <h3 className="mb-4 text-lg font-bold">🔢 Sayısal - Konu Bazlı Giriş</h3>
          <p className="mb-4 text-xs text-slate-500">
            Sadece soru çözdüğün konuları doldur, boş bırakabilirsin.
          </p>
          {renderSubjectGrid(SAYISAL_SUBJECTS, 'sayisal')}
        </div>
      )}

      {/* Sözel Konular Tab */}
      {activeTab === 'sozel' && (
        <div className="rounded-2xl border border-white/[0.06] bg-slate-900/60 p-6">
          <h3 className="mb-4 text-lg font-bold">📝 Sözel - Konu Bazlı Giriş</h3>
          <p className="mb-4 text-xs text-slate-500">
            Sadece soru çözdüğün konuları doldur, boş bırakabilirsin.
          </p>
          {renderSubjectGrid(SOZEL_SUBJECTS, 'sozel')}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={saving}
        className="w-full cursor-pointer rounded-xl border-none bg-gradient-to-r from-violet-500 to-blue-500 py-4 text-base font-bold text-white shadow-[0_0_20px_rgba(124,92,252,0.3)] transition-all hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(124,92,252,0.4)] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {saving ? '⏳ Kaydediliyor...' : '💾 Denemeyi Kaydet'}
      </button>

      {/* Toast */}
      {toast && (
        <div
          className={`fixed right-6 bottom-6 z-50 animate-[slideUp_0.3s_ease] rounded-xl px-5 py-3.5 text-sm font-medium shadow-2xl ${
            toast.type === 'success' ? 'bg-emerald-500/90 text-white' : 'bg-red-500/90 text-white'
          }`}
        >
          {toast.msg}
        </div>
      )}
    </form>
  );
}
