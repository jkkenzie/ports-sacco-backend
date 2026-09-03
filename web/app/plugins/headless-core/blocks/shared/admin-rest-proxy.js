(function () {
  var apiFetch = window.wp && window.wp.apiFetch;
  var cfg = window.headlessCoreAdminRestProxy || {};
  var root = String(cfg.root || '');
  if (!apiFetch || !apiFetch.use || !root) {
    return;
  }

  function parseHref(href) {
    var a = document.createElement('a');
    a.href = href;
    return a;
  }

  function restPathFromUrl(href) {
    var parsed = parseHref(href);
    var path = String(parsed.pathname || '');
    var search = String(parsed.search || '');
    var marker = '/wp-json/';
    var idx = path.indexOf(marker);
    if (idx !== -1) {
      return path.slice(idx + marker.length) + search;
    }
    marker = '/hc-wp-api.php/';
    idx = path.indexOf(marker);
    if (idx !== -1) {
      return path.slice(idx + marker.length) + search;
    }
    return '';
  }

  function toProxyUrl(pathAndQuery) {
    var raw = String(pathAndQuery || '').replace(/^\//, '');
    if (raw.indexOf('wp-json/') === 0) {
      raw = raw.slice('wp-json/'.length);
    }
    var route = raw;
    var extra = '';
    var q = raw.indexOf('?');
    if (q !== -1) {
      route = raw.slice(0, q);
      extra = raw.slice(q + 1);
    }
    route = '/' + route.replace(/^\/+/, '');
    var url = root;
    if (/[?&]rest_route=\/?$/.test(url)) {
      url = url.replace(/rest_route=\/?$/, 'rest_route=' + route);
    } else {
      url = url.replace(/\/?$/, '/') + route.replace(/^\//, '');
    }
    if (extra) {
      url += (url.indexOf('?') === -1 ? '?' : '&') + extra;
    }
    return url.replace(/([?&]rest_route=\/[^?#]*)\?/, '$1&');
  }

  function shouldRewrite(url) {
    if (!url) {
      return false;
    }
    if (url.indexOf('/wp-json/') !== -1) {
      return true;
    }
    if (url.indexOf('/hc-wp-api.php/') !== -1) {
      return true;
    }
    if (url.indexOf('rest_route=/') !== -1 && url.indexOf('rest_route=/') < url.lastIndexOf('?')) {
      return /[?&]rest_route=\/[^?#]*\?/.test(url);
    }
    return false;
  }

  apiFetch.use(function (options, next) {
    var nextOptions = options;
    var path = options.path;
    var url = options.url;

    if (typeof path === 'string' && path !== '') {
      nextOptions = Object.assign({}, options, {
        url: toProxyUrl(path),
        path: undefined,
      });
    } else if (typeof url === 'string' && shouldRewrite(url)) {
      var extracted = restPathFromUrl(url);
      nextOptions = Object.assign({}, options, {
        url: extracted ? toProxyUrl(extracted) : url.replace(/([?&]rest_route=\/[^?#]*)\?/, '$1&'),
        path: undefined,
      });
    }

    var method = String((nextOptions.method || 'GET')).toUpperCase();
    if (cfg.forcePost === true && ['PUT', 'PATCH', 'DELETE'].indexOf(method) !== -1) {
      var headers = Object.assign({}, nextOptions.headers || {});
      headers['X-HTTP-Method-Override'] = method;
      nextOptions = Object.assign({}, nextOptions, {
        method: 'POST',
        headers: headers,
      });
    }

    return next(nextOptions);
  });
})();
