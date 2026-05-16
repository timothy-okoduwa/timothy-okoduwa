/** @format */
"use client";

/**
 * CommandPalette.jsx
 * Press Cmd+K (Mac) or Ctrl+K (Win/Linux) to open.
 * Searches projects, social links, and sections.
 *
 * Usage in MainPage.jsx:
 *   import CommandPalette from "./CommandPalette";
 *   // Pass your projects array in:
 *   <CommandPalette projects={project} />
 *
 * Place it anywhere inside your root div — it renders as a fixed portal.
 */

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
    id: "scroll-guestbook",
    label: "Jump to Guestbook",
    desc: "Scroll to guestbook & sign",
    icon: "✍",
    action: () =>
      document
        .getElementById("section-guestbook")
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
          background: "var(--accent-dim)",
          color: "var(--accent)",
          borderRadius: 2,
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
    desc: p.description?.slice(0, 60) + (p.description?.length > 60 ? "…" : ""),
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

  // Scroll selected item into view
  useEffect(() => {
    const el = listRef.current?.children[selected];
    el?.scrollIntoView({ block: "nearest" });
  }, [selected]);

  const itemStyle = (i) => ({
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "10px 16px",
    cursor: "pointer",
    borderRadius: 6,
    background: i === selected ? "var(--surface-hover)" : "transparent",
    borderLeft: `2px solid ${i === selected ? "var(--accent)" : "transparent"}`,
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
          background: "rgba(10,10,10,0.72)",
          backdropFilter: "blur(4px)",
          animation: "npFadeIn 0.15s ease",
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
          border: "1px solid var(--border-hover)",
          background: "var(--bg)",
          boxShadow:
            "0 32px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(244,165,229,0.06)",
          overflow: "hidden",
          animation: "npSlideUp 0.18s cubic-bezier(0.22,1,0.36,1)",
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
              fontFamily: "'IBM Plex Mono', monospace",
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
              fontFamily: "'IBM Plex Mono', monospace",
              color: "var(--text-faint)",
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
                fontFamily: "'IBM Plex Mono', monospace",
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
                style={itemStyle(i)}
                onMouseEnter={() => setSelected(i)}
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
                    fontFamily: "'IBM Plex Mono', monospace",
                  }}
                >
                  {cmd.icon}
                </span>
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 13,
                      fontFamily: "'IBM Plex Mono', monospace",
                      color: "var(--text-primary)",
                      fontWeight: 500,
                    }}
                  >
                    {highlight(cmd.label, query)}
                  </div>
                  {cmd.desc && (
                    <div
                      style={{
                        fontSize: 11,
                        fontFamily: "'IBM Plex Mono', monospace",
                        color: "var(--text-faint)",
                        marginTop: 2,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {highlight(cmd.desc, query)}
                    </div>
                  )}
                </div>
                {i === selected && (
                  <kbd
                    style={{
                      marginLeft: "auto",
                      padding: "2px 7px",
                      borderRadius: 4,
                      border: "1px solid var(--border-hover)",
                      background: "var(--accent-dim)",
                      fontSize: 10,
                      fontFamily: "'IBM Plex Mono', monospace",
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

        {/* Footer hint */}
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
                fontFamily: "'IBM Plex Mono', monospace",
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
}

// ─── Trigger + hint ────────────────────────────────────────────────────────

export default function CommandPalette({ projects = [] }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      {/* Subtle hint badge (top-left area) */}
      <button
        onClick={() => setOpen(true)}
        style={{
          position: "fixed",
          bottom: 22,
          right: 24,
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          gap: 7,
          padding: "6px 12px",
          borderRadius: 99,
          border: "1px solid var(--border)",
          background: "var(--surface)",
          color: "var(--text-faint)",
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 11,
          cursor: "pointer",
          backdropFilter: "blur(8px)",
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
            background: "var(--toggle-bg)",
            fontSize: 10,
          }}
        >
          ⌘K
        </kbd>
      </button>

      {open && <Palette projects={projects} onClose={() => setOpen(false)} />}
    </>
  );
}
