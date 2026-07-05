import Link from 'next/link';

export default function Home() {
  return (
    <div className="bg-black min-h-screen p-3 md:p-6 flex flex-col font-sans">
      
      {/* Massive rounded inner container */}
      <main className="flex-grow rounded-[2rem] border border-[#1c1c1c] bg-[#050505] relative overflow-hidden flex flex-col min-h-[calc(100vh-8rem)]">
        
        {/* Background Fluid Aurora & Stars */}
        <div className="orb-container bg-[#030303]">
          <div className="stars"></div>
          <div className="aurora-blob aurora-1"></div>
          <div className="aurora-blob aurora-2"></div>
          <div className="aurora-blob aurora-3"></div>
        </div>

        {/* Floating Animated Models (Fixed SVG Paths) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[800px] pointer-events-none z-10 hidden md:block">
          
          {/* The static SVG paths (curves) */}
          <svg viewBox="0 0 1200 800" className="absolute inset-0 w-full h-full opacity-30">
            <path d="M 0 300 C 150 300 250 150 400 150" fill="none" stroke="#0d9488" strokeWidth="1" />
            <path d="M 0 500 C 150 500 250 650 400 650" fill="none" stroke="#0d9488" strokeWidth="1" />
            <path d="M 1200 300 C 1050 300 950 150 800 150" fill="none" stroke="#0d9488" strokeWidth="1" />
            <path d="M 1200 500 C 1050 500 950 650 800 650" fill="none" stroke="#0d9488" strokeWidth="1" />

            {/* Pulsing Light Beams along the paths */}
            <path d="M 0 300 C 150 300 250 150 400 150" fill="none" strokeWidth="1.5" className="light-beam" style={{ animationDuration: '8s', strokeDasharray: '4 600' }} />
            <path d="M 0 500 C 150 500 250 650 400 650" fill="none" strokeWidth="1.5" className="light-beam" style={{ animationDuration: '10s', strokeDasharray: '4 600', animationDelay: '2s' }} />
            <path d="M 1200 300 C 1050 300 950 150 800 150" fill="none" strokeWidth="1.5" className="light-beam" style={{ animationDuration: '9s', strokeDasharray: '4 600', animationDirection: 'reverse' }} />
            <path d="M 1200 500 C 1050 500 950 650 800 650" fill="none" strokeWidth="1.5" className="light-beam" style={{ animationDuration: '11s', strokeDasharray: '4 600', animationDirection: 'reverse', animationDelay: '3s' }} />
          </svg>

          {/* The animated nodes */}
          {[
            { id: 1, name: 'gpt-4o', org: 'OAI', bsi: '94.0', path: 'node-path-1', delay: '0s' },
            { id: 2, name: 'gpt-4-turbo', org: 'OAI', bsi: '89.5', path: 'node-path-1', delay: '-6.6s' },
            { id: 3, name: 'mixtral-8x7b', org: 'MST', bsi: '91.0', path: 'node-path-1', delay: '-13.3s' },
            { id: 4, name: 'claude-3.5-sonnet', org: 'ANT', bsi: '98.0', path: 'node-path-2', delay: '0s' },
            { id: 5, name: 'claude-3-opus', org: 'ANT', bsi: '95.0', path: 'node-path-2', delay: '-11s' },
            { id: 6, name: 'gemini-1.5-pro', org: 'GGL', bsi: '93.0', path: 'node-path-3', delay: '0s' },
            { id: 7, name: 'gemini-1.5-flash', org: 'GGL', bsi: '97.0', path: 'node-path-3', delay: '-12s' },
            { id: 8, name: 'llama-3.1-70b', org: 'META', bsi: '90.0', path: 'node-path-4', delay: '0s' },
            { id: 9, name: 'mistral-large', org: 'MST', bsi: '92.0', path: 'node-path-4', delay: '-8.6s' },
            { id: 10, name: 'cohere-command-r', org: 'COH', bsi: '88.0', path: 'node-path-4', delay: '-17.3s' },
          ].map(node => (
             <div key={node.id} className={`${node.path} flex flex-col items-center justify-center w-[60px] h-[60px] group cursor-pointer pointer-events-auto`} style={{ animationDelay: node.delay }}>
                <div className="absolute top-[60px] whitespace-nowrap text-left left-[30px] md:left-[10px] transition-transform duration-300 group-hover:translate-x-2">
                   <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 bg-[#f5f5f5] rounded-full shadow-[0_0_5px_rgba(255,255,255,0.8)] group-hover:bg-[#34d399] transition-colors"></div>
                      <span className="text-[#f5f5f5] font-medium text-sm drop-shadow-md group-hover:text-[#34d399] transition-colors">{node.name}</span>
                   </div>
                   <div className="text-[#737373] text-[0.65rem] ml-3 tracking-wider uppercase mt-0.5">{node.bsi} BSI</div>
                </div>
                <div className="w-10 h-10 rounded-full bg-[#111111] border border-[#2a2a2a] flex items-center justify-center relative shadow-[0_0_20px_rgba(13,148,136,0.1)] transition-all duration-300 group-hover:scale-110 group-hover:border-[#34d399] group-hover:shadow-[0_0_30px_rgba(52,211,153,0.4)]">
                   <div className="absolute inset-0 rounded-full border border-[#34d399] node-ripple group-hover:opacity-100"></div>
                   <div className="absolute inset-0 rounded-full border border-[#0d9488]/40 blur-[1px]"></div>
                   <span className="text-[#34d399] font-bold text-xs tracking-tighter">{node.org}</span>
                </div>
             </div>
          ))}
        </div>

        {/* Central Content */}
        <section className="relative z-20 flex-grow flex flex-col items-center justify-center text-center px-4 md:px-6 pt-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#1c1c1c] bg-[#111111]/80 backdrop-blur-md mb-8">
            <div className="w-2 h-2 rounded-full bg-[#34d399] animate-pulse"></div>
            <span className="text-xs text-[#d1d5db] font-medium tracking-wide">Continuous API Drift Detection</span>
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
          </div>
        </section>

        {/* Bottom UI Elements */}
        <div className="absolute bottom-6 w-full px-6 md:px-10 flex justify-between items-end z-20 pointer-events-auto">
          {/* Bottom Left: Vigil & Copyright */}
          <div className="flex flex-col gap-1 text-left">
             <span className="text-sm text-[#f5f5f5] font-semibold tracking-wide">Vigil</span>
             <span className="text-xs text-[#737373] font-medium tracking-wide">© 2026 Vigil. Open source.</span>
          </div>
          
          {/* Bottom Right: Social Logos */}
          <div className="text-right flex items-center gap-4 hidden sm:flex">
             <a href="https://x.com/Akshat1322" target="_blank" rel="noopener noreferrer" className="text-[#737373] hover:text-[#f5f5f5] transition-colors" aria-label="X">
               <svg viewBox="0 0 24 24" className="w-4 h-4"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill="currentColor"/></svg>
             </a>
             <a href="https://www.linkedin.com/in/akshat-sharma1322/" target="_blank" rel="noopener noreferrer" className="text-[#737373] hover:text-[#f5f5f5] transition-colors" aria-label="LinkedIn">
               <svg viewBox="0 0 24 24" className="w-4 h-4"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" fill="currentColor"/></svg>
             </a>
             <a href="#" className="text-[#737373] hover:text-[#f5f5f5] transition-colors" aria-label="Hashnode">
               <svg viewBox="0 0 24 24" className="w-4 h-4"><path d="M22.351 8.019l-6.37-6.37a5.63 5.63 0 0 0-7.962 0l-6.37 6.37a5.63 5.63 0 0 0 0 7.962l6.37 6.37a5.63 5.63 0 0 0 7.962 0l6.37-6.37a5.63 5.63 0 0 0 0-7.962zM12 15.953a3.953 3.953 0 1 1 0-7.906 3.953 3.953 0 0 1 0 7.906z" fill="currentColor"/></svg>
             </a>
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
