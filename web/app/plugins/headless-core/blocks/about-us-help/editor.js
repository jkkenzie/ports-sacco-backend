(function (blocks, blockEditor, components, element, i18n) {
  var el = element.createElement;
  var registerBlockType = blocks.registerBlockType;
  var useBlockProps = blockEditor.useBlockProps;
  var RichText = blockEditor.RichText;
  var MediaUpload = blockEditor.MediaUpload;
  var MediaUploadCheck = blockEditor.MediaUploadCheck;
  var Button = components.Button;
  var TextControl = components.TextControl;
  var SelectControl = components.SelectControl;
  var BaseControl = components.BaseControl;
  var ColorPalette = components.ColorPalette;
  var __ = i18n.__;
  var trashSvg = el(
    'svg',
    { viewBox: '0 0 24 24', width: '16', height: '16', style: { display: 'block' }, fill: 'currentColor' },
    el('path', { d: 'M9 3h6l1 2h4v2H4V5h4l1-2zm0 6h2v12H9V9zm4 0h2v12h-2V9z' })
  );

  var DEFAULT_ITEMS = [
    {
      iconId: 0,
      title: 'APPLY FOR A LOAN',
      description: 'Looking to buy a car, build a home, start a business, pay for education? Apply for a loan now!',
      linkMode: 'text',
      linkText: 'Get an Appointment',
      linkUrl: '',
      linkSvgId: 0,
    },
    {
      iconId: 0,
      title: 'CALL US!',
      description: '+254 111 173 000 info@portsacco.co.ke',
      linkMode: 'text',
      linkText: 'Contact us',
      linkUrl: '',
      linkSvgId: 0,
    },
    {
      iconId: 0,
      title: 'TALK TO AN ADVISOR',
      description: 'Do you need financial planning? Talk to our advisors.',
      linkMode: 'svg',
      linkText: '',
      linkUrl: '',
      linkSvgId: 0,
    },
  ];

  function normalizeItems(items) {
    if (!Array.isArray(items) || !items.length) {
      return DEFAULT_ITEMS.map(function (row) { return Object.assign({}, row); });
    }
    return items.map(function (row, i) {
      var d = DEFAULT_ITEMS[i] || { iconId: 0, title: '', description: '', linkMode: 'text', linkText: '', linkUrl: '', linkSvgId: 0 };
      return {
        iconId: Number((row && row.iconId) || d.iconId || 0),
        iconUrl: String((row && row.iconUrl) || ''),
        title: String((row && row.title) || d.title || ''),
        description: String((row && row.description) || d.description || ''),
        linkMode: String((row && row.linkMode) || d.linkMode || 'text'),
        linkText: String((row && row.linkText) || d.linkText || ''),
        linkUrl: String((row && row.linkUrl) || d.linkUrl || ''),
        linkSvgId: Number((row && row.linkSvgId) || d.linkSvgId || 0),
        linkSvgUrl: String((row && row.linkSvgUrl) || ''),
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

  registerBlockType('custom/about-us-help', {
    apiVersion: 3,
    title: __('About Us Help', 'headless-core'),
    icon: 'forms',
    category: 'widgets',
    description: __('About Us help cards rendered by the React app.', 'headless-core'),
    attributes: {
      items: { type: 'array', default: DEFAULT_ITEMS },
      iconColor: { type: 'string', default: '#EE6E2A' },
      linkSvgColor: { type: 'string', default: '#22ACB6' },
      headerText: { type: 'string', default: 'WE ARE HERE TO HELP YOU' },
      ctaText: { type: 'string', default: 'TALK TO US!' },
    },
    edit: function (props) {
      var blockProps = useBlockProps({ className: 'headless-about-us-help-editor' });
      var items = normalizeItems(props.attributes.items);
      var iconColor = String(props.attributes.iconColor || '#EE6E2A');
      var linkSvgColor = String(props.attributes.linkSvgColor || '#22ACB6');
      var headerText = String(props.attributes.headerText || 'WE ARE HERE TO HELP YOU');
      var ctaText = String(props.attributes.ctaText || 'TALK TO US!');
      var iconColorChoices = ['#EE6E2A', '#22ACB6', '#000000', '#FFFFFF', '#808080', 'rgb(50, 186, 70)'];
      var linkColorChoices = ['#22ACB6', '#EE6E2A', '#000000', '#FFFFFF', '#808080', 'rgb(50, 186, 70)'];

      function patchItem(index, patch) {
        var next = items.slice();
        next[index] = Object.assign({}, next[index], patch);
        props.setAttributes({ items: next });
      }

      function addItem() {
        props.setAttributes({
          items: items.concat([{ iconId: 0, title: '', description: '', linkMode: 'text', linkText: '', linkUrl: '', linkSvgId: 0 }]),
        });
      }

      function removeItem(index) {
        if (!window.confirm(__('Remove this help card?', 'headless-core'))) return;
        var next = items.filter(function (_, i) { return i !== index; });
        props.setAttributes({ items: next.length ? next : normalizeItems([]) });
      }

      function imageChooser(item, index, keyPrefix) {
        var idKey = keyPrefix + 'Id';
        var urlKey = keyPrefix + 'Url';
        return el(
          'div',
          { style: { marginBottom: '8px' } },
          item[urlKey]
            ? el('img', { src: item[urlKey], alt: '', style: { width: '36px', height: '36px', objectFit: 'cover', border: '1px solid #dcdcde', marginBottom: '6px' } })
            : null,
          el(
            MediaUploadCheck,
            null,
            el(MediaUpload, {
              allowedTypes: ['image'],
              value: item[idKey],
              onSelect: function (media) {
                var patch = {};
                patch[idKey] = media && media.id ? media.id : 0;
                patch[urlKey] = media && media.url ? media.url : '';
                patchItem(index, patch);
              },
              render: function (obj) {
                return el(
                  'div',
                  { style: { display: 'flex', alignItems: 'center', gap: '6px' } },
                  el(Button, { variant: 'secondary', onClick: obj.open }, item[idKey] ? __('Replace', 'headless-core') : __('Select', 'headless-core')),
                  item[idKey]
                    ? el(Button, {
                        variant: 'tertiary',
                        isSmall: true,
                        isDestructive: true,
                        label: __('Remove', 'headless-core'),
                        onClick: function () {
                          if (!window.confirm(__('Remove this image?', 'headless-core'))) return;
                          var clearPatch = {};
                          clearPatch[idKey] = 0;
                          clearPatch[urlKey] = '';
                          patchItem(index, clearPatch);
                        },
                      }, trashSvg)
                    : null
                );
              },
            })
          )
        );
      }

      return el(
        'div',
        blockProps,
        el('h3', null, __('About Us Help', 'headless-core')),
        el(
          'div',
          { style: { marginBottom: '12px', padding: '8px', border: '1px solid #ddd', borderRadius: '6px', background: '#fff' } },
          el(TextControl, {
            label: __('Header text', 'headless-core'),
            value: headerText,
            onChange: function (v) {
              props.setAttributes({ headerText: String(v || '').trim() || 'WE ARE HERE TO HELP YOU' });
            },
          }),
          el(TextControl, {
            label: __('Button text', 'headless-core'),
            value: ctaText,
            onChange: function (v) {
              props.setAttributes({ ctaText: String(v || '').trim() || 'TALK TO US!' });
            },
          }),
          el(TextControl, {
            label: __('Icon SVG fill color (hex)', 'headless-core'),
            value: iconColor,
            onChange: function (v) {
              props.setAttributes({ iconColor: String(v || '').trim() || '#EE6E2A' });
            },
          }),
          el(
            BaseControl,
            { label: __('Icon color selector', 'headless-core') },
            el(ColorPalette, {
              value: iconColor,
              colors: iconColorChoices.map(function (hex) { return { color: hex, name: hex }; }),
              onChange: function (nextColor) {
                props.setAttributes({ iconColor: nextColor || '#EE6E2A' });
              },
            })
          ),
          el(TextControl, {
            label: __('Link SVG fill color (hex)', 'headless-core'),
            value: linkSvgColor,
            onChange: function (v) {
              props.setAttributes({ linkSvgColor: String(v || '').trim() || '#22ACB6' });
            },
          }),
          el(
            BaseControl,
            { label: __('Link SVG color selector', 'headless-core') },
            el(ColorPalette, {
              value: linkSvgColor,
              colors: linkColorChoices.map(function (hex) { return { color: hex, name: hex }; }),
              onChange: function (nextColor) {
                props.setAttributes({ linkSvgColor: nextColor || '#22ACB6' });
              },
            })
          )
        ),
        el(
          'div',
          { style: { display: 'grid', gap: '12px', marginBottom: '12px' } },
          items.map(function (item, index) {
            return el(
              'div',
              { key: 'help-' + index, style: { border: '1px solid #ddd', borderRadius: '6px', padding: '10px', background: '#fff' } },
              el(
                'div',
                { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' } },
                el('strong', null, item.title || __('Help card', 'headless-core') + ' ' + (index + 1)),
                el(
                  'div',
                  { style: { display: 'flex', gap: '4px' } },
                  el(Button, { variant: 'tertiary', isSmall: true, label: __('Move up', 'headless-core'), disabled: index === 0, onClick: function () { props.setAttributes({ items: moveRow(items, index, -1) }); } }, '˄'),
                  el(Button, { variant: 'tertiary', isSmall: true, label: __('Move down', 'headless-core'), disabled: index === items.length - 1, onClick: function () { props.setAttributes({ items: moveRow(items, index, 1) }); } }, '˅'),
                  el(Button, { variant: 'tertiary', isSmall: true, isDestructive: true, label: __('Remove card', 'headless-core'), onClick: function () { removeItem(index); } }, trashSvg)
                )
              ),
              el('p', { style: { margin: '0 0 6px 0', fontWeight: 600 } }, __('Card icon/image', 'headless-core')),
              imageChooser(item, index, 'icon'),
              el(RichText, {
                tagName: 'p',
                value: item.title,
                onChange: function (v) { patchItem(index, { title: v }); },
                placeholder: __('Card title...', 'headless-core'),
                allowedFormats: [],
              }),
              el(RichText, {
                tagName: 'div',
                value: item.description,
                onChange: function (v) { patchItem(index, { description: v }); },
                placeholder: __('Card description...', 'headless-core'),
                style: { minHeight: '96px', border: '1px solid #dcdcde', borderRadius: '4px', padding: '8px' },
              }),
              el(SelectControl, {
                label: __('Link type', 'headless-core'),
                value: item.linkMode || 'text',
                options: [
                  { label: __('Text link', 'headless-core'), value: 'text' },
                  { label: __('SVG link', 'headless-core'), value: 'svg' },
                ],
                onChange: function (v) { patchItem(index, { linkMode: v || 'text' }); },
              }),
              (item.linkMode || 'text') === 'text'
                ? el(TextControl, {
                    label: __('Link text', 'headless-core'),
                    value: item.linkText || '',
                    onChange: function (v) { patchItem(index, { linkText: String(v || '') }); },
                  })
                : el(
                    'div',
                    null,
                    el('p', { style: { margin: '4px 0 6px 0', fontWeight: 600 } }, __('Link SVG/image', 'headless-core')),
                    imageChooser(item, index, 'linkSvg')
                  )
              ,
              el(TextControl, {
                label: __('Link URL', 'headless-core'),
                value: item.linkUrl || '',
                onChange: function (v) { patchItem(index, { linkUrl: String(v || '') }); },
                placeholder: __('https://example.com or /path', 'headless-core'),
              })
            );
          })
        ),
        el(Button, { variant: 'primary', onClick: addItem }, '+ ', __('Add Help Card', 'headless-core'))
      );
    },
    save: function () {
      return null;
    },
  });
})(window.wp.blocks, window.wp.blockEditor, window.wp.components, window.wp.element, window.wp.i18n);
