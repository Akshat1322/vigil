"use client";

import React, { useState } from 'react';

interface ProviderLogoProps {
  provider: string;
  displayName: string;
  displayShort: string;
}

export default function ProviderLogo({ provider, displayName, displayShort }: ProviderLogoProps) {
  const [hasError, setHasError] = useState(false);

  const iconName = provider === 'mistral' ? 'scipy' : provider;
  const logoUrl = `https://cdn.simpleicons.org/${iconName}/f5f5f5`;

  if (hasError) {
    return <span className="font-bold text-sm tracking-wider">{displayShort}</span>;
  }

  return (
    <img 
      src={logoUrl} 
      alt={`${displayName} logo`}
      className="w-6 h-6 opacity-90 transition-opacity group-hover:opacity-100"
      onError={() => setHasError(true)}
    />
  );
}
