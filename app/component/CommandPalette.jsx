/** @format */
"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { createPortal } from "react-dom";

// ─── Static commands ───────────────────────────────────────────────────────
const STATIC_COMMANDS = [
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
    id: "scroll-projects",
    label: "Jump to Projects",
    desc: "Scroll to the projects section",
    icon: "↓",
    action: () =>
      document
        .getElementById("section-projects")
        ?.scrollIntoView({ behavior: "smooth" }),
  },
  {
    id: "scroll-top",
    label: "Scroll to top",
    desc: "",
    icon: "↑",
    action: () => window.scrollTo({ top: 0, behavior: "smooth" }),
  },
];

function highlight(text, query) {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark
        style={{
          background: "rgba(168, 85, 247, 0.2)",
          color: "#c084fc",
          borderRadius: 2,
          padding: "0 2px",
        }}
      >
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}

// ─── Command Palette Portal ────────────────────────────────────────────────

function Palette({ projects, onClose }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  // Build commands list
  const projectCommands = projects.map((p) => ({
    id: `proj-${p.name}`,
    label: p.name,
    desc:
      p.description?.slice(0, 65) +
      (p.description?.length > 65 ? "…" : ""),
    icon: "→",
    action: () => window.open(p.link, "_blank"),
  }));

  const all = [...STATIC_COMMANDS, ...projectCommands];

  const filtered = query
    ? all.filter(
        (c) =>
          c.label.toLowerCase().includes(query.toLowerCase()) ||
          c.desc?.toLowerCase().includes(query.toLowerCase()),
      )
    : all;

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    setSelected(0);
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
      setSelected((s) => Math.min(s + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelected((s) => Math.max(s - 1, 0));
    } else if (e.key === "Enter") {
      if (filtered[selected]) run(filtered[selected]);
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  useEffect(() => {
    const el = listRef.current?.children[selected];
    el?.scrollIntoView({ block: "nearest" });
  }, [selected]);

  const itemStyle = (i) => ({
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "10px 14px",
    cursor: "pointer",
    borderRadius: 6,
    background: i === selected ? "rgba(255, 255, 255, 0.05)" : "transparent",
    borderLeft: `2px solid ${i === selected ? "#a855f7" : "transparent"}`,
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
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.85)",
          backdropFilter: "blur(6px)",
        }}
      />

      {/* Panel */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: 560,
          borderRadius: 12,
          border: "1px solid rgba(255, 255, 255, 0.12)",
          background: "#0e0d0a",
          boxShadow:
            "0 32px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(168,85,247,0.15)",
          overflow: "hidden",
        }}
        onKeyDown={onKey}
      >
        {/* Search input */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "14px 16px",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#878580"
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
              fontFamily: "var(--font-dm-sans), sans-serif",
              fontSize: 14,
              color: "#f5f2eb",
              caretColor: "#c084fc",
            }}
          />
          <kbd
            style={{
              padding: "2px 7px",
              borderRadius: 4,
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.05)",
              fontSize: 11,
              fontFamily: "var(--font-ibm-plex-mono), monospace",
              color: "#878580",
            }}
          >
            esc
          </kbd>
        </div>

        {/* Results */}
        <div
          ref={listRef}
          style={{
            maxHeight: 360,
            overflowY: "auto",
            padding: "8px",
          }}
        >
          {filtered.length === 0 ? (
            <div
              style={{
                padding: "24px",
                textAlign: "center",
                fontFamily: "var(--font-dm-sans), sans-serif",
                fontSize: 13,
                color: "#878580",
              }}
            >
              No results for "{query}"
            </div>
          ) : (
            filtered.map((cmd, i) => (
              <div
                key={cmd.id}
                style={itemStyle(i)}
                onMouseEnter={() => setSelected(i)}
                onClick={() => run(cmd)}
              >
                <span
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 6,
                    border: "1px solid rgba(255,255,255,0.08)",
                    background: "rgba(255,255,255,0.03)",
                    display: "grid",
                    placeItems: "center",
                    fontSize: 12,
                    color: i === selected ? "#c084fc" : "#878580",
                    flexShrink: 0,
                    fontFamily: "var(--font-ibm-plex-mono), monospace",
                  }}
                >
                  {cmd.icon}
                </span>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 500,
                      color: i === selected ? "#c084fc" : "#f5f2eb",
                    }}
                  >
                    {highlight(cmd.label, query)}
                  </div>
                  {cmd.desc && (
                    <div
                      style={{
                        fontSize: 12,
                        color: "#878580",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {highlight(cmd.desc, query)}
                    </div>
                  )}
                </div>
                <span
                  style={{
                    fontSize: 11,
                    fontFamily: "var(--font-ibm-plex-mono), monospace",
                    color: "#878580",
                    opacity: i === selected ? 1 : 0.4,
                  }}
                >
                  ↵
                </span>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div
          style={{
            padding: "10px 16px",
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 11,
            color: "#878580",
            fontFamily: "var(--font-ibm-plex-mono), monospace",
          }}
        >
          <span>↑↓ to navigate</span>
          <span>↵ to select</span>
          <span>esc to dismiss</span>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default function CommandPalette({ projects = [], onClose }) {
  return <Palette projects={projects} onClose={onClose} />;
}
