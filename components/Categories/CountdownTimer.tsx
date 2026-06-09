// components/CountdownTimer.tsx
'use client';

import { useEffect, useState } from 'react';

interface CountdownTimerProps {
  targetDate: Date;
}

export default function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance < 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(interval);
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="bg-black/30 rounded-xl p-4 w-full">
      <div className="text-xs uppercase tracking-widest text-white/70 text-center mb-2">
        Time left
      </div>
      <div className="flex justify-center gap-4 text-center font-mono">
        <div>
          <div className="text-3xl font-bold">{timeLeft.days.toString().padStart(2, '0')}</div>
          <div className="text-[10px] uppercase">Days</div>
        </div>
        <div className="text-3xl font-light">:</div>
        <div>
          <div className="text-3xl font-bold">{timeLeft.hours.toString().padStart(2, '0')}</div>
          <div className="text-[10px] uppercase">Hours</div>
        </div>
        <div className="text-3xl font-light">:</div>
        <div>
          <div className="text-3xl font-bold">{timeLeft.minutes.toString().padStart(2, '0')}</div>
          <div className="text-[10px] uppercase">Min</div>
        </div>
        <div className="text-3xl font-light">:</div>
        <div>
          <div className="text-3xl font-bold">{timeLeft.seconds.toString().padStart(2, '0')}</div>
          <div className="text-[10px] uppercase">Sec</div>
        </div>
      </div>
    </div>
  );
}