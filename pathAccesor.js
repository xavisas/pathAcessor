
var cache = [];
return function createAccesor(accessPath) {
  if (!cache[accessPath]) {
    var keys = accessPath.replace(/[\],\[,\.]+/g, ".").split(".");
    if (keys[0] === "") {
      keys.shift();
    }
    if (keys[keys.length-1] === "") {
      keys.pop();
    }

    cache[accessPath] = keys;
  }
  var validKeys = cache[accessPath],
    ii = validKeys.length;

  var getter = function (model) {
    for (var i = 0; i < ii; i++) {
      if (!model) return undefined;
      model = model[validKeys[i]];
    }
    return model;
  };

  getter.setter = function (model, value) {
    for (var i = 0, iii = ii-1; i < iii; i++) {
      if (model[validKeys[i]] === undefined) {
        if (isNaN(validKeys[i + 1])) {
          model[validKeys[i]] = {};
        } else {
          model[validKeys[i]] = [];
        }
      }
      model = model[validKeys[i]];
    }
    if (typeof value === 'undefined') {
      if (Array.isArray(model)) {
        model.splice(validKeys[iii], 1);
      } else {
        if (model) delete model[validKeys[iii]];
      }
    } else {
       if (model) model[validKeys[iii]] = value;
    }

  };

  return getter;
};

export createAccesor;