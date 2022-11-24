//get data fron api

async function getData() {
  const apiUrl =
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

  try {
    let res = await fetch(apiUrl);
    return await res.json();
  } catch (e) {
    console.log(e);
  }
}

async function renderData() {
  //parsed api data for used in create graph
  let data = await getData();

  // Create svg using d3.js library

  // Initial values
  const margin = 50;
  const w = data.length * 20 + margin * 2; //800px
  const h = 550;
  const graphW = w - margin * 2;
  const graphH = h - margin * 2;
  const minYear = d3.min(data.map((val) => val.Year)) - 1;
  const maxYear = d3.max(data.map((val) => val.Year)) + 1;

  //initial values to y axis
  const specifier = "%M:%S";
  const parsedTime = data.map((d) => d3.timeParse(specifier)(d.Time));
  const minTime = d3.min(parsedTime);
  const maxTime = d3.max(parsedTime);

  //Create svg
  const svg = d3
    .select("#scatterplot")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

  //Create X horizontal axis
  const xAxis = d3.scaleLinear().domain([minYear, maxYear]).range([0, graphW]);

  svg
    .append("g")
    .attr("transform", `translate(${margin}, ${margin + graphH})`)
    .call(d3.axisBottom(xAxis).tickFormat(d3.format("")));

  //Create Y Vertical axis
  const Yaxis = d3.scaleTime().domain([minTime, maxTime]).range([0, graphH]);

  svg
    .append("g")
    .attr("transform", `translate(${margin}, ${margin})`)
    .call(d3.axisLeft(Yaxis).tickFormat(d3.timeFormat(specifier)));
}

renderData();
