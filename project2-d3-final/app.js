var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3
  .select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

  var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

  var chosenXAxis = "birth_year";

  function xScale(rapRIP, chosenXAxis) {
    var xLinearScale = d3.scaleLinear()
    .domain([d3.min(rapRIP, d => d[chosenXAxis])-1,
    d3.max(rapRIP, d => d[chosenXAxis])+1])
    .range([0, width])
    return xLinearScale;
}

function renderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale)
  .ticks(5)
  .tickFormat(d3.format("d"))
  xAxis.transition()
  .duration(1000)
  .call(bottomAxis)
  return xAxis;
}

function renderCircles(circlesGroup, newXScale) {
  circlesGroup.transition()
  .duration(1000)
  .attr("cx", d => newXScale(d[chosenXAxis]));
  return circlesGroup;
}

function updateToolTip(chosenXAxis, circlesGroup) {
  if (chosenXAxis === "birth_year") {
    var label = "Born:";
  }
  else {
    var label = "1st Track:";
  }

  var toolTip = d3.tip()
  .attr("class", "tooltip")
  .offset([-2.5, 70])
  .html(function(d) {
    return (`MC: ${d.name}<br>Hood: ${d.location__city}<br>${label} ${d[chosenXAxis]}<br>RIP: ${d.death_year}<br><br>${d.bio__summary}`);
  });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
    d3.select(this)
    .transition()
    .duration(100)
    .attr("fill", "black");
  })

  .on("mouseout", function(data, index) {
    toolTip.hide(data);
    d3.select(this)
    .transition()
    .duration(100)
    .attr("fill", "#b30f2a");
  });

  return circlesGroup;
}

d3.csv("rapRIP.csv", function(err, rapRIP) {
  if (err) throw err;
  rapRIP.forEach(function(data) {
    data.birth_year = +data.birth_year;
    data.death_year = +data.death_year;
    data.career_start = +data.career_start;
  });

  var xLinearScale = xScale(rapRIP, chosenXAxis);

  var yLinearScale = d3.scaleLinear()
  .domain([d3.min(rapRIP, d => d.death_year)-1, 
    d3.max(rapRIP, d => d.death_year)+1])
    .range([height, 0]);

  var bottomAxis = d3.axisBottom(xLinearScale)
  .ticks(5)
  .tickFormat(d3.format("d"));

  var leftAxis = d3.axisLeft(yLinearScale)
  .ticks(5)
  .tickFormat(d3.format("d"));

  var xAxis = chartGroup.append("g")
  .classed("x-axis", true)
  .attr("transform", `translate(0, ${height})`)
  .call(bottomAxis);

  chartGroup.append("g")
  .call(leftAxis);
    
  var circlesGroup = chartGroup.selectAll("circle")
  .data(rapRIP)
  .enter()
  .append("circle")
  .attr("cx", d => xLinearScale(d[chosenXAxis]))
  .attr("cy", d => yLinearScale(d.death_year))
  .attr("r", 15)
  .attr("fill", "#b30f2a")
  .attr("opacity", ".65");
  
  var labelsGroup = chartGroup.append("g")
  .attr("transform", `translate(${width / 2}, ${height + 20})`);
  
  var birthLabel = labelsGroup.append("text")
  .attr("x", 0)
  .attr("y", 20)
  .attr("value", "birth_year") // value to grab for event listener
  .classed("active", true)
  .text("Born");

  var careerLabel = labelsGroup.append("text")
  .attr("x", 0)
  .attr("y", 45)
  .attr("value", "career_start") // value to grab for event listener
  .classed("inactive", true)
  .text("1st Track");

  chartGroup.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left)
  .attr("x", 0 - (height/2))
  .attr("dy", "1em")
  .classed("axis-text", true)
  .text("RIP");

  var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

  labelsGroup.selectAll("text")
  .on("click", function() {
    var value = d3.select(this).attr("value");
    if (value !== chosenXAxis) {
      chosenXAxis = value;
      xLinearScale = xScale(rapRIP, chosenXAxis);
      xAxis = renderAxes(xLinearScale, xAxis);
      circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);
      circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

      if (chosenXAxis === "career_start") {
        careerLabel
        .classed("active", true)
        .classed("inactive", false);
    
        birthLabel
        .classed("active", false)
        .classed("inactive", true);
      }
        
    else {
      careerLabel
      .classed("active", false)
      .classed("inactive", true);
            
      birthLabel
      .classed("active", true)
      .classed("inactive", false);
      }
    }
  });
});
