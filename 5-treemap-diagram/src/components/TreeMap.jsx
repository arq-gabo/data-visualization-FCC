import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import axios from "axios";

const TreeMap = ({ objProps }) => {
  const svgRef = useRef(null);
  const legendRef = useRef(null);

  const width = 1000;
  const height = 1000;
  const fontSize = 12;

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const legendContainer = d3.select(legendRef.current);

    // --------------------- Get data from api --------------------------------
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

        nodes
          .append("text")
          .text((d) => d.data.name)
          .attr("font-size", `${fontSize}px`)
          .attr("x", 3)
          .attr("y", fontSize + 4)
          .call(wrapText);

        // ------------------------- Function for wrap text -------------------------------------

        function wrapText(selection) {
          selection.each(function () {
            const node = d3.select(this);
            const rectWidth = +node.attr("data-width");
            let word;
            const words = node.text().split(" ").reverse();
            let line = [];
            let lineNumber = 0;
            const x = node.attr("x");
            const y = node.attr("y");
            let tspan = node.text("").append("tspan").attr("x", x).attr("y", y);
            while (words.length > 1) {
              word = words.pop();
              line.push(word);
              tspan.text(line.join(" "));
              const tspanLength = tspan.node().getComputedTextLength();
              if (tspanLength > rectWidth && line.length !== 1) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = addTspan(word);
              }
            }
            addTspan(words.pop());

            function addTspan(text) {
              lineNumber += 1;
              return node
                .append("tspan")
                .attr("x", x)
                .attr("y", y)
                .attr("dy", `${lineNumber * fontSize}px`)
                .text(text);
            }
          });
        }

        // ----------------------- Legend -----------------------------------------

        let categories = root.leaves().map((node) => node.data.category);

        categories = categories.filter(
          (category, index, self) => self.indexOf(category) === index
        );

        legendContainer.attr("width", width).attr("height", height / 4);

        const legend = legendContainer
          .selectAll("g")
          .data(categories)
          .join("g");

        legend
          .append("rect")
          .attr("width", fontSize * 2)
          .attr("height", fontSize)
          .attr("y", fontSize)
          .attr("x", (_, i) => fontSize * 4 * i)
          .attr("fill", (d) => colorScale(d));

        legend
          .append("text")
          .attr("transform", `translate(0, ${fontSize})`)
          .attr("y", fontSize * 2)
          .attr("x", (_, i) => fontSize * 4 * i)
          .style("font-size", fontSize)
          .text((d) => d);
      });
  }, [objProps.apiUrl]);

  return (
    <div>
      <svg ref={svgRef} />
      <svg ref={legendRef} />
    </div>
  );
};

export default TreeMap;
