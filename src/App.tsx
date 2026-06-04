import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Rampart from "./components/Rampart";
import Nav from "./components/Nav";
import Home from "./pages/Home";
import Codex from "./pages/Codex";
import Tome from "./pages/Tome";
import "./styles/codex.css";

const RedirectHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we were redirected from 404.html
    const redirectPath = sessionStorage.getItem('redirectPath');
    if (redirectPath) {
      sessionStorage.removeItem('redirectPath');
      navigate(redirectPath, { replace: true });
    }
  }, [navigate]);

  return null;
};

const App = () => (
  <BrowserRouter>
    <RedirectHandler />
    <Rampart />
    <Nav />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/blog" element={<Codex />} />
      <Route path="/blog/:slug" element={<Tome />} />
      <Route path="*" element={<Home />} />
    </Routes>
  </BrowserRouter>
);

export default App;
