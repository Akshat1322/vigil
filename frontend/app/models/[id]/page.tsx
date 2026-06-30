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
  return `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
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

  let statusColor = "#f87171"; // drift
  let statusLabel = "Needs attention";
  if (model.drifted_count === 0) {
    statusColor = "#34d399";
    statusLabel = "All clear";
  } else if (model.status !== 'drift') {
    statusColor = "#f59e0b";
    statusLabel = "Changes detected";
  }

  const stableTotal = model.total_prompts - model.drifted_count;

  return (
    <div className="pb-12">
      {/* Breadcrumb */}
      <Link href="/dashboard" className="text-sm text-[#64748b] hover:text-[#f1f5f9] transition-colors mt-6 mb-8 block px-6 max-w-5xl mx-auto">
        &larr; Back to dashboard
      </Link>

      {/* Hero Card */}
      <div 
        className="bg-[#161b27] border border-[#1e2433] rounded-xl p-8 max-w-5xl mx-auto mb-6"
        style={{ borderLeft: `3px solid ${statusColor}` }}
      >
        <div className="flex justify-between items-start">
          <div>
            <div className="text-xs uppercase tracking-widest" style={{ color: statusColor }}>
              {provider}
            </div>
            <h1 className="text-3xl font-bold text-[#f1f5f9] mt-1">{modelName}</h1>
            <div className="text-sm text-[#64748b] mt-2">
              Last checked {timeAgo(model.last_run_timestamp)} &middot; {formatDateFull(model.last_run_timestamp)}
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full border mb-3 ml-auto w-max" style={{ backgroundColor: `${statusColor}1A`, borderColor: `${statusColor}4D` }}>
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: statusColor }}></div>
              <span className="font-medium text-sm" style={{ color: statusColor }}>{statusLabel}</span>
            </div>
            <div className="text-4xl font-bold" style={{ color: statusColor }}>
              {model.bsi.toFixed(1)}
            </div>
            <div className="text-xs text-[#64748b] mt-1">
              Stability Score
            </div>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-[#1e2433] text-sm text-[#64748b]">
          {stableTotal} of {model.total_prompts} checks passed this run
        </div>
      </div>

      {/* Behavior breakdown */}
      <h2 className="text-lg font-semibold text-[#f1f5f9] mb-4 px-6 max-w-5xl mx-auto">
        Behavior breakdown
      </h2>
      <div className="mb-3">
        {model.categories.map((cat: CategoryStatus) => {
          const friendlyName = CATEGORY_LABELS[cat.category] || cat.category;
          const description = CATEGORY_DESCRIPTIONS[cat.category] || "";
          const isStable = !cat.drift_detected;
          
          return (
            <div key={cat.category} className="bg-[#161b27] border border-[#1e2433] rounded-xl p-5 mb-3 max-w-5xl mx-auto px-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`flex items-center justify-center w-9 h-9 rounded-full border ${isStable ? 'border-[#34d399]/30 bg-[#34d399]/10 text-[#34d399]' : 'border-[#f59e0b]/30 bg-[#f59e0b]/10 text-[#f59e0b]'}`}>
                  {isStable ? (
                    <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" /></svg>
                  ) : (
                    <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>
                  )}
                </div>
                <div>
                  <div className="text-[#f1f5f9] font-medium">{friendlyName}</div>
                  <div className="text-[#64748b] text-xs mt-1">{description}</div>
                </div>
              </div>
              <div className="text-right">
                {isStable ? (
                  <div className="text-[#34d399] text-sm">All {cat.total_count} checks passed</div>
                ) : (
                  <>
                    <div className="text-[#f59e0b] text-sm">{cat.total_count - cat.stable_count} of {cat.total_count} flagged</div>
                    <div className="text-[#64748b] text-xs mt-1">This changed recently</div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Stability over time */}
      <h2 className="text-lg font-semibold text-[#f1f5f9] mb-4 mt-8 px-6 max-w-5xl mx-auto">
        Stability over time
      </h2>
      <div className="bg-[#161b27] border border-[#1e2433] rounded-xl p-6 max-w-5xl mx-auto px-6">
        <BsiTrendChart history={history} lineColor={statusColor} />
      </div>

      {/* Action button */}
      <div className="mt-8 mb-12 px-6 max-w-5xl mx-auto">
        <Link 
          href={`/reports/${encodeURIComponent(model.model)}`}
          className="inline-block px-6 py-3 bg-[#34d399] hover:bg-[#10b981] text-[#0f1117] font-semibold rounded-lg transition-colors"
        >
          View full technical report &rarr;
        </Link>
      </div>
    </div>
  );
}
