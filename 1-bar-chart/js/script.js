const showDate = (val) => {
  let arrEachDate = val.split("-");
  let quarterText = "";
  switch (arrEachDate[1]) {
    case "01":
      quarterText = "1°";
      break;
    case "04":
      quarterText = "2°";
      break;
    case "07":
      quarterText = "3°";
      break;
    case "10":
      quarterText = "4°";
      break;
  }

  return `${quarterText} Quarterly ${arrEachDate[0]}`;
};

const showGdp = (val) => `GDP: ${val.toLocaleString("en-US")}`;

async function getData() {
  const api_url =
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

  try {
    let res = await fetch(api_url);
    return await res.json();
  } catch (error) {
    console.log(error);
  }
}

async function renderData() {
  let data = await getData();
  let arrData = [];
  let arrDate = [];
  let arrGdp = [];
  data.data.forEach((val) => {
    arrData.push(val);
    arrDate.push(val[0]);
    arrGdp.push(val[1]);
  });

  let arrDateYear = arrDate.map((val) => {
    let arrSplit = val.split("-");
    if (arrSplit[1] === "01") {
      return parseFloat(`${arrSplit[0]}.25`);
    } else if (arrSplit[1] === "04") {
      return parseFloat(`${arrSplit[0]}.50`);
    } else if (arrSplit[1] === "07") {
      return parseFloat(`${arrSplit[0]}.75`);
    } else {
      return parseFloat(arrSplit[0]);
    }
  });

  // Create svg using d3.js library

  // Initial values
  const wRect = 3;
  const margin = 50;
  const w = arrData.length * wRect + margin * 2;
  const h = 500;
  const maxW = w - margin * 2;
  const maxH = h - margin * 2;
  const minDateX = d3.min(arrDateYear);
  const maxDateX = d3.max(arrDateYear);
  const maxVal = d3.max(arrGdp);
  const urlDescription = data.description
    .split("-")[1]
    .replace("(", "")
    .replace(")", "");

  const name = data.name.split(",")[0];
  const unit = data.description.split("\n")[0].toLowerCase();

  // Create SVG
  const svg = d3
    .select("#bar-char")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

  // Create Popup
  const tooltip = d3
    .select("#bar-char")
    .append("div")
    .style("opacity", 0)
    .attr("id", "tooltip");

  // Params x Axis
  const x = d3.scaleLinear().domain([minDateX, maxDateX]).range([0, maxW]);

  svg
    .append("g")
    .attr("transform", `translate(${margin}, ${maxH + margin})`)
    .call(d3.axisBottom(x).tickFormat(d3.format("")))
    .attr("id", "x-axis");

  // Params y axis
  const y = d3.scaleLinear().domain([maxVal, 0]).range([0, maxH]);

  svg
    .append("g")
    .attr("transform", `translate(${margin}, ${margin})`)
    .call(d3.axisLeft(y))
    .attr("id", "y-axis");

  // Property of Each bar
  svg
    .selectAll("rect")
    .data(arrData)
    .enter()
    .append("rect")
    .attr("data-gdp", (d) => d[1])
    .attr("data-date", (d) => d[0])
    .attr("x", (_, i) => i * wRect)
    .attr("y", (d) => 400 - (d[1] * maxH) / maxVal)
    .attr("width", wRect)
    .attr("height", (d) => (d[1] * maxH) / maxVal)
    .attr("transform", `translate(${margin}, ${margin})`)
    .attr("fill", "#26C6DA")
    .attr("class", "bar")

    .on("mouseover", (d) => {
      tooltip.transition().duration(200).style("opacity", 1);
      tooltip
        .html(`${showDate(d[0])} <br/> ${showGdp(d[1])}`)
        .style("left", `${d3.event.pageX + 10}px`)
        .style("top", d3.event.pageY - 40 + "px")
        .attr("data-date", d[0]);
    })

    .on("mouseout", (d) => {
      tooltip.transition().duration(500).style("opacity", 0);
    });

  // Property of Popup

  // Main Title
  svg
    .append("text")
    .attr("x", 220)
    .attr("y", 200)
    .attr("font-size", "30px")
    .attr("font-weight", "400")
    .attr("id", "title")
    .text("United States GDP");

  // Axis Y Title
  svg
    .append("text")
    .attr("x", -370)
    .attr("y", 70)
    .attr("transform", "rotate(-90)")
    .attr("font-size", "11px")
    .text(`${name} - ${unit}`);

  // Axis X Title
  svg
    .append("text")
    .attr("x", 450)
    .attr("y", 482)
    .attr("font-size", "15px")
    .attr("font-weight", "400")
    .text("Year");

  // Text Information
  svg
    .append("text")
    .attr("x", 585)
    .attr("y", maxH + margin * 1.95)
    .attr("font-size", "10px")
    .text(`More Information: ${urlDescription}`);
}
renderData();
