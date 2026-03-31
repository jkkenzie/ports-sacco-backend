(function (blocks, blockEditor, components, element, i18n) {
  var el = element.createElement;
  var registerBlockType = blocks.registerBlockType;
  var useBlockProps = blockEditor.useBlockProps;
  var InspectorControls = blockEditor.InspectorControls;
  var PanelBody = components.PanelBody;
  var BaseControl = components.BaseControl;
  var ColorPalette = components.ColorPalette;
  var MediaUpload = blockEditor.MediaUpload;
  var MediaUploadCheck = blockEditor.MediaUploadCheck;
  var Button = components.Button;
  var __ = i18n.__;

  registerBlockType('custom/header-main', {
    apiVersion: 3,
    title: __('Header - Main', 'headless-core'),
    icon: 'layout',
    category: 'widgets',
    description: __('Editable main header settings (logo + background). Menu is controlled via WP Menus.', 'headless-core'),
    attributes: {
      bgColor: { type: 'string', default: '#ffffff' },
      logoId: { type: 'number', default: 0 },
    },
    edit: function (props) {
      var a = props.attributes;
      var blockProps = useBlockProps({ className: 'headless-header-main-block' });
      var colors = ['#ffffff', '#000000', '#F5F4EE', '#22ACB6', '#EE6E2A', '#e8e8e8'];
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
            { title: __('Main header colors', 'headless-core'), initialOpen: true },
            el(BaseControl, { label: __('Background', 'headless-core') }),
            el(ColorPalette, { value: a.bgColor, colors: palette(), onChange: function (c) { props.setAttributes({ bgColor: c || '#ffffff' }); } })
          )
        ),
        el(
          'div',
          { style: { padding: '14px', border: '1px solid #e5e7eb', borderRadius: '10px', background: a.bgColor || '#fff' } },
          el('div', { style: { fontWeight: 800, marginBottom: '8px' } }, __('Main header (preview)', 'headless-core')),
          el('div', { style: { display: 'flex', gap: '12px', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' } },
            el('div', null, a.logoId ? __('Logo: attachment #', 'headless-core') + a.logoId : __('Logo: default inline SVG', 'headless-core')),
            el('div', { style: { color: '#555', fontSize: '12px' } }, __('Menu links come from the Primary Menu.', 'headless-core'))
          )
        ),
        el(
          'div',
          { style: { marginTop: '12px', padding: '12px', borderRadius: '10px', border: '1px dashed #cbd5e1', background: '#fff' } },
          el('div', { style: { fontWeight: 800, marginBottom: '8px' } }, __('Edit main header (inline)', 'headless-core')),
          el(
            MediaUploadCheck,
            null,
            el(MediaUpload, {
              onSelect: function (media) { props.setAttributes({ logoId: media && media.id ? Number(media.id) : 0 }); },
              allowedTypes: ['image', 'image/svg+xml'],
              value: a.logoId || 0,
              render: function (obj) {
                return el(
                  'div',
                  null,
                  el(Button, { variant: 'primary', onClick: obj.open }, a.logoId ? __('Replace logo', 'headless-core') : __('Select logo', 'headless-core')),
                  a.logoId
                    ? el(Button, { variant: 'secondary', onClick: function () { props.setAttributes({ logoId: 0 }); }, style: { marginLeft: '8px' } }, __('Clear', 'headless-core'))
                    : null
                );
              },
            })
          )
        )
      );
    },
    save: function () { return null; },
  });
})(window.wp.blocks, window.wp.blockEditor, window.wp.components, window.wp.element, window.wp.i18n);

