interface DescriptionProps {
  content: string;
}

export default function Description({ content }: DescriptionProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-3 text-white">Description</h2>
      <p className="text-base leading-relaxed text-gray-400">
        {content}
      </p>
    </div>
  );
}