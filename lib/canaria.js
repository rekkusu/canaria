/**
 * canaria
 * library loader
 * @author Rex <rex@rex.gs>
 */

var canaria = (function(d, undefined) {

  var libraryInfo = {};

  var canaria = {
    prefix: "lib",
    require: function(){
      var items, l,
          head = d.head ? d.head : d.getElementsByTagName("head")[0],
          callback = function() {};

      if (arguments[0] instanceof Array) {
        items = arguments[0];
        l = items.length;
        if (typeof arguments[1] === 'function') {
          callback = arguments[1];
        }
      }else{
        if (typeof arguments[arguments.length-1] === 'function') {
          callback = arguments[arguments.length-1];
          items = Array.prototype.slice.call(arguments, 0, -1);
          l = items.length - 1;
        } else {
          items = Array.prototype.slice.call(arguments);
          l = items.length;
        }
      }



      var loadingFlag = {},
          loaded = onLoad(loadingFlag, callback, this);

      var removed = 0, loading = 0;

      for (var i = 0; i < l; i++) {
        var info = libraryInfo[items[i]];
        if (info === undefined) continue;
        if (info.state === 'loaded'){
          delete items[i];
          removed += 1;
          if (l === removed) {
            callback();
          }
        } else if (info.state === 'loading') {
          var cb = info.callback;
          info.callback = function() {
            cb();
            loaded(items[i]);
          };
          delete items[i];
          loading += 1;
        }
      }
      l -= removed + loading;

      var self = this;
      items.forEach(function(item) {
        var plug = item.split("."),
            script = d.createElement("script");
        libraryInfo[item] = {
          state: 'loading',
          callback: loaded(item)
        };
        loadingFlag[item] = false;
        script.src = self.prefix + "/" + plug.join("/") + ".js";
        script.type = 'text/javascript';
        script.onload = script.onreadystate = libraryInfo[item].callback;
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

  function onLoad(list, callback, canaria) {
    return function (namespace) {
      return function () {
        if (list[namespace] === false) {
          list[namespace] = true;
          libraryInfo[namespace].state = 'loaded';

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

  return canaria;
})(document);
