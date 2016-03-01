
var fs = require('fs');
var path = require('path');
var Handlebars = require('handlebars');
var Humanize = require('humanize-plus');
var findMin = require('./find-min');
var findMax = require('./find-max');
var findMax = require('./object-to-array');

module.exports = function(data, options) {

  // Only uses arrays for data
  // Todo: handle objects with labels
  if(!Array.isArray(data)) return false;
  var isObject = Object.isObject(data[0]);
  var source = data;
  if (isObject) {
    data = objectToArray(data, 'value')
  }

  var options = options || {};
  var templateSource = options.template || fs.readFileSync(path.join(__dirname, 'line-graph.hbs'), 'utf8');
  var template = Handlebars.compile(templateSource);
  
  var html;
  var width = options.width || 1000;
  var height = options.height || 512;
  var yMin = options.yMin || findMin(data);
  var yMax = options.yMax || findMax(data);
  var xStep = width / data.length;
  var yRulesLength = options.yRules || 4;

  var model = {};
  model.areaD = '';
  model.lineD = '';
  model.width = width
  model.height = height;
  model.rules = [];
  model.labels = [];

  // Build line graph
  model.areaD = 'M0 ' + (height - (height / yMax * data[0])) + ' ';
  model.lineD = 'M0 ' + (height - (height / yMax * data[0])) + ' ';
  data.forEach(function(y, i) {
    model.areaD += 'L ' + ((xStep * i) + (xStep / 2)) + ' ' + (height - ( (height / yMax) * y )) + ' ';
    model.lineD += 'L ' + ((xStep * i) + (xStep / 2)) + ' ' + (height - ( (height / yMax) * y )) + ' ';
    
    if (isObject) {
      model.labels.push({
        value: source[i],
        xPos: ((xStep * i) + (xStep / 2)),
        yPos: (height - ( (height / yMax) * y ))
      });
    }
  });
  model.lineD += 'H ' + width + ' ';
  model.areaD += 'H ' + width + ' ' + 'L ' + width + ' ' + height + ' 0 ' + height + 'z';


  // Build rules
  for (var i = 1; i <= yRulesLength; i++) {
    var step = i * 1 / yRulesLength;
    var value = 0;
    if (yMax > 1) {
      value = Humanize.compactInteger(step * yMax, 1);
    } else {
      value = Humanize.formatNumber(step * yMax, 1);
    }
    model.rules.push({
      yPosition: height - step * height,
      value: value
    });
  }

  html = template(model);

  return new Handlebars.SafeString(html).string;

};

