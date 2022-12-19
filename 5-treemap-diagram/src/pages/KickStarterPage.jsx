import React from "react";
import TreeMap from "../components/TreeMap";

const KickStarterPage = ({ objProps }) => {
  return (
    <div className="w-[900px] h-[500px] bg-white flex flex-col">
      <h2 className="text-2xl font-bold text-center">{objProps.title}</h2>
      <p className="text-center">{objProps.subTitle}</p>
      <div className="grow overflow-scroll">
        <TreeMap objProps={objProps} />
      </div>
    </div>
  );
};

export default KickStarterPage;
