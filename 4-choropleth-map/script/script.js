const educationData =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";
const countyData =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";

let promises = [d3.json(countyData), d3.json(educationData)];

Promise.all(promises)
  .then(ready)
  .catch((e) => console.log(e));

function ready([us, edu]) {
  // ----------------------- Initial Values ----------------------------------
  const w = 960;
  const h = 600;

  const path = d3.geoPath();

  const minPercentBachelor = d3.min(edu.map((val) => val.bachelorsOrHigher));
  const maxPercentBachelor = d3.max(edu.map((val) => val.bachelorsOrHigher));

  // ----------------------- Create SVG ---------------------------------------
  const svg = d3
    .select("#choropleth-graph")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

  const legend = d3
    .select("#choropleth-legend")
    .append("svg")
    .attr("width", 710)
    .attr("height", 50);

  // --------------------- Create Legend ---------------------------------------

  const linearScale = d3.scaleLinear().domain([0, 100]).range([0, 610]);

  const quantizeScale = d3
    .scaleQuantize()
    .domain([0, 100])
    .range(d3.schemeBlues[9]);

  const myData = d3.range(0, 100);

  legend
    .selectAll("rect")
    .data(myData)
    .join("rect")
    .attr("x", (d) => linearScale(d))
    .attr("width", 0)
    .attr("height", 20)
    .attr("width", 8)
    .style("fill", (d) => quantizeScale(d));

  // ----------------------- Construction map ----------------------------------

  svg
    .append("g")
    .selectAll("path")
    .data(topojson.feature(us, us.objects.counties).features)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("class", "counties");

  svg
    .append("g")
    .selectAll("path")
    .data(topojson.feature(us, us.objects.states).features)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("class", "states");
}
