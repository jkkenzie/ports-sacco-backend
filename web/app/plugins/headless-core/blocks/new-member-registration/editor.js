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

  registerBlockType('custom/new-member-registration', {
    apiVersion: 3,
    title: __('New Member Registration', 'headless-core'),
    icon: 'id-alt',
    category: 'widgets',
    description: __('Membership onboarding application form (Individual, Joint, or Group/Company).', 'headless-core'),
    attributes: {
      title: { type: 'string', default: 'Join Us' },
      subtitle: { type: 'string', default: '' },
      formName: { type: 'string', default: 'Onboarding Form' },
      backgroundColor: { type: 'string', default: '#ffffff' },
      titleColor: { type: 'string', default: '#22ABB5' },
      textColor: { type: 'string', default: '#333333' },
      labelColor: { type: 'string', default: '#333333' },
      inputBorderColor: { type: 'string', default: '#e8e8e8' },
      buttonLabel: { type: 'string', default: 'Submit Details' },
      buttonBgColor: { type: 'string', default: '#ED6E2A' },
      buttonTextColor: { type: 'string', default: '#ffffff' },
      buttonHoverBgColor: { type: 'string', default: '#22ACB6' },
      buttonHoverTextColor: { type: 'string', default: '#ffffff' },
      successMessage: {
        type: 'string',
        default:
          'Thank you for submitting your details! We are processing your member application and will be in touch with you shortly.',
      },
    },
    edit: function (props) {
      var blockProps = useBlockProps({ className: 'headless-new-member-registration-block' });
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
            el(
              'p',
              {
                style: {
                  marginTop: '12px',
                  padding: '12px',
                  background: '#f0f9fa',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  fontSize: '13px',
                },
              },
              __('Full onboarding form (account type, personal details, uploads, etc.) renders on the frontend.', 'headless-core')
            )
          )
        )
      );
    },
    save: function () { return null; },
  });
})(window.wp.blocks, window.wp.blockEditor, window.wp.components, window.wp.element, window.wp.i18n);
