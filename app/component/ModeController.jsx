"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import MainPage from "./MainPage";
import ProfessionalMode from "./ProfessionalMode";

// ─── Black Hole Canvas ─────────────────────────────────────────────────────────
function BlackHoleCanvas({ canvasRef }) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    const W = () => canvas.width;
    const H = () => canvas.height;
    const CX = () => W() / 2;
    const CY = () => H() / 2;

    // ── Helpers ──
    const easeIn = (t, p = 3) => Math.pow(t, p);
    const easeOut = (t, p = 3) => 1 - Math.pow(1 - t, p);
    const lerp = (a, b, t) => a + (b - a) * t;
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

    // ── Stars ──
    const STARS = 220;
    const stars = Array.from({ length: STARS }, () => ({
      x: Math.random() * 1920,
      y: Math.random() * 1080,
      s: Math.random() * 1.4 + 0.3,
      b: Math.random(),
    }));

    // ── Accretion disk particles ──
    const DISK_N = 700;
    const disk = Array.from({ length: DISK_N }, (_, i) => ({
      ang: (i / DISK_N) * Math.PI * 2,
      r: 1.02 + Math.random() * 0.53,
      speed: 0.003 + Math.random() * 0.006,
      brightness: 0.3 + Math.random() * 0.7,
      size: 0.4 + Math.random() * 1.0,
      drift: (Math.random() - 0.5) * 0.0002,
    }));

    // ── Shared draw state (written by event handler) ──
    let holeR = 0;
    let diskR = 0;
    let lensR = 0;
    let phase = "idle";
    let animT = 0;
    let globalT = 0;

    const handler = (e) => {
      ({ holeR, diskR, lensR, phase, animT } = e.detail);
    };
    canvas.addEventListener("bh-state", handler);

    // ── Render loop ──
    let raf;
    function loop(ts) {
      raf = requestAnimationFrame(loop);
      globalT = ts * 0.001;

      const cw = W(),
        ch = H(),
        cx = CX(),
        cy = CY();
      ctx.clearRect(0, 0, cw, ch);

      // Stars — gravitationally lensed
      stars.forEach((st) => {
        const sx = (st.x / 1920) * cw;
        const sy = (st.y / 1080) * ch;
        if (holeR < 2) {
          ctx.beginPath();
          ctx.arc(sx, sy, st.s, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${st.b * 0.7})`;
          ctx.fill();
          return;
        }
        const dx = sx - cx,
          dy = sy - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < holeR) return;
        const pull = clamp(Math.pow(lensR / dist, 2.5), 0, 0.85);
        const nx = sx + (cx - sx) * pull * 0.4;
        const ny = sy + (cy - sy) * pull * 0.4;
        const dimmed = st.b * (1 - pull * 0.7);
        ctx.beginPath();
        ctx.arc(nx, ny, st.s, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${dimmed * 0.6})`;
        ctx.fill();
      });

      if (holeR < 2) return;

      // Gravitational lensing glow
      if (lensR > holeR) {
        const lg = ctx.createRadialGradient(
          cx,
          cy,
          holeR * 0.85,
          cx,
          cy,
          lensR * 1.3,
        );
        lg.addColorStop(0, "rgba(255,255,255,0)");
        lg.addColorStop(0.35, "rgba(240,230,210,0.06)");
        lg.addColorStop(0.55, "rgba(220,200,170,0.12)");
        lg.addColorStop(0.68, "rgba(255,245,220,0.18)");
        lg.addColorStop(0.78, "rgba(255,255,255,0.08)");
        lg.addColorStop(1, "rgba(0,0,0,0)");
        ctx.beginPath();
        ctx.arc(cx, cy, lensR * 1.3, 0, Math.PI * 2);
        ctx.fillStyle = lg;
        ctx.fill();
      }

      // Accretion disk — front half
      if (diskR > holeR + 2) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(1, 0.28);
        disk.forEach((p) => {
          p.ang += p.speed * (1 + (phase === "pulling" ? animT * 3 : 0));
          p.r += p.drift;
          if (p.r < 1.02) p.r = 1.02;
          if (p.r > 1.55) p.r = 1.02 + Math.random() * 0.1;

          if (Math.sin(p.ang) <= 0) return; // back half drawn later

          const pr = holeR * p.r;
          const px = Math.cos(p.ang) * pr;
          const py = Math.sin(p.ang) * pr;
          const doppler = 0.5 + Math.cos(p.ang) * 0.5;
          const bright = p.brightness * (0.4 + doppler * 0.6);

          ctx.beginPath();
          ctx.arc(px, py, p.size, 0, Math.PI * 2);
          ctx.fillStyle =
            doppler > 0.5
              ? `rgba(255,${Math.floor(lerp(180, 255, doppler))},${Math.floor(lerp(80, 200, doppler))},${bright * 0.85})`
              : `rgba(${Math.floor(lerp(120, 255, bright))},${Math.floor(lerp(80, 200, bright))},${Math.floor(lerp(60, 120, bright))},${bright * 0.6})`;
          ctx.fill();
        });
        ctx.restore();
      }

      // Photon ring
      const photonR = holeR * 1.08;
      const pRing = ctx.createRadialGradient(
        cx,
        cy,
        holeR * 0.96,
        cx,
        cy,
        photonR * 1.25,
      );
      pRing.addColorStop(0, "rgba(0,0,0,0)");
      pRing.addColorStop(0.3, "rgba(255,240,200,0.22)");
      pRing.addColorStop(0.55, "rgba(255,250,230,0.45)");
      pRing.addColorStop(0.72, "rgba(255,240,200,0.22)");
      pRing.addColorStop(1, "rgba(0,0,0,0)");
      ctx.beginPath();
      ctx.arc(cx, cy, photonR * 1.25, 0, Math.PI * 2);
      ctx.fillStyle = pRing;
      ctx.fill();

      // Event horizon — absolute black
      ctx.beginPath();
      ctx.arc(cx, cy, holeR, 0, Math.PI * 2);
      ctx.fillStyle = "#000";
      ctx.fill();

      // Accretion disk — back half (drawn over event horizon)
      if (diskR > holeR + 2) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(1, 0.28);
        disk.forEach((p) => {
          if (Math.sin(p.ang) > 0) return;
          const pr = holeR * p.r;
          const px = Math.cos(p.ang) * pr;
          const py = Math.sin(p.ang) * pr;
          const doppler = 0.5 + Math.cos(p.ang) * 0.5;
          const bright = p.brightness * (0.25 + doppler * 0.4);
          ctx.beginPath();
          ctx.arc(px, py, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,${Math.floor(lerp(160, 230, doppler))},${Math.floor(lerp(60, 160, doppler))},${bright * 0.5})`;
          ctx.fill();
        });
        ctx.restore();
      }

      // Tidal streaks
      if (phase === "pulling" && animT > 0.1) {
        const streakAlpha = easeIn(animT) * 0.35;
        for (let i = 0; i < 8; i++) {
          const ang = (i / 8) * Math.PI * 2 + globalT * 0.4;
          const r0 = holeR * 1.15;
          const r1 = holeR * 2.8 + animT * 60;
          ctx.save();
          ctx.globalAlpha =
            streakAlpha * (0.5 + 0.5 * Math.sin(globalT * 2 + i));
          ctx.beginPath();
          ctx.moveTo(cx + Math.cos(ang) * r0, cy + Math.sin(ang) * r0 * 0.25);
          ctx.lineTo(
            cx + Math.cos(ang + 0.06) * r1,
            cy + Math.sin(ang + 0.06) * r1 * 0.25,
          );
          const sg = ctx.createLinearGradient(
            cx + Math.cos(ang) * r0,
            cy + Math.sin(ang) * r0 * 0.25,
            cx + Math.cos(ang) * r1,
            cy + Math.sin(ang) * r1 * 0.25,
          );
          sg.addColorStop(0, "rgba(255,240,200,0.8)");
          sg.addColorStop(1, "rgba(255,240,200,0)");
          ctx.strokeStyle = sg;
          ctx.lineWidth = 0.8;
          ctx.stroke();
          ctx.restore();
        }
      }

      // Vignette
      const vigAmt = clamp(holeR / 180, 0, 1);
      if (vigAmt > 0) {
        const vg = ctx.createRadialGradient(
          cx,
          cy,
          ch * 0.2,
          cx,
          cy,
          ch * 0.85,
        );
        vg.addColorStop(0, "rgba(0,0,0,0)");
        vg.addColorStop(1, `rgba(0,0,0,${vigAmt * 0.7})`);
        ctx.fillStyle = vg;
        ctx.fillRect(0, 0, cw, ch);
      }
    }

    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener("bh-state", handler);
      window.removeEventListener("resize", resize);
    };
  }, [canvasRef]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 99999,
        background: "transparent",
      }}
    />
  );
}

// ─── Enter Pro Button ──────────────────────────────────────────────────────────
const EnterProButton = ({ onClick }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "fixed",
        bottom: 80,
        right: 24,
        zIndex: 500,
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 18px",
        background: "transparent",
        border: `1px solid ${hovered ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.18)"}`,
        borderRadius: 2,
        color: hovered ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.5)",
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 10,
        letterSpacing: "0.12em",
        cursor: "pointer",
        transition: "color 0.2s, border-color 0.2s",
      }}
    >
      ENTER PROFESSIONAL MODE
    </button>
  );
};

// ─── Main Controller ───────────────────────────────────────────────────────────
export default function ModeController() {
  const [mode, setMode] = useState("personal");
  const [renderPro, setRenderPro] = useState(false);
  const canvasRef = useRef(null);
  const busyRef = useRef(false);
  const persRef = useRef(null);
  const proRef = useRef(null);

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const easeIn = (t, p = 3) => Math.pow(t, p);
  const easeOut = (t, p = 3) => 1 - Math.pow(1 - t, p);

  function dispatch(holeR, diskR, lensR, phase, animT) {
    canvasRef.current?.dispatchEvent(
      new CustomEvent("bh-state", {
        detail: { holeR, diskR, lensR, phase, animT },
      }),
    );
  }

  function applyPageStyle(el, scale, opacity, blur) {
    if (!el) return;
    el.style.transform = `scale(${scale})`;
    el.style.opacity = opacity;
    el.style.filter = blur > 0 ? `blur(${blur}px)` : "";
    el.style.willChange = "transform, opacity, filter";
  }

  function tween(duration, onTick, onDone) {
    const start = performance.now();
    function tick(now) {
      const t = clamp((now - start) / duration, 0, 1);
      onTick(t);
      if (t < 1) requestAnimationFrame(tick);
      else onDone?.();
    }
    requestAnimationFrame(tick);
  }

  function runPortal(toMode) {
    if (busyRef.current) return;
    busyRef.current = true;

    const fromRef = toMode === "professional" ? persRef : proRef;

    // 1 — FORMING (900ms): hole tears open
    tween(
      900,
      (t) => {
        const r = easeOut(t) * 48;
        dispatch(r, r * 3.5, r * 5, "forming", t);
      },
      () => {
        // 2 — PULLING (1100ms): page gets sucked in
        tween(
          1100,
          (t) => {
            const r = 48 + easeIn(t, 4) * 130;
            dispatch(r, r * 3.2, r * 4.8, "pulling", t);
            applyPageStyle(
              fromRef.current,
              1 - easeIn(t, 2) * 0.92,
              1 - easeIn(t, 1.5),
              easeIn(t, 2) * 12,
            );
          },
          () => {
            // 3 — CONSUMING (120ms): swallows everything
            tween(
              120,
              (t) => {
                const r = 178 + t * window.innerWidth;
                dispatch(r, r * 2, r * 3, "consuming", t);
              },
              () => {
                // Swap pages at the darkest moment
                if (toMode === "professional") {
                  setRenderPro(true);
                  setMode("professional");
                } else {
                  setMode("personal");
                }

                // Small pause to let React render the new page
                setTimeout(() => {
                  const toRef = toMode === "professional" ? proRef : persRef;
                  applyPageStyle(toRef.current, 0, 0, 0);

                  // 4 — SETTLING (750ms): hole collapses, new page emerges
                  tween(
                    750,
                    (t) => {
                      const r = window.innerWidth * 1.4 * (1 - easeOut(t, 4));
                      dispatch(r, r * 3, r * 4.5, "settling", t);
                      applyPageStyle(toRef.current, easeOut(t), easeOut(t), 0);
                    },
                    () => {
                      dispatch(0, 0, 0, "idle", 0);
                      if (toMode === "personal") setRenderPro(false);

                      // Reset styles
                      const toRef2 =
                        toMode === "professional" ? proRef : persRef;
                      if (toRef2.current) {
                        toRef2.current.style.transform = "";
                        toRef2.current.style.opacity = "";
                        toRef2.current.style.filter = "";
                        toRef2.current.style.willChange = "";
                      }
                      busyRef.current = false;
                    },
                  );
                }, 60);
              },
            );
          },
        );
      },
    );
  }

  const enterPro = useCallback(() => runPortal("professional"), []);
  const exitPro = useCallback(() => runPortal("personal"), []);

  return (
    <>
      <BlackHoleCanvas canvasRef={canvasRef} />

      {/* Personal mode — always in DOM, stacked via position:fixed */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: mode === "personal" ? 2 : 1,
          overflowY: mode === "personal" ? "auto" : "hidden",
          pointerEvents: mode === "personal" ? "auto" : "none",
        }}
      >
        <div
          ref={persRef}
          style={{ transformOrigin: "center center", minHeight: "100%" }}
        >
          <MainPage />
        </div>
        {mode === "personal" && <EnterProButton onClick={enterPro} />}
      </div>

      {/* Professional mode — mounted once triggered, sits beneath during suck-in */}
      {renderPro && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: mode === "professional" ? 2 : 1,
            overflowY: mode === "professional" ? "auto" : "hidden",
            pointerEvents: mode === "professional" ? "auto" : "none",
          }}
        >
          <div
            ref={proRef}
            style={{ transformOrigin: "center center", minHeight: "100%" }}
          >
            <ProfessionalMode onExit={exitPro} />
          </div>
        </div>
      )}
    </>
  );
}
