(function (blocks, blockEditor, components, element, i18n) {
  var el = element.createElement;
  var Fragment = element.Fragment;
  var registerBlockType = blocks.registerBlockType;
  var useBlockProps = blockEditor.useBlockProps;
  var InspectorControls = blockEditor.InspectorControls;
  var PanelBody = components.PanelBody;
  var Button = components.Button;
  var TextControl = components.TextControl;
  var ToggleControl = components.ToggleControl;
  var RangeControl = components.RangeControl || components.__experimentalRangeControl;
  var MediaUpload = blockEditor.MediaUpload;
  var MediaUploadCheck = blockEditor.MediaUploadCheck;
  var BaseControl = components.BaseControl;
  var ColorPalette = components.ColorPalette;
  var __ = i18n.__;

  var palette = ['#00B2E0', '#00AFBB', '#00AB81', '#F5F4EE', '#f3f5f7', '#22ACB6', '#EE6E2A', '#ffffff', '#000000', '#d1d5db'];

  function updatePartner(partners, index, patch) {
    var next = partners.slice();
    var cur = Object.assign({}, next[index] || { imageId: 0, imageUrl: '', alt: '' });
    Object.assign(cur, patch);
    next[index] = cur;
    return next;
  }

  registerBlockType('custom/partners-carousel', {
    apiVersion: 3,
    title: __('Partners carousel', 'headless-core'),
    icon: 'groups',
    category: 'widgets',
    description: __('Logo carousel for partners and sponsors.', 'headless-core'),
    attributes: {
      sectionId: { type: 'string', default: 'partners' },
      useGradient: { type: 'boolean', default: true },
      gradientFrom: { type: 'string', default: '#00B2E0' },
      gradientVia: { type: 'string', default: '#00AFBB' },
      gradientTo: { type: 'string', default: '#00AB81' },
      sectionBgColor: { type: 'string', default: '#ffffff' },
      topBarBg: { type: 'string', default: '#F5F4EE' },
      topBarUseGradient: { type: 'boolean', default: false },
      topBarGradientFrom: { type: 'string', default: '#F5F4EE' },
      topBarGradientVia: { type: 'string', default: '#E8E6E0' },
      topBarGradientTo: { type: 'string', default: '#F5F4EE' },
      topBarScrollIconOuterColor: { type: 'string', default: '' },
      curveAccentColor: { type: 'string', default: '#00AFBB' },
      scrollButtonOuter: { type: 'string', default: '#ffffff' },
      scrollButtonInner: { type: 'string', default: '#22ACB6' },
      kickerText: { type: 'string', default: '' },
      badgeText: { type: 'string', default: '' },
      kickerColor: { type: 'string', default: '#22ACB6' },
      badgeBgColor: { type: 'string', default: '#EE6E2A' },
      badgeTextColor: { type: 'string', default: '#ffffff' },
      carouselArrowBg: { type: 'string', default: '#00AFBB' },
      carouselArrowIconColor: { type: 'string', default: '#ffffff' },
      dotActiveColor: { type: 'string', default: '#EE6E2A' },
      dotInactiveColor: { type: 'string', default: '#d1d5db' },
      maxItems: { type: 'number', default: 0 },
      slidesToScroll: { type: 'number', default: 1 },
      visibleMobile: { type: 'number', default: 1 },
      visibleTablet: { type: 'number', default: 2 },
      visibleDesktop: { type: 'number', default: 4 },
      carouselLoop: { type: 'boolean', default: true },
      showPartnerCount: { type: 'boolean', default: true },
      partnerCountSuffix: { type: 'string', default: 'partners' },
      partners: { type: 'array', default: [] },
    },
    edit: function (props) {
      var a = props.attributes;
      var blockProps = useBlockProps({ className: 'headless-partners-carousel-block' });
      var partners = Array.isArray(a.partners) ? a.partners : [];

      function colorField(label, attr, fallback) {
        var val = String(a[attr] != null && a[attr] !== '' ? a[attr] : fallback);
        return el(
          'div',
          { key: attr, style: { marginBottom: '12px' } },
          el(BaseControl, { label: label }),
          el(ColorPalette, {
            value: val,
            colors: palette.map(function (hex) { return { color: hex, name: hex }; }),
            onChange: function (c) { var o = {}; o[attr] = c || fallback; props.setAttributes(o); },
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
            { title: __('Colors', 'headless-core'), initialOpen: true },
            el(ToggleControl, {
              label: __('Use gradient background', 'headless-core'),
              checked: a.useGradient !== false,
              onChange: function (v) { props.setAttributes({ useGradient: v }); },
              help: __('When off, uses solid section background below.', 'headless-core'),
            }),
            colorField(__('Gradient start', 'headless-core'), 'gradientFrom', '#00B2E0'),
            colorField(__('Gradient middle', 'headless-core'), 'gradientVia', '#00AFBB'),
            colorField(__('Gradient end', 'headless-core'), 'gradientTo', '#00AB81'),
            colorField(__('Section background (solid)', 'headless-core'), 'sectionBgColor', '#ffffff'),
            colorField(__('Curve accent', 'headless-core'), 'curveAccentColor', '#00AFBB'),
            colorField(__('Scroll button — outer ring', 'headless-core'), 'scrollButtonOuter', '#ffffff'),
            colorField(__('Scroll button — arrow', 'headless-core'), 'scrollButtonInner', '#22ACB6'),
            colorField(__('Kicker text', 'headless-core'), 'kickerColor', '#22ACB6'),
            colorField(__('Badge background', 'headless-core'), 'badgeBgColor', '#EE6E2A'),
            colorField(__('Badge text', 'headless-core'), 'badgeTextColor', '#ffffff'),
            colorField(__('Carousel arrow background', 'headless-core'), 'carouselArrowBg', '#00AFBB'),
            colorField(__('Carousel arrow icon', 'headless-core'), 'carouselArrowIconColor', '#ffffff'),
            colorField(__('Dot — active', 'headless-core'), 'dotActiveColor', '#EE6E2A'),
            colorField(__('Dot — inactive border', 'headless-core'), 'dotInactiveColor', '#d1d5db')
          ),
          el(
            PanelBody,
            { title: __('Top bar strip', 'headless-core'), initialOpen: true },
            el(ToggleControl, {
              label: __('Use horizontal gradient', 'headless-core'),
              checked: !!a.topBarUseGradient,
              onChange: function (v) { props.setAttributes({ topBarUseGradient: v }); },
              help: __('The strip above the curved divider. When off, uses a solid color.', 'headless-core'),
            }),
            !a.topBarUseGradient
              ? colorField(__('Top bar color', 'headless-core'), 'topBarBg', '#F5F4EE')
              : null,
            a.topBarUseGradient
              ? colorField(__('Top bar — gradient start', 'headless-core'), 'topBarGradientFrom', '#F5F4EE')
              : null,
            a.topBarUseGradient
              ? colorField(__('Top bar — gradient middle', 'headless-core'), 'topBarGradientVia', '#E8E6E0')
              : null,
            a.topBarUseGradient
              ? colorField(__('Top bar — gradient end', 'headless-core'), 'topBarGradientTo', '#F5F4EE')
              : null,
            el('div', { key: 'topBarScrollIconOuterColor', style: { marginBottom: '12px' } },
              el(BaseControl, {
                label: __('Scroll icon — outer ring', 'headless-core'),
                help: __('The circular outline around the arrow. Leave unset to use “Scroll button — outer ring” in Colors.', 'headless-core'),
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
              }, __('Use scroll button outer color', 'headless-core'))
            )
          ),
          el(
            PanelBody,
            { title: __('Carousel', 'headless-core'), initialOpen: false },
            el(RangeControl, {
              label: __('Max items (0 = all)', 'headless-core'),
              value: a.maxItems != null ? a.maxItems : 0,
              onChange: function (v) { props.setAttributes({ maxItems: v }); },
              min: 0,
              max: 40,
            }),
            el(RangeControl, {
              label: __('Slides to scroll', 'headless-core'),
              value: a.slidesToScroll != null ? a.slidesToScroll : 1,
              onChange: function (v) { props.setAttributes({ slidesToScroll: Math.max(1, v) }); },
              min: 1,
              max: 6,
            }),
            el(RangeControl, {
              label: __('Visible (desktop)', 'headless-core'),
              value: a.visibleDesktop != null ? a.visibleDesktop : 4,
              onChange: function (v) { props.setAttributes({ visibleDesktop: Math.max(1, v) }); },
              min: 1,
              max: 8,
            }),
            el(ToggleControl, {
              label: __('Loop', 'headless-core'),
              checked: !!a.carouselLoop,
              onChange: function (v) { props.setAttributes({ carouselLoop: v }); },
            }),
            el(ToggleControl, {
              label: __('Show partner count', 'headless-core'),
              checked: !!a.showPartnerCount,
              onChange: function (v) { props.setAttributes({ showPartnerCount: v }); },
            }),
            el(TextControl, {
              label: __('Count suffix', 'headless-core'),
              value: a.partnerCountSuffix || '',
              onChange: function (v) { props.setAttributes({ partnerCountSuffix: v || '' }); },
            }),
            el(TextControl, {
              label: __('Section id', 'headless-core'),
              value: a.sectionId || 'partners',
              onChange: function (v) { props.setAttributes({ sectionId: v || 'partners' }); },
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
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                overflow: 'hidden',
              },
            },
            el('div', {
              style: {
                height: '12px',
                background: a.topBarUseGradient
                  ? 'linear-gradient(to right,' +
                    String(a.topBarGradientFrom || '#F5F4EE') +
                    ',' +
                    String(a.topBarGradientVia || '#E8E6E0') +
                    ',' +
                    String(a.topBarGradientTo || '#F5F4EE') +
                    ')'
                  : String(a.topBarBg || '#F5F4EE'),
              },
            }),
            el('div', {
              style: {
                padding: '16px',
                background: a.useGradient !== false
                  ? 'linear-gradient(to right,' +
                    String(a.gradientFrom || '#00B2E0') +
                    ',' +
                    String(a.gradientVia || '#00AFBB') +
                    ',' +
                    String(a.gradientTo || '#00AB81') +
                    ')'
                  : a.sectionBgColor || '#fff',
              },
            },
            el('p', { style: { marginTop: 0, fontWeight: 600 } }, __('Partner logos', 'headless-core')),
            partners.map(function (p, i) {
              return el(
                'div',
                { key: i, style: { display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap' } },
                p.imageUrl ? el('img', { src: p.imageUrl, alt: '', style: { height: '40px', width: 'auto', objectFit: 'contain' } }) : el('span', { style: { fontSize: '12px', color: '#888' } }, __('No image', 'headless-core')),
                el(MediaUploadCheck, null,
                  el(MediaUpload, {
                    allowedTypes: ['image'],
                    value: p.imageId || 0,
                    onSelect: function (media) {
                      props.setAttributes({
                        partners: updatePartner(partners, i, {
                          imageId: media && media.id ? media.id : 0,
                          imageUrl: media && media.url ? media.url : '',
                        }),
                      });
                    },
                    render: function (obj) {
                      return el(Button, { variant: 'secondary', onClick: obj.open }, __('Choose', 'headless-core'));
                    },
                  })
                ),
                el(TextControl, {
                  label: __('Alt', 'headless-core'),
                  value: p.alt || '',
                  onChange: function (v) {
                    props.setAttributes({ partners: updatePartner(partners, i, { alt: v || '' }) });
                  },
                }),
                el(Button, {
                  variant: 'tertiary',
                  isDestructive: true,
                  onClick: function () {
                    var next = partners.slice();
                    next.splice(i, 1);
                    props.setAttributes({ partners: next });
                  },
                }, __('Remove', 'headless-core'))
              );
            }),
            el(Button, {
              variant: 'primary',
              onClick: function () {
                props.setAttributes({ partners: partners.concat([{ imageId: 0, imageUrl: '', alt: '' }]) });
              },
            }, __('Add partner', 'headless-core'))
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
