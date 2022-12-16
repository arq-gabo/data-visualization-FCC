import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";

import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import TreeMap from "./components/TreeMap";

function App() {
  const objVideoGame = {
    apiUrl:
      "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json",
    title: "Video Game Sales",
    subTitle: "Top 100 Most Sold Video Games Grouped by Platform",
  };

  const objMovies = {
    apiUrl:
      "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json",
    title: "Movie Sales",
    subTitle: "Top 100 Highest Grossing Movies Grouped By Genre",
  };

  const objKickstarter = {
    apiUrl:
      "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json",
    title: "Kickstarter Pledges",
    subTitle: "Top 100 Most Pledged Kickstarter Campaigns Grouped By Category",
  };

  return (
    <div className="App h-screen flex flex-col justify-center items-center">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route index element={<TreeMap objProps={objVideoGame} />} />
          <Route path="movies" element={<TreeMap objProps={objMovies} />} />
          <Route
            path="kickstarter"
            element={<TreeMap objProps={objKickstarter} />}
          />
        </Routes>
      </BrowserRouter>
      <Footer />
    </div>
  );
}

export default App;
