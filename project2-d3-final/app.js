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

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "birth_year";

// function used for updating x-scale var upon click on axis label
function xScale(rapRIP, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(rapRIP, d => d[chosenXAxis])-1,
      d3.max(rapRIP, d => d[chosenXAxis])+1])
    .range([0, width])

  return xLinearScale;
}

// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale)
  .ticks(5)
  .tickFormat(d3.format("d"))
  xAxis.transition()
    .duration(1000)
    .call(bottomAxis)
  return xAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]));

  return circlesGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup) {

  if (chosenXAxis === "birth_year") {
    var label = "Born:";
  }
  else {
    var label = "First Track:";
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
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;
}

// Retrieve data from the CSV file and execute everything below
d3.csv("rapRIP.csv", function(err, rapRIP) {
  if (err) throw err;

  // parse data
  rapRIP.forEach(function(data) {
    data.birth_year = +data.birth_year;
    data.death_year = +data.death_year;
    data.career_start = +data.career_start;
  });

  // xLinearScale function above csv import
  var xLinearScale = xScale(rapRIP, chosenXAxis);

  // Create y scale function
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(rapRIP, d => d.death_year)-1, 
      d3.max(rapRIP, d => d.death_year)+1])
    .range([height, 0]);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale)
    .ticks(5)
    .tickFormat(d3.format("d"));
  var leftAxis = d3.axisLeft(yLinearScale)
    .ticks(5)
    .tickFormat(d3.format("d"));

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis)

    ;

  // append y axis
  chartGroup.append("g")
    .call(leftAxis)
    ;

  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(rapRIP)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d.death_year))
    .attr("r", 15)
    .attr("fill", "#b30f2a")
    .attr("opacity", ".65");

  // Create group for  2 x- axis labels
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
    .text("First Track");

  // append y axis
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height/2))
    .attr("dy", "1em")
    .classed("axis-text", true)
    .text("RIP");

  // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

  // x axis labels event listener
  labelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = value;

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(rapRIP, chosenXAxis);

        // updates x axis with transition
        xAxis = renderAxes(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

        // changes classes to change bold text
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
