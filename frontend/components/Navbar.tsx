"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';

type ModalState = 'features' | 'how-it-works' | null;

export default function Navbar() {
  const [activeModal, setActiveModal] = useState<ModalState>(null);

  // Close modal on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveModal(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 pt-5 px-6 flex justify-between items-center pointer-events-none">
        
        {/* Left: Logo */}
        <div className="pointer-events-auto">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity" onClick={() => setActiveModal(null)}>
            <div className="w-8 h-8 bg-[#f5f5f5] rounded-full flex items-center justify-center">
              <svg viewBox="0 0 100 110" className="w-[16px] h-[18px]" xmlns="http://www.w3.org/2000/svg">
                <path d="M 22 48 L 35 18 L 50 10 L 65 18 L 78 48 C 78 75, 65 95, 50 108 C 35 95, 22 75, 22 48 Z" fill="none" stroke="#000" strokeWidth="8" strokeLinejoin="round" strokeLinecap="round" />
                <path d="M 50 52 L 58 62 L 50 72 L 42 62 Z" fill="none" stroke="#000" strokeWidth="8" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-[#f5f5f5] font-semibold text-sm tracking-wide hidden sm:block">Vigil</span>
          </Link>
        </div>

        {/* Center: Floating Pill Navbar */}
        <nav className="pointer-events-auto hidden md:flex items-center gap-8 bg-[#111111]/50 backdrop-blur-lg border border-[#2a2a2a] rounded-full px-8 py-3 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
          <Link href="/" className="text-xs font-medium text-[#f5f5f5] hover:text-[#34d399] transition-colors">Home</Link>
          <Link href="/dashboard" className="text-xs font-medium text-[#a1a1a1] hover:text-[#f5f5f5] transition-colors">Dashboard</Link>
          <button 
            onMouseEnter={() => setActiveModal('features')}
            onClick={() => setActiveModal(activeModal === 'features' ? null : 'features')}
            className={`text-xs font-medium transition-colors ${activeModal === 'features' ? 'text-[#34d399]' : 'text-[#a1a1a1] hover:text-[#f5f5f5]'}`}
          >
            Features
          </button>
          <button 
            onMouseEnter={() => setActiveModal('how-it-works')}
            onClick={() => setActiveModal(activeModal === 'how-it-works' ? null : 'how-it-works')}
            className={`text-xs font-medium transition-colors ${activeModal === 'how-it-works' ? 'text-[#34d399]' : 'text-[#a1a1a1] hover:text-[#f5f5f5]'}`}
          >
            How it Works
          </button>
        </nav>

        {/* Right: GitHub / Mobile Menu Trigger */}
        <div className="pointer-events-auto flex items-center gap-4">
          <a href="https://github.com/Akshat1322/vigil" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs font-medium text-[#f5f5f5] hover:text-[#34d399] transition-colors">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            <span className="hidden sm:block">Star on GitHub</span>
          </a>
        </div>
      </header>

      {/* MODAL OVERLAY */}
      {activeModal && (
        <div 
          className="fixed inset-0 z-40 flex items-center justify-center p-4 md:p-6 pt-[80px]"
          style={{ 
            background: 'rgba(5, 5, 5, 0.8)', 
            backdropFilter: 'blur(12px)',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveModal(null);
          }}
        >
          <div 
            className="relative w-full max-w-4xl mx-auto"
            onMouseLeave={() => setActiveModal(null)}
          >
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 md:-top-12 md:right-0 text-[#737373] hover:text-[#f5f5f5] transition-colors z-50 p-2"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {activeModal === 'how-it-works' && (
              <div className="card-grid-texture border border-[#2a2a2a] bg-[#0a0a0a] rounded-2xl p-6 md:p-10 shadow-2xl w-[95vw] md:w-full max-h-[80vh] overflow-y-auto mx-auto relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#34d399] to-transparent opacity-50"></div>
                <div className="text-center mb-10 mt-4">
                  <h2 className="text-2xl font-bold text-[#f5f5f5] mb-2">
                    The silent problem with LLM APIs
                  </h2>
                  <p className="text-[#9ca3af]">Why standard monitoring isn't enough</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Step 1 */}
                  <div className="bg-[#111] border border-[#1c1c1c] rounded-lg p-6 relative">
                    <div className="text-4xl font-black text-[#1c1c1c] absolute top-4 right-4 z-0">01</div>
                    <div className="relative z-10">
                      <div className="w-10 h-10 rounded-full bg-[#f87171]/10 flex items-center justify-center mb-4">
                        <span className="text-[#f87171]">⚠️</span>
                      </div>
                      <h3 className="text-white font-semibold mb-2">Silent Updates</h3>
                      <p className="text-sm text-[#9ca3af] leading-relaxed">
                        Providers update their models behind the scenes. Your prompts that worked perfectly yesterday suddenly break today, with no changelog or warning.
                      </p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="bg-[#111] border border-[#1c1c1c] rounded-lg p-6 relative">
                    <div className="text-4xl font-black text-[#1c1c1c] absolute top-4 right-4 z-0">02</div>
                    <div className="relative z-10">
                      <div className="w-10 h-10 rounded-full bg-[#60a5fa]/10 flex items-center justify-center mb-4">
                        <span className="text-[#60a5fa]">📊</span>
                      </div>
                      <h3 className="text-white font-semibold mb-2">Weekly Checks</h3>
                      <p className="text-sm text-[#9ca3af] leading-relaxed">
                        Vigil runs a rigorous 100-prompt test suite every Monday across all major models to establish a consistent baseline of expected behavior.
                      </p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="bg-[#111] border border-[#1c1c1c] rounded-lg p-6 relative">
                    <div className="text-4xl font-black text-[#1c1c1c] absolute top-4 right-4 z-0">03</div>
                    <div className="relative z-10">
                      <div className="w-10 h-10 rounded-full bg-[#34d399]/10 flex items-center justify-center mb-4">
                        <span className="text-[#34d399]">🎯</span>
                      </div>
                      <h3 className="text-white font-semibold mb-2">Statistical Alerts</h3>
                      <p className="text-sm text-[#9ca3af] leading-relaxed">
                        Instead of noisy alerts, Vigil uses Z-scores and Cohen's d to filter out normal LLM variance, only alerting you when real drift occurs.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeModal === 'features' && (
              <div className="card-grid-texture border border-[#2a2a2a] bg-[#0a0a0a] rounded-2xl p-6 md:p-14 shadow-2xl max-w-3xl mx-auto w-[95vw] md:w-full max-h-[80vh] overflow-y-auto relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#34d399] to-transparent opacity-50"></div>
                <h2 className="text-2xl font-bold text-[#f5f5f5] text-center mb-10 mt-4">
                  How Vigil works
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                  <div className="flex gap-4 items-start">
                    <div className="mt-1 w-6 h-6 rounded-full border border-[#34d399]/30 flex items-center justify-center shrink-0">
                      <div className="w-2 h-2 bg-[#34d399] rounded-full"></div>
                    </div>
                    <div>
                      <h3 className="text-[#f5f5f5] font-medium mb-1">Fixed Baselines</h3>
                      <p className="text-sm text-[#737373] leading-relaxed">
                        Baselines are locked, not rolling. This prevents gradual drift from hiding itself over time.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 items-start">
                    <div className="mt-1 w-6 h-6 rounded-full border border-[#34d399]/30 flex items-center justify-center shrink-0">
                      <div className="w-2 h-2 bg-[#34d399] rounded-full"></div>
                    </div>
                    <div>
                      <h3 className="text-[#f5f5f5] font-medium mb-1">Semantic Similarity</h3>
                      <p className="text-sm text-[#737373] leading-relaxed">
                        Uses sentence-transformers to catch meaning drift, even when response length stays identical.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="mt-1 w-6 h-6 rounded-full border border-[#34d399]/30 flex items-center justify-center shrink-0">
                      <div className="w-2 h-2 bg-[#34d399] rounded-full"></div>
                    </div>
                    <div>
                      <h3 className="text-[#f5f5f5] font-medium mb-1">Dual Thresholds</h3>
                      <p className="text-sm text-[#737373] leading-relaxed">
                        Requires both a high Z-score (unlikely to be noise) and a high Cohen's d (practical significance) to trigger.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="mt-1 w-6 h-6 rounded-full border border-[#34d399]/30 flex items-center justify-center shrink-0">
                      <div className="w-2 h-2 bg-[#34d399] rounded-full"></div>
                    </div>
                    <div>
                      <h3 className="text-[#f5f5f5] font-medium mb-1">Format Adherence</h3>
                      <p className="text-sm text-[#737373] leading-relaxed">
                        Strict deterministic checks ensure your model still outputs valid JSON exactly as instructed.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
