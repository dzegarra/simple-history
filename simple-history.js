/*!
 * Simple History v0.5.0
 *
 * Copyright 2011, Jörn Zaefferer
 * Dual licensed under the MIT or GPL Version 2 licenses.
 */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
            global.simplehistory = factory()
}(this, function () { 'use strict';

    var initial = location.href;
    var matcher  = function() {

    };

    var supported = !!(window.history && window.history.pushState);

    var pushState = function(fragment, state) {
      state = state || {};
      history.pushState(state, null, fragment);
      notify(state);
    };

    var replaceState = function(fragment, state) {
      state = state || {};
      history.replaceState(state, null, fragment);
    };

    var readQuery = function() {
        return location.search;
    };

    var queryToObject = function() {
        var obj = {}, i, p, parts, query = readQuery();
        if (query!='') {
            i = query.indexOf('?');
            query = (i==-1) ? '' : query.substr(i+1);
            parts = query.split('&');
            for (i in parts) {
                p = parts[i].split('=');
                obj[p[0]] = decodeURIComponent(p[1]) || '';
            }
        }
        return obj;
    };

    var objectToQuery = function(obj) {
        return Object.keys(obj).reduce(function(a, k){
            a.push(k+'='+encodeURIComponent(obj[k]));
            return a
        },[]).join('&');
    };

    var setQueryParam = function(name, value) {
        var params = queryToObject();
        params[name] = value;
        this.pushState('?'+objectToQuery(params), params);
    };

    var getQueryParam = function(name) {
        var params = queryToObject()
        return params[name] ? params[name] : '';
    };

    var notify = function(state) {
      matcher(location.pathname + location.search, state);
    };

    var start = function(matcher) {
      matcher = matcher;
      window.addEventListener("popstate", function(event) {
        // workaround to always ignore first popstate event (Chrome)
        // a timeout isn't reliable enough
        if (initial && initial === location.href) {
          initial = null;
          return;
        }
        notify(event.state || {});
      }, false);
    }

    //Métodos y propiedades públicas
    return {
        supported: supported,
        pushState: pushState,
        replaceState: replaceState,
        readQuery: readQuery,
        queryToObject: queryToObject,
        objectToQuery: objectToQuery,
        setQueryParam: setQueryParam,
        getQueryParam: getQueryParam,
        start: start
    };

}));
