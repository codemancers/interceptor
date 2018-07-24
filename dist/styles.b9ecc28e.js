// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"node_modules/parcel-bundler/src/builtins/bundle-url.js":[function(require,module,exports) {
var bundleURL = null;
function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }

  return bundleURL;
}

function getBundleURL() {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error();
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp):\/\/[^)\n]+/g);
    if (matches) {
      return getBaseURL(matches[0]);
    }
  }

  return '/';
}

function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp):\/\/.+)\/[^/]+$/, '$1') + '/';
}

exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
},{}],"node_modules/parcel-bundler/src/builtins/css-loader.js":[function(require,module,exports) {
var bundle = require('./bundle-url');

function updateLink(link) {
  var newLink = link.cloneNode();
  newLink.onload = function () {
    link.remove();
  };
  newLink.href = link.href.split('?')[0] + '?' + Date.now();
  link.parentNode.insertBefore(newLink, link.nextSibling);
}

var cssTimeout = null;
function reloadCSS() {
  if (cssTimeout) {
    return;
  }

  cssTimeout = setTimeout(function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');
    for (var i = 0; i < links.length; i++) {
      if (bundle.getBaseURL(links[i].href) === bundle.getBundleURL()) {
        updateLink(links[i]);
      }
    }

    cssTimeout = null;
  }, 50);
}

module.exports = reloadCSS;
},{"./bundle-url":"node_modules/parcel-bundler/src/builtins/bundle-url.js"}],"node_modules/typeface-barlow/index.css":[function(require,module,exports) {

        var reloadCSS = require('_css_loader');
        module.hot.dispose(reloadCSS);
        module.hot.accept(reloadCSS);
      
},{"./files/barlow-latin-100.woff2":[["barlow-latin-100.257701bc.woff2","node_modules/typeface-barlow/files/barlow-latin-100.woff2"],"node_modules/typeface-barlow/files/barlow-latin-100.woff2"],"./files/barlow-latin-100.woff":[["barlow-latin-100.dde82a17.woff","node_modules/typeface-barlow/files/barlow-latin-100.woff"],"node_modules/typeface-barlow/files/barlow-latin-100.woff"],"./files/barlow-latin-100italic.woff2":[["barlow-latin-100italic.37a18f91.woff2","node_modules/typeface-barlow/files/barlow-latin-100italic.woff2"],"node_modules/typeface-barlow/files/barlow-latin-100italic.woff2"],"./files/barlow-latin-100italic.woff":[["barlow-latin-100italic.b7009d7f.woff","node_modules/typeface-barlow/files/barlow-latin-100italic.woff"],"node_modules/typeface-barlow/files/barlow-latin-100italic.woff"],"./files/barlow-latin-200.woff2":[["barlow-latin-200.649efd44.woff2","node_modules/typeface-barlow/files/barlow-latin-200.woff2"],"node_modules/typeface-barlow/files/barlow-latin-200.woff2"],"./files/barlow-latin-200.woff":[["barlow-latin-200.8b4a3bce.woff","node_modules/typeface-barlow/files/barlow-latin-200.woff"],"node_modules/typeface-barlow/files/barlow-latin-200.woff"],"./files/barlow-latin-200italic.woff2":[["barlow-latin-200italic.e7932fcb.woff2","node_modules/typeface-barlow/files/barlow-latin-200italic.woff2"],"node_modules/typeface-barlow/files/barlow-latin-200italic.woff2"],"./files/barlow-latin-200italic.woff":[["barlow-latin-200italic.b4279134.woff","node_modules/typeface-barlow/files/barlow-latin-200italic.woff"],"node_modules/typeface-barlow/files/barlow-latin-200italic.woff"],"./files/barlow-latin-300.woff2":[["barlow-latin-300.aa1b9feb.woff2","node_modules/typeface-barlow/files/barlow-latin-300.woff2"],"node_modules/typeface-barlow/files/barlow-latin-300.woff2"],"./files/barlow-latin-300.woff":[["barlow-latin-300.023655fa.woff","node_modules/typeface-barlow/files/barlow-latin-300.woff"],"node_modules/typeface-barlow/files/barlow-latin-300.woff"],"./files/barlow-latin-300italic.woff2":[["barlow-latin-300italic.2eb737d2.woff2","node_modules/typeface-barlow/files/barlow-latin-300italic.woff2"],"node_modules/typeface-barlow/files/barlow-latin-300italic.woff2"],"./files/barlow-latin-300italic.woff":[["barlow-latin-300italic.384e2d7c.woff","node_modules/typeface-barlow/files/barlow-latin-300italic.woff"],"node_modules/typeface-barlow/files/barlow-latin-300italic.woff"],"./files/barlow-latin-400.woff2":[["barlow-latin-400.b5d27009.woff2","node_modules/typeface-barlow/files/barlow-latin-400.woff2"],"node_modules/typeface-barlow/files/barlow-latin-400.woff2"],"./files/barlow-latin-400.woff":[["barlow-latin-400.055eca55.woff","node_modules/typeface-barlow/files/barlow-latin-400.woff"],"node_modules/typeface-barlow/files/barlow-latin-400.woff"],"./files/barlow-latin-400italic.woff2":[["barlow-latin-400italic.81f169ec.woff2","node_modules/typeface-barlow/files/barlow-latin-400italic.woff2"],"node_modules/typeface-barlow/files/barlow-latin-400italic.woff2"],"./files/barlow-latin-400italic.woff":[["barlow-latin-400italic.f9d089b0.woff","node_modules/typeface-barlow/files/barlow-latin-400italic.woff"],"node_modules/typeface-barlow/files/barlow-latin-400italic.woff"],"./files/barlow-latin-500.woff2":[["barlow-latin-500.76bb96d1.woff2","node_modules/typeface-barlow/files/barlow-latin-500.woff2"],"node_modules/typeface-barlow/files/barlow-latin-500.woff2"],"./files/barlow-latin-500.woff":[["barlow-latin-500.80f460bf.woff","node_modules/typeface-barlow/files/barlow-latin-500.woff"],"node_modules/typeface-barlow/files/barlow-latin-500.woff"],"./files/barlow-latin-500italic.woff2":[["barlow-latin-500italic.e35faf76.woff2","node_modules/typeface-barlow/files/barlow-latin-500italic.woff2"],"node_modules/typeface-barlow/files/barlow-latin-500italic.woff2"],"./files/barlow-latin-500italic.woff":[["barlow-latin-500italic.e867d525.woff","node_modules/typeface-barlow/files/barlow-latin-500italic.woff"],"node_modules/typeface-barlow/files/barlow-latin-500italic.woff"],"./files/barlow-latin-600.woff2":[["barlow-latin-600.6ea6f122.woff2","node_modules/typeface-barlow/files/barlow-latin-600.woff2"],"node_modules/typeface-barlow/files/barlow-latin-600.woff2"],"./files/barlow-latin-600.woff":[["barlow-latin-600.77368f19.woff","node_modules/typeface-barlow/files/barlow-latin-600.woff"],"node_modules/typeface-barlow/files/barlow-latin-600.woff"],"./files/barlow-latin-600italic.woff2":[["barlow-latin-600italic.29868e9d.woff2","node_modules/typeface-barlow/files/barlow-latin-600italic.woff2"],"node_modules/typeface-barlow/files/barlow-latin-600italic.woff2"],"./files/barlow-latin-600italic.woff":[["barlow-latin-600italic.aa290485.woff","node_modules/typeface-barlow/files/barlow-latin-600italic.woff"],"node_modules/typeface-barlow/files/barlow-latin-600italic.woff"],"./files/barlow-latin-700.woff2":[["barlow-latin-700.42dfef3b.woff2","node_modules/typeface-barlow/files/barlow-latin-700.woff2"],"node_modules/typeface-barlow/files/barlow-latin-700.woff2"],"./files/barlow-latin-700.woff":[["barlow-latin-700.063b0b63.woff","node_modules/typeface-barlow/files/barlow-latin-700.woff"],"node_modules/typeface-barlow/files/barlow-latin-700.woff"],"./files/barlow-latin-700italic.woff2":[["barlow-latin-700italic.fa81cee7.woff2","node_modules/typeface-barlow/files/barlow-latin-700italic.woff2"],"node_modules/typeface-barlow/files/barlow-latin-700italic.woff2"],"./files/barlow-latin-700italic.woff":[["barlow-latin-700italic.e9a89291.woff","node_modules/typeface-barlow/files/barlow-latin-700italic.woff"],"node_modules/typeface-barlow/files/barlow-latin-700italic.woff"],"./files/barlow-latin-800.woff2":[["barlow-latin-800.dd4bf0d6.woff2","node_modules/typeface-barlow/files/barlow-latin-800.woff2"],"node_modules/typeface-barlow/files/barlow-latin-800.woff2"],"./files/barlow-latin-800.woff":[["barlow-latin-800.7460b249.woff","node_modules/typeface-barlow/files/barlow-latin-800.woff"],"node_modules/typeface-barlow/files/barlow-latin-800.woff"],"./files/barlow-latin-800italic.woff2":[["barlow-latin-800italic.95786f5e.woff2","node_modules/typeface-barlow/files/barlow-latin-800italic.woff2"],"node_modules/typeface-barlow/files/barlow-latin-800italic.woff2"],"./files/barlow-latin-800italic.woff":[["barlow-latin-800italic.4791c99b.woff","node_modules/typeface-barlow/files/barlow-latin-800italic.woff"],"node_modules/typeface-barlow/files/barlow-latin-800italic.woff"],"./files/barlow-latin-900.woff2":[["barlow-latin-900.c9689094.woff2","node_modules/typeface-barlow/files/barlow-latin-900.woff2"],"node_modules/typeface-barlow/files/barlow-latin-900.woff2"],"./files/barlow-latin-900.woff":[["barlow-latin-900.f6923857.woff","node_modules/typeface-barlow/files/barlow-latin-900.woff"],"node_modules/typeface-barlow/files/barlow-latin-900.woff"],"./files/barlow-latin-900italic.woff2":[["barlow-latin-900italic.4e14e6db.woff2","node_modules/typeface-barlow/files/barlow-latin-900italic.woff2"],"node_modules/typeface-barlow/files/barlow-latin-900italic.woff2"],"./files/barlow-latin-900italic.woff":[["barlow-latin-900italic.b6ac5991.woff","node_modules/typeface-barlow/files/barlow-latin-900italic.woff"],"node_modules/typeface-barlow/files/barlow-latin-900italic.woff"],"_css_loader":"node_modules/parcel-bundler/src/builtins/css-loader.js"}],"node_modules/typeface-karla/index.css":[function(require,module,exports) {

        var reloadCSS = require('_css_loader');
        module.hot.dispose(reloadCSS);
        module.hot.accept(reloadCSS);
      
},{"./files/karla-latin-400.woff2":[["karla-latin-400.3664da6d.woff2","node_modules/typeface-karla/files/karla-latin-400.woff2"],"node_modules/typeface-karla/files/karla-latin-400.woff2"],"./files/karla-latin-400.woff":[["karla-latin-400.2cec39fe.woff","node_modules/typeface-karla/files/karla-latin-400.woff"],"node_modules/typeface-karla/files/karla-latin-400.woff"],"./files/karla-latin-400italic.woff2":[["karla-latin-400italic.8b3eda8f.woff2","node_modules/typeface-karla/files/karla-latin-400italic.woff2"],"node_modules/typeface-karla/files/karla-latin-400italic.woff2"],"./files/karla-latin-400italic.woff":[["karla-latin-400italic.039f83ed.woff","node_modules/typeface-karla/files/karla-latin-400italic.woff"],"node_modules/typeface-karla/files/karla-latin-400italic.woff"],"./files/karla-latin-700.woff2":[["karla-latin-700.3372afdd.woff2","node_modules/typeface-karla/files/karla-latin-700.woff2"],"node_modules/typeface-karla/files/karla-latin-700.woff2"],"./files/karla-latin-700.woff":[["karla-latin-700.57eb9172.woff","node_modules/typeface-karla/files/karla-latin-700.woff"],"node_modules/typeface-karla/files/karla-latin-700.woff"],"./files/karla-latin-700italic.woff2":[["karla-latin-700italic.17f578ac.woff2","node_modules/typeface-karla/files/karla-latin-700italic.woff2"],"node_modules/typeface-karla/files/karla-latin-700italic.woff2"],"./files/karla-latin-700italic.woff":[["karla-latin-700italic.41c11560.woff","node_modules/typeface-karla/files/karla-latin-700italic.woff"],"node_modules/typeface-karla/files/karla-latin-700italic.woff"],"_css_loader":"node_modules/parcel-bundler/src/builtins/css-loader.js"}],"node_modules/bootstrap/dist/css/bootstrap-reboot.min.css":[function(require,module,exports) {

var reloadCSS = require('_css_loader');
module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"node_modules/parcel-bundler/src/builtins/css-loader.js"}],"node_modules/bootstrap/dist/css/bootstrap-grid.min.css":[function(require,module,exports) {

var reloadCSS = require('_css_loader');
module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"node_modules/parcel-bundler/src/builtins/css-loader.js"}],"src/styles/index.css":[function(require,module,exports) {

var reloadCSS = require('_css_loader');
module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"typeface-barlow":"node_modules/typeface-barlow/index.css","typeface-karla":"node_modules/typeface-karla/index.css","bootstrap/dist/css/bootstrap-reboot.min.css":"node_modules/bootstrap/dist/css/bootstrap-reboot.min.css","bootstrap/dist/css/bootstrap-grid.min.css":"node_modules/bootstrap/dist/css/bootstrap-grid.min.css","_css_loader":"node_modules/parcel-bundler/src/builtins/css-loader.js"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';

var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };

  module.bundle.hotData = null;
}

module.bundle.Module = Module;

var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = '' || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + '62599' + '/');
  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();

      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });

      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');

      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);

      removeErrorOverlay();

      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;

  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';

  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);

  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js"], null)