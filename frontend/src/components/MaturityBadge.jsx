import { calcOverallMaturity } from '../data/questions';

export default function MaturityBadge({ score, size = 'md' }) {
  const { level, color } = calcOverallMaturity(score);

  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2 font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${sizes[size]}`}
      style={{ backgroundColor: color + '22', color, border: `1px solid ${color}55` }}
    >
      <span
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: color }}
      />
      {level}
    </span>
  );
}
