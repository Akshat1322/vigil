import { fetchModels, fetchModelHistory } from '@/lib/api-server';
import SparklineChart from '@/components/SparklineChart';
import Link from 'next/link';
import { Monitor, Activity, Clock } from 'lucide-react';

export const dynamic = 'force-dynamic';

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
  return `on ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
}

export default async function HomePage() {
  const models = await fetchModels();
  
  const histories = await Promise.all(
    models.map((m: any) => fetchModelHistory(m.model).catch(() => []))
  );

  const totalModels = models.length;
  const totalPrompts = models.reduce((acc, m) => acc + m.total_prompts, 0);

  return (
    <div className="max-w-7xl mx-auto pb-12">
      {/* Page header section */}
      <div className="pt-10 pb-6 px-6 max-w-5xl mx-auto w-full">
        <h1 className="text-[#f1f5f9] text-4xl font-bold tracking-tight">AI Model Monitor</h1>
        <p className="text-[#64748b] text-base mt-2">
          Know the moment your model <span style={{color: '#34d399'}}>changes</span> behavior.
        </p>
        <div className="mt-6 flex gap-8">
          <div className="flex items-center gap-2 border-r border-[#1e2433] pr-8">
            <Monitor className="w-4 h-4 text-[#64748b]" />
            <div>
              <span className="text-[#f1f5f9] font-semibold">{totalModels}</span>
              <span className="text-[#64748b] text-sm ml-1">models monitored</span>
            </div>
          </div>
          <div className="flex items-center gap-2 border-r border-[#1e2433] pr-8">
            <Activity className="w-4 h-4 text-[#64748b]" />
            <div>
              <span className="text-[#f1f5f9] font-semibold">{totalPrompts}</span>
              <span className="text-[#64748b] text-sm ml-1">checks run this week</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#64748b]" />
            <span className="text-[#64748b] text-sm">Updated weekly</span>
          </div>
        </div>
      </div>

      {/* Model cards grid */}
      <div className="mt-8 flex flex-col gap-4 px-6 max-w-5xl mx-auto w-full">
        {models.map((model, idx) => {
          const history = histories[idx];
          
          const parts = model.model.split('/');
          const provider = parts.length > 1 ? parts[0] : 'Unknown';
          const modelName = parts.length > 1 ? parts.slice(1).join('/') : model.model;
          
          const stableCount = model.total_prompts - model.drifted_count;
          const percentage = Math.round((stableCount / model.total_prompts) * 100);
          
          const STATUS_MAP: Record<string, {color: string, label: string, sublabel: string}> = {
            stable: { 
              color: "#34d399", 
              label: "All clear",
              sublabel: "No changes detected"
            },
            watch: { 
              color: "#f59e0b", 
              label: "Changes detected",
              sublabel: "Review recommended"
            },
            drift: { 
              color: "#f87171", 
              label: "Needs attention",
              sublabel: "Significant changes found"
            },
          };
          const statusConfig = model.drifted_count === 0 
            ? STATUS_MAP.stable 
            : (model.status === 'drift' ? STATUS_MAP.drift : STATUS_MAP.watch);
          const statusColor = statusConfig.color;
          const statusLabel = statusConfig.label;
          
          return (
            <Link key={model.model} href={`/models/${encodeURIComponent(model.model)}`} className="block">
              <div 
                className="bg-[#161b27] border border-[#1e2433] rounded-[12px] overflow-hidden cursor-pointer transition-colors duration-200 hover:border-[#2d3748] hover:bg-[#1a2035] p-6"
                style={{ borderLeft: `3px solid ${statusColor}` }}
              >
                
                {/* Row 1: Identity + Status */}
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-widest" style={{ color: statusColor }}>
                      {provider}
                    </div>
                    <div className="text-2xl font-bold text-[#f1f5f9] mt-1">
                      {modelName}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full border" style={{ backgroundColor: `${statusColor}1A`, borderColor: `${statusColor}4D` }}>
                      <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: statusColor }}></div>
                      <span className="font-medium text-sm" style={{ color: statusColor }}>{statusLabel}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-[#1e2433] my-5"></div>

                {/* Row 2: Stats row */}
                <div className="grid grid-cols-4 gap-6">
                  {/* Col 1: Checks passed */}
                  <div>
                    <div className="text-[#64748b] text-xs mb-2">Checks passed</div>
                    <div>
                      <span className="text-[#f1f5f9] text-3xl font-bold">{stableCount}</span>
                      <span className="text-[#64748b]"> of {model.total_prompts}</span>
                    </div>
                    <div className="mt-2 h-1 rounded-sm bg-[#1e2433] w-full">
                      <div 
                        className="h-full rounded-sm transition-all duration-500" 
                        style={{ backgroundColor: statusColor, width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-[#64748b] mt-1">{percentage}%</div>
                  </div>
                  
                  {/* Col 2: Last checked */}
                  <div>
                    <div className="text-[#64748b] text-xs mb-2">Last checked</div>
                    <div className="font-semibold text-[#f1f5f9] text-lg">
                      {timeAgo(model.last_run_timestamp)}
                    </div>
                    <div className="text-xs text-[#64748b] mt-1">
                      {formatDateFull(model.last_run_timestamp)}
                    </div>
                  </div>
                  
                  {/* Col 3: This week status */}
                  <div>
                    <div className="h-6 mb-2"></div> {/* Empty space for alignment with labels */}
                    {model.drifted_count === 0 ? (
                      <>
                        <div className="font-bold text-xl text-[#34d399]">Stable</div>
                        <div className="text-xs text-[#64748b] mt-1">✓ No changes detected</div>
                      </>
                    ) : (
                      <>
                        <div className={`font-bold text-xl ${model.status === 'drift' ? 'text-[#f87171]' : 'text-[#f59e0b]'}`}>
                          {model.drifted_count} changed
                        </div>
                        <div className="text-xs text-[#64748b] mt-1">
                          ⚠ {model.status === 'drift' ? 'Significant changes found' : 'Review recommended'}
                        </div>
                      </>
                    )}
                  </div>
                  
                  {/* Col 4: Stability trend */}
                  <div>
                    <div className="text-[#64748b] text-xs mb-2">Stability trend</div>
                    {history && history.length > 0 && (
                      <SparklineChart data={history.slice(-7)} color={statusColor} />
                    )}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
        {models.length === 0 && (
          <div className="text-[#64748b] text-center py-10">No models found.</div>
        )}
      </div>

      {/* Footer */}
      <p className="text-[#475569] text-xs text-center mt-8 pb-8">
        ⓘ All times are relative to your local timezone
      </p>
    </div>
  );
}
