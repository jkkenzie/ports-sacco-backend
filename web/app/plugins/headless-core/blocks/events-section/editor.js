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
  var MediaUpload = blockEditor.MediaUpload;
  var MediaUploadCheck = blockEditor.MediaUploadCheck;
  var __ = i18n.__;

  var palette = ['#FF8C00', '#FF6347', '#800080', '#ff6346', '#ff7bac', '#ffffff', '#000000', '#22ACB6'];

  function previewGradientStyle(a) {
    var gf = String(a.gradientFrom || '').trim();
    var gv = String(a.gradientVia || '').trim();
    var gt = String(a.gradientTo || '').trim();
    if (!gf && !gv && !gt) {
      return { background: 'transparent' };
    }
    var g1 = gf || gv || gt;
    var g2 = gv || gf || gt;
    var g3 = gt || gv || gf;
    return { background: 'linear-gradient(to right,' + g1 + ',' + g2 + ',' + g3 + ')' };
  }

  function richText(props, a, key, tagName, placeholder, style) {
    var onChange = function (v) {
      var o = {};
      o[key] = v;
      props.setAttributes(o);
    };
    var base = {
      tagName: tagName || 'span',
      value: a[key] || '',
      onChange: onChange,
      placeholder: placeholder,
      allowedFormats: [],
      disableLineBreaks: true,
    };
    if (style) {
      base.style = style;
    }
    return el(RichText, base);
  }

  registerBlockType('custom/events-section', {
    apiVersion: 3,
    title: __('Events banner', 'headless-core'),
    icon: 'calendar-alt',
    category: 'widgets',
    description: __('Gradient events strip with optional pattern, logo, and date fields.', 'headless-core'),
    attributes: {
      sectionId: { type: 'string', default: '' },
      gradientFrom: { type: 'string', default: '' },
      gradientVia: { type: 'string', default: '' },
      gradientTo: { type: 'string', default: '' },
      topCurveFillColor: { type: 'string', default: '' },
      scrollButtonOuter: { type: 'string', default: '' },
      scrollButtonInner: { type: 'string', default: '' },
      patternImageId: { type: 'number', default: 0 },
      patternImageUrl: { type: 'string', default: '' },
      patternOpacity: { type: 'number', default: 0 },
      orchidTintColor: { type: 'string', default: '' },
      logoImageId: { type: 'number', default: 0 },
      logoImageUrl: { type: 'string', default: '' },
      logoAlt: { type: 'string', default: '' },
      eventTitle: { type: 'string', default: '' },
      eventSubtitle: { type: 'string', default: '' },
      dayName: { type: 'string', default: '' },
      dayNumber: { type: 'string', default: '' },
      monthName: { type: 'string', default: '' },
      year: { type: 'string', default: '' },
      venueTitle: { type: 'string', default: '' },
      timeLine: { type: 'string', default: '' },
      bannerTextColor: { type: 'string', default: '' },
    },
    edit: function (props) {
      var a = props.attributes;
      var tc = a.bannerTextColor || '';
      var bg = previewGradientStyle(a);

      var blockProps = useBlockProps({
        className: 'headless-events-section-block',
        style: {
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          overflow: 'hidden',
          minHeight: '280px',
        },
      });

      var museo = "'Museo900-Regular', Museo, sans-serif, sans-serif";
      var sans = 'Sans-serif, Helvetica, sans-serif';

      return el(
        Fragment,
        null,
        el(
          InspectorControls,
          null,
          el(
            PanelBody,
            { title: __('Block', 'headless-core'), initialOpen: false },
            el(TextControl, {
              label: __('Section id (anchor)', 'headless-core'),
              value: a.sectionId != null ? a.sectionId : '',
              onChange: function (v) { props.setAttributes({ sectionId: v != null ? String(v) : '' }); },
              help: __('Optional. Used for in-page links when set.', 'headless-core'),
            })
          ),
          el(
            PanelBody,
            { title: __('Gradient & curve', 'headless-core'), initialOpen: true },
            el('div', { style: { marginBottom: '8px', height: '48px', borderRadius: '6px', ...bg } }),
            el(BaseControl, { label: __('Gradient start', 'headless-core') }),
            el(ColorPalette, {
              value: a.gradientFrom || '',
              colors: palette.map(function (hex) { return { color: hex, name: hex }; }),
              onChange: function (c) { props.setAttributes({ gradientFrom: c != null && c !== '' ? c : '' }); },
            }),
            el(BaseControl, { label: __('Gradient middle', 'headless-core') }),
            el(ColorPalette, {
              value: a.gradientVia || '',
              colors: palette.map(function (hex) { return { color: hex, name: hex }; }),
              onChange: function (c) { props.setAttributes({ gradientVia: c != null && c !== '' ? c : '' }); },
            }),
            el(BaseControl, { label: __('Gradient end', 'headless-core') }),
            el(ColorPalette, {
              value: a.gradientTo || '',
              colors: palette.map(function (hex) { return { color: hex, name: hex }; }),
              onChange: function (c) { props.setAttributes({ gradientTo: c != null && c !== '' ? c : '' }); },
            }),
            el(BaseControl, { label: __('Small curve fill (above scroll)', 'headless-core') }),
            el(ColorPalette, {
              value: a.topCurveFillColor || '',
              colors: palette.map(function (hex) { return { color: hex, name: hex }; }),
              onChange: function (c) { props.setAttributes({ topCurveFillColor: c != null && c !== '' ? c : '' }); },
            }),
            el(BaseControl, { label: __('Scroll ring outer', 'headless-core') }),
            el(ColorPalette, {
              value: a.scrollButtonOuter || '',
              colors: palette.map(function (hex) { return { color: hex, name: hex }; }),
              onChange: function (c) { props.setAttributes({ scrollButtonOuter: c != null && c !== '' ? c : '' }); },
            }),
            el(TextControl, {
              label: __('Scroll ring inner (empty = transparent)', 'headless-core'),
              value: a.scrollButtonInner || '',
              onChange: function (v) { props.setAttributes({ scrollButtonInner: v || '' }); },
            }),
            el(BaseControl, { label: __('Overlay tint', 'headless-core') }),
            el(ColorPalette, {
              value: a.orchidTintColor || '',
              colors: palette.map(function (hex) { return { color: hex, name: hex }; }),
              onChange: function (c) { props.setAttributes({ orchidTintColor: c != null && c !== '' ? c : '' }); },
            }),
            el(BaseControl, { label: __('Banner text & rules', 'headless-core') }),
            el(ColorPalette, {
              value: tc,
              colors: palette.map(function (hex) { return { color: hex, name: hex }; }),
              onChange: function (c) { props.setAttributes({ bannerTextColor: c != null && c !== '' ? c : '' }); },
            })
          ),
          el(
            PanelBody,
            { title: __('Images', 'headless-core'), initialOpen: true },
            el('p', { style: { fontSize: '12px', marginTop: 0 } }, __('Background pattern (optional)', 'headless-core')),
            a.patternImageUrl
              ? el('img', { src: a.patternImageUrl, alt: '', style: { maxHeight: '80px', marginBottom: '8px', display: 'block' } })
              : null,
            el('div', { style: { display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' } },
              el(MediaUploadCheck, null,
                el(MediaUpload, {
                  allowedTypes: ['image'],
                  value: a.patternImageId || 0,
                  onSelect: function (media) {
                    props.setAttributes({
                      patternImageId: media && media.id ? media.id : 0,
                      patternImageUrl: media && media.url ? media.url : '',
                    });
                  },
                  render: function (obj) {
                    return el(Button, { variant: 'secondary', onClick: obj.open }, a.patternImageId ? __('Replace pattern', 'headless-core') : __('Upload pattern', 'headless-core'));
                  },
                })
              ),
              a.patternImageId
                ? el(Button, { variant: 'tertiary', isDestructive: true, onClick: function () { props.setAttributes({ patternImageId: 0, patternImageUrl: '' }); } }, __('Clear', 'headless-core'))
                : null
            ),
            el(TextControl, {
              label: __('Pattern opacity (0–1)', 'headless-core'),
              type: 'number',
              step: 0.05,
              min: 0,
              max: 1,
              value: a.patternOpacity != null ? a.patternOpacity : 0,
              onChange: function (v) {
                var n = parseFloat(v);
                props.setAttributes({ patternOpacity: Number.isNaN(n) ? 0 : Math.max(0, Math.min(1, n)) });
              },
            }),
            el('p', { style: { fontSize: '12px', marginTop: '16px' } }, __('Logo (optional)', 'headless-core')),
            a.logoImageUrl
              ? el('img', { src: a.logoImageUrl, alt: '', style: { maxHeight: '56px', marginBottom: '8px', display: 'block' } })
              : null,
            el('div', { style: { display: 'flex', gap: '8px', flexWrap: 'wrap' } },
              el(MediaUploadCheck, null,
                el(MediaUpload, {
                  allowedTypes: ['image'],
                  value: a.logoImageId || 0,
                  onSelect: function (media) {
                    props.setAttributes({
                      logoImageId: media && media.id ? media.id : 0,
                      logoImageUrl: media && media.url ? media.url : '',
                    });
                  },
                  render: function (obj) {
                    return el(Button, { variant: 'secondary', onClick: obj.open }, a.logoImageId ? __('Replace logo', 'headless-core') : __('Upload logo', 'headless-core'));
                  },
                })
              ),
              a.logoImageId
                ? el(Button, { variant: 'tertiary', isDestructive: true, onClick: function () { props.setAttributes({ logoImageId: 0, logoImageUrl: '' }); } }, __('Clear', 'headless-core'))
                : null
            ),
            el(TextControl, {
              label: __('Logo alt text', 'headless-core'),
              value: a.logoAlt || '',
              onChange: function (v) { props.setAttributes({ logoAlt: v || '' }); },
            })
          )
        ),
        el(
          'div',
          blockProps,
          el(
            'div',
            {
              style: {
                position: 'relative',
                padding: '20px 16px 24px',
                ...bg,
                color: tc || undefined,
                minHeight: '240px',
                boxSizing: 'border-box',
              },
            },
            a.patternImageUrl
              ? el('img', {
                src: a.patternImageUrl,
                alt: '',
                style: {
                  position: 'absolute',
                  top: '-20%',
                  right: '-30%',
                  width: '70%',
                  height: 'auto',
                  opacity: a.patternOpacity != null ? a.patternOpacity : 0,
                  mixBlendMode: 'multiply',
                  pointerEvents: 'none',
                },
              })
              : null,
            el(
              'div',
              {
                style: {
                  position: 'relative',
                  zIndex: 1,
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  gap: '12px 16px',
                  maxWidth: '100%',
                },
              },
              a.logoImageUrl
                ? el('div', { style: { flex: '0 0 auto', marginRight: '4px' } },
                  el('img', {
                    src: a.logoImageUrl,
                    alt: a.logoAlt || '',
                    style: { maxHeight: '64px', width: 'auto', objectFit: 'contain', display: 'block' },
                  })
                )
                : null,
              el(
                'div',
                { style: { flex: '1 1 160px', minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' } },
                richText(props, a, 'eventTitle', 'div', __('Title…', 'headless-core'), {
                  color: tc || undefined,
                  fontFamily: museo,
                  fontWeight: 900,
                  fontSize: 'clamp(28px, 5vw, 52px)',
                  lineHeight: 1,
                  textTransform: 'uppercase',
                  margin: 0,
                }),
                richText(props, a, 'eventSubtitle', 'div', __('Subtitle…', 'headless-core'), {
                  color: tc || undefined,
                  fontFamily: sans,
                  fontSize: '12px',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  marginTop: '6px',
                  opacity: 0.95,
                })
              ),
              el(
                'div',
                { style: { display: 'flex', alignItems: 'stretch', flex: '0 1 auto', gap: '0' } },
                el('div', {
                  style: {
                    width: '2px',
                    alignSelf: 'stretch',
                    margin: '0 12px',
                    borderLeft: tc ? '2px dotted ' + tc : '2px dotted transparent',
                  },
                }),
                el(
                  'div',
                  { style: { display: 'flex', gap: '8px', alignItems: 'flex-end' } },
                  el(
                    'div',
                    { style: { display: 'flex', flexDirection: 'column', alignItems: 'flex-start' } },
                    richText(props, a, 'dayName', 'div', __('Day name…', 'headless-core'), {
                      color: tc || undefined,
                      fontFamily: museo,
                      fontWeight: 900,
                      fontSize: '18px',
                      lineHeight: 1,
                      textTransform: 'uppercase',
                      margin: 0,
                    }),
                    richText(props, a, 'dayNumber', 'div', __('Day…', 'headless-core'), {
                      color: tc || undefined,
                      fontFamily: museo,
                      fontWeight: 900,
                      fontSize: '42px',
                      lineHeight: 1,
                      margin: 0,
                    })
                  ),
                  el(
                    'div',
                    { style: { display: 'flex', flexDirection: 'column', alignItems: 'flex-start' } },
                    richText(props, a, 'monthName', 'div', __('Month…', 'headless-core'), {
                      color: tc || undefined,
                      fontFamily: museo,
                      fontWeight: 900,
                      fontSize: '28px',
                      lineHeight: 1,
                      textTransform: 'uppercase',
                      margin: 0,
                    }),
                    richText(props, a, 'year', 'div', __('Year…', 'headless-core'), {
                      color: tc || undefined,
                      fontFamily: museo,
                      fontWeight: 900,
                      fontSize: '24px',
                      lineHeight: 1,
                      margin: 0,
                    })
                  )
                ),
                el('div', {
                  style: {
                    width: '2px',
                    alignSelf: 'stretch',
                    margin: '0 12px 0 8px',
                    borderLeft: tc ? '2px dotted ' + tc : '2px dotted transparent',
                  },
                })
              ),
              el(
                'div',
                { style: { flex: '1 1 140px', minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '0 8px' } },
                richText(props, a, 'venueTitle', 'div', __('Venue…', 'headless-core'), {
                  color: tc || undefined,
                  fontFamily: museo,
                  fontWeight: 900,
                  fontSize: '22px',
                  lineHeight: 1.1,
                  textTransform: 'uppercase',
                  width: '100%',
                  margin: 0,
                }),
                el('div', {
                  style: {
                    borderBottom: tc ? '2px dotted ' + tc : '2px dotted transparent',
                    width: '100%',
                    margin: '8px 0',
                  },
                }),
                richText(props, a, 'timeLine', 'div', __('Time…', 'headless-core'), {
                  color: tc || undefined,
                  fontFamily: museo,
                  fontWeight: 900,
                  fontSize: '14px',
                  lineHeight: 1.2,
                  textTransform: 'uppercase',
                  width: '100%',
                  margin: 0,
                })
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
