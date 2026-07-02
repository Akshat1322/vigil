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

interface RunReport {
  model: string;
  run_timestamp: string;
  bsi: number;
  regression_rate: number;
  drifted_count: number;
  total_prompts: number;
  drift_details: DriftDetail[];
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
      <div className="max-w-5xl mx-auto px-6 mb-6">
        <Link href={`/models/${encodeURIComponent(report.model)}`} className="text-xs text-[#737373] hover:text-[#f5f5f5] transition-colors">
          &larr; {report.model} summary
        </Link>
      </div>

      {/* Header Card */}
      <div className="card-grid-texture border border-[#1c1c1c] rounded-lg p-6 max-w-5xl mx-auto mb-6 flex justify-between items-start">
        <div>
          <div className="text-xs text-[#737373] uppercase tracking-widest font-['Share_Tech_Mono'] mb-1">
            Technical Report
          </div>
          <h1 className="text-2xl font-semibold text-[#f5f5f5] font-['Share_Tech_Mono']">
            {report.model}
          </h1>
          <div className="text-xs text-[#737373] mt-2">
            Run on {new Date(report.run_timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at {new Date(report.run_timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-[#737373] uppercase tracking-widest font-['Share_Tech_Mono'] mb-1">
            OVERALL BSI SCORE
          </div>
          <div className={`text-4xl font-bold font-['Share_Tech_Mono'] ${bsiColor}`}>
            {report.bsi.toFixed(1)}
          </div>
          <div className="mt-2 text-xs text-[#737373]">
            {report.drifted_count} of {report.total_prompts} prompts flagged ({(report.regression_rate * 100).toFixed(1)}%)
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="max-w-5xl mx-auto card-grid-texture border border-[#1c1c1c] rounded-lg overflow-hidden mb-4">
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
                    <td className="whitespace-nowrap py-3.5 px-4 text-xs font-['Share_Tech_Mono'] text-[#34d399]">
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

      {/* Footer Note */}
      <div className="text-center mt-4 pb-6">
        <div className="text-xs text-[#404040]">
          Showing results from the most recent complete run &middot; {report.total_prompts} prompts evaluated
        </div>
      </div>
    </div>
  );
}
