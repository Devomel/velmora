// Renders `**bold**` markdown-style spans inside otherwise plain text.
export default function RichText({ text }: { text: string }) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? <strong key={i} className="text-[#1A1410]">{part}</strong> : part
      )}
    </>
  );
}
