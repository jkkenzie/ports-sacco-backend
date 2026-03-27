(function (blocks, blockEditor, components, element, i18n) {
  var el = element.createElement;
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

  registerBlockType('custom/home-about', {
    apiVersion: 3,
    title: __('Home About', 'headless-core'),
    icon: 'info-outline',
    category: 'widgets',
    description: __('Homepage About section with animated scroll button.', 'headless-core'),
    attributes: {
      sectionId: { type: 'string', default: 'about' },
      barBgColor: { type: 'string', default: '#22acb6' },
      curvedRectColor: { type: 'string', default: '#ffffff' },
      scrollButtonBg: { type: 'string', default: '#22ACB6' },
      scrollButtonArrow: { type: 'string', default: '#ffffff' },
      buttonBgColor: { type: 'string', default: '#EE6E2A' },
      buttonTextColor: { type: 'string', default: '#ffffff' },
      badgeText: { type: 'string', default: 'ABOUT US' },
      bodyText: { type: 'string', default: 'Ports DT Sacco, your trusted financial partner since 1966, is a Tier 1 licensed deposit-taking Sacco regulated by the Sacco Society Regulatory Authority (SASRA)...' },
      bodyTextColor: { type: 'string', default: '#3b4e6b' },
      readMoreLabel: { type: 'string', default: 'READ MORE' },
      readMoreUrl: { type: 'string', default: '/about-us' },
      readMoreTextColor: { type: 'string', default: '#3b4e6b' },
      readMoreHoverColor: { type: 'string', default: '#22ACB6' },
      readMoreCircleColor: { type: 'string', default: '#22ACB6' },
    },
    edit: function (props) {
      var blockProps = useBlockProps({ className: 'headless-home-about-block' });
      var colors = ['#22ACB6', '#22acb6', '#EE6E2A', '#ffffff', '#000000', '#eef0f3', '#65605f', '#3b4e6b'];
      function palette() {
        return colors.map(function (hex) { return { color: hex, name: hex }; });
      }

      var a = props.attributes;

      return el(
        'div',
        blockProps,
        el(
          InspectorControls,
          null,
          el(
            PanelBody,
            { title: __('Colors', 'headless-core'), initialOpen: false },
            el(BaseControl, { label: __('Top bar background', 'headless-core') }),
            el(ColorPalette, { value: a.barBgColor, colors: palette(), onChange: function (c) { props.setAttributes({ barBgColor: c || '#22acb6' }); } }),
            el(BaseControl, { label: __('Curved cutout color', 'headless-core') }),
            el(ColorPalette, { value: a.curvedRectColor, colors: palette(), onChange: function (c) { props.setAttributes({ curvedRectColor: c || '#ffffff' }); } }),
            el(BaseControl, { label: __('Badge background', 'headless-core') }),
            el(ColorPalette, { value: a.buttonBgColor, colors: palette(), onChange: function (c) { props.setAttributes({ buttonBgColor: c || '#EE6E2A' }); } }),
            el(BaseControl, { label: __('Badge text', 'headless-core') }),
            el(ColorPalette, { value: a.buttonTextColor, colors: palette(), onChange: function (c) { props.setAttributes({ buttonTextColor: c || '#ffffff' }); } }),
            el(BaseControl, { label: __('Body text', 'headless-core') }),
            el(ColorPalette, { value: a.bodyTextColor, colors: palette(), onChange: function (c) { props.setAttributes({ bodyTextColor: c || '#3b4e6b' }); } }),
            el(BaseControl, { label: __('Read more text', 'headless-core') }),
            el(ColorPalette, { value: a.readMoreTextColor, colors: palette(), onChange: function (c) { props.setAttributes({ readMoreTextColor: c || '#3b4e6b' }); } }),
            el(BaseControl, { label: __('Read more hover text', 'headless-core') }),
            el(ColorPalette, { value: a.readMoreHoverColor, colors: palette(), onChange: function (c) { props.setAttributes({ readMoreHoverColor: c || '#22ACB6' }); } }),
            el(BaseControl, { label: __('Read more circle', 'headless-core') }),
            el(ColorPalette, { value: a.readMoreCircleColor, colors: palette(), onChange: function (c) { props.setAttributes({ readMoreCircleColor: c || '#22ACB6' }); } })
          )
        ),
        el(
          'div',
          { style: { border: '1px solid #e5e7eb', borderRadius: '10px', overflow: 'hidden', background: '#fff' } },
          el('div', { style: { height: '38px', background: a.barBgColor || '#22acb6' } }),
          el('div', { style: { padding: '16px' } },
            el(TextControl, { label: __('Section ID', 'headless-core'), value: a.sectionId, onChange: function (v) { props.setAttributes({ sectionId: v }); }, help: __('Used as the section id for hash links (e.g. #about).', 'headless-core') }),
            el(TextControl, { label: __('Read more URL', 'headless-core'), value: a.readMoreUrl, onChange: function (v) { props.setAttributes({ readMoreUrl: v }); } }),
            el(RichText, {
              tagName: 'div',
              value: a.badgeText || '',
              onChange: function (v) { props.setAttributes({ badgeText: v }); },
              placeholder: __('Badge text…', 'headless-core'),
              allowedFormats: [],
              style: { display: 'inline-block', padding: '6px 18px', borderRadius: '999px', background: a.buttonBgColor, color: a.buttonTextColor, fontWeight: 700, fontSize: '12px', marginBottom: '12px' }
            }),
            el(TextareaControl, { label: __('Body text', 'headless-core'), value: a.bodyText, onChange: function (v) { props.setAttributes({ bodyText: v }); } }),
            el('div', { style: { marginTop: '10px' } },
              el(TextControl, { label: __('Read more label', 'headless-core'), value: a.readMoreLabel, onChange: function (v) { props.setAttributes({ readMoreLabel: v }); } })
            ),
            el('div', { style: { marginTop: '10px', fontSize: '12px', color: '#666' } }, __('The animated scroll button renders on the frontend.', 'headless-core'))
          )
        )
      );
    },
    save: function () { return null; },
  });
})(window.wp.blocks, window.wp.blockEditor, window.wp.components, window.wp.element, window.wp.i18n);

