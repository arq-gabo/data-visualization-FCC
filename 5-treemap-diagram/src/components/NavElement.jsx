import React from "react";

const NavElement = ({ btnTitle }) => {
  return (
    <div>
      <button className="text-black hover:scale-110  py-2 px-4 rounded-full m-2">
        {btnTitle}
      </button>
    </div>
  );
};

export default NavElement;
