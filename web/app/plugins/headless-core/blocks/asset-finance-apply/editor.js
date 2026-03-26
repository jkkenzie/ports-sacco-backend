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

  registerBlockType('custom/asset-finance-apply', {
    apiVersion: 3,
    title: __('Asset Finance Apply Form', 'headless-core'),
    icon: 'email',
    category: 'widgets',
    description: __('Application/contact form that sends email via wp_mail (WP Mail SMTP).', 'headless-core'),
    attributes: {
      title: { type: 'string', default: 'Apply Now!' },
      backgroundColor: { type: 'string', default: '#eef0f3' },
      titleColor: { type: 'string', default: '#ED6E2A' },
      labelColor: { type: 'string', default: '#000000' },
      inputBorderColor: { type: 'string', default: '#e8e8e8' },
      buttonLabel: { type: 'string', default: 'SUBMIT YOUR APPLICATION' },
      buttonBgColor: { type: 'string', default: '#ED6E2A' },
      buttonTextColor: { type: 'string', default: '#ffffff' },
      buttonHoverBgColor: { type: 'string', default: '#22ACB6' },
      buttonHoverTextColor: { type: 'string', default: '#ffffff' },
      successMessage: { type: 'string', default: 'Thanks — we received your application.' },
    },
    edit: function (props) {
      var blockProps = useBlockProps({ className: 'headless-asset-finance-apply-block' });
      var colors = ['#22ACB6', '#ED6E2A', '#ed6e2a', '#ffffff', '#eef0f3', '#000000', '#e8e8e8', '#65605f', '#3b4e6b'];
      function palette() {
        return colors.map(function (hex) { return { color: hex, name: hex }; });
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
                colors: palette(),
                onChange: function (c) { props.setAttributes({ backgroundColor: c || '#eef0f3' }); },
              })
            ),
            el('div', null,
              el(BaseControl, { label: __('Title', 'headless-core') }),
              el(ColorPalette, {
                value: props.attributes.titleColor,
                colors: palette(),
                onChange: function (c) { props.setAttributes({ titleColor: c || '#ED6E2A' }); },
              })
            ),
            el('div', null,
              el(BaseControl, { label: __('Label text', 'headless-core') }),
              el(ColorPalette, {
                value: props.attributes.labelColor,
                colors: palette(),
                onChange: function (c) { props.setAttributes({ labelColor: c || '#000000' }); },
              })
            ),
            el('div', null,
              el(BaseControl, { label: __('Input border', 'headless-core') }),
              el(ColorPalette, {
                value: props.attributes.inputBorderColor,
                colors: palette(),
                onChange: function (c) { props.setAttributes({ inputBorderColor: c || '#e8e8e8' }); },
              })
            ),
            el('div', null,
              el(BaseControl, { label: __('Button background', 'headless-core') }),
              el(ColorPalette, {
                value: props.attributes.buttonBgColor,
                colors: palette(),
                onChange: function (c) { props.setAttributes({ buttonBgColor: c || '#ED6E2A' }); },
              })
            ),
            el('div', null,
              el(BaseControl, { label: __('Button text', 'headless-core') }),
              el(ColorPalette, {
                value: props.attributes.buttonTextColor,
                colors: palette(),
                onChange: function (c) { props.setAttributes({ buttonTextColor: c || '#ffffff' }); },
              })
            ),
            el('div', null,
              el(BaseControl, { label: __('Button hover background', 'headless-core') }),
              el(ColorPalette, {
                value: props.attributes.buttonHoverBgColor,
                colors: palette(),
                onChange: function (c) { props.setAttributes({ buttonHoverBgColor: c || '#22ACB6' }); },
              })
            ),
            el('div', null,
              el(BaseControl, { label: __('Button hover text', 'headless-core') }),
              el(ColorPalette, {
                value: props.attributes.buttonHoverTextColor,
                colors: palette(),
                onChange: function (c) { props.setAttributes({ buttonHoverTextColor: c || '#ffffff' }); },
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
            el('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '12px', marginTop: '10px' } },
              el('div', null,
                el('strong', null, __('Name', 'headless-core')),
                el('div', { style: { height: '40px', border: '1px solid ' + (props.attributes.inputBorderColor || '#e8e8e8'), background: '#fff' } })
              ),
              el('div', null,
                el('strong', null, __('Email', 'headless-core')),
                el('div', { style: { height: '40px', border: '1px solid ' + (props.attributes.inputBorderColor || '#e8e8e8'), background: '#fff' } })
              ),
              el('div', null,
                el('strong', null, __('Phone', 'headless-core')),
                el('div', { style: { height: '40px', border: '1px solid ' + (props.attributes.inputBorderColor || '#e8e8e8'), background: '#fff' } })
              )
            ),
            el('div', { style: { marginTop: '12px' } },
              el('strong', null, __('Amount', 'headless-core')),
              el('div', { style: { height: '40px', border: '1px solid ' + (props.attributes.inputBorderColor || '#e8e8e8'), background: '#fff' } })
            ),
            el('div', { style: { marginTop: '14px' } },
              el(TextControl, {
                label: __('Button label', 'headless-core'),
                value: props.attributes.buttonLabel,
                onChange: function (v) { props.setAttributes({ buttonLabel: v }); },
              }),
              el(TextControl, {
                label: __('Success message', 'headless-core'),
                value: props.attributes.successMessage,
                onChange: function (v) { props.setAttributes({ successMessage: v }); },
              }),
              el('div', { style: { marginTop: '10px' } },
                el('span', {
                  style: {
                    display: 'block',
                    textAlign: 'center',
                    padding: '14px 16px',
                    fontWeight: 800,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    background: props.attributes.buttonBgColor || '#ED6E2A',
                    color: props.attributes.buttonTextColor || '#ffffff',
                  }
                }, props.attributes.buttonLabel || __('SUBMIT YOUR APPLICATION', 'headless-core'))
              )
            )
          )
        ),
        el(
          'div',
          { style: { padding: '1rem', border: '1px dashed #ccc', borderRadius: '4px', background: props.attributes.backgroundColor || '#eef0f3' } },
          el('div', { style: { fontWeight: 800, fontSize: '20px', color: props.attributes.titleColor || '#ED6E2A', marginBottom: '10px' } }, props.attributes.title || ''),
          el('div', { style: { fontSize: '12px', color: '#555' } }, __('Rendered by React frontend and submits to WP Mail SMTP.', 'headless-core'))
        )
      );
    },
    save: function () { return null; },
  });
})(window.wp.blocks, window.wp.blockEditor, window.wp.components, window.wp.element, window.wp.i18n);

