type SpecRow = [string, string];

type SpecsData = {
  detailsLabel: string;
  materialsLabel: string;
  highlightsLabel: string;
  details: SpecRow[];
  materials: SpecRow[];
  highlights: SpecRow[];
};

function SpecTable({ title, rows }: { title: string; rows: SpecRow[] }) {
  return (
    <div className="flex-1 min-w-0">
      <h3 className="text-xs uppercase tracking-widest text-[#9C8A7E] mb-3 font-medium">
        {title}
      </h3>
      <div className="border border-[#E8DDD4] overflow-hidden">
        {rows.map(([key, value], i) => (
          <div
            key={i}
            className={`flex items-baseline gap-3 px-4 py-2.5 text-sm ${
              i % 2 === 0 ? "bg-[#FDFAF7]" : "bg-[#F7F2EC]"
            }`}
          >
            <span className="text-[#9C8A7E] whitespace-nowrap shrink-0 w-[45%] sm:w-auto">
              {key}
            </span>
            <span className="text-[#1A1410] font-light text-right ml-auto">
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ProductSpecsTables({ specs }: { specs: SpecsData }) {
  return (
    <div className="mt-16 pt-10 border-t border-[#E8DDD4]">
      <div className="flex flex-col md:flex-row gap-6">
        <SpecTable title={specs.detailsLabel} rows={specs.details} />
        <SpecTable title={specs.materialsLabel} rows={specs.materials} />
        <SpecTable title={specs.highlightsLabel} rows={specs.highlights} />
      </div>
    </div>
  );
}
