import React from "react";
import TreeMap from "../components/TreeMap";

const MoviesPage = ({ objProps }) => {
  return (
    <div className="w-[800px] h-[500px] bg-white flex flex-col">
      <h2 className="text-2xl font-bold text-center">{objProps.title}</h2>
      <p className="text-center">{objProps.subTitle}</p>
      <div className="grow overflow-scroll">
        <TreeMap objProps={objProps} />
      </div>
    </div>
  );
};

export default MoviesPage;
