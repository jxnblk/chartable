
var fs = require('fs');
var path = require('path');
var chartable = require('../');
var cssstats = require('css-statistics');

console.log('test');

function specificityGraph(selectors) {
  var result = [];
  selectors.map(function(selector) {
    var values = selector.specificity.split(',');
    var a = parseInt(values[0], 10) * 1000;
    var b = parseInt(values[1], 10) * 100;
    var c = parseInt(values[2], 10) * 10;
    var d = parseInt(values[3], 10);
    if (a > 10000) a = 10000;
    if (b > 1000) b = 1000;
    if (c > 100) c = 100;
    if (d > 10) d = 10;
    result.push(a + b + c + d);
  });
  return result;
}

function makeLineGraph(src) {
  var css = fs.readFileSync(path.join(__dirname, src), 'utf8');
  var stats = cssstats(css);
  var data = specificityGraph(stats.selectors);
  var lineGraph = chartable.lineGraph(data);
  fs.writeFileSync(path.join(__dirname, src + '.html'), lineGraph);
  console.log('Graph rendered to test folder');
}

makeLineGraph('basscss.css');
makeLineGraph('smacss.css');

var barChart = chartable.barChart([48,56,16,12,3,4,5,64]);
fs.writeFileSync(path.join(__dirname, 'bar-chart.html'), barChart);

