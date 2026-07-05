import Image from 'next/image';

export default function VigilLogo({ className = "w-[120px] h-[36px]" }: { className?: string }) {
  return (
    <div 
      className={`relative flex items-center justify-center overflow-visible ${className}`} 
      style={{ 
        // 1. invert(1) turns the black drawing into white.
        // 2. sepia/hue-rotate/saturate turns the white into our neon emerald green!
        // 3. drop-shadow makes it glow.
        filter: 'invert(1) sepia(1) hue-rotate(100deg) saturate(500%) brightness(1.2) drop-shadow(0 0 6px rgba(52, 211, 153, 0.6))',
        mixBlendMode: 'screen' // Makes any black background completely transparent!
      }}
    >
      <Image 
        src="/lighthouse_vector.png" 
        alt="Vigil Logo" 
        fill
        className="object-contain"
        sizes="(max-width: 768px) 100vw, 120px"
      />
    </div>
  );
}
