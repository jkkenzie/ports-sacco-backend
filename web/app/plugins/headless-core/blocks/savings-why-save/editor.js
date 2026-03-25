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
  var __ = i18n.__;
  var trashSvg = el(
    'svg',
    { viewBox: '0 0 24 24', width: '16', height: '16', style: { display: 'block' }, fill: 'currentColor' },
    el('path', { d: 'M9 3h6l1 2h4v2H4V5h4l1-2zm0 6h2v12H9V9zm4 0h2v12h-2V9z' })
  );

  var DEFAULT_ITEMS = [
    { heading: 'High Returns', paragraph: 'Earn market competitive returns on your savings and share capital.' },
    { heading: 'Access to Credit', paragraph: 'Saving with us makes it easy to access credit. The more you save, the more you can borrow.' },
    { heading: 'Fallback', paragraph: 'You can always count on your savings with the SACCO for unforeseen occurrences.' },
    { heading: 'Retirement', paragraph: 'Savings come in handy when you retire from formal employment.' }
  ];

  function normalizeItems(items) {
    if (!Array.isArray(items) || !items.length) {
      return DEFAULT_ITEMS.map(function (row) { return Object.assign({}, row); });
    }
    return items.map(function (row, i) {
      var d = DEFAULT_ITEMS[i] || { heading: '', paragraph: '' };
      return {
        heading: String((row && row.heading) || d.heading || ''),
        paragraph: String((row && row.paragraph) || d.paragraph || '')
      };
    });
  }

  function moveRow(list, index, dir) {
    var to = index + dir;
    if (to < 0 || to >= list.length) {
      return list;
    }
    var next = list.slice();
    var tmp = next[index];
    next[index] = next[to];
    next[to] = tmp;
    return next;
  }

  registerBlockType('custom/savings-why-save', {
    apiVersion: 3,
    title: __('Savings Why Save', 'headless-core'),
    icon: 'yes-alt',
    category: 'widgets',
    description: __('Why Save With Us section for savings products archive.', 'headless-core'),
    attributes: {
      heading: { type: 'string', default: 'Why Save With Us' },
      footerText: { type: 'string', default: '' },
      iconId: { type: 'number', default: 0 },
      iconUrl: { type: 'string', default: '' },
      headingColor: { type: 'string', default: '#22ABB5' },
      titleColor: { type: 'string', default: '#000000' },
      textColor: { type: 'string', default: '#000000' },
      iconBgColor: { type: 'string', default: '#ED6E2A' },
      backgroundColor: { type: 'string', default: '#ffffff' },
      items: {
        type: 'array',
        default: DEFAULT_ITEMS
      }
    },
    edit: function (props) {
      var blockProps = useBlockProps({ className: 'headless-savings-why-save-block' });
      var items = normalizeItems(props.attributes.items);
      var headingColor = String(props.attributes.headingColor || '#22ABB5');
      var titleColor = String(props.attributes.titleColor || '#000000');
      var textColor = String(props.attributes.textColor || '#000000');
      var iconBgColor = String(props.attributes.iconBgColor || '#ED6E2A');
      var backgroundColor = String(props.attributes.backgroundColor || '#ffffff');
      var colorChoices = ['#22ABB5', '#ED6E2A', '#000000', '#FFFFFF', '#eef0f3', '#65605f', '#3b4e6b'];

      function setItem(index, patch) {
        var next = items.map(function (item, i) {
          if (i !== index) return item;
          return Object.assign({}, item || {}, patch);
        });
        props.setAttributes({ items: next });
      }

      function addItem() {
        props.setAttributes({ items: items.concat([{ heading: '', paragraph: '' }]) });
      }

      function removeItem(index) {
        if (!window.confirm(__('Remove this point?', 'headless-core'))) {
          return;
        }
        var next = items.filter(function (_, i) { return i !== index; });
        props.setAttributes({ items: next.length ? next : normalizeItems([]) });
      }

      return el(
        'div',
        blockProps,
        el(
          InspectorControls,
          null,
          el(
            PanelBody,
            { title: __('Content', 'headless-core'), initialOpen: true },
            el(TextControl, {
              label: __('Section Heading', 'headless-core'),
              value: props.attributes.heading,
              onChange: function (v) { props.setAttributes({ heading: v }); }
            }),
            el('div', { style: { marginTop: '8px' } },
              el(BaseControl, { label: __('Background Color', 'headless-core') }),
              el(ColorPalette, {
                value: backgroundColor,
                colors: colorChoices.map(function (hex) { return { color: hex, name: hex }; }),
                onChange: function (nextColor) { props.setAttributes({ backgroundColor: nextColor || '#ffffff' }); }
              })
            ),
            el('div', null,
              el(BaseControl, { label: __('Section Heading Color', 'headless-core') }),
              el(ColorPalette, {
                value: headingColor,
                colors: colorChoices.map(function (hex) { return { color: hex, name: hex }; }),
                onChange: function (nextColor) { props.setAttributes({ headingColor: nextColor || '#22ABB5' }); }
              })
            ),
            el('div', null,
              el(BaseControl, { label: __('Point Title Color', 'headless-core') }),
              el(ColorPalette, {
                value: titleColor,
                colors: colorChoices.map(function (hex) { return { color: hex, name: hex }; }),
                onChange: function (nextColor) { props.setAttributes({ titleColor: nextColor || '#000000' }); }
              })
            ),
            el('div', null,
              el(BaseControl, { label: __('Point Paragraph Color', 'headless-core') }),
              el(ColorPalette, {
                value: textColor,
                colors: colorChoices.map(function (hex) { return { color: hex, name: hex }; }),
                onChange: function (nextColor) { props.setAttributes({ textColor: nextColor || '#000000' }); }
              })
            ),
            el('div', null,
              el(BaseControl, { label: __('Icon Background Color', 'headless-core') }),
              el(ColorPalette, {
                value: iconBgColor,
                colors: colorChoices.map(function (hex) { return { color: hex, name: hex }; }),
                onChange: function (nextColor) { props.setAttributes({ iconBgColor: nextColor || '#ED6E2A' }); }
              })
            ),
            el('div', { style: { marginTop: '8px' } },
              el(BaseControl, { label: __('Global Icon (applies to all points)', 'headless-core') }),
              props.attributes.iconUrl
                ? el('img', {
                    src: props.attributes.iconUrl,
                    alt: '',
                    style: { width: '40px', height: '40px', objectFit: 'contain', border: '1px solid #dcdcde', borderRadius: '4px', marginBottom: '6px' }
                  })
                : null,
              el(MediaUploadCheck, null,
                el(MediaUpload, {
                  allowedTypes: ['image'],
                  value: props.attributes.iconId || 0,
                  onSelect: function (media) {
                    props.setAttributes({
                      iconId: media && media.id ? media.id : 0,
                      iconUrl: media && media.url ? media.url : ''
                    });
                  },
                  render: function (obj) {
                    return el(
                      'div',
                      { style: { display: 'flex', alignItems: 'center', gap: '6px' } },
                      el(Button, { variant: 'secondary', onClick: obj.open }, props.attributes.iconId ? __('Replace Icon', 'headless-core') : __('Select Icon', 'headless-core')),
                      props.attributes.iconId
                        ? el(Button, {
                            variant: 'tertiary',
                            isSmall: true,
                            isDestructive: true,
                            onClick: function () { props.setAttributes({ iconId: 0, iconUrl: '' }); },
                            label: __('Remove icon', 'headless-core')
                          }, trashSvg)
                        : null
                    );
                  }
                })
              )
            ),
            items.map(function (item, index) {
              return el(
                'div',
                { key: index, style: { marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid #eee' } },
                el(
                  'div',
                  { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' } },
                  el('strong', null, __('Point', 'headless-core') + ' ' + (index + 1)),
                  el(
                    'div',
                    { style: { display: 'flex', gap: '4px' } },
                    el(
                      Button,
                      {
                        variant: 'tertiary',
                        isSmall: true,
                        label: __('Move up', 'headless-core'),
                        disabled: index === 0,
                        onClick: function () {
                          props.setAttributes({ items: moveRow(items, index, -1) });
                        },
                      },
                      '˄'
                    ),
                    el(
                      Button,
                      {
                        variant: 'tertiary',
                        isSmall: true,
                        label: __('Move down', 'headless-core'),
                        disabled: index === items.length - 1,
                        onClick: function () {
                          props.setAttributes({ items: moveRow(items, index, 1) });
                        },
                      },
                      '˅'
                    ),
                    el(
                      Button,
                      {
                        variant: 'tertiary',
                        isSmall: true,
                        isDestructive: true,
                        onClick: function () { removeItem(index); },
                        label: __('Remove point', 'headless-core')
                      },
                      trashSvg
                    )
                  )
                ),
                el(RichText, {
                  tagName: 'p',
                  value: (item && item.heading) || '',
                  onChange: function (v) { setItem(index, { heading: v }); },
                  placeholder: __('Point heading...', 'headless-core'),
                  allowedFormats: []
                }),
                el(RichText, {
                  tagName: 'p',
                  value: (item && item.paragraph) || '',
                  onChange: function (v) { setItem(index, { paragraph: v }); },
                  placeholder: __('Point paragraph...', 'headless-core'),
                  allowedFormats: []
                })
              );
            }),
            el(Button, { variant: 'primary', onClick: addItem }, '+ ', __('Add Point', 'headless-core')),
            el('div', { style: { marginTop: '16px' } },
              el(BaseControl, { label: __('Footer paragraph (optional)', 'headless-core') }),
              el(RichText, {
                tagName: 'p',
                value: props.attributes.footerText || '',
                onChange: function (v) { props.setAttributes({ footerText: v }); },
                placeholder: __('Add a paragraph below the points...', 'headless-core'),
                allowedFormats: []
              })
            )
          )
        ),
        el(
          'div',
          { style: { padding: '1rem', border: '1px dashed #ccc', borderRadius: '4px' } },
          el('strong', null, props.attributes.heading || __('Why Save With Us', 'headless-core')),
          el('p', { style: { marginTop: '8px', fontSize: '12px', color: '#555' } }, __('Rendered by React frontend.', 'headless-core'))
        )
      );
    },
    save: function () { return null; }
  });
})(window.wp.blocks, window.wp.blockEditor, window.wp.components, window.wp.element, window.wp.i18n);
