(function (blocks, blockEditor, components, element, i18n) {
  var el = element.createElement;
  var Fragment = element.Fragment;
  var registerBlockType = blocks.registerBlockType;
  var useBlockProps = blockEditor.useBlockProps;
  var InspectorControls = blockEditor.InspectorControls;
  var RichText = blockEditor.RichText;
  var PanelBody = components.PanelBody;
  var Button = components.Button;
  var BaseControl = components.BaseControl;
  var ColorPalette = components.ColorPalette;
  var TextControl = components.TextControl;
  var TextareaControl = components.TextareaControl;
  var MediaUpload = blockEditor.MediaUpload;
  var MediaUploadCheck = blockEditor.MediaUploadCheck;
  var __ = i18n.__;

  var palette = ['#00B2E0', '#00AFBB', '#00AB81', '#F5F4EE', '#22ACB6', '#EE6E2A', '#ffffff', '#000000'];

  registerBlockType('custom/newsletter-section', {
    apiVersion: 3,
    title: __('Newsletter', 'headless-core'),
    icon: 'email-alt',
    category: 'widgets',
    description: __('Gradient section with email signup (Mailchimp-compatible).', 'headless-core'),
    attributes: {
      sectionId: { type: 'string', default: 'newsletter' },
      gradientFrom: { type: 'string', default: '#00B2E0' },
      gradientVia: { type: 'string', default: '#00AFBB' },
      gradientTo: { type: 'string', default: '#00AB81' },
      topBarBg: { type: 'string', default: '#F5F4EE' },
      curveAccentColor: { type: 'string', default: '#00AFBB' },
      scrollButtonOuter: { type: 'string', default: '#ffffff' },
      scrollButtonInner: { type: 'string', default: '#22ACB6' },
      kickerText: { type: 'string', default: '' },
      badgeText: { type: 'string', default: '' },
      titleText: { type: 'string', default: '' },
      headlineColor: { type: 'string', default: '#000000' },
      kickerColor: { type: 'string', default: '#ffffff' },
      imageId: { type: 'number', default: 0 },
      imageUrl: { type: 'string', default: '' },
      imageAlt: { type: 'string', default: '' },
      emailPlaceholder: { type: 'string', default: 'Enter Your Email Address' },
      submitButtonText: { type: 'string', default: 'SUBSCRIBE' },
      submitButtonWidth: { type: 'string', default: '300px' },
      inputBgColor: { type: 'string', default: '#38f0ba' },
      inputTextColor: { type: 'string', default: '#3b4e6b' },
      inputPlaceholderColor: { type: 'string', default: '#3b4e6b' },
      submitBgColor: { type: 'string', default: '#EE6E2A' },
      submitTextColor: { type: 'string', default: '#ffffff' },
      submitArrowColor: { type: 'string', default: '#ffffff' },
      badgeBgColor: { type: 'string', default: '#EE6E2A' },
      badgeTextColor: { type: 'string', default: '#ffffff' },
      mailchimpFormActionUrl: { type: 'string', default: '' },
      mailchimpEmailFieldName: { type: 'string', default: 'EMAIL' },
      mailchimpBotFieldName: { type: 'string', default: '' },
      mailchimpFormTarget: { type: 'string', default: '_self' },
      mailchimpHiddenFieldsJson: { type: 'string', default: '[]' },
    },
    edit: function (props) {
      var a = props.attributes;
      var blockProps = useBlockProps({ className: 'headless-newsletter-section-block' });
      var gf = String(a.gradientFrom || '#00B2E0');
      var gv = String(a.gradientVia || '#00AFBB');
      var gt = String(a.gradientTo || '#00AB81');
      var bg = { background: 'linear-gradient(to right,' + gf + ',' + gv + ',' + gt + ')' };

      return el(
        Fragment,
        null,
        el(
          InspectorControls,
          null,
          el(
            PanelBody,
            { title: __('Mailchimp', 'headless-core'), initialOpen: true },
            el(TextControl, {
              label: __('Form action URL', 'headless-core'),
              value: a.mailchimpFormActionUrl || '',
              onChange: function (v) { props.setAttributes({ mailchimpFormActionUrl: v || '' }); },
            }),
            el(TextControl, {
              label: __('Email field name', 'headless-core'),
              value: a.mailchimpEmailFieldName || 'EMAIL',
              onChange: function (v) { props.setAttributes({ mailchimpEmailFieldName: v || 'EMAIL' }); },
            }),
            el(TextControl, {
              label: __('Honeypot field name (optional)', 'headless-core'),
              value: a.mailchimpBotFieldName || '',
              onChange: function (v) { props.setAttributes({ mailchimpBotFieldName: v || '' }); },
            }),
            el(TextControl, {
              label: __('Form target', 'headless-core'),
              value: a.mailchimpFormTarget || '_self',
              onChange: function (v) { props.setAttributes({ mailchimpFormTarget: v || '_self' }); },
              help: __('_self or _blank', 'headless-core'),
            }),
            el(TextareaControl, {
              label: __('Hidden fields (JSON array)', 'headless-core'),
              value: a.mailchimpHiddenFieldsJson || '[]',
              onChange: function (v) { props.setAttributes({ mailchimpHiddenFieldsJson: v || '[]' }); },
              help: __('e.g. [{"name":"u","value":"xx"}]', 'headless-core'),
            })
          ),
          el(
            PanelBody,
            { title: __('Colors', 'headless-core'), initialOpen: false },
            el(BaseControl, { label: __('Gradient start', 'headless-core') }),
            el(ColorPalette, {
              value: gf,
              colors: palette.map(function (hex) { return { color: hex, name: hex }; }),
              onChange: function (c) { props.setAttributes({ gradientFrom: c || '#00B2E0' }); },
            }),
            el(BaseControl, { label: __('Gradient middle', 'headless-core') }),
            el(ColorPalette, {
              value: gv,
              colors: palette.map(function (hex) { return { color: hex, name: hex }; }),
              onChange: function (c) { props.setAttributes({ gradientVia: c || '#00AFBB' }); },
            }),
            el(BaseControl, { label: __('Gradient end', 'headless-core') }),
            el(ColorPalette, {
              value: gt,
              colors: palette.map(function (hex) { return { color: hex, name: hex }; }),
              onChange: function (c) { props.setAttributes({ gradientTo: c || '#00AB81' }); },
            }),
            el(BaseControl, { label: __('Top bar (above curve)', 'headless-core') }),
            el(ColorPalette, {
              value: String(a.topBarBg || '#F5F4EE'),
              colors: palette.map(function (hex) { return { color: hex, name: hex }; }),
              onChange: function (c) { props.setAttributes({ topBarBg: c || '#F5F4EE' }); },
            }),
            el(BaseControl, { label: __('Curve accent', 'headless-core') }),
            el(ColorPalette, {
              value: String(a.curveAccentColor || '#00AFBB'),
              colors: palette.map(function (hex) { return { color: hex, name: hex }; }),
              onChange: function (c) { props.setAttributes({ curveAccentColor: c || '#00AFBB' }); },
            }),
            el(BaseControl, { label: __('Scroll button — outer ring', 'headless-core') }),
            el(ColorPalette, {
              value: String(a.scrollButtonOuter || '#ffffff'),
              colors: palette.map(function (hex) { return { color: hex, name: hex }; }),
              onChange: function (c) { props.setAttributes({ scrollButtonOuter: c || '#ffffff' }); },
            }),
            el(BaseControl, { label: __('Scroll button — arrow', 'headless-core') }),
            el(ColorPalette, {
              value: String(a.scrollButtonInner || '#22ACB6'),
              colors: palette.map(function (hex) { return { color: hex, name: hex }; }),
              onChange: function (c) { props.setAttributes({ scrollButtonInner: c || '#22ACB6' }); },
            }),
            el(BaseControl, { label: __('Headline', 'headless-core') }),
            el(ColorPalette, {
              value: String(a.headlineColor || '#000000'),
              colors: palette.map(function (hex) { return { color: hex, name: hex }; }),
              onChange: function (c) { props.setAttributes({ headlineColor: c || '#000000' }); },
            }),
            el(BaseControl, { label: __('Kicker', 'headless-core') }),
            el(ColorPalette, {
              value: String(a.kickerColor || '#ffffff'),
              colors: palette.map(function (hex) { return { color: hex, name: hex }; }),
              onChange: function (c) { props.setAttributes({ kickerColor: c || '#ffffff' }); },
            }),
            el(BaseControl, { label: __('Badge background', 'headless-core') }),
            el(ColorPalette, {
              value: String(a.badgeBgColor || '#EE6E2A'),
              colors: palette.map(function (hex) { return { color: hex, name: hex }; }),
              onChange: function (c) { props.setAttributes({ badgeBgColor: c || '#EE6E2A' }); },
            }),
            el(BaseControl, { label: __('Badge text', 'headless-core') }),
            el(ColorPalette, {
              value: String(a.badgeTextColor || '#ffffff'),
              colors: palette.map(function (hex) { return { color: hex, name: hex }; }),
              onChange: function (c) { props.setAttributes({ badgeTextColor: c || '#ffffff' }); },
            }),
            el(BaseControl, { label: __('Input background', 'headless-core') }),
            el(ColorPalette, {
              value: String(a.inputBgColor || '#38f0ba'),
              colors: palette.map(function (hex) { return { color: hex, name: hex }; }),
              onChange: function (c) { props.setAttributes({ inputBgColor: c || '#38f0ba' }); },
            }),
            el(BaseControl, { label: __('Input text', 'headless-core') }),
            el(ColorPalette, {
              value: String(a.inputTextColor || '#3b4e6b'),
              colors: palette.map(function (hex) { return { color: hex, name: hex }; }),
              onChange: function (c) { props.setAttributes({ inputTextColor: c || '#3b4e6b' }); },
            }),
            el(BaseControl, { label: __('Input placeholder', 'headless-core') }),
            el(ColorPalette, {
              value: String(a.inputPlaceholderColor || '#3b4e6b'),
              colors: palette.map(function (hex) { return { color: hex, name: hex }; }),
              onChange: function (c) { props.setAttributes({ inputPlaceholderColor: c || '#3b4e6b' }); },
            }),
            el(BaseControl, { label: __('Submit background', 'headless-core') }),
            el(ColorPalette, {
              value: String(a.submitBgColor || '#EE6E2A'),
              colors: palette.map(function (hex) { return { color: hex, name: hex }; }),
              onChange: function (c) { props.setAttributes({ submitBgColor: c || '#EE6E2A' }); },
            }),
            el(BaseControl, { label: __('Submit text', 'headless-core') }),
            el(ColorPalette, {
              value: String(a.submitTextColor || '#ffffff'),
              colors: palette.map(function (hex) { return { color: hex, name: hex }; }),
              onChange: function (c) { props.setAttributes({ submitTextColor: c || '#ffffff' }); },
            }),
            el(BaseControl, { label: __('Submit arrow', 'headless-core') }),
            el(ColorPalette, {
              value: String(a.submitArrowColor || '#ffffff'),
              colors: palette.map(function (hex) { return { color: hex, name: hex }; }),
              onChange: function (c) { props.setAttributes({ submitArrowColor: c || '#ffffff' }); },
            })
          ),
          el(
            PanelBody,
            { title: __('Advanced', 'headless-core'), initialOpen: false },
            el(TextControl, {
              label: __('Section id', 'headless-core'),
              value: a.sectionId || 'newsletter',
              onChange: function (v) { props.setAttributes({ sectionId: v || 'newsletter' }); },
            })
          ),
          el(
            PanelBody,
            { title: __('Image', 'headless-core'), initialOpen: false },
            a.imageUrl ? el('img', { src: a.imageUrl, alt: '', style: { maxHeight: '100px', display: 'block', marginBottom: '8px' } }) : null,
            el('div', { style: { display: 'flex', gap: '8px', flexWrap: 'wrap' } },
              el(MediaUploadCheck, null,
                el(MediaUpload, {
                  allowedTypes: ['image'],
                  value: a.imageId || 0,
                  onSelect: function (media) {
                    props.setAttributes({
                      imageId: media && media.id ? media.id : 0,
                      imageUrl: media && media.url ? media.url : '',
                    });
                  },
                  render: function (obj) {
                    return el(Button, { variant: 'secondary', onClick: obj.open }, a.imageId ? __('Replace image', 'headless-core') : __('Upload image', 'headless-core'));
                  },
                })
              ),
              a.imageId ? el(Button, { variant: 'tertiary', isDestructive: true, onClick: function () { props.setAttributes({ imageId: 0, imageUrl: '' }); } }, __('Clear', 'headless-core')) : null
            ),
            el(TextControl, {
              label: __('Image alt', 'headless-core'),
              value: a.imageAlt || '',
              onChange: function (v) { props.setAttributes({ imageAlt: v || '' }); },
            })
          )
        ),
        el(
          'div',
          blockProps,
          el('div', { style: { border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' } },
            el('div', { style: { padding: '20px', ...bg, color: '#fff' } },
              el(RichText, {
                tagName: 'div',
                value: a.badgeText || '',
                onChange: function (v) { props.setAttributes({ badgeText: v }); },
                placeholder: __('Badge…', 'headless-core'),
                allowedFormats: [],
                style: { display: 'inline-block', padding: '6px 14px', borderRadius: '999px', background: a.badgeBgColor || '#EE6E2A', marginBottom: '10px', fontSize: '12px', fontWeight: 700 },
              }),
              el(RichText, {
                tagName: 'div',
                value: a.kickerText || '',
                onChange: function (v) { props.setAttributes({ kickerText: v }); },
                placeholder: __('Kicker…', 'headless-core'),
                allowedFormats: [],
                style: { fontSize: '12px', marginBottom: '8px', color: a.kickerColor || '#ffffff' },
              }),
              el(RichText, {
                tagName: 'div',
                value: a.titleText || '',
                onChange: function (v) { props.setAttributes({ titleText: v }); },
                placeholder: __('Headline…', 'headless-core'),
                allowedFormats: ['core/bold', 'core/italic'],
                style: { fontSize: '22px', fontWeight: 800, marginBottom: '16px', color: a.headlineColor || '#000000' },
              }),
              el(TextControl, {
                label: __('Email placeholder', 'headless-core'),
                value: a.emailPlaceholder || '',
                onChange: function (v) { props.setAttributes({ emailPlaceholder: v }); },
              }),
              el(TextControl, {
                label: __('Submit label', 'headless-core'),
                value: a.submitButtonText || '',
                onChange: function (v) { props.setAttributes({ submitButtonText: v }); },
              })
            )
          )
        )
      );
    },
    save: function () { return null; },
  });
})(
  window.wp.blocks,
  window.wp.blockEditor,
  window.wp.components,
  window.wp.element,
  window.wp.i18n
);
