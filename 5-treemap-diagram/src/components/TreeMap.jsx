import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import axios from "axios";

const TreeMap = ({ objProps }) => {
  const ref = useRef();

  const width = 1200;
  const height = 640;

  useEffect(() => {
    const svg = d3.select(ref.current);

    axios
      .get(objProps.apiUrl)
      .then((res) => res.data)
      .then((data) => {
        console.log(data);

        svg.attr("width", width).attr("height", height);

        const root = d3
          .hierarchy(data)
          .sum((d) => d.value)
          .sort((a, b) => b.value - a.value);

        const treeMapRoot = d3.treemap().size([width, height]).padding(1)(root);

        const nodes = svg
          .selectAll("g")
          .data(treeMapRoot.leaves())
          .join("g")
          .attr("transform", (d) => `translate(${d.x0}, ${d.y0})`);

        const fader = (color) => d3.interpolateRgb(color, "#fff")(0.1);

        const colorScale = d3.scaleOrdinal(d3.schemeCategory10.map(fader));

        nodes
          .append("rect")
          .attr("width", (d) => d.x1 - d.x0)
          .attr("height", (d) => d.y1 - d.y0)
          .attr("fill", (d) => colorScale(d.data.category));
      });
  }, [objProps.apiUrl]);

  return (
    <div>
      <svg ref={ref} />
    </div>
  );
};

export default TreeMap;
