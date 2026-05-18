type StatItem = { value: string; label: string; sub: string };

export default function L1Stats({ items }: { items: StatItem[] }) {
  return (
    <section className="bg-[#F3EFE5] py-16 px-4">
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        {items.map((item, i) => (
          <div key={i} className="text-center">
            <div className="text-3xl md:text-4xl font-light text-[#1A3D2B] mb-1">{item.value}</div>
            <div className="text-sm font-medium text-[#1A2520] mb-0.5">{item.label}</div>
            <div className="text-xs text-[#6B8070]">{item.sub}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
