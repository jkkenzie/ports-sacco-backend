(function (blocks, blockEditor, components, element, i18n) {
  var el = element.createElement;
  var Fragment = element.Fragment;
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

  var palette = ['#00B2E0', '#00AFBB', '#00AB81', '#F5F4EE', '#22ACB6', '#EE6E2A', '#ffffff', '#000000'];
  var inlineFormats = ['core/bold', 'core/italic'];

  function previewBackgroundStyle(a) {
    var gf = String(a.gradientFrom || '#00B2E0');
    var gv = String(a.gradientVia || '#00AFBB');
    var gt = String(a.gradientTo || '#00AB81');
    return { background: 'linear-gradient(to right,' + gf + ',' + gv + ',' + gt + ')' };
  }

  registerBlockType('custom/mobile-app-section', {
    apiVersion: 3,
    title: __('Mobile app (M-PORT)', 'headless-core'),
    icon: 'smartphone',
    category: 'widgets',
    description: __('Full-width gradient section; images load from the Media Library.', 'headless-core'),
    attributes: {
      sectionId: { type: 'string', default: 'mobile-app' },
      gradientFrom: { type: 'string', default: '#00B2E0' },
      gradientVia: { type: 'string', default: '#00AFBB' },
      gradientTo: { type: 'string', default: '#00AB81' },
      topBarBg: { type: 'string', default: '#F5F4EE' },
      curveAccentColor: { type: 'string', default: '#00AFBB' },
      scrollButtonOuter: { type: 'string', default: '#ffffff' },
      scrollButtonInner: { type: 'string', default: '#22ACB6' },
      kickerText: { type: 'string', default: '' },
      titleText: { type: 'string', default: '' },
      bodyHtml: { type: 'string', default: '' },
      downloadHeading: { type: 'string', default: '' },
      badgeText: { type: 'string', default: '' },
      googlePlayImageId: { type: 'number', default: 0 },
      googlePlayImageUrl: { type: 'string', default: '' },
      googlePlayLinkUrl: { type: 'string', default: '' },
      googlePlayLinks: {
        type: 'array',
        default: [
          { label: 'M-Port Cash', url: '' },
          { label: 'Sacco Account', url: '' },
        ],
      },
      appStoreImageId: { type: 'number', default: 0 },
      appStoreImageUrl: { type: 'string', default: '' },
      appStoreLinkUrl: { type: 'string', default: '' },
      ussdImageId: { type: 'number', default: 0 },
      ussdImageUrl: { type: 'string', default: '' },
    },
    edit: function (props) {
      var a = props.attributes;
      var blockProps = useBlockProps({
        className: 'headless-mobile-app-section-block',
        style: {
          position: 'relative',
          border: '1px solid #d0d0d0',
          borderRadius: '4px',
          overflow: 'hidden',
          minHeight: '420px',
          color: '#fff',
        },
      });

      var bgStyle = previewBackgroundStyle(a);
      var gf = String(a.gradientFrom || '#00B2E0');
      var gv = String(a.gradientVia || '#00AFBB');
      var gt = String(a.gradientTo || '#00AB81');

      var googlePlayLinks = Array.isArray(a.googlePlayLinks) && a.googlePlayLinks.length
        ? a.googlePlayLinks.map(function (x) {
            return {
              label: String((x && x.label) || ''),
              url: String((x && x.url) || ''),
            };
          })
        : String(a.googlePlayLinkUrl || '').trim()
          ? [
              { label: 'M-Port Cash', url: String(a.googlePlayLinkUrl || '') },
              { label: 'Sacco Account', url: '' },
            ]
          : [
              { label: 'M-Port Cash', url: '' },
              { label: 'Sacco Account', url: '' },
            ];

      function setPlayLink(i, patch) {
        var next = googlePlayLinks.map(function (row, idx) {
          return idx === i ? Object.assign({}, row, patch) : row;
        });
        props.setAttributes({
          googlePlayLinks: next,
          googlePlayLinkUrl: next[0] && next[0].url ? next[0].url : '',
        });
      }
      function addPlayLink() {
        props.setAttributes({
          googlePlayLinks: googlePlayLinks.concat([{ label: 'New app', url: '' }]),
        });
      }
      function removePlayLink(i) {
        if (!window.confirm(__('Remove this Play Store link?', 'headless-core'))) return;
        var next = googlePlayLinks.filter(function (_, idx) { return idx !== i; });
        props.setAttributes({
          googlePlayLinks: next,
          googlePlayLinkUrl: next[0] && next[0].url ? next[0].url : '',
        });
      }

      return el(
        Fragment,
        null,
        el(
          InspectorControls,
          null,
          el(
            PanelBody,
            { title: __('Gradient & top bar', 'headless-core'), initialOpen: false },
            el('div', null,
              el(BaseControl, { label: __('Gradient start', 'headless-core') }),
              el(ColorPalette, {
                value: gf,
                colors: palette.map(function (hex) { return { color: hex, name: hex }; }),
                onChange: function (c) { props.setAttributes({ gradientFrom: c || '#00B2E0' }); },
              })
            ),
            el('div', null,
              el(BaseControl, { label: __('Gradient middle', 'headless-core') }),
              el(ColorPalette, {
                value: gv,
                colors: palette.map(function (hex) { return { color: hex, name: hex }; }),
                onChange: function (c) { props.setAttributes({ gradientVia: c || '#00AFBB' }); },
              })
            ),
            el('div', null,
              el(BaseControl, { label: __('Gradient end', 'headless-core') }),
              el(ColorPalette, {
                value: gt,
                colors: palette.map(function (hex) { return { color: hex, name: hex }; }),
                onChange: function (c) { props.setAttributes({ gradientTo: c || '#00AB81' }); },
              })
            ),
            el('div', null,
              el(BaseControl, { label: __('Curve / top bar (page bg)', 'headless-core') }),
              el(ColorPalette, {
                value: String(a.topBarBg || '#F5F4EE'),
                colors: palette.map(function (hex) { return { color: hex, name: hex }; }),
                onChange: function (c) { props.setAttributes({ topBarBg: c || '#F5F4EE' }); },
              })
            ),
            el('div', null,
              el(BaseControl, { label: __('Curve accent', 'headless-core') }),
              el(ColorPalette, {
                value: String(a.curveAccentColor || '#00AFBB'),
                colors: palette.map(function (hex) { return { color: hex, name: hex }; }),
                onChange: function (c) { props.setAttributes({ curveAccentColor: c || '#00AFBB' }); },
              })
            )
          ),
          el(
            PanelBody,
            { title: __('Scroll button', 'headless-core'), initialOpen: false },
            el('div', null,
              el(BaseControl, { label: __('Outer circle', 'headless-core') }),
              el(ColorPalette, {
                value: String(a.scrollButtonOuter || '#ffffff'),
                colors: palette.map(function (hex) { return { color: hex, name: hex }; }),
                onChange: function (c) { props.setAttributes({ scrollButtonOuter: c || '#ffffff' }); },
              })
            ),
            el('div', null,
              el(BaseControl, { label: __('Inner arrow', 'headless-core') }),
              el(ColorPalette, {
                value: String(a.scrollButtonInner || '#22ACB6'),
                colors: palette.map(function (hex) { return { color: hex, name: hex }; }),
                onChange: function (c) { props.setAttributes({ scrollButtonInner: c || '#22ACB6' }); },
              })
            )
          ),
          el(
            PanelBody,
            { title: __('Advanced', 'headless-core'), initialOpen: false },
            el(TextControl, {
              label: __('Section id (anchor)', 'headless-core'),
              value: a.sectionId || 'mobile-app',
              onChange: function (v) { props.setAttributes({ sectionId: v || 'mobile-app' }); },
            })
          )
        ),
        el(
          'div',
          blockProps,
          el(
            'div',
            {
              style: Object.assign(
                {
                  position: 'absolute',
                  inset: 0,
                  zIndex: 0,
                },
                bgStyle
              ),
            }
          ),
          el(
            'div',
            {
              style: {
                position: 'relative',
                zIndex: 1,
                padding: '20px 24px 28px',
                maxWidth: '960px',
                margin: '0 auto',
              },
            },
            el(RichText, {
              tagName: 'p',
              value: a.kickerText || '',
              onChange: function (v) { props.setAttributes({ kickerText: v }); },
              placeholder: __('Kicker…', 'headless-core'),
              allowedFormats: [],
              style: {
                fontSize: '12px',
                fontWeight: 500,
                textTransform: 'uppercase',
                marginBottom: '10px',
                color: '#fff',
              },
            }),
            el(RichText, {
              tagName: 'h2',
              value: a.titleText || '',
              onChange: function (v) { props.setAttributes({ titleText: v }); },
              placeholder: __('M-PORT', 'headless-core'),
              allowedFormats: [],
              style: { fontSize: '26px', fontWeight: 900, marginBottom: '12px', color: '#fff' },
            }),
            el(RichText, {
              tagName: 'div',
              value: a.bodyHtml || '',
              onChange: function (v) { props.setAttributes({ bodyHtml: v }); },
              placeholder: __('Body copy — use bold for emphasis. Leave empty for default text on the site.', 'headless-core'),
              allowedFormats: inlineFormats,
              style: { fontSize: '15px', lineHeight: 1.45, marginBottom: '14px', color: '#fff' },
            }),
            el(RichText, {
              tagName: 'p',
              value: a.downloadHeading || '',
              onChange: function (v) { props.setAttributes({ downloadHeading: v }); },
              placeholder: __('Download the app', 'headless-core'),
              allowedFormats: [],
              style: { fontSize: '20px', fontWeight: 900, marginBottom: '16px', color: '#fff' },
            }),
            el(RichText, {
              tagName: 'p',
              value: a.badgeText || '',
              onChange: function (v) { props.setAttributes({ badgeText: v }); },
              placeholder: __('MOBILE BANKING SERVICES', 'headless-core'),
              allowedFormats: [],
              style: {
                display: 'inline-block',
                background: '#EE6E2A',
                color: '#fff',
                padding: '8px 18px',
                borderRadius: '999px',
                fontSize: '12px',
                fontWeight: 600,
                marginBottom: '20px',
              },
            }),
            el('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' } },
              el('div', null,
                el('p', { style: { fontSize: '11px', margin: '0 0 6px', fontWeight: 600 } }, __('Google Play badge (Media Library)', 'headless-core')),
                a.googlePlayImageUrl
                  ? el('img', { src: a.googlePlayImageUrl, alt: '', style: { maxHeight: '44px', marginBottom: '8px', display: 'block' } })
                  : null,
                el('div', { style: { display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '6px' } },
                  el(MediaUploadCheck, null,
                    el(MediaUpload, {
                      allowedTypes: ['image'],
                      value: a.googlePlayImageId || 0,
                      onSelect: function (media) {
                        props.setAttributes({
                          googlePlayImageId: media && media.id ? media.id : 0,
                          googlePlayImageUrl: media && media.url ? media.url : '',
                        });
                      },
                      render: function (obj) {
                        return el(Button, { variant: 'secondary', onClick: obj.open }, a.googlePlayImageId ? __('Replace', 'headless-core') : __('Upload', 'headless-core'));
                      },
                    })
                  ),
                  a.googlePlayImageId
                    ? el(Button, { variant: 'tertiary', isDestructive: true, onClick: function () { props.setAttributes({ googlePlayImageId: 0, googlePlayImageUrl: '' }); } }, __('Clear', 'headless-core'))
                    : null
                ),
                el('p', { style: { fontSize: '11px', margin: '12px 0 6px', fontWeight: 600 } }, __('Google Play links (labeled buttons when 2+)', 'headless-core')),
                googlePlayLinks.map(function (row, i) {
                  return el(
                    'div',
                    {
                      key: 'gp-link-' + i,
                      style: {
                        marginBottom: '10px',
                        padding: '8px',
                        border: '1px solid rgba(255,255,255,0.35)',
                        borderRadius: '4px',
                      },
                    },
                    el(TextControl, {
                      label: __('Label', 'headless-core'),
                      value: row.label || '',
                      onChange: function (v) { setPlayLink(i, { label: v }); },
                    }),
                    el(TextControl, {
                      label: __('Play Store URL', 'headless-core'),
                      value: row.url || '',
                      onChange: function (v) { setPlayLink(i, { url: v }); },
                    }),
                    googlePlayLinks.length > 1
                      ? el(Button, {
                          variant: 'tertiary',
                          isDestructive: true,
                          onClick: function () { removePlayLink(i); },
                        }, __('Remove link', 'headless-core'))
                      : null
                  );
                }),
                el(Button, { variant: 'secondary', onClick: addPlayLink }, __('Add Play Store link', 'headless-core'))
              ),
              el('div', null,
                el('p', { style: { fontSize: '11px', margin: '0 0 6px', fontWeight: 600 } }, __('App Store badge (Media Library)', 'headless-core')),
                a.appStoreImageUrl
                  ? el('img', { src: a.appStoreImageUrl, alt: '', style: { maxHeight: '44px', marginBottom: '8px', display: 'block' } })
                  : null,
                el('div', { style: { display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '6px' } },
                  el(MediaUploadCheck, null,
                    el(MediaUpload, {
                      allowedTypes: ['image'],
                      value: a.appStoreImageId || 0,
                      onSelect: function (media) {
                        props.setAttributes({
                          appStoreImageId: media && media.id ? media.id : 0,
                          appStoreImageUrl: media && media.url ? media.url : '',
                        });
                      },
                      render: function (obj) {
                        return el(Button, { variant: 'secondary', onClick: obj.open }, a.appStoreImageId ? __('Replace', 'headless-core') : __('Upload', 'headless-core'));
                      },
                    })
                  ),
                  a.appStoreImageId
                    ? el(Button, { variant: 'tertiary', isDestructive: true, onClick: function () { props.setAttributes({ appStoreImageId: 0, appStoreImageUrl: '' }); } }, __('Clear', 'headless-core'))
                    : null
                ),
                el(TextControl, {
                  label: __('App Store URL', 'headless-core'),
                  value: a.appStoreLinkUrl || '',
                  onChange: function (v) { props.setAttributes({ appStoreLinkUrl: v }); },
                })
              )
            ),
            el('div', null,
              el('p', { style: { fontSize: '11px', margin: '0 0 6px', fontWeight: 600 } }, __('Right column image (upload from Media Library)', 'headless-core')),
              a.ussdImageUrl
                ? el('img', { src: a.ussdImageUrl, alt: '', style: { maxHeight: '72px', marginBottom: '8px', display: 'block' } })
                : null,
              el('div', { style: { display: 'flex', gap: '8px', alignItems: 'center' } },
                el(MediaUploadCheck, null,
                  el(MediaUpload, {
                    allowedTypes: ['image'],
                    value: a.ussdImageId || 0,
                    onSelect: function (media) {
                      props.setAttributes({
                        ussdImageId: media && media.id ? media.id : 0,
                        ussdImageUrl: media && media.url ? media.url : '',
                      });
                    },
                    render: function (obj) {
                      return el(Button, { variant: 'secondary', onClick: obj.open }, a.ussdImageId ? __('Replace USSD', 'headless-core') : __('Upload USSD', 'headless-core'));
                    },
                  })
                ),
                a.ussdImageId
                  ? el(Button, { variant: 'tertiary', isDestructive: true, onClick: function () { props.setAttributes({ ussdImageId: 0, ussdImageUrl: '' }); } }, __('Remove', 'headless-core'))
                  : null
              )
            )
          )
        )
      );
    },
    save: function () {
      return null;
    },
  });
})(
  window.wp.blocks,
  window.wp.blockEditor,
  window.wp.components,
  window.wp.element,
  window.wp.i18n
);
