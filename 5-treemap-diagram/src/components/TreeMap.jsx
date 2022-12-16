import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import axios from "axios";

const TreeMap = ({ objProps }) => {
  //   const getData = async () => {
  //     try {
  //       const response = await axios.get(objProps.apiUrl);
  //       console.log(response.data);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };
  //   getData();}

  const ref = useRef();

  useEffect(() => {
    const treeMap = d3.select(ref.current);
    treeMap.append("circle").attr("cx", 150).attr("cy", 140).attr("r", 50);
  }, []);

  return (
    <div className="w-[800px] h-[500px] bg-white rounded-lg flex flex-col">
      <h2 className="text-2xl font-bold text-center">{objProps.title}</h2>
      <p className="text-center">{objProps.subTitle}</p>
      <div className="grow">
        <svg ref={ref} className="border border-red-600 w-full h-full"></svg>
      </div>
    </div>
  );
};

export default TreeMap;
