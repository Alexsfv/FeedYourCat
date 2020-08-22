//Polyfill Array.forEach method
if (!Array.prototype.forEach) {
    Array.prototype.forEach = function (callback, thisArg) {
      var T, k;
      if (this == null) {
        throw new TypeError(' this is null or not defined');
      }
      var O = Object(this);
      var len = O.length >>> 0;
      if (typeof callback !== 'function') {
          throw new TypeError(callback + ' is not a function');
      }
      if (arguments.length > 1) {
        T = thisArg;
      }
      k = 0;
      while (k < len) {
        var kValue;
        if (k in O) {
          kValue = O[k];
          callback.call(T, kValue, k, O);
        }
        k++;
      }
    };
}

// Polyfill NodeList.forEach method
if (typeof NodeList.prototype.forEach !== 'function')  {
    NodeList.prototype.forEach = Array.prototype.forEach;
}

// Polyfill Array.map method
if (Array.prototype.map === undefined) {
    Array.prototype.map = function(fn) {
      var rv = [];
      
      for(var i=0, l=this.length; i<l; i++)
        rv.push(fn(this[i]));
  
      return rv;
    };
}

// Polyfill dataset property
(function datasetModule(global, definition) {
    'use strict';
    var
        amd = 'amd',
        exports = 'exports';
    if (typeof define === 'function' && define[amd]) {
        define(function definer() {
            return definition(global);
        });
    } else if (typeof module === 'function' && module[exports]) {
        module[exports] = definition(global);
    } else {
        definition(global);
    }
}(this, function datasetPolyfill(global) {
    'use strict';
    var
        attribute,
        attributes,
        counter,
        dash,
        dataRegEx,
        document = global.document,
        hasEventListener,
        length,
        match,
        mutationSupport,
        test = document.createElement('_'),
        DOMAttrModified = 'DOMAttrModified';

    function clearDataset(event) {
        delete event.target._datasetCache;
    }
    function toCamelCase(string) {
        return string.replace(dash, function (m, letter) {
            return letter.toUpperCase();
        });
    }
    function getDataset() {
        var
            dataset = {};
        attributes = this.attributes;
        for (counter = 0, length = attributes.length; counter < length; counter += 1) {
            attribute = attributes[counter];
            match = attribute.name.match(dataRegEx);
            if (match) {
                dataset[toCamelCase(match[1])] = attribute.value;
            }
        }
        return dataset;
    }
    function mutation() {
        if (hasEventListener) {
            test.removeEventListener(DOMAttrModified, mutation, false);
        } else {
            test.detachEvent('on' + DOMAttrModified, mutation);
        }
        mutationSupport = true;
    }
    if (test.dataset !== undefined) {
        return;
    }
    dash = /\-([a-z])/ig;
    dataRegEx = /^data\-(.+)/;
    hasEventListener = !!document.addEventListener;
    mutationSupport = false;
    if (hasEventListener) {
        test.addEventListener(DOMAttrModified, mutation, false);
    } else {
        test.attachEvent('on' + DOMAttrModified, mutation);
    }
    test.setAttribute('foo', 'bar');
    Object.defineProperty(global.Element.prototype, 'dataset', {
        get: mutationSupport
            ? function get() {
                if (!this._datasetCache) {
                    this._datasetCache = getDataset.call(this);
                }

                return this._datasetCache;
            } : getDataset
    });
    if (mutationSupport && hasEventListener) {
        document.addEventListener(DOMAttrModified, clearDataset, false);
    }
}));