const educationData =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";
const countyData =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";

//Initial Values
const w = 960;
const h = 600;

const path = d3.geoPath();

const svg = d3
  .select("#choropleth-graph")
  .append("svg")
  .attr("width", w)
  .attr("height", h);

let promises = [d3.json(countyData), d3.json(educationData)];

Promise.all(promises)
  .then(ready)
  .catch((e) => console.log(e));

function ready([us, edu]) {
  svg
    .append("g")
    .selectAll("path")
    .data(topojson.feature(us, us.objects.counties).features)
    .enter()
    .append("path")
    .attr("d", path);
}
