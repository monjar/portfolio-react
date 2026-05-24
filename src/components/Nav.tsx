import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BookGlyph, Crest, MoonIcon, SunIcon } from "./icons";
import { useTheme } from "../lib/useTheme";

const SECTIONS = [
  { id: "about", label: "The Maker" },
  { id: "work", label: "The Works" },
  { id: "chronicle", label: "Chronicle" },
  { id: "contact", label: "Send a Raven" },
];

const Nav = () => {
  const [scrolled, setScrolled] = useState(false);
  const { mode, toggle } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goSection = (id: string) => {
    if (location.pathname !== "/") {
      navigate("/", { state: { scrollTo: id } });
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className={`nav${scrolled ? " scrolled" : ""}`}>
      <button
        className="brand"
        onClick={() => {
          if (location.pathname !== "/") navigate("/");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      >
        <Crest />
        Monjar
      </button>
      <div className="nav-links">
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            className="navlink"
            onClick={() => goSection(s.id)}
          >
            {s.label}
          </button>
        ))}
        <span className="nav-div" />
        <button className="nav-page" onClick={() => navigate("/blog")}>
          <BookGlyph />
          The Codex
        </button>
        <button
          className="toggle"
          aria-label="Toggle light/dark"
          onClick={toggle}
        >
          {mode === "dark" ? <SunIcon /> : <MoonIcon />}
        </button>
      </div>
    </nav>
  );
};

export default Nav;
