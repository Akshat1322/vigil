export default function VigilLogo({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="featherGradient" x1="20" y1="20" x2="80" y2="80" gradientUnits="userSpaceOnUse">
          <stop stopColor="currentColor" stopOpacity="1" />
          <stop offset="0.5" stopColor="currentColor" stopOpacity="0.8" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0.4" />
        </linearGradient>
        <linearGradient id="lineGradient" x1="20" y1="85" x2="90" y2="85" gradientUnits="userSpaceOnUse">
          <stop stopColor="currentColor" stopOpacity="1" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* The swooping ink line at the bottom */}
      <path 
        d="M 22 75 C 10 90, 40 100, 50 85 C 60 70, 85 90, 95 80" 
        stroke="url(#lineGradient)" 
        strokeWidth="3" 
        strokeLinecap="round" 
        fill="none" 
        className="animate-pulse"
        style={{ animationDuration: '3s' }}
      />

      {/* The central shaft (rachis) of the feather */}
      <path 
        d="M 80 15 C 60 30, 40 50, 22 75" 
        stroke="currentColor" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        fill="none" 
      />

      {/* Detailed feather barbs - Right side */}
      <path 
        d="M 75 19 Q 85 25 88 35 Q 80 40 70 38 M 65 30 Q 80 35 83 45 Q 75 50 60 45 M 55 41 Q 65 50 62 60 Q 55 60 45 55 M 40 50 Q 50 60 45 68 Q 40 68 32 62" 
        stroke="url(#featherGradient)" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        fill="none" 
      />

      {/* Detailed feather barbs - Left side */}
      <path 
        d="M 78 18 Q 70 15 60 18 Q 65 25 72 24 M 68 28 Q 55 25 45 32 Q 55 38 62 35 M 58 40 Q 40 40 32 50 Q 45 52 50 48 M 48 51 Q 35 55 28 65 Q 35 65 40 58" 
        stroke="url(#featherGradient)" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        fill="none" 
      />

      {/* Extra detail lines to give it that "wow" texture */}
      <path
        d="M 72 25 L 82 32 M 62 36 L 75 42 M 52 46 L 60 55 M 38 56 L 42 63 M 65 21 L 55 24 M 55 31 L 44 35"
        stroke="currentColor"
        strokeWidth="0.75"
        strokeOpacity="0.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
