import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";

import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Kickstarter from "./pages/Kickstarter";
import Movies from "./pages/Movies";
import VideoGames from "./pages/VideoGames";

function App() {
  return (
    <div className="App h-screen flex flex-col justify-center items-center">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route index element={<VideoGames />} />
          <Route path="movies" element={<Movies />} />
          <Route path="kickstarter" element={<Kickstarter />} />
        </Routes>
      </BrowserRouter>
      <Footer />
    </div>
  );
}

export default App;
