import React from "react";
import MainPage from "./pages/MainPage";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import AnimateLyPage from "./pages/AnimateLyPage";
const App = () => {
  return (
    <div className="app">
      <Router>
       <Routes>
          <Route path="/AnimateLy" element={<AnimateLyPage/>}/>
          <Route path="/" element={<MainPage/>}/>
        </Routes>
        </Router>
    </div>
  );
};

export default App;
