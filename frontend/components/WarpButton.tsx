"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function WarpButton({ href, children }: { href: string, children: React.ReactNode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLButtonElement>(null);
  const [isActive, setIsActive] = useState(false);
  const router = useRouter();
  const isGoingRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: StreakParticle[] = [];
    
    // Resize handler for full-screen overlay
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    class StreakParticle {
      x: number;
      y: number;
      angle: number;
      speed: number;
      length: number;
      color: string;
      opacity: number;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.angle = Math.random() * Math.PI * 2;
        this.speed = Math.random() * 5 + 2;
        this.length = Math.random() * 20 + 10;
        this.color = Math.random() > 0.3 ? '#00f0ff' : '#ffffff';
        this.opacity = 1;
      }

      update() {
        this.speed *= 1.12; 
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        this.length *= 1.15; 
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x - Math.cos(this.angle) * this.length, this.y - Math.sin(this.angle) * this.length);
        ctx.stroke();
      }
    }

    const renderTransitionLoop = () => {
      if (!isGoingRef.current) return;
      
      // Motion blur trailing effect
      ctx.fillStyle = 'rgba(5, 5, 8, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (particles.length < 400 && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        for (let i = 0; i < 15; i++) {
          particles.push(new StreakParticle(centerX, centerY));
        }
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        p.draw();
        if (p.x < 0 || p.x > canvas.width || p.y < 0 || p.y > canvas.height) {
          particles.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(renderTransitionLoop);
    };

    if (isActive) {
      renderTransitionLoop();
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isActive]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isGoingRef.current) {
      isGoingRef.current = true;
      setIsActive(true);
      
      // Step 2: Trigger Quantum Gravity layout collapse
      const targets = document.querySelectorAll('.implode-target');
      targets.forEach((el) => {
        el.classList.add('gravity-collapse');
      });

      // Step 4: Delayed Redirect
      setTimeout(() => {
        router.push(href);
        // Reset state after navigation
        setTimeout(() => {
          isGoingRef.current = false;
          setIsActive(false);
          targets.forEach((el) => {
            el.classList.remove('gravity-collapse');
          });
        }, 800);
      }, 1600); // 1.6-second cinematic sweet spot
    }
  };

  return (
    <>
      <button 
        ref={containerRef}
        onClick={handleClick}
        className={`relative z-10 px-8 py-3 font-medium rounded-full cursor-pointer overflow-hidden transition-all duration-300 ${
          isActive 
            ? 'opacity-0 scale-0' 
            : 'bg-[#111111] border border-[#2a2a2a] text-[#f5f5f5] hover:bg-[#1a1a1a] hover:border-[#404040]'
        }`}
      >
        <span className="flex items-center gap-2 text-sm tracking-wide">
          {children}
        </span>
      </button>

      <canvas 
        ref={canvasRef} 
        className={`fixed top-0 left-0 w-full h-full z-50 pointer-events-none ${isActive ? 'opacity-100' : 'opacity-0'}`}
      />
    </>
  );
}
