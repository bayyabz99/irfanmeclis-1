'use client';

import React, { useState, useEffect } from 'react';
import { Clock, Sparkles } from 'lucide-react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function CartoucheCard({ value, label }: { value: number | string; label: string }) {
  return (
    <div className="group relative flex flex-col items-center justify-center w-full aspect-[110/92] max-w-[125px] min-w-0 transition-transform duration-300 hover:scale-105">
      {/* SVG Cartouche Frame with Soft Gentle Curves */}
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-xl" 
        viewBox="0 0 110 92" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="goldBorder" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fae8be" />
            <stop offset="25%" stopColor="#dfbe7a" />
            <stop offset="60%" stopColor="#ab8438" />
            <stop offset="85%" stopColor="#e2c17f" />
            <stop offset="100%" stopColor="#fae8be" />
          </linearGradient>
          <radialGradient id="cardBg" cx="50%" cy="45%" r="65%">
            <stop offset="0%" stopColor="#0f2b45" />
            <stop offset="60%" stopColor="#071b2d" />
            <stop offset="100%" stopColor="#030f1b" />
          </radialGradient>
        </defs>

        {/* Soft, harmonious cartouche outline with rounded cusps */}
        <path 
          d="
            M 28 11
            C 38 8 46 7 51 6
            C 53 4.5 54 3.5 55 3.5
            C 56 3.5 57 4.5 59 6
            C 64 7 72 8 82 11
            C 83 17 87 21 93 22
            C 96 23 99 26 100 32
            C 101 38 102 43 103.5 45
            C 104 45.5 104.5 46 104.5 46
            C 104.5 46 104 46.5 103.5 47
            C 102 49 101 54 100 60
            C 99 66 96 69 93 70
            C 87 71 83 75 82 81
            C 72 84 64 85 59 86
            C 57 87.5 56 88.5 55 88.5
            C 54 88.5 53 87.5 51 86
            C 46 85 38 84 28 81
            C 27 75 23 71 17 70
            C 14 69 11 66 10 60
            C 9 54 8 49 6.5 47
            C 6 46.5 5.5 46 5.5 46
            C 5.5 46 6 45.5 6.5 45
            C 8 43 9 38 10 32
            C 11 26 14 23 17 22
            C 23 21 27 17 28 11
            Z
          "
          fill="url(#cardBg)"
          stroke="url(#goldBorder)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Gentle rounded cardinal pearls */}
        <circle cx="55" cy="2.5" r="1.2" fill="#fae8be" />
        <circle cx="55" cy="89.5" r="1.2" fill="#fae8be" />
        <circle cx="4.5" cy="46" r="1.2" fill="#fae8be" />
        <circle cx="105.5" cy="46" r="1.2" fill="#fae8be" />

        {/* Soft corner accent dots */}
        <circle cx="18" cy="18" r="1" fill="#dfbe7a" opacity="0.8" />
        <circle cx="92" cy="18" r="1" fill="#dfbe7a" opacity="0.8" />
        <circle cx="92" cy="74" r="1" fill="#dfbe7a" opacity="0.8" />
        <circle cx="18" cy="74" r="1" fill="#dfbe7a" opacity="0.8" />
      </svg>

      {/* Card Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-2 select-none">
        <span className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-white tracking-tight leading-none drop-shadow">
          {typeof value === 'number' ? String(value).padStart(2, '0') : value}
        </span>
        <span className="text-[11px] sm:text-xs font-serif font-medium text-slate-200 mt-1 sm:mt-1.5 tracking-wide">
          {label}
        </span>
      </div>
    </div>
  );
}

export default function CountdownTimer({ 
  targetDate = '2026-10-23T09:00:00+03:00',
  countdownText = 'Yeni fikirler, güçlü sesler ve kararlı adımlar için geri sayım başladı.'
}: { 
  targetDate?: string;
  countdownText?: string;
}) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 45,
    hours: 12,
    minutes: 34,
    seconds: 27
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const calculateTimeLeft = (): TimeLeft => {
      const difference = +new Date(targetDate) - +new Date();
      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    };

    setTimeLeft(calculateTimeLeft());
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  if (!mounted) {
    return (
      <div className="w-full max-w-lg">
        <div className="mb-2">
          <p className="text-xs sm:text-sm font-semibold text-[#4DA3FF] tracking-wide flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#4DA3FF] shrink-0" />
            <span>{countdownText}</span>
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium mb-3">
          <Clock className="w-3.5 h-3.5 text-[#4DA3FF]" />
          <span>Etkinliğe Kalan Süre</span>
        </div>
        <div className="grid grid-cols-4 gap-2 sm:gap-3 w-full max-w-md">
          {['Gün', 'Saat', 'Dakika', 'Saniye'].map((label, idx) => (
            <CartoucheCard key={idx} value="--" label={label} />
          ))}
        </div>
      </div>
    );
  }

  const items = [
    { label: 'Gün', value: timeLeft.days },
    { label: 'Saat', value: timeLeft.hours },
    { label: 'Dakika', value: timeLeft.minutes },
    { label: 'Saniye', value: timeLeft.seconds },
  ];

  return (
    <div className="w-full max-w-lg">
      {/* Announcement text requested by user */}
      <div className="mb-2.5">
        <p className="text-xs sm:text-sm font-semibold text-[#4DA3FF] tracking-wide flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#4DA3FF] shrink-0" />
          <span>{countdownText}</span>
        </p>
      </div>

      {/* Title with clock icon */}
      <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium mb-3">
        <Clock className="w-3.5 h-3.5 text-[#4DA3FF]" />
        <span>Etkinliğe Kalan Süre</span>
      </div>

      {/* 4 Ornate Cartouche Cards (matching reference) */}
      <div className="grid grid-cols-4 gap-2 sm:gap-3 w-full max-w-md">
        {items.map((item, idx) => (
          <CartoucheCard key={idx} value={item.value} label={item.label} />
        ))}
      </div>
    </div>
  );
}
