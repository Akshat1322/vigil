import { fetchModels } from '@/lib/api-server';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const COMING_SOON_MODELS = [
  { provider: "OPENAI" },
  { provider: "ANTHROPIC" },
  { provider: "GOOGLE" },
  { provider: "META" },
  { provider: "MISTRAL" }
];

interface ModelSummary {
  model: string
  bsi: number
  status: string
  last_run_timestamp: string
  regression_rate: number
  drifted_count: number
  total_prompts: number
}

// Helper to get a nicely formatted display name and simple SVG logo text
function getProviderDisplay(providerKey: string) {
  const p = providerKey.toLowerCase();
  if (p === 'all') return { name: 'All Models', short: 'ALL' };
  if (p === 'openai') return { name: 'OpenAI', short: 'OAI' };
  if (p === 'anthropic') return { name: 'Anthropic', short: 'ANT' };
  if (p === 'google') return { name: 'Google', short: 'GOO' };
  if (p === 'meta') return { name: 'Meta', short: 'MET' };
  if (p === 'mistral') return { name: 'Mistral', short: 'MST' };
  return { name: providerKey.toUpperCase(), short: providerKey.substring(0, 3).toUpperCase() };
}

export default async function DashboardRootPage() {
  const models = await fetchModels();
  
  // Extract unique providers from active models
  const providerSet = new Set<string>();
  models.forEach((m: ModelSummary) => {
    const parts = m.model.split('/');
    if (parts.length > 1) {
      providerSet.add(parts[0].toLowerCase());
    }
  });

  // Add coming soon providers to the set
  COMING_SOON_MODELS.forEach(cs => {
    providerSet.add(cs.provider.toLowerCase());
  });

  // Convert Set to array and sort it alphabetically
  const providers = Array.from(providerSet).sort();

  // Always put "All" at the very beginning
  const allCards = ['all', ...providers];

  return (
    <div className="min-h-screen bg-black pt-24 pb-16 relative overflow-hidden font-sans">
      {/* Background Fluid Aurora & Stars */}
      <div className="orb-container bg-transparent">
        <div className="stars"></div>
        <div className="aurora-blob aurora-1"></div>
        <div className="aurora-blob aurora-2"></div>
        <div className="aurora-blob aurora-3 opacity-20"></div>
      </div>

      <div className="relative z-10">
        {/* Page header */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 mb-12 flex flex-col items-center justify-center text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-[#f5f5f5] tracking-tight mb-3">Select Provider</h1>
          <p className="text-[#9ca3af] max-w-lg">Choose a provider to view all active model monitoring streams and drift reports.</p>
        </div>

        {/* Provider cards — grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4 md:px-6 max-w-5xl mx-auto">
          
          {allCards.map((provider) => {
            const display = getProviderDisplay(provider);
            const isAll = provider === 'all';
            
            return (
              <Link 
                key={provider} 
                href={`/dashboard/${provider}`} 
                className={`group block relative card-grid-texture border border-[#2a2a2a] bg-[#111111]/60 backdrop-blur-xl shadow-xl rounded-2xl overflow-hidden transition-all duration-300 hover:border-[#34d399] hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(52,211,153,0.15)] flex flex-col items-center justify-center min-h-[160px] ${isAll ? 'border-[#34d399]/40 bg-[#34d399]/5' : ''}`}
              >
                {/* Logo Circle */}
                <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 ${isAll ? 'bg-[#34d399] text-black' : 'bg-[#1c1c1c] text-[#f5f5f5] group-hover:bg-[#1a1a1a]'}`}>
                  {isAll ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                  ) : (
                    <>
                      <img 
                        src={`https://cdn.simpleicons.org/${provider === 'mistral' ? 'scipy' : provider}/f5f5f5`} 
                        alt={`${display.name} logo`}
                        className="w-6 h-6 opacity-90 transition-opacity group-hover:opacity-100"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const nextEl = e.currentTarget.nextElementSibling as HTMLElement;
                          if (nextEl) nextEl.style.display = 'block';
                        }}
                      />
                      <span className="font-bold text-sm tracking-wider" style={{ display: 'none' }}>{display.short}</span>
                    </>
                  )}
                </div>
                
                {/* Provider Name */}
                <span className={`font-semibold tracking-wide ${isAll ? 'text-[#34d399]' : 'text-[#f5f5f5]'}`}>
                  {display.name}
                </span>
                
                {/* Accent line on hover */}
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#34d399] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            );
          })}
          
        </div>
      </div>
    </div>
  );
}
