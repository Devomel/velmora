'use client';

import { useState } from 'react';

type TabItem = { label: string; content: React.ReactNode; badge?: number };

export default function Tabs({ tabs }: { tabs: TabItem[] }) {
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="flex gap-6 border-b border-[#E8DDD4] mb-6 overflow-x-auto">
        {tabs.map((tab, i) => (
          <button
            key={tab.label}
            onClick={() => setActive(i)}
            className={`flex items-center gap-2 pb-3 text-sm whitespace-nowrap transition-colors border-b-[3px] -mb-px ${
              active === i
                ? 'border-[#C4704F] text-[#1A1410] font-semibold'
                : 'border-transparent text-[#7D6C5E] hover:text-[#5A4A3D]'
            }`}
          >
            {tab.label}
            {!!tab.badge && (
              <span className={`inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[11px] font-semibold ${
                active === i ? 'bg-[#6B8F71] text-white' : 'bg-[#E8DDD4] text-[#5A4A3D]'
              }`}>
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>
      <div>{tabs[active].content}</div>
    </div>
  );
}
