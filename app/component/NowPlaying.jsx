/** @format */
"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

/// ─── SVG Icons ────────────────────────────────────────────────────────────
const YTMusicIcon = () => (
  <svg viewBox="0 0 24 24" style={{ width: "100%", height: "100%", display: "block" }}>
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
  <svg viewBox="0 0 24 24" style={{ width: "100%", height: "100%", display: "block" }}>
    <circle cx="12" cy="12" r="10" fill="#1ED760" />
    <path
      d="M7.2 9.3c3.3-1 6.9-.7 9.7 1 .4.2.9.1 1.1-.3.2-.4.1-.9-.3-1.1-3.2-1.9-7.2-2.3-11-1.1-.4.1-.7.6-.5 1 .1.4.6.7 1 .5Zm.4 3.2c2.8-.8 5.4-.5 7.7.9.4.2.8.1 1-.2.2-.4.1-.8-.2-1-2.7-1.6-5.7-2-8.9-1-.4.1-.6.5-.5.9.1.3.5.6.9.4Zm.5 2.9c2-.6 4-.4 5.7.6.3.2.7.1.9-.2.2-.3.1-.7-.2-.9-2-1.2-4.4-1.5-6.8-.8-.3.1-.5.5-.4.8.1.4.4.6.8.5Z"
      fill="#111"
    />
  </svg>
);

const AppleMusicIcon = () => (
  <svg viewBox="0 0 24 24" style={{ width: "100%", height: "100%", display: "block" }}>
    <defs>
      <linearGradient id="amlg" x1="5" x2="19" y1="3" y2="21">
        <stop stopColor="#FB5C74" />
        <stop offset="1" stopColor="#FA243C" />
      </linearGradient>
    </defs>
    <circle cx="12" cy="12" r="10" fill="url(#amlg)" />
    <path
      d="M16.2 6.5v8.3c0 1.2-.9 2-2.2 2-1 0-1.8-.5-1.8-1.4 0-.9.9-1.5 2-1.5.3 0 .5 0 .7.1V8.8l-5.4 1.1v5.8c0 1.2-.9 2-2.2 2-1 0-1.8-.5-1.8-1.4 0-.9.9-1.5 2-1.5.3 0 .5 0 .7.1V8.8l8-1.7Z"
      fill="white"
    />
  </svg>
);

// ─── Audio Wave Animation ─────────────────────────────────────────────────
const AudioWave = () => {
  const delays = ["0ms", "120ms", "80ms", "200ms", "160ms"];
  const heights = [8, 16, 12, 20, 8];
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 3,
        padding: "5px 9px",
        borderRadius: 99,
        border: "1px solid rgba(168, 85, 247, 0.25)",
        background: "rgba(168, 85, 247, 0.08)",
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
            background: "#a855f7",
            opacity: 0.9,
            animation: `nowPlayingWave 900ms ease-in-out ${delays[i]} infinite`,
          }}
        />
      ))}
    </div>
  );
};

// ─── Music Platform Buttons (YouTube Music, Spotify, Apple Music) ─────────
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
      <div style={{ display: "flex", gap: 6, flexShrink: 0, alignItems: "center" }}>
        {links.map((l) => (
          <a
            key={l.label}
            href={l.href}
            target="_blank"
            rel="noreferrer"
            title={`Play on ${l.label}`}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 28,
              height: 28,
              borderRadius: "50%",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              background: "#14120e",
              color: "#878580",
              textDecoration: "none",
              padding: 0,
              margin: 0,
              lineHeight: 0,
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(168, 85, 247, 0.5)";
              e.currentTarget.style.transform = "scale(1.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            <span style={{ width: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 0 }}>
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
        display: "flex",
        gap: 8,
        flexWrap: "wrap",
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
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 14px",
            borderRadius: 8,
            border: "1px solid rgba(255,255,255,0.12)",
            background: "#14120e",
            color: "#f5f2eb",
            fontFamily: "var(--font-mono), monospace",
            fontSize: 12,
            textDecoration: "none",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "rgba(168, 85, 247, 0.5)";
            e.currentTarget.style.background = "rgba(168, 85, 247, 0.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
            e.currentTarget.style.background = "#14120e";
          }}
        >
          <span style={{ width: 16, height: 16, display: "inline-block" }}>{l.icon}</span>
          <span>{l.label}</span>
          <span style={{ opacity: 0.4, fontSize: 10 }}>↗</span>
        </a>
      ))}
    </div>
  );
};

// ─── Album Cover Thumbnail ────────────────────────────────────────────────
const AlbumCover = ({ image, size }) => {
  const [err, setErr] = useState(false);
  const isLg = size === "large";

  if (!image || err) {
    return (
      <div
        style={{
          width: isLg ? "100%" : 42,
          height: isLg ? 320 : 42,
          maxHeight: isLg ? 320 : 42,
          borderRadius: isLg ? 12 : 6,
          border: "1px solid rgba(255,255,255,0.1)",
          background: "#191814",
          display: "grid",
          placeItems: "center",
          color: "#a855f7",
          fontSize: isLg ? 48 : 18,
          flexShrink: 0,
        }}
      >
        🎵
      </div>
    );
  }

  return (
    <div
      style={{
        position: "relative",
        flexShrink: 0,
        width: isLg ? "100%" : 42,
        height: isLg ? "auto" : 42,
        aspectRatio: isLg ? "1 / 1" : "auto",
        maxHeight: isLg ? 340 : 42,
      }}
    >
      <img
        src={image}
        alt=""
        onError={() => setErr(true)}
        referrerPolicy="no-referrer"
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          borderRadius: isLg ? 12 : 6,
          objectFit: "cover",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: isLg
            ? "0 20px 40px rgba(0,0,0,0.6)"
            : "0 12px 30px rgba(0,0,0,0.4)",
        }}
        loading="lazy"
      />
    </div>
  );
};

// ─── Modal Popup for Track Details ───────────────────────────────────────
const NowPlayingModal = ({ track, onClose }) => {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return createPortal(
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
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
          background: "rgba(0,0,0,0.85)",
          backdropFilter: "blur(8px)",
        }}
      />
      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: 420,
          borderRadius: 16,
          border: "1px solid rgba(168, 85, 247, 0.3)",
          background: "#0e0d0a",
          padding: 24,
          boxShadow: "0 32px 100px rgba(0,0,0,0.85)",
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
            top: 14,
            right: 14,
            zIndex: 10,
            width: 30,
            height: 30,
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.12)",
            background: "rgba(0,0,0,0.5)",
            color: "#878580",
            cursor: "pointer",
            display: "grid",
            placeItems: "center",
            fontSize: 13,
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#f5f2eb")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#878580")}
        >
          ✕
        </button>
        <div style={{ position: "relative" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
              marginBottom: 20,
            }}
          >
            <AlbumCover image={track.image} size="large" />
          </div>
          <div>
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
                  fontFamily: "var(--font-mono), monospace",
                  color: "#878580",
                  margin: 0,
                }}
              >
                {track.isPlaying ? "Listening Now" : "Last Listened"}
              </p>
              <AudioWave />
            </div>
            <h2
              style={{
                marginTop: 8,
                marginBottom: 0,
                fontSize: 18,
                fontFamily: "var(--font-mono), monospace",
                fontWeight: 600,
                color: "#f5f2eb",
                lineHeight: 1.3,
              }}
            >
              {track.title}
            </h2>
            <p
              style={{
                marginTop: 4,
                marginBottom: 0,
                fontSize: 14,
                fontFamily: "var(--font-mono), monospace",
                color: "#878580",
              }}
            >
              {track.artist}
            </p>
            {track.album && (
              <p
                style={{
                  marginTop: 6,
                  marginBottom: 0,
                  fontSize: 12,
                  fontFamily: "var(--font-mono), monospace",
                  color: "rgba(135,133,128,0.6)",
                }}
              >
                {track.album}
              </p>
            )}
            <span
              style={{
                display: "inline-block",
                marginTop: 12,
                padding: "3px 10px",
                borderRadius: 99,
                border: "1px solid rgba(168, 85, 247, 0.25)",
                background: "rgba(168, 85, 247, 0.08)",
                fontSize: 10,
                fontFamily: "var(--font-mono), monospace",
                color: "#c084fc",
              }}
            >
              via {track.source || "Spotify & YouTube Music"}
            </span>
            <MusicLinks track={track} />
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};

// ─── Main Now Playing Component ───────────────────────────────────────────
export default function NowPlaying() {
  const [track, setTrack] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    let canceled = false;
    async function fetchTrack() {
      try {
        const res = await fetch("/api/now-playing", { cache: "no-store" });
        const data = await res.json();
        if (!canceled) {
          setTrack(data?.track ?? null);
          setLoaded(true);
        }
      } catch (err) {
        if (!canceled) {
          setTrack(null);
          setLoaded(true);
        }
      }
    }
    fetchTrack();
    const interval = setInterval(fetchTrack, 15000);
    return () => {
      canceled = true;
      clearInterval(interval);
    };
  }, []);

  const baseStyle = {
    display: "flex",
    alignItems: "center",
    gap: 12,
    borderRadius: 10,
    border: "1px solid #1f1e1b",
    background: "#0e0d0a",
    padding: "12px 16px",
    marginTop: "1.5rem",
    maxWidth: "28rem",
    transition: "all 0.2s",
  };

  if (!loaded) {
    return (
      <div style={baseStyle}>
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "#a855f7",
            animation: "ping 1.5s ease-in-out infinite",
          }}
        />
        <span style={{ fontSize: 13, fontFamily: "var(--font-mono)", color: "#878580" }}>
          Loading music stream…
        </span>
      </div>
    );
  }

  // Fallback if no API track
  const activeTrack = track || {
    title: "Chill Lofi Beats",
    artist: "Spotify / YouTube Music",
    album: "Developer Focus",
    image: null,
    source: "Spotify & YouTube Music",
  };

  return (
    <>
      <div
        style={{ ...baseStyle, cursor: "pointer" }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "rgba(168, 85, 247, 0.35)";
          e.currentTarget.style.background = "#14120e";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "#1f1e1b";
          e.currentTarget.style.background = "#0e0d0a";
        }}
      >
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            flex: 1,
            minWidth: 0,
            textAlign: "left",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
          }}
        >
          <AlbumCover image={activeTrack.image} size="small" />
          <div style={{ minWidth: 0, flex: 1 }}>
            <p
              style={{
                fontSize: 11,
                fontFamily: "var(--font-mono), monospace",
                color: "#878580",
                margin: "0 0 3px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {activeTrack.isPlaying ? "Listening Now" : "Last Listened"}
            </p>
            <p
              style={{
                fontSize: 13,
                fontFamily: "var(--font-mono), monospace",
                color: "#f5f2eb",
                margin: 0,
                fontWeight: 500,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {activeTrack.title}{" "}
              <span style={{ color: "#878580" }}>— {activeTrack.artist}</span>
            </p>
          </div>
          <AudioWave />
        </button>
        <MusicLinks track={activeTrack} compact />
      </div>

      {isOpen && (
        <NowPlayingModal track={activeTrack} onClose={() => setIsOpen(false)} />
      )}
    </>
  );
}
