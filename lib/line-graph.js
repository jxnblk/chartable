
var fs = require('fs');
var path = require('path');
var Handlebars = require('handlebars');

module.exports = function(data, options) {

  // Only use arrays for data
  // Todo: handle objects with labels
  if(!Array.isArray(data)) return false;

  var template = Handlebars.compile(fs.readFileSync(path.join(__dirname, 'line-graph.hbs'), 'utf8'));
  
  var options = options || {};
  var svg;
  var width = options.width || 1000;
  var height = options.height || 512;
  var yMin = 0;
  var yMax = 0;
  var xStep = 1;
  var yRulesLength = options.yRules || 4;

  var model = {};
  model.areaD = '';
  model.lineD = '';
  model.width = width
  model.height = height;
  model.rules = [];

  function findMin(arr) {
    var min = 0;
    arr.map(function(val) {
      if (val > min) {
        min = val;
      }
    });
    return min;
  }

  function findMax(arr) {
    var max = 0;
    arr.map(function(val) {
      if (val > max) {
        max = val;
      }
    });
    return max;
  }

  yMin = options.yMin || findMin(data);
  yMax = findMax(data);
  xStep = width / data.length;

  // Build line graph
  model.areaD = 'M0 ' + (height - (height / yMax * data[0])) + ' ';
  model.lineD = 'M0 ' + (height - (height / yMax * data[0])) + ' ';
  data.forEach(function(y, i) {
    model.areaD += 'L ' + ((xStep * i) + (xStep / 2)) + ' ' + (height - ( (height / yMax) * y )) + ' ';
    model.lineD += 'L ' + ((xStep * i) + (xStep / 2)) + ' ' + (height - ( (height / yMax) * y )) + ' ';
  });
  model.lineD += 'H ' + width + ' ';
  model.areaD += 'H ' + width + ' ' + 'L ' + width + ' ' + height + ' 0 ' + height + 'z';

  // Build rules
  for (var i = 0; i <= yRulesLength; i++) {
    var step = i * 1 / yRulesLength;
    model.rules.push({
      yPosition: height - step * height,
      value: step * yMax
    });
  }

  svg = template(model);

  return new Handlebars.SafeString(svg).string;

};

