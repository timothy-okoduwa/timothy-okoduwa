/** @format */
"use client";

// ─── CHANGES FROM ORIGINAL ────────────────────────────────────────────────────
// FIX 1: Desktop weather not showing
//   - Added IP-based geolocation fallback (open-meteo geocoding via ipapi.co)
//   - If navigator.geolocation is blocked/unavailable, falls back to IP location
//   - Added permission check to detect denied state faster
//
// FIX 2: Mobile readability (iOS Weather app style)
//   - Bio card, section headers, project cards all get proper frosted-glass
//   - Text has stronger contrast tokens per weather condition
//   - "Rain" condition uses deeper, more vivid canvas + white text
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import project from "./project";
import Image from "next/image";
import p from "./mypic.png";
import WeatherAmbient, { wmoToCondition } from "./WeatherAmbient";

import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";

// ─── WMO label + emoji maps ───────────────────────────────────────────────────
const WMO_EMOJI = {
  0: "☀️",
  1: "🌤",
  2: "⛅",
  3: "☁️",
  45: "🌫",
  48: "🌫",
  51: "🌦",
  53: "🌦",
  55: "🌧",
  61: "🌧",
  63: "🌧",
  65: "🌧",
  71: "🌨",
  73: "❄️",
  75: "❄️",
  77: "🌨",
  80: "🌦",
  81: "🌧",
  82: "⛈",
  95: "⛈",
  96: "⛈",
  99: "⛈",
};
const WMO_LABEL = {
  0: "Clear sky",
  1: "Mostly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Foggy",
  48: "Icy fog",
  51: "Light drizzle",
  53: "Drizzle",
  55: "Heavy drizzle",
  61: "Light rain",
  63: "Rain",
  65: "Heavy rain",
  71: "Light snow",
  73: "Snow",
  75: "Heavy snow",
  77: "Snow grains",
  80: "Showers",
  81: "Heavy showers",
  82: "Violent showers",
  95: "Thunderstorm",
  96: "Hail storm",
  99: "Heavy hail storm",
};

// ─── Tech stack ───────────────────────────────────────────────────────────────
const techStack = [
  { name: "TypeScript", color: "#3178c6" },
  { name: "JavaScript", color: "#f7df1e" },
  { name: "React", color: "#61dafb" },
  { name: "Next.js", color: "#e9e1e1" },
  { name: "React Native", color: "#61dafb" },
  { name: "Tailwind CSS", color: "#06b6d4" },
];

const getCurrentYearRoman = () => {
  const year = new Date().getFullYear();
  const rn = [
    [1000, "M"],
    [900, "CM"],
    [500, "D"],
    [400, "CD"],
    [100, "C"],
    [90, "XC"],
    [50, "L"],
    [40, "XL"],
    [10, "X"],
    [9, "IX"],
    [5, "V"],
    [4, "IV"],
    [1, "I"],
  ];
  let r = "",
    rem = year;
  for (const [v, n] of rn) {
    while (rem >= v) {
      r += n;
      rem -= v;
    }
  }
  return r;
};

// ─── FIX 1: Robust weather fetch with IP fallback ─────────────────────────────
async function fetchWeatherByCoords(lat, lon) {
  const res = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weathercode&timezone=auto`,
  );
  const data = await res.json();
  return {
    temp: Math.round(data.current.temperature_2m),
    code: data.current.weathercode,
    tz: data.timezone_abbreviation || "",
  };
}

async function fetchWeatherByIP() {
  // Use ipapi.co (free, no key needed) to get approximate location from IP
  const geo = await fetch("https://ipapi.co/json/").then((r) => r.json());
  if (!geo.latitude || !geo.longitude) throw new Error("IP geo failed");
  return fetchWeatherByCoords(geo.latitude, geo.longitude);
}

function getWeatherWithFallback(onSuccess, onFail) {
  // Try geolocation first (desktop often blocks this)
  if (!navigator.geolocation) {
    // No geolocation API at all — go straight to IP fallback
    fetchWeatherByIP().then(onSuccess).catch(onFail);
    return;
  }

  // Set a 4-second timeout: if geolocation takes too long (e.g. permission
  // dialog never answered on desktop), fall back to IP geo
  let settled = false;
  const timer = setTimeout(() => {
    if (!settled) {
      settled = true;
      fetchWeatherByIP().then(onSuccess).catch(onFail);
    }
  }, 4000);

  navigator.geolocation.getCurrentPosition(
    async ({ coords }) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      try {
        const data = await fetchWeatherByCoords(
          coords.latitude,
          coords.longitude,
        );
        onSuccess(data);
      } catch {
        fetchWeatherByIP().then(onSuccess).catch(onFail);
      }
    },
    () => {
      // Permission denied or error — use IP fallback immediately
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      fetchWeatherByIP().then(onSuccess).catch(onFail);
    },
    { timeout: 3500, maximumAge: 300000 },
  );
}

// ─── FIX 2: Weather-aware glass styles ───────────────────────────────────────
// These mirror what the iOS Weather app does: vivid sky + white frosted cards
function getWeatherGlassStyle(condition) {
  const isDark = ["night", "dusk", "storm"].includes(condition);
  const isRainy = ["rain", "storm"].includes(condition);
  const isWarm = ["sunrise", "golden", "sunset"].includes(condition);

  if (isDark || isRainy) {
    return {
      card: {
        background: "rgba(10, 20, 40, 0.55)",
        border: "1px solid rgba(255,255,255,0.12)",
        backdropFilter: "blur(20px) saturate(1.4)",
        WebkitBackdropFilter: "blur(20px) saturate(1.4)",
        boxShadow:
          "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)",
      },
      text: "rgba(255,255,255,0.95)",
      textMuted: "rgba(200,220,255,0.75)",
      textFaint: "rgba(180,205,240,0.55)",
    };
  }
  if (isWarm) {
    return {
      card: {
        background: "rgba(30, 10, 0, 0.45)",
        border: "1px solid rgba(255,200,120,0.18)",
        backdropFilter: "blur(20px) saturate(1.6)",
        WebkitBackdropFilter: "blur(20px) saturate(1.6)",
        boxShadow:
          "0 8px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,200,80,0.1)",
      },
      text: "rgba(255,240,220,0.97)",
      textMuted: "rgba(255,210,160,0.8)",
      textFaint: "rgba(255,190,120,0.6)",
    };
  }
  // Daytime / cloudy / fog — light frosted card like iOS
  return {
    card: {
      background: "rgba(255,255,255,0.22)",
      border: "1px solid rgba(255,255,255,0.45)",
      backdropFilter: "blur(24px) saturate(1.8)",
      WebkitBackdropFilter: "blur(24px) saturate(1.8)",
      boxShadow:
        "0 8px 32px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.6)",
    },
    text: "rgba(10,20,40,0.95)",
    textMuted: "rgba(10,20,40,0.7)",
    textFaint: "rgba(10,20,40,0.5)",
  };
}

// ─── VibeBar ──────────────────────────────────────────────────────────────────
const p2 = (n) => String(n).padStart(2, "0");

const VibeBar = ({ available = true, weatherData, glassStyle }) => {
  const [time, setTime] = useState("");
  useEffect(() => {
    const tick = () => {
      const n = new Date();
      setTime(
        `${p2(n.getHours())}:${p2(n.getMinutes())}:${p2(n.getSeconds())}`,
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const pill = {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "4px 10px",
    borderRadius: 99,
    border: "1px solid var(--border)",
    background: "var(--surface)",
    fontSize: 12,
    fontFamily: "'IBM Plex Mono',monospace",
    color: "var(--text-muted)",
    backdropFilter: "blur(8px)",
  };

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 8,
        marginTop: 14,
        alignItems: "center",
      }}
    >
      <div
        style={{
          ...pill,
          borderColor: available
            ? "rgba(74,222,128,0.35)"
            : "rgba(182,174,170,0.2)",
          background: available ? "rgba(74,222,128,0.1)" : "var(--surface)",
          color: available ? "rgba(74,222,128,0.95)" : "var(--text-faint)",
        }}
      >
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: available ? "#4ade80" : "var(--text-faint)",
            flexShrink: 0,
            boxShadow: available ? "0 0 6px rgba(74,222,128,0.6)" : "none",
            animation: available ? "pulse 2s ease-in-out infinite" : "none",
          }}
        />
        {available ? "Available for work" : "Not available"}
      </div>
      <div style={pill}>
        <svg
          width="11"
          height="11"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        {time}
        {weatherData?.tz ? ` ${weatherData.tz}` : ""}
      </div>
      {weatherData && (
        <div style={pill}>
          <span style={{ fontSize: 13 }}>
            {WMO_EMOJI[weatherData.code] ?? "🌡"}
          </span>
          {weatherData.temp}°C · {WMO_LABEL[weatherData.code] ?? "Weather"}
        </div>
      )}
    </div>
  );
};

// ─── Command Palette ──────────────────────────────────────────────────────────
const STATIC_CMDS = [
  {
    id: "email",
    label: "Send email",
    desc: "timothyokoduwa4@gmail.com",
    icon: "✉",
    action: () => window.open("mailto:timothyokoduwa4@gmail.com"),
  },
  {
    id: "github",
    label: "Open GitHub",
    desc: "github.com/timothy-okoduwa",
    icon: "⌥",
    action: () => window.open("https://github.com/timothy-okoduwa", "_blank"),
  },
  {
    id: "twitter",
    label: "Open Twitter / X",
    desc: "@TimothyOkoduwa",
    icon: "𝕏",
    action: () => window.open("https://x.com/TimothyOkoduwa", "_blank"),
  },
  {
    id: "linkedin",
    label: "Open LinkedIn",
    desc: "timothy-okoduwa",
    icon: "in",
    action: () =>
      window.open(
        "https://www.linkedin.com/in/timothy-okoduwa-b4771b293/",
        "_blank",
      ),
  },
  {
    id: "projects",
    label: "Jump to Projects",
    desc: "Scroll to the projects section",
    icon: "↓",
    action: () =>
      document
        .getElementById("section-projects")
        ?.scrollIntoView({ behavior: "smooth" }),
  },
  {
    id: "guestbook",
    label: "Open Guestbook",
    desc: "Leave your signature",
    icon: "✍",
    action: () => window.__openGuestbook?.(),
  },
  {
    id: "top",
    label: "Scroll to top",
    desc: "",
    icon: "↑",
    action: () => window.scrollTo({ top: 0, behavior: "smooth" }),
  },
];

const hl = (text, q) => {
  if (!q) return text;
  const i = text.toLowerCase().indexOf(q.toLowerCase());
  if (i === -1) return text;
  return (
    <>
      {text.slice(0, i)}
      <mark
        style={{
          background: "var(--accent-dim)",
          color: "var(--accent)",
          borderRadius: 2,
        }}
      >
        {text.slice(i, i + q.length)}
      </mark>
      {text.slice(i + q.length)}
    </>
  );
};

const PalettePortal = ({ projects, onClose }) => {
  const [query, setQuery] = useState("");
  const [sel, setSel] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const all = [
    ...STATIC_CMDS,
    ...projects.map((p) => ({
      id: `p-${p.name}`,
      label: p.name,
      desc:
        (p.description || "").slice(0, 60) +
        ((p.description || "").length > 60 ? "…" : ""),
      icon: "→",
      action: () => window.open(p.link, "_blank"),
    })),
  ];
  const filtered = query
    ? all.filter(
        (c) =>
          c.label.toLowerCase().includes(query.toLowerCase()) ||
          (c.desc || "").toLowerCase().includes(query.toLowerCase()),
      )
    : all;

  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  useEffect(() => {
    setSel(0);
  }, [query]);

  const run = useCallback(
    (cmd) => {
      cmd.action();
      onClose();
    },
    [onClose],
  );
  const onKey = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSel((s) => Math.min(s + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSel((s) => Math.max(s - 1, 0));
    } else if (e.key === "Enter") {
      if (filtered[sel]) run(filtered[sel]);
    } else if (e.key === "Escape") {
      onClose();
    }
  };
  useEffect(() => {
    listRef.current?.children[sel]?.scrollIntoView({ block: "nearest" });
  }, [sel]);

  const iS = (i) => ({
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "10px 16px",
    cursor: "pointer",
    borderRadius: 6,
    background: i === sel ? "var(--surface-hover)" : "transparent",
    borderLeft: `2px solid ${i === sel ? "var(--accent)" : "transparent"}`,
    transition: "all 0.12s",
  });

  return createPortal(
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        paddingTop: "14vh",
      }}
    >
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(10,10,10,0.72)",
          backdropFilter: "blur(4px)",
          animation: "npFadeIn 0.15s ease",
        }}
      />
      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: 560,
          margin: "0 16px",
          borderRadius: 12,
          border: "1px solid var(--border-hover)",
          background: "var(--bio-bg)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.55)",
          overflow: "hidden",
          animation: "npSlideUp 0.18s cubic-bezier(0.22,1,0.36,1)",
        }}
        onKeyDown={onKey}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "14px 16px",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--text-faint)"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects, links, actions…"
            style={{
              flex: 1,
              background: "none",
              border: "none",
              outline: "none",
              fontFamily: "'IBM Plex Mono',monospace",
              fontSize: 14,
              color: "var(--text-primary)",
              caretColor: "var(--accent)",
            }}
          />
          <kbd
            style={{
              padding: "2px 7px",
              borderRadius: 4,
              border: "1px solid var(--border)",
              background: "var(--surface)",
              fontSize: 11,
              fontFamily: "'IBM Plex Mono',monospace",
              color: "var(--text-faint)",
            }}
          >
            esc
          </kbd>
        </div>
        <div
          ref={listRef}
          style={{ maxHeight: 360, overflowY: "auto", padding: 8 }}
        >
          {filtered.length === 0 ? (
            <div
              style={{
                padding: 24,
                textAlign: "center",
                fontFamily: "'IBM Plex Mono',monospace",
                fontSize: 13,
                color: "var(--text-faint)",
              }}
            >
              No results for "{query}"
            </div>
          ) : (
            filtered.map((cmd, i) => (
              <div
                key={cmd.id}
                style={iS(i)}
                onMouseEnter={() => setSel(i)}
                onClick={() => run(cmd)}
              >
                <span
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 6,
                    border: "1px solid var(--border)",
                    background: "var(--surface)",
                    display: "grid",
                    placeItems: "center",
                    fontSize: 12,
                    color: "var(--text-muted)",
                    flexShrink: 0,
                    fontFamily: "'IBM Plex Mono',monospace",
                  }}
                >
                  {cmd.icon}
                </span>
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 13,
                      fontFamily: "'IBM Plex Mono',monospace",
                      color: "var(--text-primary)",
                      fontWeight: 500,
                    }}
                  >
                    {hl(cmd.label, query)}
                  </div>
                  {cmd.desc && (
                    <div
                      style={{
                        fontSize: 11,
                        fontFamily: "'IBM Plex Mono',monospace",
                        color: "var(--text-faint)",
                        marginTop: 2,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {hl(cmd.desc, query)}
                    </div>
                  )}
                </div>
                {i === sel && (
                  <kbd
                    style={{
                      marginLeft: "auto",
                      padding: "2px 7px",
                      borderRadius: 4,
                      border: "1px solid var(--border-hover)",
                      background: "var(--accent-dim)",
                      fontSize: 10,
                      fontFamily: "'IBM Plex Mono',monospace",
                      color: "var(--accent)",
                      flexShrink: 0,
                    }}
                  >
                    ↵
                  </kbd>
                )}
              </div>
            ))
          )}
        </div>
        <div
          style={{
            padding: "8px 16px",
            borderTop: "1px solid var(--border)",
            display: "flex",
            gap: 16,
            alignItems: "center",
          }}
        >
          {[
            ["↑↓", "navigate"],
            ["↵", "open"],
            ["esc", "close"],
          ].map(([k, v]) => (
            <span
              key={k}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                fontSize: 11,
                fontFamily: "'IBM Plex Mono',monospace",
                color: "var(--text-faint)",
              }}
            >
              <kbd
                style={{
                  padding: "1px 5px",
                  borderRadius: 3,
                  border: "1px solid var(--border)",
                  background: "var(--surface)",
                  fontSize: 10,
                }}
              >
                {k}
              </kbd>
              {v}
            </span>
          ))}
        </div>
      </div>
    </div>,
    document.body,
  );
};

const CommandPalette = ({ projects }) => {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const h = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Open command palette"
        style={{
          position: "fixed",
          bottom: 22,
          right: 24,
          zIndex: 200,
          display: "flex",
          alignItems: "center",
          gap: 7,
          padding: "6px 12px",
          borderRadius: 99,
          border: "1px solid var(--border)",
          background: "var(--surface)",
          color: "var(--text-faint)",
          fontFamily: "'IBM Plex Mono',monospace",
          fontSize: 11,
          cursor: "pointer",
          backdropFilter: "blur(12px)",
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "var(--border-hover)";
          e.currentTarget.style.color = "var(--accent)";
          e.currentTarget.style.background = "var(--accent-dim)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "var(--border)";
          e.currentTarget.style.color = "var(--text-faint)";
          e.currentTarget.style.background = "var(--surface)";
        }}
      >
        <svg
          width="11"
          height="11"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <span>Search</span>
        <kbd
          style={{
            padding: "1px 5px",
            borderRadius: 3,
            border: "1px solid var(--border)",
            background: "rgba(0,0,0,0.15)",
            fontSize: 10,
          }}
        >
          ⌘K
        </kbd>
      </button>
      {open && (
        <PalettePortal projects={projects} onClose={() => setOpen(false)} />
      )}
    </>
  );
};

// ─── Firebase Guestbook ───────────────────────────────────────────────────────
const getDB = () => {
  const cfg = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };
  const app = getApps().length ? getApps()[0] : initializeApp(cfg);
  return getFirestore(app);
};

const CW = 340,
  CH = 120;

const SignaturePad = ({ onSign }) => {
  const cvs = useRef(null);
  const drawing = useRef(false);
  const paths = useRef([]);
  const cur = useRef([]);
  const [empty, setEmpty] = useState(true);

  const pos = (e, c) => {
    const r = c.getBoundingClientRect(),
      sx = c.width / r.width,
      sy = c.height / r.height,
      s = e.touches ? e.touches[0] : e;
    return { x: (s.clientX - r.left) * sx, y: (s.clientY - r.top) * sy };
  };
  const redraw = useCallback(() => {
    const c = cvs.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    ctx.clearRect(0, 0, CW, CH);
    ctx.strokeStyle = "var(--accent,#f4a5e5)";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    [...paths.current, cur.current].forEach((pts) => {
      if (pts.length < 2) return;
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
      ctx.stroke();
    });
  }, []);
  const onS = (e) => {
    e.preventDefault();
    drawing.current = true;
    cur.current = [pos(e, cvs.current)];
  };
  const onM = (e) => {
    e.preventDefault();
    if (!drawing.current) return;
    cur.current.push(pos(e, cvs.current));
    redraw();
  };
  const onE = () => {
    if (!drawing.current) return;
    drawing.current = false;
    if (cur.current.length > 1) {
      paths.current.push([...cur.current]);
      setEmpty(false);
    }
    cur.current = [];
    redraw();
  };
  const clear = () => {
    paths.current = [];
    cur.current = [];
    setEmpty(true);
    cvs.current?.getContext("2d")?.clearRect(0, 0, CW, CH);
  };
  const toSVG = () =>
    paths.current
      .map((pts) =>
        pts.length < 2
          ? ""
          : `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)} ` +
            pts
              .slice(1)
              .map((p) => `L ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
              .join(" "),
      )
      .join(" ");
  const submit = () => {
    if (empty) return;
    onSign(toSVG());
    clear();
  };

  const bBtn = {
    padding: "5px 14px",
    borderRadius: 4,
    border: "1px solid var(--border)",
    background: "var(--surface)",
    color: "var(--text-muted)",
    fontFamily: "'IBM Plex Mono',monospace",
    fontSize: 12,
    cursor: "pointer",
    transition: "all 0.2s",
  };
  return (
    <div>
      <div
        style={{
          position: "relative",
          borderRadius: 8,
          border: "1px solid var(--bio-border)",
          background: "var(--bio-bg)",
          overflow: "hidden",
          userSelect: "none",
          cursor: "crosshair",
        }}
      >
        {empty && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
            }}
          >
            <span
              style={{
                fontFamily: "'IBM Plex Mono',monospace",
                fontSize: 12,
                color: "var(--text-faint)",
              }}
            >
              Sign here ✍
            </span>
          </div>
        )}
        <canvas
          ref={cvs}
          width={CW}
          height={CH}
          style={{ display: "block", width: "100%", touchAction: "none" }}
          onMouseDown={onS}
          onMouseMove={onM}
          onMouseUp={onE}
          onMouseLeave={onE}
          onTouchStart={onS}
          onTouchMove={onM}
          onTouchEnd={onE}
        />
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
        <button style={bBtn} onClick={clear}>
          Clear
        </button>
        <button
          style={{
            ...bBtn,
            background: empty ? "var(--surface)" : "var(--accent-dim)",
            borderColor: empty ? "var(--border)" : "var(--border-hover)",
            color: empty ? "var(--text-faint)" : "var(--accent)",
            cursor: empty ? "not-allowed" : "pointer",
          }}
          onClick={submit}
          disabled={empty}
        >
          Submit signature →
        </button>
      </div>
    </div>
  );
};

const SigView = ({ svgPath, createdAt }) => {
  const date = createdAt?.toDate
    ? createdAt
        .toDate()
        .toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
    : new Date(createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
  return (
    <div
      style={{
        borderRadius: 8,
        border: "1px solid var(--border)",
        background: "var(--surface)",
        padding: "10px 14px",
        transition: "border-color 0.2s",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.borderColor = "var(--border-hover)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.borderColor = "var(--border)")
      }
    >
      <svg
        viewBox={`0 0 ${CW} ${CH}`}
        width="100%"
        height={CH * 0.65}
        style={{ display: "block" }}
      >
        <path
          d={svgPath}
          stroke="var(--accent,#f4a5e5)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
      <div
        style={{
          fontSize: 10,
          fontFamily: "'IBM Plex Mono',monospace",
          color: "var(--text-faint)",
          marginTop: 6,
          textAlign: "right",
        }}
      >
        {date}
      </div>
    </div>
  );
};

const GuestbookModal = ({ onClose }) => {
  const [sigs, setSigs] = useState([]);
  const [status, setStatus] = useState(null);
  const dbRef = useRef(null);

  useEffect(() => {
    try {
      dbRef.current = getDB();
    } catch (e) {
      console.warn("Firebase not configured:", e);
      return;
    }
    const q = query(
      collection(dbRef.current, "signatures"),
      orderBy("createdAt", "desc"),
      limit(40),
    );
    const unsub = onSnapshot(q, (snap) =>
      setSigs(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
    );
    return () => unsub();
  }, []);

  const handleSign = async (svgPath) => {
    if (!dbRef.current) {
      setStatus("error");
      return;
    }
    setStatus("submitting");
    try {
      await addDoc(collection(dbRef.current, "signatures"), {
        svg_path: svgPath,
        createdAt: serverTimestamp(),
      });
      setStatus("success");
    } catch {
      setStatus("error");
    }
    setTimeout(() => setStatus(null), 3000);
  };

  useEffect(() => {
    const h = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", h);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return createPortal(
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9500,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(10,10,10,0.82)",
          backdropFilter: "blur(6px)",
          animation: "npFadeIn 0.2s ease",
        }}
      />
      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: 520,
          maxHeight: "88vh",
          borderRadius: 12,
          border: "1px solid var(--border-hover)",
          background: "var(--bio-bg)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 32px 100px rgba(0,0,0,0.65)",
          display: "flex",
          flexDirection: "column",
          animation: "npSlideUp 0.22s cubic-bezier(0.22,1,0.36,1)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            padding: "20px 22px 16px",
            borderBottom: "1px solid var(--border)",
            flexShrink: 0,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 19,
                fontWeight: 500,
                fontFamily: "'IBM Plex Mono',monospace",
                color: "var(--text-primary)",
                letterSpacing: "-0.3px",
                position: "relative",
                paddingBottom: 14,
                marginBottom: 0,
              }}
            >
              Guestbook
              <span
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: 44,
                  height: 2,
                  background:
                    "linear-gradient(90deg,var(--accent),var(--text-muted),transparent)",
                }}
              />
            </div>
            <p
              style={{
                fontSize: 12,
                fontFamily: "'IBM Plex Mono',monospace",
                color: "var(--text-faint)",
                margin: "6px 0 0",
                lineHeight: 1.6,
              }}
            >
              Leave your mark. No words needed — just your signature.
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              border: "1px solid var(--border)",
              background: "var(--surface)",
              color: "var(--text-muted)",
              cursor: "pointer",
              display: "grid",
              placeItems: "center",
              fontSize: 13,
              flexShrink: 0,
              transition: "all 0.2s",
              marginLeft: 12,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--border-hover)";
              e.currentTarget.style.color = "var(--accent)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--border)";
              e.currentTarget.style.color = "var(--text-muted)";
            }}
          >
            ✕
          </button>
        </div>
        <div
          style={{
            padding: "16px 22px",
            borderBottom: "1px solid var(--border)",
            flexShrink: 0,
          }}
        >
          <SignaturePad onSign={handleSign} />
          {status === "submitting" && (
            <div
              style={{
                marginTop: 10,
                fontSize: 12,
                fontFamily: "'IBM Plex Mono',monospace",
                color: "var(--text-faint)",
              }}
            >
              Saving…
            </div>
          )}
          {status === "success" && (
            <div
              style={{
                marginTop: 10,
                fontSize: 12,
                fontFamily: "'IBM Plex Mono',monospace",
                color: "rgba(74,222,128,0.9)",
              }}
            >
              ✓ Signed! Your mark lives here forever.
            </div>
          )}
          {status === "error" && (
            <div
              style={{
                marginTop: 10,
                fontSize: 12,
                fontFamily: "'IBM Plex Mono',monospace",
                color: "rgba(248,113,113,0.9)",
              }}
            >
              Add Firebase config to .env.local to persist signatures.
            </div>
          )}
        </div>
        <div style={{ overflowY: "auto", padding: "16px 22px 22px", flex: 1 }}>
          {sigs.length === 0 ? (
            <p
              style={{
                fontSize: 13,
                fontFamily: "'IBM Plex Mono',monospace",
                color: "var(--text-faint)",
                textAlign: "center",
                paddingTop: 16,
              }}
            >
              No signatures yet — be the first.
            </p>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
              }}
            >
              {sigs.map((s) => (
                <SigView
                  key={s.id}
                  svgPath={s.svg_path}
                  createdAt={s.createdAt}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
};

// ─── Project icons (all original) ─────────────────────────────────────────────
const HAS_FAVICON = new Set([
  "WorkOnPro Android",
  "WorkOnPro IOS",
  "EstateOne Android",
  "EstateOne IOS",
  "Original Aso Ebi IOS",
  "Original Aso Ebi",
]);
const projectIcons = {
  ChatWot: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  MailSift: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  ),
  ShipMeter: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
  Markly: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <path d="M8 14l2 2 4-4" />
    </svg>
  ),
  Renthall: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
};

const ProjectIcon = ({ proj }) => {
  const hF = HAS_FAVICON.has(proj.name);
  const cI = projectIcons[proj.name];
  let h = "";
  try {
    h = new URL(proj.link).hostname;
  } catch {}
  if (hF && h)
    return (
      <img
        src={`https://www.google.com/s2/favicons?domain=${h}&sz=32`}
        alt=""
        width={16}
        height={16}
        style={{ borderRadius: 4, flexShrink: 0 }}
      />
    );
  if (cI)
    return (
      <span
        style={{
          width: 16,
          height: 16,
          flexShrink: 0,
          color: "var(--text-muted,#888)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {cI}
      </span>
    );
  return null;
};

// ─── Audio wave ───────────────────────────────────────────────────────────────
const AudioWave = () => {
  const ds = ["0ms", "120ms", "80ms", "200ms", "160ms"],
    hs = [8, 16, 12, 20, 8];
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 3,
        padding: "6px 10px",
        borderRadius: 99,
        border: "1px solid rgba(182,174,170,0.15)",
        background: "rgba(182,174,170,0.05)",
        flexShrink: 0,
      }}
    >
      {hs.map((h, i) => (
        <span
          key={i}
          style={{
            display: "block",
            width: 3,
            height: h,
            borderRadius: 99,
            background: "var(--accent)",
            opacity: 0.8,
            animation: `nowPlayingWave 900ms ease-in-out ${ds[i]} infinite`,
          }}
        />
      ))}
    </div>
  );
};

const YTMusicIcon = () => (
  <svg viewBox="0 0 24 24" style={{ width: "100%", height: "100%" }}>
    <circle cx="12" cy="12" r="10" fill="#FF0000" />
    <circle
      cx="12"
      cy="12"
      r="5.8"
      fill="none"
      stroke="white"
      strokeWidth="1.4"
    />
    <path d="M10.3 8.9v6.2l5.3-3.1-5.3-3.1Z" fill="white" />
  </svg>
);
const SpotifyIcon = () => (
  <svg viewBox="0 0 24 24" style={{ width: "100%", height: "100%" }}>
    <circle cx="12" cy="12" r="10" fill="#1ED760" />
    <path
      d="M7.2 9.3c3.3-1 6.9-.7 9.7 1 .4.2.9.1 1.1-.3.2-.4.1-.9-.3-1.1-3.2-1.9-7.2-2.3-11-1.1-.4.1-.7.6-.5 1 .1.4.6.7 1 .5Zm.4 3.2c2.8-.8 5.4-.5 7.7.9.4.2.8.1 1-.2.2-.4.1-.8-.2-1-2.7-1.6-5.7-2-8.9-1-.4.1-.6.5-.5.9.1.3.5.6.9.4Zm.5 2.9c2-.6 4-.4 5.7.6.3.2.7.1.9-.2.2-.3.1-.7-.2-.9-2-1.2-4.4-1.5-6.8-.8-.3.1-.5.5-.4.8.1.4.4.6.8.5Z"
      fill="#111"
    />
  </svg>
);
const AppleMusicIcon = () => (
  <svg viewBox="0 0 24 24" style={{ width: "100%", height: "100%" }}>
    <defs>
      <linearGradient id="amlg" x1="5" x2="19" y1="3" y2="21">
        <stop stopColor="#FB5C74" />
        <stop offset="1" stopColor="#FA243C" />
      </linearGradient>
    </defs>
    <rect width="20" height="20" x="2" y="2" rx="5" fill="url(#amlg)" />
    <path
      d="M16.8 6.1v8.7c0 1.3-1 2.2-2.4 2.2-1.1 0-2-.6-2-1.5 0-1 1-1.7 2.2-1.7.3 0 .6 0 .8.1V8.6l-5.9 1.2v6.3c0 1.3-1 2.2-2.4 2.2-1.1 0-2-.6-2-1.5 0-1 1-1.7 2.2-1.7.3 0 .6 0 .8.1V8.7l8.7-1.8Z"
      fill="white"
    />
  </svg>
);

const MusicLinks = ({ track, compact = false }) => {
  const q = encodeURIComponent(`${track.title} ${track.artist}`);
  const ls = [
    {
      label: "YouTube Music",
      href: `https://music.youtube.com/search?q=${q}`,
      icon: <YTMusicIcon />,
    },
    {
      label: "Spotify",
      href: `https://open.spotify.com/search/${q}`,
      icon: <SpotifyIcon />,
    },
    {
      label: "Apple Music",
      href: `https://music.apple.com/search?term=${q}`,
      icon: <AppleMusicIcon />,
    },
  ];
  if (compact)
    return (
      <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
        {ls.map((l) => (
          <a
            key={l.label}
            href={l.href}
            target="_blank"
            rel="noreferrer"
            title={`Play on ${l.label}`}
            style={{
              display: "grid",
              placeItems: "center",
              width: 30,
              height: 30,
              borderRadius: "50%",
              border: "1px solid rgba(182,174,170,0.15)",
              background: "rgba(182,174,170,0.04)",
              color: "var(--text-muted)",
              textDecoration: "none",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(182,174,170,0.3)";
              e.currentTarget.style.background = "rgba(182,174,170,0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(182,174,170,0.15)";
              e.currentTarget.style.background = "rgba(182,174,170,0.04)";
            }}
          >
            <span style={{ width: 14, height: 14, display: "block" }}>
              {l.icon}
            </span>
          </a>
        ))}
      </div>
    );
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: 8,
        marginTop: 20,
      }}
    >
      {ls.map((l) => (
        <a
          key={l.label}
          href={l.href}
          target="_blank"
          rel="noreferrer"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            height: 38,
            borderRadius: 6,
            border: "1px solid rgba(182,174,170,0.15)",
            background: "rgba(182,174,170,0.04)",
            color: "var(--text-muted)",
            textDecoration: "none",
            fontSize: 11,
            fontFamily: "'IBM Plex Mono',monospace",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "rgba(244,165,229,0.28)";
            e.currentTarget.style.background = "rgba(244,165,229,0.08)";
            e.currentTarget.style.color = "var(--accent)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(182,174,170,0.15)";
            e.currentTarget.style.background = "rgba(182,174,170,0.04)";
            e.currentTarget.style.color = "var(--text-muted)";
          }}
        >
          <span
            style={{ width: 14, height: 14, display: "block", flexShrink: 0 }}
          >
            {l.icon}
          </span>
          <span
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {l.label}
          </span>
        </a>
      ))}
    </div>
  );
};

const AlbumCover = ({ image, size }) => {
  const [err, setErr] = useState(false);
  const iL = size === "large";
  const w = iL ? "100%" : 52,
    h = iL ? 200 : 52;
  if (!image || err)
    return (
      <div
        style={{
          width: w,
          height: h,
          borderRadius: 6,
          background: "rgba(182,174,170,0.08)",
          border: "1px solid rgba(182,174,170,0.12)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="rgba(182,174,170,0.3)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </div>
    );
  return (
    <div style={{ position: "relative", flexShrink: 0, width: w, height: h }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 6,
          backgroundImage: `url(${image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.4,
          filter: "blur(18px)",
          transform: "scale(1.1)",
        }}
      />
      <img
        src={image}
        alt=""
        onError={() => setErr(true)}
        referrerPolicy="no-referrer"
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          borderRadius: 6,
          objectFit: "cover",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 12px 30px rgba(0,0,0,0.3)",
        }}
        loading="lazy"
      />
    </div>
  );
};

const NowPlayingModal = ({ track, onClose }) => {
  useEffect(() => {
    const h = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", h);
      document.body.style.overflow = "";
    };
  }, [onClose]);
  return createPortal(
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(10,10,10,0.88)",
          animation: "npFadeIn 0.18s ease-out",
        }}
      />
      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: 360,
          borderRadius: 12,
          border: "1px solid rgba(182,174,170,0.15)",
          background: "#0f0e0c",
          padding: 20,
          boxShadow: "0 32px 100px rgba(0,0,0,0.7)",
          animation: "npSlideUp 0.22s cubic-bezier(0.22,1,0.36,1)",
          overflow: "hidden",
        }}
      >
        {track.image && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${track.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: 0.08,
            }}
          />
        )}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            zIndex: 10,
            width: 28,
            height: 28,
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.12)",
            background: "rgba(0,0,0,0.4)",
            color: "rgba(182,174,170,0.7)",
            cursor: "pointer",
            display: "grid",
            placeItems: "center",
            fontSize: 13,
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#f5f0ee")}
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "rgba(182,174,170,0.7)")
          }
        >
          ✕
        </button>
        <div style={{ position: "relative" }}>
          <AlbumCover image={track.image} size="large" />
          <div style={{ marginTop: 18 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <p
                style={{
                  fontSize: 11,
                  fontFamily: "'IBM Plex Mono',monospace",
                  color: "rgba(182,174,170,0.5)",
                  margin: 0,
                }}
              >
                What am I listening to?
              </p>
              <AudioWave />
            </div>
            <h2
              style={{
                marginTop: 10,
                marginBottom: 0,
                fontSize: 20,
                fontFamily: "'IBM Plex Mono',monospace",
                fontWeight: 500,
                color: "#f5f0ee",
                lineHeight: 1.3,
              }}
            >
              {track.title}
            </h2>
            <p
              style={{
                marginTop: 5,
                marginBottom: 0,
                fontSize: 14,
                fontFamily: "'IBM Plex Mono',monospace",
                color: "rgba(182,174,170,0.8)",
              }}
            >
              {track.artist}
            </p>
            {track.album && (
              <p
                style={{
                  marginTop: 8,
                  marginBottom: 0,
                  fontSize: 12,
                  fontFamily: "'IBM Plex Mono',monospace",
                  color: "rgba(182,174,170,0.45)",
                }}
              >
                {track.album}
              </p>
            )}
            {track.source && (
              <span
                style={{
                  display: "inline-block",
                  marginTop: 14,
                  padding: "3px 10px",
                  borderRadius: 99,
                  border: "1px solid rgba(255,255,255,0.1)",
                  fontSize: 10,
                  fontFamily: "'IBM Plex Mono',monospace",
                  color: "rgba(182,174,170,0.5)",
                  textTransform: "capitalize",
                }}
              >
                via {track.source}
              </span>
            )}
            <MusicLinks track={track} />
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};

const NowPlaying = () => {
  const [track, setTrack] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    let c = false;
    async function ft() {
      try {
        const r = await fetch("/api/now-playing"),
          d = await r.json();
        if (!c) {
          setTrack(d.track ?? null);
          setLoaded(true);
        }
      } catch {
        if (!c) {
          setTrack(null);
          setLoaded(true);
        }
      }
    }
    ft();
    const iv = setInterval(ft, 30_000);
    return () => {
      c = true;
      clearInterval(iv);
    };
  }, []);
  const base = {
    display: "flex",
    alignItems: "center",
    gap: 12,
    borderRadius: 8,
    border: "1px solid var(--border)",
    background: "var(--surface)",
    padding: "14px 16px",
    transition: "all 0.25s",
    backdropFilter: "blur(8px)",
  };
  if (!loaded)
    return (
      <div style={base}>
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "var(--border)",
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        />
        <span
          style={{
            fontSize: 13,
            fontFamily: "'IBM Plex Mono',monospace",
            color: "var(--text-faint)",
          }}
        >
          Loading…
        </span>
      </div>
    );
  if (!track)
    return (
      <div style={base}>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--text-faint)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 18V5l12-2v13" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="16" r="3" />
        </svg>
        <span
          style={{
            fontSize: 13,
            fontFamily: "'IBM Plex Mono',monospace",
            color: "var(--text-faint)",
          }}
        >
          Not listening to anything right now.
        </span>
      </div>
    );
  return (
    <>
      <div
        style={{ ...base, cursor: "pointer" }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "var(--surface-hover)";
          e.currentTarget.style.borderColor = "var(--border-hover)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "var(--surface)";
          e.currentTarget.style.borderColor = "var(--border)";
        }}
      >
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            flex: 1,
            minWidth: 0,
            textAlign: "left",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
          }}
        >
          <AlbumCover image={track.image} size="small" />
          <div style={{ minWidth: 0, flex: 1 }}>
            <p
              style={{
                fontSize: 11,
                fontFamily: "'IBM Plex Mono',monospace",
                color: "var(--text-faint)",
                margin: "0 0 3px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              What am I listening to?
            </p>
            <p
              style={{
                fontSize: 14,
                fontFamily: "'IBM Plex Mono',monospace",
                color: "var(--text-primary)",
                margin: 0,
                fontWeight: 500,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {track.title}{" "}
              <span style={{ color: "var(--text-faint)" }}>—</span>{" "}
              {track.artist}
            </p>
          </div>
          <AudioWave />
        </button>
        <MusicLinks track={track} compact />
      </div>
      {isOpen && (
        <NowPlayingModal track={track} onClose={() => setIsOpen(false)} />
      )}
    </>
  );
};

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
const PREVIEW = 4;

const MainPage = () => {
  const currentProject = project[0];
  const [mounted, setMounted] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [weatherCondition, setWeatherCondition] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [gbOpen, setGbOpen] = useState(false);

  useEffect(() => {
    window.__openGuestbook = () => setGbOpen(true);
    return () => {
      delete window.__openGuestbook;
    };
  }, []);

  useEffect(() => {
    setMounted(true);

    // ── FIX 1: Robust weather fetch ─────────────────────────────────────────
    getWeatherWithFallback(
      (data) => {
        setWeatherData(data);
        const localHour = new Date().getHours();
        setWeatherCondition(wmoToCondition(data.code, localHour));
      },
      () => {
        // Total failure — just show a nice sky
        setWeatherCondition("cloudy");
      },
    );
  }, []);

  if (!mounted) return null;

  const visible = showAll ? project : project.slice(0, PREVIEW);
  const hasMore = project.length > PREVIEW;

  const weatherClass = weatherCondition
    ? `weather-${weatherCondition}`
    : "weather-night";

  // ── FIX 2: Dynamic glass style driven by live weather ──────────────────────
  const glass = getWeatherGlassStyle(weatherCondition || "cloudy");

  const rowBtn = (accent = false) => ({
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "7px 16px",
    borderRadius: 6,
    border: `1px solid ${accent ? "var(--bio-border)" : "var(--border)"}`,
    background: accent ? "var(--bio-bg)" : "var(--surface)",
    color: "var(--text-muted)",
    fontFamily: "'IBM Plex Mono',monospace",
    fontSize: 12,
    cursor: "pointer",
    transition: "all 0.2s",
    backdropFilter: "blur(8px)",
  });

  return (
    <div className={`weather-root ${weatherClass}`}>
      <style>{`
        @keyframes nowPlayingWave{0%,100%{transform:scaleY(0.45);opacity:0.45;}50%{transform:scaleY(1);opacity:1;}}
        @keyframes npFadeIn{from{opacity:0;}to{opacity:1;}}
        @keyframes npSlideUp{from{opacity:0;transform:scale(0.95) translateY(16px);}to{opacity:1;transform:scale(1) translateY(0);}}
        @keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.4;}}

        /* ── FIX 2: iOS-Weather-style frosted glass cards ─────────────────── */

        /* Bio card */
        .infoss {
          background: ${glass.card.background} !important;
          border: ${glass.card.border} !important;
          backdrop-filter: ${glass.card.backdropFilter} !important;
          -webkit-backdrop-filter: ${glass.card.backdropFilter} !important;
          box-shadow: ${glass.card.boxShadow} !important;
          border-radius: 16px !important;
          color: ${glass.text} !important;
        }

        /* Project items */
        .project-item {
          background: ${glass.card.background} !important;
          border: ${glass.card.border} !important;
          backdrop-filter: ${glass.card.backdropFilter} !important;
          -webkit-backdrop-filter: ${glass.card.backdropFilter} !important;
          box-shadow: ${glass.card.boxShadow} !important;
          border-radius: 12px !important;
          padding: 16px !important;
          margin-bottom: 10px !important;
        }

        /* Section headings */
        .lettl {
          color: ${glass.text} !important;
          text-shadow: 0 1px 8px rgba(0,0,0,0.3) !important;
        }

        /* Name */
        .nameofdev {
          color: ${glass.text} !important;
          text-shadow: 0 2px 16px rgba(0,0,0,0.4) !important;
        }

        /* Bio text & project description */
        .expp, .firstc, .secondc {
          color: ${glass.textMuted} !important;
        }

        /* Email link */
        .email {
          color: ${glass.text} !important;
          opacity: 0.85;
        }

        /* Tech pills */
        .tech-pill {
          background: ${glass.card.background} !important;
          border: ${glass.card.border} !important;
          backdrop-filter: ${glass.card.backdropFilter} !important;
          -webkit-backdrop-filter: ${glass.card.backdropFilter} !important;
          color: ${glass.text} !important;
        }

        /* Social links section */
        .kfie {
          background: ${glass.card.background} !important;
          border: ${glass.card.border} !important;
          backdrop-filter: ${glass.card.backdropFilter} !important;
          -webkit-backdrop-filter: ${glass.card.backdropFilter} !important;
          border-radius: 16px !important;
          padding: 20px !important;
          margin-top: 40px !important;
        }

        /* Social link items */
        .eifj .bugsss {
          color: ${glass.textMuted} !important;
        }

        /* Rights text */
        .rights {
          color: ${glass.textFaint} !important;
        }

        /* Separator */
        .lineee {
          border-color: ${glass.textFaint} !important;
          opacity: 0.3;
        }

        /* Now playing / tech section headers */
        .projj > .lettl::after {
          background: linear-gradient(90deg, var(--accent), transparent) !important;
        }
      `}</style>

      {/* ── Cinematic weather background ────────────────────────────────────── */}
      <WeatherAmbient condition={weatherCondition} />

      {/* ── Floating UI ─────────────────────────────────────────────────────── */}
      <CommandPalette projects={project} />
      {gbOpen && <GuestbookModal onClose={() => setGbOpen(false)} />}

      {/* ── Page content ────────────────────────────────────────────────────── */}
      <div className="cantsyat">
        <div className="mainn">
          {/* ── Header ──────────────────────────────────────────────────────── */}
          <div className="djhdud">
            <div>
              <div className="nameofdev">Timothy Okoduwa</div>
              <VibeBar
                available={true}
                weatherData={weatherData}
                glassStyle={glass}
              />
              <div className="conff" style={{ marginTop: 10 }}>
                <a href="mailto:timothyokoduwa4@gmail.com" className="email">
                  timothyokoduwa4@gmail.com
                </a>
              </div>
            </div>
            <div className="forimage">
              <Image src={p} alt="Timothy's image" width={500} height={500} />
            </div>
          </div>

          {/* ── Bio ─────────────────────────────────────────────────────────── */}
          <div className="infoss">
            Hello and welcome to my digital space! I&apos;m Timothy Okoduwa, a
            passionate problem solver who thrives on creating impactful software
            solutions.
            <br />
            <br />
            I&apos;m always on the hunt for knowledge, whether it&apos;s through
            tutorials, documentation, articles, or any resource that feeds my
            curiosity.
            <br />
            My ultimate aim is to refine my skills and reach the pinnacle of
            engineering excellence.
            <br />
            <br />
            At the moment, I&apos;m building something exciting — a software
            called{" "}
            <a href={currentProject.link} className="email">
              {currentProject.name}
            </a>
            .
            <br />
            <br />
            While I primarily work in the TypeScript/JavaScript ecosystem,
            <br />
            I&apos;m also diving into other fascinating languages like Dart,
            Python, and Solidity.
          </div>

          {/* ── Now Playing ─────────────────────────────────────────────────── */}
          <div className="projj" style={{ marginTop: 40 }}>
            <div className="lettl">What am I listening to?</div>
            <div style={{ marginTop: 14 }}>
              <NowPlaying />
            </div>
          </div>

          {/* ── Tech Stack ──────────────────────────────────────────────────── */}
          <div className="projj" style={{ marginTop: 50 }}>
            <div className="lettl">Tech Stack</div>
            <div className="tech-grid">
              {techStack.map((tech, i) => (
                <div key={i} className="borr tech-pill">
                  <span
                    className="tech-dot"
                    style={{ backgroundColor: tech.color }}
                  />
                  {tech.name}
                </div>
              ))}
            </div>
          </div>

          {/* ── Projects ────────────────────────────────────────────────────── */}
          <div className="projj" id="section-projects">
            <div className="lettl">Projects</div>
            <div>
              {visible.map((proj, index) => (
                <div key={index} className="project-item">
                  <div className="secondp">
                    <div
                      className="firstc"
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <ProjectIcon proj={proj} />
                      {proj.name}
                    </div>
                    <div className="secondc">({proj.type})</div>
                  </div>
                  <div className="expp">{proj.description}</div>
                  <div className="mt-3">
                    <div className="borr">
                      <a
                        href={proj.link}
                        target="_blank"
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        <span>Link</span>{" "}
                        <span className="mx-1">
                          <svg
                            width="10"
                            height="10"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <path
                              d="M12.9999 11.75C12.8099 11.75 12.6199 11.68 12.4699 11.53C12.1799 11.24 12.1799 10.76 12.4699 10.47L20.6699 2.27001C20.9599 1.98001 21.4399 1.98001 21.7299 2.27001C22.0199 2.56001 22.0199 3.04001 21.7299 3.33001L13.5299 11.53C13.3799 11.68 13.1899 11.75 12.9999 11.75Z"
                              fill="currentColor"
                            />
                            <path
                              d="M22 7.55C21.59 7.55 21.25 7.21 21.25 6.8V2.75H17.2C16.79 2.75 16.45 2.41 16.45 2C16.45 1.59 16.79 1.25 17.2 1.25H22C22.41 1.25 22.75 1.59 22.75 2V6.8C22.75 7.21 22.41 7.55 22 7.55Z"
                              fill="currentColor"
                            />
                            <path
                              d="M15 22.75H9C3.57 22.75 1.25 20.43 1.25 15V9C1.25 3.57 3.57 1.25 9 1.25H11C11.41 1.25 11.75 1.59 11.75 2C11.75 2.41 11.41 2.75 11 2.75H9C4.39 2.75 2.75 4.39 2.75 9V15C2.75 19.61 4.39 21.25 9 21.25H15C19.61 21.25 21.25 19.61 21.25 15V13C21.25 12.59 21.59 12.25 22 12.25C22.41 12.25 22.75 12.59 22.75 13V15C22.75 20.43 20.43 22.75 15 22.75Z"
                              fill="currentColor"
                            />
                          </svg>
                        </span>
                      </a>
                    </div>
                    {proj.github !== "" && (
                      <div className="borr">
                        <a
                          href={proj.github}
                          style={{ textDecoration: "none", color: "inherit" }}
                        >
                          <span>GitHub</span>{" "}
                          <span className="mx-1">
                            <svg
                              width="10px"
                              height="10px"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M10 0C4.477 0 0 4.477 0 10c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.483 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 10 4.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C17.138 18.163 20 14.418 20 10c0-5.523-4.477-10-10-10z"
                              />
                            </svg>
                          </span>
                        </a>
                      </div>
                    )}
                    {proj.npm !== "" && (
                      <div className="borr">
                        <a
                          href={proj.npm}
                          style={{ textDecoration: "none", color: "inherit" }}
                        >
                          <span>NPM</span>{" "}
                          <span className="mx-1">
                            <svg
                              width="10px"
                              height="10px"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                            >
                              <path d="M20 3c.552 0 1 .448 1 1v16c0 .552-.448 1-1 1H4c-.552 0-1-.448-1-1V4c0-.552.448-1 1-1h16zm-1 2H5v14h14V5zm-2 2v10h-2.5V9.5H12V17H7V7h10z" />
                            </svg>
                          </span>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                marginTop: 16,
                display: "flex",
                alignItems: "center",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              {hasMore && (
                <button
                  style={rowBtn()}
                  onClick={() => setShowAll((v) => !v)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--border-hover)";
                    e.currentTarget.style.color = "var(--accent)";
                    e.currentTarget.style.background = "var(--accent-dim)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--border)";
                    e.currentTarget.style.color = "var(--text-muted)";
                    e.currentTarget.style.background = "var(--surface)";
                  }}
                >
                  {showAll ? (
                    <>
                      <svg
                        width="11"
                        height="11"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      >
                        <polyline points="18 15 12 9 6 15" />
                      </svg>
                      Show less
                    </>
                  ) : (
                    <>
                      <svg
                        width="11"
                        height="11"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                      Show all {project.length} projects
                    </>
                  )}
                </button>
              )}
              <button
                id="section-guestbook"
                style={rowBtn(true)}
                onClick={() => setGbOpen(true)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--border-hover)";
                  e.currentTarget.style.color = "var(--accent)";
                  e.currentTarget.style.background = "var(--accent-dim)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--bio-border)";
                  e.currentTarget.style.color = "var(--text-muted)";
                  e.currentTarget.style.background = "var(--bio-bg)";
                }}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
                Guestbook
              </button>
            </div>

            {/* ── Social / More ──────────────────────────────────────────────── */}
            <div className="kfie">
              <div className="lettl">More</div>
              <div className="social-list">
                <a href="https://github.com/timothy-okoduwa" className="eifj">
                  <div className="bugsss">
                    <svg
                      width="14px"
                      height="14px"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M10 0C4.477 0 0 4.477 0 10c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.483 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 10 4.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C17.138 18.163 20 14.418 20 10c0-5.523-4.477-10-10-10z"
                      />
                    </svg>
                    <span>Bugs</span>
                  </div>
                </a>
                <a href="https://x.com/TimothyOkoduwa" className="eifj">
                  <div className="bugsss">
                    <svg
                      fill="currentColor"
                      width="14px"
                      height="14px"
                      viewBox="0 0 512 512"
                    >
                      <path d="M459.186,151.787c0.203,4.501,0.305,9.023,0.305,13.565c0,138.542-105.461,298.285-298.274,298.285c-59.209,0-114.322-17.357-160.716-47.104c8.212,0.973,16.546,1.47,25.012,1.47c49.121,0,94.318-16.759,130.209-44.884c-45.887-0.841-84.596-31.154-97.938-72.804c6.408,1.227,12.968,1.886,19.73,1.886c9.55,0,18.816-1.287,27.617-3.68c-47.955-9.633-84.1-52.001-84.1-102.795c0-0.446,0-0.882,0.011-1.318c14.133,7.847,30.294,12.562,47.488,13.109c-28.134-18.796-46.637-50.885-46.637-87.262c0-19.212,5.16-37.218,14.193-52.7c51.707,63.426,128.941,105.156,216.072,109.536c-1.784-7.675-2.718-15.674-2.718-23.896c0-57.891,46.941-104.832,104.832-104.832c30.173,0,57.404,12.734,76.525,33.102c23.887-4.694,46.313-13.423,66.569-25.438c-7.827,24.485-24.434,45.025-46.089,58.002c21.209-2.535,41.426-8.171,60.222-16.505C497.448,118.542,479.666,137.004,459.186,151.787z" />
                    </svg>
                    <span>Rants and Random</span>
                  </div>
                </a>
                <a
                  href="https://www.linkedin.com/in/timothy-okoduwa-b4771b293/"
                  className="eifj"
                >
                  <div className="bugsss">
                    <svg
                      fill="currentColor"
                      width="14px"
                      height="14px"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                    <span>Professional Space 🙄</span>
                  </div>
                </a>
              </div>
              <div className="ouuu">
                <div className="lineee"></div>
                <div style={{ marginTop: 12 }}>
                  <div className="rights">
                    © {getCurrentYearRoman()} Timothy Okoduwa. | All Rights
                    Reserved.
                  </div>
                </div>
                <div className="rights">
                  Source Code:{" "}
                  <a
                    href="https://github.com/timothy-okoduwa/timothy-okoduwa"
                    className="email"
                  >
                    github.com/timothy-okoduwa/timothy-okoduwa
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
