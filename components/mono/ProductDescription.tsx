type Props = {
  text: string;
};

export default function ProductDescription({ text }: Props) {
  return (
    <div className="text-[#6B5B4E] leading-relaxed whitespace-pre-line text-sm md:text-base">
      {text}
    </div>
  );
}
