import { DiNodejs, DiPython } from "react-icons/di";
import {
  SiUnity,
  SiLua,
  SiGoland,
  SiCsharp,
  SiJava,
  SiSpringboot,
  SiDocker,
  SiTensorflow,
  SiNumpy,
  SiOpencv,
  SiCplusplus,
} from "react-icons/si";
import EducationItem from "./models/EducationItem";
import ExperienceItem from "./models/ExperienceItem";
import Project from "./models/Project";

export const aboutMeData = {
  heading: "Welcome Traveller",
  subHeading: "I Am Amirali Monjar",
  intro: [`An Artificer Of Games And Summoner Of Bugs.`,
  `I See You Have Found Your Way Into My Gallery Of Works By... Well, Let's Call It Destiny!`
],
  social: {
    telegram: "https://t.me/AmiraliMonjar",
    github: "https://github.com/monjar",
    linkedin: "https://www.linkedin.com/in/monjar/",
    instagram: "https://www.instagram.com/amirali.mnj/",
    twitter: "https://twitter.com/amiralimnj",
    soundCloud: "https://soundcloud.com/monjar",
    gmail: "mailto:amirali.mnj@gmail.com",
    medium: "",
  },
};
export const educationData: EducationItem[] = [
  {
    title: "MSc. Game Development (Programming)",
    link: "https://www.kingston.ac.uk/",
    image: "./images/kingston.png",
    place: "Kingston University",
    date: "2022 - 2023",
  },
  {
    title: "BEng. Computer Engineering",
    link: "http://en.sbu.ac.ir/SitePages/Home.aspx",
    image: "./images/sbu.jpeg",
    place: "Shahid Beheshti University",
    date: "2017 - 2022",
  },
  {
    title: "High School Diploma",
    link: "https://allame-helli8.com/",
    image: "./images/helli.jpeg",
    place: "Allameh Helli 8 High School",
    date: "2013 - 2017",
  },
];

export const experienceData: ExperienceItem[] = [
  {
    date: "2019",
    title: "Backend Development Intern",
    desc: "Worked on a Farsi replica of E-Bay, Developed backend using Java Spring and frontend using React and React Native",
    link: "https://rahnemacollege.com/",
    image: "./images/rahnema.jpeg",
  },
  {
    date: "2021",
    title: "Junior Game Developer",
    desc: `Worked on a low-poly MMO shooter game, Developed Gameplay mechanics using Unity, Real-time multiplayer system using
    PhotonEngine, In-app purchase and Ad systems using Google services and Steam. And, Released the game on Steam, AppleStore
    and GooglePlay`,
    link: "https://alphatik.com/index.html",
    image: "./images/alphatik.jpeg",
  },
  {
    date: "2021",
    title: "Junior Game Developer",
    desc: `Worked on a Farsi Replica of 8Ball-Pool game, Developed Gameplay mechanics and 8Ball physics using Unity. Developed real-time
    multiplayer system using Nakama server, A custom in-app purchase system and Ad-reward videos for Iranian users`,
    link: "https://cafebazaar.ir/install?l=en",
    image: "./images/cafe.jpeg",
  },
  {
    date: "2021 - 2022",
    title: "Backend Developer",
    desc: `Worked on rahnemacollege.com. Which is an educational websites with courses and videos for Farsi speaking learners (Like
        Coursera or Udemy)`,
    link: "https://rahnemacollege.com/",
    image: "./images/rahnema.jpeg",
  },{
    date: "2022 - 2023",
    title: "Game Developer",
    desc: `Worked on a Karaoke PVP game with thousands of different songs and a pitch detection system`,
    link: "https://www.linkedin.com/company/pioneer-games/",
    image: "./images/pgs.png",
  },
];

export const projectsData: Project[] = [
  {
    title: "Super Billiard",
    desc: 'Multiplayer Pool game on android platforms. An iranian replica of 8BallPool I worked on in "Cafe Bazaar".',
    link: "https://cafebazaar.ir/app/ir.cafebazistudio.eightball",
    image: "./images/billiard.png",
    stackIcons: [
      <SiUnity size={"2em"} />,
      <SiLua size={"2em"} />,
      <SiGoland size={"2em"} />,
      <SiCsharp size={"2em"} />,
    ],
  },
  {
    title: "Raidfield 2",
    desc: 'A MMO third-person shooter, Where players compete in a WW2 inspired enviornment and capture objectives. I worked on this game in "Alphatic inc".',
    link: "https://play.google.com/store/apps/details?id=com.alphatikinc.raidfield2&hl=en&gl=US",
    image: "./images/raidfield.webp",
    stackIcons: [<SiUnity size={"2em"} />, <SiCsharp size={"2em"} />],
  },
  {
    title: "Rahnema College",
    desc: 'The website for "Rahnema College", Which is an educational platform with different courses like Machine learning, Digital marketing, Data science, Programming and more. The website allows users to register, attend classes, watch videos and complete assignments in each course.',
    link: "https://rahnemacollege.com/",
    image: "./images/rahnema.jpeg",
    stackIcons: [
      <SiJava size={"2em"} />,
      <SiSpringboot size={"2em"} />,
      <DiNodejs size={"2em"} />,
      <SiDocker size={"2em"} />,
    ],
  },

  {
    title: "Cubic Dreams",
    desc: "Indie puzzle game made in unity. In this game you control an spirit lost in a puzzled world and in each level you must light the way to emerge victorious from the darkness.",
    link: "https://github.com/monjar/Cubic-Dreams",
    image: "./images/cubicdreams.jpg",

    stackIcons: [<SiUnity size={"2em"} />, <SiCsharp size={"2em"} />],
  }, {
    title: "AnimateLy",
    desc: "Desktop application for sensorless motion capture using a single camera. This program uses an AlexNent-based nueral network to transform a video or webcam feed to an animation for a 12 bone humanoid. The application's output can be imported into Unity, Blender and Unreal Engine directly.",
    link: "https://github.com/monjar/AnimateLy",
    image: "./images/animately.png",
    stackIcons: [
      <DiPython size={"2em"} />,
      <SiTensorflow size={"2em"} />,
      <SiNumpy size={"2em"} />,
      <SiOpencv size={"2em"} />,
      <SiCplusplus size={"2em"} />,
    ],
  },
];
