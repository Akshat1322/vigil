import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      
      {/* Animated grid background (Fixed to cover whole page) */}
      <div className="grid-container" aria-hidden="true">
        <div className="plane">
          <div className="grid"></div>
          <div className="glow"></div>
        </div>
        <div className="plane">
          <div className="grid"></div>
          <div className="glow"></div>
        </div>
      </div>

      {/* SECTION 1 — HERO */}
      <section 
        style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}
        className="flex flex-col items-center justify-center"
      >
        {/* Content above the grid */}
        <div style={{ position: 'relative', zIndex: 10 }}
             className="text-center px-6 max-w-4xl mx-auto">
          
          {/* Small label */}
          <p style={{ 
            fontFamily: "inherit",
            color: '#34d399',
            fontSize: '0.75rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            marginBottom: '2rem',
            opacity: 0.8
          }}>
            AI MODEL MONITORING
          </p>

          {/* Main headline */}
          <h1 style={{
            fontFamily: "inherit",
            color: '#f5f5f5',
            fontSize: 'clamp(2rem, 5vw, 4rem)',
            lineHeight: 1.2,
            fontWeight: 400,
            marginBottom: '0',
            filter: 'drop-shadow(0 0 20px rgba(52, 211, 153, 0.3))'
          }}>
            Know when your AI changes.
            <br />
            <span 
              style={{ color: '#34d399' }}
              className="vigil-cursor"
            >
              Before your users do
            </span>
          </h1>

          {/* Subheadline */}
          <p style={{
            color: '#9ca3af',
            fontSize: '1.125rem',
            maxWidth: '36rem',
            margin: '2.5rem auto 0',
            lineHeight: 1.7,
            fontFamily: 'system-ui, sans-serif'
          }}>
            LLM providers update their models silently. 
            Vigil runs 100 behavioral checks weekly and 
            alerts you the moment something shifts.
          </p>

          {/* CTA buttons */}
          <div style={{ 
            marginTop: '3rem',
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <Link href="/dashboard" style={{
              background: '#34d399',
              color: '#000',
              fontFamily: "inherit",
              fontWeight: 600,
              padding: '0.875rem 2rem',
              borderRadius: '6px',
              textDecoration: 'none',
              fontSize: '0.875rem',
              letterSpacing: '0.05em',
              transition: 'background 0.2s',
            }}>
              VIEW LIVE DASHBOARD →
            </Link>
          </div>

          {/* Social proof */}
          <p style={{
            marginTop: '3rem',
            color: '#4b5563',
            fontSize: '0.8rem',
            fontFamily: "inherit",
            letterSpacing: '0.05em'
          }}>
            3 models monitored · 300 checks run this week · 
            Updated every Monday
          </p>


        </div>

        {/* Footer */}
        <footer className="absolute bottom-0 left-0 w-full px-4 md:px-6 py-4 flex flex-col sm:flex-row justify-between items-center border-t border-[#1c1c1c] z-20 gap-4 sm:gap-0" style={{ background: 'rgba(10,10,10,0.5)', backdropFilter: 'blur(8px)' }}>
          <div className="flex flex-col text-center sm:text-left">
            <span style={{ fontFamily: "inherit", color: '#34d399', fontSize: '1rem', fontWeight: 600, marginBottom: '0.15rem' }}>
              ✦ Vigil
            </span>
            <span style={{ color: '#404040', fontSize: '0.75rem' }}>
              © 2026 Vigil. Open source.
            </span>
          </div>
          <div className="flex items-center gap-5 text-[#737373]">
            {/* X / Twitter */}
            <a href="#" className="hover:text-[#f5f5f5] transition-colors" aria-label="X">
              <svg viewBox="0 0 24 24" className="w-5 h-5"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill="currentColor"/></svg>
            </a>
            {/* LinkedIn */}
            <a href="#" className="hover:text-[#f5f5f5] transition-colors" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" className="w-5 h-5"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" fill="currentColor"/></svg>
            </a>
            {/* Hashnode */}
            <a href="#" className="hover:text-[#f5f5f5] transition-colors" aria-label="Hashnode">
              <svg viewBox="0 0 24 24" className="w-5 h-5"><path d="M22.351 8.019l-6.37-6.37a5.63 5.63 0 0 0-7.962 0l-6.37 6.37a5.63 5.63 0 0 0 0 7.962l6.37 6.37a5.63 5.63 0 0 0 7.962 0l6.37-6.37a5.63 5.63 0 0 0 0-7.962zM12 15.953a3.953 3.953 0 1 1 0-7.906 3.953 3.953 0 0 1 0 7.906z" fill="currentColor"/></svg>
            </a>
          </div>
        </footer>
      </section>


    </div>
  );
}
