import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Hero from "../components/Hero";
import Maker from "../components/Maker";
import Works from "../components/Works";
import Chronicle from "../components/Chronicle";
import CodexTeaser from "../components/CodexTeaser";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import { Fleuron } from "../components/icons";
import { useReveal } from "../lib/useReveal";

const Home = () => {
  const location = useLocation();
  useReveal([]);

  // Honour a section requested from another page (nav → "/" with state).
  useEffect(() => {
    const target = (location.state as { scrollTo?: string } | null)?.scrollTo;
    if (target) {
      // wait a frame so the section is mounted before scrolling
      requestAnimationFrame(() =>
        document.getElementById(target)?.scrollIntoView({ behavior: "smooth" })
      );
    }
  }, [location.state]);

  return (
    <main className="view">
      <Hero />
      <Fleuron />
      <Maker />
      <Fleuron />
      <Works />
      <Fleuron />
      <Chronicle />
      <Fleuron />
      <CodexTeaser />
      <Fleuron />
      <Contact />
      <Footer right="All rights heralded" />
    </main>
  );
};

export default Home;
