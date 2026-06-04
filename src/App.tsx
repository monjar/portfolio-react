import { BrowserRouter, Route, Routes } from "react-router-dom";
import Rampart from "./components/Rampart";
import Nav from "./components/Nav";
import Home from "./pages/Home";
import Codex from "./pages/Codex";
import Tome from "./pages/Tome";
import "./styles/codex.css";

const App = () => (
  <BrowserRouter>
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
