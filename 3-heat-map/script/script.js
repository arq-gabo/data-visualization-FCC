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
  const baseTemperature = 8.66;
  let varianceTemp = 0;

  // Initial Values Graph
  const margin = 25;
  const minYear = data.monthlyVariance[0].year;
  const maxYear = data.monthlyVariance[data.monthlyVariance.length - 1].year;
  const widthEachRect = 5;
  const h = 500;
  const graphW = (maxYear - minYear) * widthEachRect + widthEachRect;
  const w = margin * 5 + graphW;
  const graphH = h - margin * 4;
  const heightEachRect = graphH / 12;

  // Initial values legend

  const arrVal = [
    "3.9 or less",
    "5.0",
    "6.1",
    "7.2",
    "8.3",
    "9.5",
    "10.6",
    "11.7 or more",
  ];

  const arrColor = [
    "#4575B4",
    "#74ADD1",
    "#ABD9E9",
    "#E0F3F8",
    "#FFFFBF",
    "#FEE090",
    "#FDAE61",
    "#F46D43",
    "#d73027",
  ];

  const legendW = 550;
  const legendGraphW = 400;
  const legendH = 55;
  const widthEachColor = legendGraphW / 7;
  const marginLegend = (legendW - legendGraphW) / 2;

  const svg = d3
    .select("#heat-map")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

  const legend = d3
    .select("#heat-legend")
    .append("svg")
    .attr("width", legendW)
    .attr("height", legendH);

  //Create axis x graph
  const xAxis = d3.scaleLinear().domain([minYear, maxYear]).range([0, graphW]);

  svg
    .append("g")
    .attr("transform", `translate(${margin * 4 - 1}, ${margin + graphH})`)
    .call(d3.axisBottom(xAxis).tickFormat(d3.format("")));

  //Create axis y graph
  const yAxis = d3
    .scaleUtc()
    .domain([new Date("2022-01-15T00:00:00"), new Date("2023-01-15T00:00:00")])
    .range([0, graphH]);

  svg
    .append("g")
    .attr("transform", `translate(${margin * 4 - 1}, ${margin})`)
    .call(d3.axisLeft(yAxis).tickFormat(d3.timeFormat("%B")));

  //Create axis x legend
  const xLegendAxis = d3.scalePoint().domain(arrVal).range([0, legendGraphW]);

  legend
    .append("g")
    .attr("transform", `translate(75, 20)`)
    .call(d3.axisBottom(xLegendAxis));

  // Construction element of the graph
  svg
    .selectAll("rect")
    .data(data.monthlyVariance)
    .enter()
    .append("rect")
    .attr("width", widthEachRect)
    .attr("height", heightEachRect)
    .attr("x", (d) => margin * 4 + (d.year - minYear) * widthEachRect)
    .attr("y", (d) => margin + (d.month - 1) * heightEachRect)
    .attr("fill", (d) => {
      varianceTemp = baseTemperature + d.variance;
      if (varianceTemp < 3.9) {
        return arrColor[0];
      } else if (varianceTemp >= 3.9 && varianceTemp < 5) {
        return arrColor[1];
      } else if (varianceTemp >= 5 && varianceTemp < 6.1) {
        return arrColor[2];
      } else if (varianceTemp >= 6.1 && varianceTemp < 7.2) {
        return arrColor[3];
      } else if (varianceTemp >= 7.2 && varianceTemp < 8.3) {
        return arrColor[4];
      } else if (varianceTemp >= 8.3 && varianceTemp < 9.5) {
        return arrColor[5];
      } else if (varianceTemp >= 9.5 && varianceTemp < 10.6) {
        return arrColor[6];
      } else if (varianceTemp >= 10.6 && varianceTemp < 11.7) {
        return arrColor[7];
      } else if (varianceTemp >= 11.7) {
        return arrColor[8];
      }
    });

  //Create element legend temp scale
  legend
    .selectAll("rect")
    .data(arrColor)
    .enter()
    .append("rect")
    .attr("width", widthEachColor)
    .attr("height", 15)
    .attr("x", (_, i) => marginLegend - widthEachColor + widthEachColor * i)
    .attr("y", 5)
    .attr("fill", (d) => d)
    .attr("class", "legend-color");

  legend
    .append("line")
    .style("stroke", "black")
    .style("stroke-width", 2)
    .attr("x1", marginLegend - widthEachColor)
    .attr("y1", 20)
    .attr(
      "x2",
      marginLegend - widthEachColor + widthEachColor * arrColor.length
    )
    .attr("y2", 20);

  // Title axis x
  svg
    .append("text")
    .attr("x", w / 2)
    .attr("y", graphH + margin * 2 + 15)
    .text("Year");

  // Title axis y
  svg
    .append("text")
    .attr("x", -260)
    .attr("y", 35)
    .text("Months")
    .attr("font-size", 15)
    .attr("transform", "rotate(-90)");

  // Title legend
  legend.append("text").attr("x", 210).attr("y", 51).text("Temperature Scale");
};

renderData();
