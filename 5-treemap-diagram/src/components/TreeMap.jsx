import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import axios from "axios";

const TreeMap = ({ objProps }) => {
  const svgRef = useRef(null);
  const legendRef = useRef(null);
  const tooltipRef = useRef(null);

  // --------------- Initial Values ------------------------------
  const widthMap = 1000;
  const heightMap = 1000;
  const widthLegend = 140;
  const heightLegend = 420;
  const fontSize = 12;
  const spaceLegend = 1.8;

  useEffect(() => {
    // Create svg for tree Map
    const svg = d3.select(svgRef.current);
    svg.selectAll("g").remove();
    const legendContainer = d3.select(legendRef.current);
    legendContainer.selectAll("g").remove();
    const tooltip = d3.select(tooltipRef.current);

    // --------------------- Get data from api --------------------------------
    axios
      .get(objProps.apiUrl)
      .then((res) => res.data)
      .then((data) => {
        // ------------------------- Tree map graph -------------------------------

        svg.attr("width", widthMap).attr("height", heightMap);
        tooltip
          .style("background-color", "rgb(169, 169, 169)")
          .style("opacity", 0);

        const root = d3
          .hierarchy(data)
          .sum((d) => d.value)
          .sort((a, b) => b.value - a.value);

        const treeMapRoot = d3.treemap().size([widthMap, heightMap]).padding(1)(
          root
        );

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
          .attr("fill", (d) => colorScale(d.data.category))
          .on("mousemove", (event, d) => {
            tooltip
              .style("opacity", 1)
              .html(
                `name: <b>${d.data.name}</b> </br> category: <b>${
                  d.data.category
                }</b> </br> value: <b>${new Intl.NumberFormat("de-DE").format(
                  d.data.value
                )} USD </b>`
              )
              .style("left", `${event.offsetX + 15}px`)
              .style("top", `${event.offsetY - 30}px`);
          })
          .on("mouseout", () => tooltip.style("opacity", 0));

        nodes
          .append("text")
          .text((d) => d.data.name)
          .attr("font-size", `${fontSize}px`)
          .attr("x", 3)
          .attr("y", fontSize + 4)
          .call(wrapText);

        // ------------------------- Function for wrap text in tree map graph-------------------------------------

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

        legendContainer.attr("width", widthLegend).attr("height", heightLegend);

        const legend = legendContainer
          .selectAll("g")
          .data(categories)
          .join("g");

        legend
          .append("rect")
          .attr("width", fontSize)
          .attr("height", fontSize)
          .attr("x", fontSize)
          .attr("y", (_, i) => fontSize * spaceLegend * i)
          .attr("fill", (d) => colorScale(d));

        legend
          .append("text")
          .attr("transform", `translate(0, ${fontSize})`)
          .attr("x", fontSize * 3)
          .attr("y", (_, i) => fontSize * spaceLegend * i)
          .style("font-size", fontSize)
          .text((d) => d);
      });
  }, [objProps.apiUrl]);

  return (
    <div className=" bg-white flex flex-col">
      <h2 className="text-2xl font-bold text-center">{objProps.title}</h2>
      <p className="text-center">{objProps.subTitle}</p>
      <div className="flex w-[900px] h-[450px] ">
        <div>
          <p className="text-center mb-1">Legend</p>
          <svg ref={legendRef} />
        </div>
        <div className="overflow-scroll relative">
          <svg ref={svgRef} />
          <div
            ref={tooltipRef}
            className="absolute text-center text-xs px-3 rounded-lg"
          ></div>
        </div>
      </div>
    </div>
  );
};

export default TreeMap;
