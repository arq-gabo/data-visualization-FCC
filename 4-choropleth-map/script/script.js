const educationData =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";
const countyData =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";

let promises = [d3.json(countyData), d3.json(educationData)];

const legendSize = document.getElementById("choropleth-legend");

let percentageEducation = 0;

Promise.all(promises)
  .then(ready)
  .catch((e) => console.log(e));

function ready([us, edu]) {
  // ----------------------- Initial Values ----------------------------------

  const w = 950;
  const h = 600;

  const wLeg = legendSize.clientWidth;
  const hLeg = legendSize.clientHeight;

  const path = d3.geoPath();

  const maxPercentBachelor =
    Math.ceil(d3.max(edu.map((val) => val.bachelorsOrHigher)) / 10) * 10;

  // ----------------------- Create SVG ---------------------------------------
  const svg = d3
    .select("#choropleth-graph")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

  // --------------------- Create Legend ---------------------------------------
  const legend = d3
    .select("#choropleth-legend")
    .append("svg")
    .attr("width", wLeg)
    .attr("height", hLeg);

  // ----------------------- Construction Legend --------------------------------------

  const percentageScale = d3
    .scaleLinear()
    .domain([0, maxPercentBachelor])
    .range([0, 610]);

  const colorScale = d3
    .scaleQuantize()
    .domain([0, maxPercentBachelor])
    .range(d3.schemeOranges[maxPercentBachelor / 10]);

  legend
    .append("g")
    .call(d3.axisBottom(percentageScale))
    .attr("transform", "translate(50, 20)");

  const myData = d3.range(0, maxPercentBachelor);

  legend
    .selectAll("rect")
    .data(myData)
    .join("rect")
    .attr("x", (d) => percentageScale(d))
    .attr("y", 5)
    .attr("width", maxPercentBachelor / 10 + 1)
    .attr("height", 15)
    .attr("fill", (d) => colorScale(d))
    .attr("transform", "translate(50, 0)");

  legend.select("text").text("Percentage %");

  // ----------------------- Construction map ----------------------------------

  svg
    .append("g")
    .selectAll("path")
    .data(topojson.feature(us, us.objects.counties).features)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("class", "counties")
    .style("fill", (d) =>
      colorScale(edu.find((val) => val.fips === d.id).bachelorsOrHigher)
    );

  svg
    .append("g")
    .selectAll("path")
    .data(topojson.feature(us, us.objects.states).features)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("class", "states");
}
