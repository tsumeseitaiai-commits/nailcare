'use client';

import { useEffect, useRef } from 'react';

interface Dot {
  x: number; y: number;
  vx: number; vy: number;
  radius: number;
  alpha: number;
  color: string;
  score: number;
  showLabel: boolean;
  labelAlpha: number;
}

interface Line {
  points: { x: number; y: number }[];
  progress: number;
  speed: number;
  color: string;
  alpha: number;
}

export default function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let W = 0, H = 0;

    const colors = [
      'rgba(255,255,255,',
      'rgba(134,239,172,',  // emerald
      'rgba(147,197,253,',  // sky
      'rgba(253,186,116,',  // amber
    ];

    const dots: Dot[] = [];
    const lines: Line[] = [];

    const resize = () => {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width = W;
      canvas.height = H;
      initDots();
      initLines();
    };

    const initDots = () => {
      dots.length = 0;
      const count = Math.floor((W * H) / 14000);
      for (let i = 0; i < count; i++) {
        const colorBase = colors[Math.floor(Math.random() * colors.length)];
        dots.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          radius: Math.random() * 3 + 1.5,
          alpha: Math.random() * 0.6 + 0.2,
          color: colorBase,
          score: Math.floor(Math.random() * 40 + 55),
          showLabel: Math.random() > 0.65,
          labelAlpha: 0,
        });
      }
    };

    // 波形ライン生成
    const makeWaveLine = () => {
      const y = Math.random() * H * 0.8 + H * 0.1;
      const pts: { x: number; y: number }[] = [];
      const segments = 60;
      const amp = Math.random() * 30 + 10;
      const freq = Math.random() * 0.02 + 0.01;
      const phase = Math.random() * Math.PI * 2;
      for (let i = 0; i <= segments; i++) {
        const x = (i / segments) * W;
        pts.push({ x, y: y + Math.sin(x * freq + phase) * amp });
      }
      return pts;
    };

    const initLines = () => {
      lines.length = 0;
      for (let i = 0; i < 4; i++) {
        lines.push({
          points: makeWaveLine(),
          progress: Math.random(),
          speed: Math.random() * 0.001 + 0.0005,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: Math.random() * 0.15 + 0.05,
        });
      }
    };

    // グリッドライン描画
    const drawGrid = () => {
      ctx.save();
      const gridSize = 60;
      ctx.strokeStyle = 'rgba(255,255,255,0.04)';
      ctx.lineWidth = 1;
      for (let x = 0; x < W; x += gridSize) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }
      for (let y = 0; y < H; y += gridSize) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }
      // 軸ラベル風
      ctx.fillStyle = 'rgba(255,255,255,0.07)';
      ctx.font = '9px monospace';
      for (let x = gridSize; x < W; x += gridSize * 2) {
        ctx.fillText(String(Math.floor(x / 10)), x + 2, H - 4);
      }
      ctx.restore();
    };

    // 波形ライン描画
    const drawLines = () => {
      lines.forEach(line => {
        line.progress += line.speed;
        if (line.progress > 1) { line.progress = 0; line.points = makeWaveLine(); }
        const visible = Math.floor(line.progress * line.points.length);
        if (visible < 2) return;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(line.points[0].x, line.points[0].y);
        for (let i = 1; i < visible; i++) {
          ctx.lineTo(line.points[i].x, line.points[i].y);
        }
        ctx.strokeStyle = `${line.color}${line.alpha})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        // 先端グロー
        const tip = line.points[visible - 1];
        const grad = ctx.createRadialGradient(tip.x, tip.y, 0, tip.x, tip.y, 8);
        grad.addColorStop(0, `${line.color}0.6)`);
        grad.addColorStop(1, `${line.color}0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(tip.x, tip.y, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
    };

    // 散布図ドット
    const drawDots = () => {
      dots.forEach(dot => {
        dot.x += dot.vx; dot.y += dot.vy;
        if (dot.x < -20) dot.x = W + 20;
        if (dot.x > W + 20) dot.x = -20;
        if (dot.y < -20) dot.y = H + 20;
        if (dot.y > H + 20) dot.y = -20;

        // ドット本体
        const grd = ctx.createRadialGradient(dot.x, dot.y, 0, dot.x, dot.y, dot.radius * 2.5);
        grd.addColorStop(0, `${dot.color}${dot.alpha})`);
        grd.addColorStop(0.5, `${dot.color}${dot.alpha * 0.5})`);
        grd.addColorStop(1, `${dot.color}0)`);
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.radius * 2.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `${dot.color}${dot.alpha})`;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
        ctx.fill();

        // スコアラベル（一部）
        if (dot.showLabel) {
          dot.labelAlpha = Math.min(dot.labelAlpha + 0.005, dot.alpha * 0.8);
          ctx.save();
          ctx.font = 'bold 9px monospace';
          ctx.fillStyle = `${dot.color}${dot.labelAlpha})`;
          ctx.fillText(`${dot.score}`, dot.x + dot.radius + 3, dot.y - dot.radius);
          ctx.restore();
        }
      });
    };

    // ドット間の接続線
    const drawConnections = () => {
      const maxDist = 100;
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x;
          const dy = dots[i].y - dots[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            const a = (1 - dist / maxDist) * 0.08;
            ctx.strokeStyle = `rgba(255,255,255,${a})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(dots[i].x, dots[i].y);
            ctx.lineTo(dots[j].x, dots[j].y);
            ctx.stroke();
          }
        }
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      drawGrid();
      drawLines();
      drawConnections();
      drawDots();
      animId = requestAnimationFrame(draw);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();
    draw();

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
}
