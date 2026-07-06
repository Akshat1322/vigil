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

    let W = window.innerWidth;
    let H = window.innerHeight;
    let XO = W / 2;
    let YO = H / 2;
    let animationFrameId: number;

    const NUM_PARTICLES = 150;
    const MAX_Z = 2;
    const MAX_R = 3;
    const Z_SPD = 2;
    
    // Resize handler for full-screen overlay
    const handleResize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W;
      canvas.height = H;
      XO = W / 2;
      YO = H / 2;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    class Vector {
      x: number; y: number; z: number;
      constructor(x: number, y: number, z: number) {
        this.x = x; this.y = y; this.z = z;
      }
      add(v: Vector) { this.x += v.x; this.y += v.y; this.z += v.z; }
      scale(n: number) { this.x *= n; this.y *= n; this.z *= n; }
    }

    class Particle {
      pos: Vector;
      vel: Vector;
      fill: string;
      stroke: string;
      constructor(x: number, y: number, z: number) {
        this.pos = new Vector(x, y, z);
        this.vel = new Vector(0, 0, -Z_SPD);
        this.vel.scale(0.02);
        this.fill = "rgba(255,255,255,0.7)";
        this.stroke = this.fill;
      }

      update() {
        this.pos.add(this.vel);
      }

      render() {
        const PIXEL = to2d(this.pos);
        const X = PIXEL[0], Y = PIXEL[1];
        const R = ((MAX_Z - this.pos.z) / MAX_Z) * MAX_R;

        if (X < 0 || X > W || Y < 0 || Y > H) this.pos.z = MAX_Z;

        this.update();
        if (ctx) {
          ctx.beginPath();
          ctx.fillStyle = this.fill;
          ctx.strokeStyle = this.stroke;
          ctx.arc(X, Y, R, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          ctx.closePath();
        }
      }
    }

    function to2d(v: Vector) {
      const X_COORD = v.x - XO, Y_COORD = v.y - YO, PX = X_COORD / v.z, PY = Y_COORD / v.z;
      return [PX + XO, PY + YO];
    }

    const PARTICLES: Particle[] = [];
    const createParticles = () => {
      PARTICLES.length = 0;
      for (let i = 0; i < NUM_PARTICLES; i++) {
        const X = Math.random() * W, Y = Math.random() * H, Z = Math.random() * MAX_Z;
        PARTICLES.push(new Particle(X, Y, Z));
      }
    };
    
    createParticles();

    const renderTransitionLoop = () => {
      if (!isGoingRef.current) return;
      
      // Motion blur trailing effect
      ctx.fillStyle = 'rgba(5, 5, 8, 0.2)';
      ctx.fillRect(0, 0, W, H);

      for (let i = 0; i < PARTICLES.length; i++) {
        PARTICLES[i].render();
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
      
      const targets = document.querySelectorAll('.black-hole-target');
      targets.forEach((el) => {
        el.classList.add('black-hole-suck');
      });

      setTimeout(() => {
        router.push(href);
        setTimeout(() => {
          isGoingRef.current = false;
          setIsActive(false);
          targets.forEach((el) => {
            el.classList.remove('black-hole-suck');
          });
        }, 800);
      }, 1600);
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
        className={`fixed top-0 left-0 w-full h-full z-50 pointer-events-none transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`}
      />
    </>
  );
}
