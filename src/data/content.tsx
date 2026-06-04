import React, { ReactNode } from "react";
import { IconType } from "react-icons";
import { DiJava, DiNodejs, DiPython } from "react-icons/di";
import { FaMeta } from "react-icons/fa6";
import {
  SiCplusplus,
  SiDocker,
  SiGoland,
  SiKeras,
  SiLua,
  SiMapbox,
  SiNumpy,
  SiOpenai,
  SiOpencv,
  SiPython,
  SiSharp,
  SiSpringboot,
  SiTensorflow,
  SiUnity,
} from "react-icons/si";

const ICON = "1.35em";

/* react-icons 5's IconType returns ReactNode, which @types/react 17 won't
   accept as a JSX element — render through createElement with a permissive
   cast so the icons type-check cleanly. */
const icon = (C: IconType): ReactNode =>
  React.createElement(C as React.ComponentType<{ size?: string }>, {
    size: ICON,
  });

/* ── Hero ──────────────────────────────────────────────────────────────── */
export const hero = {
  eyebrow: "Anno Domini MMXXVI · London",
  small: "Hither comes",
  firstName: "Amirali",
  lastName: "Monjar",
};

/* ── The Maker (illuminated about) — real story, fantasy voice ─────────── */
export const makerParagraphs: ReactNode[] = [
  <>
    In a small workshop lit by the glow of compiling code, Monjar writes the
    unglamorous incantations that decide whether a world feels alive in the
    hand, an <strong>artificer of games</strong> and a most diligent{" "}
    <em>summoner of bugs</em>.
  </>,
  <>
    His craft is <strong>C++</strong>, <strong>C#</strong> and{" "}
    <strong>Unity</strong>: gameplay mechanics, real-time multiplayer, physics,
    and the data-oriented engine work that keeps a game running at frame rate.
    He has forged titles shipped upon Steam, the App Store and Google Play, and
    bears an <strong>MSc in Game Development</strong> from Kingston University,
    London.
  </>,
  <>
    Of late his curiosity has wandered toward enchantments of a newer kind:
    motion capture, perception, and machine intelligence woven into play. Where{" "}
    <em>every millisecond is a coin</em> that must be spent wisely, he works
    close to the metal so that motion reads as <em>alive</em>.
  </>,
];

/* ── The Works ─────────────────────────────────────────────────────────── */
export interface Work {
  num: string;
  craft: string;
  title: string;
  desc: string;
  link?: string;
  video?: string;
  stack?: ReactNode[];
}

export const works: Work[] = [
  {
    num: "I",
    craft: "Order of the Companion",
    title: "Mochiro",
    desc: "A robot companion project with expressive face animations, custom C++ display driver, and AI-powered interactions.",
    link: "https://mochiro.co.uk/",
    stack: [icon(SiCplusplus), icon(SiPython), icon(SiOpenai)],
  },
  {
    num: "II",
    craft: "Order of Rendering",
    title: "Custom 3D Renderer",
    desc: "A C++ Vulkan-based renderer built from scratch with full PBR pipeline, including Cook-Torrance BRDF, normal mapping, and advanced lighting models. Features frustum culling and optimized render loops.",
    stack: [icon(SiCplusplus)],
  },
  {
    num: "III",
    craft: "Order of War",
    title: "Raidfield 2",
    desc: "An MMO third-person shooter where players clash across a WWII-inspired field and seize objectives. Forged within Alphatik inc.",
    link: "https://play.google.com/store/apps/details?id=com.alphatikinc.raidfield2&hl=en&gl=US",
    stack: [icon(SiUnity), icon(SiSharp)],
  },
  {
    num: "IV",
    craft: "Order of the Green Baize",
    title: "Super Billiard",
    desc: "A multiplayer pool game for the Android realm, a Persian rendering of 8-Ball Pool, raised within Cafe Bazaar.",
    link: "https://cafebazaar.ir/app/ir.cafebazistudio.eightball",
    stack: [icon(SiUnity), icon(SiLua), icon(SiGoland), icon(SiSharp)],
  },
  {
    num: "V",
    craft: "Order of Shadows",
    title: "Cubic Dreams",
    desc: "An indie puzzle game made in Unity. You guide a spirit lost in a puzzled world, lighting the way to emerge victorious from the dark.",
    link: "https://github.com/monjar/Cubic-Dreams",
    stack: [icon(SiUnity), icon(SiSharp)],
  },
  {
    num: "VI",
    craft: "Order of Sight",
    title: "AnimateLy",
    desc: "A desktop tool for sensorless motion capture from a single camera. An AlexNet-based network turns video into animation for a humanoid, exportable to Unity, Blender and Unreal.",
    link: "https://github.com/monjar/AnimateLy",
    stack: [
      icon(DiPython),
      icon(SiTensorflow),
      icon(SiNumpy),
      icon(SiOpencv),
      icon(SiCplusplus),
    ],
  },
  {
    num: "VII",
    craft: "Order of Sorcery",
    title: "Mage Hands",
    desc: "A VR game in which you are a wizard, casting spells through the gestures of your own hands.",
    video: "https://www.youtube.com/embed/-PEmQkcHclY?si=u80p_dP6rpjUyVK6",
    stack: [icon(SiUnity), icon(FaMeta)],
  },
  {
    num: "VIII",
    craft: "Order of the Muse",
    title: "Sentient Strokes",
    desc: "A game where you manage a gallery, but the gallery itself is sentient and speaks to you. Bid it create art, then watch the critics gather to judge.",
    video: "https://www.youtube.com/embed/3fiSZIrx-Pc?si=gV2wnzgP8QPJF4IO",
    stack: [icon(SiUnity), icon(SiOpenai)],
  },
  {
    num: "IX",
    craft: "Order of Song",
    title: "MelodyMuse",
    desc: "A VR prototype of a wearable that lets you conjure music in real time with the aid of machine intelligence.",
    video: "https://www.youtube.com/embed/JOXD_-y0c1I?si=dhcAt-gxEbqCYpld",
    stack: [icon(SiUnity), icon(SiOpenai), icon(SiPython), icon(SiKeras)],
  },
  {
    num: "X",
    craft: "Order of Realms",
    title: "Enchanted Realms",
    desc: "A VR prototype weaving real-time worldcraft with mapping and machine intelligence, a realm that answers to your hand.",
    video: "https://www.youtube.com/embed/jbacmKkosa4?si=WmUQaC56lNnfuMCS",
    stack: [
      icon(SiUnity),
      icon(FaMeta),
      icon(SiMapbox),
      icon(SiOpenai),
      icon(SiPython),
      icon(SiKeras),
      icon(SiCplusplus),
    ],
  },
  {
    num: "XI",
    craft: "Order of the Scriptorium",
    title: "Rahnema College",
    desc: "An educational keep of courses and videos for Persian-speaking learners, with registration, classes, lectures and assignments, in the manner of Coursera.",
    link: "https://rahnemacollege.com/",
    stack: [icon(DiJava), icon(SiSpringboot), icon(DiNodejs), icon(SiDocker)],
  },
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
