import { fetchModels, fetchModelHistory } from '@/lib/api-server';
import SparklineChart from '@/components/SparklineChart';
import ComingSoonCard from '@/components/ComingSoonCard';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const COMING_SOON_MODELS = [
  {
    provider: "OPENAI",
    model: "gpt-4o",
    fakeData: {
      checks_passed: 94,
      total: 100,
      last_checked: "Monitoring soon",
      this_week: "—",
      bsi: 94.0,
      status: "stable"
    }
  },
  {
    provider: "OPENAI",
    model: "gpt-4o-mini",
    fakeData: {
      checks_passed: 91,
      total: 100,
      last_checked: "Monitoring soon",
      this_week: "—",
      bsi: 91.0,
      status: "stable"
    }
  },
  {
    provider: "ANTHROPIC",
    model: "claude-3-5-haiku",
    fakeData: {
      checks_passed: 96,
      total: 100,
      last_checked: "Monitoring soon",
      this_week: "—",
      bsi: 96.0,
      status: "stable"
    }
  },
  {
    provider: "ANTHROPIC",
    model: "claude-3-5-sonnet",
    fakeData: {
      checks_passed: 98,
      total: 100,
      last_checked: "Monitoring soon",
      this_week: "—",
      bsi: 98.0,
      status: "stable"
    }
  },
  {
    provider: "GOOGLE",
    model: "gemini-2.0-flash",
    fakeData: {
      checks_passed: 93,
      total: 100,
      last_checked: "Monitoring soon",
      this_week: "—",
      bsi: 93.0,
      status: "stable"
    }
  },
  {
    provider: "GOOGLE",
    model: "gemini-1.5-pro",
    fakeData: {
      checks_passed: 97,
      total: 100,
      last_checked: "Monitoring soon",
      this_week: "—",
      bsi: 97.0,
      status: "stable"
    }
  },
  {
    provider: "META",
    model: "llama-3.1-70b",
    fakeData: {
      checks_passed: 89,
      total: 100,
      last_checked: "Monitoring soon",
      this_week: "—",
      bsi: 89.0,
      status: "stable"
    }
  },
  {
    provider: "MISTRAL",
    model: "mistral-large",
    fakeData: {
      checks_passed: 92,
      total: 100,
      last_checked: "Monitoring soon",
      this_week: "—",
      bsi: 92.0,
      status: "stable"
    }
  }
];

interface CategoryStatus {
  category: string
  stable_count: number
  total_count: number
  drift_detected: boolean
}

interface ModelSummary {
  model: string
  bsi: number
  status: string
  last_run_timestamp: string
  regression_rate: number
  drifted_count: number
  total_prompts: number
  categories: CategoryStatus[]
}

interface BsiHistoryPoint {
  run_id: string
  timestamp: string
  bsi: number
}

function timeAgo(dateString: string) {
  const date = new Date(dateString);
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval >= 1) return Math.floor(interval) + (Math.floor(interval) === 1 ? " day ago" : " days ago");
  interval = seconds / 3600;
  if (interval >= 1) return Math.floor(interval) + (Math.floor(interval) === 1 ? " hour ago" : " hours ago");
  interval = seconds / 60;
  if (interval >= 1) return Math.floor(interval) + (Math.floor(interval) === 1 ? " minute ago" : " minutes ago");
  return Math.floor(seconds) + " seconds ago";
}

function formatDateFull(dateString: string) {
  const date = new Date(dateString);
  return `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
}

export default async function ProviderPage({ params }: { params: { provider: string } }) {
  const providerParam = params.provider.toLowerCase();
  
  let models = await fetchModels();
  
  // Filter models based on the provider
  if (providerParam !== 'all') {
    models = models.filter((m: ModelSummary) => {
      const parts = m.model.split('/');
      const mProvider = parts.length > 1 ? parts[0] : 'Unknown';
      return mProvider.toLowerCase() === providerParam;
    });
  }
  
  const histories = await Promise.all(
    models.map((m: ModelSummary) => fetchModelHistory(m.model).catch(() => []))
  );

  const totalPrompts = models.reduce((acc: number, m: ModelSummary) => acc + m.total_prompts, 0);

  // Filter coming soon models
  const comingSoon = providerParam === 'all' 
    ? COMING_SOON_MODELS 
    : COMING_SOON_MODELS.filter(cs => cs.provider.toLowerCase() === providerParam);

  const pageTitle = providerParam === 'all' 
    ? "All Models" 
    : `${providerParam.toUpperCase()} Models`;

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
      <div className="max-w-7xl mx-auto px-4 md:px-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 md:gap-0">
        <div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-[#737373] hover:text-[#f5f5f5] transition-colors pb-1">←</Link>
            <h1 className="text-2xl font-semibold text-[#f5f5f5] tracking-tight">{pageTitle}</h1>
          </div>
          <p className="text-sm text-[#737373] mt-1 ml-7">Know the moment your model changes behavior.</p>
        </div>
        <div className="flex flex-wrap gap-2 md:gap-3">
          <div className="bg-[#111111] border border-[#1c1c1c] rounded-full px-3 py-1 text-xs text-[#737373]">
            {models.length} active
          </div>
          <div className="bg-[#111111] border border-[#1c1c1c] rounded-full px-3 py-1 text-xs text-[#737373]">
            {comingSoon.length} coming soon
          </div>
          <div className="bg-[#111111] border border-[#1c1c1c] rounded-full px-3 py-1 text-xs text-[#737373]">
            {totalPrompts} checks
          </div>
          <div className="bg-[#111111] border border-[#1c1c1c] rounded-full px-3 py-1 text-xs text-[#737373]">
            Weekly
          </div>
        </div>
      </div>

      {/* Model cards — 3-column grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-4 md:px-6 max-w-7xl mx-auto">
        {/* Real model cards */}
        {models.map((model: ModelSummary, idx: number) => {
          const history = histories[idx];
          
          const parts = model.model.split('/');
          const provider = parts.length > 1 ? parts[0] : 'Unknown';
          const modelName = parts.length > 1 ? parts.slice(1).join('/') : model.model;
          
          const stableCount = model.total_prompts - model.drifted_count;
          const percentage = Math.round((stableCount / model.total_prompts) * 100);
          
          const STATUS_MAP: Record<string, {color: string, label: string, bg: string}> = {
            stable: { 
              color: "#34d399", 
              bg: "rgba(52,211,153,0.1)",
              label: "All clear",
            },
            watch: { 
              color: "#f59e0b", 
              bg: "rgba(245,158,11,0.1)",
              label: "Changes detected",
            },
            drift: { 
              color: "#f87171", 
              bg: "rgba(248,113,113,0.1)",
              label: "Needs attention",
            },
          };
          const statusKey = model.drifted_count === 0 
            ? 'stable' 
            : (model.status === 'drift' ? 'drift' : 'watch');
          const statusConfig = STATUS_MAP[statusKey];
          const statusColor = statusConfig.color;
          
          return (
            <Link key={model.model} href={`/models/${encodeURIComponent(model.model)}`} className="block relative card-grid-texture border border-[#2a2a2a] bg-[#111111]/60 backdrop-blur-xl shadow-xl rounded-xl overflow-hidden transition-all hover:border-[#404040] hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
              <div 
                className="absolute left-0 top-0 bottom-0 w-[3px]"
                style={{ background: statusColor, borderRadius: '3px 0 0 3px' }}
              ></div>

              {/* Provider banner — top of card */}
              <div 
                className="px-4 md:px-[24px] py-[10px] flex items-center justify-between"
                style={{ borderBottom: '1px solid #1c1c1c', background: 'rgba(17,17,17,0.6)' }}
              >
                <span 
                  className="text-[0.7rem] font-semibold tracking-[0.2em] uppercase"
                  style={{ color: statusColor }}
                >
                  {provider.toUpperCase()}
                </span>
                <div 
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium" 
                  style={{ backgroundColor: statusConfig.bg, borderColor: `${statusColor}33`, borderWidth: '1px', color: statusColor }}
                >
                  <div className={`w-[6px] h-[6px] rounded-full ${model.drifted_count > 0 ? 'animate-pulse' : ''}`} style={{ backgroundColor: statusColor }}></div>
                  {statusConfig.label}
                </div>
              </div>

              <div className="p-[20px] px-4 md:px-[24px]">
                
                {/* Model name */}
                <div className="text-lg font-semibold text-[#f5f5f5]">
                  {modelName}
                </div>

                <div className="border-t border-[#1c1c1c] my-4"></div>

                {/* Row 2: Stats — adapted for card layout (2 cols instead of 4) */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Checks passed */}
                  <div>
                    <div className="text-xs text-[#737373] mb-2">Checks passed</div>
                    <div>
                      <span className="text-2xl font-semibold text-[#f5f5f5] font-sans font-bold">{stableCount}</span>
                      <span className="text-sm text-[#404040] ml-1">of {model.total_prompts}</span>
                    </div>
                    <div className="mt-2 h-[2px] rounded-[2px] bg-[#1c1c1c] w-full overflow-hidden">
                      <div 
                        className="h-full transition-all duration-500 rounded-[2px]" 
                        style={{ backgroundColor: statusColor, width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {/* Last checked */}
                  <div>
                    <div className="text-xs text-[#737373] mb-2">Last checked</div>
                    <div className="text-base font-medium text-[#f5f5f5]">
                      {timeAgo(model.last_run_timestamp)}
                    </div>
                    <div className="text-xs text-[#404040] mt-0.5">
                      {formatDateFull(model.last_run_timestamp)}
                    </div>
                  </div>
                </div>

                {/* Row 3: Status + Sparkline */}
                <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-[#1c1c1c]">
                  {/* This week */}
                  <div>
                    <div className="text-xs text-[#737373] mb-2">This week</div>
                    {model.drifted_count === 0 ? (
                      <>
                        <div className="text-base font-medium text-[#34d399]">Stable</div>
                        <div className="text-xs text-[#404040] mt-0.5">✓ No changes</div>
                      </>
                    ) : (
                      <>
                        <div className={`text-base font-medium ${model.status === 'drift' ? 'text-[#f87171]' : 'text-[#f59e0b]'}`}>
                          {model.drifted_count} changed
                        </div>
                        <div className="text-xs text-[#404040] mt-0.5">
                          ⚠ Review recommended
                        </div>
                      </>
                    )}
                  </div>
                  
                  {/* Stability trend */}
                  <div>
                    <div className="text-xs text-[#737373] mb-2">Stability trend</div>
                    {history && history.length > 0 && (
                      <div className="h-12 w-full">
                        <SparklineChart data={history.slice(-7)} lineColor={statusColor} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}

        {/* Coming Soon cards */}
        {comingSoon.map((cs) => (
          <ComingSoonCard
            key={`${cs.provider}-${cs.model}`}
            provider={cs.provider}
            model={cs.model}
            fakeData={cs.fakeData}
          />
        ))}

        {models.length === 0 && comingSoon.length === 0 && (
          <div className="text-[#737373] text-center py-10 col-span-full">No models found.</div>
        )}
      </div>
      </div>
    </div>
  );
}
