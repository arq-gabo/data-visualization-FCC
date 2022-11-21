//get data fron api

async function getData() {
  const apiUrl =
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

  try {
    let res = await fetch(apiUrl);
    let data = await res.json();
    console.log(data);
  } catch (e) {
    console.log(e);
  }
}

async function renderData() {
  getData();
  // Create svg using d3.js library

  // Initial values
  const w = 700;
  const h = 500;

  //Create svg
  const svg = d3
    .select("#scatterplot")
    .append("svg")
    .attr("width", w)
    .attr("height", h);
}

renderData();
