/* ──────────────────────────────────────────────────────────────────────────
   The Works: every project on the site, as plain data.
   No React in here: the build's route-shell plugin imports this file too.

   tier  relic   → the four featured showpieces (sticky showcase on Home)
         work    → the card grid (new works first, then elder works)
         archive → one-line ledger rows that link straight to the repo
   Media paths are relative to public/ (see src/lib/media.ts).
   ────────────────────────────────────────────────────────────────────────── */
import type { StackId } from "./stack.ts";

export type Tier = "relic" | "work" | "archive";

export interface MediaItem {
  kind: "image" | "video" | "youtube";
  /** image/video: path under public/ · youtube: the video id */
  src: string;
  /** mp4 fallback for a webm `src` */
  srcAlt?: string;
  poster?: string;
  alt: string;
  caption?: string;
  /** CSS aspect-ratio, reserves the box before media loads */
  aspect?: string;
}

export interface Section {
  heading: string;
  /** paragraphs; inline markdown (**bold**, [links](…)) allowed */
  body: string[];
  media?: MediaItem;
}

export interface Project {
  slug: string;
  tier: Tier;
  /** era within the "work" tier */
  era?: "new" | "elder";
  title: string;
  craft: string;
  tagline: string;
  summary: string;
  year: string;
  role: string;
  status?: string;
  accent?: string;
  stack: StackId[];
  stats?: { label: string; value: string }[];
  links: {
    live?: string;
    repo?: string;
    site?: string;
    npm?: string;
    store?: string;
    privateNote?: string;
  };
  media: {
    cover?: MediaItem;
    hoverVideo?: MediaItem;
    hero?: MediaItem | "mochiro-face";
    gallery?: MediaItem[];
  };
  sections?: Section[];
  posts?: string[];
}

/* ── media helpers ──────────────────────────────────────────────────────── */
const img = (slug: string, file: string, alt: string, extra: Partial<MediaItem> = {}): MediaItem => ({
  kind: "image",
  src: `media/${slug}/${file}`,
  alt,
  ...extra,
});

/* A muted loop: <name>.webm + <name>.mp4 + <name>-poster.jpg */
const vid = (slug: string, name: string, alt: string, extra: Partial<MediaItem> = {}): MediaItem => ({
  kind: "video",
  src: `media/${slug}/${name}.webm`,
  srcAlt: `media/${slug}/${name}.mp4`,
  poster: `media/${slug}/${name}-poster.jpg`,
  alt,
  ...extra,
});

const yt = (id: string, alt: string): MediaItem => ({ kind: "youtube", src: id, alt, aspect: "16/9" });

const GH = "https://github.com/monjar/";
const SHADERS_LIVE = "https://monjar.dev/Advanced-Shaders/";
const ANIM_LIVE = "https://monjar.dev/Advanced-Procedural-Animations-Study/";

/* ── the roster ─────────────────────────────────────────────────────────── */
export const projects: Project[] = [
  /* ═════ RELICS ═════ */
  {
    slug: "mochiro",
    tier: "relic",
    title: "Mochiro",
    craft: "Order of the Companion",
    tagline: "A pocket familiar with a living face. It listens, remembers, and nags you about your meds.",
    summary:
      "An AI companion with a personality, a memory and a face that actually emotes. It started life as a little desk robot and is now a voice-first iPhone app on its way to getting a body again. Co-founded; I build the app, the server, the website and the release pipeline.",
    year: "MMXXV – now",
    role: "Co-founder · app, server, web & release",
    status: "TestFlight · v0.6",
    accent: "#00e5de",
    stack: ["rn", "expo", "ts", "skia", "swift", "sqlite", "drizzle", "hono", "node", "flyio", "openai", "cloudflare"],
    stats: [
      { label: "Face animations", value: "~20" },
      { label: "Tests", value: "1.5k+" },
      { label: "Mini-games", value: "8" },
      { label: "Commits", value: "650+" },
    ],
    links: {
      site: "https://mochiro.studio",
      privateNote: "Source sealed: the Mochiro repositories are private.",
    },
    media: {
      cover: img("mochiro", "promo-01-poster.jpg", "Mochiro's glowing aqua eyes on a graphite phone screen"),
      hoverVideo: vid("mochiro", "promo-01", "Meeting Mochiro for the first time", { aspect: "360/782" }),
      hero: "mochiro-face",
      gallery: [
        vid("mochiro", "promo-01", "Meet Mochiro: talking to it, beeps and subtitles", { aspect: "360/782", caption: "Meet Mochiro" }),
        vid("mochiro", "promo-02", "Playing mini-games against Mochiro", { aspect: "360/782", caption: "Mochiro plays" }),
        vid("mochiro", "promo-03", "Focus sessions with Mochiro", { aspect: "360/782", caption: "Focus with Mochiro" }),
        vid("mochiro", "promo-04", "Mochiro remembering things about you", { aspect: "360/782", caption: "Mochiro remembers" }),
        vid("mochiro", "promo-05", "Theming Mochiro with chapter palettes", { aspect: "360/782", caption: "Make Mochiro yours" }),
      ],
    },
    sections: [
      {
        heading: "The Familiar",
        body: [
          "AI has been stuck inside screens for long enough. Mochiro is our attempt at giving it a little body, and we're starting with the mind: a small companion with a personality, a memory, and eventually somewhere physical to call home.",
          "You can talk to it, play with it, have it keep you on track, or just hang out. That last one matters more than the rest.",
        ],
      },
      {
        heading: "A Face That Feels",
        body: [
          "Mochiro's face is a set of hand-authored **vertex-morph animations** (happy, love, wink, dizzy, thinking, asleep…). The app draws them with **Skia**, easing between keyframes with cubic béziers and blending between expressions, so a blink never resets a mood. The eyes on this page run the same animation data through a Canvas 2D port. Hover them; they're curious.",
          "It answers in **Mochi-speak**: every word maps to its own beep, always the same one, with subtitles underneath. Obviously.",
        ],
      },
      {
        heading: "What I Built",
        body: [
          "**The app:** React Native + Expo with the new architecture, Zustand, Drizzle on SQLite, Reanimated and Skia. On-device memory has BM25 retrieval, privacy filtering and a pinboard of facts you can edit. There's a mood and needs model, proactive check-ins, eight mini-games, and focus, alarm, reminder and medication tools. In Swift: a home-screen widget, Live Activities and an App Intent to pet it.",
          "**The server:** Hono + SQLite on Fly.io. Every LLM call is proxied, so no keys ship in the app. It also runs a versioned prompt manager with rollback, streaming, a crisis-safety pre-check and daily token budgets with a kill switch.",
          "**Everything else:** the marketing site on Cloudflare Workers, a one-command TestFlight release pipeline, and roughly 1,500 tests. Bugs are filed by testers through [Snitch](/works/snitch), my own QA SDK. The promo videos were cut with [SceneOverflow](/works/sceneoverflow), my own code-first video editor.",
        ],
      },
      {
        heading: "Origins",
        body: [
          "Mochiro began in early 2025 as **INO**: a Raspberry Pi desk robot written in Python, with a tiny screen for a face. I wrote a C++ display driver to make that face run smoothly on almost nothing ([the tale is in the Codex](/blog/lightweight_cpp_display)). A Unity simulation of the body followed, streaming the face to the robot's screen. Then came the realisation that the mind should come first, and the rewrite as a mobile-first character.",
          "The body comes later. Mochiro, currently without legs.",
        ],
      },
    ],
    posts: ["lightweight_cpp_display"],
  },
  {
    slug: "advanced-shaders",
    tier: "relic",
    title: "Advanced Shaders",
    craft: "Order of Light & Void",
    tagline: "Nine spells in raw WebGPU: black holes, open oceans, and clouds you can fly through.",
    summary:
      "A study of real-time rendering techniques, each built from scratch in WGSL on raw WebGPU with no engine and no three.js. Every study is documented down to its frame graph, its cost and its known limits, and every one of them runs live in your browser.",
    year: "MMXXV",
    role: "Solo study",
    status: "Live · WebGPU",
    accent: "#e0a64a",
    stack: ["webgpu", "wgsl", "ts", "vite"],
    stats: [
      { label: "Studies", value: "9" },
      { label: "Engine", value: "none" },
      { label: "Geodesic solver", value: "RK45" },
    ],
    links: { live: SHADERS_LIVE, repo: GH + "Advanced-Shaders" },
    media: {
      cover: img("advanced-shaders", "cover.webp", "A black hole's accretion disk seen edge-on, lensed into a ring of light", { aspect: "16/9" }),
      hoverVideo: vid("advanced-shaders", "blackhole", "A Schwarzschild black hole bending starlight", { aspect: "16/9" }),
      hero: vid("advanced-shaders", "blackhole", "A Schwarzschild black hole bending starlight around its accretion disk", { aspect: "16/9" }),
      gallery: [
        vid("advanced-shaders", "magic", "Magical materials: crystal, obsidian and arcane metal with curl-noise energy", { aspect: "16/9", caption: "Magic materials" }),
        vid("advanced-shaders", "clouds", "Ray-marched volumetric cumulus clouds", { aspect: "16/9", caption: "Volumetric clouds" }),
        vid("advanced-shaders", "watercolour", "A painterly watercolour post-process", { aspect: "16/9", caption: "Watercolour NPR" }),
        vid("advanced-shaders", "portals", "Recursive portals with objects crossing between them", { aspect: "16/9", caption: "Recursive portals" }),
        vid("advanced-shaders", "atmosphere", "A physically based sky through sunset", { aspect: "16/9", caption: "Atmosphere" }),
        vid("advanced-shaders", "ocean", "FFT ocean with breaking waves on the shore", { aspect: "16/9", caption: "FFT ocean" }),
        img("advanced-shaders", "sdf-temple.webp", "A temple sphere-traced in a single fragment shader", { caption: "SDF world" }),
        img("advanced-shaders", "planet-orbit.webp", "A procedural planet seen from orbit", { caption: "Procedural planet" }),
        img("advanced-shaders", "magic-crystal.webp", "A glowing magic crystal", { caption: "Crystal" }),
        img("advanced-shaders", "magic-obsidian.webp", "Cracked obsidian veined with energy", { caption: "Obsidian" }),
        img("advanced-shaders", "atmosphere-sunset.webp", "A sunset rendered with Hillaire's sky model", { caption: "Sunset" }),
        img("advanced-shaders", "planet-coast.webp", "A procedural coastline seen from low orbit", { caption: "Coastline" }),
        img("advanced-shaders", "ocean-open-water.webp", "Open ocean under a bright sky", { caption: "Open water" }),
      ],
    },
    sections: [
      {
        heading: "The Grimoire",
        body: [
          "**01 Ocean:** compute-shader FFT spectrum, screen-space refraction, caustics, breaking waves on the shore and GPU buoyancy for things you drop in.",
          "**02 Clouds:** ray-marched cumulus over tileable 3D noise, multiple scattering, weather maps and temporal reprojection.",
          "**03 Watercolour:** painterly non-photorealistic rendering on a G-buffer, with edge darkening, pigment bleed, paper grain and a pen-and-wash mode.",
          "**04 Portals:** recursive stencil portals with oblique near-plane clipping, and objects that really cross through.",
          "**05 SDF world:** a temple, aqueduct, bridge and walking character, all sphere-traced in one fullscreen fragment shader.",
          "**06 Black hole:** Schwarzschild null geodesics integrated with RK4 or Dormand–Prince, a Doppler-shifted accretion disk, gravitational redshift and the photon ring.",
          "**07 Magic:** crystal, obsidian, arcane metal, soul ice and void stone, with curl-noise energy fields, cracks and GPU particles.",
          "**08 Atmosphere:** Hillaire's 2020 LUT sky (with a brute-force reference) and a Martian sunset.",
          "**09 Planet:** a textureless procedural Earth with biomes, ocean, clouds and city lights, plus quadtree LOD from orbit to the ground.",
        ],
        media: img("advanced-shaders", "sdf-temple.webp", "A temple sphere-traced in a single fragment shader"),
      },
      {
        heading: "Cast it yourself",
        body: [
          "Every study runs live at [monjar.dev/Advanced-Shaders](" + SHADERS_LIVE + "), with debug views and knobs. You'll need a WebGPU browser: Chrome or Edge 113+, or Safari 26+. Add `?scale=0.5` if your GPU starts to smoke.",
        ],
      },
    ],
  },
  {
    slug: "procedural-animations",
    tier: "relic",
    title: "Procedural Animation Study",
    craft: "Order of the Living Bone",
    tagline: "Twelve studies in making creatures walk, crawl, swim and stumble, with no animator in the room.",
    summary:
      "A deep dive into procedural animation, from springs and IK through gait generation and motion matching to active ragdolls and evolved creatures. Each study is an interactive Three.js page with its own write-up, unit tests and end-to-end tests.",
    year: "MMXXV",
    role: "Solo study",
    status: "Live · 12 of 15",
    accent: "#8fd18b",
    stack: ["ts", "threejs", "webgl", "rapier", "vite"],
    stats: [
      { label: "Studies", value: "12" },
      { label: "Next up", value: "RL · LLM" },
      { label: "Physics", value: "Rapier" },
    ],
    links: { live: ANIM_LIVE, repo: GH + "Advanced-Procedural-Animations-Study" },
    media: {
      cover: img("procedural-animations", "cover.webp", "Thousands of GPU-simulated fish schooling over a seabed", { aspect: "16/9" }),
      hoverVideo: vid("procedural-animations", "hexapod", "A six-legged spider walking with raycast footholds", { aspect: "16/9" }),
      hero: vid("procedural-animations", "hexapod", "A six-legged spider climbing with raycast footholds", { aspect: "16/9" }),
      gallery: [
        vid("procedural-animations", "quadruped", "A quadruped blending walk, trot, canter and gallop", { aspect: "16/9", caption: "Quadruped gaits" }),
        vid("procedural-animations", "boids", "Thousands of GPU fish boids swimming", { aspect: "16/9", caption: "GPU crowds" }),
        vid("procedural-animations", "creatures", "Evolved virtual creatures learning to move", { aspect: "16/9", caption: "Evolved creatures" }),
        img("procedural-animations", "study-01.webp", "Study 01: Second-Order Dynamics", { caption: "01 · Second-Order Dynamics", aspect: "16/9" }),
        img("procedural-animations", "study-02.webp", "Study 02: Analytic IK: Two-Bone & Look-At", { caption: "02 · Analytic IK: Two-Bone & Look-At", aspect: "16/9" }),
        img("procedural-animations", "study-03.webp", "Study 03: Iterative IK Lab", { caption: "03 · Iterative IK Lab", aspect: "16/9" }),
        img("procedural-animations", "study-04.webp", "Study 04: XPBD Ropes, Tails & Cloth", { caption: "04 · XPBD Ropes, Tails & Cloth", aspect: "16/9" }),
        img("procedural-animations", "study-05.webp", "Study 05: Procedural Hexapod", { caption: "05 · Procedural Hexapod", aspect: "16/9" }),
        img("procedural-animations", "study-06.webp", "Study 06: Procedural Quadruped", { caption: "06 · Procedural Quadruped", aspect: "16/9" }),
        img("procedural-animations", "study-07.webp", "Study 07: Procedural Biped", { caption: "07 · Procedural Biped", aspect: "16/9" }),
        img("procedural-animations", "study-08.webp", "Study 08: Foot IK over Mocap", { caption: "08 · Foot IK over Mocap", aspect: "16/9" }),
        img("procedural-animations", "study-09.webp", "Study 09: Motion Matching", { caption: "09 · Motion Matching", aspect: "16/9" }),
        img("procedural-animations", "study-10.webp", "Study 10: Active Ragdoll", { caption: "10 · Active Ragdoll", aspect: "16/9" }),
        img("procedural-animations", "study-11.webp", "Study 11: GPU Procedural Crowds", { caption: "11 · GPU Procedural Crowds", aspect: "16/9" }),
        img("procedural-animations", "study-12.webp", "Study 12: Evolved Virtual Creatures", { caption: "12 · Evolved Virtual Creatures", aspect: "16/9" }),
      ],
    },
    sections: [
      {
        heading: "The Bestiary",
        body: [
          "**Foundations:** frame-rate-stable second-order dynamics; analytic two-bone IK with pole vectors and swing-twist limits; and an IK lab racing CCD, FABRIK and the Jacobian methods side by side, with convergence plots.",
          "**Procedural locomotion:** XPBD ropes, tails and capes; a hexapod that climbs from floor to wall and over the top; a quadruped whose Hildebrand gait table blends walk → trot → canter → gallop by speed; and an Overgrowth-style biped built on a stride wheel.",
          "**Data-driven:** foot IK that adapts CMU mocap to stairs and slopes, and full motion matching with inertialization and foot locking.",
          "**Physics & learned:** an active ragdoll with joint-motor muscles that you can punch; GPU-sorted fish boids checked against a CPU reference; and Karl Sims-style creatures evolved by a genetic algorithm across Web Workers.",
          "Still to come: an RL locomotion policy, LLM-directed animation, and a procedural face.",
        ],
      },
      {
        heading: "Poke the creatures",
        body: ["Every study is live, with knobs, at [monjar.dev/Advanced-Procedural-Animations-Study](" + ANIM_LIVE + ")."],
      },
    ],
  },
  {
    slug: "enchanted-graphics-engine",
    tier: "relic",
    title: "Enchanted Graphics Engine",
    craft: "Order of the Forge",
    tagline: "A Vulkan engine forged from bare metal: frame graph, PBR, GPU culling, and a level to play.",
    summary:
      "A game engine in C++17 on Vulkan 1.3, built from the renderer up: a frame graph, physically based lighting, clustered lights, shadows of every shape, GPU occlusion culling, and around it an ECS, a job system, physics, skinning, audio, an editor, and finally a game made with it.",
    year: "MMXXV – MMXXVI",
    role: "Solo",
    status: "Playable",
    accent: "#c98a3c",
    stack: ["cpp", "vulkan", "glsl", "imgui"],
    stats: [
      { label: "API", value: "Vulkan 1.3" },
      { label: "Culling", value: "GPU · HZB" },
      { label: "Commits", value: "200+" },
    ],
    links: { repo: GH + "Enchanted-Graphics-Engine" },
    media: {
      cover: img("enchanted-graphics-engine", "cover.webp", "A PBR demo scene lit by the Enchanted engine", { aspect: "4/3" }),
      hoverVideo: vid("enchanted-graphics-engine", "demo-tour-loop", "A camera tour through the PBR demo scene", { aspect: "4/3" }),
      hero: vid("enchanted-graphics-engine", "engine-demo-loop", "The engine's editor around a PBR scene", { aspect: "16/10" }),
      gallery: [
        vid("enchanted-graphics-engine", "demo-tour-loop", "A camera tour through the PBR demo scene", { aspect: "4/3", caption: "PBR demo tour" }),
        vid("enchanted-graphics-engine", "level-loop", "Moving through the level built with the engine", { aspect: "16/10", caption: "The level" }),
        vid("enchanted-graphics-engine", "character-loop", "A GPU-skinned mannequin walking over terrain", { aspect: "16/10", caption: "GPU skinning" }),
        img("enchanted-graphics-engine", "editor.webp", "The ImGui editor with scene hierarchy and inspector", { caption: "The editor" }),
        img("enchanted-graphics-engine", "level.webp", "The playable level", { caption: "Level" }),
        img("enchanted-graphics-engine", "character.webp", "A skinned character model", { caption: "Character" }),
        img("enchanted-graphics-engine", "demo-scene.webp", "The PBR demo scene", { caption: "Demo scene" }),
      ],
    },
    sections: [
      {
        heading: "The Forge",
        body: [
          "**Rendering:** a forward renderer driven by a frame graph, with PBR and image-based lighting, clustered lighting, cascaded, cube and spot shadows, SSAO, bloom with ACES tonemapping and 4× MSAA. **Two-phase GPU occlusion culling** against a hierarchical-Z buffer keeps the draw count honest.",
          "**Everything around it:** an ECS with reflection, a job system, rigid-body physics, glTF import, GPU skinning, audio and a Dear ImGui editor. Then the real test: making a game with it.",
        ],
        media: img("enchanted-graphics-engine", "editor.webp", "The engine's ImGui editor"),
      },
    ],
  },

  /* ═════ NEW WORKS ═════ */
  {
    slug: "roads-and-runes",
    tier: "work",
    era: "new",
    title: "Roads & Runes",
    craft: "Order of the Wayfarer",
    tagline: "Your bike rides become quests. Ride to lift the fog of war.",
    summary:
      "A real-world cycling RPG. The map is the real world and your bicycle is how you explore it: clear fog over H3 cells, take quests, pick a class, open chests, and follow turn-by-turn routes on your wrist. Strava sync is built in, and Claude reads routes you ask for in plain language.",
    year: "MMXXVI",
    role: "Solo",
    status: "TestFlight",
    accent: "#c0623a",
    stack: ["swift", "python", "fastapi", "postgres", "redis", "strava", "claude", "flyio"],
    links: { repo: GH + "Roads-Runes" },
    media: {
      cover: img("roads-and-runes", "cover.webp", "Roads & Runes: a fantasy map overlaid on real streets", { aspect: "519/310" }),
      gallery: [
        img("roads-and-runes", "02-world.webp", "The world map with fog of war over real streets", { caption: "The world" }),
        img("roads-and-runes", "03-quests.webp", "The quest log", { caption: "Quests" }),
        img("roads-and-runes", "01-onboarding-class.webp", "Choosing a class: Explorer, Wizard, Warrior or Scribe", { caption: "Pick a class" }),
        img("roads-and-runes", "06-navigation.webp", "Turn-by-turn navigation", { caption: "Navigation" }),
        img("roads-and-runes", "09-character.webp", "The character sheet", { caption: "Character" }),
        img("roads-and-runes", "07-adventure-complete.webp", "An adventure completed", { caption: "Victory" }),
        img("roads-and-runes", "08-journal.webp", "The adventurer's journal", { caption: "Journal" }),
        img("roads-and-runes", "w1-watch-navigation.webp", "Apple Watch turn-by-turn navigation", { caption: "On the wrist" }),
        img("roads-and-runes", "w2-watch-quest.webp", "A quest on Apple Watch", { caption: "Watch quest" }),
        img("roads-and-runes", "w3-watch-stats.webp", "Ride stats on Apple Watch", { caption: "Watch stats" }),
      ],
    },
    sections: [
      {
        heading: "The Road",
        body: [
          "SwiftUI on iPhone and Apple Watch, with widgets and a pure-Swift core package. Behind it sits FastAPI on PostgreSQL/PostGIS with Redis, routing through GraphHopper (custom bike models) and Valhalla, and OSM imports for the world. HealthKit and Strava OAuth bring your rides in.",
          "Field-tested the only honest way: by riding it.",
        ],
      },
    ],
  },
  {
    slug: "snitch",
    tier: "work",
    era: "new",
    title: "Snitch",
    craft: "Order of the Informant",
    tagline: "Hold three fingers and the bug confesses: screenshot, the last 30 seconds, and a draft PR.",
    summary:
      "Self-hosted QA and bug reporting for mobile apps. Testers press with three fingers to file a report that carries a screenshot, up to 30 s of screen video from a RAM ring buffer, and a timeline of console, network and touch events. An MCP server and a Claude skill can then take a report all the way to a reproduced bug, a tested fix and a pull request.",
    year: "MMXXVI",
    role: "Solo",
    status: "npm · 0.5",
    accent: "#d9a441",
    stack: ["swift", "kotlin", "rn", "ts", "hono", "sqlite", "react", "mcp", "docker", "flyio"],
    links: { repo: GH + "mobile-app-qa-sdk", npm: "https://www.npmjs.com/package/react-native-snitch" },
    media: {},
    sections: [
      {
        heading: "How it squeals",
        body: [
          "Native SDKs in Swift and Kotlin, plus a React Native TurboModule with an Expo config plugin. Reports land on a self-hosted Hono + SQLite dashboard, with two-way GitHub issue sync and routing to Slack, Discord or webhooks.",
          "The fun part is the agent loop: `snitch-cli` and an MCP server hand a report, video frames included, to Claude Code. Snitch is dogfooded daily on [Mochiro](/works/mochiro).",
        ],
      },
    ],
  },
  {
    slug: "sceneoverflow",
    tier: "work",
    era: "new",
    title: "SceneOverflow",
    craft: "Order of the Reel",
    tagline: "Video edits written as Python spells, cast by humans or by agents.",
    summary:
      "A code-first video editor for programmers and LLM agents. The edit is a Python script, and cut times are anchors (markers, silences, scene changes, transcript words) rather than magic numbers. Rendering is a content-hashed, cached op graph over FFmpeg, so changing one cut re-renders only that segment.",
    year: "MMXXVI",
    role: "Solo",
    status: "v0.1",
    accent: "#b85c8a",
    stack: ["python", "ffmpeg", "mcp"],
    links: { repo: GH + "SceneOverflow" },
    media: {
      cover: img("sceneoverflow", "cover.webp", "The SceneOverflow studio: code, preview and timeline side by side", { aspect: "1440/860" }),
      gallery: [
        img("sceneoverflow", "studio.webp", "The browser studio: script, preview and timeline", { caption: "The studio" }),
        img("sceneoverflow", "studio-autocomplete.webp", "Autocomplete for anchors in the studio editor", { caption: "Autocomplete" }),
        img("sceneoverflow", "anchors-timeline.webp", "A timeline cut on anchors instead of timestamps", { caption: "Anchors" }),
        img("sceneoverflow", "watch-diff.webp", "Live-on-save diffing of a re-render", { caption: "Watch mode" }),
        img("sceneoverflow", "basic-thumbs.webp", "Thumbnail strip of a render", { caption: "Thumbnails" }),
      ],
    },
    sections: [
      {
        heading: "Edit like you code",
        body: [
          "Pure Python with no runtime dependencies beyond FFmpeg. It renders all-intra proxies for snappy scrubbing, has optional faster-whisper transcripts, a browser studio that updates on save, and Jupyter support. An **MCP server** lets agents do the editing. The Mochiro promo videos were cut with it.",
        ],
      },
    ],
  },
  {
    slug: "hibaro-5",
    tier: "work",
    era: "new",
    title: "Hibaro-5",
    craft: "Order of Coin & Star",
    tagline: "An idle sci-fi RPG whose stock market never sleeps.",
    summary:
      "A browser-based, API-first idle RPG set in Hibaro-5, a solar system owned by corporations. Take gigs and quest chains, travel between planets, dodge your wanted level, trade on the black market, and play a corporate stock market that moves every 30-second world tick.",
    year: "MMXXVI",
    role: "Solo",
    accent: "#5fa8c9",
    stack: ["ts", "nestjs", "nextjs", "prisma", "postgres", "redis", "docker"],
    links: { repo: GH + "Hibaro-5" },
    media: {},
    sections: [
      {
        heading: "The machine underneath",
        body: [
          "A TypeScript monorepo: a NestJS API, Next.js 15 player and admin apps, a BullMQ/Redis world-tick worker, Prisma on Postgres, and a shared `game-rules` package. Updates stream over server-sent events onto an isometric district map.",
        ],
      },
    ],
  },

  /* ═════ ELDER WORKS ═════ */
  {
    slug: "raidfield-2",
    tier: "work",
    era: "elder",
    title: "Raidfield 2",
    craft: "Order of War",
    tagline: "WWII third-person MMO shooter: seize the field.",
    summary:
      "An MMO third-person shooter where players clash across a WWII-inspired field and seize objectives. Forged within Alphatik inc.",
    year: "MMXXI",
    role: "Game developer · Alphatik",
    stack: ["unity", "csharp"],
    links: { store: "https://play.google.com/store/apps/details?id=com.alphatikinc.raidfield2&hl=en&gl=US" },
    media: { cover: img("raidfield-2", "logo.webp", "Raidfield 2 icon") },
  },
  {
    slug: "super-billiard",
    tier: "work",
    era: "elder",
    title: "Super Billiard",
    craft: "Order of the Green Baize",
    tagline: "Multiplayer 8-ball for the Persian realm.",
    summary:
      "A multiplayer pool game for Android, a Persian take on 8-Ball Pool, raised within Cafe Bazaar.",
    year: "MMXXI",
    role: "Game & backend developer · Cafe Bazaar",
    stack: ["unity", "lua", "go", "csharp"],
    links: { store: "https://cafebazaar.ir/app/ir.cafebazistudio.eightball" },
    media: { cover: img("super-billiard", "logo.webp", "Super Billiard icon") },
  },
  {
    slug: "cubic-dreams",
    tier: "work",
    era: "elder",
    title: "Cubic Dreams",
    craft: "Order of Shadows",
    tagline: "Guide a lost spirit through a puzzled world.",
    summary:
      "An indie puzzle game made in Unity. You guide a spirit lost in a puzzled world, lighting the way to emerge victorious from the dark.",
    year: "MMXX",
    role: "Solo",
    stack: ["unity", "csharp"],
    links: { repo: GH + "Cubic-Dreams" },
    media: { cover: img("cubic-dreams", "logo.webp", "Cubic Dreams") },
  },
  {
    slug: "animately",
    tier: "work",
    era: "elder",
    title: "AnimateLy",
    craft: "Order of Sight",
    tagline: "Motion capture from a single camera, no suit required.",
    summary:
      "A desktop tool for sensorless motion capture from a single camera. An AlexNet-based network turns video into animation for a humanoid, exportable to Unity, Blender and Unreal.",
    year: "MMXXII",
    role: "BEng thesis",
    stack: ["python", "tensorflow", "numpy", "opencv", "cpp"],
    links: { repo: GH + "AnimateLy" },
    media: { cover: img("animately", "logo.webp", "AnimateLy") },
  },
  {
    slug: "mage-hands",
    tier: "work",
    era: "elder",
    title: "Mage Hands",
    craft: "Order of Sorcery",
    tagline: "Cast spells with the gestures of your own hands.",
    summary: "A VR game in which you are a wizard, casting spells through the gestures of your own hands.",
    year: "MMXXIII",
    role: "Kingston University",
    stack: ["unity", "meta", "csharp"],
    links: {},
    media: {
      cover: img("mage-hands", "poster.webp", "Mage Hands gameplay", { aspect: "16/9" }),
      hero: yt("-PEmQkcHclY", "Mage Hands gameplay video"),
    },
  },
  {
    slug: "sentient-strokes",
    tier: "work",
    era: "elder",
    title: "Sentient Strokes",
    craft: "Order of the Muse",
    tagline: "Run a gallery that talks back, then face the critics.",
    summary:
      "A game where you manage a gallery, but the gallery itself is sentient and speaks to you. Bid it create art, then watch the critics gather to judge.",
    year: "MMXXIII",
    role: "Kingston University",
    stack: ["unity", "openai", "csharp"],
    links: {},
    media: {
      cover: img("sentient-strokes", "poster.webp", "Sentient Strokes gameplay", { aspect: "16/9" }),
      hero: yt("3fiSZIrx-Pc", "Sentient Strokes gameplay video"),
    },
  },
  {
    slug: "melodymuse",
    tier: "work",
    era: "elder",
    title: "MelodyMuse",
    craft: "Order of Song",
    tagline: "Conjure music in real time with a wave of your hand.",
    summary:
      "A VR prototype of a wearable that lets you conjure music in real time with the aid of machine intelligence.",
    year: "MMXXIV",
    role: "AI research · Kingston University",
    stack: ["unity", "openai", "python", "keras"],
    links: {},
    media: {
      cover: img("melodymuse", "poster.webp", "MelodyMuse prototype", { aspect: "16/9" }),
      hero: yt("JOXD_-y0c1I", "MelodyMuse prototype video"),
    },
  },
  {
    slug: "enchanted-realms",
    tier: "work",
    era: "elder",
    title: "Enchanted Realms",
    craft: "Order of Realms",
    tagline: "Real-world worldcraft in VR that answers to your hand.",
    summary:
      "A VR prototype weaving real-time worldcraft with mapping and machine intelligence, a realm that answers to your hand.",
    year: "MMXXIV",
    role: "AI research · Kingston University",
    stack: ["unity", "meta", "mapbox", "openai", "python", "keras", "cpp"],
    links: {},
    media: {
      cover: img("enchanted-realms", "poster.webp", "Enchanted Realms prototype", { aspect: "16/9" }),
      hero: yt("jbacmKkosa4", "Enchanted Realms prototype video"),
    },
  },
  {
    slug: "rahnema-college",
    tier: "work",
    era: "elder",
    title: "Rahnema College",
    craft: "Order of the Scriptorium",
    tagline: "A Coursera-style learning keep for Persian speakers.",
    summary:
      "An educational keep of courses and videos for Persian-speaking learners, with registration, classes, lectures and assignments, in the manner of Coursera.",
    year: "MMXXI",
    role: "Backend developer",
    stack: ["java", "springboot", "node", "docker"],
    links: { site: "https://rahnemacollege.com/" },
    media: { cover: img("rahnema-college", "logo.webp", "Rahnema College") },
  },

  /* ═════ ARCHIVE ═════ */
  {
    slug: "fall-detection",
    tier: "archive",
    title: "Fall Detection Study",
    craft: "",
    tagline: "Pose estimation that notices when someone falls.",
    summary: "",
    year: "MMXXVI",
    role: "",
    stack: ["python", "pytorch", "opencv"],
    links: { repo: GH + "Fall-detection-study" },
    media: {},
  },
  {
    slug: "hill-giant-strength",
    tier: "archive",
    title: "App of Hill Giant Strength",
    craft: "",
    tagline: "An AI gym trainer in your pocket.",
    summary: "",
    year: "MMXXVI",
    role: "",
    stack: ["rn", "expo", "openai", "node"],
    links: { repo: GH + "app-of-hill-giant-strength" },
    media: {},
  },
  {
    slug: "ttrpg-map",
    tier: "archive",
    title: "TTRPG Battle Map",
    craft: "",
    tagline: "A live, multiplayer battle map for your table.",
    summary: "",
    year: "MMXXV",
    role: "",
    stack: ["node"],
    links: { repo: GH + "ttrpg-map-ER" },
    media: {},
  },
  {
    slug: "arch-volume-osd",
    tier: "archive",
    title: "arch-volume-osd",
    craft: "",
    tagline: "A tidy volume OSD for Arch, shipped on the AUR.",
    summary: "",
    year: "MMXXV",
    role: "",
    stack: ["bash", "arch"],
    links: { repo: GH + "arch-volume-osd" },
    media: {},
  },
  {
    slug: "crawlcorder",
    tier: "archive",
    title: "Crawlcorder",
    craft: "",
    tagline: "Clicks in, Selenium crawler out: a Chrome extension.",
    summary: "",
    year: "MMXXV",
    role: "",
    stack: ["ts", "chrome", "selenium"],
    links: { repo: GH + "crawlcorder" },
    media: {},
  },
  {
    slug: "persian-poem-park",
    tier: "archive",
    title: "Persian Poem Park",
    craft: "",
    tagline: "A bot that posts a Persian poem to the timeline every day.",
    summary: "",
    year: "MMXXV",
    role: "",
    stack: ["python", "flask", "sqlite"],
    links: { repo: GH + "Persian-Poem-Park" },
    media: {},
  },
  {
    slug: "graphics-journey",
    tier: "archive",
    title: "Graphics Developer Journey",
    craft: "",
    tagline: "A ray tracer, CUDA and OpenGL, one lesson at a time.",
    summary: "",
    year: "MMXXIV",
    role: "",
    stack: ["cpp", "opengl"],
    links: { repo: GH + "Graphics-Developer-Journey" },
    media: {},
  },
  {
    slug: "sims4-ttrpg-mod",
    tier: "archive",
    title: "Sims 4 TTRPG Mod",
    craft: "",
    tagline: "Dice and campaigns, smuggled into The Sims.",
    summary: "",
    year: "MMXXVI",
    role: "",
    stack: ["python"],
    links: { repo: GH + "sims4-ttrpg-mod" },
    media: {},
  },
  {
    slug: "fuwari-for-ino",
    tier: "archive",
    title: "Ino's Devlog",
    craft: "",
    tagline: "The devlog of Mochiro's first robot body.",
    summary: "",
    year: "MMXXV",
    role: "",
    stack: ["astro"],
    links: { repo: GH + "fuwari-for-ino" },
    media: {},
  },
];

/* ── lookups ────────────────────────────────────────────────────────────── */
export const bySlug = (slug: string | undefined) => projects.find((p) => p.slug === slug);
export const ofTier = (tier: Tier) => projects.filter((p) => p.tier === tier);
export const relics = ofTier("relic");
export const newWorks = projects.filter((p) => p.tier === "work" && p.era === "new");
export const elderWorks = projects.filter((p) => p.tier === "work" && p.era === "elder");
export const archive = ofTier("archive");
/* projects with their own /works/:slug page, in reading order */
export const detailable = [...relics, ...newWorks, ...elderWorks];
