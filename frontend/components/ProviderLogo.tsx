"use client";

import React, { useState } from 'react';

interface ProviderLogoProps {
  provider: string;
  displayName: string;
  displayShort: string;
}

export default function ProviderLogo({ provider, displayName, displayShort }: ProviderLogoProps) {
  const [hasError, setHasError] = useState(false);

  // Custom SVG for OpenAI
  if (provider === 'openai') {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 opacity-90 transition-opacity group-hover:opacity-100 text-[#f5f5f5]">
        <path d="M22.28 11.23a8.3 8.3 0 0 0-.25-2.07 8.37 8.37 0 0 0-4.04-5.32 8.36 8.36 0 0 0-6.17-.67 8.37 8.37 0 0 0-4.57 3.51 8.31 8.31 0 0 0-1.72-1.12 8.35 8.35 0 0 0-6.66 1.05 8.37 8.37 0 0 0-3.32 5.8 8.31 8.31 0 0 0 .25 2.07 8.37 8.37 0 0 0 4.04 5.32 8.36 8.36 0 0 0 6.17.67 8.37 8.37 0 0 0 4.57-3.51 8.31 8.31 0 0 0 1.72 1.12 8.35 8.35 0 0 0 6.66-1.05 8.37 8.37 0 0 0 3.32-5.8zm-1.89-1.24a6.45 6.45 0 0 1-1.1 2.37l-5.32-3.07a1.04 1.04 0 0 0-1.05 0l-4.78 2.76v-5.26a1.05 1.05 0 0 0-.53-.9l-3.36-1.94A6.47 6.47 0 0 1 7.37 3.3c.31-.02.62.01.93.08a6.45 6.45 0 0 1 2.22 1l5.32 3.07v5.26l4.78-2.76.01-.01v-3.76a6.47 6.47 0 0 1 2.5-3.06 6.45 6.45 0 0 1 .1 5.4l-2.84 1.41zm-4.3 6.67a6.45 6.45 0 0 1-2.37-1.1l3.07-5.32c.26-.45.26-1 0-1.45l-2.76-4.78 4.56-2.63a1.05 1.05 0 0 0 .53-.9v-3.88a6.47 6.47 0 0 1 4.56.27 6.45 6.45 0 0 1 2.21 4.84l-2.84 1.41-5.32-3.07-2.76 4.78h7.51c.52 0 .99.27 1.25.72l1.88 3.26a6.47 6.47 0 0 1-1.03 5.43 6.45 6.45 0 0 1-3.5 2.58l-1.99-1.15zM7.56 16.79a6.45 6.45 0 0 1 1.1-2.37l5.32 3.07a1.04 1.04 0 0 0 1.05 0l4.78-2.76v5.26c0 .37-.2.71-.53.9l-3.36 1.94a6.47 6.47 0 0 1-5.61.1 6.45 6.45 0 0 1-2.22-1l-5.32-3.07v-5.26l-4.78 2.76v3.76a6.47 6.47 0 0 1-2.5 3.06 6.45 6.45 0 0 1-.1-5.4l2.84-1.41zm4.3-6.67a6.45 6.45 0 0 1 2.37 1.1l-3.07 5.32c-.26.45-.26 1 0 1.45l2.76 4.78-4.56 2.63a1.05 1.05 0 0 0-.53.9v3.88A6.47 6.47 0 0 1 4.27 21 6.45 6.45 0 0 1 2.06 16.16l2.84-1.41 5.32 3.07 2.76-4.78H5.47a1.05 1.05 0 0 1-1.05-.72L2.54 9.06A6.47 6.47 0 0 1 3.57 3.63a6.45 6.45 0 0 1 3.5-2.58l1.99 1.15zm2.93-2.12l-2.79-4.83a6.45 6.45 0 0 1 2.37-1.1 6.47 6.47 0 0 1 4.67 1.34l-2.84 1.64v6.14l-2.76 4.78-4.78-2.76h5.52a1.05 1.05 0 0 0 1.05-.72L15.34 9l-.55-1zm-6.58 4l2.79 4.83a6.45 6.45 0 0 1-2.37 1.1A6.47 6.47 0 0 1 3.54 14.5l2.84-1.64V6.72l2.76-4.78 4.78 2.76H8.4a1.05 1.05 0 0 0-1.05.72l-1.88 3.26.55 1z"/>
      </svg>
    );
  }

  // Custom SVG for Groq
  if (provider === 'groq') {
    return (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 opacity-90 transition-opacity group-hover:opacity-100 text-[#f97316]">
        <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="10" />
        <path d="M50 5 L50 40 M50 95 L50 60 M5 50 L40 50 M95 50 L60 50" stroke="currentColor" strokeWidth="10" strokeLinecap="round" />
        <circle cx="50" cy="50" r="15" fill="currentColor" />
      </svg>
    );
  }

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
