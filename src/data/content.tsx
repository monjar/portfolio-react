import { ReactNode } from "react";
/* ── Hero ──────────────────────────────────────────────────────────────── */
export const hero = {
  eyebrow: "Anno Domini MMXXVI · London",
  small: "Hither comes",
  firstName: "Amirali",
  lastName: "Monjar",
  lede: "Artificer of automata and summoner of bugs, and a wizard of games. Nerd of the north and first of his name (to have played WOW for 45 hours straight in 2012)",
};

export const cv = "/pdfs/Amirali_Monjar_Game_Dev.pdf";

/* ── The Maker (illuminated about) — real story, fantasy voice ─────────── */
export const makerParagraphs: ReactNode[] = [
  <>
    I'm Amirali, a software engineer who likes building things that feel alive.
    Games, AI systems, interactive tools, and the occasional cursed prototype.
  </>,
  <>
    I love games and making them, especially the systems behind them: engines,
    characters, worlds, physics, behaviours, and all the tiny mechanics that
    make something fun. Lately, I've also been working on a robot companion,
    which is basically where my love of AI, games, and strange little creatures
    all meet.
  </>,
  <>
    Outside of code, I play basketball, D&amp;D, and far too many games for
    someone who claims to be busy. I also play setar and guitar horrendously.
  </>,
  <>
    This site is where I keep my projects, experiments, unfinished quests, and
    things I probably started at 2am.
  </>,
];

/* ── The Chronicle (timeline — real roles & study) ─────────────────────── */
export interface ChronEntry {
  when: string;
  title: string;
  place: string;
  desc: string;
}

export const chronicle: ChronEntry[] = [
  {
    when: "2025 - Present",
    title: "Co-founder & Engineer",
    place: "· Mochiro",
    desc: "Giving AI a little body, starting with the mind. I build the companion app, its server, the website and the release pipeline.",
  },
  {
    when: "2024 - Present",
    title: "Software Specialist",
    place: "· RSM UK",
    desc: "Designing and implementing automation technologies for Tax processes with Python, JavaScript, and LLMs. Building AI-driven solutions and consulting with businesses on process automation, leading client engagements and collaborating with tax experts.",
  },
  {
    when: "2023 - 2024",
    title: "AI Research Assistant",
    place: "· Kingston University",
    desc: "Research at the meeting of games and machine intelligence: perception, music and motion.",
  },
  {
    when: "2022 - 2023",
    title: "MSc, Game Development (Programming)",
    place: "· Kingston University, London",
    desc: "The formal study of engines, gameplay and the mathematics of motion.",
  },
  {
    when: "2022 - 2023",
    title: "Game Developer",
    place: "· Pioneer Games",
    desc: "A karaoke PVP game with thousands of songs and a real-time pitch-detection system.",
  },
  {
    when: "2021 - 2022",
    title: "Game & Backend Developer",
    place: "· Alphatik · Cafe Bazaar · Rahnema",
    desc: "Shipped multiplayer games to Steam, the App Store and Google Play; built backends and educational platforms.",
  },
  {
    when: "2019",
    title: "Backend Development Intern",
    place: "· Rahnema College",
    desc: "Built a Persian rendering of eBay: Java Spring on the back, React on the front.",
  },
  {
    when: "2017 - 2022",
    title: "BEng, Computer Engineering",
    place: "· Shahid Beheshti University",
    desc: "Foundations in systems, graphics and far too many side quests compiled at the third hour of night.",
  },
  {
    when: "2013 - 2017",
    title: "High School Diploma",
    place: "· Allameh Helli 8",
    desc: "Where the first incantations were learned.",
  },
];

/* ── Send a Raven (socials) ────────────────────────────────────────────── */
export interface Social {
  label: string;
  href: string;
}

export const socials: Social[] = [
  { label: "By Raven (email)", href: "mailto:amirali.mnj@gmail.com" },
  { label: "The GitHub Hall", href: "https://github.com/monjar" },
  { label: "The Guild (LinkedIn)", href: "https://www.linkedin.com/in/monjar/" },
  { label: "The Town Crier (X)", href: "https://twitter.com/amiralimnj" },
  { label: "The Telegraph (Telegram)", href: "https://t.me/AmiraliMonjar" },
  { label: "The Bardic Hall (SoundCloud)", href: "https://soundcloud.com/monjar" },
];
