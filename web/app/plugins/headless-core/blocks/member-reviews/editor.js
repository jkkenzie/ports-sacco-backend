(function (blocks, blockEditor, components, element, i18n) {
  var el = element.createElement;
  var Fragment = element.Fragment;
  var registerBlockType = blocks.registerBlockType;
  var useBlockProps = blockEditor.useBlockProps;
  var InspectorControls = blockEditor.InspectorControls;
  var RichText = blockEditor.RichText;
  var PanelBody = components.PanelBody;
  var Button = components.Button;
  var TextControl = components.TextControl;
  var TextareaControl = components.TextareaControl;
  var ToggleControl = components.ToggleControl;
  var RangeControl = components.RangeControl || components.__experimentalRangeControl;
  var BaseControl = components.BaseControl;
  var ColorPalette = components.ColorPalette;
  var MediaUpload = blockEditor.MediaUpload;
  var MediaUploadCheck = blockEditor.MediaUploadCheck;
  var __ = i18n.__;

  var palette = [
    '#FF8C00',
    '#FF6347',
    '#800080',
    '#ff6346',
    '#ff7bac',
    '#ffffff',
    '#F5F4EE',
    '#00B2E0',
    '#22ACB6',
    '#EE6E2A',
    '#EAB308',
    '#d1d5db',
    '#6b7280',
    '#000000',
  ];

  function previewGradientStyle(a) {
    var gf = String(a.gradientFrom != null ? a.gradientFrom : '').trim();
    var gv = String(a.gradientVia != null ? a.gradientVia : '').trim();
    var gt = String(a.gradientTo != null ? a.gradientTo : '').trim();
    var g1 = gf || gv || gt || '#FF8C00';
    var g2 = gv || gf || gt || '#FF6347';
    var g3 = gt || gv || gf || '#800080';
    return { background: 'linear-gradient(to right,' + g1 + ',' + g2 + ',' + g3 + ')' };
  }

  function updateReview(reviews, index, patch) {
    var next = reviews.slice();
    var cur = Object.assign({}, next[index] || { quote: '', rating: 5, name: '', title: '' });
    Object.assign(cur, patch);
    next[index] = cur;
    return next;
  }

  function colorField(props, a, label, attr, fallback) {
    var val = String(a[attr] != null && a[attr] !== '' ? a[attr] : fallback);
    return el(
      'div',
      { key: attr, style: { marginBottom: '12px' } },
      el(BaseControl, { label: label }),
      el(ColorPalette, {
        value: val,
        colors: palette.map(function (hex) {
          return { color: hex, name: hex };
        }),
        onChange: function (c) {
          var o = {};
          o[attr] = c || fallback;
          props.setAttributes(o);
        },
      })
    );
  }

  registerBlockType('custom/member-reviews', {
    apiVersion: 3,
    title: __('Member reviews', 'headless-core'),
    icon: 'star-filled',
    category: 'widgets',
    description: __('Review carousel with star ratings.', 'headless-core'),
    attributes: {
      sectionId: { type: 'string', default: 'member-reviews' },
      useGradient: { type: 'boolean', default: false },
      gradientFrom: { type: 'string', default: '#FF8C00' },
      gradientVia: { type: 'string', default: '#FF6347' },
      gradientTo: { type: 'string', default: '#800080' },
      sectionBgColor: { type: 'string', default: '#ffffff' },
      topCurveFillColor: { type: 'string', default: '' },
      wavePathFill: { type: 'string', default: '#ff6346' },
      topBarBg: { type: 'string', default: '#ff6346' },
      topBarUseGradient: { type: 'boolean', default: false },
      topBarGradientFrom: { type: 'string', default: '#ff6346' },
      topBarGradientVia: { type: 'string', default: '#FF6347' },
      topBarGradientTo: { type: 'string', default: '#ff6346' },
      patternImageId: { type: 'number', default: 0 },
      patternImageUrl: { type: 'string', default: '' },
      patternOpacity: { type: 'number', default: 0.3 },
      orchidTintColor: { type: 'string', default: '#ff7bac' },
      topBarScrollIconOuterColor: { type: 'string', default: '' },
      scrollArrowBg: { type: 'string', default: '#ffffff' },
      scrollIconColor: { type: 'string', default: '' },
      scrollButtonOuter: { type: 'string', default: '#ffffff' },
      scrollButtonInner: { type: 'string', default: '' },
      badgeLabelHtml: { type: 'string', default: 'MEMBER REVIEWS' },
      subtitleHtml: { type: 'string', default: 'WHAT OUR MEMBERS SAY!' },
      badgeBgColor: { type: 'string', default: '#EE6E2A' },
      badgeTextColor: { type: 'string', default: '#ffffff' },
      subtitleColor: { type: 'string', default: '#22ACB6' },
      showAllReviewsRow: { type: 'boolean', default: true },
      allReviewsLabel: { type: 'string', default: 'ALL REVIEWS' },
      allReviewsUrl: { type: 'string', default: '' },
      secondaryButtonBorderColor: { type: 'string', default: '#d1d5db' },
      secondaryButtonTextColor: { type: 'string', default: '#22ACB6' },
      quoteTextColor: { type: 'string', default: '#6b7280' },
      nameColor: { type: 'string', default: '#22ACB6' },
      cardBgColor: { type: 'string', default: '#ffffff' },
      starFilledColor: { type: 'string', default: '#EAB308' },
      starEmptyColor: { type: 'string', default: '#D1D5DB' },
      carouselArrowBg: { type: 'string', default: '#22ACB6' },
      carouselArrowIconColor: { type: 'string', default: '#ffffff' },
      dotActiveColor: { type: 'string', default: '#EE6E2A' },
      dotInactiveColor: { type: 'string', default: '#d1d5db' },
      maxItems: { type: 'number', default: 0 },
      slidesToScroll: { type: 'number', default: 1 },
      visibleMobile: { type: 'number', default: 1 },
      visibleTablet: { type: 'number', default: 2 },
      visibleDesktop: { type: 'number', default: 3 },
      carouselLoop: { type: 'boolean', default: false },
      reviews: {
        type: 'array',
        default: [
          {
            quote:
              'I loved the customer service Ports Sacco provided to me. The team was polite and patient with the with all the questions I had. I am definitely coming back for another loan.',
            rating: 3,
            name: 'ANGELA MAKENA',
            title: 'BEAUTICIAN',
          },
          {
            quote:
              'We came out of the Ports Sacco offices very happy with the service. They treated us with respect and the waiting period was appropriate.',
            rating: 4,
            name: 'MORRIS OUKO',
            title: 'CEO, THE GROUP',
          },
          {
            quote:
              'I want to express my appreciation for the assistance that you provided to boost my Horticulture venture into a thriving business!',
            rating: 3.5,
            name: 'NDINDA MUTOKO',
            title: 'FARMER',
          },
        ],
      },
    },
    edit: function (props) {
      var a = props.attributes;
      var reviews = Array.isArray(a.reviews) ? a.reviews : [];
      var blockProps = useBlockProps({ className: 'headless-member-reviews-block' });

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
              value: a.sectionId || 'member-reviews',
              onChange: function (v) {
                props.setAttributes({ sectionId: v || 'member-reviews' });
              },
            })
          ),
          el(
            PanelBody,
            { title: __('Section background', 'headless-core'), initialOpen: true },
            el(ToggleControl, {
              label: __('Use gradient background', 'headless-core'),
              checked: !!a.useGradient,
              onChange: function (v) {
                props.setAttributes({ useGradient: v });
              },
              help: __(
                'Matches Events banner: orange → coral → purple. Orchid/pattern apply when gradient is on.',
                'headless-core'
              ),
            }),
            a.useGradient
              ? el('div', {
                  key: 'gradPreview',
                  style: { marginBottom: '8px', height: '40px', borderRadius: '6px', ...gradPreview },
                })
              : null,
            a.useGradient
              ? colorField(props, a, __('Gradient start', 'headless-core'), 'gradientFrom', '#FF8C00')
              : null,
            a.useGradient
              ? colorField(props, a, __('Gradient middle', 'headless-core'), 'gradientVia', '#FF6347')
              : null,
            a.useGradient
              ? colorField(props, a, __('Gradient end', 'headless-core'), 'gradientTo', '#800080')
              : null,
            colorField(props, a, __('Solid background (when gradient off)', 'headless-core'), 'sectionBgColor', '#ffffff')
          ),
          el(
            PanelBody,
            { title: __('Top bar (curve)', 'headless-core'), initialOpen: false },
            el('p', {
              key: 'waveHelp',
              style: { fontSize: '12px', marginTop: 0 },
            }, __('The small wave above the scroll button uses a single color (no SVG gradient).', 'headless-core')),
            colorField(props, a, __('Wave path color', 'headless-core'), 'wavePathFill', '#ff6346'),
            colorField(props, a, __('Arrow bg', 'headless-core'), 'scrollArrowBg', '#ffffff'),
            el('div', { key: 'iconColor', style: { marginBottom: '12px' } },
              el(BaseControl, {
                label: __('Icon color', 'headless-core'),
                help: __('Inner arrow detail. Clear for transparent.', 'headless-core'),
              }),
              el(ColorPalette, {
                value: String(
                  a.scrollIconColor != null && a.scrollIconColor !== ''
                    ? a.scrollIconColor
                    : a.scrollButtonInner || '#22ACB6'
                ),
                colors: palette.map(function (hex) {
                  return { color: hex, name: hex };
                }),
                onChange: function (c) {
                  props.setAttributes({ scrollIconColor: c || '' });
                },
              }),
              el(Button, {
                variant: 'link',
                isSmall: true,
                onClick: function () {
                  props.setAttributes({ scrollIconColor: '' });
                },
              }, __('Transparent', 'headless-core'))
            ),
            el('div', { key: 'tbScroll', style: { marginBottom: '12px' } },
              el(BaseControl, {
                label: __('Outer ring override (optional)', 'headless-core'),
                help: __('If set, overrides Arrow bg for the ring path.', 'headless-core'),
              }),
              el(ColorPalette, {
                value: String(
                  a.topBarScrollIconOuterColor != null && a.topBarScrollIconOuterColor !== ''
                    ? a.topBarScrollIconOuterColor
                    : a.scrollArrowBg || a.scrollButtonOuter || '#ffffff'
                ),
                colors: palette.map(function (hex) {
                  return { color: hex, name: hex };
                }),
                onChange: function (c) {
                  props.setAttributes({ topBarScrollIconOuterColor: c || '' });
                },
              }),
              el(Button, {
                variant: 'link',
                isSmall: true,
                onClick: function () {
                  props.setAttributes({ topBarScrollIconOuterColor: '' });
                },
              }, __('Use arrow bg', 'headless-core'))
            ),
            colorField(props, a, __('Scroll — outer (legacy)', 'headless-core'), 'scrollButtonOuter', '#ffffff'),
            el(TextControl, {
              label: __('Scroll — inner hex (legacy)', 'headless-core'),
              value: a.scrollButtonInner || '',
              onChange: function (v) {
                props.setAttributes({ scrollButtonInner: v || '' });
              },
            })
          ),
          el(
            PanelBody,
            { title: __('Banner & overlay (gradient mode)', 'headless-core'), initialOpen: false },
            el('p', { style: { fontSize: '12px', marginTop: 0 } }, __('Same options as the Events block (orchid multiply + pattern). Shown when “Use gradient background” is on.', 'headless-core')),
            colorField(props, a, __('Orchid tint (overlay)', 'headless-core'), 'orchidTintColor', '#ff7bac'),
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
            { title: __('Pattern image', 'headless-core'), initialOpen: false },
            a.patternImageUrl
              ? el('img', { src: a.patternImageUrl, alt: '', style: { maxHeight: '80px', marginBottom: '8px', display: 'block' } })
              : null,
            el('div', { style: { display: 'flex', gap: '8px', flexWrap: 'wrap' } },
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
            )
          ),
          el(
            PanelBody,
            { title: __('Header & secondary row', 'headless-core'), initialOpen: false },
            colorField(props, a, __('Badge background', 'headless-core'), 'badgeBgColor', '#EE6E2A'),
            colorField(props, a, __('Badge text', 'headless-core'), 'badgeTextColor', '#ffffff'),
            colorField(props, a, __('Subtitle', 'headless-core'), 'subtitleColor', '#22ACB6'),
            el(ToggleControl, {
              label: __('Show “All reviews” row', 'headless-core'),
              checked: !!a.showAllReviewsRow,
              onChange: function (v) {
                props.setAttributes({ showAllReviewsRow: v });
              },
            }),
            el(TextControl, {
              label: __('All reviews link URL (optional)', 'headless-core'),
              value: a.allReviewsUrl || '',
              onChange: function (v) {
                props.setAttributes({ allReviewsUrl: v || '' });
              },
            }),
            colorField(props, a, __('Secondary border', 'headless-core'), 'secondaryButtonBorderColor', '#d1d5db'),
            colorField(props, a, __('Secondary text', 'headless-core'), 'secondaryButtonTextColor', '#22ACB6')
          ),
          el(
            PanelBody,
            { title: __('Review cards', 'headless-core'), initialOpen: false },
            colorField(props, a, __('Quote text', 'headless-core'), 'quoteTextColor', '#6b7280'),
            colorField(props, a, __('Name line', 'headless-core'), 'nameColor', '#22ACB6'),
            colorField(props, a, __('Card background', 'headless-core'), 'cardBgColor', '#ffffff'),
            colorField(props, a, __('Star filled', 'headless-core'), 'starFilledColor', '#EAB308'),
            colorField(props, a, __('Star empty', 'headless-core'), 'starEmptyColor', '#D1D5DB')
          ),
          el(
            PanelBody,
            { title: __('Carousel', 'headless-core'), initialOpen: false },
            colorField(props, a, __('Arrow background', 'headless-core'), 'carouselArrowBg', '#22ACB6'),
            colorField(props, a, __('Arrow icon', 'headless-core'), 'carouselArrowIconColor', '#ffffff'),
            colorField(props, a, __('Dot — active', 'headless-core'), 'dotActiveColor', '#EE6E2A'),
            colorField(props, a, __('Dot — inactive', 'headless-core'), 'dotInactiveColor', '#d1d5db'),
            el(RangeControl, {
              label: __('Max reviews (0 = all)', 'headless-core'),
              value: a.maxItems != null ? a.maxItems : 0,
              onChange: function (v) {
                props.setAttributes({ maxItems: v });
              },
              min: 0,
              max: 40,
            }),
            el(RangeControl, {
              label: __('Slides to scroll', 'headless-core'),
              value: a.slidesToScroll != null ? a.slidesToScroll : 1,
              onChange: function (v) {
                props.setAttributes({ slidesToScroll: Math.max(1, v) });
              },
              min: 1,
              max: 6,
            }),
            el(RangeControl, {
              label: __('Visible — mobile', 'headless-core'),
              value: a.visibleMobile != null ? a.visibleMobile : 1,
              onChange: function (v) {
                props.setAttributes({ visibleMobile: Math.max(1, v) });
              },
              min: 1,
              max: 4,
            }),
            el(RangeControl, {
              label: __('Visible — tablet', 'headless-core'),
              value: a.visibleTablet != null ? a.visibleTablet : 2,
              onChange: function (v) {
                props.setAttributes({ visibleTablet: Math.max(1, v) });
              },
              min: 1,
              max: 4,
            }),
            el(RangeControl, {
              label: __('Visible — desktop', 'headless-core'),
              value: a.visibleDesktop != null ? a.visibleDesktop : 3,
              onChange: function (v) {
                props.setAttributes({ visibleDesktop: Math.max(1, v) });
              },
              min: 1,
              max: 4,
            }),
            el(ToggleControl, {
              label: __('Loop carousel', 'headless-core'),
              checked: !!a.carouselLoop,
              onChange: function (v) {
                props.setAttributes({ carouselLoop: v });
              },
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
                padding: '16px',
                background: '#fafafa',
              },
            },
            el('p', { style: { marginTop: 0, fontWeight: 600 } }, __('Member reviews', 'headless-core')),
            el(RichText, {
              tagName: 'div',
              label: __('Badge label', 'headless-core'),
              value: a.badgeLabelHtml || '',
              onChange: function (v) {
                props.setAttributes({ badgeLabelHtml: v });
              },
              placeholder: __('MEMBER REVIEWS', 'headless-core'),
              style: {
                display: 'inline-block',
                padding: '6px 16px',
                borderRadius: '9999px',
                background: a.badgeBgColor || '#EE6E2A',
                color: a.badgeTextColor || '#fff',
                fontSize: '12px',
                marginBottom: '8px',
              },
            }),
            el(RichText, {
              tagName: 'p',
              label: __('Subtitle', 'headless-core'),
              value: a.subtitleHtml || '',
              onChange: function (v) {
                props.setAttributes({ subtitleHtml: v });
              },
              placeholder: __('WHAT OUR MEMBERS SAY!', 'headless-core'),
              style: {
                color: a.subtitleColor || '#22ACB6',
                fontSize: '13px',
                textTransform: 'uppercase',
                margin: '0 0 16px',
              },
            }),
            el(TextControl, {
              label: __('“All reviews” label', 'headless-core'),
              value: a.allReviewsLabel || '',
              onChange: function (v) {
                props.setAttributes({ allReviewsLabel: v || '' });
              },
            }),
            reviews.map(function (r, i) {
              return el(
                'div',
                {
                  key: i,
                  style: {
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    padding: '12px',
                    marginBottom: '10px',
                    background: '#fff',
                  },
                },
                el('p', { style: { margin: '0 0 8px', fontWeight: 600 } }, __('Review', 'headless-core') + ' ' + (i + 1)),
                el(TextareaControl, {
                  label: __('Quote', 'headless-core'),
                  value: r.quote || '',
                  onChange: function (v) {
                    props.setAttributes({ reviews: updateReview(reviews, i, { quote: v || '' }) });
                  },
                  rows: 3,
                }),
                el(RangeControl, {
                  label: __('Stars (0–5)', 'headless-core'),
                  value: r.rating != null ? Number(r.rating) : 0,
                  onChange: function (v) {
                    props.setAttributes({ reviews: updateReview(reviews, i, { rating: v }) });
                  },
                  min: 0,
                  max: 5,
                  step: 0.5,
                }),
                el(TextControl, {
                  label: __('Name', 'headless-core'),
                  value: r.name || '',
                  onChange: function (v) {
                    props.setAttributes({ reviews: updateReview(reviews, i, { name: v || '' }) });
                  },
                }),
                el(TextControl, {
                  label: __('Title / role', 'headless-core'),
                  value: r.title || '',
                  onChange: function (v) {
                    props.setAttributes({ reviews: updateReview(reviews, i, { title: v || '' }) });
                  },
                }),
                el(Button, {
                  variant: 'tertiary',
                  isDestructive: true,
                  onClick: function () {
                    var next = reviews.slice();
                    next.splice(i, 1);
                    props.setAttributes({ reviews: next });
                  },
                }, __('Remove', 'headless-core'))
              );
            }),
            el(Button, {
              variant: 'primary',
              onClick: function () {
                props.setAttributes({
                  reviews: reviews.concat([
                    { quote: '', rating: 5, name: '', title: '' },
                  ]),
                });
              },
            }, __('Add review', 'headless-core'))
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
