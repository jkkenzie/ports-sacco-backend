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

  registerBlockType('custom/footer-contact', {
    apiVersion: 3,
    title: __('Footer Contact', 'headless-core'),
    icon: 'location-alt',
    category: 'widgets',
    attributes: {
      title: { type: 'string', default: 'Branch Network' },
      officeName: { type: 'string', default: 'Mombasa - Head Office' },
      officeAddress: { type: 'string', default: '' },
      phone: { type: 'string', default: '' },
      poBox: { type: 'string', default: '' },
      email: { type: 'string', default: '' },
      tagline: { type: 'string', default: 'UPLIFTING PEOPLE' },
      logoId: { type: 'number', default: 0 },
      addressIconId: { type: 'number', default: 0 },
      phoneIconId: { type: 'number', default: 0 },
      poBoxIconId: { type: 'number', default: 0 },
      emailIconId: { type: 'number', default: 0 },
      iconColor: { type: 'string', default: '#FFFFFF' },
    },
    edit: function (props) {
      var a = props.attributes;
      var setAttributes = props.setAttributes;
      var blockProps = useBlockProps();

      function field(key, label) {
        return el(TextControl, {
          label: label,
          value: a[key] || '',
          onChange: function (v) {
            var next = {};
            next[key] = v;
            setAttributes(next);
          },
        });
      }

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

      return el(
        'div',
        blockProps,
        el(InspectorControls, null, el(
          PanelBody,
          { title: __('Footer Contact', 'headless-core'), initialOpen: true },
          field('title', __('Section Title', 'headless-core')),
          field('officeName', __('Office Name', 'headless-core')),
          field('officeAddress', __('Address', 'headless-core')),
          field('phone', __('Phone', 'headless-core')),
          field('poBox', __('P.O Box', 'headless-core')),
          field('email', __('Email', 'headless-core')),
          field('tagline', __('Tagline', 'headless-core')),
          mediaField('logoId', __('Logo Image', 'headless-core')),
          mediaField('addressIconId', __('Address Icon (SVG/Image)', 'headless-core')),
          mediaField('phoneIconId', __('Phone Icon (SVG/Image)', 'headless-core')),
          mediaField('poBoxIconId', __('P.O Box Icon (SVG/Image)', 'headless-core')),
          mediaField('emailIconId', __('Email Icon (SVG/Image)', 'headless-core')),
          el('div', { style: { marginBottom: '8px', fontWeight: '600' } }, __('Icon Color', 'headless-core')),
          el(ColorPalette, {
            value: a.iconColor || '#FFFFFF',
            colors: BRAND_COLOR_CHOICES.map(function (hex) { return { color: hex, name: hex }; }),
            onChange: function (value) {
              setAttributes({ iconColor: value || '#FFFFFF' });
            },
          })
        )),
        el('div', { style: { padding: '12px', border: '1px dashed #ccc' } }, __('Footer Contact block configured in sidebar.', 'headless-core'))
      );
    },
    save: function () {
      return null;
    },
  });
})(window.wp.blocks, window.wp.blockEditor, window.wp.components, window.wp.element, window.wp.i18n);
