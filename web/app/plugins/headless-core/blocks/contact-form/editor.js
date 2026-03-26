(function (blocks, blockEditor, components, element, i18n) {
  var el = element.createElement;
  var registerBlockType = blocks.registerBlockType;
  var useBlockProps = blockEditor.useBlockProps;
  var InspectorControls = blockEditor.InspectorControls;
  var PanelBody = components.PanelBody;
  var TextControl = components.TextControl;
  var TextareaControl = components.TextareaControl;
  var BaseControl = components.BaseControl;
  var ColorPalette = components.ColorPalette;
  var __ = i18n.__;

  registerBlockType('custom/contact-form', {
    apiVersion: 3,
    title: __('Contact Form', 'headless-core'),
    icon: 'email-alt',
    category: 'widgets',
    description: __('Contact form section that sends via WP Mail SMTP.', 'headless-core'),
    attributes: {
      title: { type: 'string', default: 'Get in touch.' },
      subtitle: { type: 'string', default: 'Reach out to us and we will respond as soon as we can.' },
      formName: { type: 'string', default: 'Contact Form' },
      backgroundColor: { type: 'string', default: '#ffffff' },
      titleColor: { type: 'string', default: '#22ABB5' },
      textColor: { type: 'string', default: '#333333' },
      labelColor: { type: 'string', default: '#333333' },
      inputBorderColor: { type: 'string', default: '#e8e8e8' },
      buttonLabel: { type: 'string', default: 'SUBMIT' },
      buttonBgColor: { type: 'string', default: '#ED6E2A' },
      buttonTextColor: { type: 'string', default: '#ffffff' },
      buttonHoverBgColor: { type: 'string', default: '#22ACB6' },
      buttonHoverTextColor: { type: 'string', default: '#ffffff' },
      successMessage: { type: 'string', default: 'Thanks — we have received your message.' },
    },
    edit: function (props) {
      var blockProps = useBlockProps({ className: 'headless-contact-form-block' });
      var colors = ['#22ACB6', '#ED6E2A', '#ffffff', '#eef0f3', '#000000', '#e8e8e8', '#65605f', '#3b4e6b'];
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
            el(BaseControl, { label: __('Background', 'headless-core') }),
            el(ColorPalette, { value: props.attributes.backgroundColor, colors: palette(), onChange: function (c) { props.setAttributes({ backgroundColor: c || '#ffffff' }); } }),
            el(BaseControl, { label: __('Title', 'headless-core') }),
            el(ColorPalette, { value: props.attributes.titleColor, colors: palette(), onChange: function (c) { props.setAttributes({ titleColor: c || '#22ABB5' }); } }),
            el(BaseControl, { label: __('Text / labels', 'headless-core') }),
            el(ColorPalette, { value: props.attributes.textColor, colors: palette(), onChange: function (c) { props.setAttributes({ textColor: c || '#333333' }); } }),
            el(BaseControl, { label: __('Input border', 'headless-core') }),
            el(ColorPalette, { value: props.attributes.inputBorderColor, colors: palette(), onChange: function (c) { props.setAttributes({ inputBorderColor: c || '#e8e8e8' }); } }),
            el(BaseControl, { label: __('Button background', 'headless-core') }),
            el(ColorPalette, { value: props.attributes.buttonBgColor, colors: palette(), onChange: function (c) { props.setAttributes({ buttonBgColor: c || '#ED6E2A' }); } }),
            el(BaseControl, { label: __('Button text', 'headless-core') }),
            el(ColorPalette, { value: props.attributes.buttonTextColor, colors: palette(), onChange: function (c) { props.setAttributes({ buttonTextColor: c || '#ffffff' }); } }),
            el(BaseControl, { label: __('Button hover background', 'headless-core') }),
            el(ColorPalette, { value: props.attributes.buttonHoverBgColor, colors: palette(), onChange: function (c) { props.setAttributes({ buttonHoverBgColor: c || '#22ACB6' }); } })
          )
        ),
        el(
          'div',
          { style: { padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px', background: props.attributes.backgroundColor || '#ffffff' } },
          el('div', { style: { maxWidth: '1100px', margin: '0 auto' } },
            el(TextControl, { label: __('Title', 'headless-core'), value: props.attributes.title, onChange: function (v) { props.setAttributes({ title: v }); } }),
            el(TextareaControl, { label: __('Subtitle', 'headless-core'), value: props.attributes.subtitle, onChange: function (v) { props.setAttributes({ subtitle: v }); } }),
            el(TextControl, { label: __('Form name (for email subject)', 'headless-core'), value: props.attributes.formName, onChange: function (v) { props.setAttributes({ formName: v }); } }),
            el(TextControl, { label: __('Submit button label', 'headless-core'), value: props.attributes.buttonLabel, onChange: function (v) { props.setAttributes({ buttonLabel: v }); } }),
            el(TextControl, { label: __('Success message', 'headless-core'), value: props.attributes.successMessage, onChange: function (v) { props.setAttributes({ successMessage: v }); } }),
            el('div', { style: { marginTop: '12px', display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: '10px' } },
              el('div', null, el('strong', null, __('Name', 'headless-core')), el('div', { style: { height: '40px', border: '1px solid ' + (props.attributes.inputBorderColor || '#e8e8e8'), background: '#fff' } })),
              el('div', null, el('strong', null, __('Email', 'headless-core')), el('div', { style: { height: '40px', border: '1px solid ' + (props.attributes.inputBorderColor || '#e8e8e8'), background: '#fff' } })),
              el('div', null, el('strong', null, __('Phone', 'headless-core')), el('div', { style: { height: '40px', border: '1px solid ' + (props.attributes.inputBorderColor || '#e8e8e8'), background: '#fff' } })),
              el('div', null, el('strong', null, __('Subject', 'headless-core')), el('div', { style: { height: '40px', border: '1px solid ' + (props.attributes.inputBorderColor || '#e8e8e8'), background: '#fff' } })),
              el('div', { style: { gridColumn: '1 / span 2' } }, el('strong', null, __('Message', 'headless-core')), el('div', { style: { height: '90px', border: '1px solid ' + (props.attributes.inputBorderColor || '#e8e8e8'), background: '#fff' } }))
            )
          )
        )
      );
    },
    save: function () { return null; },
  });
})(window.wp.blocks, window.wp.blockEditor, window.wp.components, window.wp.element, window.wp.i18n);

