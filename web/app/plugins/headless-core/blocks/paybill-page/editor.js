(function (blocks, blockEditor, components, element, i18n) {
  var el = element.createElement;
  var Fragment = element.Fragment;
  var registerBlockType = blocks.registerBlockType;
  var useBlockProps = blockEditor.useBlockProps;
  var InspectorControls = blockEditor.InspectorControls;
  var RichText = blockEditor.RichText;
  var PanelBody = components.PanelBody;
  var TextControl = components.TextControl;
  var TextareaControl = components.TextareaControl;
  var BaseControl = components.BaseControl;
  var ColorPalette = components.ColorPalette;
  var __ = i18n.__;

  var palette = ['#EE6E2A', '#22ACB6', '#1f0026', '#F5F4EE', '#ffffff', '#00AFBB', '#000000'];

  registerBlockType('custom/paybill-page', {
    apiVersion: 3,
    title: __('Portsacco Paybill page', 'headless-core'),
    icon: 'money-alt',
    category: 'widgets',
    description: __('Official M-PESA paybill page. The paybill number is the page H1 for Google.', 'headless-core'),
    attributes: {
      kickerText: { type: 'string', default: 'Verify before you pay' },
      paybillNumber: { type: 'string', default: '854845' },
      paybillHeadline: { type: 'string', default: 'Ports DT Sacco official M-PESA Paybill' },
      paybillAccountHint: { type: 'string', default: 'Account number: your Ports SACCO membership number' },
      paybillWarning: { type: 'string', default: 'Ports DT Sacco will never ask you to pay a different paybill. Ignore anyone who sends another number — they are not us.' },
      howToHeading: { type: 'string', default: 'How to pay' },
      howToHtml: { type: 'string', default: '' },
      sectionBgColor: { type: 'string', default: '#F5F4EE' },
      cardBgColor: { type: 'string', default: '#ffffff' },
      accentColor: { type: 'string', default: '#EE6E2A' },
      numberColor: { type: 'string', default: '#1f0026' },
    },
    edit: function (props) {
      var a = props.attributes;
      var setAttributes = props.setAttributes;
      var blockProps = useBlockProps({ className: 'headless-paybill-page-block' });
      var number = a.paybillNumber || '854845';
      var accent = a.accentColor || '#EE6E2A';
      var bg = a.sectionBgColor || '#F5F4EE';
      var card = a.cardBgColor || '#ffffff';
      var numberColor = a.numberColor || '#1f0026';

      function colorField(label, key, fallback) {
        return el('div', { style: { marginBottom: '12px' } },
          el(BaseControl, { label: label }),
          el(ColorPalette, {
            value: a[key] || fallback,
            colors: palette.map(function (hex) { return { color: hex, name: hex }; }),
            onChange: function (c) {
              var next = {};
              next[key] = c || fallback;
              setAttributes(next);
            },
          })
        );
      }

      return el(
        Fragment,
        null,
        el(
          InspectorControls,
          null,
          el(
            PanelBody,
            { title: __('Paybill', 'headless-core'), initialOpen: true },
            el(TextControl, {
              label: __('Paybill number (page H1)', 'headless-core'),
              value: number,
              onChange: function (v) { setAttributes({ paybillNumber: v }); },
              help: __('This number is the H1 on /portsacco-paybill so members can Google it.', 'headless-core'),
            }),
            el(TextControl, {
              label: __('Kicker', 'headless-core'),
              value: a.kickerText || '',
              onChange: function (v) { setAttributes({ kickerText: v }); },
            }),
            el(TextControl, {
              label: __('Headline under the number', 'headless-core'),
              value: a.paybillHeadline || '',
              onChange: function (v) { setAttributes({ paybillHeadline: v }); },
            }),
            el(TextControl, {
              label: __('Account hint', 'headless-core'),
              value: a.paybillAccountHint || '',
              onChange: function (v) { setAttributes({ paybillAccountHint: v }); },
            }),
            el(TextareaControl, {
              label: __('Scam warning', 'headless-core'),
              value: a.paybillWarning || '',
              onChange: function (v) { setAttributes({ paybillWarning: v }); },
              rows: 4,
            }),
            el(TextControl, {
              label: __('How-to heading', 'headless-core'),
              value: a.howToHeading || '',
              onChange: function (v) { setAttributes({ howToHeading: v }); },
            })
          ),
          el(
            PanelBody,
            { title: __('Colors', 'headless-core'), initialOpen: false },
            colorField(__('Section background', 'headless-core'), 'sectionBgColor', '#F5F4EE'),
            colorField(__('Card background', 'headless-core'), 'cardBgColor', '#ffffff'),
            colorField(__('Accent / warning', 'headless-core'), 'accentColor', '#EE6E2A'),
            colorField(__('Number color', 'headless-core'), 'numberColor', '#1f0026')
          )
        ),
        el(
          'div',
          blockProps,
          el(
            'div',
            {
              style: {
                background: bg,
                padding: '28px 24px',
                borderRadius: '8px',
                border: '3px solid ' + accent,
              },
            },
            el(RichText, {
              tagName: 'p',
              value: a.kickerText || '',
              onChange: function (v) { setAttributes({ kickerText: v }); },
              placeholder: __('Kicker…', 'headless-core'),
              allowedFormats: [],
              style: { textTransform: 'uppercase', letterSpacing: '0.12em', fontSize: '12px', fontWeight: 700, color: accent, margin: '0 0 8px' },
            }),
            el('p', { style: { fontSize: '11px', margin: '0 0 6px', fontWeight: 600, color: '#64748b' } }, __('H1 — paybill number (Google)', 'headless-core')),
            el(RichText, {
              tagName: 'h1',
              value: number,
              onChange: function (v) { setAttributes({ paybillNumber: v }); },
              placeholder: '854845',
              allowedFormats: [],
              style: {
                fontSize: '56px',
                fontWeight: 900,
                letterSpacing: '0.14em',
                margin: '0 0 12px',
                color: numberColor,
                lineHeight: 1,
              },
            }),
            el(RichText, {
              tagName: 'p',
              value: a.paybillHeadline || '',
              onChange: function (v) { setAttributes({ paybillHeadline: v }); },
              placeholder: __('Official paybill headline…', 'headless-core'),
              allowedFormats: [],
              style: { fontSize: '20px', fontWeight: 800, margin: '0 0 16px', color: '#1f0026' },
            }),
            el(RichText, {
              tagName: 'p',
              value: a.paybillAccountHint || '',
              onChange: function (v) { setAttributes({ paybillAccountHint: v }); },
              placeholder: __('Account number hint…', 'headless-core'),
              allowedFormats: [],
              style: { fontSize: '15px', margin: '0 0 16px' },
            }),
            el(
              'div',
              { style: { background: card, borderLeft: '6px solid ' + accent, padding: '12px 16px', marginBottom: '16px' } },
              el(RichText, {
                tagName: 'p',
                value: a.paybillWarning || '',
                onChange: function (v) { setAttributes({ paybillWarning: v }); },
                placeholder: __('Scam warning…', 'headless-core'),
                allowedFormats: [],
                style: { margin: 0, fontWeight: 700, color: '#1f0026' },
              })
            ),
            el(RichText, {
              tagName: 'h3',
              value: a.howToHeading || '',
              onChange: function (v) { setAttributes({ howToHeading: v }); },
              placeholder: __('How to pay', 'headless-core'),
              allowedFormats: [],
              style: { fontSize: '18px', fontWeight: 800, margin: '0 0 8px' },
            }),
            el(RichText, {
              tagName: 'div',
              value: a.howToHtml || '',
              onChange: function (v) { setAttributes({ howToHtml: v }); },
              placeholder: __('How-to steps (numbered list)…', 'headless-core'),
              allowedFormats: ['core/bold', 'core/italic', 'core/list'],
              style: { fontSize: '15px', lineHeight: 1.5, background: card, padding: '12px 16px', borderRadius: '6px' },
            })
          )
        )
      );
    },
    save: function () {
      return null;
    },
  });
})(
  window.wp.blocks,
  window.wp.blockEditor,
  window.wp.components,
  window.wp.element,
  window.wp.i18n
);
