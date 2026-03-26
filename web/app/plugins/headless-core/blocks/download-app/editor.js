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

  registerBlockType('custom/download-app', {
    apiVersion: 3,
    title: __('Download App', 'headless-core'),
    icon: 'download',
    category: 'widgets',
    description: __('Download the app section with store badges.', 'headless-core'),
    attributes: {
      heading: { type: 'string', default: 'Download the App' },
      backgroundColor: { type: 'string', default: '#22ACB6' },
      headingColor: { type: 'string', default: '#ffffff' },

      googlePlayImageId: { type: 'number', default: 0 },
      googlePlayImageUrl: { type: 'string', default: '' },
      googlePlayLinkUrl: { type: 'string', default: '#' },

      appStoreImageId: { type: 'number', default: 0 },
      appStoreImageUrl: { type: 'string', default: '' },
      appStoreLinkUrl: { type: 'string', default: '#' },
    },
    edit: function (props) {
      var blockProps = useBlockProps({ className: 'headless-download-app-block' });
      var palette = ['#22ACB6', '#ED6E2A', '#ffffff', '#eef0f3', '#000000', '#65605f', '#3b4e6b'];
      var bg = String(props.attributes.backgroundColor || '#22ACB6');
      var hc = String(props.attributes.headingColor || '#ffffff');

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
                value: bg,
                colors: palette.map(function (hex) { return { color: hex, name: hex }; }),
                onChange: function (c) { props.setAttributes({ backgroundColor: c || '#22ACB6' }); },
              })
            ),
            el('div', null,
              el(BaseControl, { label: __('Heading color', 'headless-core') }),
              el(ColorPalette, {
                value: hc,
                colors: palette.map(function (hex) { return { color: hex, name: hex }; }),
                onChange: function (c) { props.setAttributes({ headingColor: c || '#ffffff' }); },
              })
            )
          )
        ),
        el(
          'div',
          { style: { padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px', background: bg } },
          el('div', { style: { maxWidth: '1100px', margin: '0 auto', textAlign: 'center' } },
            el(RichText, {
              tagName: 'h2',
              value: props.attributes.heading || '',
              onChange: function (v) { props.setAttributes({ heading: v }); },
              placeholder: __('Heading…', 'headless-core'),
              allowedFormats: [],
              style: { fontSize: '28px', fontWeight: 900, color: hc, marginBottom: '16px' },
            }),

            el('div', { style: { display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' } },
              el('div', { style: { width: '260px', textAlign: 'left' } },
                el('strong', null, __('Google Play badge', 'headless-core')),
                props.attributes.googlePlayImageUrl
                  ? el('img', { src: props.attributes.googlePlayImageUrl, alt: '', style: { marginTop: '8px', maxHeight: '60px' } })
                  : el('div', { style: { marginTop: '8px', height: '60px', border: '1px dashed rgba(255,255,255,0.55)' } }),
                el('div', { style: { marginTop: '8px', display: 'flex', gap: '8px', alignItems: 'center' } },
                  el(MediaUploadCheck, null,
                    el(MediaUpload, {
                      allowedTypes: ['image'],
                      value: props.attributes.googlePlayImageId || 0,
                      onSelect: function (media) {
                        props.setAttributes({
                          googlePlayImageId: media && media.id ? media.id : 0,
                          googlePlayImageUrl: media && media.url ? media.url : '',
                        });
                      },
                      render: function (obj) {
                        return el(Button, { variant: 'secondary', onClick: obj.open }, props.attributes.googlePlayImageId ? __('Replace', 'headless-core') : __('Upload', 'headless-core'));
                      },
                    })
                  ),
                  props.attributes.googlePlayImageId
                    ? el(Button, { variant: 'tertiary', isDestructive: true, onClick: function () { props.setAttributes({ googlePlayImageId: 0, googlePlayImageUrl: '' }); } }, __('Remove', 'headless-core'))
                    : null
                ),
                el(TextControl, {
                  label: __('Google Play link URL', 'headless-core'),
                  value: props.attributes.googlePlayLinkUrl || '#',
                  onChange: function (v) { props.setAttributes({ googlePlayLinkUrl: v }); },
                })
              ),

              el('div', { style: { width: '260px', textAlign: 'left' } },
                el('strong', null, __('App Store badge', 'headless-core')),
                props.attributes.appStoreImageUrl
                  ? el('img', { src: props.attributes.appStoreImageUrl, alt: '', style: { marginTop: '8px', maxHeight: '60px' } })
                  : el('div', { style: { marginTop: '8px', height: '60px', border: '1px dashed rgba(255,255,255,0.55)' } }),
                el('div', { style: { marginTop: '8px', display: 'flex', gap: '8px', alignItems: 'center' } },
                  el(MediaUploadCheck, null,
                    el(MediaUpload, {
                      allowedTypes: ['image'],
                      value: props.attributes.appStoreImageId || 0,
                      onSelect: function (media) {
                        props.setAttributes({
                          appStoreImageId: media && media.id ? media.id : 0,
                          appStoreImageUrl: media && media.url ? media.url : '',
                        });
                      },
                      render: function (obj) {
                        return el(Button, { variant: 'secondary', onClick: obj.open }, props.attributes.appStoreImageId ? __('Replace', 'headless-core') : __('Upload', 'headless-core'));
                      },
                    })
                  ),
                  props.attributes.appStoreImageId
                    ? el(Button, { variant: 'tertiary', isDestructive: true, onClick: function () { props.setAttributes({ appStoreImageId: 0, appStoreImageUrl: '' }); } }, __('Remove', 'headless-core'))
                    : null
                ),
                el(TextControl, {
                  label: __('App Store link URL', 'headless-core'),
                  value: props.attributes.appStoreLinkUrl || '#',
                  onChange: function (v) { props.setAttributes({ appStoreLinkUrl: v }); },
                })
              )
            )
          )
        ),
        el(
          'div',
          { style: { padding: '1rem', border: '1px dashed #ccc', borderRadius: '4px' } },
          el('strong', null, props.attributes.heading || __('Download the App', 'headless-core')),
          el('p', { style: { marginTop: '8px', fontSize: '12px', color: '#555' } }, __('Rendered by React frontend.', 'headless-core'))
        )
      );
    },
    save: function () { return null; },
  });
})(window.wp.blocks, window.wp.blockEditor, window.wp.components, window.wp.element, window.wp.i18n);

