/**
 * Created by Daina on 22/3/2018.
 */

var data = ["Option 1", "Option 2", "Option 3"];

var select = d3.select('#dropdown_div')
  .append('select')
  .attr('class','select')
  .on('change',onchange)

var options = select
  .selectAll('option')
  .data(data).enter()
  .append('option')
  .text(function (d) { return d; });


