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

  registerBlockType('custom/footer-socials', {
    apiVersion: 3,
    title: __('Footer Socials', 'headless-core'),
    icon: 'share',
    category: 'widgets',
    attributes: {
      facebook: { type: 'string', default: '' },
      twitter: { type: 'string', default: '' },
      instagram: { type: 'string', default: '' },
      linkedin: { type: 'string', default: '' },
      youtube: { type: 'string', default: '' },
      facebookIconId: { type: 'number', default: 0 },
      twitterIconId: { type: 'number', default: 0 },
      instagramIconId: { type: 'number', default: 0 },
      linkedinIconId: { type: 'number', default: 0 },
      youtubeIconId: { type: 'number', default: 0 },
      iconColor: { type: 'string', default: '#FFFFFF' },
      iconHoverColor: { type: 'string', default: '#22ACB6' },
      youtubeInternalColor: { type: 'string', default: '#FFFFFF' },
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
          el(PanelBody, { title: __('Footer Social Links', 'headless-core'), initialOpen: true },
            el(TextControl, { label: __('Facebook URL', 'headless-core'), value: a.facebook || '', onChange: function (v) { setAttributes({ facebook: v }); } }),
            el(TextControl, { label: __('X/Twitter URL', 'headless-core'), value: a.twitter || '', onChange: function (v) { setAttributes({ twitter: v }); } }),
            el(TextControl, { label: __('Instagram URL', 'headless-core'), value: a.instagram || '', onChange: function (v) { setAttributes({ instagram: v }); } }),
            el(TextControl, { label: __('LinkedIn URL', 'headless-core'), value: a.linkedin || '', onChange: function (v) { setAttributes({ linkedin: v }); } }),
            el(TextControl, { label: __('YouTube URL', 'headless-core'), value: a.youtube || '', onChange: function (v) { setAttributes({ youtube: v }); } }),
            mediaField('facebookIconId', __('Facebook Icon (SVG/Image)', 'headless-core')),
            mediaField('twitterIconId', __('X/Twitter Icon (SVG/Image)', 'headless-core')),
            mediaField('instagramIconId', __('Instagram Icon (SVG/Image)', 'headless-core')),
            mediaField('linkedinIconId', __('LinkedIn Icon (SVG/Image)', 'headless-core')),
            mediaField('youtubeIconId', __('YouTube Icon (SVG/Image)', 'headless-core')),
            el('div', { style: { marginBottom: '8px', fontWeight: '600' } }, __('SVG/Icon Color', 'headless-core')),
            el(ColorPalette, {
              value: a.iconColor || '#FFFFFF',
              colors: BRAND_COLOR_CHOICES.map(function (hex) { return { color: hex, name: hex }; }),
              onChange: function (value) {
                setAttributes({ iconColor: value || '#FFFFFF' });
              },
            }),
            el('div', { style: { marginTop: '12px', marginBottom: '8px', fontWeight: '600' } }, __('Social Icon Hover Color', 'headless-core')),
            el(ColorPalette, {
              value: a.iconHoverColor || '#22ACB6',
              colors: BRAND_COLOR_CHOICES.map(function (hex) { return { color: hex, name: hex }; }),
              onChange: function (value) {
                setAttributes({ iconHoverColor: value || '#22ACB6' });
              },
            }),
            el('div', { style: { marginTop: '12px', marginBottom: '8px', fontWeight: '600' } }, __('YouTube Internal Color', 'headless-core')),
            el(ColorPalette, {
              value: a.youtubeInternalColor || '#FFFFFF',
              colors: BRAND_COLOR_CHOICES.map(function (hex) { return { color: hex, name: hex }; }),
              onChange: function (value) {
                setAttributes({ youtubeInternalColor: value || '#FFFFFF' });
              },
            })
          )
        ),
        el('div', { style: { padding: '12px', border: '1px dashed #ccc' } }, __('Footer Socials block configured in sidebar.', 'headless-core'))
      );
    },
    save: function () {
      return null;
    },
  });
})(window.wp.blocks, window.wp.blockEditor, window.wp.components, window.wp.element, window.wp.i18n);
