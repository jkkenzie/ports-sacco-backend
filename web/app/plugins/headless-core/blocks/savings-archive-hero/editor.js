(function (blocks, blockEditor, components, element, i18n) {
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
  var __ = i18n.__;
  var trashSvg = el(
    'svg',
    { viewBox: '0 0 24 24', width: '16', height: '16', style: { display: 'block' }, fill: 'currentColor' },
    el('path', { d: 'M9 3h6l1 2h4v2H4V5h4l1-2zm0 6h2v12H9V9zm4 0h2v12h-2V9z' })
  );

  var DEFAULT_BUTTONS = [
    { label: 'GET A CALL BACK', url: '#', textColor: '#22abb5', borderColor: '#22abb5', bgColor: '#ffffff', hoverTextColor: '#ffffff', hoverBgColor: '#22abb5', hoverBorderColor: '#22abb5' },
    { label: 'JOIN PORTS SACCO', url: '/contact-us', textColor: '#ed6e2a', borderColor: '#ed6e2a', bgColor: '#ffffff', hoverTextColor: '#ffffff', hoverBgColor: '#ed6e2a', hoverBorderColor: '#ed6e2a' }
  ];
  var DEFAULT_MENU_ITEMS = [
    { label: 'GROUP', href: '#' },
    { label: 'BIASHARA', href: '#' },
    { label: 'FIXED DEPOSIT', href: '#' }
  ];
  var COLOR_CHOICES = ['#22abb5', '#ed6e2a', '#ffffff', '#000000', '#65605f', '#c8cee3'];

  function normalizeButtons(buttons) {
    if (!Array.isArray(buttons) || !buttons.length) {
      return DEFAULT_BUTTONS.map(function (btn) { return Object.assign({}, btn); });
    }
    return buttons.map(function (btn, i) {
      var d = DEFAULT_BUTTONS[i] || { label: '', url: '#', textColor: '#22abb5', borderColor: '#22abb5', bgColor: '#ffffff', hoverTextColor: '#ffffff', hoverBgColor: '#22abb5', hoverBorderColor: '#22abb5' };
      return {
        label: String((btn && btn.label) || d.label),
        url: String((btn && btn.url) || d.url),
        textColor: String((btn && btn.textColor) || d.textColor),
        borderColor: String((btn && btn.borderColor) || d.borderColor),
        bgColor: String((btn && btn.bgColor) || d.bgColor),
        hoverTextColor: String((btn && btn.hoverTextColor) || d.hoverTextColor),
        hoverBgColor: String((btn && btn.hoverBgColor) || d.hoverBgColor),
        hoverBorderColor: String((btn && btn.hoverBorderColor) || d.hoverBorderColor)
      };
    });
  }

  function normalizeMenuItems(items) {
    if (!Array.isArray(items) || !items.length) {
      return DEFAULT_MENU_ITEMS.map(function (item) { return Object.assign({}, item); });
    }
    return items.map(function (item, i) {
      var d = DEFAULT_MENU_ITEMS[i] || { label: '', href: '#' };
      return {
        label: String((item && item.label) || d.label),
        href: String((item && item.href) || d.href)
      };
    });
  }

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
    title: __('Savings Archive Hero', 'headless-core'),
    icon: 'cover-image',
    category: 'widgets',
    description: __('Hero section for the savings products archive page.', 'headless-core'),
    attributes: {
      title: { type: 'string', default: 'Savings Products' },
      intro: { type: 'string', default: '' },
      bannerImageId: { type: 'number', default: 0 },
      bannerImageUrl: { type: 'string', default: '' },
      backgroundColor: { type: 'string', default: '#22ABB5' },
      titleColor: { type: 'string', default: '#22ABB5' },
      navBackgroundColor: { type: 'string', default: '#eef2f8' },
      navBorderColor: { type: 'string', default: '#c8cee3' },
      menuTextColor: { type: 'string', default: '#65605f' },
      menuHoverTextColor: { type: 'string', default: '#ED6E2A' },
      menuHoverBackgroundColor: { type: 'string', default: '#eef2f8' },
      buttons: { type: 'array', default: DEFAULT_BUTTONS },
      menuItems: { type: 'array', default: DEFAULT_MENU_ITEMS }
    },
    edit: function (props) {
      var blockProps = useBlockProps({ className: 'headless-savings-archive-hero-block' });
      var buttons = normalizeButtons(props.attributes.buttons);
      var menuItems = normalizeMenuItems(props.attributes.menuItems);

      function patchButton(index, patch) {
        var next = buttons.slice();
        next[index] = Object.assign({}, next[index], patch);
        props.setAttributes({ buttons: next });
      }

      function addButton() {
        props.setAttributes({ buttons: buttons.concat([{ label: '', url: '#', textColor: '#22abb5', borderColor: '#22abb5', bgColor: '#ffffff', hoverTextColor: '#ffffff', hoverBgColor: '#22abb5', hoverBorderColor: '#22abb5' }]) });
      }

      function removeButton(index) {
        var next = buttons.filter(function (_, i) { return i !== index; });
        props.setAttributes({ buttons: next.length ? next : normalizeButtons([]) });
      }

      function patchMenuItem(index, patch) {
        var next = menuItems.slice();
        next[index] = Object.assign({}, next[index], patch);
        props.setAttributes({ menuItems: next });
      }

      function addMenuItem() {
        props.setAttributes({ menuItems: menuItems.concat([{ label: '', href: '#' }]) });
      }

      function removeMenuItem(index) {
        var next = menuItems.filter(function (_, i) { return i !== index; });
        props.setAttributes({ menuItems: next.length ? next : normalizeMenuItems([]) });
      }

      return el(
        'div',
        blockProps,
        el(
          InspectorControls,
          null,
          el(
            PanelBody,
            { title: __('Colors', 'headless-core'), initialOpen: false },
            el(BaseControl, { label: __('Background color (fallback when no image)', 'headless-core') }),
            el(ColorPalette, {
              value: props.attributes.backgroundColor || '#22ABB5',
              colors: COLOR_CHOICES.map(function (hex) { return { color: hex, name: hex }; }),
              onChange: function (nextColor) { props.setAttributes({ backgroundColor: nextColor || '#22ABB5' }); }
            }),
            el(BaseControl, { label: __('Title Color', 'headless-core') }),
            el(ColorPalette, {
              value: props.attributes.titleColor || '#22ABB5',
              colors: COLOR_CHOICES.map(function (hex) { return { color: hex, name: hex }; }),
              onChange: function (nextColor) { props.setAttributes({ titleColor: nextColor || '#22ABB5' }); }
            }),
            el(BaseControl, { label: __('Menu Background Color', 'headless-core') }),
            el(ColorPalette, {
              value: props.attributes.navBackgroundColor || '#eef2f8',
              colors: COLOR_CHOICES.map(function (hex) { return { color: hex, name: hex }; }),
              onChange: function (nextColor) { props.setAttributes({ navBackgroundColor: nextColor || '#eef2f8' }); }
            }),
            el(BaseControl, { label: __('Menu Border Color', 'headless-core') }),
            el(ColorPalette, {
              value: props.attributes.navBorderColor || '#c8cee3',
              colors: COLOR_CHOICES.map(function (hex) { return { color: hex, name: hex }; }),
              onChange: function (nextColor) { props.setAttributes({ navBorderColor: nextColor || '#c8cee3' }); }
            }),
            el(BaseControl, { label: __('Menu Text Color', 'headless-core') }),
            el(ColorPalette, {
              value: props.attributes.menuTextColor || '#65605f',
              colors: COLOR_CHOICES.map(function (hex) { return { color: hex, name: hex }; }),
              onChange: function (nextColor) { props.setAttributes({ menuTextColor: nextColor || '#65605f' }); }
            }),
            el(BaseControl, { label: __('Menu Hover Text Color', 'headless-core') }),
            el(ColorPalette, {
              value: props.attributes.menuHoverTextColor || '#ED6E2A',
              colors: COLOR_CHOICES.map(function (hex) { return { color: hex, name: hex }; }),
              onChange: function (nextColor) { props.setAttributes({ menuHoverTextColor: nextColor || '#ED6E2A' }); }
            }),
            el(BaseControl, { label: __('Menu Hover Background Color', 'headless-core') }),
            el(ColorPalette, {
              value: props.attributes.menuHoverBackgroundColor || '#eef2f8',
              colors: COLOR_CHOICES.map(function (hex) { return { color: hex, name: hex }; }),
              onChange: function (nextColor) { props.setAttributes({ menuHoverBackgroundColor: nextColor || '#eef2f8' }); }
            })
          )
        ),
        el(
          'div',
          { style: { padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' } },
          el('div', { style: { maxWidth: '1100px', margin: '0 auto' } },
            el('h3', { style: { margin: 0, marginBottom: '10px' } }, __('Hero content', 'headless-core')),
            el(TextControl, { label: __('Title', 'headless-core'), value: props.attributes.title, onChange: function (v) { props.setAttributes({ title: v }); } }),
            el(TextareaControl, { label: __('Intro Text', 'headless-core'), value: props.attributes.intro, onChange: function (v) { props.setAttributes({ intro: v }); } }),
            el('div', { style: { marginTop: '8px' } },
              el('strong', null, __('Banner image', 'headless-core')),
              props.attributes.bannerImageUrl
                ? el('img', { src: props.attributes.bannerImageUrl, alt: '', style: { width: '100%', maxHeight: '160px', objectFit: 'cover', marginTop: '8px', borderRadius: '6px' } })
                : null,
              el('div', { style: { marginTop: '8px', display: 'flex', gap: '8px', alignItems: 'center' } },
                el(MediaUploadCheck, null,
                  el(MediaUpload, {
                    allowedTypes: ['image'],
                    value: props.attributes.bannerImageId || 0,
                    onSelect: function (media) {
                      props.setAttributes({ bannerImageId: media && media.id ? media.id : 0, bannerImageUrl: media && media.url ? media.url : '' });
                    },
                    render: function (obj) {
                      return el(Button, { variant: 'secondary', onClick: obj.open }, props.attributes.bannerImageId ? __('Replace Banner', 'headless-core') : __('Select Banner', 'headless-core'));
                    }
                  })
                ),
                props.attributes.bannerImageId
                  ? el(Button, { variant: 'tertiary', isDestructive: true, onClick: function () { props.setAttributes({ bannerImageId: 0, bannerImageUrl: '' }); } }, trashSvg)
                  : null
              )
            ),

            el('hr', { style: { margin: '18px 0' } }),
            el('strong', null, __('Buttons', 'headless-core')),
            buttons.map(function (btn, index) {
              return el(
                'div',
                { key: 'btn-inline-' + index, style: { border: '1px solid #eee', padding: '10px', margin: '10px 0', borderRadius: '8px' } },
                el('div', { style: { display: 'flex', justifyContent: 'space-between', marginBottom: '6px' } },
                  el('span', null, __('Button', 'headless-core') + ' ' + (index + 1)),
                  el('div', { style: { display: 'flex', gap: '6px' } },
                    el(Button, { variant: 'tertiary', isSmall: true, disabled: index === 0, onClick: function () { props.setAttributes({ buttons: moveRow(buttons, index, -1) }); } }, '˄'),
                    el(Button, { variant: 'tertiary', isSmall: true, disabled: index === buttons.length - 1, onClick: function () { props.setAttributes({ buttons: moveRow(buttons, index, 1) }); } }, '˅'),
                    el(Button, { variant: 'tertiary', isSmall: true, isDestructive: true, onClick: function () { removeButton(index); } }, trashSvg)
                  )
                ),
                el(RichText, { tagName: 'p', value: btn.label, onChange: function (v) { patchButton(index, { label: v }); }, placeholder: __('Button label...', 'headless-core'), allowedFormats: [] }),
                el(TextControl, { label: __('Button Link', 'headless-core'), value: btn.url, onChange: function (v) { patchButton(index, { url: v }); } })
              );
            }),
            el(Button, { variant: 'primary', onClick: addButton }, '+ ', __('Add Button', 'headless-core')),

            el('hr', { style: { margin: '18px 0' } }),
            el('strong', null, __('Menu Items', 'headless-core')),
            menuItems.map(function (item, index) {
              return el(
                'div',
                { key: 'menu-inline-' + index, style: { border: '1px solid #eee', padding: '10px', margin: '10px 0', borderRadius: '8px' } },
                el('div', { style: { display: 'flex', justifyContent: 'space-between', marginBottom: '6px' } },
                  el('span', null, __('Menu Item', 'headless-core') + ' ' + (index + 1)),
                  el('div', { style: { display: 'flex', gap: '6px' } },
                    el(Button, { variant: 'tertiary', isSmall: true, disabled: index === 0, onClick: function () { props.setAttributes({ menuItems: moveRow(menuItems, index, -1) }); } }, '˄'),
                    el(Button, { variant: 'tertiary', isSmall: true, disabled: index === menuItems.length - 1, onClick: function () { props.setAttributes({ menuItems: moveRow(menuItems, index, 1) }); } }, '˅'),
                    el(Button, { variant: 'tertiary', isSmall: true, isDestructive: true, onClick: function () { removeMenuItem(index); } }, trashSvg)
                  )
                ),
                el(TextControl, { label: __('Menu Label', 'headless-core'), value: item.label, onChange: function (v) { patchMenuItem(index, { label: v }); } }),
                el(TextControl, { label: __('Menu Link', 'headless-core'), value: item.href, onChange: function (v) { patchMenuItem(index, { href: v }); } })
              );
            }),
            el(Button, { variant: 'primary', onClick: addMenuItem }, '+ ', __('Add Menu Item', 'headless-core'))
          )
        ),
        el(
          'div',
          { style: { padding: '1rem', border: '1px dashed #ccc', borderRadius: '4px' } },
          el('strong', null, props.attributes.title || __('Savings Products', 'headless-core')),
          el('p', { style: { marginTop: '8px' } }, props.attributes.intro || __('Archive intro text', 'headless-core')),
          el('p', { style: { marginTop: '8px' } }, __('Buttons:', 'headless-core') + ' ' + buttons.length + ' | ' + __('Menu items:', 'headless-core') + ' ' + menuItems.length),
          el('p', { style: { marginTop: '8px', fontSize: '12px', color: '#555' } }, __('Rendered by React frontend.', 'headless-core'))
        )
      );
    },
    save: function () { return null; }
  });
})(window.wp.blocks, window.wp.blockEditor, window.wp.components, window.wp.element, window.wp.i18n);
