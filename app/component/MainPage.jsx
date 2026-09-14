/** @format */
"use client";

import React, { useState, useEffect } from "react";
import projectData from "./project";
import CommandPalette from "./CommandPalette";
import NowPlaying from "./NowPlaying";

// ─── Roman numeral helper for footer ──────────────────────────────────────────
const getRomanYear = () => {
  const year = new Date().getFullYear();
  const map = [
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
  let num = year;
  let result = "";
  for (const [val, letter] of map) {
    while (num >= val) {
      result += letter;
      num -= val;
    }
  }
  return result;
};

export default function MainPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [cmdOpen, setCmdOpen] = useState(false);

  // Keyboard shortcut listener for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCmdOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Filter projects by category
  const filteredProjects = projectData.filter((item) => {
    if (activeTab === "all") return true;
    if (activeTab === "featured") return item.featured;
    if (activeTab === "saas")
      return (
        item.type.toLowerCase().includes("saas") ||
        item.type.toLowerCase().includes("security")
      );
    if (activeTab === "tools")
      return (
        item.type.toLowerCase().includes("tool") ||
        item.type.toLowerCase().includes("cli") ||
        item.type.toLowerCase().includes("open source")
      );
    if (activeTab === "mobile")
      return (
        item.type.toLowerCase().includes("mobile") ||
        item.type.toLowerCase().includes("app")
      );
    return true;
  });

  return (
    <div className="portfolio-container">
      {/* ─── Top Navigation ─────────────────────────────────────────────────── */}
      <nav className="portfolio-nav">
        <button
          onClick={() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="nav-link active"
        >
          Home
        </button>
        <span className="nav-sep" aria-hidden="true">
          /
        </span>
        <button
          onClick={() => {
            document
              .getElementById("section-projects")
              ?.scrollIntoView({ behavior: "smooth" });
          }}
          className="nav-link"
        >
          Projects
        </button>
        <span className="nav-sep" aria-hidden="true">
          /
        </span>
        <button
          onClick={() => setCmdOpen(true)}
          className="cmd-btn"
          title="Search (Cmd+K)"
        >
          ⌘K
        </button>
      </nav>

      {/* ─── Header / Hero Section ────────────────────────────────────────── */}
      <header className="header-section">
        <h1 className="header-title">Timothy Okoduwa</h1>
        <p className="header-role">Software Engineer</p>

        <p className="header-bio">
          Creator of{" "}
          <a
            href="https://freedom-mac.vercel.app/"
            target="_blank"
            rel="noreferrer"
            className="inline-project-link"
          >
            <img
              src="/freedom.png"
              alt="Freedom"
              className="inline-icon"
              style={{
                width: "1.15em",
                height: "1.15em",
                objectFit: "contain",
                borderRadius: "50%",
                verticalAlign: "-0.15em",
                display: "inline-block",
              }}
            />
            <span>Freedom</span>
          </a>
          ,{" "}
          <a
            href="https://usecloak.top/"
            target="_blank"
            rel="noreferrer"
            className="inline-project-link"
          >
            <img
              src="/cloak.png"
              alt="Cloak"
              className="inline-icon"
              style={{
                width: "1.15em",
                height: "1.15em",
                objectFit: "contain",
                borderRadius: "4px",
                verticalAlign: "-0.15em",
                display: "inline-block",
              }}
            />
            <span>Cloak</span>
          </a>
          ,{" "}
          <a
            href="https://canvoo.vercel.app/"
            target="_blank"
            rel="noreferrer"
            className="inline-project-link"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              className="inline-icon"
              style={{
                width: "1.15em",
                height: "1.15em",
                verticalAlign: "-0.15em",
                display: "inline-block",
              }}
            >
              <path
                d="M12 2L2 7l10 5 10-5-10-5Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 17l10 5 10-5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 12l10 5 10-5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>Canvoo</span>
          </a>
          , and{" "}
          <a
            href="https://vaultenvv.vercel.app/"
            target="_blank"
            rel="noreferrer"
            className="inline-project-link"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              className="inline-icon"
              style={{
                width: "1.15em",
                height: "1.15em",
                verticalAlign: "-0.15em",
                display: "inline-block",
              }}
            >
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span>VaultEnv</span>
          </a>
          . Focused on developer tools, security utilities, macOS apps, and high-craft web software.
        </p>

        {/* Social Links */}
        <div className="social-links">
          <a
            href="https://github.com/timothy-okoduwa"
            target="_blank"
            rel="noreferrer"
            className="social-link"
          >
            GitHub
          </a>
          <span className="nav-sep" aria-hidden="true">
            ·
          </span>
          <a
            href="mailto:timothyokoduwa4@gmail.com"
            target="_blank"
            rel="noreferrer"
            className="social-link"
          >
            Email
          </a>
          <span className="nav-sep" aria-hidden="true">
            ·
          </span>
          <a
            href="https://x.com/TimothyOkoduwa"
            target="_blank"
            rel="noreferrer"
            className="social-link"
          >
            Twitter
          </a>
          <span className="nav-sep" aria-hidden="true">
            ·
          </span>
          <a
            href="https://www.linkedin.com/in/timothy-okoduwa-b4771b293/"
            target="_blank"
            rel="noreferrer"
            className="social-link"
          >
            LinkedIn
          </a>
        </div>

        {/* Live Spotify / YouTube Music Player */}
        <NowPlaying />
      </header>

      {/* ─── Projects Section ─────────────────────────────────────────────── */}
      <section id="section-projects">
        <div className="projects-header-row">
          <h2 className="projects-title">Projects</h2>

          {/* Filter Tabs */}
          <div className="filter-tabs">
            {[
              { id: "all", label: "All" },
              { id: "featured", label: "Featured" },
              { id: "saas", label: "SaaS & Security" },
              { id: "tools", label: "Developer Tools" },
              { id: "mobile", label: "Mobile Apps" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`filter-tab ${activeTab === tab.id ? "active" : ""}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <ul className="projects-list">
          {filteredProjects.map((p, index) => (
            <li key={index} className="project-item">
              <a
                href={p.link}
                target="_blank"
                rel="noreferrer"
                className="project-card"
              >
                <div className="project-card-top">
                  <div className="project-meta-left">
                    <span className="project-name">{p.name}</span>
                    {p.featured && (
                      <span className="badge-featured">Featured</span>
                    )}
                    <span className="project-domain">{p.domain}</span>
                  </div>
                  <span className="project-arrow" aria-hidden="true">
                    ↗
                  </span>
                </div>

                <p className="project-desc">{p.description}</p>

                {(p.github || p.npm) && (
                  <div className="project-tags">
                    {p.github && (
                      <span className="project-tag-link">
                        <span>GitHub</span>
                        <span style={{ fontSize: "10px" }}>↗</span>
                      </span>
                    )}
                    {p.npm && (
                      <span className="project-tag-link">
                        <span>npm</span>
                        <span style={{ fontSize: "10px" }}>↗</span>
                      </span>
                    )}
                  </div>
                )}
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* ─── Footer ───────────────────────────────────────────────────────── */}
      <footer className="footer">
        <p className="footer-copy">© {getRomanYear()} · Timothy Okoduwa</p>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="back-to-top"
        >
          ↑ Back to top
        </button>
      </footer>

      {/* ─── Command Palette Modal ───────────────────────────────────────────── */}
      {cmdOpen && (
        <CommandPalette projects={projectData} onClose={() => setCmdOpen(false)} />
      )}
    </div>
  );
}
