(function (blocks, blockEditor, components, data, element, i18n) {
  var el = element.createElement;
  var registerBlockType = blocks.registerBlockType;
  var useBlockProps = blockEditor.useBlockProps;
  var InspectorControls = blockEditor.InspectorControls;
  var RichText = blockEditor.RichText;
  var MediaUpload = blockEditor.MediaUpload;
  var MediaUploadCheck = blockEditor.MediaUploadCheck;
  var PanelBody = components.PanelBody;
  var Button = components.Button;
  var BaseControl = components.BaseControl;
  var ColorPalette = components.ColorPalette;
  var TextControl = components.TextControl;
  var TextareaControl = components.TextareaControl;
  var ToggleControl = components.ToggleControl;
  var useSelect = data.useSelect;
  var __ = i18n.__;
  var headlessLink = window.headlessCoreEditor || {};
  var trashSvg = el(
    'svg',
    { viewBox: '0 0 24 24', width: '16', height: '16', style: { display: 'block' }, fill: 'currentColor' },
    el('path', { d: 'M9 3h6l1 2h4v2H4V5h4l1-2zm0 6h2v12H9V9zm4 0h2v12h-2V9z' })
  );

  var ODD_BUTTON_COLORS = {
    textColor: '#22abb5',
    borderColor: '#22abb5',
    bgColor: '#ffffff',
    hoverTextColor: '#ffffff',
    hoverBgColor: '#22abb5',
    hoverBorderColor: '#22abb5',
  };
  var EVEN_BUTTON_COLORS = {
    textColor: '#ed6e2a',
    borderColor: '#ed6e2a',
    bgColor: '#ffffff',
    hoverTextColor: '#ffffff',
    hoverBgColor: '#ed6e2a',
    hoverBorderColor: '#ed6e2a',
  };
  var EMPTY_BUTTON = Object.assign({
    label: '',
    url: '',
    opensInNewTab: false,
    target: '',
    linkId: 0,
    linkType: '',
  }, ODD_BUTTON_COLORS);
  var EMPTY_MENU_ITEM = {
    label: '',
    href: '',
    opensInNewTab: false,
    target: '',
    linkId: 0,
    linkType: '',
  };
  var COLOR_CHOICES = ['#40c9bf', '#22abb5', '#ed6e2a', '#ffffff', '#000000', '#65605f', '#c8cee3', '#90D4D3'];

  var BANNER_POSITION_X_OPTIONS = [
    { label: __('Left', 'headless-core'), value: 'left' },
    { label: __('Center', 'headless-core'), value: 'center' },
    { label: __('Right', 'headless-core'), value: 'right' },
    { label: __('0%', 'headless-core'), value: '0%' },
    { label: __('25%', 'headless-core'), value: '25%' },
    { label: __('50%', 'headless-core'), value: '50%' },
    { label: __('75%', 'headless-core'), value: '75%' },
    { label: __('100%', 'headless-core'), value: '100%' },
  ];

  var BANNER_POSITION_Y_OPTIONS = [
    { label: __('Top', 'headless-core'), value: 'top' },
    { label: __('Center', 'headless-core'), value: 'center' },
    { label: __('Bottom', 'headless-core'), value: 'bottom' },
    { label: __('0%', 'headless-core'), value: '0%' },
    { label: __('25%', 'headless-core'), value: '25%' },
    { label: __('50%', 'headless-core'), value: '50%' },
    { label: __('75%', 'headless-core'), value: '75%' },
    { label: __('100%', 'headless-core'), value: '100%' },
  ];

  function bannerPositionValue(value, fallback) {
    var raw = String(value || '').trim();
    return raw !== '' ? raw : fallback;
  }

  function bannerPositionListId(label) {
    return 'banner-pos-' + String(label || 'field').replace(/[^a-z0-9]+/gi, '-').toLowerCase();
  }

  function renderBannerPositionControl(label, value, options, fallback, onChange) {
    var current = bannerPositionValue(value, fallback);
    var help = __('Choose a preset or type a custom CSS value (e.g. 20px, 15%).', 'headless-core');
    var listId = bannerPositionListId(label);

    return el(
      'div',
      null,
      el(TextControl, {
        label: label,
        value: current,
        list: listId,
        onChange: function (v) {
          onChange(bannerPositionValue(v, fallback));
        },
        help: help,
      }),
      el(
        'datalist',
        { id: listId },
        options.map(function (opt) {
          return el('option', { key: opt.value, value: opt.value }, opt.label);
        })
      )
    );
  }

  function mergeLinkPatch(item, patch, urlKey) {
    if (headlessLink.mergeLinkPatch) {
      return headlessLink.mergeLinkPatch(item, patch, urlKey);
    }
    var next = Object.assign({}, item || {});
    var src = patch && typeof patch === 'object' ? patch : {};
    Object.keys(src).forEach(function (key) {
      next[key] = src[key];
    });

    var url = '';
    if (Object.prototype.hasOwnProperty.call(src, urlKey)) {
      url = String(src[urlKey] == null ? '' : src[urlKey]);
    } else if (next[urlKey] != null) {
      url = String(next[urlKey]);
    }
    next[urlKey] = url;
    if (urlKey === 'href') {
      next.url = url;
    }
    if (urlKey === 'url') {
      next.href = url;
    }
    if (Object.prototype.hasOwnProperty.call(src, 'opensInNewTab')) {
      next.opensInNewTab = Boolean(src.opensInNewTab);
      next.target = next.opensInNewTab ? '_blank' : '';
    } else if (Object.prototype.hasOwnProperty.call(src, 'target')) {
      next.target = String(src.target || '');
      next.opensInNewTab = next.target === '_blank';
    }
    if (Object.prototype.hasOwnProperty.call(src, 'linkId')) {
      next.linkId = Number(src.linkId) || 0;
    }
    if (Object.prototype.hasOwnProperty.call(src, 'linkType')) {
      next.linkType = String(src.linkType || '');
    }
    return next;
  }

  function renderUrlField(label, item, urlKey, onChange, instanceKey, sectionAnchorOptions) {
    if (headlessLink.renderUrlSearchInput) {
      return headlessLink.renderUrlSearchInput(el, blockEditor, components, i18n, label, item, urlKey, onChange, {
        instanceKey: instanceKey || urlKey,
        showHashFragment: true,
        defaultBaseUrl: editorPagePath(),
        sectionAnchorOptions: sectionAnchorOptions,
      });
    }
    return el(TextControl, {
      label: label,
      value: String((item && item[urlKey]) || ''),
      placeholder: __('Search pages or paste URL…', 'headless-core'),
      onChange: function (v) {
        var patch = headlessLink.patchFromUrlInput
          ? headlessLink.patchFromUrlInput(String(v || ''), null, urlKey, item)
          : patchFromPlainUrl(v, urlKey);
        onChange(mergeLinkPatch(item, patch, urlKey));
      },
    });
  }

  function patchFromPlainUrl(value, urlKey) {
    var patch = {};
    patch[urlKey] = String(value || '');
    if (urlKey === 'href') {
      patch.url = patch[urlKey];
    }
    if (urlKey === 'url') {
      patch.href = patch[urlKey];
    }
    return patch;
  }

  function editorPagePath() {
    try {
      if (!window.wp || !wp.data) {
        return '';
      }
      var select = wp.data.select('core/editor');
      if (!select) {
        return '';
      }
      if (headlessLink.pathnameFromUrl && select.getPermalink) {
        var permalink = select.getPermalink();
        if (permalink) {
          return headlessLink.pathnameFromUrl(permalink);
        }
      }
      if (select.getCurrentPostId) {
        var postId = select.getCurrentPostId();
        var record = postId ? wp.data.select('core').getEntityRecord('postType', 'page', postId) : null;
        if (record && record.link && headlessLink.pathnameFromUrl) {
          return headlessLink.pathnameFromUrl(record.link);
        }
      }
    } catch (e) {
      return '';
    }
    return '';
  }

  function normalizeButtons(buttons) {
    if (!Array.isArray(buttons)) {
      return [];
    }
    return buttons.filter(function (btn) {
      return btn && typeof btn === 'object';
    }).map(function (btn, index) {
      var d = Object.assign({}, EMPTY_BUTTON, index % 2 === 0 ? ODD_BUTTON_COLORS : EVEN_BUTTON_COLORS);
      return Object.assign({}, d, {
        label: btn && btn.label != null ? String(btn.label) : d.label,
        url: btn && btn.url != null ? String(btn.url) : d.url,
        textColor: btn && btn.textColor ? String(btn.textColor) : d.textColor,
        borderColor: btn && btn.borderColor ? String(btn.borderColor) : d.borderColor,
        bgColor: btn && btn.bgColor ? String(btn.bgColor) : d.bgColor,
        hoverTextColor: btn && btn.hoverTextColor ? String(btn.hoverTextColor) : d.hoverTextColor,
        hoverBgColor: btn && btn.hoverBgColor ? String(btn.hoverBgColor) : d.hoverBgColor,
        hoverBorderColor: btn && btn.hoverBorderColor ? String(btn.hoverBorderColor) : d.hoverBorderColor,
        opensInNewTab: Boolean(btn && (btn.opensInNewTab || btn.target === '_blank')),
        target: btn && btn.target ? String(btn.target) : (btn && btn.opensInNewTab ? '_blank' : ''),
        linkId: btn && btn.linkId ? Number(btn.linkId) : 0,
        linkType: btn && btn.linkType ? String(btn.linkType) : '',
      });
    });
  }

  function normalizeMenuItems(items) {
    if (!Array.isArray(items)) {
      return [];
    }
    return items.filter(function (item) {
      return item && typeof item === 'object';
    }).map(function (item) {
      var href = item.href != null ? String(item.href) : (item.url != null ? String(item.url) : '');
      return {
        label: item.label != null ? String(item.label) : '',
        href: href,
        opensInNewTab: Boolean(item && (item.opensInNewTab || item.target === '_blank')),
        target: item && item.target ? String(item.target) : (item && item.opensInNewTab ? '_blank' : ''),
        linkId: item && item.linkId ? Number(item.linkId) : 0,
        linkType: item && item.linkType ? String(item.linkType) : '',
      };
    });
  }

  function colorPaletteChoices() {
    return COLOR_CHOICES.map(function (hex) { return { color: hex, name: hex }; });
  }

  function buttonColorsFromList(buttons, parity) {
    var defaults = parity === 0 ? ODD_BUTTON_COLORS : EVEN_BUTTON_COLORS;
    var match = null;
    for (var i = 0; i < buttons.length; i++) {
      if (i % 2 === parity) {
        match = buttons[i];
        break;
      }
    }
    if (!match) {
      return Object.assign({}, defaults);
    }
    return {
      textColor: match.textColor || defaults.textColor,
      borderColor: match.borderColor || defaults.borderColor,
      bgColor: match.bgColor || defaults.bgColor,
      hoverTextColor: match.hoverTextColor || defaults.hoverTextColor,
      hoverBgColor: match.hoverBgColor || defaults.hoverBgColor,
      hoverBorderColor: match.hoverBorderColor || defaults.hoverBorderColor,
    };
  }

  function applyButtonColorsToParity(buttons, parity, colorPatch) {
    return buttons.map(function (btn, index) {
      if (index % 2 !== parity) {
        return btn;
      }
      return Object.assign({}, btn, colorPatch);
    });
  }

  function renderButtonColorControls(colors, defaults, onChange) {
    return el(
      'div',
      null,
      el(BaseControl, { label: __('Text color', 'headless-core') }),
      el(ColorPalette, {
        value: colors.textColor,
        colors: colorPaletteChoices(),
        onChange: function (c) { onChange({ textColor: c || defaults.textColor }); },
      }),
      el(BaseControl, { label: __('Border color', 'headless-core') }),
      el(ColorPalette, {
        value: colors.borderColor,
        colors: colorPaletteChoices(),
        onChange: function (c) { onChange({ borderColor: c || defaults.borderColor }); },
      }),
      el(BaseControl, { label: __('Background color', 'headless-core') }),
      el(ColorPalette, {
        value: colors.bgColor,
        colors: colorPaletteChoices(),
        onChange: function (c) { onChange({ bgColor: c || defaults.bgColor }); },
      }),
      el(BaseControl, { label: __('Hover text color', 'headless-core') }),
      el(ColorPalette, {
        value: colors.hoverTextColor,
        colors: colorPaletteChoices(),
        onChange: function (c) { onChange({ hoverTextColor: c || defaults.hoverTextColor }); },
      }),
      el(BaseControl, { label: __('Hover background color', 'headless-core') }),
      el(ColorPalette, {
        value: colors.hoverBgColor,
        colors: colorPaletteChoices(),
        onChange: function (c) { onChange({ hoverBgColor: c || defaults.hoverBgColor }); },
      }),
      el(BaseControl, { label: __('Hover border color', 'headless-core') }),
      el(ColorPalette, {
        value: colors.hoverBorderColor,
        colors: colorPaletteChoices(),
        onChange: function (c) { onChange({ hoverBorderColor: c || defaults.hoverBorderColor }); },
      })
    );
  }

  var EMPTY_SECTION_OPTIONS = [{ label: __('— No section —', 'headless-core'), value: '' }];
  var memo = element.memo || function (comp) { return comp; };

  function HeroCtaEditor(props) {
    var setAttributes = props.setAttributes;
    var buttons = normalizeButtons(props.buttons);
    var menuItems = normalizeMenuItems(props.menuItems);
    var sectionOptions = useSelect(function (select) {
      var store = select('core/block-editor');
      if (!store || !store.getBlocks || !headlessLink.collectSectionAnchorOptions) {
        return EMPTY_SECTION_OPTIONS;
      }
      return headlessLink.collectSectionAnchorOptions(store.getBlocks(), __);
    }, []);

    function patchButton(index, patch) {
      var current = normalizeButtons(props.buttons);
      var next = current.slice();
      next[index] = mergeLinkPatch(next[index], patch, 'url');
      setAttributes({ buttons: next });
    }

    function addButton() {
      var nextIndex = buttons.length;
      var template = Object.assign(
        {},
        EMPTY_BUTTON,
        nextIndex % 2 === 0 ? ODD_BUTTON_COLORS : EVEN_BUTTON_COLORS
      );
      setAttributes({
        buttons: buttons.concat([template]),
      });
    }

    function removeButton(index) {
      var next = buttons.filter(function (_, i) { return i !== index; });
      setAttributes({ buttons: next });
    }

    function patchMenuItem(index, patch) {
      var current = normalizeMenuItems(props.menuItems);
      var next = current.slice();
      next[index] = mergeLinkPatch(next[index], patch, 'href');
      setAttributes({ menuItems: next });
    }

    function addMenuItem() {
      setAttributes({
        menuItems: menuItems.concat([Object.assign({}, EMPTY_MENU_ITEM)]),
      });
    }

    function removeMenuItem(index) {
      var next = menuItems.filter(function (_, i) { return i !== index; });
      setAttributes({ menuItems: next });
    }

    return el(
      'div',
      { onKeyDown: function (e) { e.stopPropagation(); }, onKeyPress: function (e) { e.stopPropagation(); } },
      el('div', { style: { marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #e5e7eb' } },
        el('strong', null, __('Buttons', 'headless-core')),
        buttons.length === 0
          ? el('p', { style: { color: '#666', marginTop: '8px' } }, __('No buttons yet. Add CTA buttons with custom links.', 'headless-core'))
          : null,
        buttons.map(function (btn, index) {
          return el(
            'div',
            { key: 'btn-inline-' + index, style: { border: '1px solid #eee', padding: '10px', marginTop: '10px', borderRadius: '8px' } },
            el('div', { style: { display: 'flex', justifyContent: 'space-between', marginBottom: '6px' } },
              el('strong', null, __('Button', 'headless-core') + ' ' + (index + 1)),
              el('div', { style: { display: 'flex', gap: '6px' } },
                el(Button, { variant: 'tertiary', isSmall: true, disabled: index === 0, onClick: function () { setAttributes({ buttons: moveRow(buttons, index, -1) }); } }, '˄'),
                el(Button, { variant: 'tertiary', isSmall: true, disabled: index === buttons.length - 1, onClick: function () { setAttributes({ buttons: moveRow(buttons, index, 1) }); } }, '˅'),
                el(Button, { variant: 'tertiary', isSmall: true, isDestructive: true, onClick: function () { removeButton(index); } }, trashSvg)
              )
            ),
            el(TextControl, {
              label: __('Label', 'headless-core'),
              value: btn.label,
              onChange: function (v) { patchButton(index, { label: v }); },
            }),
            renderUrlField(__('Page/Post Link', 'headless-core'), btn, 'url', function (patch) {
              patchButton(index, patch);
            }, 'hero-btn-' + index, sectionOptions)
          );
        }),
        el('div', { style: { marginTop: '10px' } },
          el(Button, { variant: 'secondary', onClick: addButton }, '+ ', __('Add button', 'headless-core'))
        )
      ),
      el('div', { style: { marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #e5e7eb' } },
        el('strong', null, __('Menu items', 'headless-core')),
        el(
          'p',
          { style: { color: '#666', fontSize: '12px', marginTop: '6px' } },
          __(
            'Link to a page/post, or choose a section on this page to smooth-scroll there.',
            'headless-core'
          )
        ),
        menuItems.length === 0
          ? el('p', { style: { color: '#666', marginTop: '8px' } }, __('No menu items yet. Add links for the sub-navigation row.', 'headless-core'))
          : null,
        menuItems.map(function (item, index) {
          return el(
            'div',
            { key: 'menu-inline-' + index, style: { border: '1px solid #eee', padding: '10px', marginTop: '10px', borderRadius: '8px' } },
            el('div', { style: { display: 'flex', justifyContent: 'space-between', marginBottom: '6px' } },
              el('strong', null, __('Menu item', 'headless-core') + ' ' + (index + 1)),
              el('div', { style: { display: 'flex', gap: '6px' } },
                el(Button, { variant: 'tertiary', isSmall: true, disabled: index === 0, onClick: function () { setAttributes({ menuItems: moveRow(menuItems, index, -1) }); } }, '˄'),
                el(Button, { variant: 'tertiary', isSmall: true, disabled: index === menuItems.length - 1, onClick: function () { setAttributes({ menuItems: moveRow(menuItems, index, 1) }); } }, '˅'),
                el(Button, { variant: 'tertiary', isSmall: true, isDestructive: true, onClick: function () { removeMenuItem(index); } }, trashSvg)
              )
            ),
            el(TextControl, {
              label: __('Label', 'headless-core'),
              value: item.label,
              onChange: function (v) { patchMenuItem(index, { label: v }); },
            }),
            renderUrlField(__('Page/Post Link', 'headless-core'), item, 'href', function (patch) {
              patchMenuItem(index, patch);
            }, 'hero-menu-' + index, sectionOptions),
            sectionOptions.length <= 1
              ? el(
                  'p',
                  { style: { fontSize: '12px', color: '#666', marginTop: '8px' } },
                  __(
                    'Add content sections below this hero (with headings) to pick them in the section anchor dropdown.',
                    'headless-core'
                  )
                )
              : null
          );
        }),
        el('div', { style: { marginTop: '10px' } },
          el(Button, { variant: 'secondary', onClick: addMenuItem }, '+ ', __('Add menu item', 'headless-core'))
        )
      )
    );
  }

  var MemoHeroCtaEditor = memo(HeroCtaEditor);

  function moveRow(list, index, dir) {
    var to = index + dir;
    if (to < 0 || to >= list.length) return list;
    var next = list.slice();
    var tmp = next[index];
    next[index] = next[to];
    next[to] = tmp;
    return next;
  }

  registerBlockType('custom/savings-archive-hero', {
    apiVersion: 3,
    title: __('Page Hero Content', 'headless-core'),
    icon: 'cover-image',
    category: 'widgets',
    description: __('Page hero with title, banner, CTA buttons, and a flexible sub-navigation menu.', 'headless-core'),
    attributes: {
      title: { type: 'string', default: 'Savings Products' },
      intro: { type: 'string', default: '' },
      bannerImageId: { type: 'number', default: 0 },
      bannerImageUrl: { type: 'string', default: '' },
      bannerImagePositionX: { type: 'string', default: 'center' },
      bannerImagePositionY: { type: 'string', default: 'bottom' },
      backgroundColor: { type: 'string', default: '#40c9bf' },
      titleColor: { type: 'string', default: '#22ABB5' },
      navBackgroundColor: { type: 'string', default: '#eef2f8' },
      navBorderColor: { type: 'string', default: '#c8cee3' },
      menuTextColor: { type: 'string', default: '#65605f' },
      menuHoverTextColor: { type: 'string', default: '#ED6E2A' },
      menuHoverBackgroundColor: { type: 'string', default: '#eef2f8' },
      buttons: { type: 'array', default: [] },
      menuItems: { type: 'array', default: [] },
      showMenu: { type: 'boolean', default: true },
    },
    edit: function (props) {
      var blockProps = useBlockProps({ className: 'headless-page-hero-content-block' });
      var attrs = props.attributes || {};
      var buttons = normalizeButtons(attrs.buttons);
      var menuItems = normalizeMenuItems(attrs.menuItems);

      function patchButtonColorsByParity(parity, patch) {
        props.setAttributes({
          buttons: applyButtonColorsToParity(buttons, parity, patch),
        });
      }

      var oddButtonColors = buttonColorsFromList(buttons, 0);
      var evenButtonColors = buttonColorsFromList(buttons, 1);

      return el(
        'div',
        blockProps,
        el(
          InspectorControls,
          null,
          el(
            PanelBody,
            { title: __('Menu', 'headless-core'), initialOpen: true },
            el(ToggleControl, {
              label: __('Show sub-navigation menu', 'headless-core'),
              checked: attrs.showMenu !== false,
              help: __('Turn off to hide menu links on the frontend while keeping the same layout space for the banner.', 'headless-core'),
              onChange: function (v) {
                props.setAttributes({ showMenu: Boolean(v) });
              },
            })
          ),
          el(
            PanelBody,
            { title: __('Button colors (1st, 3rd, …)', 'headless-core'), initialOpen: false },
            el('p', { style: { marginTop: 0, color: '#666', fontSize: '12px' } },
              __('Applies to buttons at odd positions in the list (1st, 3rd, 5th, …).', 'headless-core')
            ),
            renderButtonColorControls(oddButtonColors, ODD_BUTTON_COLORS, function (patch) {
              patchButtonColorsByParity(0, patch);
            })
          ),
          el(
            PanelBody,
            { title: __('Button colors (2nd, 4th, …)', 'headless-core'), initialOpen: false },
            el('p', { style: { marginTop: 0, color: '#666', fontSize: '12px' } },
              __('Applies to buttons at even positions in the list (2nd, 4th, 6th, …).', 'headless-core')
            ),
            renderButtonColorControls(evenButtonColors, EVEN_BUTTON_COLORS, function (patch) {
              patchButtonColorsByParity(1, patch);
            })
          ),
          el(
            PanelBody,
            { title: __('Colors', 'headless-core'), initialOpen: false },
            el(BaseControl, { label: __('Background color (fallback when no image)', 'headless-core') }),
            el(ColorPalette, {
              value: attrs.backgroundColor || '#22ABB5',
              colors: COLOR_CHOICES.map(function (hex) { return { color: hex, name: hex }; }),
              onChange: function (nextColor) { props.setAttributes({ backgroundColor: nextColor || '#22ABB5' }); }
            }),
            el(BaseControl, { label: __('Title Color', 'headless-core') }),
            el(ColorPalette, {
              value: attrs.titleColor || '#22ABB5',
              colors: COLOR_CHOICES.map(function (hex) { return { color: hex, name: hex }; }),
              onChange: function (nextColor) { props.setAttributes({ titleColor: nextColor || '#22ABB5' }); }
            }),
            el(BaseControl, { label: __('Menu Background Color', 'headless-core') }),
            el(ColorPalette, {
              value: attrs.navBackgroundColor || '#eef2f8',
              colors: COLOR_CHOICES.map(function (hex) { return { color: hex, name: hex }; }),
              onChange: function (nextColor) { props.setAttributes({ navBackgroundColor: nextColor || '#eef2f8' }); }
            }),
            el(BaseControl, { label: __('Menu Border Color', 'headless-core') }),
            el(ColorPalette, {
              value: attrs.navBorderColor || '#c8cee3',
              colors: COLOR_CHOICES.map(function (hex) { return { color: hex, name: hex }; }),
              onChange: function (nextColor) { props.setAttributes({ navBorderColor: nextColor || '#c8cee3' }); }
            }),
            el(BaseControl, { label: __('Menu Text Color', 'headless-core') }),
            el(ColorPalette, {
              value: attrs.menuTextColor || '#65605f',
              colors: COLOR_CHOICES.map(function (hex) { return { color: hex, name: hex }; }),
              onChange: function (nextColor) { props.setAttributes({ menuTextColor: nextColor || '#65605f' }); }
            }),
            el(BaseControl, { label: __('Menu Hover Text Color', 'headless-core') }),
            el(ColorPalette, {
              value: attrs.menuHoverTextColor || '#ED6E2A',
              colors: COLOR_CHOICES.map(function (hex) { return { color: hex, name: hex }; }),
              onChange: function (nextColor) { props.setAttributes({ menuHoverTextColor: nextColor || '#ED6E2A' }); }
            }),
            el(BaseControl, { label: __('Menu Hover Background Color', 'headless-core') }),
            el(ColorPalette, {
              value: attrs.menuHoverBackgroundColor || '#eef2f8',
              colors: COLOR_CHOICES.map(function (hex) { return { color: hex, name: hex }; }),
              onChange: function (nextColor) { props.setAttributes({ menuHoverBackgroundColor: nextColor || '#eef2f8' }); }
            })
          )
        ),
        el(
          'div',
          {
            style: { padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' },
            onKeyDown: function (e) { e.stopPropagation(); },
            onKeyPress: function (e) { e.stopPropagation(); },
          },
          el('div', { style: { maxWidth: '1100px', margin: '0 auto' } },
            el('h3', { style: { margin: 0, marginBottom: '10px' } }, __('Page Hero Content', 'headless-core')),
            el(TextControl, { label: __('Title', 'headless-core'), value: attrs.title || '', onChange: function (v) { props.setAttributes({ title: v }); } }),
            el(TextareaControl, { label: __('Intro Text', 'headless-core'), value: attrs.intro || '', onChange: function (v) { props.setAttributes({ intro: v }); } }),
            el('div', { style: { marginTop: '8px' } },
              el('strong', null, __('Banner image', 'headless-core')),
              attrs.bannerImageUrl
                ? el('img', { src: attrs.bannerImageUrl, alt: '', style: { width: '100%', maxHeight: '160px', objectFit: 'cover', marginTop: '8px', borderRadius: '6px' } })
                : null,
              attrs.bannerImageUrl
                ? el('div', { style: { marginTop: '10px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' } },
                    renderBannerPositionControl(
                      __('Banner image position X', 'headless-core'),
                      attrs.bannerImagePositionX,
                      BANNER_POSITION_X_OPTIONS,
                      'center',
                      function (v) { props.setAttributes({ bannerImagePositionX: v }); }
                    ),
                    renderBannerPositionControl(
                      __('Banner image position Y', 'headless-core'),
                      attrs.bannerImagePositionY,
                      BANNER_POSITION_Y_OPTIONS,
                      'bottom',
                      function (v) { props.setAttributes({ bannerImagePositionY: v }); }
                    )
                  )
                : null,
              el('div', { style: { marginTop: '8px', display: 'flex', gap: '8px', alignItems: 'center' } },
                el(MediaUploadCheck, null,
                  el(MediaUpload, {
                    allowedTypes: ['image'],
                    value: attrs.bannerImageId || 0,
                    onSelect: function (media) {
                      props.setAttributes({ bannerImageId: media && media.id ? media.id : 0, bannerImageUrl: media && media.url ? media.url : '' });
                    },
                    render: function (obj) {
                      return el(Button, { variant: 'secondary', onClick: obj.open }, attrs.bannerImageId ? __('Replace Banner', 'headless-core') : __('Select Banner', 'headless-core'));
                    }
                  })
                ),
                attrs.bannerImageId
                  ? el(Button, { variant: 'tertiary', isDestructive: true, onClick: function () { props.setAttributes({ bannerImageId: 0, bannerImageUrl: '' }); } }, trashSvg)
                  : null
              )
            ),
            el(MemoHeroCtaEditor, {
              buttons: attrs.buttons,
              menuItems: attrs.menuItems,
              setAttributes: props.setAttributes,
            })
          )
        ),
        el(
          'div',
          { style: { padding: '1rem', border: '1px dashed #ccc', borderRadius: '4px', marginTop: '8px' } },
          el('strong', null, attrs.title || __('Page Hero', 'headless-core')),
          attrs.intro ? el('p', { style: { marginTop: '8px' } }, attrs.intro) : null,
          menuItems.length > 0
            ? el('p', { style: { marginTop: '8px', fontSize: '12px' } }, menuItems.map(function (m) { return m.label; }).filter(Boolean).join(' · '))
            : null,
          el('p', { style: { marginTop: '8px', fontSize: '12px', color: '#555' } }, __('Buttons and menu links appear on the live site.', 'headless-core'))
        )
      );
    },
    save: function () { return null; }
  });
})(window.wp.blocks, window.wp.blockEditor, window.wp.components, window.wp.data, window.wp.element, window.wp.i18n);
