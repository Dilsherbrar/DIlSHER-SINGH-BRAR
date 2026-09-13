import React, { useEffect, useRef } from 'react';
import { FloatingParticle, FloatingScoreText } from '../types';

interface ParticleLayerProps {
  particles: FloatingParticle[];
  scoreTexts: FloatingScoreText[];
}

export const ParticleLayer: React.FC<ParticleLayerProps> = ({ particles, scoreTexts }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha));

        if (p.type === 'wood' || p.shape === 'chip') {
          // Wooden splinter chip
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.roundRect(-p.size / 2, -p.size / 4, p.size, p.size / 2, 2);
          ctx.fill();
          ctx.strokeStyle = '#5a2d0c';
          ctx.lineWidth = 1;
          ctx.stroke();
        } else if (p.type === 'star' || p.shape === 'star') {
          // Cartoon 5-point star
          ctx.fillStyle = p.color;
          drawStar(ctx, 0, 0, 5, p.size, p.size / 2);
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        } else if (p.type === 'coin') {
          // Golden coin
          ctx.fillStyle = '#f1c40f';
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#e67e22';
          ctx.lineWidth = 2;
          ctx.stroke();
        } else {
          // Confetti / sparkle
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [particles]);

  // Sync canvas size to container
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Floating score / praise texts */}
      {scoreTexts.map((item) => (
        <div
          key={item.id}
          className="absolute font-black text-2xl md:text-3xl tracking-wide drop-shadow-[0_4px_6px_rgba(0,0,0,0.3)] animate-float-slow select-none whitespace-nowrap"
          style={{
            left: `${item.x}px`,
            top: `${item.y}px`,
            color: item.color,
            transform: 'translate(-50%, -50%)',
            textShadow: '0 2px 0 #000, 0 0 12px rgba(255,255,255,0.8)',
          }}
        >
          {item.text}
        </div>
      ))}
    </div>
  );
};

function drawStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  spikes: number,
  outerRadius: number,
  innerRadius: number
) {
  let rot = (Math.PI / 2) * 3;
  let x = cx;
  let y = cy;
  const step = Math.PI / spikes;

  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
}
