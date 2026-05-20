type StatItem = { value: string; label: string; sub: string };

export default function L1Stats({ items }: { items: StatItem[] }) {
  return (
    <section className="bg-[#991B1B] py-14 px-4">
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-[#B91C1C]">
        {items.map((item, i) => (
          <div key={i} className="text-center px-6 py-4">
            <div className="text-3xl md:text-4xl font-light text-white mb-1">{item.value}</div>
            <div className="text-sm font-medium text-[#FECACA] mb-0.5">{item.label}</div>
            <div className="text-xs text-[#FCA5A5] opacity-70">{item.sub}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
