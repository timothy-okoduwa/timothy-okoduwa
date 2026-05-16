/** @format */
"use client";

import { useEffect, useRef } from "react";

// ─── Time-of-day bands ────────────────────────────────────────────────────────
export const getTimePeriod = (hour, minute = 0) => {
  const t = hour + minute / 60;
  if (t >= 5.5 && t < 7) return "sunrise";
  if (t >= 7 && t < 12) return "morning";
  if (t >= 12 && t < 15) return "afternoon";
  if (t >= 15 && t < 17) return "golden";
  if (t >= 17 && t < 18.5) return "sunset";
  if (t >= 18.5 && t < 20) return "dusk";
  return "night";
};

// ─── WMO code → condition string ─────────────────────────────────────────────
export const wmoToCondition = (code, hourLocal = new Date().getHours()) => {
  const minute = new Date().getMinutes();
  const period = getTimePeriod(hourLocal, minute);

  if (period === "night") return "night";
  if (period === "sunrise") return "sunrise";
  if (period === "dusk") return "dusk";
  if (period === "sunset") return "sunset";
  if (period === "golden" && (code === 0 || code === 1)) return "golden";

  if (code === 0 || code === 1)
    return period === "morning"
      ? "morning"
      : period === "afternoon"
        ? "afternoon"
        : "sunny";
  if (code >= 2 && code <= 3) return "cloudy";
  if (code >= 45 && code <= 48) return "fog";
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return "rain";
  if (code >= 71 && code <= 77) return "snow";
  if (code >= 95) return "storm";
  return "cloudy";
};

// ─── Sky palettes ─────────────────────────────────────────────────────────────
const SKY = {
  sunrise: [
    "#0a0e1a",
    "#1a1030",
    "#6b2d5e",
    "#c45c3a",
    "#e8843a",
    "#f5c06a",
    "#fce8b0",
  ],
  morning: ["#1a4a8a", "#2a6ab8", "#4a8fd4", "#70b0e8", "#a0d0f5", "#c8e8fa"],
  sunny: ["#0d4fa0", "#1a6fc4", "#2e8fd6", "#55aee8", "#88ccf5", "#b8e1fa"],
  afternoon: ["#0a3d8a", "#1858b8", "#2e78d0", "#55a0e8", "#80c4f5", "#aadcfa"],
  golden: [
    "#1a2a4a",
    "#3a3060",
    "#8a4040",
    "#c86030",
    "#e8903a",
    "#f5c050",
    "#fde8a0",
  ],
  sunset: [
    "#0d0d2a",
    "#2a1540",
    "#6a2050",
    "#c04040",
    "#e06830",
    "#f0a040",
    "#f8d080",
  ],
  dusk: [
    "#060818",
    "#100e28",
    "#2a1845",
    "#4a2060",
    "#6a3070",
    "#8a4878",
    "#b07090",
  ],
  night: ["#01040e", "#020913", "#04111e", "#071828", "#0a2035", "#0d2840"],
  cloudy: ["#3a566e", "#4a6d8c", "#607f9a", "#7a96ab", "#9ab3c4", "#c0d4e0"],
  rain: ["#1e2d38", "#263743", "#30424f", "#3d5060", "#4f6170", "#607080"],
  storm: ["#090c12", "#0d1119", "#111822", "#16202c", "#1c2a38", "#222e3c"],
  snow: ["#3a4a5c", "#4d5e70", "#637282", "#7a8894", "#9aaab4", "#bccbd4"],
  fog: ["#7a8490", "#8e98a2", "#a2abb4", "#b5bec6", "#c8cfd6", "#dde3e8"],
};

// ─── Lightning bolt ───────────────────────────────────────────────────────────
function mkBolt(x0, y0, x1, y1, jagg, depth) {
  if (depth <= 0)
    return [
      { x: x0, y: y0 },
      { x: x1, y: y1 },
    ];
  const mx = (x0 + x1) / 2 + (Math.random() - 0.5) * jagg;
  const my = (y0 + y1) / 2 + (Math.random() - 0.5) * jagg * 0.4;
  return [
    ...mkBolt(x0, y0, mx, my, jagg * 0.55, depth - 1),
    ...mkBolt(mx, my, x1, y1, jagg * 0.55, depth - 1),
  ];
}

// ─── Main component ───────────────────────────────────────────────────────────
const WeatherAmbient = ({ condition }) => {
  const skyRef = useRef(null);
  const partRef = useRef(null);
  const stateRef = useRef({
    clouds: [],
    particles: [],
    stars: [],
    shootingStars: [],
    lightning: {
      active: false,
      opacity: 0,
      timer: 0,
      segments: [],
      branch: null,
    },
    t: 0,
    rafId: null,
  });

  const mkShootingStar = (W, H) => ({
    x: Math.random() * W * 0.7,
    y: Math.random() * H * 0.4,
    len: 80 + Math.random() * 120,
    speed: 8 + Math.random() * 10,
    angle: 0.4 + Math.random() * 0.3,
    opacity: 0,
    active: false,
    timer: Math.random() * 400,
    progress: 0,
  });

  const mkParticle = (cond, W, H) => {
    if (cond === "rain" || cond === "storm") {
      const heavy = cond === "storm";
      return {
        x: Math.random() * (W + 200) - 100,
        y: Math.random() * H,
        speed: 10 + Math.random() * (heavy ? 12 : 6),
        wind: heavy ? -5 - Math.random() * 3 : -1.5 - Math.random() * 1.5,
        len: heavy ? 22 + Math.random() * 18 : 12 + Math.random() * 12,
        opacity: 0.18 + Math.random() * 0.35,
        width: heavy ? 1.2 : 0.65,
      };
    }
    if (cond === "snow") {
      return {
        x: Math.random() * W,
        y: Math.random() * H,
        r: 1.5 + Math.random() * 4,
        speed: 0.35 + Math.random() * 0.75,
        opacity: 0.5 + Math.random() * 0.4,
        drift: Math.random() * Math.PI * 2,
        sway: (Math.random() - 0.5) * 0.45,
      };
    }
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      r: 0.8 + Math.random() * 2,
      phase: Math.random() * Math.PI * 2,
    };
  };

  const initScene = (cond, s) => {
    const { W, H } = s;
    if (!W || !H) return;

    const cloudCount = cond === "fog" ? 40 : cond === "storm" ? 22 : 16;
    s.clouds = Array.from({ length: cloudCount }, () => {
      const r =
        (cond === "storm" ? 200 : cond === "fog" ? 130 : 110) +
        Math.random() * 200;
      return {
        x: Math.random() * W * 1.5,
        y: Math.random() * H * (cond === "fog" ? 0.9 : 0.5),
        r,
        speed: (cond === "fog" ? 0.04 : 0.1) + Math.random() * 0.14,
        opacity:
          cond === "storm"
            ? 0.3 + Math.random() * 0.25
            : cond === "fog"
              ? 0.12 + Math.random() * 0.18
              : 0.09 + Math.random() * 0.13,
        phase: Math.random() * Math.PI * 2,
        blobs: Array.from(
          { length: 4 + Math.floor(Math.random() * 5) },
          () => ({
            ox: (Math.random() - 0.5) * 1.7,
            oy: (Math.random() - 0.5) * 0.55,
            sr: 0.55 + Math.random() * 0.9,
          }),
        ),
      };
    });

    const count = cond === "storm" ? 550 : cond === "rain" ? 380 : 220;
    s.particles = Array.from({ length: count }, () => mkParticle(cond, W, H));

    s.stars = Array.from({ length: 240 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H * 0.72,
      r: 0.4 + Math.random() * 1.8,
      opacity: 0.25 + Math.random() * 0.7,
      phase: Math.random() * Math.PI * 2,
      speed: 0.018 + Math.random() * 0.028,
    }));

    s.shootingStars = Array.from({ length: 4 }, () => mkShootingStar(W, H));
    s.lightning = {
      active: false,
      opacity: 0,
      timer: 0,
      segments: [],
      branch: null,
    };
  };

  const drawSky = (ctx, cond, s) => {
    const { W, H, t } = s;
    const palette = SKY[cond] || SKY.cloudy;

    // Sky gradient
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    palette.forEach((c, i) => grad.addColorStop(i / (palette.length - 1), c));
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // ── Stars ────────────────────────────────────────────────────────────────
    const showStars = ["night", "dusk", "sunrise"].includes(cond);
    if (showStars) {
      const starAlpha = cond === "night" ? 1 : cond === "dusk" ? 0.7 : 0.3;
      s.stars.forEach((st) => {
        st.phase += st.speed;
        const a = st.opacity * (0.45 + 0.55 * Math.sin(st.phase)) * starAlpha;
        ctx.beginPath();
        ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${a})`;
        ctx.fill();
      });

      // Shooting stars
      if (cond === "night" || cond === "dusk") {
        s.shootingStars.forEach((ss) => {
          ss.timer--;
          if (ss.timer <= 0 && !ss.active) {
            ss.active = true;
            ss.progress = 0;
            ss.opacity = 0.9 + Math.random() * 0.1;
            ss.x = Math.random() * W * 0.75;
            ss.y = Math.random() * H * 0.35;
            ss.len = 80 + Math.random() * 120;
            ss.speed = 7 + Math.random() * 8;
            ss.timer = 300 + Math.random() * 500;
          }
          if (ss.active) {
            ss.progress += ss.speed;
            const fade = Math.min(1, (ss.len - ss.progress) / ss.len);
            const ex = ss.x + Math.cos(ss.angle) * ss.progress;
            const ey = ss.y + Math.sin(ss.angle) * ss.progress;
            const sg = ctx.createLinearGradient(ss.x, ss.y, ex, ey);
            sg.addColorStop(0, `rgba(255,255,255,0)`);
            sg.addColorStop(
              0.5,
              `rgba(220,235,255,${ss.opacity * fade * 0.5})`,
            );
            sg.addColorStop(1, `rgba(255,255,255,${ss.opacity * fade})`);
            ctx.beginPath();
            ctx.moveTo(ss.x, ss.y);
            ctx.lineTo(ex, ey);
            ctx.strokeStyle = sg;
            ctx.lineWidth = 1.5;
            ctx.stroke();
            if (ss.progress >= ss.len) ss.active = false;
          }
        });
      }

      // Milky way
      if (cond === "night") {
        const mw = ctx.createLinearGradient(W * 0.25, 0, W * 0.75, H * 0.65);
        mw.addColorStop(0, "rgba(140,160,220,0)");
        mw.addColorStop(0.5, "rgba(140,160,220,0.045)");
        mw.addColorStop(1, "rgba(140,160,220,0)");
        ctx.fillStyle = mw;
        ctx.fillRect(0, 0, W, H);
      }
    }

    // ── Moon ─────────────────────────────────────────────────────────────────
    if (cond === "night" || cond === "dusk") {
      const moonAlpha = cond === "dusk" ? 0.5 : 1;
      const mx = W * 0.72,
        my = H * 0.2;
      const moonGlow = ctx.createRadialGradient(mx, my, 0, mx, my, 90);
      moonGlow.addColorStop(0, `rgba(220,235,255,${0.18 * moonAlpha})`);
      moonGlow.addColorStop(1, "rgba(220,235,255,0)");
      ctx.fillStyle = moonGlow;
      ctx.beginPath();
      ctx.arc(mx, my, 90, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(mx, my, 28, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(221,232,245,${moonAlpha})`;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(mx + 11, my - 4, 24, 0, Math.PI * 2);
      ctx.fillStyle = palette[1];
      ctx.fill();
    }

    // ── Sun ───────────────────────────────────────────────────────────────────
    const hasSun = [
      "sunrise",
      "morning",
      "sunny",
      "afternoon",
      "golden",
      "sunset",
    ].includes(cond);
    if (hasSun) {
      const sunPositions = {
        sunrise: { x: 0.12, y: 0.82 },
        morning: { x: 0.22, y: 0.28 },
        sunny: { x: 0.72, y: 0.18 },
        afternoon: { x: 0.72, y: 0.18 },
        golden: { x: 0.82, y: 0.72 },
        sunset: { x: 0.92, y: 0.86 },
      };
      const pos = sunPositions[cond] || { x: 0.72, y: 0.18 };
      const sx = W * pos.x,
        sy = H * pos.y;
      const isLow =
        cond === "sunrise" || cond === "sunset" || cond === "golden";

      // Atmospheric scatter for low sun
      if (isLow) {
        const scatterColors = {
          sunrise: "255,140,60",
          golden: "255,160,40",
          sunset: "255,100,30",
        };
        const sc = scatterColors[cond] || "255,160,40";
        const scatter = ctx.createRadialGradient(sx, sy, 0, sx, sy, H * 0.85);
        scatter.addColorStop(0, `rgba(${sc},0.28)`);
        scatter.addColorStop(0.3, `rgba(${sc},0.14)`);
        scatter.addColorStop(0.7, `rgba(${sc},0.05)`);
        scatter.addColorStop(1, `rgba(${sc},0)`);
        ctx.fillStyle = scatter;
        ctx.fillRect(0, 0, W, H);
      }

      // Rays (midday only)
      if (!isLow) {
        for (let i = 0; i < 8; i++) {
          const angle = (i / 8) * Math.PI * 2 + t * 0.0003;
          const rayA = 0.028 + 0.015 * Math.sin(t * 0.001 + i);
          const spread = 0.07;
          const rg = ctx.createLinearGradient(
            sx,
            sy,
            sx + Math.cos(angle) * H * 0.75,
            sy + Math.sin(angle) * H * 0.75,
          );
          rg.addColorStop(0, `rgba(255,240,140,${rayA * 1.5})`);
          rg.addColorStop(1, "rgba(255,240,140,0)");
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.lineTo(
            sx + Math.cos(angle - spread) * H * 0.75,
            sy + Math.sin(angle - spread) * H * 0.75,
          );
          ctx.lineTo(
            sx + Math.cos(angle + spread) * H * 0.75,
            sy + Math.sin(angle + spread) * H * 0.75,
          );
          ctx.closePath();
          ctx.fillStyle = rg;
          ctx.fill();
        }
      }

      // Sun glow
      const glowR = isLow ? 220 : 150;
      const glowColors = {
        sunrise: ["255,140,60", "255,90,20"],
        golden: ["255,170,40", "255,120,10"],
        sunset: ["255,110,30", "255,60,10"],
      };
      const [gc1, gc2] = glowColors[cond] || ["255,230,100", "255,180,0"];
      const glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, glowR);
      glow.addColorStop(0, `rgba(${gc1},${isLow ? 0.55 : 0.45})`);
      glow.addColorStop(0.4, `rgba(${gc2},${isLow ? 0.28 : 0.12})`);
      glow.addColorStop(1, "rgba(255,100,0,0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(sx, sy, glowR, 0, Math.PI * 2);
      ctx.fill();

      // Sun disk
      const diskColors = {
        sunrise: ["255,200,120", "255,140,40", "255,90,10"],
        golden: ["255,220,100", "255,160,30", "255,100,0"],
        sunset: ["255,180,80", "255,100,20", "255,50,0"],
      };
      const [d1, d2, d3] = diskColors[cond] || [
        "255,252,200",
        "255,220,50",
        "255,180,10",
      ];
      const disk = ctx.createRadialGradient(sx, sy, 0, sx, sy, 36);
      disk.addColorStop(0, `rgba(${d1},1)`);
      disk.addColorStop(0.6, `rgba(${d2},1)`);
      disk.addColorStop(1, `rgba(${d3},0.75)`);
      ctx.beginPath();
      ctx.arc(sx, sy, 36, 0, Math.PI * 2);
      ctx.fillStyle = disk;
      ctx.fill();

      // Horizon glow for low sun
      if (isLow) {
        const hc =
          cond === "sunset"
            ? "255,80,20"
            : cond === "golden"
              ? "255,140,20"
              : "255,120,40";
        const hGlow = ctx.createLinearGradient(0, H * 0.6, 0, H);
        hGlow.addColorStop(0, "rgba(0,0,0,0)");
        hGlow.addColorStop(0.5, `rgba(${hc},0.18)`);
        hGlow.addColorStop(1, `rgba(${hc},0.35)`);
        ctx.fillStyle = hGlow;
        ctx.fillRect(0, H * 0.6, W, H * 0.4);
      }
    }

    // ── Lightning ─────────────────────────────────────────────────────────────
    if (cond === "storm") {
      const L = s.lightning;
      L.timer++;
      if (L.timer > 100 + Math.random() * 280) {
        const lx = W * 0.15 + Math.random() * W * 0.7;
        L.active = true;
        L.opacity = 1;
        L.timer = 0;
        L.segments = mkBolt(
          lx,
          H * 0.04,
          lx + (Math.random() - 0.5) * 100,
          H * 0.62,
          70,
          5,
        );
        const mid = L.segments[Math.floor(L.segments.length / 2)];
        L.branch =
          Math.random() > 0.5
            ? mkBolt(
                mid.x,
                mid.y,
                mid.x + (Math.random() - 0.5) * 80,
                H * 0.55,
                40,
                4,
              )
            : null;
      }
      if (L.active) {
        ctx.fillStyle = `rgba(230,240,255,${L.opacity * 0.1})`;
        ctx.fillRect(0, 0, W, H);
        const drawBolt = (segs, a) => {
          if (!segs || segs.length < 2) return;
          ctx.beginPath();
          ctx.moveTo(segs[0].x, segs[0].y);
          segs.forEach((p) => ctx.lineTo(p.x, p.y));
          ctx.strokeStyle = `rgba(255,255,230,${a})`;
          ctx.lineWidth = 2;
          ctx.shadowColor = "rgba(180,210,255,0.9)";
          ctx.shadowBlur = 14;
          ctx.stroke();
          ctx.shadowBlur = 0;
        };
        drawBolt(L.segments, L.opacity * 0.95);
        drawBolt(L.branch, L.opacity * 0.55);
        L.opacity -= 0.055;
        if (L.opacity <= 0) L.active = false;
      }
    }

    // ── Clouds ────────────────────────────────────────────────────────────────
    const isStorm = cond === "storm";
    const isFog = cond === "fog";
    const isWarm = ["sunrise", "golden", "sunset", "dusk"].includes(cond);
    const baseRGB = isStorm
      ? "38,40,50"
      : isFog
        ? "178,185,196"
        : isWarm
          ? "255,180,120"
          : "248,250,255";

    s.clouds.forEach((c) => {
      c.x += c.speed;
      if (c.x - c.r * 2.5 > W) c.x = -c.r * 2.5;
      const pulse = isFog ? 0 : 0.018 * Math.sin(t * 0.0007 + c.phase);
      const a = c.opacity + pulse;
      c.blobs.forEach((b) => {
        const bx = c.x + b.ox * c.r,
          by = c.y + b.oy * c.r * 0.5,
          br = c.r * b.sr;
        const bg = ctx.createRadialGradient(bx, by - br * 0.18, 0, bx, by, br);
        bg.addColorStop(0, `rgba(${baseRGB},${Math.min(1, a * 1.4)})`);
        bg.addColorStop(0.45, `rgba(${baseRGB},${a * 0.85})`);
        bg.addColorStop(1, `rgba(${baseRGB},0)`);
        ctx.fillStyle = bg;
        ctx.beginPath();
        ctx.arc(bx, by, br, 0, Math.PI * 2);
        ctx.fill();
      });
    });

    // ── Atmosphere haze ───────────────────────────────────────────────────────
    const hazeMap = {
      sunrise: "rgba(255,140,60,0.18)",
      morning: "rgba(200,220,255,0.06)",
      sunny: "rgba(255,210,80,0.08)",
      afternoon: "rgba(180,210,255,0.06)",
      golden: "rgba(255,150,30,0.20)",
      sunset: "rgba(255,80,20,0.25)",
      dusk: "rgba(100,40,100,0.18)",
      cloudy: "rgba(180,200,220,0.06)",
      rain: "rgba(80,110,140,0.10)",
      storm: "rgba(20,30,50,0.18)",
      snow: "rgba(200,220,235,0.07)",
      fog: "rgba(170,180,190,0.14)",
      night: "rgba(10,20,50,0.12)",
    };
    const haze = ctx.createLinearGradient(0, H * 0.55, 0, H);
    haze.addColorStop(0, "rgba(0,0,0,0)");
    haze.addColorStop(1, hazeMap[cond] || "rgba(0,0,0,0.08)");
    ctx.fillStyle = haze;
    ctx.fillRect(0, 0, W, H);
  };

  const drawParticles = (ctx, cond, s) => {
    const { W, H, t } = s;
    ctx.clearRect(0, 0, W, H);

    // Rain
    if (cond === "rain" || cond === "storm") {
      s.particles.forEach((p) => {
        p.y += p.speed;
        p.x += p.wind;
        if (p.y > H + 24) {
          p.y = -24;
          p.x = Math.random() * (W + 200) - 100;
        }
        if (p.x < -120) {
          p.x = W + 60;
          p.y = Math.random() * H;
        }
        const rg = ctx.createLinearGradient(
          p.x,
          p.y,
          p.x + p.wind * 2,
          p.y + p.len,
        );
        rg.addColorStop(0, "rgba(190,220,245,0)");
        rg.addColorStop(0.35, `rgba(180,215,242,${p.opacity})`);
        rg.addColorStop(1, `rgba(160,205,238,${p.opacity * 0.55})`);
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + p.wind * 2, p.y + p.len);
        ctx.strokeStyle = rg;
        ctx.lineWidth = p.width;
        ctx.stroke();
        if (p.y > H - 28) {
          ctx.beginPath();
          ctx.ellipse(p.x, H - 3, 3.5, 1.2, 0, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(174,214,241,${p.opacity * 0.35})`;
          ctx.fill();
        }
      });
      const gShimmer = ctx.createLinearGradient(0, H * 0.88, 0, H);
      gShimmer.addColorStop(0, "rgba(80,130,170,0)");
      gShimmer.addColorStop(1, "rgba(80,130,170,0.07)");
      ctx.fillStyle = gShimmer;
      ctx.fillRect(0, H * 0.88, W, H * 0.12);
    }

    // Snow
    if (cond === "snow") {
      s.particles.forEach((p) => {
        p.y += p.speed;
        p.drift += 0.018;
        p.x += Math.sin(p.drift) * 0.55 + p.sway;
        if (p.y > H + 12) {
          p.y = -12;
          p.x = Math.random() * W;
        }
        if (p.x < -12 || p.x > W + 12) {
          p.x = Math.random() * W;
          p.y = -12;
        }
        const sg = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
        sg.addColorStop(0, `rgba(255,255,255,${p.opacity})`);
        sg.addColorStop(1, `rgba(210,230,255,${p.opacity * 0.25})`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = sg;
        ctx.fill();
      });
      const drift = ctx.createLinearGradient(0, H * 0.92, 0, H);
      drift.addColorStop(0, "rgba(255,255,255,0)");
      drift.addColorStop(1, "rgba(255,255,255,0.08)");
      ctx.fillStyle = drift;
      ctx.fillRect(0, H * 0.92, W, H * 0.08);
    }

    // Dust / light motes
    if (
      ["sunny", "morning", "afternoon", "golden", "sunrise", "sunset"].includes(
        cond,
      )
    ) {
      const dustColor = {
        sunrise: "255,160,80",
        golden: "255,180,60",
        sunset: "255,120,40",
        morning: "255,230,120",
        sunny: "255,230,100",
        afternoon: "255,220,100",
      };
      const dc = dustColor[cond] || "255,230,100";
      s.particles.forEach((p) => {
        p.y -= 0.25 + Math.random() * 0.08;
        if (p.y < -6) {
          p.y = H + 6;
          p.x = Math.random() * W;
        }
        const a = 0.04 + 0.035 * Math.sin(t * 0.002 + p.phase);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${dc},${a})`;
        ctx.fill();
      });
    }
  };

  const loop = (s, skyCtx, partCtx, cond) => {
    s.t++;
    skyCtx.clearRect(0, 0, s.W, s.H);
    drawSky(skyCtx, cond, s);
    drawParticles(partCtx, cond, s);
    s.rafId = requestAnimationFrame(() => loop(s, skyCtx, partCtx, cond));
  };

  useEffect(() => {
    if (!condition) return;
    const sky = skyRef.current;
    const part = partRef.current;
    if (!sky || !part) return;
    const skyCtx = sky.getContext("2d");
    const partCtx = part.getContext("2d");
    const s = stateRef.current;

    const handleResize = () => {
      s.W = sky.width = part.width = window.innerWidth;
      s.H = sky.height = part.height = window.innerHeight;
      initScene(condition, s);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    cancelAnimationFrame(s.rafId);
    loop(s, skyCtx, partCtx, condition);
    return () => {
      cancelAnimationFrame(s.rafId);
      window.removeEventListener("resize", handleResize);
    };
  }, [condition]);

  return (
    <>
      <canvas
        ref={skyRef}
        style={{
          position: "fixed",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <canvas
        ref={partRef}
        style={{
          position: "fixed",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />
    </>
  );
};

export default WeatherAmbient;
