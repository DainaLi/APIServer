/**
 * Created by Daina on 22/3/2018.
 */

//var selectedOutlet  = d3.select('select').property('value');

var margin = {top: 40, right: 20, bottom: 30, left: 80},
  width = 520 - margin.left - margin.right,
  height = 380 - margin.top - margin.bottom;

var formatPercent = d3.format(".0");

var x = d3.scale.ordinal()
  .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
  .range([height, 0]);

var xAxis = d3.svg.axis()
  .scale(x)
  .orient("bottom");

var yAxis = d3.svg.axis()
  .scale(y)
  .orient("left")
  .tickFormat(formatPercent);

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<strong>Sales:</strong> <span style='color:white'>" + d.Sales + "</span>";
  });

var svg = d3.select("body").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.call(tip);
d3.json("scripts/flare.json", function(data) {
  data.forEach(function(d) {
    d.Month = d.Month;
    d.Sales = +d.Sales;
  });

  x.domain(data.map(function(d) { return d.Month; }));
  y.domain([0, d3.max(data, function(d) { return d.Sales; })]);


  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Sales");

  svg.selectAll(".bar")
    .data(data)
    .enter().append("rect")
    .attr("class", "bar")
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide)
    .attr("x", function(d) { return x(d.Month); })
    .attr("width", x.rangeBand())
    .transition()
    .duration(5000)
    .attr("y", function(d) { return y(d.Sales); })
    .attr("height", function(d) {  return height - y(d.Sales); });

});

function type(d) {
  d.Sales = +d.Sales;
  return d;
}
