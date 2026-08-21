type SpecRow = [string, string];

type SpecsData = {
  highlightsLabel: string;
  details: SpecRow[];
  materials: SpecRow[];
  highlights: SpecRow[];
};

type Props = {
  specs: SpecsData;
  contentsLabel: string;
  contents?: string;
  brandLabel: string;
  brandValue: string;
};

function Row({ label, children, alt }: { label: string; children: React.ReactNode; alt: boolean }) {
  return (
    <div className={`flex items-baseline gap-4 px-4 py-3 text-sm ${alt ? 'bg-[#FAF6F1]' : 'bg-white'}`}>
      <span className="text-[#5A4A3D] whitespace-nowrap">{label}</span>
      <span className="flex-1 border-b border-dotted border-[#E8DDD4] translate-y-[-4px]" />
      <span className="text-[#1A1410] font-semibold text-right">{children}</span>
    </div>
  );
}

export default function ProductSpecsList({ specs, contentsLabel, contents, brandLabel, brandValue }: Props) {
  const rows: { key: string; label: string; value: React.ReactNode }[] = [];

  if (contents) rows.push({ key: 'contents', label: contentsLabel, value: contents });
  for (const [k, v] of specs.details) rows.push({ key: k, label: k, value: v });
  for (const [k, v] of specs.materials) rows.push({ key: k, label: k, value: v });
  if (specs.highlights.length > 0) {
    rows.push({
      key: 'highlights',
      label: specs.highlightsLabel,
      value: (
        <span className="font-normal text-left block space-y-0.5">
          {specs.highlights.map(([k]) => (
            <span key={k} className="flex items-center justify-end gap-2 text-[#1A1410] font-semibold">
              {k}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B8F71" strokeWidth="2.5" className="flex-shrink-0">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
          ))}
        </span>
      ),
    });
  }
  rows.push({ key: 'brand', label: brandLabel, value: brandValue });

  return (
    <div className="border border-[#E8DDD4]">
      {rows.map((row, i) => (
        <Row key={row.key} label={row.label} alt={i % 2 === 1}>{row.value}</Row>
      ))}
    </div>
  );
}
