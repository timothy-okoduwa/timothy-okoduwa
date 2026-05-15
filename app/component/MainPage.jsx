/** @format */
"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import project from "./project";
import Image from "next/image";
import p from "./mypic.png";

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
  const romanNumerals = [
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
  let result = "";
  let remaining = year;
  for (const [value, numeral] of romanNumerals) {
    while (remaining >= value) {
      result += numeral;
      remaining -= value;
    }
  }
  return result;
};

const SunIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const MoonIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

// ─── Audio Wave ────────────────────────────────────────────────────────────
const AudioWave = () => {
  const delays = ["0ms", "120ms", "80ms", "200ms", "160ms"];
  const heights = [8, 16, 12, 20, 8];
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
      {heights.map((h, i) => (
        <span
          key={i}
          style={{
            display: "block",
            width: 3,
            height: h,
            borderRadius: 99,
            background: "var(--accent)",
            opacity: 0.8,
            animation: `nowPlayingWave 900ms ease-in-out ${delays[i]} infinite`,
          }}
        />
      ))}
    </div>
  );
};

// ─── Music Platform Links ──────────────────────────────────────────────────
const MusicLinks = ({ track, compact = false }) => {
  const query = encodeURIComponent(`${track.title} ${track.artist}`);
  const links = [
    {
      label: "YouTube Music",
      href: `https://music.youtube.com/search?q=${query}`,
      icon: <YTMusicIcon />,
    },
    {
      label: "Spotify",
      href: `https://open.spotify.com/search/${query}`,
      icon: <SpotifyIcon />,
    },
    {
      label: "Apple Music",
      href: `https://music.apple.com/search?term=${query}`,
      icon: <AppleMusicIcon />,
    },
  ];
  if (compact) {
    return (
      <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
        {links.map((l) => (
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
  }
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: 8,
        marginTop: 20,
      }}
    >
      {links.map((l) => (
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
            fontFamily: "'IBM Plex Mono', monospace",
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

// ─── Album Cover ───────────────────────────────────────────────────────────
const AlbumCover = ({ image, size }) => {
  const [imgError, setImgError] = useState(false);
  const isLarge = size === "large";
  const w = isLarge ? "100%" : 52;
  const h = isLarge ? 200 : 52;

  if (!image || imgError) {
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
  }

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
        onError={() => setImgError(true)}
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

// ─── SVG Icons ────────────────────────────────────────────────────────────
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

// ─── Modal via Portal (fixes fixed-positioning issue) ─────────────────────
const NowPlayingModal = ({ track, onClose }) => {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
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
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(10,10,10,0.88)",
          animation: "npFadeIn 0.18s ease-out",
        }}
      />
      {/* Card */}
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
          animation: "npSlideUp 0.22s cubic-bezier(0.22, 1, 0.36, 1)",
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
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#f5f0ee";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "rgba(182,174,170,0.7)";
          }}
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
                  fontFamily: "'IBM Plex Mono', monospace",
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
                fontFamily: "'IBM Plex Mono', monospace",
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
                fontFamily: "'IBM Plex Mono', monospace",
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
                  fontFamily: "'IBM Plex Mono', monospace",
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
                  fontFamily: "'IBM Plex Mono', monospace",
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

// ─── Now Playing Widget ────────────────────────────────────────────────────
const NowPlaying = () => {
  const [track, setTrack] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function fetchTrack() {
      try {
        const res = await fetch("/api/now-playing");
        const data = await res.json();
        if (!cancelled) {
          setTrack(data.track ?? null);
          setLoaded(true);
        }
      } catch {
        if (!cancelled) {
          setTrack(null);
          setLoaded(true);
        }
      }
    }
    fetchTrack();
    const interval = setInterval(fetchTrack, 30_000);
    return () => {
      cancelled = true;
      clearInterval(interval);
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
            fontFamily: "'IBM Plex Mono', monospace",
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
            fontFamily: "'IBM Plex Mono', monospace",
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
                fontFamily: "'IBM Plex Mono', monospace",
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
                fontFamily: "'IBM Plex Mono', monospace",
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

// ─── Main Component ────────────────────────────────────────────────────────
const MainPage = () => {
  const currentProject = project[0];
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("theme");
    if (saved) setIsDark(saved === "dark");
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  if (!mounted) return null;

  return (
    <div className={isDark ? "theme-dark" : "theme-light"}>
      <style>{`
        @keyframes nowPlayingWave {
          0%, 100% { transform: scaleY(0.45); opacity: 0.45; }
          50% { transform: scaleY(1); opacity: 1; }
        }
        @keyframes npFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes npSlideUp {
          from { opacity: 0; transform: scale(0.95) translateY(16px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>

      <div className="cantsyat">
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          <span className="toggle-track">
            <span className="toggle-thumb">
              {isDark ? <MoonIcon /> : <SunIcon />}
            </span>
          </span>
        </button>

        <div className="mainn">
          {/* Header */}
          <div className="djhdud">
            <div>
              <div className="nameofdev">Timothy Okoduwa</div>
              <div className="conff">
                <a href="mailto:timothyokoduwa4@gmail.com" className="email">
                  timothyokoduwa4@gmail.com
                </a>
              </div>
            </div>
            <div className="forimage">
              <Image src={p} alt="Timothy's image" width={500} height={500} />
            </div>
          </div>

          {/* Bio */}
          <div className="infoss">
            Hello and welcome to my digital space! I&apos;m Timothy Okoduwa, a
            passionate problem solver who thrives on creating impactful software
            solutions. <br />
            <br />
            I&apos;m always on the hunt for knowledge, whether it&apos;s through
            tutorials, documentation, articles, or any resource that feeds my
            curiosity. <br />
            My ultimate aim is to refine my skills and reach the pinnacle of
            engineering excellence. <br />
            <br />
            At the moment, I&apos;m building something exciting — a software
            called{" "}
            <a href={currentProject.link} className="email">
              {currentProject.name}
            </a>
            . <br />
            <br />
            While I primarily work in the TypeScript/JavaScript ecosystem,{" "}
            <br />
            I&apos;m also diving into other fascinating languages like Dart,
            Python, and Solidity.
          </div>

          {/* Now Playing */}
          <div className="projj" style={{ marginTop: 40 }}>
            <div className="lettl">What am I listening to?</div>
            <div style={{ marginTop: 14 }}>
              <NowPlaying />
            </div>
          </div>

          {/* Tech Stack */}
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

          {/* Projects */}
          <div className="projj">
            <div className="lettl">Projects</div>
            <div>
              {project.map((proj, index) => (
                <div key={index} className="project-item">
                  <div className="secondp">
                    <div className="firstc">{proj.name}</div>
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

            {/* Social */}
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
