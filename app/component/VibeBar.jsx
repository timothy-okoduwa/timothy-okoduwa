/** @format */
"use client";

/**
 * VibeBar.jsx
 * Shows: timezone · local time · temp · weather · availability badge
 * Drop into app/component/
 *
 * Usage in MainPage.jsx, right below <div className="nameofdev">:
 *   import VibeBar from "./VibeBar";
 *   <VibeBar available={true} />    // or available={false}
 */

import { useEffect, useState } from "react";

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

function pad(n) {
  return String(n).padStart(2, "0");
}

export default function VibeBar({ available = true }) {
  const [weather, setWeather] = useState(null);
  const [time, setTime] = useState("");
  const [tz, setTz] = useState("");

  // Clock tick
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(
        `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`,
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Weather fetch
  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${coords.latitude}&longitude=${coords.longitude}&current=temperature_2m,weathercode&timezone=auto`,
          );
          const data = await res.json();
          setTz(data.timezone_abbreviation || "");
          setWeather({
            temp: Math.round(data.current.temperature_2m),
            code: data.current.weathercode,
          });
        } catch {}
      },
      () => {},
    );
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
    fontFamily: "'IBM Plex Mono', monospace",
    color: "var(--text-muted)",
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
      {/* Availability */}
      <div
        style={{
          ...pill,
          borderColor: available
            ? "rgba(74,222,128,0.3)"
            : "rgba(182,174,170,0.2)",
          background: available ? "rgba(74,222,128,0.07)" : "var(--surface)",
          color: available ? "rgba(74,222,128,0.9)" : "var(--text-faint)",
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

      {/* Time */}
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
        {tz ? ` ${tz}` : ""}
      </div>

      {/* Weather */}
      {weather && (
        <div style={pill}>
          <span style={{ fontSize: 13 }}>
            {WMO_EMOJI[weather.code] ?? "🌡"}
          </span>
          {weather.temp}°C · {WMO_LABEL[weather.code] ?? "Weather"}
        </div>
      )}
    </div>
  );
}
