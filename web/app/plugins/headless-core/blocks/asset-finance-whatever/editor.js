(function (blocks, blockEditor, components, element, i18n) {
  var el = element.createElement;
  var registerBlockType = blocks.registerBlockType;
  var useBlockProps = blockEditor.useBlockProps;
  var InspectorControls = blockEditor.InspectorControls;
  var PanelBody = components.PanelBody;
  var TextControl = components.TextControl;
  var BaseControl = components.BaseControl;
  var ColorPalette = components.ColorPalette;
  var __ = i18n.__;

  registerBlockType('custom/asset-finance-whatever', {
    apiVersion: 3,
    title: __('Asset Finance CTA (Whatever)', 'headless-core'),
    icon: 'megaphone',
    category: 'widgets',
    description: __('Asset finance CTA section with title + button.', 'headless-core'),
    attributes: {
      title: { type: 'string', default: 'Get financing for whatever you need now' },
      backgroundColor: { type: 'string', default: '#22ACB6' },
      titleColor: { type: 'string', default: '#ffffff' },
      buttonLabel: { type: 'string', default: 'ENQUIRE NOW' },
      buttonUrl: { type: 'string', default: '#' },
      buttonBgColor: { type: 'string', default: '#ed6e2a' },
      buttonTextColor: { type: 'string', default: '#ffffff' },
      buttonBorderColor: { type: 'string', default: '#22ACB6' },
      buttonHoverBgColor: { type: 'string', default: '#ffffff' },
      buttonHoverTextColor: { type: 'string', default: '#ed6e2a' },
      buttonHoverBorderColor: { type: 'string', default: '#22ACB6' },
    },
    edit: function (props) {
      var blockProps = useBlockProps({ className: 'headless-asset-finance-whatever-block' });

      var colors = ['#22ACB6', '#ED6E2A', '#ed6e2a', '#ffffff', '#eef0f3', '#000000', '#65605f', '#3b4e6b'];
      function paletteValue(v, fallback) {
        var s = String(v || '').trim();
        return s || fallback;
      }

      var backgroundColor = paletteValue(props.attributes.backgroundColor, '#22ACB6');
      var titleColor = paletteValue(props.attributes.titleColor, '#ffffff');
      var buttonBgColor = paletteValue(props.attributes.buttonBgColor, '#ed6e2a');
      var buttonTextColor = paletteValue(props.attributes.buttonTextColor, '#ffffff');
      var buttonBorderColor = paletteValue(props.attributes.buttonBorderColor, '#22ACB6');
      var buttonHoverBgColor = paletteValue(props.attributes.buttonHoverBgColor, '#ffffff');
      var buttonHoverTextColor = paletteValue(props.attributes.buttonHoverTextColor, '#ed6e2a');
      var buttonHoverBorderColor = paletteValue(props.attributes.buttonHoverBorderColor, '#22ACB6');

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
              label: __('Title', 'headless-core'),
              value: props.attributes.title,
              onChange: function (v) { props.setAttributes({ title: v }); },
            }),
            el(TextControl, {
              label: __('Button label', 'headless-core'),
              value: props.attributes.buttonLabel,
              onChange: function (v) { props.setAttributes({ buttonLabel: v }); },
            }),
            el(TextControl, {
              label: __('Button URL', 'headless-core'),
              value: props.attributes.buttonUrl,
              onChange: function (v) { props.setAttributes({ buttonUrl: v }); },
              help: __('Use a full URL, /path, or #hash.', 'headless-core'),
            })
          ),
          el(
            PanelBody,
            { title: __('Colors', 'headless-core'), initialOpen: true },
            el('div', null,
              el(BaseControl, { label: __('Background color', 'headless-core') }),
              el(ColorPalette, {
                value: backgroundColor,
                colors: colors.map(function (hex) { return { color: hex, name: hex }; }),
                onChange: function (c) { props.setAttributes({ backgroundColor: c || '#22ACB6' }); },
              })
            ),
            el('div', null,
              el(BaseControl, { label: __('Title color', 'headless-core') }),
              el(ColorPalette, {
                value: titleColor,
                colors: colors.map(function (hex) { return { color: hex, name: hex }; }),
                onChange: function (c) { props.setAttributes({ titleColor: c || '#ffffff' }); },
              })
            ),
            el('div', null,
              el(BaseControl, { label: __('Button background', 'headless-core') }),
              el(ColorPalette, {
                value: buttonBgColor,
                colors: colors.map(function (hex) { return { color: hex, name: hex }; }),
                onChange: function (c) { props.setAttributes({ buttonBgColor: c || '#ed6e2a' }); },
              })
            ),
            el('div', null,
              el(BaseControl, { label: __('Button text', 'headless-core') }),
              el(ColorPalette, {
                value: buttonTextColor,
                colors: colors.map(function (hex) { return { color: hex, name: hex }; }),
                onChange: function (c) { props.setAttributes({ buttonTextColor: c || '#ffffff' }); },
              })
            ),
            el('div', null,
              el(BaseControl, { label: __('Button border', 'headless-core') }),
              el(ColorPalette, {
                value: buttonBorderColor,
                colors: colors.map(function (hex) { return { color: hex, name: hex }; }),
                onChange: function (c) { props.setAttributes({ buttonBorderColor: c || '#22ACB6' }); },
              })
            ),
            el('div', { style: { marginTop: '10px' } },
              el('strong', null, __('Button hover', 'headless-core'))
            ),
            el('div', null,
              el(BaseControl, { label: __('Hover background', 'headless-core') }),
              el(ColorPalette, {
                value: buttonHoverBgColor,
                colors: colors.map(function (hex) { return { color: hex, name: hex }; }),
                onChange: function (c) { props.setAttributes({ buttonHoverBgColor: c || '#ffffff' }); },
              })
            ),
            el('div', null,
              el(BaseControl, { label: __('Hover text', 'headless-core') }),
              el(ColorPalette, {
                value: buttonHoverTextColor,
                colors: colors.map(function (hex) { return { color: hex, name: hex }; }),
                onChange: function (c) { props.setAttributes({ buttonHoverTextColor: c || '#ed6e2a' }); },
              })
            ),
            el('div', null,
              el(BaseControl, { label: __('Hover border', 'headless-core') }),
              el(ColorPalette, {
                value: buttonHoverBorderColor,
                colors: colors.map(function (hex) { return { color: hex, name: hex }; }),
                onChange: function (c) { props.setAttributes({ buttonHoverBorderColor: c || '#22ACB6' }); },
              })
            )
          )
        ),
        el(
          'div',
          { style: { padding: '1rem', border: '1px dashed #ccc', borderRadius: '4px', background: backgroundColor } },
          el('div', { style: { textAlign: 'center' } },
            el('div', { style: { fontWeight: 800, fontSize: '20px', marginBottom: '12px', color: titleColor } }, props.attributes.title || ''),
            el(
              'span',
              {
                style: {
                  display: 'inline-block',
                  padding: '10px 22px',
                  borderRadius: '999px',
                  background: buttonBgColor,
                  color: buttonTextColor,
                  border: '2px solid ' + buttonBorderColor,
                  fontWeight: 700,
                  fontSize: '12px',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                },
              },
              props.attributes.buttonLabel || __('ENQUIRE NOW', 'headless-core')
            )
          )
        )
      );
    },
    save: function () { return null; },
  });
})(window.wp.blocks, window.wp.blockEditor, window.wp.components, window.wp.element, window.wp.i18n);

