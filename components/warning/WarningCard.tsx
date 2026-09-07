import React from 'react';
import CategoryBadge from '../badge/CategoryBadge';

interface WarningCardProps {
  ingredient: string;
  label: string;
  category: string;
  context: string;
  relatedIngredients?: string[];
}

export default function WarningCard({
  ingredient,
  label,
  category,
  context,
  relatedIngredients = [],
}: WarningCardProps) {
  return (
    <div className="bg-soft-cream border border-warm-stone rounded-md p-lg md:p-xl mb-lg">
      <div className="flex items-start justify-between gap-lg mb-md">
        <div>
          <CategoryBadge label={label} category={category} />
          <p className="font-mono text-mono-sm text-text-primary mt-md">
            {ingredient}
          </p>
        </div>
      </div>
      <p className="text-body-md text-text-secondary leading-relaxed mb-lg">
        {context}
      </p>
      {relatedIngredients.length > 0 && (
        <div className="text-body-sm text-text-secondary">
          <p className="font-sans font-500 mb-xs">Related ingredients:</p>
          <ul className="list-disc list-inside space-y-xs">
            {relatedIngredients.map((rel, idx) => (
              <li key={idx} className="font-mono text-mono-sm">
                {rel}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
