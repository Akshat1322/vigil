import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* SECTION 1 — HERO */}
      <section 
        style={{ background: '#000', position: 'relative', 
                 minHeight: '100vh', overflow: 'hidden' }}
        className="flex flex-col items-center justify-center"
      >
        {/* Animated grid background */}
        <div className="grid-container grid-fade" 
             aria-hidden="true">
          <div className="plane">
            <div className="grid"></div>
            <div className="glow"></div>
          </div>
          <div className="plane">
            <div className="grid"></div>
            <div className="glow"></div>
          </div>
        </div>

        {/* Content above the grid */}
        <div style={{ position: 'relative', zIndex: 10 }}
             className="text-center px-6 max-w-4xl mx-auto">
          
          {/* Small label */}
          <p style={{ 
            fontFamily: "'Share Tech Mono', monospace",
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
            fontFamily: "'Share Tech Mono', monospace",
            color: '#ffffff',
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
              fontFamily: "'Share Tech Mono', monospace",
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

            <a href="#how-it-works" style={{
              border: '1px solid rgba(52, 211, 153, 0.3)',
              color: '#9ca3af',
              fontFamily: 'system-ui, sans-serif',
              padding: '0.875rem 2rem',
              borderRadius: '6px',
              textDecoration: 'none',
              fontSize: '0.875rem',
              transition: 'all 0.2s',
              background: 'rgba(52, 211, 153, 0.05)'
            }}>
              See how it works ↓
            </a>
          </div>

          {/* Social proof */}
          <p style={{
            marginTop: '3rem',
            color: '#4b5563',
            fontSize: '0.8rem',
            fontFamily: "'Share Tech Mono', monospace",
            letterSpacing: '0.05em'
          }}>
            3 models monitored · 300 checks run this week · 
            Updated every Monday
          </p>
        </div>
      </section>

      {/* SECTION 2 — PROBLEM */}
      <section 
        id="how-it-works"
        style={{ background: '#ffffff' }}
        className="py-24 px-6"
      >
        <div className="max-w-5xl mx-auto">
          
          <div className="text-center mb-16">
            <h2 style={{
              fontSize: '2rem',
              fontWeight: 700,
              color: '#0f172a',
              marginBottom: '1rem'
            }}>
              The silent problem with LLM APIs
            </h2>
            <p style={{ color: '#64748b', fontSize: '1.125rem' }}>
              You didn't change anything. But something changed.
            </p>
          </div>

          {/* Three problem cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: '🔄',
                title: 'Silent model updates',
                body: 'OpenAI, Google, and Anthropic update models under the same API endpoint without announcement.'
              },
              {
                icon: '📉',
                title: 'Behavior shifts go unnoticed',
                body: 'Your JSON format breaks. Your bot sounds different. A safety check stops working. Nobody knows why.'
              },
              {
                icon: '⏰',
                title: 'You find out from users',
                body: 'By the time support tickets arrive, the damage is done. You need to know first.'
              }
            ].map((card) => (
              <div key={card.title} style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '2rem'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>
                  {card.icon}
                </div>
                <h3 style={{
                  fontWeight: 600,
                  color: '#0f172a',
                  marginBottom: '0.75rem',
                  fontSize: '1.05rem'
                }}>
                  {card.title}
                </h3>
                <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  {card.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3 — HOW IT WORKS */}
      <section style={{ background: '#f1f5f9' }} className="py-24 px-6">
        <div className="max-w-2xl mx-auto">
          
          <h2 style={{
            fontSize: '2rem',
            fontWeight: 700,
            color: '#0f172a',
            textAlign: 'center',
            marginBottom: '4rem'
          }}>
            How Vigil works
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            {[
              {
                num: '01',
                title: 'We run 100 behavioral checks weekly',
                body: 'A suite of prompts covering factual accuracy, format adherence, instruction following, and response consistency — run against your model every Monday.'
              },
              {
                num: '02', 
                title: 'Statistical drift detection fires',
                body: 'We use Z-score and Cohen\'s d to separate real behavioral changes from normal random variation. No false alarms.'
              },
              {
                num: '03',
                title: 'You see exactly what changed',
                body: 'The dashboard shows which category drifted, by how much, and when it started — so you can act immediately.'
              }
            ].map((step) => (
              <div key={step.num} style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                <div style={{
                  width: '2.5rem',
                  height: '2.5rem',
                  borderRadius: '50%',
                  background: 'rgba(52, 211, 153, 0.1)',
                  border: '1px solid rgba(52, 211, 153, 0.3)',
                  color: '#34d399',
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {step.num}
                </div>
                <div>
                  <h3 style={{
                    fontWeight: 600,
                    color: '#0f172a',
                    marginBottom: '0.5rem'
                  }}>
                    {step.title}
                  </h3>
                  <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6 }}>
                    {step.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4 — CTA + FOOTER */}
      <section style={{ background: '#000' }} className="py-24 px-6 text-center">
        
        <h2 style={{
          fontFamily: "'Share Tech Mono', monospace",
          color: '#ffffff',
          fontSize: '2rem',
          marginBottom: '1rem',
          fontWeight: 400
        }}>
          See it live
        </h2>
        
        <p style={{ color: '#6b7280', marginBottom: '2.5rem', fontSize: '1rem' }}>
          Real behavioral data from real models, updated every week.
        </p>

        <Link href="/dashboard" style={{
          background: '#34d399',
          color: '#000',
          fontFamily: "'Share Tech Mono', monospace",
          padding: '1rem 2.5rem',
          borderRadius: '6px',
          textDecoration: 'none',
          fontSize: '0.875rem',
          fontWeight: 600,
          letterSpacing: '0.05em',
          display: 'inline-block'
        }}>
          OPEN LIVE DASHBOARD →
        </Link>

        <p style={{
          marginTop: '1.5rem',
          color: '#374151',
          fontSize: '0.8rem',
          fontFamily: "'Share Tech Mono', monospace"
        }}>
          No signup required · Free to use · Open source
        </p>

        {/* Footer */}
        <div style={{
          marginTop: '5rem',
          paddingTop: '2rem',
          borderTop: '1px solid #1f2937',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: '64rem',
          margin: '5rem auto 0'
        }}>
          <div style={{ textAlign: 'left' }}>
            <div style={{
              fontFamily: "'Share Tech Mono', monospace",
              color: '#34d399',
              fontSize: '1rem',
              marginBottom: '0.25rem'
            }}>
              ✦ Vigil
            </div>
            <div style={{ color: '#374151', fontSize: '0.75rem' }}>
              © 2026 Vigil. Open source.
            </div>
          </div>
          <div style={{ display: 'flex', gap: '2rem' }}>
            <Link href="/dashboard" 
                  style={{ color: '#6b7280', fontSize: '0.875rem', textDecoration: 'none' }}>
              Dashboard
            </Link>
            <a href="https://github.com/Akshat1322/vigil" 
               style={{ color: '#6b7280', fontSize: '0.875rem', textDecoration: 'none' }}
               target="_blank">
              GitHub
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
