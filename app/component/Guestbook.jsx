/** @format */
"use client";

/**
 * Guestbook.jsx
 * Visitors sign with their mouse/touch — stored as SVG path data in Supabase.
 *
 * Setup:
 * 1. Create a Supabase project (free) at supabase.com
 * 2. Run this SQL in the Supabase SQL editor:
 *      create table signatures (
 *        id uuid default gen_random_uuid() primary key,
 *        svg_path text not null,
 *        created_at timestamptz default now()
 *      );
 *      alter table signatures enable row level security;
 *      create policy "Anyone can read" on signatures for select using (true);
 *      create policy "Anyone can insert" on signatures for insert with check (true);
 *
 * 3. Add to your .env.local:
 *      NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
 *      NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
 *
 * 4. npm install @supabase/supabase-js
 *
 * 5. Drop into MainPage.jsx:
 *      import Guestbook from "./Guestbook";
 *      <Guestbook />   (inside .projj section)
 */

import { useEffect, useRef, useState, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

// ─── Canvas Signature Pad ──────────────────────────────────────────────────

const CANVAS_W = 340;
const CANVAS_H = 120;

function SignaturePad({ onSign }) {
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const paths = useRef([]); // [{x,y}[]]
  const currentPath = useRef([]);
  const [isEmpty, setIsEmpty] = useState(true);

  const getPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const src = e.touches ? e.touches[0] : e;
    return {
      x: (src.clientX - rect.left) * scaleX,
      y: (src.clientY - rect.top) * scaleY,
    };
  };

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
    ctx.strokeStyle = "var(--accent, #f4a5e5)";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    [...paths.current, currentPath.current].forEach((pts) => {
      if (pts.length < 2) return;
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) {
        ctx.lineTo(pts[i].x, pts[i].y);
      }
      ctx.stroke();
    });
  }, []);

  const onStart = (e) => {
    e.preventDefault();
    drawing.current = true;
    const pos = getPos(e, canvasRef.current);
    currentPath.current = [pos];
  };

  const onMove = (e) => {
    e.preventDefault();
    if (!drawing.current) return;
    const pos = getPos(e, canvasRef.current);
    currentPath.current.push(pos);
    redraw();
  };

  const onEnd = () => {
    if (!drawing.current) return;
    drawing.current = false;
    if (currentPath.current.length > 1) {
      paths.current.push([...currentPath.current]);
      setIsEmpty(false);
    }
    currentPath.current = [];
    redraw();
  };

  const clear = () => {
    paths.current = [];
    currentPath.current = [];
    setIsEmpty(true);
    const ctx = canvasRef.current?.getContext("2d");
    ctx?.clearRect(0, 0, CANVAS_W, CANVAS_H);
  };

  // Convert to SVG path string
  const toSVGPath = () => {
    return paths.current
      .map((pts) => {
        if (pts.length < 2) return "";
        return (
          `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)} ` +
          pts
            .slice(1)
            .map((p) => `L ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
            .join(" ")
        );
      })
      .join(" ");
  };

  const handleSubmit = () => {
    if (isEmpty) return;
    onSign(toSVGPath());
    clear();
  };

  const btn = {
    padding: "5px 14px",
    borderRadius: 4,
    border: "1px solid var(--border)",
    background: "var(--surface)",
    color: "var(--text-muted)",
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 12,
    cursor: "pointer",
    transition: "all 0.2s",
  };

  return (
    <div>
      {/* Canvas */}
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
        {/* Watermark */}
        {isEmpty && (
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
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 12,
                color: "var(--text-faint)",
              }}
            >
              Sign here ✍
            </span>
          </div>
        )}
        <canvas
          ref={canvasRef}
          width={CANVAS_W}
          height={CANVAS_H}
          style={{ display: "block", width: "100%", touchAction: "none" }}
          onMouseDown={onStart}
          onMouseMove={onMove}
          onMouseUp={onEnd}
          onMouseLeave={onEnd}
          onTouchStart={onStart}
          onTouchMove={onMove}
          onTouchEnd={onEnd}
        />
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
        <button style={btn} onClick={clear}>
          Clear
        </button>
        <button
          style={{
            ...btn,
            background: isEmpty ? "var(--surface)" : "var(--accent-dim)",
            borderColor: isEmpty ? "var(--border)" : "var(--border-hover)",
            color: isEmpty ? "var(--text-faint)" : "var(--accent)",
            cursor: isEmpty ? "not-allowed" : "pointer",
          }}
          onClick={handleSubmit}
          disabled={isEmpty}
        >
          Submit signature →
        </button>
      </div>
    </div>
  );
}

// ─── SVG Signature Viewer ──────────────────────────────────────────────────

function SignatureView({ svgPath, createdAt }) {
  const date = new Date(createdAt).toLocaleDateString("en-US", {
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
        viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}
        width="100%"
        height={CANVAS_H * 0.65}
        style={{ display: "block" }}
      >
        <path
          d={svgPath}
          stroke="var(--accent, #f4a5e5)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
      <div
        style={{
          fontSize: 10,
          fontFamily: "'IBM Plex Mono', monospace",
          color: "var(--text-faint)",
          marginTop: 6,
          textAlign: "right",
        }}
      >
        {date}
      </div>
    </div>
  );
}

// ─── Main Guestbook ────────────────────────────────────────────────────────

export default function Guestbook() {
  const [sigs, setSigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null); // 'success' | 'error'

  const fetchSigs = useCallback(async () => {
    const { data } = await supabase
      .from("signatures")
      .select("id, svg_path, created_at")
      .order("created_at", { ascending: false })
      .limit(30);
    setSigs(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSigs();
  }, [fetchSigs]);

  const handleSign = async (svgPath) => {
    const { error } = await supabase
      .from("signatures")
      .insert([{ svg_path: svgPath }]);
    if (!error) {
      setStatus("success");
      fetchSigs();
    } else {
      setStatus("error");
    }
    setTimeout(() => setStatus(null), 3000);
  };

  return (
    <div className="projj">
      <div className="lettl">Guestbook</div>
      <p
        style={{
          fontSize: 13,
          fontFamily: "'IBM Plex Mono', monospace",
          color: "var(--text-faint)",
          margin: "8px 0 18px",
          lineHeight: 1.6,
        }}
      >
        Leave your signature. No words needed — just your mark.
      </p>

      <SignaturePad onSign={handleSign} />

      {status === "success" && (
        <div
          style={{
            marginTop: 12,
            fontSize: 12,
            fontFamily: "'IBM Plex Mono', monospace",
            color: "rgba(74,222,128,0.9)",
          }}
        >
          ✓ Signed! Your mark is immortalised.
        </div>
      )}
      {status === "error" && (
        <div
          style={{
            marginTop: 12,
            fontSize: 12,
            fontFamily: "'IBM Plex Mono', monospace",
            color: "rgba(248,113,113,0.9)",
          }}
        >
          Failed to save — try again.
        </div>
      )}

      {/* Signatures grid */}
      {!loading && sigs.length > 0 && (
        <div
          style={{
            marginTop: 24,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
          }}
        >
          {sigs.map((s) => (
            <SignatureView
              key={s.id}
              svgPath={s.svg_path}
              createdAt={s.created_at}
            />
          ))}
        </div>
      )}

      {!loading && sigs.length === 0 && (
        <p
          style={{
            marginTop: 20,
            fontSize: 13,
            fontFamily: "'IBM Plex Mono', monospace",
            color: "var(--text-faint)",
          }}
        >
          No signatures yet. Be the first.
        </p>
      )}
    </div>
  );
}
