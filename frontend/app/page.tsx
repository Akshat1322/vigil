import Link from 'next/link';

export default function Home() {
  return (
    <div className="bg-black min-h-screen p-3 md:p-6 flex flex-col font-sans">
      
      {/* Massive rounded inner container */}
      <main className="flex-grow rounded-[2rem] border border-[#1c1c1c] bg-[#050505] relative overflow-hidden flex flex-col min-h-[calc(100vh-8rem)]">
        
        {/* Background Orbs & Stars */}
        <div className="orb-container">
          <div className="stars"></div>
          <div className="orb orb-1"></div>
          <div className="orb orb-2"></div>
        </div>

        {/* Floating Animated Models (Nodes) */}
        <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden hidden md:block">
           {/* GPT-4o Node (Slides right) */}
           <div className="absolute top-[35%] left-0 flex items-center gap-3" style={{ animation: 'slideInRight 22s linear infinite' }}>
             <div className="w-16 h-[1px] bg-gradient-to-r from-transparent to-[#34d399]/40"></div>
             <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-[#111111] border border-[#1c1c1c] flex items-center justify-center shadow-[0_0_20px_rgba(52,211,153,0.15)] relative">
                  <div className="absolute inset-0 rounded-full border border-[#34d399]/30 blur-[2px]"></div>
                  <span className="text-[#34d399] font-bold text-sm tracking-tighter">OAI</span>
                </div>
                <span className="text-sm text-[#f5f5f5] mt-3 font-medium">gpt-4o</span>
                <span className="text-[0.65rem] text-[#737373] mt-0.5 tracking-widest uppercase">94.0 BSI</span>
             </div>
             <div className="w-48 h-[1px] bg-gradient-to-l from-transparent to-[#34d399]/40 transform -rotate-12 origin-left ml-2"></div>
           </div>

           {/* Claude 3.5 Node (Slides left) */}
           <div className="absolute top-[60%] right-0 flex items-center gap-3 flex-row-reverse" style={{ animation: 'slideInLeft 25s linear infinite 8s', opacity: 0 }}>
             <div className="w-16 h-[1px] bg-gradient-to-l from-transparent to-[#34d399]/40"></div>
             <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-[#111111] border border-[#1c1c1c] flex items-center justify-center shadow-[0_0_20px_rgba(52,211,153,0.15)] relative">
                  <div className="absolute inset-0 rounded-full border border-[#34d399]/30 blur-[2px]"></div>
                  <span className="text-[#34d399] font-bold text-sm tracking-tighter">ANT</span>
                </div>
                <span className="text-sm text-[#f5f5f5] mt-3 font-medium">claude-3.5</span>
                <span className="text-[0.65rem] text-[#737373] mt-0.5 tracking-widest uppercase">98.0 BSI</span>
             </div>
             <div className="w-48 h-[1px] bg-gradient-to-r from-transparent to-[#34d399]/40 transform rotate-12 origin-right mr-2"></div>
           </div>

           {/* Gemini Node (Slides right, higher up) */}
           <div className="absolute top-[15%] left-0 flex items-center gap-3" style={{ animation: 'slideInRight 28s linear infinite 14s', opacity: 0 }}>
             <div className="w-10 h-[1px] bg-gradient-to-r from-transparent to-[#34d399]/40"></div>
             <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-[#111111] border border-[#1c1c1c] flex items-center justify-center relative">
                  <span className="text-[#34d399] font-bold text-xs tracking-tighter">GGL</span>
                </div>
                <span className="text-xs text-[#f5f5f5] mt-2 font-medium">gemini-1.5</span>
             </div>
             <div className="w-32 h-[1px] bg-gradient-to-l from-transparent to-[#34d399]/40 transform -rotate-[25deg] origin-left ml-2"></div>
           </div>
        </div>

        {/* Central Content */}
        <section className="relative z-20 flex-grow flex flex-col items-center justify-center text-center px-4 md:px-6 pt-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#1c1c1c] bg-[#111111]/80 backdrop-blur-md mb-8">
            <div className="w-2 h-2 rounded-full bg-[#34d399] animate-pulse"></div>
            <span className="text-xs text-[#d1d5db] font-medium tracking-wide">Automated AI Model Defense</span>
            <span className="text-[#737373] ml-1">→</span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#f5f5f5] tracking-tight mb-6 max-w-4xl" style={{ textShadow: '0 0 40px rgba(255,255,255,0.1)' }}>
            One-click for <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#ffffff] to-[#737373]">Model Defense</span>
          </h1>

          <p className="text-[#9ca3af] text-lg md:text-xl max-w-2xl mb-10 leading-relaxed font-light">
            LLM providers update their models silently. Vigil runs 100 behavioral checks weekly and alerts you the moment something shifts.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
             <Link href="/dashboard" className="px-8 py-3 rounded-full bg-[#111111] border border-[#2a2a2a] text-[#f5f5f5] text-sm font-medium hover:bg-[#1a1a1a] hover:border-[#404040] transition-all flex items-center gap-2">
               Open App <span className="text-[#737373]">↗</span>
             </Link>
             <button className="px-8 py-3 rounded-full bg-[#f5f5f5] text-[#000] text-sm font-medium hover:bg-[#e5e5e5] transition-all">
               Discover More
             </button>
          </div>
        </section>

        {/* Bottom UI Elements */}
        <div className="absolute bottom-6 w-full px-6 md:px-10 flex justify-between items-end z-20 pointer-events-none">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full border border-[#2a2a2a] bg-[#111111]/80 backdrop-blur-md flex items-center justify-center text-[#f5f5f5] text-sm">
               ↓
             </div>
             <span className="text-xs text-[#737373] font-medium tracking-wide">01/03 . Scroll down</span>
          </div>
          
          <div className="text-right flex flex-col items-end gap-3 hidden sm:flex">
             <span className="text-[#a1a1a1] text-xs font-medium tracking-wide">Monitoring horizons</span>
             <div className="flex gap-2">
               <div className="w-6 h-1 bg-[#f5f5f5] rounded-full"></div>
               <div className="w-6 h-1 bg-[#1c1c1c] rounded-full"></div>
               <div className="w-6 h-1 bg-[#1c1c1c] rounded-full"></div>
             </div>
          </div>
        </div>

      </main>

      {/* Marquee Ticker (Outside the rounded container) */}
      <div className="w-full bg-black pt-8 pb-4 marquee-container mt-auto">
         <div className="marquee-content opacity-50">
            {/* Tech Stack & LLMs */}
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-sm bg-[#34d399]/20 flex items-center justify-center"><span className="text-[10px] text-[#34d399]">▲</span></div>
              <span className="text-[#737373] font-bold tracking-widest text-sm uppercase">Vercel</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-lg text-[#737373]">✻</span>
              <span className="text-[#737373] font-bold tracking-widest text-sm uppercase">OpenAI</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-lg text-[#737373]">✤</span>
              <span className="text-[#737373] font-bold tracking-widest text-sm uppercase">Anthropic</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-lg text-[#737373]">∞</span>
              <span className="text-[#737373] font-bold tracking-widest text-sm uppercase">Meta</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-lg text-[#737373]">❖</span>
              <span className="text-[#737373] font-bold tracking-widest text-sm uppercase">Google</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-lg text-[#737373]">◈</span>
              <span className="text-[#737373] font-bold tracking-widest text-sm uppercase">Mistral</span>
            </div>

            {/* Duplicates for smooth loop */}
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-sm bg-[#34d399]/20 flex items-center justify-center"><span className="text-[10px] text-[#34d399]">▲</span></div>
              <span className="text-[#737373] font-bold tracking-widest text-sm uppercase">Vercel</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-lg text-[#737373]">✻</span>
              <span className="text-[#737373] font-bold tracking-widest text-sm uppercase">OpenAI</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-lg text-[#737373]">✤</span>
              <span className="text-[#737373] font-bold tracking-widest text-sm uppercase">Anthropic</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-lg text-[#737373]">∞</span>
              <span className="text-[#737373] font-bold tracking-widest text-sm uppercase">Meta</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-lg text-[#737373]">❖</span>
              <span className="text-[#737373] font-bold tracking-widest text-sm uppercase">Google</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-lg text-[#737373]">◈</span>
              <span className="text-[#737373] font-bold tracking-widest text-sm uppercase">Mistral</span>
            </div>
         </div>
      </div>
    </div>
  );
}
