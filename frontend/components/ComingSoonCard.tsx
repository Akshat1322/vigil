interface ComingSoonCardProps {
  provider: string
  model: string
  fakeData: {
    checks_passed: number
    total: number
    last_checked: string
    this_week: string
    bsi: number
    status: string
  }
}

export default function ComingSoonCard({ provider, model, fakeData }: ComingSoonCardProps) {
  return (
    <div className="relative card-grid-texture border border-[#2a2a2a] bg-[#111111]/60 backdrop-blur-xl shadow-xl rounded-xl overflow-hidden min-h-[280px]">

      {/* LEFT ACCENT BAR — gray for coming soon */}
      <div style={{
        position: 'absolute',
        left: 0, top: 0, bottom: 0,
        width: '3px',
        background: '#2a2a2a',
        borderRadius: '3px 0 0 3px'
      }} />

      {/* Provider banner + Model name — top of card, NOT blurred */}
      <div 
        className="px-4 md:px-[24px] py-[10px]"
        style={{
          borderBottom: '1px solid #1c1c1c',
          background: 'rgba(17,17,17,0.6)',
          position: 'relative',
          zIndex: 11,
      }}>
        <span style={{
          fontSize: '0.7rem',
          fontWeight: 700,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'rgba(52,211,153,0.5)',
        }}>
          {provider}
        </span>
        <div style={{
          fontSize: '1rem',
          fontWeight: 400,
          color: '#a1a1a1',
          marginTop: '4px',
        }}>
          {model}
        </div>
      </div>

      {/* FAKE DATA LAYER — blurred underneath */}
      <div 
        className="px-4 md:px-[24px] py-[20px]"
        style={{
          filter: 'blur(4px)',
          userSelect: 'none',
          pointerEvents: 'none',
          opacity: 0.6
      }}>
        {/* Row 1 — provider + model + fake badge */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start'
        }}>
          <div>
            <div style={{
              fontSize: '0.65rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#34d399',
              opacity: 0.5,
            }}>
              {provider}
            </div>
            <div style={{
              fontSize: '1.1rem',
              fontWeight: 500,
              color: '#f5f5f5',
              marginTop: '2px',
            }}>
              {model}
            </div>
          </div>
          {/* Fake status badge */}
          <div style={{
            background: 'rgba(52,211,153,0.1)',
            border: '1px solid rgba(52,211,153,0.2)',
            borderRadius: '999px',
            padding: '4px 12px',
            fontSize: '0.75rem',
            color: '#34d399',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <div style={{
              width: '6px', height: '6px',
              borderRadius: '50%',
              background: '#34d399'
            }} />
            All clear
          </div>
        </div>

        {/* Divider */}
        <div style={{
          borderTop: '1px solid #1c1c1c',
          margin: '16px 0'
        }} />

        {/* Row 2 — fake stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '0',
        }}>
          {/* Checks passed */}
          <div style={{ paddingRight: '16px',
                        borderRight: '1px solid #1c1c1c' }}>
            <div style={{ fontSize: '0.7rem', 
                          color: '#737373', 
                          marginBottom: '8px' }}>
              Checks passed
            </div>
            <div>
              <span style={{ fontSize: '1.5rem', 
                             fontWeight: 600, 
                             color: '#f5f5f5' }}>
                {fakeData.checks_passed}
              </span>
              <span style={{ fontSize: '0.875rem', 
                             color: '#404040',
                             marginLeft: '4px' }}>
                of {fakeData.total}
              </span>
            </div>
            {/* Fake progress bar */}
            <div style={{
              height: '2px',
              background: '#1c1c1c',
              borderRadius: '2px',
              marginTop: '8px',
              overflow: 'hidden'
            }}>
              <div style={{
                height: '100%',
                width: `${fakeData.checks_passed}%`,
                background: '#34d399',
                borderRadius: '2px'
              }} />
            </div>
          </div>

          {/* Last checked */}
          <div style={{ padding: '0 16px',
                        borderRight: '1px solid #1c1c1c' }}>
            <div style={{ fontSize: '0.7rem', 
                          color: '#737373', 
                          marginBottom: '8px' }}>
              Last checked
            </div>
            <div style={{ fontSize: '1rem', 
                          fontWeight: 500, 
                          color: '#f5f5f5' }}>
              2 hours ago
            </div>
            <div style={{ fontSize: '0.7rem', 
                          color: '#404040', 
                          marginTop: '2px' }}>
              on Jul 5, 9:00 AM
            </div>
          </div>

          {/* This week */}
          <div style={{ paddingLeft: '16px' }}>
            <div style={{ fontSize: '0.7rem', 
                          color: '#737373', 
                          marginBottom: '8px' }}>
              This week
            </div>
            <div style={{ fontSize: '1rem', 
                          fontWeight: 500, 
                          color: '#34d399' }}>
              Stable
            </div>
            <div style={{ fontSize: '0.7rem', 
                          color: '#404040', 
                          marginTop: '2px' }}>
              ✓ No changes
            </div>
          </div>
        </div>
      </div>

      {/* COMING SOON OVERLAY — on top of blurred content */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(10,10,10,0.45)',
        backdropFilter: 'blur(2px)',
        zIndex: 10
      }}>

        {/* COMING SOON badge */}
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '6px',
          padding: '8px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          {/* Pulsing dot */}
          <div style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: '#737373',
            animation: 'pulse 2s infinite'
          }} />
          <span style={{
            fontSize: '0.75rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#737373'
          }}>
            Coming Soon
          </span>
        </div>

        {/* Subtle hint below — shimmer torch effect */}
        <div 
          className="shimmer-text"
          style={{
            marginTop: '8px',
            fontSize: '0.7rem',
            fontFamily: 'system-ui, sans-serif',
            letterSpacing: '0.05em'
          }}
        >
          Monitoring integration in progress
        </div>
      </div>

    </div>
  );
}
