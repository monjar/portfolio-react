import { useEffect } from "react";
import { useLocation } from "react-router";
import Hero from "../components/Hero/Hero";
import Maker from "../components/Maker/Maker";
import RunicTicker from "../components/RunicTicker/RunicTicker";
import RelicShowcase from "../components/RelicShowcase/RelicShowcase";
import Works from "../components/Works/Works";
import Chronicle from "../components/Chronicle/Chronicle";
import CodexTeaser from "../components/CodexTeaser/CodexTeaser";
import Contact from "../components/Contact/Contact";
import Footer from "../components/Footer/Footer";
import { Fleuron } from "../components/icons";
import { useReveal } from "../lib/useReveal";
import { useDocumentMeta } from "../lib/useDocumentMeta";

const Home = () => {
  const location = useLocation();
  useReveal([]);
  useDocumentMeta(
    undefined,
    "Amirali Monjar — software engineer and game developer. Robots, renderers, shaders and creatures, in the manner of an illuminated codex."
  );

  // Honour a section requested from another page (nav → "/" with state).
  useEffect(() => {
    const target = (location.state as { scrollTo?: string } | null)?.scrollTo;
    if (target) {
      // wait a frame so the section is mounted before scrolling
      requestAnimationFrame(() => document.getElementById(target)?.scrollIntoView({ behavior: "smooth" }));
    }
  }, [location.state]);

  return (
    <main className="view">
      <Hero />
      <Maker />
      <RunicTicker />
      <RelicShowcase />
      <Fleuron />
      <Works />
      <Chronicle />
      <CodexTeaser />
      <Fleuron />
      <Contact />
      <Footer right="All rights heralded" />
    </main>
  );
};

export default Home;
