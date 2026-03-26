(function (blocks, blockEditor, components, element, i18n) {
  var el = element.createElement;
  var registerBlockType = blocks.registerBlockType;
  var useBlockProps = blockEditor.useBlockProps;
  var InspectorControls = blockEditor.InspectorControls;
  var RichText = blockEditor.RichText;
  var PanelBody = components.PanelBody;
  var Button = components.Button;
  var BaseControl = components.BaseControl;
  var ColorPalette = components.ColorPalette;
  var TextControl = components.TextControl;
  var __ = i18n.__;

  var DEFAULT_ITEMS = [
    { question: 'Can I pay off my loan early?', answer: 'Yes, you can pay off your loan early. Please contact us for details on early repayment options.' },
    { question: 'Can you offer refinancing?', answer: 'Yes, we offer refinancing options. Contact our team to discuss your refinancing needs.' },
    { question: 'When should I apply?', answer: 'You can apply at any time. Our application process is open throughout the year.' },
    { question: 'Where are you located?', answer: 'We have multiple branches. Please visit our contact page for branch locations and contact information.' },
  ];

  function normalizeItems(items) {
    if (!Array.isArray(items) || !items.length) {
      return DEFAULT_ITEMS.map(function (row) { return Object.assign({}, row); });
    }
    return items.map(function (row, i) {
      var d = DEFAULT_ITEMS[i] || { question: '', answer: '' };
      return {
        question: String((row && row.question) || d.question || ''),
        answer: String((row && row.answer) || d.answer || ''),
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

  registerBlockType('custom/asset-finance-faq', {
    apiVersion: 3,
    title: __('Asset Finance FAQ', 'headless-core'),
    icon: 'editor-help',
    category: 'widgets',
    description: __('FAQ accordion section for asset finance pages.', 'headless-core'),
    attributes: {
      title: { type: 'string', default: 'Frequently Asked Questions' },
      intro: { type: 'string', default: "For each loan product or service offered by Ports DT Sacco, we will need an FAQ's page." },
      backgroundColor: { type: 'string', default: '#eef0f3' },
      titleColor: { type: 'string', default: '#22ACB6' },
      textColor: { type: 'string', default: '#000000' },
      questionColor: { type: 'string', default: '#000000' },
      borderColor: { type: 'string', default: '#e5e7eb' },
      hoverBgColor: { type: 'string', default: '#f9fafb' },
      iconColor: { type: 'string', default: '#000000' },
      items: { type: 'array', default: DEFAULT_ITEMS },
    },
    edit: function (props) {
      var blockProps = useBlockProps({ className: 'headless-asset-finance-faq-block' });
      var items = normalizeItems(props.attributes.items);

      var palette = ['#22ACB6', '#ED6E2A', '#ed6e2a', '#ffffff', '#eef0f3', '#000000', '#e5e7eb', '#f9fafb', '#65605f', '#3b4e6b'];
      function colors() {
        return palette.map(function (hex) { return { color: hex, name: hex }; });
      }

      function setItem(index, patch) {
        var next = items.map(function (item, i) {
          if (i !== index) return item;
          return Object.assign({}, item || {}, patch);
        });
        props.setAttributes({ items: next });
      }

      function addItem() {
        props.setAttributes({ items: items.concat([{ question: '', answer: '' }]) });
      }

      function removeItem(index) {
        if (!window.confirm(__('Remove this FAQ?', 'headless-core'))) return;
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
            { title: __('Colors', 'headless-core'), initialOpen: false },
            el('div', null,
              el(BaseControl, { label: __('Background', 'headless-core') }),
              el(ColorPalette, {
                value: props.attributes.backgroundColor,
                colors: colors(),
                onChange: function (c) { props.setAttributes({ backgroundColor: c || '#eef0f3' }); },
              })
            ),
            el('div', null,
              el(BaseControl, { label: __('Title', 'headless-core') }),
              el(ColorPalette, {
                value: props.attributes.titleColor,
                colors: colors(),
                onChange: function (c) { props.setAttributes({ titleColor: c || '#22ACB6' }); },
              })
            ),
            el('div', null,
              el(BaseControl, { label: __('Intro / Answer text', 'headless-core') }),
              el(ColorPalette, {
                value: props.attributes.textColor,
                colors: colors(),
                onChange: function (c) { props.setAttributes({ textColor: c || '#000000' }); },
              })
            ),
            el('div', null,
              el(BaseControl, { label: __('Question text', 'headless-core') }),
              el(ColorPalette, {
                value: props.attributes.questionColor,
                colors: colors(),
                onChange: function (c) { props.setAttributes({ questionColor: c || '#000000' }); },
              })
            ),
            el('div', null,
              el(BaseControl, { label: __('Border', 'headless-core') }),
              el(ColorPalette, {
                value: props.attributes.borderColor,
                colors: colors(),
                onChange: function (c) { props.setAttributes({ borderColor: c || '#e5e7eb' }); },
              })
            ),
            el('div', null,
              el(BaseControl, { label: __('Hover background', 'headless-core') }),
              el(ColorPalette, {
                value: props.attributes.hoverBgColor,
                colors: colors(),
                onChange: function (c) { props.setAttributes({ hoverBgColor: c || '#f9fafb' }); },
              })
            ),
            el('div', null,
              el(BaseControl, { label: __('Icon color', 'headless-core') }),
              el(ColorPalette, {
                value: props.attributes.iconColor,
                colors: colors(),
                onChange: function (c) { props.setAttributes({ iconColor: c || '#000000' }); },
              })
            )
          )
        ),
        el(
          'div',
          { style: { padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px', background: props.attributes.backgroundColor || '#eef0f3' } },
          el('div', { style: { maxWidth: '1100px', margin: '0 auto' } },
            el(TextControl, {
              label: __('Title', 'headless-core'),
              value: props.attributes.title,
              onChange: function (v) { props.setAttributes({ title: v }); },
            }),
            el(TextControl, {
              label: __('Intro paragraph', 'headless-core'),
              value: props.attributes.intro,
              onChange: function (v) { props.setAttributes({ intro: v }); },
            }),
            el('h3', { style: { margin: '12px 0 8px', fontSize: '16px' } }, __('FAQs', 'headless-core')),
            items.map(function (item, index) {
              return el(
                'div',
                { key: index, style: { padding: '12px', border: '1px solid #eee', borderRadius: '8px', marginBottom: '10px', background: '#fff' } },
                el(
                  'div',
                  { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' } },
                  el('strong', null, __('FAQ', 'headless-core') + ' ' + (index + 1)),
                  el(
                    'div',
                    { style: { display: 'flex', gap: '6px' } },
                    el(Button, { variant: 'tertiary', isSmall: true, disabled: index === 0, onClick: function () { props.setAttributes({ items: moveRow(items, index, -1) }); } }, '˄'),
                    el(Button, { variant: 'tertiary', isSmall: true, disabled: index === items.length - 1, onClick: function () { props.setAttributes({ items: moveRow(items, index, 1) }); } }, '˅'),
                    el(Button, { variant: 'tertiary', isSmall: true, isDestructive: true, onClick: function () { removeItem(index); } }, '×')
                  )
                ),
                el(RichText, {
                  tagName: 'p',
                  value: (item && item.question) || '',
                  onChange: function (v) { setItem(index, { question: v }); },
                  placeholder: __('Question...', 'headless-core'),
                  allowedFormats: [],
                  style: { fontWeight: 800, marginBottom: '8px', color: props.attributes.questionColor || '#000000' },
                }),
                el(RichText, {
                  tagName: 'p',
                  value: (item && item.answer) || '',
                  onChange: function (v) { setItem(index, { answer: v }); },
                  placeholder: __('Answer...', 'headless-core'),
                  allowedFormats: [],
                  style: { color: props.attributes.textColor || '#000000' },
                })
              );
            }),
            el(Button, { variant: 'primary', onClick: addItem }, '+ ', __('Add FAQ', 'headless-core'))
          )
        ),
        el(
          'div',
          { style: { padding: '1rem', border: '1px dashed #ccc', borderRadius: '4px', background: props.attributes.backgroundColor || '#eef0f3' } },
          el('strong', { style: { color: props.attributes.titleColor || '#22ACB6' } }, props.attributes.title || ''),
          el('p', { style: { marginTop: '8px', marginBottom: 0, color: props.attributes.textColor || '#000' } }, __('Rendered by React frontend.', 'headless-core'))
        )
      );
    },
    save: function () { return null; },
  });
})(window.wp.blocks, window.wp.blockEditor, window.wp.components, window.wp.element, window.wp.i18n);

