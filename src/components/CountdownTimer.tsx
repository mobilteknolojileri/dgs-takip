import { useState, useEffect } from 'react';

const DGS_DATE = new Date('2026-07-19T10:15:00+03:00');

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const now = new Date();
    const diff = DGS_DATE.getTime() - now.getTime();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
      total: diff,
    };
  }

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (timeLeft.total <= 0) {
    return (
      <div className="relative mb-6 overflow-hidden rounded-3xl border border-white/[0.06] bg-slate-900/60 p-8 text-center">
        <div className="text-2xl font-bold">🎉 Sınav Günü Geldi! Başarılar!</div>
      </div>
    );
  }

  return (
    <div className="relative mb-6 overflow-hidden rounded-3xl border border-white/[0.06] bg-slate-900/60 p-8 text-center">
      {/* Glow effect */}
      <div
        className="pointer-events-none absolute -inset-1/2"
        style={{
          width: '200%',
          height: '200%',
          background: 'radial-gradient(circle, rgba(124, 92, 252, 0.06) 0%, transparent 60%)',
          animation: 'pulse-glow 4s ease-in-out infinite',
        }}
      />

      <div className="relative">
        <div className="mb-1 text-xs font-semibold tracking-[3px] text-slate-500 uppercase">
          DGS 2026'ya Kalan Süre
        </div>
        <div className="mb-6 text-[11px] text-slate-600">19 Temmuz 2026 Pazar • Saat 10:15</div>

        <div className="flex items-start justify-center gap-3 md:gap-4">
          <Unit value={timeLeft.days} label="Gün" />
          <Separator />
          <Unit value={timeLeft.hours} label="Saat" />
          <Separator />
          <Unit value={timeLeft.minutes} label="Dakika" />
          <Separator />
          <Unit value={timeLeft.seconds} label="Saniye" />
        </div>
      </div>
    </div>
  );
}

function Unit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex min-w-[60px] flex-col items-center md:min-w-[80px]">
      <div
        className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-4xl leading-none font-black text-transparent md:text-5xl"
        style={{ fontVariantNumeric: 'tabular-nums' }}
      >
        {String(value).padStart(2, '0')}
      </div>
      <div className="mt-1 text-[10px] font-semibold tracking-widest text-slate-600 uppercase">
        {label}
      </div>
    </div>
  );
}

function Separator() {
  return (
    <div
      className="pt-1 text-3xl font-light text-slate-600"
      style={{ animation: 'blink 1s ease-in-out infinite' }}
    >
      :
    </div>
  );
}
