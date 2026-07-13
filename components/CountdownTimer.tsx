'use client';

import { useEffect, useState } from 'react';

type Props = {
  label: string;
  hours: string;
  minutes: string;
  seconds: string;
};

// Align to UTC midnight (00:00) — epoch 0 is a UTC midnight, so ceiling to a
// 24h period always lands on the next UTC midnight. Every device computes
// the same end time from the same formula.
const PERIOD_MS = 24 * 60 * 60 * 1000;

function getWindowEnd() {
  const now = Date.now();
  return Math.ceil(now / PERIOD_MS) * PERIOD_MS;
}

function pad(n: number) {
  return String(n).padStart(2, '0');
}

function Segment({ value, unit }: { value: string; unit: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="font-mono font-bold text-lg text-[#C4704F] leading-none">{value}</span>
      <span className="text-[10px] text-[#9C8A7E] mt-0.5 uppercase tracking-wide">{unit}</span>
    </div>
  );
}

function Colon() {
  return <span className="font-mono font-bold text-lg text-[#C4704F]/50 leading-none mb-3">:</span>;
}

export default function CountdownTimer({ label, hours, minutes, seconds }: Props) {
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    const end = getWindowEnd();

    function tick() {
      setRemaining(Math.max(0, end - Date.now()));
    }

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (remaining === null) return null;

  const totalSec = Math.floor(remaining / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;

  return (
    <div className="flex items-center gap-4 mb-6 bg-[#FDF3EE] border border-[#C4704F]/30 px-4 py-3">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#C4704F" strokeWidth="2" className="flex-shrink-0">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
      <span className="text-sm text-[#6B5B4E] flex-1">{label}</span>
      <div className="flex items-end gap-1">
        <Segment value={pad(h)} unit={hours} />
        <Colon />
        <Segment value={pad(m)} unit={minutes} />
        <Colon />
        <Segment value={pad(s)} unit={seconds} />
      </div>
    </div>
  );
}
