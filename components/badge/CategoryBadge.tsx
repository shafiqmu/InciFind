import React from 'react';

interface CategoryBadgeProps {
  label: string;
  category: string;
  onHover?: () => void;
}

const badgeStyles: Record<string, { bg: string; text: string }> = {
  'alergen-fragrance': { bg: 'bg-badge-fragrance-bg', text: 'text-badge-fragrance-text' },
  'photosensitizer': { bg: 'bg-badge-photo-bg', text: 'text-badge-photo-text' },
  'regulated': { bg: 'bg-badge-regulated-bg', text: 'text-badge-regulated-text' },
  'alcohol-signal': { bg: 'bg-badge-alcohol-bg', text: 'text-badge-alcohol-text' },
};

export default function CategoryBadge({ label, category, onHover }: CategoryBadgeProps) {
  const style = badgeStyles[category] || badgeStyles['regulated'];

  return (
    <span
      className={`inline-block px-md py-xs rounded-subtle text-body-sm font-sans ${style.bg} ${style.text} transition-transform duration-300 hover:shadow-subtle hover:-translate-y-xs cursor-help`}
      onMouseEnter={onHover}
      title={label}
    >
      {label}
    </span>
  );
}
