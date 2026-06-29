import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="bg-[#0f1117] text-[#f1f5f9] font-sans selection:bg-[#34d399] selection:text-[#0f1117]">
      {/* SECTION 1 — HERO */}
      <section className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center text-center px-6">
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#34d399] mb-4">
          AI MODEL MONITORING
        </div>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight">
          <span className="text-[#f1f5f9]">Know when your AI</span><br/>
          <span className="text-[#34d399]">changes behavior.</span>
        </h1>
        <p className="mt-6 max-w-xl mx-auto text-lg font-normal text-[#64748b] leading-relaxed">
          LLM providers update their models silently. Vigil runs weekly behavioral checks and alerts you the moment something shifts — before your users notice.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/dashboard" className="bg-[#34d399] hover:bg-[#10b981] text-[#0f1117] font-semibold px-8 py-3 rounded-lg transition-colors">
            View live dashboard &rarr;
          </Link>
          <a href="#how-it-works" className="border border-[#1e2433] text-[#64748b] hover:text-[#f1f5f9] hover:border-[#374151] px-8 py-3 rounded-lg transition-colors">
            See how it works &darr;
          </a>
        </div>
        <div className="mt-12 text-sm text-[#475569]">
          Monitoring 2 models &middot; 200 prompt checks run this week &middot; Updated every Monday
        </div>
      </section>

      {/* SECTION 2 — PROBLEM */}
      <section id="how-it-works" className="bg-[#0d1117] py-24 px-6">
        <h2 className="text-3xl font-bold text-[#f1f5f9] text-center mb-4">
          The silent problem with LLM APIs
        </h2>
        <p className="text-lg text-[#64748b] text-center mb-16">
          You didn't change anything. But something changed.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="bg-[#161b27] border border-[#1e2433] rounded-xl p-8 min-h-[180px]">
            <div className="text-3xl mb-4">🔄</div>
            <h3 className="text-lg font-semibold text-[#f1f5f9] mb-2">Silent model updates</h3>
            <p className="text-sm font-normal text-[#64748b] leading-relaxed">
              OpenAI, Google, and Anthropic update models under the same API endpoint without announcement.
            </p>
          </div>
          <div className="bg-[#161b27] border border-[#1e2433] rounded-xl p-8 min-h-[180px]">
            <div className="text-3xl mb-4">📉</div>
            <h3 className="text-lg font-semibold text-[#f1f5f9] mb-2">Behavior shifts go unnoticed</h3>
            <p className="text-sm font-normal text-[#64748b] leading-relaxed">
              Your JSON format breaks. Your bot sounds different. A safety check stops working. Nobody knows why.
            </p>
          </div>
          <div className="bg-[#161b27] border border-[#1e2433] rounded-xl p-8 min-h-[180px]">
            <div className="text-3xl mb-4">⏰</div>
            <h3 className="text-lg font-semibold text-[#f1f5f9] mb-2">You find out from users</h3>
            <p className="text-sm font-normal text-[#64748b] leading-relaxed">
              By the time support tickets arrive, the damage is done. You need to know first.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 3 — HOW VIGIL WORKS */}
      <section className="bg-[#0f1117] py-24 px-6">
        <h2 className="text-3xl font-bold text-[#f1f5f9] text-center mb-16">
          How Vigil works
        </h2>
        <div className="flex flex-col gap-8 max-w-2xl mx-auto">
          <div className="flex items-start gap-6">
            <div className="w-10 h-10 rounded-full bg-[#34d399]/10 border border-[#34d399]/30 text-[#34d399] font-bold text-sm flex items-center justify-center flex-shrink-0">
              01
            </div>
            <div>
              <h3 className="font-semibold text-[#f1f5f9] mb-2">We run 100 behavioral checks weekly</h3>
              <p className="text-sm text-[#64748b] leading-relaxed">
                A suite of prompts covering factual accuracy, format adherence, instruction following, and response consistency — run against your model every Monday.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-6">
            <div className="w-10 h-10 rounded-full bg-[#34d399]/10 border border-[#34d399]/30 text-[#34d399] font-bold text-sm flex items-center justify-center flex-shrink-0">
              02
            </div>
            <div>
              <h3 className="font-semibold text-[#f1f5f9] mb-2">Statistical drift detection fires</h3>
              <p className="text-sm text-[#64748b] leading-relaxed">
                We use Z-score and Cohen's d to separate real behavioral changes from normal random variation. No false alarms.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-6">
            <div className="w-10 h-10 rounded-full bg-[#34d399]/10 border border-[#34d399]/30 text-[#34d399] font-bold text-sm flex items-center justify-center flex-shrink-0">
              03
            </div>
            <div>
              <h3 className="font-semibold text-[#f1f5f9] mb-2">You see exactly what changed</h3>
              <p className="text-sm text-[#64748b] leading-relaxed">
                The dashboard shows which category drifted, by how much, and when it started — so you can act immediately.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 — LIVE DASHBOARD PREVIEW */}
      <section className="bg-[#0d1117] py-24 px-6 text-center">
        <h2 className="text-3xl font-bold text-[#f1f5f9] mb-4">
          See it live
        </h2>
        <p className="text-lg text-[#64748b] mb-10">
          Real behavioral data from real models, updated every week.
        </p>
        <Link href="/dashboard" className="inline-block bg-[#34d399] hover:bg-[#10b981] text-[#0f1117] font-semibold px-8 py-3 rounded-lg transition-colors">
          Open live dashboard &rarr;
        </Link>
        <p className="text-sm text-[#475569] mt-4">
          No signup required &middot; Free to use &middot; Open source
        </p>
      </section>

      {/* SECTION 5 — FOOTER */}
      <footer className="bg-[#0d1117] border-t border-[#1e2433] py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex flex-col items-center sm:items-start">
            <div className="flex items-center gap-2">
              <svg className="w-[18px] h-[18px] text-[#34d399]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"/>
                <line x1="16" y1="8" x2="2" y2="22"/>
                <line x1="17.5" y1="15" x2="9" y2="15"/>
              </svg>
              <span className="text-[#f1f5f9] font-semibold">Vigil</span>
            </div>
            <div className="text-xs text-[#475569] mt-2">
              &copy; 2026 Vigil. Open source.
            </div>
          </div>
          <div className="flex gap-6">
            <Link href="/dashboard" className="text-sm text-[#64748b] hover:text-[#f1f5f9] transition-colors">
              Dashboard
            </Link>
            <a href="#" className="text-sm text-[#64748b] hover:text-[#f1f5f9] transition-colors">
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
