
module.exports = function(arr) {
  if (!Array.isArray(arr)) return false;
  var max = 0;
  arr.map(function(val) {
    if (val > max) {
      max = val;
    }
  });
  return max;
};

