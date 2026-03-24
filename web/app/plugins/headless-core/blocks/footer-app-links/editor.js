(function (blocks, blockEditor, components, element, i18n) {
  var el = element.createElement;
  var registerBlockType = blocks.registerBlockType;
  var useBlockProps = blockEditor.useBlockProps;
  var InspectorControls = blockEditor.InspectorControls;
  var PanelBody = components.PanelBody;
  var TextControl = components.TextControl;
  var Button = components.Button;
  var ColorPalette = components.ColorPalette;
  var MediaUpload = blockEditor.MediaUpload;
  var MediaUploadCheck = blockEditor.MediaUploadCheck;
  var useSelect = window.wp.data.useSelect;
  var __ = i18n.__;
  var BRAND_COLOR_CHOICES = ['#22ACB6', '#EE6E2A', '#40C9BF', '#000000', '#FFFFFF', '#808080', 'rgb(50, 186, 70)'];

  registerBlockType('custom/footer-app-links', {
    apiVersion: 3,
    title: __('Footer App Links', 'headless-core'),
    icon: 'smartphone',
    category: 'widgets',
    attributes: {
      title: { type: 'string', default: 'Download Mobile App' },
      googlePlayUrl: { type: 'string', default: '' },
      appStoreUrl: { type: 'string', default: '' },
      googlePlayIconId: { type: 'number', default: 0 },
      appStoreIconId: { type: 'number', default: 0 },
      iconColor: { type: 'string', default: '#FFFFFF' },
      iconHoverColor: { type: 'string', default: '#22ACB6' },
      iconWidth: { type: 'number', default: 144 },
      iconHeight: { type: 'number', default: 48 },
    },
    edit: function (props) {
      var a = props.attributes;
      var setAttributes = props.setAttributes;
      var blockProps = useBlockProps();
      function mediaField(key, label) {
        var media = useSelect(function (select) {
          if (!a[key]) return null;
          return select('core').getMedia(a[key]);
        }, [a[key]]);
        var previewUrl = media && media.media_details && media.media_details.sizes && media.media_details.sizes.thumbnail
          ? media.media_details.sizes.thumbnail.source_url
          : (media && media.source_url ? media.source_url : '');
        var isSvg = !!(media && media.mime_type === 'image/svg+xml');

        return el('div', { style: { marginBottom: '12px' } },
          el('div', { style: { marginBottom: '6px', fontWeight: '600' } }, label),
          !!a[key] && el('div', { style: { marginBottom: '8px' } },
            previewUrl
              ? el('img', {
                src: previewUrl,
                alt: '',
                style: {
                  width: isSvg ? '84px' : '56px',
                  height: isSvg ? '84px' : '56px',
                  objectFit: 'contain',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  background: '#e5e7eb',
                  padding: isSvg ? '6px' : '0',
                }
              })
              : el('span', { style: { fontSize: '12px', color: '#666' } }, isSvg ? __('SVG selected (no preview URL)', 'headless-core') : __('Image selected', 'headless-core'))
          ),
          el(MediaUploadCheck, null,
            el(MediaUpload, {
              onSelect: function (media) {
                var id = media && media.id ? Number(media.id) : 0;
                var next = {};
                next[key] = id;
                setAttributes(next);
              },
              allowedTypes: ['image'],
              value: a[key] || 0,
              render: function (obj) {
                return el(Button, { onClick: obj.open, isSecondary: true }, a[key] ? __('Replace Icon/Image', 'headless-core') : __('Upload Icon/SVG', 'headless-core'));
              },
            })
          )
        );
      }
      return el('div', blockProps,
        el(InspectorControls, null,
          el(PanelBody, { title: __('Footer App Links', 'headless-core'), initialOpen: true },
            el(TextControl, { label: __('Title', 'headless-core'), value: a.title || '', onChange: function (v) { setAttributes({ title: v }); } }),
            el(TextControl, { label: __('Google Play URL', 'headless-core'), value: a.googlePlayUrl || '', onChange: function (v) { setAttributes({ googlePlayUrl: v }); } }),
            el(TextControl, { label: __('App Store URL', 'headless-core'), value: a.appStoreUrl || '', onChange: function (v) { setAttributes({ appStoreUrl: v }); } }),
            el(TextControl, { label: __('Icon Width (px)', 'headless-core'), type: 'number', value: String(a.iconWidth || 144), onChange: function (v) { setAttributes({ iconWidth: Number(v) || 144 }); } }),
            el(TextControl, { label: __('Icon Height (px)', 'headless-core'), type: 'number', value: String(a.iconHeight || 48), onChange: function (v) { setAttributes({ iconHeight: Number(v) || 48 }); } }),
            mediaField('googlePlayIconId', __('Google Play Icon (SVG/Image)', 'headless-core')),
            mediaField('appStoreIconId', __('App Store Icon (SVG/Image)', 'headless-core')),
            el('div', { style: { marginBottom: '8px', fontWeight: '600' } }, __('SVG/Icon Color', 'headless-core')),
            el(ColorPalette, {
              value: a.iconColor || '#FFFFFF',
              colors: BRAND_COLOR_CHOICES.map(function (hex) { return { color: hex, name: hex }; }),
              onChange: function (value) {
                setAttributes({ iconColor: value || '#FFFFFF' });
              },
            }),
            el('div', { style: { marginTop: '12px', marginBottom: '8px', fontWeight: '600' } }, __('SVG/Icon Hover Color', 'headless-core')),
            el(ColorPalette, {
              value: a.iconHoverColor || '#22ACB6',
              colors: BRAND_COLOR_CHOICES.map(function (hex) { return { color: hex, name: hex }; }),
              onChange: function (value) {
                setAttributes({ iconHoverColor: value || '#22ACB6' });
              },
            })
          )
        ),
        el('div', { style: { padding: '12px', border: '1px dashed #ccc' } }, __('Footer App Links block configured in sidebar.', 'headless-core'))
      );
    },
    save: function () {
      return null;
    },
  });
})(window.wp.blocks, window.wp.blockEditor, window.wp.components, window.wp.element, window.wp.i18n);
