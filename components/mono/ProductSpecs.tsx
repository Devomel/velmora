type Row = { key: string; value: string };

type Props = {
  table1Title: string;
  table1: Row[];
  table2Title: string;
  table2: Row[];
};

export default function ProductSpecs({ table1Title, table1, table2Title, table2 }: Props) {
  const tables = [
    { title: table1Title, rows: table1 },
    { title: table2Title, rows: table2 },
  ];
  return (
    <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-5">
      {tables.map(({ title, rows }) => (
        <div key={title} className="border border-[#E8DDD4] overflow-hidden">
          <div className="bg-[#F5F0EB] px-4 py-3 border-b border-[#E8DDD4]">
            <h3 className="font-semibold text-[#1A1410] text-sm uppercase tracking-wide">{title}</h3>
          </div>
          <table className="w-full">
            <tbody>
              {rows.map(({ key, value }, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-[#FDFAF7]'}>
                  <td className="px-4 py-2.5 text-sm text-[#6B5B4E] font-medium w-1/2 border-b border-[#E8DDD4]">{key}</td>
                  <td className="px-4 py-2.5 text-sm text-[#1A1410] w-1/2 border-b border-[#E8DDD4]">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
