"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function WarpButton({ href, children }: { href: string, children: React.ReactNode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLButtonElement>(null);
  const placeholderRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);
  const router = useRouter();
  const isGoingRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const NUM_PARTICLES = 100; // Increased for fullscreen
    const MAX_Z = 2;
    const MAX_R = 2.5;
    const Z_SPD = 3; // Faster warp
    const PARTICLES: Particle[] = [];
    
    let W = container.offsetWidth;
    let H = container.offsetHeight;
    canvas.width = W;
    canvas.height = H;
    let XO = W / 2;
    let YO = H / 2;
    let animationFrameId: number;

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
        this.vel.scale(0.01);
        this.fill = "rgba(255,255,255,0.4)";
        this.stroke = this.fill;
      }
      update() { this.pos.add(this.vel); }
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

    const createParticles = () => {
      PARTICLES.length = 0; // Clear array
      for (let i = 0; i < NUM_PARTICLES; i++) {
        const X = Math.random() * W, Y = Math.random() * H, Z = Math.random() * MAX_Z;
        PARTICLES.push(new Particle(X, Y, Z));
      }
    };

    function render() {
      for (let i = 0; i < PARTICLES.length; i++) {
        PARTICLES[i].render();
      }
    }

    function loop() {
      animationFrameId = requestAnimationFrame(loop);
      if (ctx) {
        if (isGoingRef.current) {
          ctx.fillStyle = "rgba(0,0,0,0.2)";
          ctx.fillRect(0, 0, W, H);
          render();
        } else {
          ctx.clearRect(0, 0, W, H);
        }
      }
    }

    // Handle dynamic resize for when it expands to fullscreen
    const handleResize = () => {
      if (!container) return;
      W = container.offsetWidth;
      H = container.offsetHeight;
      canvas.width = W;
      canvas.height = H;
      XO = W / 2;
      YO = H / 2;
    };
    
    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(container);

    createParticles();
    loop();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isGoingRef.current && containerRef.current && placeholderRef.current) {
      isGoingRef.current = true;
      setIsActive(true);
      
      const btn = containerRef.current;
      const placeholder = placeholderRef.current;
      const rect = btn.getBoundingClientRect();
      
      // Set placeholder dimensions to maintain layout
      placeholder.style.width = `${rect.width}px`;
      placeholder.style.height = `${rect.height}px`;

      // Flip button to fixed position over its exact current spot
      btn.style.position = 'fixed';
      btn.style.top = `${rect.top}px`;
      btn.style.left = `${rect.left}px`;
      btn.style.width = `${rect.width}px`;
      btn.style.height = `${rect.height}px`;
      btn.style.margin = '0';
      btn.style.zIndex = '9999';

      // Force reflow
      void btn.offsetHeight;

      // Animate to cover the whole screen
      btn.style.transition = 'all 1s cubic-bezier(0.7, 0, 0.3, 1)';
      btn.style.top = '0px';
      btn.style.left = '0px';
      btn.style.width = '100vw';
      btn.style.height = '100vh';
      btn.style.borderRadius = '0px';
      
      // Navigate after the animation finishes
      setTimeout(() => {
        router.push(href);
        // Reset state slightly after routing
        setTimeout(() => {
          isGoingRef.current = false;
          setIsActive(false);
          // Restore inline styles
          btn.style.position = '';
          btn.style.top = '';
          btn.style.left = '';
          btn.style.width = '';
          btn.style.height = '';
          btn.style.margin = '';
          btn.style.zIndex = '';
          btn.style.transition = '';
          btn.style.borderRadius = '';
          placeholder.style.width = '0px';
          placeholder.style.height = '0px';
        }, 800);
      }, 1000);
    }
  };

  return (
    <>
      <div ref={placeholderRef} className="hidden-placeholder" style={{ width: 0, height: 0 }} />
      <button 
        ref={containerRef}
        onClick={handleClick}
        className={`relative border cursor-pointer overflow-hidden flex items-center justify-center transition-colors duration-300 ${
          isActive 
            ? 'bg-black border-transparent' 
            : 'px-8 py-3 rounded-full bg-[#111111] border-[#2a2a2a] hover:bg-[#1a1a1a] hover:border-[#404040]'
        }`}
      >
        <span 
          className={`relative z-10 flex items-center gap-2 text-sm font-medium transition-all duration-700 ${
            isActive ? 'opacity-0 scale-150' : 'text-[#f5f5f5] opacity-100 scale-100'
          }`}
        >
          {children}
        </span>
        <canvas 
          ref={canvasRef} 
          className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none"
        />
      </button>
    </>
  );
}
