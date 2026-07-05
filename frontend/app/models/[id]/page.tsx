import { fetchModel, fetchModelHistory } from '@/lib/api-server';
import BsiTrendChart from '@/components/BsiTrendChart';
import Link from 'next/link';
import { CATEGORY_LABELS } from '@/lib/constants';

export const dynamic = 'force-dynamic';

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

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  hallucination: "Checks factual accuracy of responses",
  format_adherence: "Verifies structured output stays valid",
  instruction_following: "Tests if explicit instructions are followed",
  verbosity: "Monitors response length consistency",
};

export default async function ModelDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);
  const model: ModelSummary = await fetchModel(decodedId);
  const history = await fetchModelHistory(decodedId);

  const parts = model.model.split('/');
  const provider = parts.length > 1 ? parts[0] : 'Unknown';
  const modelName = parts.length > 1 ? parts.slice(1).join('/') : model.model;

  const statusKey = model.drifted_count === 0 
    ? 'stable' 
    : (model.status === 'drift' ? 'drift' : 'watch');

  const STATUS_MAP: Record<string, {color: string, label: string, bg: string}> = {
    stable: { color: "#34d399", bg: "rgba(52,211,153,0.1)", label: "All clear" },
    watch:  { color: "#f59e0b", bg: "rgba(245,158,11,0.1)", label: "Changes detected" },
    drift:  { color: "#f87171", bg: "rgba(248,113,113,0.1)", label: "Needs attention" },
  };
  
  const statusConfig = STATUS_MAP[statusKey];
  const statusColor = statusConfig.color;

  const stableTotal = model.total_prompts - model.drifted_count;

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-8 pb-16">
      {/* Breadcrumb */}
      <div className="max-w-5xl mx-auto px-4 md:px-6 mb-6">
        <Link href="/dashboard" className="text-xs text-[#737373] hover:text-[#f5f5f5] transition-colors">
          &larr; Dashboard
        </Link>
      </div>

      {/* Hero Card */}
      <div 
        className="card-grid-texture border border-[#1c1c1c] rounded-lg p-4 md:p-6 max-w-5xl mx-auto mb-8"
        style={{ borderLeft: `3px solid ${statusColor}` }}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="text-xs uppercase tracking-widest font-sans font-bold" style={{ color: statusColor, opacity: 0.7 }}>
              {provider}
            </div>
            <h1 className="text-2xl font-semibold text-[#f5f5f5] mt-1 font-sans font-bold">{modelName}</h1>
            <div className="text-xs text-[#737373] mt-2">
              Last checked {timeAgo(model.last_run_timestamp)} &middot; {formatDateFull(model.last_run_timestamp)}
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium mb-1 ml-auto w-max" style={{ backgroundColor: statusConfig.bg, borderColor: `${statusColor}33`, borderWidth: '1px', color: statusColor }}>
                <div className={`w-[6px] h-[6px] rounded-full ${model.drifted_count > 0 ? 'animate-pulse' : ''}`} style={{ backgroundColor: statusColor }}></div>
                {statusConfig.label}
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold font-sans font-bold" style={{ color: statusColor }}>
                {model.bsi.toFixed(1)}
              </div>
              <div className="text-xs text-[#737373] mt-1">
                Stability Score
              </div>
            </div>
          </div>
        </div>
        <div className="mt-5 pt-4 border-t border-[#1c1c1c] text-xs text-[#737373]">
          {stableTotal} of {model.total_prompts} checks passed
        </div>
      </div>

      {/* Behavior breakdown */}
      <div className="max-w-5xl mx-auto px-4 md:px-6 mb-8">
        <div className="text-xs font-medium tracking-widest text-[#404040] uppercase mb-3">
          BEHAVIOR BREAKDOWN
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {model.categories.map((cat: CategoryStatus, idx: number) => {
            const friendlyName = CATEGORY_LABELS[cat.category] || cat.category;
            const description = CATEGORY_DESCRIPTIONS[cat.category] || "";
            const isStable = !cat.drift_detected;
            
            return (
              <div key={idx} className="bg-[#111111] border border-[#1c1c1c] rounded-lg p-4 md:p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`flex items-center justify-center w-[32px] h-[32px] rounded-full border ${isStable ? 'border-[#34d399]/20 bg-[#34d399]/10 text-[#34d399]' : 'border-[#f59e0b]/20 bg-[#f59e0b]/10 text-[#f59e0b]'}`}>
                    {isStable ? (
                      <span className="text-sm font-bold">✓</span>
                    ) : (
                      <span className="text-sm font-bold">⚠</span>
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[#f5f5f5]">{friendlyName}</div>
                    <div className="text-xs text-[#737373] mt-0.5">{description}</div>
                  </div>
                </div>
                <div className="text-right">
                  {isStable ? (
                    <div className="text-xs text-[#34d399]">All {cat.total_count} passed</div>
                  ) : (
                    <>
                      <div className="text-xs text-[#f59e0b]">{cat.total_count - cat.stable_count} of {cat.total_count} flagged</div>
                      <div className="text-xs text-[#404040] mt-0.5">Changed recently</div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stability over time */}
      <div className="max-w-5xl mx-auto px-4 md:px-6 mb-8">
        <div className="text-xs font-medium tracking-widest text-[#404040] uppercase mb-3">
          STABILITY OVER TIME
        </div>
        <div className="bg-[#111111] border border-[#1c1c1c] rounded-lg p-4 md:p-6 text-center">
          <BsiTrendChart history={history} lineColor={statusColor} />
        </div>
      </div>

      {/* Action button */}
      <div className="max-w-5xl mx-auto px-4 md:px-6">
        <Link 
          href={`/reports/${encodeURIComponent(model.model)}`}
          className="inline-block px-5 py-2.5 bg-[#111111] border border-[#1c1c1c] hover:border-[#34d399]/30 hover:text-[#34d399] text-[#737373] text-sm rounded-md transition-all duration-150"
        >
          View full technical report &rarr;
        </Link>
      </div>
    </div>
  );
}
