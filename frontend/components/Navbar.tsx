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
      <header 
        className="h-[52px] w-full px-6 sticky top-0 z-50 flex items-center justify-between"
        style={{ 
          background: 'rgba(10,10,10,0.85)', 
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid #1c1c1c'
        }}
      >
        {/* LEFT - Logo */}
        <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity" onClick={() => setActiveModal(null)}>
          <svg viewBox="0 0 100 110" className="w-[28px] h-[31px]" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M 22 48 L 35 18 L 50 10 L 65 18 L 78 48 C 78 75, 65 95, 50 108 C 35 95, 22 75, 22 48 Z"
              fill="none"
              stroke="#34d399"
              strokeWidth="3.5"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            <path
              d="M 30 62 Q 50 42 70 62"
              fill="none"
              stroke="#34d399"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M 30 62 Q 50 82 70 62"
              fill="none"
              stroke="#34d399"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M 50 52 L 58 62 L 50 72 L 42 62 Z"
              fill="none"
              stroke="#34d399"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-[#f5f5f5] font-semibold text-base tracking-wide">
            Vigil
          </span>
        </Link>

        {/* CENTER - Nav */}
        <nav className="flex gap-6 items-center">
          <button 
            onMouseEnter={() => setActiveModal('features')}
            onClick={() => setActiveModal(activeModal === 'features' ? null : 'features')}
            className={`text-sm transition-colors ${activeModal === 'features' ? 'text-[#34d399]' : 'text-[#737373] hover:text-[#f5f5f5]'}`}
          >
            Features
          </button>
          <button 
            onMouseEnter={() => setActiveModal('how-it-works')}
            onClick={() => setActiveModal(activeModal === 'how-it-works' ? null : 'how-it-works')}
            className={`text-sm transition-colors ${activeModal === 'how-it-works' ? 'text-[#34d399]' : 'text-[#737373] hover:text-[#f5f5f5]'}`}
          >
            How it Works
          </button>
        </nav>

        {/* RIGHT - GitHub */}
        <a href="https://github.com/Akshat1322/vigil" target="_blank" rel="noreferrer" className="text-sm text-[#737373] hover:text-[#f5f5f5] transition-colors">
          GitHub ↗
        </a>
      </header>

      {/* MODAL OVERLAY */}
      {activeModal && (
        <div 
          className="fixed inset-0 z-40 flex items-center justify-center p-6 pt-[52px]"
          style={{ 
            background: 'rgba(5, 5, 5, 0.7)', 
            backdropFilter: 'blur(8px)',
            animation: 'fadeIn 0.2s ease-out'
          }}
          onClick={() => setActiveModal(null)}
        >
          <div 
            className="relative w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
            style={{
              animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            {/* Close Button */}
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute -top-12 right-0 text-[#737373] hover:text-[#f5f5f5] transition-colors text-sm font-medium tracking-wider"
            >
              [ ESC TO CLOSE ]
            </button>

            {activeModal === 'how-it-works' && (
              <div className="card-grid-texture border border-[#1c1c1c] rounded-xl p-10 shadow-2xl">
                <div className="text-center mb-10">
                  <h2 className="text-2xl font-bold text-[#f5f5f5] mb-2">
                    The silent problem with LLM APIs
                  </h2>
                  <p className="text-[#a1a1a1]">
                    You didn't change anything. But something changed.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    {
                      icon: '🔄',
                      title: 'Silent model updates',
                      body: 'OpenAI, Google, and Anthropic update models under the same API endpoint without announcement.'
                    },
                    {
                      icon: '📉',
                      title: 'Behavior shifts go unnoticed',
                      body: 'Your JSON format breaks. Your bot sounds different. A safety check stops working. Nobody knows why.'
                    },
                    {
                      icon: '⏰',
                      title: 'You find out from users',
                      body: 'By the time support tickets arrive, the damage is done. You need to know first.'
                    }
                  ].map((card) => (
                    <div key={card.title} className="bg-[#111] border border-[#2a2a2a] rounded-lg p-6 hover:border-[#3a3a3a] transition-colors">
                      <div className="text-3xl mb-4">{card.icon}</div>
                      <h3 className="font-semibold text-[#f5f5f5] mb-3 text-lg">{card.title}</h3>
                      <p className="text-[#737373] text-sm leading-relaxed">{card.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeModal === 'features' && (
              <div className="card-grid-texture border border-[#1c1c1c] rounded-xl p-10 md:p-14 shadow-2xl max-w-3xl mx-auto">
                <h2 className="text-2xl font-bold text-[#f5f5f5] text-center mb-10">
                  How Vigil works
                </h2>
                
                <div className="flex flex-col gap-8">
                  {[
                    {
                      num: '01',
                      title: 'We run 100 behavioral checks weekly',
                      body: 'A suite of prompts covering factual accuracy, format adherence, instruction following, and response consistency — run against your model every Monday.'
                    },
                    {
                      num: '02', 
                      title: 'Statistical drift detection fires',
                      body: 'We use Z-score and Cohen\'s d to separate real behavioral changes from normal random variation. No false alarms.'
                    },
                    {
                      num: '03',
                      title: 'You see exactly what changed',
                      body: 'The dashboard shows which category drifted, by how much, and when it started — so you can act immediately.'
                    }
                  ].map((step) => (
                    <div key={step.num} className="flex gap-5 items-start">
                      <div className="w-10 h-10 rounded-full bg-[rgba(52,211,153,0.1)] border border-[rgba(52,211,153,0.3)] text-[#34d399] flex items-center justify-center flex-shrink-0 font-medium text-sm">
                        {step.num}
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#f5f5f5] mb-2 text-lg">{step.title}</h3>
                        <p className="text-[#a1a1a1] text-sm leading-relaxed">{step.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}} />
    </>
  );
}
