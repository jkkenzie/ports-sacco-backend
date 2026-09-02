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
        onChange(patchFromUrlInput(String(v || ''), null, urlKey, item));
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

    // Optional: always-editable search field (no LinkControl preview chrome).
    if (opts.preferUrlSearch) {
      return renderUrlSearchInput(el, blockEditor, components, i18n, label, item, urlKey, onChange, options);
    }

    var linkValue = linkValueFromItem(item, urlKey);
    var linkId = item && item.linkId ? Number(item.linkId) : 0;
    var controlKey = String(opts.instanceKey || urlKey) + '-link-' + String(linkId || 'x');

    return el(
      'div',
      { className: 'headless-link-control-wrap' },
      el(BaseControl, { label: label },
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
      )
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
    if (post && urlFromPost(post)) {
      return splitUrlHash(urlFromPost(post)).base;
    }
    return '';
  }

  function patchFromUrlInput(nextUrl, post, urlKey, prevItem) {
    var url = String(nextUrl || '').trim();
    var patch = {
      opensInNewTab: false,
      target: '',
      linkId: 0,
      linkType: '',
    };

    if (post && typeof post === 'object') {
      patch.linkId = post.id ? Number(post.id) : 0;
      patch.linkType = post.type ? String(post.type) : '';
    } else if (url && prevItem && typeof prevItem === 'object') {
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

  function slugifySectionId(input) {
    return String(input || '')
      .toLowerCase()
      .trim()
      .replace(/['"]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  function stripHtml(text) {
    return String(text || '')
      .replace(/<[^>]+>/g, '')
      .replace(/\uFFF9|\uFFFA|\uFFFB/g, '')
      .trim();
  }

  /**
   * Build SelectControl options from Gutenberg blocks on the current page.
   * @param {Array} blocks
   * @param {(key: string, fallback?: string) => string} [translate]
   * @returns {Array<{ label: string, value: string }>}
   */
  function collectSectionAnchorOptions(blocks, translate) {
    var __ = typeof translate === 'function' ? translate : function (key, fallback) {
      return fallback || key;
    };
    var seen = {};
    var options = [
      {
        label: __('— No section —', 'headless-core'),
        value: '',
      },
    ];

    function pushOption(id, label) {
      var clean = String(id || '').replace(/^#/, '').trim();
      if (!clean || seen[clean]) {
        return;
      }
      seen[clean] = true;
      var display = String(label || clean).trim();
      options.push({
        label: display === clean ? '#' + clean : display + ' (#' + clean + ')',
        value: '#' + clean,
      });
    }

    var SECTION_BLOCKS = {
      'custom/membership-content': true,
      'custom/asset-finance-whatever': true,
      'custom/asset-finance-faq': true,
      'custom/asset-finance-apply': true,
      'custom/download-app': true,
      'custom/contact-map': true,
      'custom/faq-section': true,
      'custom/events-section': true,
      'custom/mobile-app-section': true,
      'custom/home-about': true,
      'custom/home-stats': true,
      'custom/help-section': true,
      'custom/home-product-cards': true,
      'custom/product-services': true,
      'custom/member-reviews': true,
      'custom/newsletter-section': true,
      'custom/partners-carousel': true,
      'custom/team-display': true,
      'custom/new-member-registration': true,
      'core/heading': true,
    };

    function walk(list) {
      if (!Array.isArray(list)) {
        return;
      }
      list.forEach(function (block) {
        if (!block || typeof block !== 'object') {
          return;
        }
        var a = block.attributes || {};
        var name = String(block.name || '');
        var heading = stripHtml(a.heading || a.title || a.badgeText || a.content || '');
        if (name === 'core/heading' && heading) {
          heading = heading.replace(/<[^>]+>/g, '').trim();
        }
        var anchor = String(a.anchor || '').trim();
        var sectionId = String(a.sectionId || '').trim();

        if (name === 'custom/savings-why-save') {
          var whySaveId = anchor || sectionId || slugifySectionId(heading);
          if (whySaveId) {
            pushOption(whySaveId, heading || whySaveId);
          }
          var whySaveItems = Array.isArray(a.items) ? a.items : [];
          whySaveItems.forEach(function (item) {
            if (!item || typeof item !== 'object') {
              return;
            }
            var pointHeading = stripHtml(item.heading || item.label || item.title || '');
            var pointAnchor = String(item.anchor || '').trim();
            var pointId = pointAnchor || slugifySectionId(pointHeading);
            if (pointId) {
              pushOption(pointId, pointHeading || pointId);
            }
          });
        } else if (SECTION_BLOCKS[name]) {
          var id = anchor || sectionId || slugifySectionId(heading);
          if (id) {
            pushOption(id, heading || anchor || sectionId || id);
          }
        } else if (sectionId) {
          pushOption(sectionId, heading || sectionId);
        } else if (anchor) {
          pushOption(anchor, heading || anchor);
        }

        if (Array.isArray(block.innerBlocks) && block.innerBlocks.length) {
          walk(block.innerBlocks);
        }
      });
    }

    walk(blocks);
    return options;
  }

  function normalizeSectionAnchorOptions(rawOptions, currentHash, translate) {
    var __ = typeof translate === 'function' ? translate : function (key, fallback) {
      return fallback || key;
    };
    var options = Array.isArray(rawOptions) && rawOptions.length
      ? rawOptions.slice()
      : [{ label: __('— No section —', 'headless-core'), value: '' }];

    var current = String(currentHash || '').replace(/^#/, '').trim();
    if (!current) {
      return options;
    }

    var currentValue = '#' + current;
    var exists = options.some(function (opt) {
      return String(opt && opt.value ? opt.value : '') === currentValue;
    });
    if (!exists) {
      options.push({
        label: '#' + current + ' (' + __('custom', 'headless-core') + ')',
        value: currentValue,
      });
    }
    return options;
  }

  function dedupeLinkSuggestions(list) {
    if (!Array.isArray(list)) {
      return list;
    }
    var seen = {};
    return list.filter(function (entry) {
      if (!entry || typeof entry !== 'object') {
        return false;
      }
      var id = entry.id != null ? String(entry.type || entry.kind || '') + ':' + String(entry.id) : '';
      var urlKey = String(entry.url || entry.link || '').replace(/\/+$/, '').toLowerCase();
      var key = id || ('url:' + urlKey);
      if (!key || key === 'url:' || seen[key]) {
        return false;
      }
      seen[key] = true;
      return true;
    });
  }

  function createDedupedLinkFetch(blockEditor) {
    var baseFetch =
      (blockEditor && blockEditor.__experimentalFetchLinkSuggestions) ||
      (typeof wp !== 'undefined' && wp.blockEditor && wp.blockEditor.__experimentalFetchLinkSuggestions);
    if (typeof baseFetch !== 'function') {
      return undefined;
    }
    return function () {
      var result = baseFetch.apply(this, arguments);
      if (result && typeof result.then === 'function') {
        return result.then(dedupeLinkSuggestions);
      }
      return Promise.resolve(dedupeLinkSuggestions(result));
    };
  }

  function renderHashAnchorControl(el, components, i18n, parts, opts, emitUrl, item, urlKey) {
    var SelectControl = components.SelectControl;
    var TextControl = components.TextControl;
    var __ = i18n.__;
    var rawOptions = opts.sectionAnchorOptions;
    var hasDropdown = Array.isArray(rawOptions) && rawOptions.length > 1;
    var currentValue = parts.hash ? '#' + String(parts.hash).replace(/^#/, '') : '';

    if (hasDropdown && SelectControl) {
      return el(SelectControl, {
        key: String(opts.instanceKey || 'url-field') + '-hash',
        className: 'headless-url-hash-control',
        label: __('Section anchor (optional)', 'headless-core'),
        value: currentValue,
        options: normalizeSectionAnchorOptions(rawOptions, parts.hash, __),
        help: __('Choose a section on this page to scroll to when the link is clicked.', 'headless-core'),
        onChange: function (hash) {
          emitUrl(parts.base, String(hash || '').replace(/^#/, ''), null);
        },
        __nextHasNoMarginBottom: true,
      });
    }

    return el(TextControl, {
      key: String(opts.instanceKey || 'url-field') + '-hash',
      className: 'headless-url-hash-control',
      label: __('Section anchor (optional)', 'headless-core'),
      value: parts.hash,
      placeholder: __('e.g. individual', 'headless-core'),
      help: opts.defaultBaseUrl
        ? __('Jump to a section on the selected page, or on this page if no link is set. Type the anchor id without #.', 'headless-core')
        : __('Jump to a section on the page. Type the anchor id without #.', 'headless-core'),
      onChange: function (hash) {
        emitUrl(parts.base, hash, null);
      },
      __nextHasNoMarginBottom: true,
    });
  }

  /**
   * Menu-style URL field: type to search pages/posts or paste a URL (uses core URLInput).
   * @param {object} [options]
   * @param {string} [options.instanceKey] Unique React key when rendering multiple fields in one block.
   */
  function renderUrlSearchInput(el, blockEditor, components, i18n, label, item, urlKey, onChange, options) {
    var URLInput = blockEditor.URLInput || blockEditor.__experimentalURLInput;
    var TextControl = components.TextControl;
    var BaseControl = components.BaseControl;
    var __ = i18n.__;
    var opts = options && typeof options === 'object' ? options : {};
    var instanceKey = String(opts.instanceKey || urlKey || 'url-field');
    var showHash = Boolean(opts.showHashFragment);
    var currentUrl = readUrlFromItem(item, urlKey);
    var parts = splitUrlHash(currentUrl);
    var dedupedLinkFetch = createDedupedLinkFetch(blockEditor);
    var urlInputKey = instanceKey + '-link-' + String(item && item.linkId ? item.linkId : 0) + '-' + (parts.base ? 'set' : 'empty');

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
      el(
        BaseControl,
        { key: instanceKey + '-url', label: label },
        el(URLInput, {
          key: urlInputKey,
          className: 'headless-url-search-control',
          value: showHash ? parts.base : currentUrl,
          isFullWidth: true,
          placeholder: __('Search or paste URL…', 'headless-core'),
          onChange: function (nextUrl, post) {
            var url = typeof nextUrl === 'string' ? nextUrl : coerceUrl(nextUrl);
            if (!String(url || '').trim() && !post) {
              onChange(patchFromUrlInput('', null, urlKey, item));
              return;
            }
            if (showHash) {
              var split = splitUrlHash(url);
              emitUrl(split.base, split.hash || parts.hash, post);
              return;
            }
            var selected = post && typeof post === 'object' ? post : null;
            onChange(patchFromUrlInput(url, selected, urlKey, item));
          },
          __experimentalFetchLinkSuggestions: dedupedLinkFetch,
          __experimentalShowInitialSuggestions: false,
          __experimentalHandleURLSuggestions: false,
          __nextHasNoMarginBottom: true,
        })
      ),
    ];

    if (showHash) {
      fields.push(renderHashAnchorControl(el, components, i18n, parts, opts, emitUrl, item, urlKey));
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
    }, { instanceKey: 'attr-' + String(urlKey || 'url') });
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
    slugifySectionId: slugifySectionId,
    collectSectionAnchorOptions: collectSectionAnchorOptions,
    renderLinkControl: renderLinkControl,
    renderUrlSearchInput: renderUrlSearchInput,
    renderLinkControlAttribute: renderLinkControlAttribute,
  };
})();
