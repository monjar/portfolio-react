import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router";
import { AnimatePresence, domAnimation, LazyMotion, MotionConfig } from "motion/react";
import Rampart from "./components/Rampart/Rampart";
import Nav from "./components/Nav/Nav";
import Home from "./routes/Home";
import PageTurn from "./effects/PageTurn/PageTurn";
import SpellTrail from "./effects/SpellTrail/SpellTrail";

const Codex = lazy(() => import("./routes/Codex"));
const Tome = lazy(() => import("./routes/Tome"));
const WorkDetail = lazy(() => import("./routes/WorkDetail"));
const NotFound = lazy(() => import("./routes/NotFound"));

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence
      mode="wait"
      initial={false}
      onExitComplete={() => {
        if (!(location.state as { scrollTo?: string } | null)?.scrollTo) window.scrollTo(0, 0);
      }}
    >
      <PageTurn key={location.pathname}>
        <Suspense fallback={<div className="route-loading" />}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/works/:slug" element={<WorkDetail />} />
            <Route path="/blog" element={<Codex />} />
            <Route path="/blog/:slug" element={<Tome />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </PageTurn>
    </AnimatePresence>
  );
}

const App = () => (
  <LazyMotion features={domAnimation} strict>
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <Rampart />
        <Nav />
        <AnimatedRoutes />
        <SpellTrail />
      </BrowserRouter>
    </MotionConfig>
  </LazyMotion>
);

export default App;
