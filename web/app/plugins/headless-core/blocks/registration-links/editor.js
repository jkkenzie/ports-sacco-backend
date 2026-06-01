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
  var headlessLink = window.headlessCoreEditor || {};

  function renderUrlField(label, item, urlKey, onChange) {
    if (headlessLink.renderLinkControl) {
      return headlessLink.renderLinkControl(el, blockEditor, components, i18n, label, item, urlKey, onChange);
    }
    return el(TextControl, {
      label: label,
      value: String((item && item[urlKey]) || ''),
      onChange: function (v) {
        var patch = {};
        patch[urlKey] = String(v || '');
        onChange(patch);
      },
    });
  }

  var DEFAULT_ENTRIES = [
    {
      title: 'Existing Member Registration to Portal',
      paragraph: 'If you are a member of our SACCO but not registered on our portal, please click on the link below to go to the existing member registration page.',
      linkText: 'Register Here >>',
      linkUrl: 'https://portal.portsacco.co.ke/user/register',
    },
    {
      title: 'New Member Registration',
      paragraph: 'If you are not a member of our SACCO, you can join us by clicking on the register link below to go to the new member registration page.',
      linkText: 'Register Here >>',
      linkUrl: '/new-member-registration/',
    },
  ];

  function normalizeEntries(entries) {
    var saved = Array.isArray(entries) ? entries : [];
    var out = [];
    for (var i = 0; i < 2; i++) {
      var d = DEFAULT_ENTRIES[i];
      var s = saved[i] && typeof saved[i] === 'object' ? saved[i] : {};
      out.push({
        title: String((s && s.title) || d.title || ''),
        paragraph: String((s && s.paragraph) || d.paragraph || ''),
        linkText: String((s && s.linkText) || d.linkText || ''),
        linkUrl: String((s && s.linkUrl) || d.linkUrl || ''),
      });
    }
    return out;
  }

  registerBlockType('custom/registration-links', {
    apiVersion: 3,
    title: __('Registration Links', 'headless-core'),
    icon: 'id-alt',
    category: 'widgets',
    description: __('Two-column registration section with image and two paragraph/link entries.', 'headless-core'),
    attributes: {
      imageId: { type: 'number', default: 0 },
      imageUrl: { type: 'string', default: '' },
      imageAlt: { type: 'string', default: 'Registration' },
      entries: { type: 'array', default: DEFAULT_ENTRIES },
      titleColor: { type: 'string', default: '#333333' },
      textColor: { type: 'string', default: '#333333' },
      linkColor: { type: 'string', default: '#eb651b' },
      sectionBgColor: { type: 'string', default: '#ffffff' },
    },
    edit: function (props) {
      var blockProps = useBlockProps({ className: 'headless-registration-links-block' });
      var entries = normalizeEntries(props.attributes.entries);
      var colors = ['#333333', '#000000', '#65605f', '#eb651b', '#ee6e2a', '#22acb6', '#ffffff'];

      function setEntry(index, patch) {
        var next = entries.slice();
        next[index] = Object.assign({}, next[index], patch);
        props.setAttributes({ entries: next });
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
            el('div', null, el(BaseControl, { label: __('Section background', 'headless-core') }), el(ColorPalette, {
              value: props.attributes.sectionBgColor,
              colors: colors.map(function (hex) { return { color: hex, name: hex }; }),
              onChange: function (c) { props.setAttributes({ sectionBgColor: c || '#ffffff' }); },
            })),
            el('div', null, el(BaseControl, { label: __('Title color', 'headless-core') }), el(ColorPalette, {
              value: props.attributes.titleColor,
              colors: colors.map(function (hex) { return { color: hex, name: hex }; }),
              onChange: function (c) { props.setAttributes({ titleColor: c || '#333333' }); },
            })),
            el('div', null, el(BaseControl, { label: __('Paragraph color', 'headless-core') }), el(ColorPalette, {
              value: props.attributes.textColor,
              colors: colors.map(function (hex) { return { color: hex, name: hex }; }),
              onChange: function (c) { props.setAttributes({ textColor: c || '#333333' }); },
            })),
            el('div', null, el(BaseControl, { label: __('Link color', 'headless-core') }), el(ColorPalette, {
              value: props.attributes.linkColor,
              colors: colors.map(function (hex) { return { color: hex, name: hex }; }),
              onChange: function (c) { props.setAttributes({ linkColor: c || '#eb651b' }); },
            }))
          )
        ),
        el(
          'div',
          { style: { border: '1px solid #e5e7eb', borderRadius: '8px', padding: '12px', background: props.attributes.sectionBgColor || '#fff' } },
          el(
            'div',
            { style: { marginBottom: '14px' } },
            el('strong', null, __('Left image', 'headless-core')),
            props.attributes.imageUrl
              ? el('div', { style: { marginTop: '8px' } }, el('img', { src: props.attributes.imageUrl, alt: '', style: { width: '120px', height: 'auto', border: '1px solid #dcdcde' } }))
              : null,
            el('div', { style: { marginTop: '8px', display: 'flex', gap: '8px' } },
              el(MediaUploadCheck, null,
                el(MediaUpload, {
                  allowedTypes: ['image'],
                  value: props.attributes.imageId || 0,
                  onSelect: function (media) {
                    props.setAttributes({
                      imageId: media && media.id ? media.id : 0,
                      imageUrl: media && media.url ? media.url : '',
                      imageAlt: media && media.alt ? media.alt : 'Registration',
                    });
                  },
                  render: function (obj) {
                    return el(Button, { variant: 'secondary', onClick: obj.open }, props.attributes.imageId ? __('Replace image', 'headless-core') : __('Select image', 'headless-core'));
                  },
                })
              ),
              props.attributes.imageId
                ? el(Button, { variant: 'tertiary', isDestructive: true, onClick: function () { props.setAttributes({ imageId: 0, imageUrl: '' }); } }, __('Remove', 'headless-core'))
                : null
            ),
            el(TextControl, {
              label: __('Image alt text', 'headless-core'),
              value: props.attributes.imageAlt || 'Registration',
              onChange: function (v) { props.setAttributes({ imageAlt: v || 'Registration' }); },
            })
          ),
          entries.map(function (entry, index) {
            return el(
              'div',
              { key: index, style: { marginTop: index ? '12px' : 0, paddingTop: index ? '12px' : 0, borderTop: index ? '1px solid #eee' : 'none' } },
              el('strong', null, __('Entry', 'headless-core') + ' ' + (index + 1)),
              el(RichText, {
                tagName: 'h4',
                value: entry.title,
                onChange: function (v) { setEntry(index, { title: v }); },
                allowedFormats: [],
                placeholder: __('Title...', 'headless-core'),
                style: { margin: '8px 0 6px 0', color: props.attributes.titleColor || '#333333' },
              }),
              el(RichText, {
                tagName: 'p',
                value: entry.paragraph,
                onChange: function (v) { setEntry(index, { paragraph: v }); },
                allowedFormats: [],
                placeholder: __('Paragraph...', 'headless-core'),
                style: { margin: 0, color: props.attributes.textColor || '#333333' },
              }),
              el('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '8px' } },
                el(TextControl, {
                  label: __('Link text', 'headless-core'),
                  value: entry.linkText,
                  onChange: function (v) { setEntry(index, { linkText: v }); },
                }),
                renderUrlField(__('Link URL', 'headless-core'), entry, 'linkUrl', function (patch) {
                  setEntry(index, patch);
                })
              )
            );
          }),
          el('p', { style: { marginTop: '12px', color: '#666', fontSize: '12px' } }, __('Rendered by React frontend as a 2-column registration section.', 'headless-core'))
        )
      );
    },
    save: function () { return null; },
  });
})(window.wp.blocks, window.wp.blockEditor, window.wp.components, window.wp.element, window.wp.i18n);
