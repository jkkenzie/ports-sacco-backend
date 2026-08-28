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

    // Prefer searchable URL input for custom paths (no post id). LinkControl's
    // preview mode often hides the pencil for relative/custom URLs, so they
    // become uneditable after a value is saved.
    var linkId = item && item.linkId ? Number(item.linkId) : 0;
    if (opts.preferUrlSearch || linkId <= 0) {
      return renderUrlSearchInput(el, blockEditor, components, i18n, label, item, urlKey, onChange, options);
    }

    var storedUrl = readUrlFromItem(item, urlKey);
    var linkValue = linkValueFromItem(item, urlKey);
    var controlKey = String(opts.instanceKey || urlKey) + '-link-' + String(linkId);

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

  function patchFromUrlInput(nextUrl, post, urlKey) {
    var patch = {
      opensInNewTab: false,
      target: '',
      linkId: post && post.id ? Number(post.id) : 0,
      linkType: post && post.type ? String(post.type) : 'custom',
    };
    patch[urlKey] = String(nextUrl || '');
    if (urlKey === 'href') {
      patch.url = patch[urlKey];
    }
    if (urlKey === 'url') {
      patch.href = patch[urlKey];
    }
    return patch;
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
    var currentUrl = readUrlFromItem(item, urlKey);

    if (!URLInput) {
      return renderTextUrlControl(el, TextControl, label, item, urlKey, onChange);
    }

    return el(
      'div',
      { key: instanceKey + '-wrap', className: 'headless-url-search-wrap' },
      el(BaseControl, { label: label },
        el(URLInput, {
          key: instanceKey,
          className: 'headless-url-search-control',
          value: currentUrl,
          isFullWidth: true,
          placeholder: __('Search or paste URL…', 'headless-core'),
          onChange: function (nextUrl, post) {
            var url = typeof nextUrl === 'string' ? nextUrl : coerceUrl(nextUrl);
            var selected = post && typeof post === 'object' ? post : null;
            onChange(patchFromUrlInput(url, selected, urlKey));
          },
          __nextHasNoMarginBottom: true,
        })
      )
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
    renderLinkControl: renderLinkControl,
    renderUrlSearchInput: renderUrlSearchInput,
    renderLinkControlAttribute: renderLinkControlAttribute,
  };
})();
