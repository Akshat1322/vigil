import { fetchModels, fetchModelHistory } from '@/lib/api-server';
import SparklineChart from '@/components/SparklineChart';
import Link from 'next/link';

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

export default async function HomePage() {
  const models = await fetchModels();
  
  const histories = await Promise.all(
    models.map((m: ModelSummary) => fetchModelHistory(m.model).catch(() => []))
  );

  const totalModels = models.length;
  const totalPrompts = models.reduce((acc: number, m: ModelSummary) => acc + m.total_prompts, 0);

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-8 pb-16">
      {/* Page header */}
      <div className="max-w-5xl mx-auto px-6 mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-semibold text-[#f5f5f5] tracking-tight">AI Model Monitor</h1>
          <p className="text-sm text-[#737373] mt-1">Know the moment your model changes behavior.</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-[#111111] border border-[#1c1c1c] rounded-full px-3 py-1 text-xs text-[#737373]">
            {totalModels} models
          </div>
          <div className="bg-[#111111] border border-[#1c1c1c] rounded-full px-3 py-1 text-xs text-[#737373]">
            {totalPrompts} checks
          </div>
          <div className="bg-[#111111] border border-[#1c1c1c] rounded-full px-3 py-1 text-xs text-[#737373]">
            Weekly
          </div>
        </div>
      </div>

      {/* Model cards */}
      <div className="max-w-5xl mx-auto px-6 flex flex-col gap-3">
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
            <Link key={model.model} href={`/models/${encodeURIComponent(model.model)}`} className="block relative card-grid-texture border border-[#1c1c1c] rounded-[8px] overflow-hidden transition-all hover:border-[#2a2a2a]">
              <div 
                className="absolute left-0 top-0 bottom-0 w-[3px]"
                style={{ background: statusColor, borderRadius: '3px 0 0 3px' }}
              ></div>
              <div className="p-[20px] px-[24px]">
                
                {/* Row 1: Identity + Status */}
                <div className="flex justify-between items-start">
                  <div>
                    <div 
                      className="text-xs tracking-widest uppercase font-['Space_Grotesk']" 
                      style={{ color: statusColor, opacity: 0.7 }}
                    >
                      {provider}
                    </div>
                    <div className="text-lg font-medium text-[#f5f5f5] mt-0.5 font-['Space_Grotesk']">
                      {modelName}
                    </div>
                  </div>
                  <div>
                    <div 
                      className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium" 
                      style={{ backgroundColor: statusConfig.bg, borderColor: `${statusColor}33`, borderWidth: '1px', color: statusColor }}
                    >
                      <div className={`w-[6px] h-[6px] rounded-full ${model.drifted_count > 0 ? 'animate-pulse' : ''}`} style={{ backgroundColor: statusColor }}></div>
                      {statusConfig.label}
                    </div>
                  </div>
                </div>

                <div className="border-t border-[#1c1c1c] my-4"></div>

                {/* Row 2: Stats */}
                <div className="grid grid-cols-4 gap-0 divide-x divide-[#1c1c1c]">
                  {/* Col 1: Checks passed */}
                  <div className="px-4 pl-0">
                    <div className="text-xs text-[#737373] mb-2">Checks passed</div>
                    <div>
                      <span className="text-2xl font-semibold text-[#f5f5f5] font-['Space_Grotesk']">{stableCount}</span>
                      <span className="text-sm text-[#404040] ml-1">of {model.total_prompts}</span>
                    </div>
                    <div className="mt-2 h-[2px] rounded-[2px] bg-[#1c1c1c] w-full overflow-hidden">
                      <div 
                        className="h-full transition-all duration-500 rounded-[2px]" 
                        style={{ backgroundColor: statusColor, width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {/* Col 2: Last checked */}
                  <div className="px-4">
                    <div className="text-xs text-[#737373] mb-2">Last checked</div>
                    <div className="text-base font-medium text-[#f5f5f5]">
                      {timeAgo(model.last_run_timestamp)}
                    </div>
                    <div className="text-xs text-[#404040] mt-0.5">
                      {formatDateFull(model.last_run_timestamp)}
                    </div>
                  </div>
                  
                  {/* Col 3: This week */}
                  <div className="px-4">
                    <div className="text-xs text-transparent mb-2 select-none">Status</div>
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
                  
                  {/* Col 4: Stability trend */}
                  <div className="px-4 pr-0">
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
        {models.length === 0 && (
          <div className="text-[#737373] text-center py-10">No models found.</div>
        )}
      </div>
    </div>
  );
}
