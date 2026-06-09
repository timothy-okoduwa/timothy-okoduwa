"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import project from "./project";

// ─── Full project list for expanded view ─────────────────────────────────────
const featuredProjects = [
  {
    name: "Canvoo",
    tagline: "Design in the browser, freely.",
    description:
      "Browser-first graphic design with no login and no friction. Canvas presets for Instagram, YouTube, A4, and more. Full Google Fonts support, freehand vector tools, Unsplash image search, and one-click export to PNG, JPG, SVG, or PDF. Open source, MIT licensed, free forever.",
    stack: ["Next.js", "Canvas API", "Google Fonts", "Unsplash API"],
    link: "https://canvoo.vercel.app/",
    github: "https://github.com/timothy-okoduwa/Canvo",
    npm: null,
    category: "Open Source / Design Tool",
  },
  {
    name: "VaultEnv",
    tagline: "Encrypted .env backup across machines",
    description:
      "Back up all your .env files with a single CLI command. AES-256-GCM encryption with PBKDF2-SHA256 key derivation — plaintext never leaves your device. No accounts, no passwords, just a 12-word BIP-39 recovery phrase. Three commands: init, backup, restore.",
    stack: ["Node.js", "AES-256-GCM", "BIP-39", "PBKDF2-SHA256"],
    link: "https://vaultenvv.vercel.app/",
    github: "https://github.com/timothy-okoduwa/vaultenv",
    npm: "https://www.npmjs.com/package/vaultenv-cli",
    category: "Open Source / CLI Tool",
  },
  {
    name: "ChatWot",
    tagline: "Live chat SaaS for any website",
    description:
      "Embed a real-time chat widget on any site with a single script tag. Bidirectional messaging, image sharing, live visitor tracking, and a clean dashboard. Paystack billing for the Pro tier.",
    stack: ["Next.js", "Firebase", "Cloudinary", "Paystack"],
    link: "https://chatwot.vercel.app/",
    github: "",
    category: "SaaS",
  },
  {
    name: "MailSift",
    tagline: "Webmail discovery tool",
    description:
      "Scans thousands of email domains to find working webmail login pages. SIFT token economy, crypto payments, bulk import via .txt/.csv/.pdf, and structured CSV/PDF exports.",
    stack: ["Next.js", "TypeScript", "Node.js"],
    link: "https://mailsiftt.vercel.app/",
    github: "",
    category: "Dev Tool",
  },
  {
    name: "ShipMeter",
    tagline: "Developer productivity analytics",
    description:
      "GitHub commit tracking with 365-day heatmaps, streak gamification, and AI-powered shareable stat cards.",
    stack: ["Next.js", "TypeScript", "Firebase", "Framer Motion"],
    link: "https://shipmeter.vercel.app/",
    github: "https://github.com/timothy-okoduwa/shipmeter",
    category: "SaaS",
  },
  {
    name: "Markly",
    tagline: "Habit tracking, beautifully",
    description:
      "GitHub-style heatmap visualizations for daily habits. Multi-habit tracking, real-time Firebase sync, mobile-first.",
    stack: ["React", "Firebase", "Tailwind CSS", "TypeScript"],
    link: "https://marklyy.vercel.app/",
    github: "https://github.com/timothy-okoduwa/markly",
    category: "Productivity",
  },
  {
    name: "CommitDiff",
    tagline: "AI-generated commit messages",
    description:
      "Analyzes staged code changes and generates professional conventional commits in seconds. CLI + web interface.",
    stack: ["Node.js", "TypeScript", "AI/LLM", "npm CLI"],
    link: "https://commitdiff.vercel.app/",
    github: "https://github.com/timothy-okoduwa/commitdiff",
    category: "AI Tool",
  },
  {
    name: "Snippad",
    tagline: "Collaborative code snippet vault",
    description:
      "Live editing like Figma but for code. Access-controlled sharing, inline comments, real-time React previews.",
    stack: ["Next.js", "Firebase", "TypeScript", "WebSockets"],
    link: "https://snippad.cloud/",
    github: "",
    category: "Platform",
  },
  {
    name: "Naughty Place",
    tagline: "Premium adult lifestyle, Lagos",
    description:
      "Curated adult lifestyle e-commerce platform with discreet same-day delivery across Lagos. Features category browsing, Paystack-powered checkout, Firebase backend, and plain-packaging fulfilment with zero judgement.",
    stack: ["Next.js", "Firebase", "Paystack", "Cloudinary"],
    link: "https://naughtyplace.ng/",
    github: "",
    category: "E-Commerce",
  },
  {
    name: "JSON2Table",
    tagline: "Data explorer for developers",
    description:
      "Converts JSON, YAML, XML, CSV into clean tables and visual relationship graphs. Inspect complex API data fast.",
    stack: ["React", "TypeScript", "D3.js"],
    link: "https://json-2-table.vercel.app/",
    github: "https://github.com/timothy-okoduwa/json2table",
    category: "Dev Tool",
  },

  {
    name: "EstateOne",
    tagline: "Estate management system",
    description:
      "Property admin tool for visitor check-ins, maintenance, emergency alerts, and access control. Available on iOS and Android.",
    stack: ["React Native", "Firebase", "TypeScript"],
    link: "https://play.google.com/store/apps/details?id=com.estatemanage.app&hl=en",
    github: "",
    category: "Mobile App",
  },
  {
    name: "WorkOnPro",
    tagline: "Services marketplace platform",
    description:
      "Connects companies and individuals with registered professionals. Work orders, progress tracking, and protected payments. Available on iOS and Android.",
    stack: ["React Native", "Node.js", "TypeScript"],
    link: "https://play.google.com/store/apps/details?id=com.loveth.workonpro&hl=en",
    github: "",
    category: "Mobile App",
  },
  {
    name: "Original Aso Ebi",
    tagline: "Premium fabric store, Lagos",
    description:
      "Top fabric store on Lagos Island offering traditional and modern fabrics for weddings and cultural events. Web app + iOS mobile app.",
    stack: ["React", "TypeScript", "Node.js"],
    link: "https://originalasoebi.com/",
    github: "",
    category: "E-Commerce",
  },
  {
    name: "Renthall",
    tagline: "Rental property management",
    description:
      "Helps landlords manage tenant info, track payments, and handle property details efficiently, simplifying rental administration.",
    stack: ["Next.js", "TypeScript", "Node.js"],
    link: "https://renthall.ng/search",
    github: "",
    category: "SaaS",
  },

  {
    name: "Vestarplus Design System",
    tagline: "Component library & design system",
    description:
      "A reusable component library built for the VestarPlus team — avatars, alerts, buttons, date pickers, and more. Published on npm.",
    stack: ["React", "TypeScript", "npm"],
    link: "https://vestarplus-design-system.vercel.app/",
    github: "",
    category: "Open Source",
  },

  {
    name: "VPlus Academy",
    tagline: "Tech education platform",
    description:
      "Offers courses in UI/UX design, front-end development, digital marketing, product management, and graphic design.",
    stack: ["Next.js", "TypeScript", "Node.js"],
    link: "https://www.vplusacademy.com/",
    github: "",
    category: "EdTech",
  },
  {
    name: "FDGS Energy Group",
    tagline: "Nigerian energy company website",
    description:
      "Corporate web presence for FDGS Energy Group, specializing in oil trading, maritime logistics, and project management since 2006.",
    stack: ["Next.js", "TypeScript"],
    link: "https://www.fdgsenergygroup.ch/",
    github: "",
    category: "Corporate",
  },
  {
    name: "Pirobi",
    tagline: "Digital agency",
    description:
      "Digital agency specializing in social media management and creative advertising for brands.",
    stack: ["React", "TypeScript"],
    link: "https://pirobi.com/",
    github: "",
    category: "Corporate",
  },
];

// ─── Tech icons with inline SVG paths ─────────────────────────────────────────
const techStack = [
  {
    name: "React",
    color: "#61DAFB",
    svg: `<svg viewBox="0 0 569 512" xmlns:xlink="http://www.w3.org/1999/xlink"><g fill="none" fill-rule="evenodd"><g transform="translate(-227, -256)" fill="#58C4DC" fill-rule="nonzero"><g transform="translate(227, 256)"><path d="M285.5,201 C255.400481,201 231,225.400481 231,255.5 C231,285.599519 255.400481,310 285.5,310 C315.599519,310 340,285.599519 340,255.5 C340,225.400481 315.599519,201 285.5,201" id="react_dark__Path"/><path d="M568.959856,255.99437 C568.959856,213.207656 529.337802,175.68144 466.251623,150.985214 C467.094645,145.423543 467.85738,139.922107 468.399323,134.521063 C474.621631,73.0415145 459.808523,28.6686204 426.709856,9.5541429 C389.677085,-11.8291748 337.36955,3.69129898 284.479928,46.0162134 C231.590306,3.69129898 179.282771,-11.8291748 142.25,9.5541429 C109.151333,28.6686204 94.3382249,73.0415145 100.560533,134.521063 C101.102476,139.922107 101.845139,145.443621 102.708233,151.02537 C97.4493791,153.033193 92.2908847,155.161486 87.3331099,157.39017 C31.0111824,182.708821 0,217.765415 0,255.99437 C0,298.781084 39.6220545,336.307301 102.708233,361.003527 C101.845139,366.565197 101.102476,372.066633 100.560533,377.467678 C94.3382249,438.947226 109.151333,483.32012 142.25,502.434597 C153.629683,508.887578 166.52439,512.186771 179.603923,511.991836 C210.956328,511.991836 247.567589,495.487529 284.479928,465.972527 C321.372196,495.487529 358.003528,511.991836 389.396077,511.991836 C402.475265,512.183856 415.36922,508.884856 426.75,502.434597 C459.848667,483.32012 474.661775,438.947226 468.439467,377.467678 C467.897524,372.066633 467.134789,366.565197 466.291767,361.003527 C529.377946,336.347457 569,298.761006 569,255.99437 M389.155214,27.1025182 C397.565154,26.899606 405.877839,28.9368502 413.241569,33.0055186 C436.223966,46.2772304 446.540955,82.2775015 441.522965,131.770345 C441.181741,135.143488 440.780302,138.556788 440.298575,141.990165 C414.066922,134.08804 387.205771,128.452154 360.010724,125.144528 C343.525021,103.224055 325.192524,82.7564475 305.214266,63.9661533 C336.586743,39.7116483 366.032313,27.1025182 389.135142,27.1025182 M378.356498,310.205598 C368.204912,327.830733 357.150626,344.919965 345.237759,361.405091 C325.045049,363.479997 304.758818,364.51205 284.459856,364.497299 C264.167589,364.51136 243.888075,363.479308 223.702025,361.405091 C211.820914,344.919381 200.80007,327.83006 190.683646,310.205598 C180.532593,292.629285 171.306974,274.534187 163.044553,255.99437 C171.306974,237.454554 180.532593,219.359455 190.683646,201.783142 C200.784121,184.229367 211.770999,167.201087 223.601665,150.764353 C243.824636,148.63809 264.145559,147.579168 284.479928,147.591877 C304.772146,147.579725 325.051559,148.611772 345.237759,150.68404 C357.109048,167.14607 368.136094,184.201112 378.27621,201.783142 C388.419418,219.363718 397.644825,237.458403 405.915303,255.99437 C397.644825,274.530337 388.419418,292.625022 378.27621,310.205598 M419.724813,290.127366 C426.09516,307.503536 431.324985,325.277083 435.380944,343.334682 C417.779633,348.823635 399.836793,353.149774 381.668372,356.285142 C388.573127,345.871232 395.263781,335.035679 401.740334,323.778483 C408.143291,312.655143 414.144807,301.431411 419.805101,290.207679 M246.363271,390.377981 C258.848032,391.140954 271.593728,391.582675 284.5,391.582675 C297.406272,391.582675 310.232256,391.140954 322.737089,390.377981 C310.880643,404.583418 298.10766,417.997563 284.5,430.534446 C270.921643,417.999548 258.18192,404.585125 246.363271,390.377981 Z M187.311556,356.244986 C169.137286,353.123646 151.187726,348.810918 133.578912,343.334682 C137.618549,325.305649 142.828222,307.559058 149.174827,290.207679 C154.754833,301.431411 160.736278,312.655143 167.239594,323.778483 C173.74291,334.901824 180.467017,345.864539 187.311556,356.285142 M149.174827,221.760984 C142.850954,204.473938 137.654787,186.794745 133.619056,168.834762 C151.18418,163.352378 169.085653,159.013101 187.211197,155.844146 C180.346585,166.224592 173.622478,176.986525 167.139234,188.210257 C160.65599,199.433989 154.734761,210.517173 149.074467,221.760984 M322.616657,121.590681 C310.131896,120.827708 297.3862,120.385987 284.379568,120.385987 C271.479987,120.385987 258.767744,120.787552 246.242839,121.590681 C258.061488,107.383537 270.801211,93.9691137 284.379568,81.4342157 C297.99241,93.9658277 310.765727,107.380324 322.616657,121.590681 Z M401.70019,188.210257 C395.196875,176.939676 388.472767,166.09743 381.527868,155.68352 C399.744224,158.819049 417.734224,163.151949 435.380944,168.654058 C431.331963,186.680673 426.122466,204.426664 419.785029,221.781062 C414.205023,210.55733 408.203506,199.333598 401.720262,188.230335 M127.517179,131.790423 C122.438973,82.3176579 132.816178,46.2973086 155.778503,33.0255968 C163.144699,28.9632474 171.455651,26.9264282 179.864858,27.1225964 C202.967687,27.1225964 232.413257,39.7317265 263.785734,63.9862316 C243.794133,82.7898734 225.448298,103.270812 208.949132,125.204763 C181.761691,128.528025 154.90355,134.14313 128.661281,141.990165 C128.199626,138.556788 127.778115,135.163566 127.456963,131.790423 M98.4529773,182.106474 C101.54406,180.767925 104.695358,179.429376 107.906872,178.090828 C114.220532,204.735668 122.781793,230.7969 133.498624,255.99437 C122.761529,281.241316 114.193296,307.357063 107.8868,334.058539 C56.7434387,313.076786 27.0971497,284.003505 27.0971497,255.99437 C27.0971497,229.450947 53.1907013,202.526037 98.4529773,182.106474 Z M155.778503,478.963143 C132.816178,465.691432 122.438973,429.671082 127.517179,380.198317 C127.838331,376.825174 128.259842,373.431953 128.721497,369.978497 C154.953686,377.878517 181.814655,383.514365 209.009348,386.824134 C225.500295,408.752719 243.832321,429.233234 263.805806,448.042665 C220.069,481.834331 180.105722,492.97775 155.838719,478.963143 M441.502893,380.198317 C446.520883,429.691161 436.203894,465.691432 413.221497,478.963143 C388.974566,493.017906 348.991216,481.834331 305.274481,448.042665 C325.241364,429.232737 343.566681,408.752215 360.050868,386.824134 C387.245915,383.516508 414.107066,377.880622 440.338719,369.978497 C440.820446,373.431953 441.221885,376.825174 441.563109,380.198317 M461.193488,334.018382 C454.869166,307.332523 446.294494,281.231049 435.561592,255.99437 C446.289797,230.744081 454.857778,204.629101 461.173416,177.930202 C512.216417,198.911955 541.942994,227.985236 541.942994,255.99437 C541.942994,284.003505 512.296705,313.076786 461.153344,334.058539" id="react_dark__Shape"/></g></g></g></svg>`,
  },
  {
    name: "Next.js",
    color: "#ffffff",
    svg: `<svg viewBox="0 0 180 180"><mask height="180" id="nextjs_icon_dark__:r8:mask0_408_134" maskUnits="userSpaceOnUse" width="180" x="0" y="0" style="mask-type:alpha"><circle cx="90" cy="90" fill="black" r="90"/></mask><g mask="url(#nextjs_icon_dark__:r8:mask0_408_134)"><circle cx="90" cy="90" data-circle="true" fill="black" r="90"/><path d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z" fill="url(#nextjs_icon_dark__:r8:paint0_linear_408_134)"/><rect fill="url(#nextjs_icon_dark__:r8:paint1_linear_408_134)" height="72" width="12" x="115" y="54"/></g><defs><linearGradient gradientUnits="userSpaceOnUse" id="nextjs_icon_dark__:r8:paint0_linear_408_134" x1="109" x2="144.5" y1="116.5" y2="160.5"><stop stop-color="white"/><stop offset="1" stop-color="white" stop-opacity="0"/></linearGradient><linearGradient gradientUnits="userSpaceOnUse" id="nextjs_icon_dark__:r8:paint1_linear_408_134" x1="121" x2="120.799" y1="54" y2="106.875"><stop stop-color="white"/><stop offset="1" stop-color="white" stop-opacity="0"/></linearGradient></defs></svg>`,
  },
  {
    name: "TypeScript",
    color: "#3178C6",
    svg: `<svg viewBox="0 0 256 256" preserveAspectRatio="xMidYMid"><path d="M20 0h216c11.046 0 20 8.954 20 20v216c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20V20C0 8.954 8.954 0 20 0Z" fill="#3178C6"/><path d="M150.518 200.475v27.62c4.492 2.302 9.805 4.028 15.938 5.179 6.133 1.151 12.597 1.726 19.393 1.726 6.622 0 12.914-.633 18.874-1.899 5.96-1.266 11.187-3.352 15.678-6.257 4.492-2.906 8.048-6.704 10.669-11.394 2.62-4.689 3.93-10.486 3.93-17.391 0-5.006-.749-9.394-2.246-13.163a30.748 30.748 0 0 0-6.479-10.055c-2.821-2.935-6.205-5.567-10.149-7.898-3.945-2.33-8.394-4.531-13.347-6.602-3.628-1.497-6.881-2.949-9.761-4.359-2.879-1.41-5.327-2.848-7.342-4.316-2.016-1.467-3.571-3.021-4.665-4.661-1.094-1.64-1.641-3.495-1.641-5.567 0-1.899.489-3.61 1.468-5.135s2.362-2.834 4.147-3.927c1.785-1.094 3.973-1.942 6.565-2.547 2.591-.604 5.471-.906 8.638-.906 2.304 0 4.737.173 7.299.518 2.563.345 5.14.877 7.732 1.597a53.669 53.669 0 0 1 7.558 2.719 41.7 41.7 0 0 1 6.781 3.797v-25.807c-4.204-1.611-8.797-2.805-13.778-3.582-4.981-.777-10.697-1.165-17.147-1.165-6.565 0-12.784.705-18.658 2.115-5.874 1.409-11.043 3.61-15.506 6.602-4.463 2.993-7.99 6.805-10.582 11.437-2.591 4.632-3.887 10.17-3.887 16.615 0 8.228 2.375 15.248 7.127 21.06 4.751 5.811 11.963 10.731 21.638 14.759a291.458 291.458 0 0 1 10.625 4.575c3.283 1.496 6.119 3.049 8.509 4.66 2.39 1.611 4.276 3.366 5.658 5.265 1.382 1.899 2.073 4.057 2.073 6.474a9.901 9.901 0 0 1-1.296 4.963c-.863 1.524-2.174 2.848-3.93 3.97-1.756 1.122-3.945 1.999-6.565 2.632-2.62.633-5.687.95-9.2.95-5.989 0-11.92-1.05-17.794-3.151-5.875-2.1-11.317-5.25-16.327-9.451Zm-46.036-68.733H140V109H41v22.742h35.345V233h28.137V131.742Z" fill="#FFF"/></svg>`,
  },
  {
    name: "Tailwind CSS",
    color: "#06B6D4",
    svg: `<svg fill="none" viewBox="0 0 54 33"><g clip-path="url(#tailwindcss__a)"><path fill="#38bdf8" fill-rule="evenodd" d="M27 0c-7.2 0-11.7 3.6-13.5 10.8 2.7-3.6 5.85-4.95 9.45-4.05 2.054.513 3.522 2.004 5.147 3.653C30.744 13.09 33.808 16.2 40.5 16.2c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.513-3.522-2.004-5.147-3.653C36.756 3.11 33.692 0 27 0zM13.5 16.2C6.3 16.2 1.8 19.8 0 27c2.7-3.6 5.85-4.95 9.45-4.05 2.054.514 3.522 2.004 5.147 3.653C17.244 29.29 20.308 32.4 27 32.4c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.513-3.522-2.004-5.147-3.653C23.256 19.31 20.192 16.2 13.5 16.2z" clip-rule="evenodd"/></g><defs><clipPath id="tailwindcss__a"><path fill="#fff" d="M0 0h54v32.4H0z"/></clipPath></defs></svg>`,
  },
  {
    name: "Node.js",
    color: "#41873F",
    svg: `<svg viewBox="0 0 256 292" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><linearGradient id="nodejs__a" x1="68.188%" x2="27.823%" y1="17.487%" y2="89.755%"><stop offset="0%" stop-color="#41873F"/><stop offset="32.88%" stop-color="#418B3D"/><stop offset="63.52%" stop-color="#419637"/><stop offset="93.19%" stop-color="#3FA92D"/><stop offset="100%" stop-color="#3FAE2A"/></linearGradient><linearGradient id="nodejs__c" x1="43.277%" x2="159.245%" y1="55.169%" y2="-18.306%"><stop offset="13.76%" stop-color="#41873F"/><stop offset="40.32%" stop-color="#54A044"/><stop offset="71.36%" stop-color="#66B848"/><stop offset="90.81%" stop-color="#6CC04A"/></linearGradient><linearGradient id="nodejs__f" x1="-4.389%" x2="101.499%" y1="49.997%" y2="49.997%"><stop offset="9.192%" stop-color="#6CC04A"/><stop offset="28.64%" stop-color="#66B848"/><stop offset="59.68%" stop-color="#54A044"/><stop offset="86.24%" stop-color="#41873F"/></linearGradient><path id="nodejs__b" d="M134.923 1.832c-4.344-2.443-9.502-2.443-13.846 0L6.787 67.801C2.443 70.244 0 74.859 0 79.745v132.208c0 4.887 2.715 9.502 6.787 11.945l114.29 65.968c4.344 2.444 9.502 2.444 13.846 0l114.29-65.968c4.344-2.443 6.787-7.058 6.787-11.945V79.745c0-4.886-2.715-9.501-6.787-11.944L134.923 1.832Z"/><path id="nodejs__e" d="M134.923 1.832c-4.344-2.443-9.502-2.443-13.846 0L6.787 67.801C2.443 70.244 0 74.859 0 79.745v132.208c0 4.887 2.715 9.502 6.787 11.945l114.29 65.968c4.344 2.444 9.502 2.444 13.846 0l114.29-65.968c4.344-2.443 6.787-7.058 6.787-11.945V79.745c0-4.886-2.715-9.501-6.787-11.944L134.923 1.832Z"/></defs><path fill="url(#nodejs__a)" d="M134.923 1.832c-4.344-2.443-9.502-2.443-13.846 0L6.787 67.801C2.443 70.244 0 74.859 0 79.745v132.208c0 4.887 2.715 9.502 6.787 11.945l114.29 65.968c4.344 2.444 9.502 2.444 13.846 0l114.29-65.968c4.344-2.443 6.787-7.058 6.787-11.945V79.745c0-4.886-2.715-9.501-6.787-11.944L134.923 1.832Z"/><mask id="nodejs__d" fill="#fff"><use xlink:href="#nodejs__b"/></mask><path fill="url(#nodejs__c)" d="M249.485 67.8 134.65 1.833c-1.086-.542-2.443-1.085-3.529-1.357L2.443 220.912c1.086 1.357 2.444 2.443 3.8 3.258l114.834 65.968c3.258 1.9 7.059 2.443 10.588 1.357L252.47 70.515c-.815-1.086-1.9-1.9-2.986-2.714Z" mask="url(#nodejs__d)"/><mask id="nodejs__g" fill="#fff"><use xlink:href="#nodejs__e"/></mask><path fill="url(#nodejs__f)" d="M249.756 223.898c3.258-1.9 5.701-5.158 6.787-8.687L130.579.204c-3.258-.543-6.787-.272-9.773 1.628L6.786 67.53l122.979 224.238c1.628-.272 3.529-.815 5.158-1.63l114.833-66.239Z" mask="url(#nodejs__g)"/></svg>`,
  },
  {
    name: "Firebase",
    color: "#FFCA28",
    svg: `<svg fill="none" viewBox="0 0 600 600"><path fill="#FF9100" d="M213.918 560.499c23.248 9.357 48.469 14.909 74.952 15.834 35.84 1.252 69.922-6.158 100.391-20.234-36.537-14.355-69.627-35.348-97.869-61.448-18.306 29.31-45.382 52.462-77.474 65.848Z"/><path fill="#FFC400" d="M291.389 494.66c-64.466-59.622-103.574-145.917-100.269-240.568.108-3.073.27-6.145.46-9.216a166.993 166.993 0 0 0-36.004-5.241 167.001 167.001 0 0 0-51.183 6.153c-17.21 30.145-27.594 64.733-28.888 101.781-3.339 95.611 54.522 179.154 138.409 212.939 32.093-13.387 59.168-36.51 77.475-65.848Z"/><path fill="#FF9100" d="M291.39 494.657c14.988-23.986 24.075-52.106 25.133-82.403 2.783-79.695-50.792-148.251-124.942-167.381-.19 3.071-.352 6.143-.46 9.216-3.305 94.651 35.803 180.946 100.269 240.568Z"/><path fill="#DD2C00" d="M308.231 20.858C266 54.691 232.652 99.302 212.475 150.693c-11.551 29.436-18.81 61.055-20.929 94.2 74.15 19.13 127.726 87.686 124.943 167.38-1.058 30.297-10.172 58.39-25.134 82.404 28.24 26.127 61.331 47.093 97.868 61.447 73.337-33.9 125.37-106.846 128.383-193.127 1.952-55.901-19.526-105.724-49.875-147.778-32.051-44.477-159.5-194.36-159.5-194.36Z"/></svg>`,
  },

  {
    name: "Docker",
    color: "#2496ED",
    svg: `<svg viewBox="0 0 24 24" fill="#008fe2"><path d="M13.98 11.08h2.12a.19.19 0 0 0 .19-.19V9.01a.19.19 0 0 0-.19-.19h-2.12a.18.18 0 0 0-.18.18v1.9c0 .1.08.18.18.18m-2.95-5.43h2.12a.19.19 0 0 0 .18-.19V3.57a.19.19 0 0 0-.18-.18h-2.12a.18.18 0 0 0-.19.18v1.9c0 .1.09.18.19.18m0 2.71h2.12a.19.19 0 0 0 .18-.18V6.29a.19.19 0 0 0-.18-.18h-2.12a.18.18 0 0 0-.19.18v1.89c0 .1.09.18.19.18m-2.93 0h2.12a.19.19 0 0 0 .18-.18V6.29a.18.18 0 0 0-.18-.18H8.1a.18.18 0 0 0-.18.18v1.89c0 .1.08.18.18.18m-2.96 0h2.11a.19.19 0 0 0 .19-.18V6.29a.18.18 0 0 0-.19-.18H5.14a.19.19 0 0 0-.19.18v1.89c0 .1.08.18.19.18m5.89 2.72h2.12a.19.19 0 0 0 .18-.19V9.01a.19.19 0 0 0-.18-.19h-2.12a.18.18 0 0 0-.19.18v1.9c0 .1.09.18.19.18m-2.93 0h2.12a.18.18 0 0 0 .18-.19V9.01a.18.18 0 0 0-.18-.19H8.1a.18.18 0 0 0-.18.18v1.9c0 .1.08.18.18.18m-2.96 0h2.11a.18.18 0 0 0 .19-.19V9.01a.18.18 0 0 0-.18-.19H5.14a.19.19 0 0 0-.19.19v1.88c0 .1.08.19.19.19m-2.92 0h2.12a.18.18 0 0 0 .18-.19V9.01a.18.18 0 0 0-.18-.19H2.22a.18.18 0 0 0-.19.18v1.9c0 .1.08.18.19.18m21.54-1.19c-.06-.05-.67-.51-1.95-.51-.34 0-.68.03-1.01.09a3.77 3.77 0 0 0-1.72-2.57l-.34-.2-.23.33a4.6 4.6 0 0 0-.6 1.43c-.24.97-.1 1.88.4 2.66a4.7 4.7 0 0 1-1.75.42H.76a.75.75 0 0 0-.76.75 11.38 11.38 0 0 0 .7 4.06 6.03 6.03 0 0 0 2.4 3.12c1.18.73 3.1 1.14 5.28 1.14.98 0 1.96-.08 2.93-.26a12.25 12.25 0 0 0 3.82-1.4 10.5 10.5 0 0 0 2.61-2.13c1.25-1.42 2-3 2.55-4.4h.23c1.37 0 2.21-.55 2.68-1 .3-.3.55-.66.7-1.06l.1-.28Z"/></svg>`,
  },
  {
    name: "GitHub",
    color: "#ffffff",
    svg: `<svg viewBox="0 0 1024 1024" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z" transform="scale(64)" fill="#ffff"/></svg>`,
  },
  {
    name: "Vercel",
    color: "#ffffff",
    svg: `<svg viewBox="0 0 256 222" preserveAspectRatio="xMidYMid"><path fill="#fff" d="m128 0 128 221.705H0z"/></svg>`,
  },
  {
    name: "Cloudinary",
    color: "#3448C5",
    svg: `<svg viewBox="0 0 256 168" preserveAspectRatio="xMidYMid"><path fill="#3448C5" d="M75.06 75.202a.7.7 0 0 1 .498.208l23.56 23.581a.7.7 0 0 1-.488 1.188h-6.022c-.39 0-.71.31-.721.7v53.015a12.724 12.724 0 0 0 3.71 8.949l3.52 3.52a.7.7 0 0 1-.487 1.187H70.85c-7.027 0-12.723-5.696-12.723-12.723v-53.948a.7.7 0 0 0-.7-.7h-5.938a.7.7 0 0 1-.509-1.188l23.581-23.58a.7.7 0 0 1 .499-.21Zm52.103 13.656a.7.7 0 0 1 .498.209l23.581 23.496a.7.7 0 0 1-.509 1.188h-6.022c-.39.011-.7.33-.7.72v39.423a12.724 12.724 0 0 0 3.69 8.949l3.541 3.52a.7.7 0 0 1-.509 1.187h-27.716c-7.027 0-12.724-5.696-12.724-12.723v-40.313c0-.39-.31-.71-.7-.721h-6a.7.7 0 0 1-.488-1.188l23.56-23.538a.7.7 0 0 1 .498-.209Zm52.114 13.51c.183 0 .36.075.487.207l23.581 23.56a.7.7 0 0 1-.487 1.209h-6.044a.7.7 0 0 0-.7.7v25.85a12.724 12.724 0 0 0 3.711 8.949l3.52 3.52a.7.7 0 0 1-.487 1.187h-27.801c-7.027 0-12.724-5.696-12.724-12.723v-26.784a.7.7 0 0 0-.7-.7h-5.937a.7.7 0 0 1-.488-1.208l23.58-23.56a.679.679 0 0 1 .489-.207ZM126.686-.002c37.04.27 69.71 24.323 80.964 59.614C235.16 63.202 255.8 86.54 256 114.28c0 22.895-14.319 41.921-37.438 49.842l-.86.289-1.06.339v-17.092c14.695-6.192 23.326-18.428 23.326-33.378-.075-21.097-16.782-38.323-37.78-39.126l-.709-.02h-6.361l-1.527-6.066c-7.494-30.93-35.08-52.79-66.905-53.015-26.187-.125-50.1 14.755-61.576 38.23l-2.36 4.861-4.454.467c-20.112 2.151-36.627 16.862-41.08 36.593-4.39 19.449 3.898 39.527 20.646 50.231l.734.46v18.025h-.106l-1.59-.721C11.744 152.636-2.99 126.08.51 98.616 4.012 71.153 24.938 49.142 52.19 44.258 66.912 16.851 95.575-.177 126.686-.002Z"/></svg>`,
  },
  {
    name: "React Native",
    color: "#61DAFB",
    svg: `<svg preserveAspectRatio="xMidYMid" viewBox="0 0 256 231"><path d="M121 85c2-3 5-4 7-4 1 0 5 1 7 4 16 22 43 67 63 101l26 40c7 8 18 3 24-6s8-15 8-22c0-4-88-168-97-182-9-13-11-16-26-16h-11c-14 0-16 3-25 16C88 30 0 194 0 198c0 7 2 13 8 22s17 14 24 6l26-40c20-34 47-79 63-101Z" fill="#000020"/></svg>`,
  },
  {
    name: "open ai",
    color: "#fff",
    svg: `<svg preserveAspectRatio="xMidYMid" viewBox="0 0 256 260"><path fill="#fff" d="M239.184 106.203a64.716 64.716 0 0 0-5.576-53.103C219.452 28.459 191 15.784 163.213 21.74A65.586 65.586 0 0 0 52.096 45.22a64.716 64.716 0 0 0-43.23 31.36c-14.31 24.602-11.061 55.634 8.033 76.74a64.665 64.665 0 0 0 5.525 53.102c14.174 24.65 42.644 37.324 70.446 31.36a64.72 64.72 0 0 0 48.754 21.744c28.481.025 53.714-18.361 62.414-45.481a64.767 64.767 0 0 0 43.229-31.36c14.137-24.558 10.875-55.423-8.083-76.483Zm-97.56 136.338a48.397 48.397 0 0 1-31.105-11.255l1.535-.87 51.67-29.825a8.595 8.595 0 0 0 4.247-7.367v-72.85l21.845 12.636c.218.111.37.32.409.563v60.367c-.056 26.818-21.783 48.545-48.601 48.601Zm-104.466-44.61a48.345 48.345 0 0 1-5.781-32.589l1.534.921 51.722 29.826a8.339 8.339 0 0 0 8.441 0l63.181-36.425v25.221a.87.87 0 0 1-.358.665l-52.335 30.184c-23.257 13.398-52.97 5.431-66.404-17.803ZM23.549 85.38a48.499 48.499 0 0 1 25.58-21.333v61.39a8.288 8.288 0 0 0 4.195 7.316l62.874 36.272-21.845 12.636a.819.819 0 0 1-.767 0L41.353 151.53c-23.211-13.454-31.171-43.144-17.804-66.405v.256Zm179.466 41.695-63.08-36.63L161.73 77.86a.819.819 0 0 1 .768 0l52.233 30.184a48.6 48.6 0 0 1-7.316 87.635v-61.391a8.544 8.544 0 0 0-4.4-7.213Zm21.742-32.69-1.535-.922-51.619-30.081a8.39 8.39 0 0 0-8.492 0L99.98 99.808V74.587a.716.716 0 0 1 .307-.665l52.233-30.133a48.652 48.652 0 0 1 72.236 50.391v.205ZM88.061 139.097l-21.845-12.585a.87.87 0 0 1-.41-.614V65.685a48.652 48.652 0 0 1 79.757-37.346l-1.535.87-51.67 29.825a8.595 8.595 0 0 0-4.246 7.367l-.051 72.697Zm11.868-25.58 28.138-16.217 28.188 16.218v32.434l-28.086 16.218-28.188-16.218-.052-32.434Z"/></svg>`,
  },
  {
    name: "Claude",
    color: "#D97757",
    svg: `<svg preserveAspectRatio="xMidYMid" viewBox="0 0 256 257"><path fill="#D97757" d="m50.228 170.321 50.357-28.257.843-2.463-.843-1.361h-2.462l-8.426-.518-28.775-.778-24.952-1.037-24.175-1.296-6.092-1.297L0 125.796l.583-3.759 5.12-3.434 7.324.648 16.202 1.101 24.304 1.685 17.629 1.037 26.118 2.722h4.148l.583-1.685-1.426-1.037-1.101-1.037-25.147-17.045-27.22-18.017-14.258-10.37-7.713-5.25-3.888-4.925-1.685-10.758 7-7.713 9.397.649 2.398.648 9.527 7.323 20.35 15.75L94.817 91.9l3.889 3.24 1.555-1.102.195-.777-1.75-2.917-14.453-26.118-15.425-26.572-6.87-11.018-1.814-6.61c-.648-2.723-1.102-4.991-1.102-7.778l7.972-10.823L71.42 0 82.05 1.426l4.472 3.888 6.61 15.101 10.694 23.786 16.591 32.34 4.861 9.592 2.592 8.879.973 2.722h1.685v-1.556l1.36-18.211 2.528-22.36 2.463-28.776.843-8.1 4.018-9.722 7.971-5.25 6.222 2.981 5.12 7.324-.713 4.73-3.046 19.768-5.962 30.98-3.889 20.739h2.268l2.593-2.593 10.499-13.934 17.628-22.036 7.778-8.749 9.073-9.657 5.833-4.601h11.018l8.1 12.055-3.628 12.443-11.342 14.388-9.398 12.184-13.48 18.147-8.426 14.518.778 1.166 2.01-.194 30.46-6.481 16.462-2.982 19.637-3.37 8.88 4.148.971 4.213-3.5 8.62-20.998 5.184-24.628 4.926-36.682 8.685-.454.324.519.648 16.526 1.555 7.065.389h17.304l32.21 2.398 8.426 5.574 5.055 6.805-.843 5.184-12.962 6.611-17.498-4.148-40.83-9.721-14-3.5h-1.944v1.167l11.666 11.406 21.387 19.314 26.767 24.887 1.36 6.157-3.434 4.86-3.63-.518-23.526-17.693-9.073-7.972-20.545-17.304h-1.36v1.814l4.73 6.935 25.017 37.59 1.296 11.536-1.814 3.76-6.481 2.268-7.13-1.297-14.647-20.544-15.1-23.138-12.185-20.739-1.49.843-7.194 77.448-3.37 3.953-7.778 2.981-6.48-4.925-3.436-7.972 3.435-15.749 4.148-20.544 3.37-16.333 3.046-20.285 1.815-6.74-.13-.454-1.49.194-15.295 20.999-23.267 31.433-18.406 19.702-4.407 1.75-7.648-3.954.713-7.064 4.277-6.286 25.47-32.405 15.36-20.092 9.917-11.6-.065-1.686h-.583L44.07 198.125l-12.055 1.555-5.185-4.86.648-7.972 2.463-2.593 20.35-13.999-.064.065Z"/></svg>`,
  },
  {
    name: "Open router",
    color: "#fff",
    svg: ` <svg viewBox="0 0 512 512" fill="#ffff" stroke="#ffff"><g clip-path="url(#openrouter_dark__clip0_205_3)"><path d="M3 248.945C18 248.945 76 236 106 219C136 202 136 202 198 158C276.497 102.293 332 120.945 423 120.945" strokeWidth="90"/><path d="M511 121.5L357.25 210.268L357.25 32.7324L511 121.5Z"/><path d="M0 249C15 249 73 261.945 103 278.945C133 295.945 133 295.945 195 339.945C273.497 395.652 329 377 420 377" strokeWidth="90"/><path d="M508 376.445L354.25 287.678L354.25 465.213L508 376.445Z"/></g></svg>`,
  },
  {
    name: "Gemini",
    color: "#3689FF",
    svg: `<svg viewBox="0 0 296 298" fill="none"><mask id="gemini__a" width="296" height="298" x="0" y="0" maskUnits="userSpaceOnUse" style="mask-type:alpha"><path fill="#3186FF" d="M141.201 4.886c2.282-6.17 11.042-6.071 13.184.148l5.985 17.37a184.004 184.004 0 0 0 111.257 113.049l19.304 6.997c6.143 2.227 6.156 10.91.02 13.155l-19.35 7.082a184.001 184.001 0 0 0-109.495 109.385l-7.573 20.629c-2.241 6.105-10.869 6.121-13.133.025l-7.908-21.296a184 184 0 0 0-109.02-108.658l-19.698-7.239c-6.102-2.243-6.118-10.867-.025-13.132l20.083-7.467A183.998 183.998 0 0 0 133.291 26.28l7.91-21.394Z"/></mask><g mask="url(#gemini__a)"><g filter="url(#gemini__b)"><ellipse cx="163" cy="149" fill="#3689FF" rx="196" ry="159"/></g><g filter="url(#gemini__c)"><ellipse cx="33.5" cy="142.5" fill="#F6C013" rx="68.5" ry="72.5"/></g><g filter="url(#gemini__d)"><ellipse cx="19.5" cy="148.5" fill="#F6C013" rx="68.5" ry="72.5"/></g><g filter="url(#gemini__e)"><path fill="#FA4340" d="M194 10.5C172 82.5 65.5 134.333 22.5 135L144-66l50 76.5Z"/></g><g filter="url(#gemini__f)"><path fill="#FA4340" d="M190.5-12.5C168.5 59.5 62 111.333 19 112L140.5-89l50 76.5Z"/></g><g filter="url(#gemini__g)"><path fill="#14BB69" d="M194.5 279.5C172.5 207.5 66 155.667 23 155l121.5 201 50-76.5Z"/></g><g filter="url(#gemini__h)"><path fill="#14BB69" d="M196.5 320.5C174.5 248.5 68 196.667 25 196l121.5 201 50-76.5Z"/></g></g><defs><filter id="gemini__b" width="464" height="390" x="-69" y="-46" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_69_17998" stdDeviation="18"/></filter><filter id="gemini__c" width="265" height="273" x="-99" y="6" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_69_17998" stdDeviation="32"/></filter><filter id="gemini__d" width="265" height="273" x="-113" y="12" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_69_17998" stdDeviation="32"/></filter><filter id="gemini__e" width="299.5" height="329" x="-41.5" y="-130" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_69_17998" stdDeviation="32"/></filter><filter id="gemini__f" width="299.5" height="329" x="-45" y="-153" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_69_17998" stdDeviation="32"/></filter><filter id="gemini__g" width="299.5" height="329" x="-41" y="91" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_69_17998" stdDeviation="32"/></filter><filter id="gemini__h" width="299.5" height="329" x="-39" y="132" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_69_17998" stdDeviation="32"/></filter></defs></svg>`,
  },
];

// ─── Triangle/Square/Circle SVGs from uploaded files ─────────────────────────
const TriangleSVG = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="112"
    height="112"
    color="currentColor"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinejoin="round"
  >
    <path d="M5.59347 9.22474C7.83881 5.62322 8.96148 3.82246 10.4326 3.28C11.445 2.90667 12.555 2.90667 13.5674 3.28C15.0385 3.82246 16.1612 5.62322 18.4065 9.22474C20.9338 13.2785 22.1975 15.3054 21.9749 16.9779C21.8222 18.125 21.2521 19.173 20.3762 19.9163C19.0993 21 16.7328 21 12 21C7.26716 21 4.90074 21 3.62378 19.9163C2.74792 19.173 2.17775 18.125 2.02509 16.9779C1.80252 15.3054 3.06617 13.2785 5.59347 9.22474Z" />
  </svg>
);
const SquareSVG = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="112"
    height="112"
    color="currentColor"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <path d="M2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12Z" />
  </svg>
);
const CircleSVG = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="112"
    height="112"
    color="currentColor"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
  </svg>
);

// ─── Scroll-triggered text reveal ─────────────────────────────────────────────
const ScrollRevealText = () => {
  return (
    <section
      style={{
        padding: "140px 6%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          maxWidth: 980,
          width: "100%",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          gap: "0.6em",
        }}
      >
        {[
          "I don't build for attention.",
          "I build for obsession.",
          "Most digital products feel unfinished.",
          "Too many features. Not enough clarity.",
          "Too much noise. Not enough direction.",
          "The best products feel unavoidable.",
          "Fast. Focused. Beautiful.",
          "That's the standard.",
        ].map((line, i) => (
          <p
            key={i}
            style={{
              fontFamily:
                "-apple-system, 'SF Pro Display', 'Inter', 'Helvetica Neue', sans-serif",
              fontSize: "clamp(22px, 3.8vw, 48px)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.2,
              color:
                i === 0 || i === 1
                  ? "#ffffff"
                  : `rgba(255,255,255,${0.9 - i * 0.05})`,
              margin: 0,
            }}
          >
            {line}
          </p>
        ))}
      </div>
    </section>
  );
};

// ─── Three.js Cube ────────────────────────────────────────────────────────────
const ThreeCube = () => {
  const mountRef = useRef(null);
  const [threeLoaded, setThreeLoaded] = useState(false);
  const sceneRef = useRef({});

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
    script.onload = () => setThreeLoaded(true);
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (!threeLoaded || !mountRef.current) return;
    const THREE = window.THREE;
    const W = 280,
      H = 280;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, W / H, 0.1, 100);
    camera.position.set(0, 0.5, 5);

    // Metallic cube with gradient-like appearance
    const geo = new THREE.BoxGeometry(2, 2, 2);
    const mat = new THREE.MeshStandardMaterial({
      color: 0xcccccc,
      metalness: 0.9,
      roughness: 0.15,
      envMapIntensity: 1.0,
    });
    const cube = new THREE.Mesh(geo, mat);
    scene.add(cube);

    // Edges
    const edges = new THREE.EdgesGeometry(geo);
    const lineMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.3,
    });
    const wireframe = new THREE.LineSegments(edges, lineMat);
    cube.add(wireframe);

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2);
    dirLight.position.set(3, 3, 3);
    scene.add(dirLight);

    const dirLight2 = new THREE.DirectionalLight(0x8888ff, 1);
    dirLight2.position.set(-3, -1, -3);
    scene.add(dirLight2);

    const topLight = new THREE.PointLight(0xffffff, 1.5, 10);
    topLight.position.set(0, 4, 0);
    scene.add(topLight);

    sceneRef.current = { renderer, scene, camera, cube };

    let mouseX = 0,
      mouseY = 0;
    const onMouse = (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouse);

    let frame;
    const tick = () => {
      frame = requestAnimationFrame(tick);
      cube.rotation.y += 0.004;
      cube.rotation.x += 0.001;
      cube.rotation.y += mouseX * 0.0015;
      cube.rotation.x += mouseY * 0.0008;
      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("mousemove", onMouse);
      renderer.dispose();
      if (
        mountRef.current &&
        renderer.domElement.parentNode === mountRef.current
      ) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [threeLoaded]);

  if (!threeLoaded) {
    // CSS fallback cube while Three.js loads
    return (
      <div
        style={{ width: 160, height: 160, perspective: 600, margin: "0 auto" }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            position: "relative",
            transformStyle: "preserve-3d",
            transform: "rotateX(20deg) rotateY(35deg)",
            animation: "cssSpinY 10s linear infinite",
          }}
        >
          {[
            { t: "translateZ(80px)", bg: "rgba(200,200,220,0.15)" },
            {
              t: "rotateY(180deg) translateZ(80px)",
              bg: "rgba(160,160,180,0.05)",
            },
            {
              t: "rotateY(90deg) translateZ(80px)",
              bg: "rgba(180,180,200,0.1)",
            },
            {
              t: "rotateY(-90deg) translateZ(80px)",
              bg: "rgba(170,170,190,0.08)",
            },
            {
              t: "rotateX(90deg) translateZ(80px)",
              bg: "rgba(220,220,240,0.2)",
            },
            {
              t: "rotateX(-90deg) translateZ(80px)",
              bg: "rgba(140,140,160,0.03)",
            },
          ].map((f, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                width: 160,
                height: 160,
                transform: f.t,
                background: f.bg,
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={mountRef}
      style={{ width: 280, height: 280, margin: "0 auto", cursor: "none" }}
    />
  );
};

// ─── Project card (reference style) ──────────────────────────────────────────
const ProjectCard = ({ proj }) => {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? "rgba(255,255,255,0.04)" : "#101010",
        border: `1px solid ${hov ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.07)"}`,
        borderRadius: 8,
        padding: "28px 24px",
        transition: "all 0.3s ease",
        transform: hov ? "translateY(-3px)" : "none",
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 10,
              letterSpacing: "0.12em",
              color: "rgba(255,255,255,0.28)",
              marginBottom: 6,
            }}
          >
            {proj.category.toUpperCase()}
          </div>
          <div
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 18,
              fontWeight: 500,
              color: "rgba(255,255,255,0.92)",
              letterSpacing: "-0.02em",
            }}
          >
            {proj.name}
          </div>
          <div
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 12,
              color: "rgba(255,255,255,0.38)",
              marginTop: 2,
            }}
          >
            {proj.tagline}
          </div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {proj.github && (
            <a
              href={proj.github}
              target="_blank"
              rel="noreferrer"
              style={{
                width: 28,
                height: 28,
                border: "1px solid rgba(255,255,255,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "rgba(255,255,255,0.4)",
                textDecoration: "none",
                borderRadius: 4,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)";
                e.currentTarget.style.color = "white";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                e.currentTarget.style.color = "rgba(255,255,255,0.4)";
              }}
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
            </a>
          )}
          <a
            href={proj.link}
            target="_blank"
            rel="noreferrer"
            style={{
              width: 28,
              height: 28,
              border: "1px solid rgba(255,255,255,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "rgba(255,255,255,0.4)",
              textDecoration: "none",
              borderRadius: 4,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)";
              e.currentTarget.style.color = "white";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
              e.currentTarget.style.color = "rgba(255,255,255,0.4)";
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
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
            </svg>
          </a>
        </div>
      </div>
      <p
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 12,
          color: "rgba(255,255,255,0.38)",
          lineHeight: 1.75,
          margin: 0,
        }}
      >
        {proj.description}
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
        {proj.stack.map((t) => (
          <span
            key={t}
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 9,
              color: "rgba(255,255,255,0.3)",
              border: "1px solid rgba(255,255,255,0.07)",
              padding: "2px 7px",
              borderRadius: 2,
              letterSpacing: "0.05em",
            }}
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────
export default function ProfessionalMode({ onExit }) {
  const [showAll, setShowAll] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [visibleCount, setVisibleCount] = useState(4);
  const visibleProjects = featuredProjects.slice(0, visibleCount);
  const hasMore = visibleCount < featuredProjects.length;

  useEffect(() => {
    setTimeout(() => setMounted(true), 80);
  }, []);

  const gridBg = {
    backgroundImage: `
      linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
    `,
    backgroundSize: "60px 60px",
  };

  return (
    <div
      style={{
        background: "#0a0a0a",
        minHeight: "100vh",
        color: "#fff",
        overflowX: "hidden",
        position: "relative",
      }}
    >
      <style>{`
        @keyframes cssSpinY { to { transform: rotateX(20deg) rotateY(395deg); } }
        @keyframes proFadeUp { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
        @keyframes proFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 2px; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
        a { color: inherit; }
        @media (max-width: 768px) {
          .pro-two-col { grid-template-columns: 1fr !important; }
          .pro-four-col { grid-template-columns: repeat(2,1fr) !important; }
          .pro-tech-grid { grid-template-columns: repeat(4,1fr) !important; }
          .pro-hero-title { font-size: 38px !important; line-height: 1.05 !important; }
          .pro-cta-title { font-size: 36px !important; }
          .pro-nav { display: none !important; }
          .pro-container { padding-left: 24px !important; padding-right: 24px !important; }
        }
      `}</style>

      {/* Fixed grid bg */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          ...gridBg,
          maskImage:
            "radial-gradient(ellipse 100% 100% at 50% 0%, black 40%, transparent 100%)",
        }}
      />

      {/* Exit btn */}
      <button
        onClick={onExit}
        style={{
          position: "fixed",
          top: 20,
          left: 20,
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "8px 14px",
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 6,
          color: "rgba(255,255,255,0.45)",
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 10,
          letterSpacing: "0.1em",
          cursor: "pointer",
          backdropFilter: "blur(10px)",
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(255,255,255,0.08)";
          e.currentTarget.style.color = "rgba(255,255,255,0.8)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(255,255,255,0.04)";
          e.currentTarget.style.color = "rgba(255,255,255,0.45)";
        }}
      >
        ← PERSONAL MODE
      </button>

      {/* Nav */}
      <nav
        className="pro-nav"
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          zIndex: 100,
          padding: "22px 32px",
          display: "flex",
          alignItems: "center",
          gap: 32,
        }}
      >
        {["Work", "Services", "Stack", "Contact"].map((item) => (
          <a
            key={item}
            href={`#pro-${item.toLowerCase()}`}
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 10,
              color: "rgba(255,255,255,0.3)",
              textDecoration: "none",
              letterSpacing: "0.1em",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "rgba(255,255,255,0.8)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "rgba(255,255,255,0.3)")
            }
          >
            {item.toUpperCase()}
          </a>
        ))}
      </nav>

      {/* ── HERO ──────────────────────────────────────────────────────────────── */}
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "100px 5% 60px",
          position: "relative",
          zIndex: 1,
          textAlign: "center",
        }}
      >
        {/* Glow behind cube */}
        <div
          style={{
            position: "absolute",
            top: "20%",
            left: "50%",
            transform: "translateX(-50%)",
            width: 500,
            height: 500,
            background:
              "radial-gradient(ellipse, rgba(255,255,255,0.04) 0%, transparent 65%)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            animation: "proFloat 5s ease-in-out infinite",
            marginBottom: 8,
            opacity: mounted ? 1 : 0,
            transition: "opacity 0.8s ease",
          }}
        >
          <ThreeCube />
        </div>

        <h1
          className="pro-hero-title"
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "clamp(40px, 7vw, 88px)",
            fontWeight: 500,
            color: "#ffffff",
            margin: "0 0 20px",
            letterSpacing: "-0.04em",
            lineHeight: 1.08,
            animation: mounted ? "proFadeUp 0.9s ease 0.2s both" : "none",
          }}
        >
          I build products
          <br />
          that feel Unavoidable.
        </h1>

        <div
          style={{
            display: "flex",
            gap: 10,
            justifyContent: "center",
            flexWrap: "wrap",
            marginTop: 8,
            animation: mounted ? "proFadeUp 0.9s ease 0.4s both" : "none",
          }}
        >
          <a
            href="mailto:timothyokoduwa4@gmail.com"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "10px 22px",
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: 6,
              color: "rgba(255,255,255,0.85)",
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 12,
              letterSpacing: "0.03em",
              textDecoration: "none",
              backdropFilter: "blur(8px)",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.16)";
              e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.1)";
              e.currentTarget.style.color = "rgba(255,255,255,0.85)";
            }}
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
            Start a project
          </a>
          <a
            href="#pro-work"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "10px 22px",
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 6,
              color: "rgba(255,255,255,0.55)",
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 12,
              letterSpacing: "0.03em",
              textDecoration: "none",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)";
              e.currentTarget.style.color = "rgba(255,255,255,0.85)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
              e.currentTarget.style.color = "rgba(255,255,255,0.55)";
            }}
          >
            View projects →
          </a>
        </div>
      </section>

      {/* ── SCROLL TEXT REVEAL ─────────────────────────────────────────────────── */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <ScrollRevealText />
      </div>

      {/* ── WHAT I DO ────────────────────────────────────────────────────────── */}
      <section
        id="pro-services"
        className="pro-container"
        style={{ padding: "100px 6%", position: "relative", zIndex: 1 }}
      >
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <p
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 22,
              color: "rgba(255,255,255,0.35)",
              letterSpacing: "0.12em",
              marginBottom: 16,
            }}
          >
            WHAT I DO
          </p>
          <h2
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "clamp(32px, 4.5vw, 56px)",
              fontWeight: 500,
              color: "#fff",
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              margin: "0 0 64px",
            }}
          >
            From idea to execution,
            <br />
            without sacrificing momentum.
          </h2>

          <div
            className="pro-two-col"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 1,
            }}
          >
            {[
              {
                title: "Product Engineering",
                desc: "Full-stack product development from architecture to launch. React, Next.js, TypeScript — production-grade from day one.",
                icon: (
                  <svg
                    viewBox="0 0 80 80"
                    fill="none"
                    stroke="rgba(255,255,255,0.6)"
                    strokeWidth="1.2"
                    width="100%"
                    height="100%"
                  >
                    <circle cx="40" cy="40" r="22" />
                    <circle cx="40" cy="40" r="8" />
                    <line x1="40" y1="18" x2="40" y2="32" />
                    <line x1="40" y1="48" x2="40" y2="62" />
                    <line x1="18" y1="40" x2="32" y2="40" />
                    <line x1="48" y1="40" x2="62" y2="40" />
                  </svg>
                ),
              },
              {
                title: "Design Systems",
                desc: "Component libraries and UI architecture that are reusable, documented, and built to scale consistently across teams.",
                icon: (
                  <svg
                    viewBox="0 0 80 80"
                    fill="none"
                    stroke="rgba(255,255,255,0.6)"
                    strokeWidth="1.2"
                    width="100%"
                    height="100%"
                  >
                    <rect x="20" y="20" width="20" height="20" rx="3" />
                    <rect x="44" y="20" width="16" height="16" rx="3" />
                    <rect x="44" y="40" width="16" height="16" rx="8" />
                    <rect x="20" y="44" width="20" height="16" rx="3" />
                  </svg>
                ),
              },
              {
                title: "Infrastructure",
                desc: "Scalability, availability, internal tooling, and the systems behind modern products. Built for reliability.",
                icon: (
                  <svg
                    viewBox="0 0 80 80"
                    fill="none"
                    stroke="rgba(255,255,255,0.6)"
                    strokeWidth="1.2"
                    width="100%"
                    height="100%"
                  >
                    <rect x="18" y="24" width="44" height="10" rx="3" />
                    <rect x="18" y="38" width="44" height="10" rx="3" />
                    <rect x="18" y="52" width="44" height="10" rx="3" />
                    <circle
                      cx="57"
                      cy="29"
                      r="2.5"
                      fill="rgba(255,255,255,0.6)"
                    />
                    <circle
                      cx="57"
                      cy="43"
                      r="2.5"
                      fill="rgba(255,255,255,0.6)"
                    />
                    <circle
                      cx="57"
                      cy="57"
                      r="2.5"
                      fill="rgba(255,255,255,0.6)"
                    />
                  </svg>
                ),
              },
              {
                title: "AI Products",
                desc: "LLM integrations, AI-powered developer tools, and intelligent interfaces. From prototype to shipped product.",
                icon: (
                  <svg
                    className="block h-full w-full"
                    viewBox="0 0 100 100"
                    fill="none"
                  >
                    {" "}
                    <path
                      d="M50 8C55 31 69 45 92 50C69 55 55 69 50 92C45 69 31 55 8 50C31 45 45 31 50 8Z"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinejoin="round"
                    ></path>{" "}
                  </svg>
                ),
              },
            ].map((s, i) => (
              <div
                key={i}
                style={{
                  background: "#101010",
                  border: "1px solid rgba(255,255,255,0.07)",
                  padding: "36px 32px",
                  cursor: "default",
                  transition: "background 0.3s, border-color 0.3s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.13)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#101010";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
                }}
              >
                <p
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 13,
                    fontWeight: 500,
                    color: "rgba(255,255,255,0.85)",
                    margin: "0 0 8px",
                  }}
                >
                  {s.title}
                </p>
                <p
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 12,
                    color: "rgba(255,255,255,0.38)",
                    lineHeight: 1.7,
                    margin: "0 0 32px",
                  }}
                >
                  {s.desc}
                </p>
                <div style={{ width: 80, height: 80, opacity: 0.7 }}>
                  {s.icon}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROJECTS ──────────────────────────────────────────────────────────── */}
      <section
        id="pro-work"
        className="pro-container"
        style={{ padding: "0 6% 100px", position: "relative", zIndex: 1 }}
      >
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <p
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 22,
              color: "rgba(255,255,255,0.35)",
              letterSpacing: "0.12em",
              marginBottom: 16,
            }}
          >
            PROJECTS
          </p>

          <div
            className="pro-two-col"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              marginBottom: 24,
            }}
          >
            {visibleProjects.map((proj, i) => (
              <ProjectCard key={proj.name} proj={proj} />
            ))}
          </div>

          {featuredProjects.length > 4 && (
            <div style={{ textAlign: "center", marginTop: 8 }}>
              {hasMore && (
                <div style={{ textAlign: "center", marginTop: 8 }}>
                  <button
                    onClick={() => setVisibleCount((c) => c + 4)}
                    style={{
                      padding: "10px 28px",
                      background: "#101010",
                      border: "1px solid rgba(255,255,255,0.15)",
                      borderRadius: 8,
                      color: "rgba(255,255,255,0.55)",
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: 11,
                      letterSpacing: "0.05em",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor =
                        "rgba(255,255,255,0.3)";
                      e.currentTarget.style.color = "rgba(255,255,255,0.85)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor =
                        "rgba(255,255,255,0.15)";
                      e.currentTarget.style.color = "rgba(255,255,255,0.55)";
                    }}
                  >
                    Load more ({featuredProjects.length - visibleCount}{" "}
                    remaining)
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ── HOW I WORK ───────────────────────────────────────────────────────── */}
      <section
        className="pro-container"
        style={{ padding: "0 6% 100px", position: "relative", zIndex: 1 }}
      >
        <style>{`
    .how-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
    }
    .tech-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1px;
      margin-top: 48px;
    }
    @media (max-width: 768px) {
      .how-grid {
        grid-template-columns: 1fr;
      }
      .tech-grid {
        grid-template-columns: repeat(3, 1fr);
        gap: 8px;
      }
    }
  `}</style>

        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <p
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 11,
              color: "rgba(255,255,255,0.35)",
              letterSpacing: "0.12em",
              marginBottom: 16,
            }}
          >
            HOW I WORK
          </p>

          <div className="how-grid">
            {[
              {
                name: "Understand",
                desc: "I dig into the product, the users, and the problem. Define what done looks like before writing a line.",
                Icon: TriangleSVG,
              },
              {
                name: "Build",
                desc: "Fast iterations. Clean executions. Modern tech stack with long-term scalability and performance.",
                Icon: SquareSVG,
              },
              {
                name: "Refine",
                desc: "I polish until the product feels right. Performant, accessible, and precise to the last pixel.",
                Icon: CircleSVG,
              },
            ].map((step) => (
              <div
                key={step.name}
                style={{
                  background: "#101010",
                  border: "1px solid rgba(255,255,255,0.07)",
                  padding: "32px 28px",
                  transition: "all 0.3s",
                  borderRadius: 8,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#101010";
                }}
              >
                <p
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 20,
                    fontWeight: 500,
                    color: "rgba(255,255,255,0.85)",
                    margin: "0 0 8px",
                  }}
                >
                  {step.name}
                </p>
                <p
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 13,
                    color: "rgba(255,255,255,0.38)",
                    lineHeight: 1.7,
                    margin: "0 0 32px",
                  }}
                >
                  {step.desc}
                </p>
                <div
                  style={{
                    color: "#E7E7E7",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                  }}
                >
                  <step.Icon />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TECH STACK ────────────────────────────────────────────────────────── */}
      <section
        id="pro-stack"
        className="pro-container"
        style={{ padding: "0 6% 100px", position: "relative", zIndex: 1 }}
      >
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <h2
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "clamp(22px, 3.5vw, 44px)",
              fontWeight: 500,
              color: "#fff",
              letterSpacing: "-0.03em",
              lineHeight: 1.25,
              margin: "0 0 12px",
            }}
          >
            I build with modern technologies
            <br />
            designed for speed, scalability, and
            <br />
            long-term maintainability.
          </h2>

          <div className="tech-grid">
            {techStack.map((tech) => {
              const [hov, setHov] = useState(false);
              return (
                <div
                  key={tech.name}
                  onMouseEnter={() => setHov(true)}
                  onMouseLeave={() => setHov(false)}
                  style={{
                    background: "#0a0a0a",
                    padding: "20px 12px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                    cursor: "default",
                    transition: "background 0.25s",
                    borderRadius: 6,
                    border: "1px solid rgba(255,255,255,0.04)",
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      color: hov ? tech.color : "rgba(255,255,255,0.25)",
                      filter: hov
                        ? `drop-shadow(0 0 6px ${tech.color}88)`
                        : "none",
                      transition: "color 0.3s ease, filter 0.3s ease",
                    }}
                    dangerouslySetInnerHTML={{ __html: tech.svg }}
                  />
                  <span
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: 9,
                      color: hov
                        ? "rgba(255,255,255,0.5)"
                        : "rgba(255,255,255,0.18)",
                      letterSpacing: "0.08em",
                      textAlign: "center",
                      transition: "color 0.3s ease",
                    }}
                  >
                    {tech.name.toUpperCase()}
                  </span>
                </div>
              );
            })}
            <div
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 14,
                fontWeight: 300,
                color: "rgba(255,255,255,0.4)",
                letterSpacing: "-0.02em",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                padding: "0 12px",
                border: "1px solid rgba(255,255,255,0.04)",
                borderRadius: 6,
                minHeight: 80,
              }}
            >
              ...and more.
            </div>
          </div>
        </div>
      </section>
      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <section
        id="pro-contact"
        className="pro-container"
        style={{
          padding: "120px 6%",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          position: "relative",
          zIndex: 1,
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <p
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 11,
              color: "rgba(255,255,255,0.3)",
              letterSpacing: "0.12em",
              marginBottom: 20,
            }}
          >
            HAVE AN IDEA THAT DESERVES BETTER EXECUTION?
          </p>
          <h2
            className="pro-cta-title"
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "clamp(40px, 6vw, 80px)",
              fontWeight: 500,
              color: "#fff",
              letterSpacing: "-0.04em",
              lineHeight: 1.05,
              margin: "0 0 48px",
            }}
          >
            Let's build something
            <br />
            Unavoidable.
          </h2>
          <a
            href="mailto:timothyokoduwa4@gmail.com"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 32px",
              background: "rgba(255,255,255,0.92)",
              color: "#0a0a0a",
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.04em",
              textDecoration: "none",
              borderRadius: 6,
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#fff")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.92)")
            }
          >
            Start a conversation
          </a>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 28,
              marginTop: 64,
            }}
          >
            {[
              { label: "GitHub", href: "https://github.com/timothy-okoduwa" },
              { label: "Twitter / X", href: "https://x.com/TimothyOkoduwa" },
              {
                label: "LinkedIn",
                href: "https://www.linkedin.com/in/timothy-okoduwa-b4771b293/",
              },
              { label: "Email", href: "mailto:timothyokoduwa4@gmail.com" },
            ].map((l) => (
              <a
                key={l.label}
                href={l.href}
                target={l.href.startsWith("mailto") ? undefined : "_blank"}
                rel="noreferrer"
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 10,
                  color: "rgba(255,255,255,0.2)",
                  textDecoration: "none",
                  letterSpacing: "0.08em",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "rgba(255,255,255,0.65)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "rgba(255,255,255,0.2)")
                }
              >
                {l.label.toUpperCase()}
              </a>
            ))}
          </div>
          <p
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 10,
              color: "rgba(255,255,255,0.1)",
              marginTop: 60,
              letterSpacing: "0.04em",
            }}
          >
            © MMXXIV TIMOTHY OKODUWA · ALL RIGHTS RESERVED
          </p>
        </div>
      </section>
    </div>
  );
}
