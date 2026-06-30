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
    <div className="pb-12">
      {/* Breadcrumb */}
      <Link href={`/models/${encodeURIComponent(report.model)}`} className="text-sm text-[#64748b] hover:text-[#f1f5f9] transition-colors mt-6 mb-8 block px-6 max-w-6xl mx-auto">
        &larr; Back to {report.model} summary
      </Link>

      {/* Header Card */}
      <div className="bg-[#161b27] border border-[#1e2433] rounded-xl p-8 max-w-6xl mx-auto mb-6 flex justify-between items-start">
        <div>
          <div className="text-xs text-[#64748b] uppercase tracking-wider mb-1">
            Technical Report
          </div>
          <h1 className="text-2xl font-bold text-[#f1f5f9]">
            {report.model}
          </h1>
          <div className="text-sm text-[#64748b] mt-2">
            Run on {new Date(report.run_timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at {new Date(report.run_timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-[#64748b] uppercase tracking-wider mb-1">
            OVERALL BSI SCORE
          </div>
          <div className={`text-5xl font-bold ${bsiColor}`}>
            {report.bsi.toFixed(1)}
          </div>
          <div className="mt-2 text-sm text-[#64748b]">
            {report.drifted_count} of {report.total_prompts} prompts flagged ({(report.regression_rate * 100).toFixed(1)}%)
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="max-w-6xl mx-auto bg-[#161b27] border border-[#1e2433] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#1e2433]">
            <thead className="bg-[#1e2433]">
              <tr>
                <th scope="col" className="py-3 px-4 text-left text-xs uppercase tracking-wider text-[#64748b]">Prompt ID</th>
                <th scope="col" className="py-3 px-4 text-left text-xs uppercase tracking-wider text-[#64748b]">Category</th>
                <th scope="col" className="py-3 px-4 text-left text-xs uppercase tracking-wider text-[#64748b]">Z-Score</th>
                <th scope="col" className="py-3 px-4 text-left text-xs uppercase tracking-wider text-[#64748b]">Cohen's d</th>
                <th scope="col" className="py-3 px-4 text-left text-xs uppercase tracking-wider text-[#64748b]">P-Value</th>
                <th scope="col" className="py-3 px-4 text-left text-xs uppercase tracking-wider text-[#64748b]">Direction</th>
                <th scope="col" className="py-3 px-4 text-left text-xs uppercase tracking-wider text-[#64748b]">Magnitude</th>
                <th scope="col" className="py-3 px-4 text-left text-xs uppercase tracking-wider text-[#64748b]">Semantic Sim</th>
                <th scope="col" className="py-3 px-4 text-left text-xs uppercase tracking-wider text-[#64748b]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2433]">
              {sortedDetails.map((detail: DriftDetail, idx: number) => {
                let directionColor = "text-[#64748b]";
                if (detail.direction === "increased") directionColor = "text-[#34d399]";
                else if (detail.direction === "decreased") directionColor = "text-[#f59e0b]";
                else if (detail.direction === "semantic_shift") directionColor = "text-[#f87171]";

                let magnitudeColor = "text-[#64748b]";
                if (detail.magnitude === "small") magnitudeColor = "text-[#f1f5f9]";
                else if (detail.magnitude === "medium") magnitudeColor = "text-[#f59e0b]";
                else if (detail.magnitude === "large") magnitudeColor = "text-[#f87171]";

                return (
                  <tr key={`${detail.prompt_id}-${detail.category}-${idx}`} className="hover:bg-[#1a2035] transition-colors">
                    <td className="whitespace-nowrap py-4 px-4 text-xs font-mono text-[#34d399]">
                      {detail.prompt_id}
                    </td>
                    <td className="whitespace-nowrap py-4 px-4 text-sm text-[#64748b]">
                      {CATEGORY_LABELS[detail.category] ?? detail.category}
                    </td>
                    <td className="whitespace-nowrap py-4 px-4 text-sm text-[#f1f5f9]">
                      {detail.z_score.toFixed(3)}
                    </td>
                    <td className="whitespace-nowrap py-4 px-4 text-sm text-[#f1f5f9]">
                      {detail.cohens_d !== null ? detail.cohens_d.toFixed(3) : <span className="text-[#64748b]">—</span>}
                    </td>
                    <td className="whitespace-nowrap py-4 px-4 text-sm text-[#f1f5f9]">
                      {detail.p_value !== null ? detail.p_value.toFixed(4) : <span className="text-[#64748b]">—</span>}
                    </td>
                    <td className={`whitespace-nowrap py-4 px-4 text-sm ${directionColor}`}>
                      {detail.direction}
                    </td>
                    <td className={`whitespace-nowrap py-4 px-4 text-sm ${magnitudeColor}`}>
                      {detail.magnitude}
                    </td>
                    <td className="whitespace-nowrap py-4 px-4 text-sm">
                      {detail.category === 'verbosity' ? (
                        detail.semantic_similarity !== null ? (
                          <span className={detail.semantic_similarity >= 0.90 ? 'text-[#34d399]' : detail.semantic_similarity >= 0.75 ? 'text-[#f59e0b]' : 'text-[#f87171]'}>
                            {detail.semantic_similarity.toFixed(3)}
                          </span>
                        ) : <span className="text-[#64748b]">—</span>
                      ) : (
                        <span className="text-[#64748b]">—</span>
                      )}
                    </td>
                    <td className="whitespace-nowrap py-4 px-4 text-sm">
                      {detail.drift_detected ? (
                        <div className="inline-flex items-center justify-center rounded-full border border-[#f59e0b]/20 bg-[#f59e0b]/10 px-3 py-1 text-xs font-medium text-[#f59e0b]">
                          Flagged
                        </div>
                      ) : (
                        <div className="inline-flex items-center justify-center rounded-full border border-[#34d399]/20 bg-[#34d399]/10 px-3 py-1 text-xs font-medium text-[#34d399]">
                          Stable
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
              {sortedDetails.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-8 px-4 text-sm text-[#64748b] text-center">
                    No drift details found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Export Note */}
      <div className="text-xs text-[#64748b] text-center mt-4 mb-8">
        Showing results from the most recent complete run &middot; {report.total_prompts} prompts evaluated
      </div>
    </div>
  );
}
