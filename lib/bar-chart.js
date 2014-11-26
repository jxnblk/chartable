
var fs = require('fs');
var path = require('path');
var Handlebars = require('handlebars');
var findMin = require('./find-min');
var findMax = require('./find-max');

module.exports = function(data, options) {

  if(!Array.isArray(data)) return false;

  var options = options || {};
  var templateSource = options.template || fs.readFileSync(path.join(__dirname, 'bar-chart.hbs'), 'utf8');
  var template = Handlebars.compile(templateSource);
  var html;
  var width = options.width || 1000;
  var height = options.height || 512;
  var yPadding = options.yPadding || 16;
  var yMin = options.yMin || findMin(data);
  var yMax = options.yMax || findMax(data);
  var yRulesLength = options.yRules || 4;

  var model = {};
  model.width = width;
  model.height = height;
  model.yPadding = yPadding;
  model.bars = [];
  model.rules = [];
  model.values = [];

  // Build bar chart
  var barWidth = 2 * (width / (data.length * 3 + 1));
  data.forEach(function(val, i) {
    var barHeight = (val * (height - yPadding * 2) / yMax);
    var chartOffset = barWidth / 2;
    var xOffset = barWidth * 1.5 * i;
    var d = 'M ' + (chartOffset + xOffset) + ' ' + (height - yPadding) + ' ' +
            'v' + (-barHeight) + ' ' +
            'h' + barWidth + ' ' + 'v' + barHeight + 'z' ;
    model.bars.push({ d: d });
    model.values.push({
      value: val,
      left: (chartOffset + xOffset) / width * 100,
      right: (100 - (chartOffset + xOffset + barWidth) / width * 100),
      yPosition: height - barHeight - 2 * yPadding
    });
  });

  // Build rules
  for (var i = 0; i <= yRulesLength; i++) {
    var step = i * 1 / yRulesLength;
    var innerHeight = height - yPadding * 2;
    model.rules.push({
      yPosition: innerHeight - step * innerHeight + yPadding,
      value: step * yMax
    });
  }

  html = template(model);

  return new Handlebars.SafeString(html).string;

};

