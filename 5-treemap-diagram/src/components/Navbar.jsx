import React from "react";
import { Link, Outlet } from "react-router-dom";
import NavElement from "./NavElement";

const Navbar = () => {
  return (
    <div className="flex">
      <Link to="/">
        <NavElement btnTitle={"Video Game Data Set"} />
      </Link>
      <Link to="/movies">
        <NavElement btnTitle={"Movies Data Set"} />
      </Link>
      <Link to="/kickstarter">
        <NavElement btnTitle={"Kickstarter Data Set"} />
      </Link>
      <Outlet />
    </div>
  );
};

export default Navbar;
