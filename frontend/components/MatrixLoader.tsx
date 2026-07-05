import React from 'react';

export default function MatrixLoader() {
  const rows = [1, 2, 3, 4];
  const points = [1, 2, 3, 4];
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full bg-transparent">
      <div className="relative text-center flex flex-col items-center justify-center scale-150">
        {rows.map((row) => (
          <div 
            key={row} 
            className="flex matrix-row"
            style={{ animationDuration: `${(row * 100) + 1000}ms` }}
          >
            {points.map((point) => (
              <div 
                key={point} 
                className="matrix-point"
                style={{ animationDuration: `${(point * 100) + 1000}ms` }}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="mt-12 text-[#34d399] tracking-widest text-[0.65rem] font-bold uppercase animate-pulse opacity-70">
        Fetching Analysis
      </div>
    </div>
  );
}
