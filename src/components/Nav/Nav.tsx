import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { BookGlyph, Crest, MoonIcon, ScrollGlyph, SunIcon } from "../icons";
import { useTheme } from "../../lib/useTheme";
import { cv } from "../../data/content";
import "./Nav.css";

const SECTIONS = [
  { id: "about", label: "The Maker" },
  { id: "relics", label: "Relics" },
  { id: "work", label: "The Works" },
  { id: "chronicle", label: "Chronicle" },
  { id: "contact", label: "Send a Raven" },
];

const Nav = () => {
  const [scrolled, setScrolled] = useState(false);
  const { mode, toggle } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const drawer = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // the drawer closes whenever the route changes
  useEffect(() => closeDrawer(), [location.pathname]);

  const openDrawer = () => {
    drawer.current?.showModal();
    setOpen(true);
  };
  function closeDrawer() {
    if (drawer.current?.open) drawer.current.close();
    setOpen(false);
  }

  const goSection = (id: string) => {
    closeDrawer();
    if (location.pathname !== "/") {
      navigate("/", { state: { scrollTo: id } });
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const ThemeIcon = mode === "dark" ? SunIcon : MoonIcon;

  return (
    <nav className={`nav${scrolled ? " scrolled" : ""}`} aria-label="Main">
      <Link
        className="brand"
        to="/"
        onClick={() => {
          if (location.pathname === "/") window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      >
        <Crest />
        Monjar
      </Link>
      <div className="nav-links">
        {SECTIONS.map((s) => (
          <button key={s.id} className="navlink" onClick={() => goSection(s.id)}>
            {s.label}
          </button>
        ))}
        <span className="nav-div" />
        <Link className="nav-page" to="/blog">
          <BookGlyph />
          The Codex
        </Link>
        <button className="toggle" aria-label={`Switch to ${mode === "dark" ? "light" : "dark"} mode`} onClick={toggle}>
          <ThemeIcon />
        </button>
        <button
          className="nav-menu"
          aria-label="Open menu"
          aria-expanded={open}
          aria-controls="nav-drawer"
          onClick={openDrawer}
        >
          <ScrollGlyph />
        </button>
      </div>

      <dialog
        id="nav-drawer"
        ref={drawer}
        className="drawer"
        aria-label="Menu"
        onClose={() => setOpen(false)}
        onClick={(e) => e.target === drawer.current && closeDrawer()}
      >
        <div className="drawer__sheet">
          <span className="drawer__roller drawer__roller--top" aria-hidden="true" />
          <div className="drawer__body">
            <button className="drawer__close" onClick={closeDrawer} aria-label="Close menu">
              ✕
            </button>
            <div className="eyebrow sole">Contents</div>
            <ol className="drawer__links">
              {SECTIONS.map((s, i) => (
                <li key={s.id} style={{ ["--i" as string]: i }}>
                  <button onClick={() => goSection(s.id)}>
                    <span className="drawer__num">{["I", "II", "III", "IV", "V"][i]}</span>
                    {s.label}
                  </button>
                </li>
              ))}
              <li style={{ ["--i" as string]: SECTIONS.length }}>
                <Link to="/blog" onClick={closeDrawer}>
                  <span className="drawer__num">❦</span>The Codex
                </Link>
              </li>
              <li style={{ ["--i" as string]: SECTIONS.length + 1 }}>
                <a href={cv} target="_blank" rel="noopener noreferrer">
                  <span className="drawer__num">✒</span>My CV
                </a>
              </li>
            </ol>
          </div>
          <span className="drawer__roller drawer__roller--bottom" aria-hidden="true" />
        </div>
      </dialog>
    </nav>
  );
};

export default Nav;
