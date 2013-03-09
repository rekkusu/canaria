/**
 * canaria
 * library loader
 * @author Rex <rex@rex.gs>
 */

var canaria = (function(d) {

  function onLoad(list, callback, canaria) {
    return function (namespace) {
      return function () {
        if (list[namespace] === false) {
          list[namespace] = true;

          var flag = true;
          for (var item in list){
            if (!list[item]) flag = false;
          };
          if (flag) {
            callback.call(canaria);
          }
        }
      }
    };
  }

  var canaria = {
    prefix: "lib",
    require: function(){
      var l = arguments.length,
          items = Array.prototype.slice.call(arguments),
          head = d.head ? d.head : d.getElementsByTagName("head")[0],
          callback = function() {};

      if (typeof arguments[l-1] === 'function') {
        callback = arguments[l-1];
        items = items.slice(0, -1);
        l -= 1;
      }

      var loadingFlag = {},
          loaded = onLoad(loadingFlag, callback, this);

      var self = this;
      items.forEach(function(item) {
        var plug = item.split("."),
            script = d.createElement("script");
        loadingFlag[item] = false;
        script.src = self.prefix + "/" + plug.join("/") + ".js";
        script.type = 'text/javascript';
        script.onload = script.onreadystate = loaded(item);
        head.appendChild(script);
      });
    },

    register: function(namespace, fn) {
      var ns = namespace.split('.'),
          module = ns.pop(),
          obj = this;

      ns.forEach(function(item) {
        obj[item] = {};
        obj = obj[item];
      });

      if(typeof fn === 'function') {
        obj[module] = fn();
      }
    }
  };

  return canaria;
})(document);
