/**
 * Created by Daina on 22/3/2018.
 */
var margin = {top: 20, right: 50, bottom: 30, left: 50},
  width = 630 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

var parseDate = d3.time.format("%Y-%m-%d").parse;

var x = d3.time.scale()
  .range([0, width]);

var y = d3.scale.linear()
  .range([height, 0]);

var color = d3.scale.category10();

var xAxis = d3.svg.axis()
  .scale(x)
  .ticks(5)
  .innerTickSize(15)
  .outerTickSize(0)
  .orient("bottom");

var yAxis = d3.svg.axis()
  .scale(y)
  .tickFormat(function(d) { return d + "%";})
  .ticks(5)
  .innerTickSize(15)
  .outerTickSize(0)
  .orient("left");

var line = d3.svg.line()
  .interpolate("basis")
  .x(function(d) { return x(d.date); })
  .y(function(d) { return y(d.price); });


var svg = d3.select("#multiline_chart").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.tsv("airbus_data.tsv", function(error, data) {
  color.domain(d3.keys(data[0]).filter(function(key) { return key !== "date"; }));

  data.forEach(function(d) {
    d.date = parseDate(d.date);
  });

  var companies = color.domain().map(function(name) {
    return {
      name: name,
      values: data.map(function(d) {
        return {date: d.date, price: +d[name]};
      })
    };
  });


  x.domain(d3.extent(data, function(d) { return d.date; }));

  y.domain([
    d3.min(companies, function(c) { return d3.min(c.values, function(v) { return v.price; }); }),
    d3.max(companies, function(c) { return d3.max(c.values, function(v) { return v.price; }); })
  ]);

  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);


  svg.append("line")
    .attr(
      {
        "class":"horizontalGrid",
        "x1" : 0,
        "x2" : width,
        "y1" : y(0),
        "y2" : y(0),
        "fill" : "none",
        "shape-rendering" : "crispEdges",
        "stroke" : "black",
        "stroke-width" : "1px",
        "stroke-dasharray": ("3, 3")
      });


  var company = svg.selectAll(".company")
    .data(companies)
    .enter().append("g")
    .attr("class", "company");



  var path = svg.selectAll(".company").append("path")
    .attr("class", "line")
    .attr("d", function(d) { return line(d.values); })
    .style("stroke", function(d) { if (d.name == "Cyberport")
    {return "#005B9A";}
    else if(d.name == "GloryFruits"){return "#FFA500"}
    else if(d.name == "mainOutlet"){return "#339966"}
    else if(d.name == "XiangFuren"){return "#787878";}
    });



  //var totalLength = path.node().getTotalLength();
  /*
   console.log(path);
   console.log(path.node());
   console.log(path[0][0]);
   console.log(path[0][1]);
   */
  var totalLength = [path[0][0].getTotalLength(), path[0][1].getTotalLength()];

  // console.log(totalLength);

  d3.select(path[0][0])
    .attr("stroke-dasharray", totalLength[0] + " " + totalLength[0] )
    .attr("stroke-dashoffset", totalLength[0])
    .transition()
    .duration(1000)
    .ease("linear")
    .attr("stroke-dashoffset", 0);

  d3.select(path[0][1])
    .attr("stroke-dasharray", totalLength[1] + " " + totalLength[1] )
    .attr("stroke-dashoffset", totalLength[1])
    .transition()
    .duration(1000)
    .ease("linear")
    .attr("stroke-dashoffset", 0);

  var mouseG = svg.append("g")
    .attr("class", "mouse-over-effects");

  mouseG.append("path") // this is the black vertical line to follow mouse
    .attr("class", "mouse-line")
    .style("stroke", "black")
    .style("stroke-width", "1px")
    .style("opacity", "0");

  var lines = document.getElementsByClassName('line');

  var mousePerLine = mouseG.selectAll('.mouse-per-line')
    .data(companies)
    .enter()
    .append("g")
    .attr("class", "mouse-per-line");

  mousePerLine.append("circle")
    .attr("r", 7)
    .style("stroke", function(d) {
      return color(d.name);
    })
    .style("fill", "none")
    .style("stroke-width", "1px")
    .style("opacity", "0");

  mousePerLine.append("text")
    .attr("transform", "translate(10,3)");

  mouseG.append('svg:rect') // append a rect to catch mouse movements on canvas
    .attr('width', width) // can't catch mouse events on a g element
    .attr('height', height)
    .attr('fill', 'none')
    .attr('pointer-events', 'all')
    .on('mouseout', function() { // on mouse out hide line, circles and text
      d3.select(".mouse-line")
        .style("opacity", "0");
      d3.selectAll(".mouse-per-line circle")
        .style("opacity", "0");
      d3.selectAll(".mouse-per-line text")
        .style("opacity", "0");
    })
    .on('mouseover', function() { // on mouse in show line, circles and text
      d3.select(".mouse-line")
        .style("opacity", "1");
      d3.selectAll(".mouse-per-line circle")
        .style("opacity", "1");
      d3.selectAll(".mouse-per-line text")
        .style("opacity", "1");
    })
    .on('mousemove', function() { // mouse moving over canvas
      var mouse = d3.mouse(this);
      d3.select(".mouse-line")
        .attr("d", function() {
          var d = "M" + mouse[0] + "," + height;
          d += " " + mouse[0] + "," + 0;
          return d;
        });

      d3.selectAll(".mouse-per-line")
        .attr("transform", function(d, i) {
          console.log(width/mouse[0])
          var xDate = x.invert(mouse[0]),
            bisect = d3.bisector(function(d) { return d.date; }).right;
          idx = bisect(d.values, xDate);

          var beginning = 0,
            end = lines[i].getTotalLength(),
            target = null;

          while (true){
            target = Math.floor((beginning + end) / 2);
            pos = lines[i].getPointAtLength(target);
            if ((target === end || target === beginning) && pos.x !== mouse[0]) {
              break;
            }
            if (pos.x > mouse[0])      end = target;
            else if (pos.x < mouse[0]) beginning = target;
            else break; //position found
          }

          d3.select(this).select('text')
            .text(y.invert(pos.y).toFixed(2));

          return "translate(" + mouse[0] + "," + pos.y +")";
        });
    });

});
