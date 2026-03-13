import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Terminal, Server, Database, Network, Leaf } from "lucide-react";
 
/* ─── Cursor-reactive magnetic particle field ─── */
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -9999, y: -9999 });
  const frameRef = useRef<number>(0);
 
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
 
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);
 
    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    window.addEventListener("mousemove", onMove);
 
    // Build particles
    type Particle = {
      x: number; y: number;
      ox: number; oy: number;
      vx: number; vy: number;
      size: number;
      hue: number;
      speed: number;
    };
 
    const COUNT = 90;
    const particles: Particle[] = Array.from({ length: COUNT }, () => {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      return {
        x, y, ox: x, oy: y,
        vx: 0, vy: 0,
        size: 0.8 + Math.random() * 1.6,
        hue: Math.random() > 0.5 ? 258 : 190, // primary / accent hue
        speed: 0.3 + Math.random() * 0.5,
      };
    });
 
    // Connections between nearby particles
    const CONNECT_DIST = 110;
 
    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
 
      // Draw hex grid faintly
      const HEX = 52;
      ctx.beginPath();
      ctx.strokeStyle = "rgba(255,255,255,0.025)";
      ctx.lineWidth = 0.5;
      for (let row = -1; row < canvas.height / HEX + 1; row++) {
        for (let col = -1; col < canvas.width / (HEX * 1.732) + 1; col++) {
          const cx = col * HEX * 1.732 + (row % 2 === 0 ? 0 : HEX * 0.866);
          const cy = row * HEX * 1.5;
          for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i - Math.PI / 6;
            const nx = cx + HEX * 0.5 * Math.cos(angle);
            const ny = cy + HEX * 0.5 * Math.sin(angle);
            i === 0 ? ctx.moveTo(nx, ny) : ctx.lineTo(nx, ny);
          }
          ctx.closePath();
        }
      }
      ctx.stroke();
 
      // Update + draw particles
      for (const p of particles) {
        const dx = mouse.current.x - p.x;
        const dy = mouse.current.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const REPEL_R = 140;
 
        if (dist < REPEL_R) {
          const force = (REPEL_R - dist) / REPEL_R;
          p.vx -= (dx / dist) * force * 2.5;
          p.vy -= (dy / dist) * force * 2.5;
        }
 
        // Spring back to origin
        p.vx += (p.ox - p.x) * 0.04;
        p.vy += (p.oy - p.y) * 0.04;
 
        // Dampen
        p.vx *= 0.88;
        p.vy *= 0.88;
 
        p.x += p.vx;
        p.y += p.vy;
 
        // Slow float
        p.oy += Math.sin(Date.now() * 0.001 * p.speed) * 0.12;
 
        const alpha = 0.35 + Math.min(Math.abs(p.vx) + Math.abs(p.vy), 1) * 0.5;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 70%, 70%, ${alpha})`;
        ctx.fill();
      }
 
      // Draw connecting lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < CONNECT_DIST) {
            const alpha = (1 - d / CONNECT_DIST) * 0.12;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(160,140,255,${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
 
      frameRef.current = requestAnimationFrame(tick);
    };
 
    tick();
 
    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);
 
  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ opacity: 0.85 }}
    />
  );
}
 
/* ─── Falling data-stream columns ─── */
const STREAM_CHARS = "01アイウエオカキクケコABCDEF><{}[]";
function DataStreams() {
  const streams = Array.from({ length: 14 }, (_, i) => ({
    id: i,
    x: 48 + i * 3.8,   // % across screen, right-half skewed
    delay: i * 0.55,
    duration: 5 + (i % 4) * 1.5,
    chars: Array.from({ length: 10 }, () =>
      STREAM_CHARS[Math.floor(Math.random() * STREAM_CHARS.length)]
    ),
  }));
 
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {streams.map((s) => (
        <motion.div
          key={s.id}
          className="absolute flex flex-col items-center gap-[2px]"
          style={{
            left: `${s.x}%`,
            top: 0,
            fontFamily: "monospace",
            fontSize: "10px",
            letterSpacing: "0.05em",
            color: s.id % 2 === 0
              ? "hsl(var(--primary) / 0.22)"
              : "hsl(var(--accent) / 0.18)",
          }}
          initial={{ y: "-100%", opacity: 0 }}
          animate={{ y: "110%", opacity: [0, 0.9, 0.9, 0] }}
          transition={{
            duration: s.duration,
            repeat: Infinity,
            delay: s.delay,
            ease: "linear",
          }}
        >
          {s.chars.map((c, ci) => (
            <span
              key={ci}
              style={{
                opacity: ci === 0 ? 1 : 0.3 + (0.7 * (s.chars.length - ci)) / s.chars.length,
                color: ci === 0
                  ? (s.id % 2 === 0 ? "hsl(var(--primary) / 0.9)" : "hsl(var(--accent) / 0.85)")
                  : undefined,
              }}
            >
              {c}
            </span>
          ))}
        </motion.div>
      ))}
    </div>
  );
}
 
/* ─── Glowing corner bracket decorations ─── */
function CornerBrackets() {
  const bracketStyle = (pos: string): React.CSSProperties => ({
    position: "absolute",
    width: 28,
    height: 28,
    ...pos.includes("top") ? { top: 20 } : { bottom: 20 },
    ...pos.includes("left") ? { left: 20 } : { right: 20 },
    borderTop: pos.includes("top") ? "1.5px solid hsl(var(--primary) / 0.5)" : undefined,
    borderBottom: pos.includes("bottom") ? "1.5px solid hsl(var(--primary) / 0.5)" : undefined,
    borderLeft: pos.includes("left") ? "1.5px solid hsl(var(--primary) / 0.5)" : undefined,
    borderRight: pos.includes("right") ? "1.5px solid hsl(var(--primary) / 0.5)" : undefined,
  });
 
  return (
    <motion.div
      className="absolute inset-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2, delay: 1 }}
    >
      <div style={bracketStyle("top-left")} />
      <div style={bracketStyle("top-right")} />
      <div style={bracketStyle("bottom-left")} />
      <div style={bracketStyle("bottom-right")} />
    </motion.div>
  );
}
 
/* ─── Slow breathing spotlight ─── */
function Spotlight() {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        width: "80vw",
        height: "80vw",
        maxWidth: 900,
        maxHeight: 900,
        borderRadius: "50%",
        top: "50%",
        left: "60%",
        translateX: "-50%",
        translateY: "-50%",
        background:
          "radial-gradient(circle, hsl(var(--primary) / 0.07) 0%, hsl(var(--accent) / 0.04) 40%, transparent 70%)",
      }}
      animate={{ scale: [1, 1.12, 0.96, 1.06, 1], opacity: [0.6, 1, 0.7, 0.95, 0.6] }}
      transition={{ duration: 14, ease: "easeInOut", repeat: Infinity }}
    />
  );
}
 
/* ─── Floating status tags (top-right atmosphere) ─── */
function FloatingTags() {
  const tags = [
    { label: "TypeScript", delay: 0, x: "72%", y: "12%" },
    { label: "REST API", delay: 0.8, x: "84%", y: "28%" },
    { label: "PostgreSQL", delay: 1.6, x: "68%", y: "74%" },
    { label: "Next.js", delay: 2.4, x: "88%", y: "60%" },
  ];
 
  return (
    <>
      {tags.map((tag) => (
        <motion.div
          key={tag.label}
          className="absolute hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium"
          style={{
            left: tag.x,
            top: tag.y,
            border: "1px solid hsl(var(--primary) / 0.2)",
            background: "hsl(var(--primary) / 0.06)",
            color: "hsl(var(--primary) / 0.8)",
            backdropFilter: "blur(4px)",
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: [0, 0.85, 0.85, 0],
            scale: [0.8, 1, 1, 0.9],
            y: [0, -6, -6, -12],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            delay: tag.delay,
            repeatDelay: tags.length * 1.4,
            ease: "easeInOut",
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: "hsl(var(--primary) / 0.7)" }}
          />
          {tag.label}
        </motion.div>
      ))}
    </>
  );
}
 
/* ─── Main HeroSection ─── */
export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center pt-24 overflow-hidden"
    >
      {/* ══ BACKGROUND SYSTEM ══════════════════════════════ */}
      <div className="absolute inset-0 z-0 pointer-events-none">
 
        {/* Layer 0 — canvas: hex grid + magnetic particles */}
        <ParticleCanvas />
 
        {/* Layer 1 — breathing spotlight */}
        <Spotlight />
 
        {/* Layer 2 — falling matrix data streams */}
        <DataStreams />
 
        {/* Layer 3 — floating tech tags */}
        <FloatingTags />
 
        {/* Layer 4 — corner bracket UI chrome */}
        <CornerBrackets />
 
        {/* Layer 6 — depth gradient: left darkens for readability */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(105deg, hsl(var(--background) / 0.75) 0%, hsl(var(--background) / 0.4) 45%, transparent 70%)",
          }}
        />
 
        {/* Layer 7 — soft ambient orbs */}
        <div className="absolute top-1/3 left-1/3 w-[35rem] h-[35rem] bg-primary/8 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 right-1/5 w-[28rem] h-[28rem] bg-accent/8 rounded-full blur-[120px]" />
      </div>
 
      {/* ══ HERO CONTENT (unchanged) ═══════════════════════ */}
      <div className="container max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-medium mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Available for new opportunities
          </motion.div>
 
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl sm:text-6xl md:text-8xl font-bold leading-[1.1] tracking-tight mb-8"
          >
            Expert Full-Stack <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary text-glow">
              Developer.
            </span>
          </motion.h1>
 
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mb-12 font-sans"
          >
            I build secure, fast, and scalable admin dashboards, booking
            systems, and REST APIs using React, Node.js, and PostgreSQL. I
            deliver clean code, fast solutions, and business-ready features that
            save time and increase productivity.
          </motion.p>
 
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap items-center gap-4"
          >
            <button
              onClick={() =>
                document
                  .getElementById("projects")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="px-8 py-4 rounded-xl font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center gap-2"
            >
              View Projects <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() =>
                document
                  .getElementById("contact")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="px-8 py-4 rounded-xl font-semibold bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-white/5 transition-all duration-200"
            >
              Contact Me
            </button>
          </motion.div>
 
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-10 pt-8 border-t border-white/10 flex flex-wrap gap-8 text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <Terminal className="w-5 h-5 text-primary" />
              <span className="font-medium">React & Next.js</span>
            </div>
            <div className="flex items-center gap-2">
              <Server className="w-5 h-5 text-accent" />
              <span className="font-medium">Node.js APIs</span>
            </div>
            <div className="flex items-center gap-2">
              <Network className="w-5 h-5 text-primary" />
              <span className="font-medium">REST APIs</span>
            </div>
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-primary" />
              <span className="font-medium">PostgreSQL</span>
            </div>
            <div className="flex items-center gap-2">
              <Leaf className="w-5 h-5 text-accent" />
              <span className="font-medium">MongoDB</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}