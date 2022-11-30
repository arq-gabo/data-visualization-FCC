// Making fetch api data
const getData = async () => {
  const api_url =
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";

  try {
    const res = await fetch(api_url);
    return await res.json();
  } catch (error) {
    console.log(error);
  }
};

const renderData = async () => {
  // Get data from api
  let data = await getData();

  console.log(data.monthlyVariance[0]);

  // Initial Values
  const margin = 50;
  const widthEachRect = 5;
  const minYear = data.monthlyVariance[0].year;
  const maxYear = data.monthlyVariance[data.monthlyVariance.length - 1].year;
  const w = (maxYear - minYear) * widthEachRect + margin * 2;
  const h = 500;
  const graphW = w - margin * 2;
  const graphH = h - margin * 2;

  const svg = d3
    .select("#heat-map")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

  //Create axis x
  const xAxis = d3.scaleLinear().domain([minYear, maxYear]).range([0, graphW]);

  svg
    .append("g")
    .attr("transform", `translate(${margin}, ${margin + graphH})`)
    .call(d3.axisBottom(xAxis).tickFormat(d3.format("")));

  //Create axis y
  const yAxis = d3
    .scaleUtc()
    .domain([new Date("2022-01-15T00:00:00"), new Date("2023-01-15T00:00:00")])
    .range([0, graphH]);

  svg
    .append("g")
    .attr("transform", `translate(${margin}, ${margin})`)
    .call(d3.axisLeft(yAxis).tickFormat(d3.timeFormat("%B")));
};

renderData();
