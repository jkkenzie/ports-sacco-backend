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

  registerBlockType('custom/contact-map', {
    apiVersion: 3,
    title: __('Contact Map', 'headless-core'),
    icon: 'location-alt',
    category: 'widgets',
    description: __('Map/location section with editable address and links.', 'headless-core'),
    attributes: {
      title: { type: 'string', default: 'Our Location' },
      address: { type: 'string', default: 'Mombasa, Kenya' },
      embedUrl: { type: 'string', default: '' },
      directionsUrl: { type: 'string', default: '' },
      backgroundColor: { type: 'string', default: '#ffffff' },
      titleColor: { type: 'string', default: '#22ACB6' },
      textColor: { type: 'string', default: '#000000' },
      cardBgColor: { type: 'string', default: '#ffffff' },
    },
    edit: function (props) {
      var blockProps = useBlockProps({ className: 'headless-contact-map-block' });
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
            el(BaseControl, { label: __('Section background', 'headless-core') }),
            el(ColorPalette, { value: props.attributes.backgroundColor, colors: palette(), onChange: function (c) { props.setAttributes({ backgroundColor: c || '#ffffff' }); } }),
            el(BaseControl, { label: __('Card background', 'headless-core') }),
            el(ColorPalette, { value: props.attributes.cardBgColor, colors: palette(), onChange: function (c) { props.setAttributes({ cardBgColor: c || '#ffffff' }); } }),
            el(BaseControl, { label: __('Title color', 'headless-core') }),
            el(ColorPalette, { value: props.attributes.titleColor, colors: palette(), onChange: function (c) { props.setAttributes({ titleColor: c || '#22ACB6' }); } }),
            el(BaseControl, { label: __('Text color', 'headless-core') }),
            el(ColorPalette, { value: props.attributes.textColor, colors: palette(), onChange: function (c) { props.setAttributes({ textColor: c || '#000000' }); } })
          )
        ),
        el(
          'div',
          { style: { padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px', background: props.attributes.backgroundColor || '#fff' } },
          el('div', { style: { maxWidth: '1100px', margin: '0 auto', background: props.attributes.cardBgColor || '#fff', padding: '12px', borderRadius: '8px' } },
            el(TextControl, { label: __('Title', 'headless-core'), value: props.attributes.title, onChange: function (v) { props.setAttributes({ title: v }); } }),
            el(TextareaControl, { label: __('Address / location details', 'headless-core'), value: props.attributes.address, onChange: function (v) { props.setAttributes({ address: v }); } }),
            el(TextControl, { label: __('Google Maps embed URL', 'headless-core'), value: props.attributes.embedUrl, onChange: function (v) { props.setAttributes({ embedUrl: v }); }, help: __('Use the full Google Maps embed URL from Share > Embed map.', 'headless-core') }),
            el(TextControl, { label: __('Directions URL (optional)', 'headless-core'), value: props.attributes.directionsUrl, onChange: function (v) { props.setAttributes({ directionsUrl: v }); } }),
            el('div', { style: { marginTop: '10px', height: '180px', border: '1px dashed #ccc', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' } },
              props.attributes.embedUrl ? __('Map preview will render on frontend.', 'headless-core') : __('Add embed URL to render map on frontend.', 'headless-core')
            )
          )
        )
      );
    },
    save: function () { return null; },
  });
})(window.wp.blocks, window.wp.blockEditor, window.wp.components, window.wp.element, window.wp.i18n);

