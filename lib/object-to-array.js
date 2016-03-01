
module.exports = function(data, key) {
  if (!Array.isArray(data)) return false;

    var result = [];
    data.forEach(function(item, index) {
      result.push(item[key]);
    });

  return result;
};

