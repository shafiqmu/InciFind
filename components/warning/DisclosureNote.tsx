import React from 'react';

interface DisclosureNoteProps {
  ingredient: string;
  disclosure: string;
}

export default function DisclosureNote({ ingredient, disclosure }: DisclosureNoteProps) {
  return (
    <div className="bg-disclosure-bg border border-soft-cream rounded-md p-lg md:p-xl mb-lg">
      <p className="text-body-sm text-disclosure-text font-sans font-500 mb-md">
        Data limitation: {ingredient}
      </p>
      <p className="text-body-md text-disclosure-text leading-relaxed">
        {disclosure}
      </p>
    </div>
  );
}
