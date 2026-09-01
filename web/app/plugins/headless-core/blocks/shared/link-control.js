(function () {
  'use strict';

  function coerceUrl(raw) {
    if (raw == null) {
      return '';
    }
    if (typeof raw === 'string') {
      return raw.trim();
    }
    if (typeof raw === 'number' || typeof raw === 'boolean') {
      return String(raw).trim();
    }
    if (typeof raw === 'object' && typeof raw.url === 'string') {
      return raw.url.trim();
    }
    return '';
  }

  /** Read stored URL from item (href/url keys); treat "#" as unset for the link picker. */
  function readUrlFromItem(item, urlKey) {
    if (!item || typeof item !== 'object') {
      return '';
    }
    var primary = coerceUrl(item[urlKey]);
    if (primary !== '' && primary !== '#') {
      return primary;
    }
    if (urlKey === 'href') {
      var alt = coerceUrl(item.url);
      if (alt !== '' && alt !== '#') {
        return alt;
      }
    }
    if (urlKey === 'url') {
      var altHref = coerceUrl(item.href);
      if (altHref !== '' && altHref !== '#') {
        return altHref;
      }
    }
    return '';
  }

  function linkValueFromItem(item, urlKey) {
    var url = readUrlFromItem(item, urlKey);
    var opensInNewTab = Boolean(item && (item.opensInNewTab || item.target === '_blank'));
    if (url === '') {
      return undefined;
    }

    var value = { url: url, opensInNewTab: opensInNewTab };
    var linkId = item && item.linkId ? Number(item.linkId) : 0;
    if (linkId > 0) {
      value.id = linkId;
    }
    if (item && item.linkType) {
      value.type = String(item.linkType);
    } else if (!value.id) {
      value.type = 'custom';
    }
    return value;
  }

  function patchFromLink(link, urlKey) {
    if (!link || typeof link !== 'object') {
      var empty = { opensInNewTab: false, target: '', linkId: 0, linkType: '' };
      empty[urlKey] = '';
      return empty;
    }

    var url = String(link.url || '');
    var opensInNewTab = Boolean(link.opensInNewTab);
    var patch = {
      opensInNewTab: opensInNewTab,
      target: opensInNewTab ? '_blank' : '',
      linkId: link.id ? Number(link.id) : 0,
      linkType: link.type ? String(link.type) : '',
    };
    patch[urlKey] = url;
    if (urlKey === 'href') {
      patch.url = url;
    }
    if (urlKey === 'url') {
      patch.href = url;
    }
    return patch;
  }

  function renderTextUrlControl(el, TextControl, label, item, urlKey, onChange) {
    return el(TextControl, {
      label: label,
      value: readUrlFromItem(item, urlKey),
      onChange: function (v) {
        var patch = {};
        patch[urlKey] = String(v || '');
        if (urlKey === 'href') {
          patch.url = patch[urlKey];
        }
        if (urlKey === 'url') {
          patch.href = patch[urlKey];
        }
        onChange(patch);
      },
    });
  }

  function renderLinkControl(el, blockEditor, components, i18n, label, item, urlKey, onChange, options) {
    var LinkControl = blockEditor.LinkControl || blockEditor.__experimentalLinkControl;
    var TextControl = components.TextControl;
    var BaseControl = components.BaseControl;
    var __ = i18n.__;
    var opts = options && typeof options === 'object' ? options : {};

    if (opts.forceTextControl || !LinkControl) {
      return renderTextUrlControl(el, TextControl, label, item, urlKey, onChange);
    }

    var storedUrl = readUrlFromItem(item, urlKey);
    var linkValue = linkValueFromItem(item, urlKey);
    var controlKey = urlKey + ':' + String(storedUrl || 'new') + ':' + String((item && item.linkId) || 0);

    return el(
      BaseControl,
      { label: label },
      el(LinkControl, {
        key: controlKey,
        value: linkValue,
        onChange: function (link) {
          onChange(patchFromLink(link, urlKey));
        },
        settings: [
          {
            id: 'opensInNewTab',
            title: __('Open in new tab', 'headless-core'),
          },
        ],
        hasRichPreviews: false,
      })
    );
  }

  function splitUrlHash(url) {
    var raw = String(url || '').trim();
    if (!raw || raw === '#') {
      return { base: '', hash: '' };
    }
    var idx = raw.indexOf('#');
    if (idx === -1) {
      return { base: raw, hash: '' };
    }
    return { base: raw.slice(0, idx), hash: raw.slice(idx + 1) };
  }

  function pathnameFromUrl(url) {
    var raw = String(url || '').trim();
    if (!raw) {
      return '';
    }
    try {
      var parsed = new URL(raw, typeof window !== 'undefined' ? window.location.origin : 'http://localhost');
      var path = parsed.pathname || '/';
      if (path.length > 1 && path.charAt(path.length - 1) === '/') {
        path = path.slice(0, -1);
      }
      return path || '/';
    } catch (e) {
      if (raw.charAt(0) === '/') {
        var withoutHash = splitUrlHash(raw).base;
        if (withoutHash.length > 1 && withoutHash.charAt(withoutHash.length - 1) === '/') {
          return withoutHash.slice(0, -1);
        }
        return withoutHash || '/';
      }
      return '';
    }
  }

  function urlFromPost(post) {
    if (!post || typeof post !== 'object') {
      return '';
    }
    return coerceUrl(post.url || post.link || post.permalink || '');
  }

  function joinUrlHash(base, hash, defaultBase) {
    var b = String(base || '').trim();
    var h = String(hash || '').trim().replace(/^#+/, '');
    if (!b) {
      if (h) {
        var fallback = pathnameFromUrl(defaultBase);
        if (fallback) {
          return (fallback === '/' ? '/' : fallback) + '#' + h;
        }
        return '#' + h;
      }
      return '';
    }
    return h ? b + '#' + h : b;
  }

  function resolveLinkBase(base, post, item, urlKey, defaultBase) {
    var split = splitUrlHash(typeof base === 'string' ? base : coerceUrl(base));
    if (split.base) {
      return split.base;
    }
    var fromPost = urlFromPost(post);
    if (fromPost) {
      return splitUrlHash(fromPost).base;
    }
    var fromItem = splitUrlHash(readUrlFromItem(item, urlKey));
    if (fromItem.base) {
      return fromItem.base;
    }
    return pathnameFromUrl(defaultBase);
  }

  function patchFromUrlInput(nextUrl, post, urlKey, prevItem) {
    var patch = {
      opensInNewTab: false,
      target: '',
      linkId: post && post.id ? Number(post.id) : 0,
      linkType: post && post.type ? String(post.type) : 'custom',
    };
    if (!post && prevItem && typeof prevItem === 'object') {
      if (prevItem.linkId) {
        patch.linkId = Number(prevItem.linkId) || 0;
      }
      if (prevItem.linkType) {
        patch.linkType = String(prevItem.linkType);
      }
      patch.opensInNewTab = Boolean(prevItem.opensInNewTab || prevItem.target === '_blank');
      patch.target = patch.opensInNewTab ? '_blank' : String(prevItem.target || '');
    }
    patch[urlKey] = String(nextUrl || '');
    if (urlKey === 'href') {
      patch.url = patch[urlKey];
    }
    if (urlKey === 'url') {
      patch.href = patch[urlKey];
    }
    return patch;
  }

  function mergeLinkPatch(item, patch, urlKey) {
    var next = Object.assign({}, item || {}, patch || {});
    var url = String(next[urlKey] || '');
    if (urlKey === 'href') {
      next.url = url;
    }
    if (urlKey === 'url') {
      next.href = url;
    }
    return next;
  }

  /**
   * Menu-style URL field: type to search pages/posts or paste a URL (uses core URLInput).
   * @param {object} [options]
   * @param {string} [options.instanceKey] Unique React key when rendering multiple fields in one block.
   */
  function renderUrlSearchInput(el, blockEditor, components, i18n, label, item, urlKey, onChange, options) {
    var URLInput = blockEditor.URLInput || blockEditor.__experimentalURLInput;
    var TextControl = components.TextControl;
    var __ = i18n.__;
    var opts = options && typeof options === 'object' ? options : {};
    var instanceKey = String(opts.instanceKey || urlKey || 'url-field');
    var showHash = Boolean(opts.showHashFragment);
    var currentUrl = readUrlFromItem(item, urlKey);
    var parts = splitUrlHash(currentUrl);

    if (!URLInput) {
      return renderTextUrlControl(el, TextControl, label, item, urlKey, onChange);
    }

    function emitUrl(base, hash, post) {
      var nextHash = String(hash || '').trim().replace(/^#+/, '');
      var split = splitUrlHash(typeof base === 'string' ? base : coerceUrl(base));
      if (!nextHash && split.hash) {
        nextHash = split.hash;
      }
      var nextBase = resolveLinkBase(split.base, post, item, urlKey, opts.defaultBaseUrl);
      var full = joinUrlHash(nextBase, nextHash, opts.defaultBaseUrl);
      var selected = post && typeof post === 'object' ? post : null;
      onChange(patchFromUrlInput(full, selected, urlKey, item));
    }

    var fields = [
      el(URLInput, {
        key: instanceKey,
        className: 'headless-url-search-control',
        label: label,
        value: showHash ? parts.base : currentUrl,
        isFullWidth: true,
        placeholder: __('Search pages or paste URL…', 'headless-core'),
        onChange: function (nextUrl, post) {
          var url = typeof nextUrl === 'string' ? nextUrl : coerceUrl(nextUrl);
          if (showHash) {
            var split = splitUrlHash(url);
            emitUrl(split.base, split.hash || parts.hash, post);
            return;
          }
          var selected = post && typeof post === 'object' ? post : null;
          onChange(patchFromUrlInput(url, selected, urlKey, item));
        },
        __nextHasNoMarginBottom: true,
      }),
    ];

    if (showHash) {
      fields.push(
        el(TextControl, {
          key: instanceKey + '-hash',
          className: 'headless-url-hash-control',
          label: __('Section anchor (optional)', 'headless-core'),
          value: parts.hash,
          placeholder: __('e.g. individual', 'headless-core'),
          help: opts.defaultBaseUrl
            ? __('Jump to a section on the selected page, or on this page if no link is set. Type the anchor id without #.', 'headless-core')
            : __('Jump to a section on the page. Type the anchor id without #.', 'headless-core'),
          onChange: function (hash) {
            emitUrl(readUrlFromItem(item, urlKey), hash, null);
          },
          __nextHasNoMarginBottom: true,
        })
      );
    }

    return el(
      'div',
      { key: instanceKey + '-wrap', className: 'headless-url-search-wrap' },
      fields
    );
  }

  function renderLinkControlAttribute(el, blockEditor, components, i18n, label, attributes, urlKey, setAttributes) {
    return renderLinkControl(el, blockEditor, components, i18n, label, attributes, urlKey, function (patch) {
      setAttributes(patch);
    });
  }

  window.headlessCoreEditor = {
    coerceUrl: coerceUrl,
    readUrlFromItem: readUrlFromItem,
    linkValueFromItem: linkValueFromItem,
    patchFromLink: patchFromLink,
    patchFromUrlInput: patchFromUrlInput,
    splitUrlHash: splitUrlHash,
    joinUrlHash: joinUrlHash,
    pathnameFromUrl: pathnameFromUrl,
    mergeLinkPatch: mergeLinkPatch,
    renderLinkControl: renderLinkControl,
    renderUrlSearchInput: renderUrlSearchInput,
    renderLinkControlAttribute: renderLinkControlAttribute,
  };
})();
