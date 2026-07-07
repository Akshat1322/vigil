import { fetchModelReport } from '@/lib/api-server';
import Link from 'next/link';
import { CATEGORY_LABELS } from '@/lib/constants';

export const dynamic = 'force-dynamic';

interface DriftDetail {
  prompt_id: string;
  category: string;
  z_score: number;
  cohens_d: number | null;
  p_value: number | null;
  drift_detected: boolean;
  direction: string;
  magnitude: string;
  current_mean: number;
  baseline_mean: number;
  semantic_similarity: number | null;
}

interface MutationSuggestion {
  prompt_id: string;
  category: string;
  original_prompt: string;
  suggested_rewrite: string;
  reasoning: string;
  drift_direction: string;
}

interface RunReport {
  model: string;
  run_timestamp: string;
  bsi: number;
  regression_rate: number;
  drifted_count: number;
  total_prompts: number;
  drift_details: DriftDetail[];
  mutations: MutationSuggestion[];
}

export default async function TechnicalReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);
  const report: RunReport = await fetchModelReport(decodedId);

  // Sort by category, then by prompt_id
  const sortedDetails = [...report.drift_details].sort((a: DriftDetail, b: DriftDetail) => {
    if (a.category < b.category) return -1;
    if (a.category > b.category) return 1;
    if (a.prompt_id < b.prompt_id) return -1;
    if (a.prompt_id > b.prompt_id) return 1;
    return 0;
  });

  const bsiColor = report.bsi >= 90 ? "text-[#34d399]" : report.bsi >= 75 ? "text-[#f59e0b]" : "text-[#f87171]";

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-8 pb-16">
      {/* Breadcrumb */}
      <div className="max-w-5xl mx-auto px-4 md:px-6 mb-6">
        <Link href={`/models/${encodeURIComponent(report.model)}`} className="text-xs text-[#737373] hover:text-[#f5f5f5] transition-colors">
          &larr; {report.model} summary
        </Link>
      </div>

      {/* Header Card */}
      <div className="card-grid-texture border border-[#1c1c1c] rounded-lg p-4 md:p-6 max-w-5xl mx-auto mb-6 flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-0 mx-4 md:mx-auto">
        <div>
          <div className="text-xs text-[#737373] uppercase tracking-widest font-sans font-bold mb-1">
            Technical Report
          </div>
          <h1 className="text-2xl font-semibold text-[#f5f5f5] font-sans font-bold">
            {report.model}
          </h1>
          <div className="text-xs text-[#737373] mt-2">
            Run on {new Date(report.run_timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at {new Date(report.run_timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
          </div>
        </div>
        <div className="text-left sm:text-right">
          <div className="text-xs text-[#737373] uppercase tracking-widest font-sans font-bold mb-1">
            OVERALL BSI SCORE
          </div>
          <div className={`text-4xl font-bold font-sans font-bold ${bsiColor}`}>
            {report.bsi.toFixed(1)}
          </div>
          <div className="mt-2 text-xs text-[#737373]">
            {report.drifted_count} of {report.total_prompts} prompts flagged ({(report.regression_rate * 100).toFixed(1)}%)
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="max-w-5xl mx-auto mx-4 md:mx-auto card-grid-texture border border-[#1c1c1c] rounded-lg overflow-hidden mb-4">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#1c1c1c]">
            <thead className="bg-[#0f0f0f]">
              <tr>
                <th scope="col" className="py-3 px-4 text-left text-xs uppercase tracking-wider text-[#404040] font-medium">Prompt ID</th>
                <th scope="col" className="py-3 px-4 text-left text-xs uppercase tracking-wider text-[#404040] font-medium">Category</th>
                <th scope="col" className="py-3 px-4 text-left text-xs uppercase tracking-wider text-[#404040] font-medium">Z-Score</th>
                <th scope="col" className="py-3 px-4 text-left text-xs uppercase tracking-wider text-[#404040] font-medium">Cohen's d</th>
                <th scope="col" className="py-3 px-4 text-left text-xs uppercase tracking-wider text-[#404040] font-medium">P-Value</th>
                <th scope="col" className="py-3 px-4 text-left text-xs uppercase tracking-wider text-[#404040] font-medium">Direction</th>
                <th scope="col" className="py-3 px-4 text-left text-xs uppercase tracking-wider text-[#404040] font-medium">Magnitude</th>
                <th scope="col" className="py-3 px-4 text-left text-xs uppercase tracking-wider text-[#404040] font-medium">Semantic Sim</th>
                <th scope="col" className="py-3 px-4 text-left text-xs uppercase tracking-wider text-[#404040] font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1c1c1c]">
              {sortedDetails.map((detail: DriftDetail, idx: number) => {
                let directionColor = "text-[#404040]";
                if (detail.direction === "increased") directionColor = "text-[#34d399]";
                else if (detail.direction === "decreased") directionColor = "text-[#f59e0b]";
                else if (detail.direction === "semantic_shift") directionColor = "text-[#f87171]";

                let magnitudeColor = "text-[#404040]";
                if (detail.magnitude === "small") magnitudeColor = "text-[#f5f5f5]";
                else if (detail.magnitude === "medium") magnitudeColor = "text-[#f59e0b]";
                else if (detail.magnitude === "large") magnitudeColor = "text-[#f87171]";

                return (
                  <tr key={`${detail.prompt_id}-${detail.category}-${idx}`} className="hover:bg-[#161616] transition-colors">
                    <td className="whitespace-nowrap py-3.5 px-4 text-xs font-sans font-bold text-[#34d399]">
                      {detail.prompt_id}
                    </td>
                    <td className="whitespace-nowrap py-3.5 px-4 text-sm text-[#737373]">
                      {CATEGORY_LABELS[detail.category] ?? detail.category}
                    </td>
                    <td className="whitespace-nowrap py-3.5 px-4 text-sm text-[#f5f5f5]">
                      {detail.z_score.toFixed(3)}
                    </td>
                    <td className="whitespace-nowrap py-3.5 px-4 text-sm text-[#f5f5f5]">
                      {detail.cohens_d !== null ? detail.cohens_d.toFixed(3) : <span className="text-[#404040]">—</span>}
                    </td>
                    <td className="whitespace-nowrap py-3.5 px-4 text-sm text-[#f5f5f5]">
                      {detail.p_value !== null ? detail.p_value.toFixed(4) : <span className="text-[#404040]">—</span>}
                    </td>
                    <td className={`whitespace-nowrap py-3.5 px-4 text-sm ${directionColor}`}>
                      {detail.direction === 'unchanged' ? <span className="text-[#404040]">unchanged</span> : detail.direction}
                    </td>
                    <td className={`whitespace-nowrap py-3.5 px-4 text-sm ${magnitudeColor}`}>
                      {detail.magnitude === 'none' ? <span className="text-[#404040]">none</span> : detail.magnitude}
                    </td>
                    <td className="whitespace-nowrap py-3.5 px-4 text-sm">
                      {detail.category === 'verbosity' ? (
                        detail.semantic_similarity !== null ? (
                          <span className={detail.semantic_similarity >= 0.90 ? 'text-[#34d399]' : detail.semantic_similarity >= 0.75 ? 'text-[#f59e0b]' : 'text-[#f87171]'}>
                            {detail.semantic_similarity.toFixed(3)}
                          </span>
                        ) : <span className="text-[#404040]">—</span>
                      ) : (
                        <span className="text-[#404040]">—</span>
                      )}
                    </td>
                    <td className="whitespace-nowrap py-3.5 px-4 text-sm">
                      {detail.drift_detected ? (
                        <div className="inline-flex items-center justify-center rounded border border-[#f59e0b]/15 bg-[#f59e0b]/8 px-2 py-0.5 text-xs text-[#f59e0b]">
                          Flagged
                        </div>
                      ) : (
                        <div className="inline-flex items-center justify-center rounded border border-[#34d399]/15 bg-[#34d399]/8 px-2 py-0.5 text-xs text-[#34d399]">
                          Stable
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
              {sortedDetails.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-8 px-4 text-sm text-[#737373] text-center">
                    No drift details found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Mutation Suggestions */}
      {report.mutations && report.mutations.length > 0 && (
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <h2 className="text-xs font-medium tracking-widest text-[#404040] uppercase mb-3 mt-8">
            Mutation Suggestions
          </h2>
          <div className="flex flex-col gap-3">
            {report.mutations.map((m: MutationSuggestion) => (
              <div key={m.prompt_id} className="bg-[#111111] border border-[#1c1c1c] rounded-lg p-5">
                
                {/* Row 1 */}
                <div className="flex justify-between items-center mb-4 pb-3 border-b border-[#1c1c1c]">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-mono text-[#34d399]">{m.prompt_id}</span>
                    <span className="text-xs text-[#737373] bg-[#1a1a1a] px-2 py-0.5 rounded-full">
                      {CATEGORY_LABELS[m.category as keyof typeof CATEGORY_LABELS] || m.category}
                    </span>
                  </div>
                  <span className="text-xs text-[#f59e0b] bg-[#f59e0b]/10 border border-[#f59e0b]/20 px-2 py-1 rounded">
                    {m.drift_direction}
                  </span>
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:border-r border-[#1c1c1c] md:pr-4">
                    <div className="text-xs text-[#404040] mb-2">ORIGINAL</div>
                    <div className="text-sm text-[#737373] leading-relaxed break-words whitespace-pre-wrap">
                      {m.original_prompt}
                    </div>
                  </div>
                  <div className="md:pl-4">
                    <div className="text-xs text-[#34d399] mb-2">SUGGESTED REWRITE</div>
                    <div className="text-sm text-[#f5f5f5] leading-relaxed break-words whitespace-pre-wrap">
                      {m.suggested_rewrite}
                    </div>
                  </div>
                </div>

                {/* Row 3 */}
                <div className="text-xs text-[#737373] italic mt-4 border-t border-[#1c1c1c] pt-3">
                  <span className="text-[#404040]">Reasoning: </span>{m.reasoning}
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer Note */}
      <div className="text-center mt-4 pb-6">
        <div className="text-xs text-[#404040]">
          Showing results from the most recent complete run &middot; {report.total_prompts} prompts evaluated
        </div>
      </div>
    </div>
  );
}
