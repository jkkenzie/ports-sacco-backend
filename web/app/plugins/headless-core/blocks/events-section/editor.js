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
  var ToggleControl = components.ToggleControl;
  var MediaUpload = blockEditor.MediaUpload;
  var MediaUploadCheck = blockEditor.MediaUploadCheck;
  var __ = i18n.__;

  var palette = ['#FF8C00', '#FF6347', '#800080', '#ff6346', '#ff7bac', '#ffffff', '#000000', '#22ACB6', '#F5F4EE'];

  function previewGradientStyle(a) {
    var gf = String(a.gradientFrom != null ? a.gradientFrom : '').trim();
    var gv = String(a.gradientVia != null ? a.gradientVia : '').trim();
    var gt = String(a.gradientTo != null ? a.gradientTo : '').trim();
    var g1 = gf || gv || gt || '#FF8C00';
    var g2 = gv || gf || gt || '#FF6347';
    var g3 = gt || gv || gf || '#800080';
    return { background: 'linear-gradient(to right,' + g1 + ',' + g2 + ',' + g3 + ')' };
  }

  function curvePreviewBg(a) {
    if (a.topBarUseGradient) {
      var f = String(a.topBarGradientFrom || '#ff6346');
      var v = String(a.topBarGradientVia || '#FF6347');
      var t = String(a.topBarGradientTo || '#ff6346');
      return 'linear-gradient(to right,' + f + ',' + v + ',' + t + ')';
    }
    return String(a.topBarBg || a.topCurveFillColor || '#ff6346');
  }

  function richText(props, a, key, tagName, placeholder, style) {
    var onChange = function (v) {
      var o = {};
      o[key] = v;
      props.setAttributes(o);
    };
    var base = {
      tagName: tagName || 'span',
      value: a[key] != null ? a[key] : '',
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
    description: __('Gradient events strip with pattern, logo, and date. Edit all text in the block.', 'headless-core'),
    attributes: {
      sectionId: { type: 'string', default: 'events' },
      gradientFrom: { type: 'string', default: '#FF8C00' },
      gradientVia: { type: 'string', default: '#FF6347' },
      gradientTo: { type: 'string', default: '#800080' },
      topCurveFillColor: { type: 'string', default: '' },
      topBarBg: { type: 'string', default: '#ff6346' },
      topBarUseGradient: { type: 'boolean', default: false },
      topBarGradientFrom: { type: 'string', default: '#ff6346' },
      topBarGradientVia: { type: 'string', default: '#FF6347' },
      topBarGradientTo: { type: 'string', default: '#ff6346' },
      topBarScrollIconOuterColor: { type: 'string', default: '' },
      scrollButtonOuter: { type: 'string', default: '#ffffff' },
      scrollButtonInner: { type: 'string', default: '' },
      patternImageId: { type: 'number', default: 0 },
      patternImageUrl: { type: 'string', default: '' },
      patternOpacity: { type: 'number', default: 0.3 },
      orchidTintColor: { type: 'string', default: '#ff7bac' },
      logoImageId: { type: 'number', default: 0 },
      logoImageUrl: { type: 'string', default: '' },
      logoAlt: { type: 'string', default: 'Ports Sacco' },
      eventTitle: { type: 'string', default: 'ADM' },
      eventSubtitle: { type: 'string', default: 'Annual Delegate Meeting' },
      dayName: { type: 'string', default: 'FRIDAY' },
      dayNumber: { type: 'string', default: '30' },
      monthName: { type: 'string', default: 'JAN' },
      year: { type: 'string', default: '2026' },
      venueTitle: { type: 'string', default: 'Venue' },
      timeLine: { type: 'string', default: '09.00 HOURS' },
      bannerTextColor: { type: 'string', default: '#ffffff' },
    },
    edit: function (props) {
      var a = props.attributes;
      var tc = a.bannerTextColor || '#ffffff';
      var bg = previewGradientStyle(a);

      var blockProps = useBlockProps({
        className: 'headless-events-section-block',
        style: {
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          overflow: 'hidden',
          minHeight: '320px',
        },
      });

      var museo = "'Museo900-Regular', Museo, sans-serif";
      var sans = 'Sans-serif, Helvetica, sans-serif';

      function colorField(label, attr, fallback) {
        var val = String(a[attr] != null && a[attr] !== '' ? a[attr] : fallback);
        return el(
          'div',
          { key: attr, style: { marginBottom: '12px' } },
          el(BaseControl, { label: label }),
          el(ColorPalette, {
            value: val,
            colors: palette.map(function (hex) { return { color: hex, name: hex }; }),
            onChange: function (c) {
              var o = {};
              o[attr] = c != null && c !== '' ? c : fallback;
              props.setAttributes(o);
            },
          })
        );
      }

      return el(
        Fragment,
        null,
        el(
          InspectorControls,
          null,
          el(
            PanelBody,
            { title: __('Section', 'headless-core'), initialOpen: false },
            el(TextControl, {
              label: __('Section id (anchor)', 'headless-core'),
              value: a.sectionId != null ? a.sectionId : 'events',
              onChange: function (v) { props.setAttributes({ sectionId: v != null ? String(v) : 'events' }); },
            })
          ),
          el(
            PanelBody,
            { title: __('Section gradient', 'headless-core'), initialOpen: true },
            el('div', { style: { marginBottom: '8px', height: '40px', borderRadius: '6px', ...bg } }),
            colorField(__('Start', 'headless-core'), 'gradientFrom', '#FF8C00'),
            colorField(__('Middle', 'headless-core'), 'gradientVia', '#FF6347'),
            colorField(__('End', 'headless-core'), 'gradientTo', '#800080')
          ),
          el(
            PanelBody,
            { title: __('Top bar (curve)', 'headless-core'), initialOpen: true },
            el(ToggleControl, {
              label: __('Use horizontal gradient on curve', 'headless-core'),
              checked: !!a.topBarUseGradient,
              onChange: function (v) { props.setAttributes({ topBarUseGradient: v }); },
              help: __('The small wave above the scroll button. Matches Partners carousel top bar.', 'headless-core'),
            }),
            !a.topBarUseGradient
              ? colorField(__('Curve color (solid)', 'headless-core'), 'topBarBg', '#ff6346')
              : null,
            a.topBarUseGradient
              ? colorField(__('Curve — gradient start', 'headless-core'), 'topBarGradientFrom', '#ff6346')
              : null,
            a.topBarUseGradient
              ? colorField(__('Curve — gradient middle', 'headless-core'), 'topBarGradientVia', '#FF6347')
              : null,
            a.topBarUseGradient
              ? colorField(__('Curve — gradient end', 'headless-core'), 'topBarGradientTo', '#ff6346')
              : null,
            el('div', { key: 'topBarScrollIconOuterColor', style: { marginBottom: '12px' } },
              el(BaseControl, {
                label: __('Scroll icon — outer ring', 'headless-core'),
                help: __('Leave unset to use “Scroll — outer” below.', 'headless-core'),
              }),
              el(ColorPalette, {
                value: String(
                  a.topBarScrollIconOuterColor != null && a.topBarScrollIconOuterColor !== ''
                    ? a.topBarScrollIconOuterColor
                    : (a.scrollButtonOuter || '#ffffff')
                ),
                colors: palette.map(function (hex) { return { color: hex, name: hex }; }),
                onChange: function (c) { props.setAttributes({ topBarScrollIconOuterColor: c || '' }); },
              }),
              el(Button, {
                variant: 'link',
                isSmall: true,
                onClick: function () { props.setAttributes({ topBarScrollIconOuterColor: '' }); },
              }, __('Use scroll outer color', 'headless-core'))
            ),
            colorField(__('Scroll — outer', 'headless-core'), 'scrollButtonOuter', '#ffffff'),
            el(TextControl, {
              label: __('Scroll — inner (empty = transparent)', 'headless-core'),
              value: a.scrollButtonInner || '',
              onChange: function (v) { props.setAttributes({ scrollButtonInner: v || '' }); },
            })
          ),
          el(
            PanelBody,
            { title: __('Banner & overlay', 'headless-core'), initialOpen: false },
            colorField(__('Banner text & rules', 'headless-core'), 'bannerTextColor', '#ffffff'),
            colorField(__('Orchid tint (overlay)', 'headless-core'), 'orchidTintColor', '#ff7bac'),
            el(TextControl, {
              label: __('Pattern opacity (0–1)', 'headless-core'),
              type: 'number',
              step: 0.05,
              min: 0,
              max: 1,
              value: a.patternOpacity != null ? a.patternOpacity : 0.3,
              onChange: function (v) {
                var n = parseFloat(v);
                props.setAttributes({ patternOpacity: Number.isNaN(n) ? 0.3 : Math.max(0, Math.min(1, n)) });
              },
            })
          ),
          el(
            PanelBody,
            { title: __('Images', 'headless-core'), initialOpen: false },
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
                padding: '0 12px 20px',
                ...bg,
                color: tc,
                minHeight: '300px',
                boxSizing: 'border-box',
                overflow: 'hidden',
              },
            },
            el(
              'div',
              { style: { position: 'relative', marginTop: '0', marginBottom: '8px' } },
              el('div', {
                style: {
                  minHeight: '28px',
                  marginTop: '-8px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'flex-end',
                },
              },
              el('div', {
                style: {
                  width: '72px',
                  height: '22px',
                  borderRadius: '2px',
                  background: curvePreviewBg(a),
                },
              })
              ),
              el(
                'div',
                { style: { display: 'flex', justifyContent: 'center', marginTop: '-36px', marginBottom: '8px', position: 'relative', zIndex: 2 } },
                el('div', {
                  style: {
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: a.topBarScrollIconOuterColor || a.scrollButtonOuter || '#ffffff',
                    opacity: 0.9,
                  },
                })
              )
            ),
            a.patternImageUrl
              ? el('img', {
                src: a.patternImageUrl,
                alt: '',
                style: {
                  position: 'absolute',
                  top: '-15%',
                  right: '-25%',
                  width: '65%',
                  height: 'auto',
                  opacity: a.patternOpacity != null ? a.patternOpacity : 0.3,
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
                  marginTop: '12px',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  gap: '12px 15px',
                  maxWidth: '100%',
                },
              },
              a.logoImageUrl
                ? el('div', { style: { flex: '0 0 auto', marginRight: '4px' } },
                  el('img', {
                    src: a.logoImageUrl,
                    alt: a.logoAlt || '',
                    style: { maxHeight: '56px', width: 'auto', objectFit: 'contain', display: 'block' },
                  })
                )
                : null,
              el(
                'div',
                { style: { flex: '1 1 140px', minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' } },
                richText(props, a, 'eventTitle', 'div', __('Title', 'headless-core'), {
                  color: tc,
                  fontFamily: museo,
                  fontWeight: 900,
                  fontSize: 'clamp(32px, 8vw, 72px)',
                  lineHeight: 1,
                  textTransform: 'uppercase',
                  margin: 0,
                }),
                richText(props, a, 'eventSubtitle', 'div', __('Subtitle', 'headless-core'), {
                  color: tc,
                  fontFamily: sans,
                  fontSize: '13px',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  marginTop: '6px',
                })
              ),
              el(
                'div',
                { style: { display: 'flex', alignItems: 'stretch', flex: '0 1 auto', gap: '0' } },
                el('div', {
                  style: {
                    width: '2px',
                    alignSelf: 'stretch',
                    margin: '0 10px',
                    borderLeft: '2px dotted ' + tc,
                  },
                }),
                el(
                  'div',
                  { style: { display: 'flex', gap: '6px', alignItems: 'flex-end' } },
                  el(
                    'div',
                    { style: { display: 'flex', flexDirection: 'column', alignItems: 'flex-start' } },
                    richText(props, a, 'dayName', 'div', __('Day name', 'headless-core'), {
                      color: tc,
                      fontFamily: museo,
                      fontWeight: 900,
                      fontSize: '22px',
                      lineHeight: 1,
                      textTransform: 'uppercase',
                      margin: 0,
                    }),
                    richText(props, a, 'dayNumber', 'div', __('Day', 'headless-core'), {
                      color: tc,
                      fontFamily: museo,
                      fontWeight: 900,
                      fontSize: '48px',
                      lineHeight: 1,
                      margin: 0,
                    })
                  ),
                  el(
                    'div',
                    { style: { display: 'flex', flexDirection: 'column', alignItems: 'flex-start' } },
                    richText(props, a, 'monthName', 'div', __('Month', 'headless-core'), {
                      color: tc,
                      fontFamily: museo,
                      fontWeight: 900,
                      fontSize: '36px',
                      lineHeight: 1,
                      textTransform: 'uppercase',
                      margin: 0,
                    }),
                    richText(props, a, 'year', 'div', __('Year', 'headless-core'), {
                      color: tc,
                      fontFamily: museo,
                      fontWeight: 900,
                      fontSize: '30px',
                      lineHeight: 1,
                      margin: 0,
                    })
                  )
                ),
                el('div', {
                  style: {
                    width: '2px',
                    alignSelf: 'stretch',
                    margin: '0 10px 0 6px',
                    borderLeft: '2px dotted ' + tc,
                  },
                })
              ),
              el(
                'div',
                { style: { flex: '1 1 120px', minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '0 6px' } },
                richText(props, a, 'venueTitle', 'div', __('Venue', 'headless-core'), {
                  color: tc,
                  fontFamily: museo,
                  fontWeight: 900,
                  fontSize: '28px',
                  lineHeight: 1.1,
                  textTransform: 'uppercase',
                  width: '100%',
                  margin: 0,
                }),
                el('div', {
                  style: {
                    borderBottom: '2px dotted ' + tc,
                    width: '100%',
                    margin: '8px 0',
                  },
                }),
                richText(props, a, 'timeLine', 'div', __('Time', 'headless-core'), {
                  color: tc,
                  fontFamily: museo,
                  fontWeight: 900,
                  fontSize: '16px',
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
