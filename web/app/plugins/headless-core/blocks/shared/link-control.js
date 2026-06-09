(function () {
  'use strict';

  function linkValueFromItem(item, urlKey) {
    var url = String((item && item[urlKey]) || '');
    var opensInNewTab = Boolean(item && (item.opensInNewTab || item.target === '_blank'));
    var value = { url: url, opensInNewTab: opensInNewTab };
    if (item && item.linkId) {
      value.id = item.linkId;
    }
    if (item && item.linkType) {
      value.type = item.linkType;
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

  function renderLinkControl(el, blockEditor, components, i18n, label, item, urlKey, onChange) {
    var LinkControl = blockEditor.LinkControl || blockEditor.__experimentalLinkControl;
    var TextControl = components.TextControl;
    var BaseControl = components.BaseControl;
    var __ = i18n.__;

    if (!LinkControl) {
      return el(TextControl, {
        label: label,
        value: String((item && item[urlKey]) || ''),
        onChange: function (v) {
          var patch = {};
          patch[urlKey] = String(v || '');
          onChange(patch);
        },
      });
    }

    return el(
      BaseControl,
      { label: label },
      el(LinkControl, {
        value: linkValueFromItem(item, urlKey),
        onChange: function (link) {
          onChange(patchFromLink(link, urlKey));
        },
        settings: [
          {
            id: 'opensInNewTab',
            title: __('Open in new tab', 'headless-core'),
          },
        ],
      })
    );
  }

  function renderLinkControlAttribute(el, blockEditor, components, i18n, label, attributes, urlKey, setAttributes) {
    return renderLinkControl(el, blockEditor, components, i18n, label, attributes, urlKey, function (patch) {
      setAttributes(patch);
    });
  }

  window.headlessCoreEditor = {
    linkValueFromItem: linkValueFromItem,
    patchFromLink: patchFromLink,
    renderLinkControl: renderLinkControl,
    renderLinkControlAttribute: renderLinkControlAttribute,
  };
})();
