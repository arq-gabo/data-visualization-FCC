//get data from api

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
  const w = data.length * 21 + margin * 2; //800px
  const h = 550;
  const graphW = w - margin * 2; // 735
  const graphH = h - margin * 2; // 450
  const minYear = d3.min(data.map((val) => val.Year)) - 1; // 1993
  const maxYear = d3.max(data.map((val) => val.Year)) + 1; // 2016

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

  //Create tooltip
  const tooltip = d3
    .select("#scatterplot")
    .append("div")
    .style("opacity", 0)
    .attr("id", "tooltip");

  //Create X horizontal axis
  const xAxis = d3.scaleLinear().domain([minYear, maxYear]).range([0, graphW]);

  svg
    .append("g")
    .attr("transform", `translate(${margin}, ${margin + graphH})`)
    .call(d3.axisBottom(xAxis).tickFormat(d3.format("")))
    .attr("id", "x-axis");

  //Create Y Vertical axis
  const Yaxis = d3.scaleTime().domain([minTime, maxTime]).range([0, graphH]);

  svg
    .append("g")
    .attr("transform", `translate(${margin}, ${margin})`)
    .call(d3.axisLeft(Yaxis).tickFormat(d3.timeFormat(specifier)))
    .attr("id", "y-axis");

  //Create each dot
  svg
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr(
      "cx",
      (d) => margin + (d.Year - minYear) * (graphW / (maxYear - minYear))
    )
    .attr(
      "cy",
      (d) =>
        margin +
        (d3.timeParse(specifier)(d.Time).valueOf() - minTime.valueOf()) *
          (graphH / (maxTime.valueOf() - minTime.valueOf()))
    )
    .attr("r", 6)
    .style("fill", (d) => {
      if (d.Doping === "") {
        return "#ffc857";
      } else {
        return "#177e89";
      }
    })
    .attr("class", "dot")
    .attr("data-xvalue", (d) => d.Year)
    .attr("data-yvalue", (d) => d3.timeParse(specifier)(d.Time).toISOString())
    .on("mouseover", (d) => {
      tooltip.transition().duration(0).style("opacity", 1);
      tooltip
        .html(
          `${d.Name} </br> Year: ${d.Year}, Time: ${d.Time} </br> ${d.Doping}`
        )
        .style("left", `${d3.event.pageX + 20}px`)
        .style("top", `${d3.event.pageY - 30}px`)
        .attr("data-year", d.Year);
    })
    .on("mouseout", (d) => {
      tooltip.transition().duration(0).style("opacity", 0);
    });

  //Legend 1
  svg
    .append("rect")
    .attr("width", 20)
    .attr("height", 20)
    .attr("x", graphW)
    .attr("y", 150)
    .style("fill", "#ffc857")
    .attr("class", "legend-text")
    .attr("id", "legend");

  svg
    .append("text")
    .attr("x", 630)
    .attr("y", 165)
    .text("No doping allegations")
    .attr("class", "legend")
    .attr("id", "legend");

  //Legend 2
  svg
    .append("rect")
    .attr("width", 20)
    .attr("height", 20)
    .attr("x", graphW)
    .attr("y", 175)
    .style("fill", "#177e89")
    .attr("class", "legend-text")
    .attr("id", "legend");

  svg
    .append("text")
    .attr("x", 595)
    .attr("y", 190)
    .text("Riders with doping allegations")
    .attr("class", "legend")
    .attr("id", "legend");

  //Title
  svg
    .append("text")
    .attr("x", 250)
    .attr("y", 50)
    .text("Doping in Professional Bicycle Racing")
    .attr("font-size", 22)
    .attr("id", "title");

  // Sub-title
  svg
    .append("text")
    .attr("x", 320)
    .attr("y", 70)
    .text("35 Fastest times up Alpe d'Huez")
    .attr("font-size", 15);

  // Axis Title
  svg
    .append("text")
    .attr("x", 400)
    .attr("y", 535)
    .text("Year")
    .attr("font-size", 15);

  svg
    .append("text")
    .attr("x", -320)
    .attr("y", 70)
    .text("Time in Minutes")
    .attr("font-size", 15)
    .attr("transform", "rotate(-90)");
}

renderData();
