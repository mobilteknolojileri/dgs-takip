import { useState, type SyntheticEvent } from 'react';
import { PieChart, Calculator, BookText, Save, Loader2, Check, Clock } from 'lucide-react';

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
  "Olcay Küçükçelik 6'lı Deneme",
  "Anamorfik 8'li Fişek/Ultra TG Deneme 2024",
  "Anamorfik 10'lu Özgün TG Deneme Seti",
  "Yediiklim Prestij Serisi 16'lı Deneme",
  "Tasarı Yayınları 6'lı DGS Deneme",
  'Tasarı DGS Öncesi Check-Up (3 Deneme)',
  "Tasarı 5'li Matematik Branş Performans Denemesi",
  "İnformal Kara Kutu 10'lu TG Deneme 2025",
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
  const [customPublisher, setCustomPublisher] = useState('');
  const [examDate, setExamDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [timeSpent, setTimeSpent] = useState(0);
  const [examType, setExamType] = useState<'tam' | 'sayisal' | 'sozel'>('tam');
  const [activeTab, setActiveTab] = useState<'genel' | 'sayisal' | 'sozel'>('genel');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  // Genel sayılar
  const [sayisalCorrect, setSayisalCorrect] = useState(0);
  const [sayisalWrong, setSayisalWrong] = useState(0);
  const [sozelCorrect, setSozelCorrect] = useState(0);
  const [sozelWrong, setSozelWrong] = useState(0);

  const sayisalBlank = Math.max(0, 50 - (sayisalCorrect + sayisalWrong));
  const sozelBlank = Math.max(0, 50 - (sozelCorrect + sozelWrong));

  // Sadece yanlış yapılan konuları takip edeceğiz (diğerleri doğru kabul edilecek)
  const [wrongSubjects, setWrongSubjects] = useState<Set<string>>(new Set());

  function toggleWrongSubject(name: string) {
    setWrongSubjects((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  }

  const sayisalNet = sayisalCorrect - sayisalWrong / 4;
  const sozelNet = sozelCorrect - sozelWrong / 4;
  const totalNet = sayisalNet + sozelNet;

  // Removed updateSubject

  async function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!name.trim()) {
      setToast({ msg: 'Deneme adı gerekli!', type: 'error' });
      return;
    }

    setSaving(true);
    try {
      // Seçilenler yanlış (wrong: 1), seçilmeyenler doğru (correct: 1)
      const subjects: SubjectEntry[] = [
        ...SAYISAL_SUBJECTS.map((name) => ({
          subject_name: name,
          category: 'sayisal' as const,
          wrong: wrongSubjects.has(name) ? 1 : 0,
          correct: wrongSubjects.has(name) ? 0 : 1,
          blank: 0,
        })),
        ...SOZEL_SUBJECTS.map((name) => ({
          subject_name: name,
          category: 'sozel' as const,
          wrong: wrongSubjects.has(name) ? 1 : 0,
          correct: wrongSubjects.has(name) ? 0 : 1,
          blank: 0,
        })),
      ];

      const res = await fetch('/api/exams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          publisher: publisher === 'Diğer' ? customPublisher : publisher,
          exam_date: examDate,
          sayisal_correct: examType !== 'sozel' ? sayisalCorrect : 0,
          sayisal_wrong: examType !== 'sozel' ? sayisalWrong : 0,
          sayisal_blank: examType !== 'sozel' ? sayisalBlank : 50,
          sozel_correct: examType !== 'sayisal' ? sozelCorrect : 0,
          sozel_wrong: examType !== 'sayisal' ? sozelWrong : 0,
          sozel_blank: examType !== 'sayisal' ? sozelBlank : 50,
          time_spent: timeSpent,
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

  function renderSubjectGrid(subjects: string[]) {
    return (
      <div className="space-y-1">
        {/* Header */}
        <div className="grid grid-cols-[1fr_auto] gap-2 border-b border-white/[0.06] px-3 pb-2">
          <div className="text-[11px] font-bold tracking-wide text-slate-500 uppercase">
            Konu Adı
          </div>
          <div className="text-center text-[11px] font-bold tracking-wide text-red-400 uppercase">
            Yanlış mı?
          </div>
        </div>
        {subjects.map((subj) => {
          const isWrong = wrongSubjects.has(subj);
          return (
            <div
              key={subj}
              onClick={() => toggleWrongSubject(subj)}
              className="flex cursor-pointer items-center justify-between rounded-lg border border-white/[0.02] bg-white/[0.02] px-3 py-3 transition-colors hover:bg-white/[0.04]"
            >
              <div
                className={`text-sm font-medium transition-colors ${isWrong ? 'text-red-400' : 'text-slate-300'}`}
              >
                {subj}
              </div>
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-md border transition-colors ${
                  isWrong
                    ? 'border-red-500 bg-red-500 text-white'
                    : 'border-white/[0.1] bg-white/[0.04] text-transparent'
                }`}
              >
                <Check className="h-4 w-4" />
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Üst bilgiler */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-xs font-semibold tracking-wide text-slate-300 uppercase">
            Deneme Adı *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Örn: Tasarı DGS Deneme 1"
            className="w-full rounded-lg border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm text-slate-100 transition-all outline-none placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
            required
          />
        </div>
        <div>
          <label className="mb-2 block text-xs font-semibold tracking-wide text-slate-300 uppercase">
            Yayınevi / Kaynak
          </label>
          <select
            value={publisher}
            onChange={(e) => setPublisher(e.target.value)}
            className="w-full cursor-pointer appearance-none rounded-lg border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm text-slate-100 transition-all outline-none focus:border-blue-500"
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
          {publisher === 'Diğer' && (
            <input
              type="text"
              value={customPublisher}
              onChange={(e) => setCustomPublisher(e.target.value)}
              placeholder="Kaynak adını yazın..."
              className="mt-2 w-full rounded-lg border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm text-slate-100 transition-all outline-none placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
            />
          )}
        </div>
        <div>
          <label className="mb-2 block text-xs font-semibold tracking-wide text-slate-300 uppercase">
            Sınav Tipi
          </label>
          <select
            value={examType}
            onChange={(e) => {
              const val = e.target.value as 'tam' | 'sayisal' | 'sozel';
              setExamType(val);
              if (val === 'sayisal' && activeTab === 'sozel') setActiveTab('genel');
              if (val === 'sozel' && activeTab === 'sayisal') setActiveTab('genel');
            }}
            className="w-full cursor-pointer appearance-none rounded-lg border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm text-slate-100 transition-all outline-none focus:border-blue-500"
          >
            <option value="tam" className="bg-slate-900">
              Tam DGS (Sayısal + Sözel)
            </option>
            <option value="sayisal" className="bg-slate-900">
              Sadece Sayısal (Branş)
            </option>
            <option value="sozel" className="bg-slate-900">
              Sadece Sözel (Branş)
            </option>
          </select>
        </div>
        <div>
          <label className="mb-2 block text-xs font-semibold tracking-wide text-slate-300 uppercase">
            Tarih
          </label>
          <input
            type="date"
            value={examDate}
            onChange={(e) => setExamDate(e.target.value)}
            className="w-full rounded-lg border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm text-slate-100 transition-all outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Süre girişi */}
      <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3">
        <Clock className="h-5 w-5 shrink-0 text-amber-400" />
        <label className="text-sm font-semibold whitespace-nowrap text-slate-300">Süre (dk)</label>
        <input
          type="number"
          min={0}
          max={300}
          value={timeSpent || ''}
          onChange={(e) => setTimeSpent(Math.min(300, parseInt(e.target.value) || 0))}
          placeholder="Ör: 140"
          className="w-24 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-center text-sm font-bold text-amber-300 transition-all outline-none placeholder:text-slate-600 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
        />
        {timeSpent > 0 && (
          <span className="text-xs text-slate-500">
            ({Math.floor(timeSpent / 60)} saat {timeSpent % 60} dk)
          </span>
        )}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 rounded-lg bg-white/[0.03] p-1">
        {(['genel', 'sayisal', 'sozel'] as const)
          .filter((tab) => {
            if (examType === 'sayisal' && tab === 'sozel') return false;
            if (examType === 'sozel' && tab === 'sayisal') return false;
            return true;
          })
          .map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-md py-2.5 text-center text-sm font-semibold transition-all ${
                activeTab === tab
                  ? 'bg-blue-500 text-white'
                  : 'text-slate-400 hover:bg-white/[0.04] hover:text-slate-100'
              }`}
            >
              {tab === 'genel' ? (
                <>
                  <PieChart className="h-4 w-4 shrink-0" /> Genel
                </>
              ) : tab === 'sayisal' ? (
                <>
                  <Calculator className="h-4 w-4 shrink-0" />{' '}
                  <span className="hidden sm:inline">Sayısal Konu Analizi</span>
                  <span className="sm:hidden">Say. Analiz</span>
                </>
              ) : (
                <>
                  <BookText className="h-4 w-4 shrink-0" />{' '}
                  <span className="hidden sm:inline">Sözel Konu Analizi</span>
                  <span className="sm:hidden">Söz. Analiz</span>
                </>
              )}
            </button>
          ))}
      </div>

      {/* Genel Tab */}
      {activeTab === 'genel' && (
        <div className="space-y-6">
          {/* Sayısal özet */}
          {examType !== 'sozel' && (
            <div className="rounded-2xl border border-white/[0.06] bg-slate-900/60 p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-lg font-bold">
                  <Calculator className="h-5 w-5 text-blue-400" /> Sayısal
                </h3>
                <div
                  className={`text-2xl font-extrabold ${sayisalNet >= 0 ? 'text-emerald-400' : 'text-red-400'}`}
                >
                  {sayisalNet.toFixed(1)} net
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-emerald-400">Doğru</label>
                  <input
                    type="number"
                    min={0}
                    max={50}
                    value={sayisalCorrect}
                    onChange={(e) => setSayisalCorrect(Math.min(50, parseInt(e.target.value) || 0))}
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
                    onChange={(e) => setSayisalWrong(Math.min(50, parseInt(e.target.value) || 0))}
                    className="w-full rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-center text-lg font-bold text-red-300 transition-all outline-none focus:border-red-400"
                  />
                </div>
              </div>
              <div className="mt-4 text-center text-xs font-medium text-slate-500">
                Otomatik hesaplanan boş sayısı:{' '}
                <strong className="text-slate-300">{sayisalBlank}</strong>
              </div>
            </div>
          )}

          {/* Sözel özet */}
          {examType !== 'sayisal' && (
            <div className="rounded-2xl border border-white/[0.06] bg-slate-900/60 p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-lg font-bold">
                  <BookText className="h-5 w-5 text-indigo-400" /> Sözel
                </h3>
                <div
                  className={`text-2xl font-extrabold ${sozelNet >= 0 ? 'text-emerald-400' : 'text-red-400'}`}
                >
                  {sozelNet.toFixed(1)} net
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-emerald-400">Doğru</label>
                  <input
                    type="number"
                    min={0}
                    max={50}
                    value={sozelCorrect}
                    onChange={(e) => setSozelCorrect(Math.min(50, parseInt(e.target.value) || 0))}
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
                    onChange={(e) => setSozelWrong(Math.min(50, parseInt(e.target.value) || 0))}
                    className="w-full rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-center text-lg font-bold text-red-300 transition-all outline-none focus:border-red-400"
                  />
                </div>
              </div>
              <div className="mt-4 text-center text-xs font-medium text-slate-500">
                Otomatik hesaplanan boş sayısı:{' '}
                <strong className="text-slate-300">{sozelBlank}</strong>
              </div>
            </div>
          )}

          {/* Toplam net */}
          <div className="rounded-2xl border border-blue-500/20 bg-gradient-to-r from-blue-500/10 to-sky-500/10 p-6 text-center">
            <div className="mb-1 text-sm font-semibold tracking-wider text-slate-300 uppercase">
              Toplam Net
            </div>
            <div
              className={`text-5xl font-black ${totalNet >= 0 ? 'bg-gradient-to-r from-blue-400 to-sky-400 bg-clip-text text-transparent' : 'text-red-400'}`}
            >
              {totalNet.toFixed(1)}
            </div>
            <div className="mt-2 text-xs text-slate-500">
              {examType === 'tam'
                ? `Sayısal: ${sayisalNet.toFixed(1)} + Sözel: ${sozelNet.toFixed(1)}`
                : examType === 'sayisal'
                  ? `Sayısal: ${sayisalNet.toFixed(1)}`
                  : `Sözel: ${sozelNet.toFixed(1)}`}
            </div>
          </div>

          {/* Not */}
          <div>
            <label className="mb-2 block text-xs font-semibold tracking-wide text-slate-300 uppercase">
              Notlar
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Bu deneme hakkında notların..."
              rows={3}
              className="w-full resize-none rounded-lg border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm text-slate-100 transition-all outline-none placeholder:text-slate-600 focus:border-blue-500"
            />
          </div>
        </div>
      )}

      {/* Sayısal Konular Tab */}
      {activeTab === 'sayisal' && examType !== 'sozel' && (
        <div className="rounded-2xl border border-white/[0.06] bg-slate-900/60 p-6">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-bold">
            <Calculator className="h-5 w-5 text-blue-400" /> Sayısal - Konu Bazlı Giriş
          </h3>
          <p className="mb-4 text-xs text-slate-500">
            Sadece <strong>yanlış yaptığın</strong> konuları işaretle. İşaretlenmeyen tüm konular{' '}
            <strong className="text-emerald-400">doğru</strong> kabul edilecek.
          </p>
          {renderSubjectGrid(SAYISAL_SUBJECTS)}
        </div>
      )}

      {/* Sözel Konular Tab */}
      {activeTab === 'sozel' && examType !== 'sayisal' && (
        <div className="rounded-2xl border border-white/[0.06] bg-slate-900/60 p-6">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-bold">
            <BookText className="h-5 w-5 text-indigo-400" /> Sözel - Konu Bazlı Giriş
          </h3>
          <p className="mb-4 text-xs text-slate-500">
            Sadece <strong>yanlış yaptığın</strong> konuları işaretle. İşaretlenmeyen tüm konular{' '}
            <strong className="text-emerald-400">doğru</strong> kabul edilecek.
          </p>
          {renderSubjectGrid(SOZEL_SUBJECTS)}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={saving}
        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border-none bg-gradient-to-r from-blue-500 to-sky-400 py-4 text-base font-bold text-white shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {saving ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" /> Kaydediliyor...
          </>
        ) : (
          <>
            <Save className="h-5 w-5" /> Denemeyi Kaydet
          </>
        )}
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
