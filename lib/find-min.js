
module.exports = function(arr) {
  if (!Array.isArray(arr)) return false;
  var min = 0;
  arr.map(function(val) {
    if (val < min) {
      min = val;
    }
  });
  return min;
};

