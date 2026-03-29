(function (blocks, blockEditor, components, data, element, i18n) {
  var el = element.createElement;
  var registerBlockType = blocks.registerBlockType;
  var useBlockProps = blockEditor.useBlockProps;
  var InspectorControls = blockEditor.InspectorControls;
  var PanelBody = components.PanelBody;
  var SelectControl = components.SelectControl;
  var TextControl = components.TextControl;
  var RangeControl = components.RangeControl;
  var BaseControl = components.BaseControl;
  var ColorPalette = components.ColorPalette;
  var RichText = blockEditor.RichText;
  var useSelect = data.useSelect;
  var __ = i18n.__;

  registerBlockType('custom/events-carousel', {
    apiVersion: 3,
    title: __('Events Carousel', 'headless-core'),
    icon: 'calendar-alt',
    category: 'widgets',
    description: __('Carousel of Events CPT cards with date, author, and read more.', 'headless-core'),
    attributes: {
      categoryId: { type: 'number', default: 0 },
      sectionHeader: {
        type: 'string',
        default: 'CELEBRATE, EXPLORE AND SHARE OUR INCREDIBLE JOURNEYS OF PROSPERITY.',
      },
      buttonText: { type: 'string', default: 'LATEST EVENTS' },
      linkText: { type: 'string', default: 'ALL EVENTS' },
      linkUrl: { type: 'string', default: '/events' },
      readMoreLabel: { type: 'string', default: 'READ MORE' },
      maxItems: { type: 'number', default: 9 },
      autoplayDelayMs: { type: 'number', default: 3500 },
      sectionBgColor: { type: 'string', default: '#F5F4EE' },
      topBarColor: { type: 'string', default: '#ffffff' },
      headerTextColor: { type: 'string', default: '#22ACB6' },
      buttonBgColor: { type: 'string', default: '#EE6E2A' },
      buttonTextColor: { type: 'string', default: '#ffffff' },
      linkTextColor: { type: 'string', default: '#22ACB6' },
      linkTextHoverColor: { type: 'string', default: '#EE6E2A' },
      linkBadgeBgColor: { type: 'string', default: '#ffffff' },
      linkBadgeHoverBgColor: { type: 'string', default: '#ffffff' },
      linkArrowBgColor: { type: 'string', default: '#ffffff' },
      linkArrowHoverBgColor: { type: 'string', default: '#EE6E2A' },
      linkArrowColor: { type: 'string', default: '#22ACB6' },
      linkArrowHoverColor: { type: 'string', default: '#ffffff' },
      arrowButtonBgColor: { type: 'string', default: '#00AFBB' },
      arrowButtonIconColor: { type: 'string', default: '#ffffff' },
      metaTextColor: { type: 'string', default: '#808080' },
      cardTitleColor: { type: 'string', default: '#808080' },
      cardTitleHoverColor: { type: 'string', default: '#22ACB6' },
      readMoreTextColor: { type: 'string', default: '#ee6e2a' },
      readMoreHoverColor: { type: 'string', default: '#22aab7' },
      readMoreArrowBg: { type: 'string', default: '#ee6e2a' },
      readMoreArrowHoverBg: { type: 'string', default: '#22aab7' },
      carouselNavArrowColor: { type: 'string', default: '#82cdcb' },
      dotActiveColor: { type: 'string', default: '#EE6E2A' },
      dotInactiveColor: { type: 'string', default: 'rgba(255,255,255,0.6)' },
    },
    edit: function (props) {
      var blockProps = useBlockProps({ className: 'headless-events-carousel-block' });
      var selectedId = Number(props.attributes.categoryId || 0);
      var clipId = 'clip-events-carousel-editor-' + String(props.clientId || '0').replace(/[^a-z0-9-]/gi, '');
      var categories = useSelect(function (select) {
        var store = select('core');
        if (!store || !store.getEntityRecords) return [];
        var records = store.getEntityRecords('taxonomy', 'category', { per_page: 100, hide_empty: false });
        return Array.isArray(records) ? records : [];
      }, []);
      var options = [{ label: __('All categories', 'headless-core'), value: 0 }].concat(
        categories.map(function (cat) {
          return { label: cat.name, value: cat.id };
        })
      );
      var colors = ['#22ACB6', '#EE6E2A', '#ffffff', '#000000', '#F5F4EE', '#3b4e6b', '#e8e8e8', '#82cdcb', '#00AFBB', '#808080'];
      function palette() {
        return colors.map(function (hex) {
          return { color: hex, name: hex };
        });
      }

      return el(
        'div',
        blockProps,
        el(
          InspectorControls,
          null,
          el(
            PanelBody,
            { title: __('Query + Links', 'headless-core'), initialOpen: true },
            el(TextControl, {
              label: __('“All events” link URL', 'headless-core'),
              value: props.attributes.linkUrl || '',
              onChange: function (v) {
                props.setAttributes({ linkUrl: v });
              },
            }),
            el(TextControl, {
              label: __('Read more label', 'headless-core'),
              value: props.attributes.readMoreLabel || '',
              onChange: function (v) {
                props.setAttributes({ readMoreLabel: v });
              },
            }),
            el(RangeControl, {
              label: __('Maximum items', 'headless-core'),
              value: Number(props.attributes.maxItems || 9),
              onChange: function (v) {
                props.setAttributes({ maxItems: Number(v || 9) });
              },
              min: 3,
              max: 24,
            }),
            el(TextControl, {
              label: __('Autoplay delay (ms)', 'headless-core'),
              type: 'number',
              value: Number(props.attributes.autoplayDelayMs || 3500),
              min: 800,
              step: 100,
              onChange: function (v) {
                var parsed = parseInt(v, 10);
                props.setAttributes({ autoplayDelayMs: Number.isFinite(parsed) ? Math.max(800, parsed) : 3500 });
              },
              help: __('Autoplay pauses on hover.', 'headless-core'),
            }),
            el(SelectControl, {
              label: __('Category', 'headless-core'),
              value: selectedId,
              options: options,
              onChange: function (next) {
                props.setAttributes({ categoryId: parseInt(next, 10) || 0 });
              },
            })
          ),
          el(
            PanelBody,
            { title: __('Section + header', 'headless-core'), initialOpen: false },
            el(BaseControl, { label: __('Section background', 'headless-core') }),
            el(ColorPalette, {
              value: props.attributes.sectionBgColor,
              colors: palette(),
              onChange: function (c) {
                props.setAttributes({ sectionBgColor: c || '#F5F4EE' });
              },
            }),
            el(BaseControl, { label: __('Top bar background', 'headless-core') }),
            el(ColorPalette, {
              value: props.attributes.topBarColor || '#ffffff',
              colors: palette(),
              onChange: function (c) {
                props.setAttributes({ topBarColor: c && String(c).trim() !== '' ? c : '#ffffff' });
              },
            }),
            el(BaseControl, { label: __('Header text', 'headless-core') }),
            el(ColorPalette, {
              value: props.attributes.headerTextColor,
              colors: palette(),
              onChange: function (c) {
                props.setAttributes({ headerTextColor: c || '#22ACB6' });
              },
            }),
            el(BaseControl, { label: __('Center pill background', 'headless-core') }),
            el(ColorPalette, {
              value: props.attributes.buttonBgColor,
              colors: palette(),
              onChange: function (c) {
                props.setAttributes({ buttonBgColor: c || '#EE6E2A' });
              },
            }),
            el(BaseControl, { label: __('Center pill text', 'headless-core') }),
            el(ColorPalette, {
              value: props.attributes.buttonTextColor,
              colors: palette(),
              onChange: function (c) {
                props.setAttributes({ buttonTextColor: c || '#ffffff' });
              },
            }),
            el(BaseControl, { label: __('“All events” link text', 'headless-core') }),
            el(ColorPalette, {
              value: props.attributes.linkTextColor,
              colors: palette(),
              onChange: function (c) {
                props.setAttributes({ linkTextColor: c || '#22ACB6' });
              },
            }),
            el(BaseControl, { label: __('“All events” link text hover', 'headless-core') }),
            el(ColorPalette, {
              value: props.attributes.linkTextHoverColor,
              colors: palette(),
              onChange: function (c) {
                props.setAttributes({ linkTextHoverColor: c || '#EE6E2A' });
              },
            }),
            el(BaseControl, { label: __('Link badge background', 'headless-core') }),
            el(ColorPalette, {
              value: props.attributes.linkBadgeBgColor,
              colors: palette(),
              onChange: function (c) {
                props.setAttributes({ linkBadgeBgColor: c || '#ffffff' });
              },
            }),
            el(BaseControl, { label: __('Link badge hover background', 'headless-core') }),
            el(ColorPalette, {
              value: props.attributes.linkBadgeHoverBgColor,
              colors: palette(),
              onChange: function (c) {
                props.setAttributes({ linkBadgeHoverBgColor: c || '#ffffff' });
              },
            }),
            el(BaseControl, { label: __('Link arrow background', 'headless-core') }),
            el(ColorPalette, {
              value: props.attributes.linkArrowBgColor,
              colors: palette(),
              onChange: function (c) {
                props.setAttributes({ linkArrowBgColor: c || '#ffffff' });
              },
            }),
            el(BaseControl, { label: __('Link arrow hover background', 'headless-core') }),
            el(ColorPalette, {
              value: props.attributes.linkArrowHoverBgColor,
              colors: palette(),
              onChange: function (c) {
                props.setAttributes({ linkArrowHoverBgColor: c || '#EE6E2A' });
              },
            }),
            el(BaseControl, { label: __('Link arrow icon', 'headless-core') }),
            el(ColorPalette, {
              value: props.attributes.linkArrowColor,
              colors: palette(),
              onChange: function (c) {
                props.setAttributes({ linkArrowColor: c || '#22ACB6' });
              },
            }),
            el(BaseControl, { label: __('Link arrow icon hover', 'headless-core') }),
            el(ColorPalette, {
              value: props.attributes.linkArrowHoverColor,
              colors: palette(),
              onChange: function (c) {
                props.setAttributes({ linkArrowHoverColor: c || '#ffffff' });
              },
            }),
            el(BaseControl, { label: __('Scroll down button bg', 'headless-core') }),
            el(ColorPalette, {
              value: props.attributes.arrowButtonBgColor,
              colors: palette(),
              onChange: function (c) {
                props.setAttributes({ arrowButtonBgColor: c || '#00AFBB' });
              },
            }),
            el(BaseControl, { label: __('Scroll down button icon', 'headless-core') }),
            el(ColorPalette, {
              value: props.attributes.arrowButtonIconColor,
              colors: palette(),
              onChange: function (c) {
                props.setAttributes({ arrowButtonIconColor: c || '#ffffff' });
              },
            })
          ),
          el(
            PanelBody,
            { title: __('Event cards + carousel', 'headless-core'), initialOpen: false },
            el(BaseControl, { label: __('Date & author text', 'headless-core') }),
            el(ColorPalette, {
              value: props.attributes.metaTextColor,
              colors: palette(),
              onChange: function (c) {
                props.setAttributes({ metaTextColor: c || '#808080' });
              },
            }),
            el(BaseControl, { label: __('Card title', 'headless-core') }),
            el(ColorPalette, {
              value: props.attributes.cardTitleColor,
              colors: palette(),
              onChange: function (c) {
                props.setAttributes({ cardTitleColor: c || '#808080' });
              },
            }),
            el(BaseControl, { label: __('Card title hover', 'headless-core') }),
            el(ColorPalette, {
              value: props.attributes.cardTitleHoverColor,
              colors: palette(),
              onChange: function (c) {
                props.setAttributes({ cardTitleHoverColor: c || '#22ACB6' });
              },
            }),
            el(BaseControl, { label: __('Read more text', 'headless-core') }),
            el(ColorPalette, {
              value: props.attributes.readMoreTextColor,
              colors: palette(),
              onChange: function (c) {
                props.setAttributes({ readMoreTextColor: c || '#ee6e2a' });
              },
            }),
            el(BaseControl, { label: __('Read more text hover', 'headless-core') }),
            el(ColorPalette, {
              value: props.attributes.readMoreHoverColor,
              colors: palette(),
              onChange: function (c) {
                props.setAttributes({ readMoreHoverColor: c || '#22aab7' });
              },
            }),
            el(BaseControl, { label: __('Read more arrow circle', 'headless-core') }),
            el(ColorPalette, {
              value: props.attributes.readMoreArrowBg,
              colors: palette(),
              onChange: function (c) {
                props.setAttributes({ readMoreArrowBg: c || '#ee6e2a' });
              },
            }),
            el(BaseControl, { label: __('Read more arrow circle hover', 'headless-core') }),
            el(ColorPalette, {
              value: props.attributes.readMoreArrowHoverBg,
              colors: palette(),
              onChange: function (c) {
                props.setAttributes({ readMoreArrowHoverBg: c || '#22aab7' });
              },
            }),
            el(BaseControl, { label: __('Side navigation arrows', 'headless-core') }),
            el(ColorPalette, {
              value: props.attributes.carouselNavArrowColor,
              colors: palette(),
              onChange: function (c) {
                props.setAttributes({ carouselNavArrowColor: c || '#82cdcb' });
              },
            }),
            el(BaseControl, { label: __('Mobile dot active', 'headless-core') }),
            el(ColorPalette, {
              value: props.attributes.dotActiveColor,
              colors: palette(),
              onChange: function (c) {
                props.setAttributes({ dotActiveColor: c || '#EE6E2A' });
              },
            }),
            el(BaseControl, { label: __('Mobile dot inactive', 'headless-core') }),
            el(ColorPalette, {
              value: props.attributes.dotInactiveColor,
              colors: palette(),
              onChange: function (c) {
                props.setAttributes({ dotInactiveColor: c || 'rgba(255,255,255,0.6)' });
              },
            })
          )
        ),
        el(
          'div',
          {
            style: {
              marginLeft: '-14px',
              marginRight: '-14px',
              marginTop: '-8px',
              position: 'relative',
              overflow: 'hidden',
              backgroundColor: props.attributes.topBarColor || '#ffffff',
              minHeight: '37px',
            },
          },
          el(
            'svg',
            {
              viewBox: '0 0 1088.78 38.01',
              xmlns: 'http://www.w3.org/2000/svg',
              style: { display: 'block', minWidth: '100%', width: '100%', height: 'auto', maxHeight: '38px' },
              preserveAspectRatio: 'none',
            },
            el('defs', null, el('clipPath', { id: clipId }, el('rect', { x: '484.39', y: '0', width: '120', height: '38.01' }))),
            el(
              'g',
              { clipPath: 'url(#' + clipId + ')' },
              el('rect', { x: '422.93', width: '240.31', height: '38.01', style: { fill: props.attributes.sectionBgColor || '#F5F4EE' } }),
              el('path', {
                d: 'M1088.78,38.01h-485.18c-9.52-.55-19.25-5.16-24.51-12.52-1.19-1.67-1.76-3.43-2.78-5.14-13.44-22.42-47.98-22.41-61.41,0-1.02,1.71-1.59,3.47-2.78,5.14-5.25,7.34-15.01,11.97-24.51,12.52H0V0h1088.78v38.01Z',
                style: { fill: props.attributes.topBarColor || '#ffffff' },
              })
            )
          )
        ),
        el(
          'div',
          {
            style: {
              padding: '1rem',
              border: '1px dashed #ccc',
              borderRadius: '8px',
              background: props.attributes.sectionBgColor || '#F5F4EE',
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0,
            },
          },
          el(
            'div',
            { style: { textAlign: 'center', marginTop: '-28px', marginBottom: '12px' } },
            el(
              'div',
              {
                style: {
                  margin: '0 auto',
                  width: '56px',
                  height: '56px',
                  borderRadius: '999px',
                  background: props.attributes.arrowButtonBgColor || '#00AFBB',
                  color: props.attributes.arrowButtonIconColor || '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                },
              },
              '↓'
            )
          ),
          el(RichText, {
            tagName: 'p',
            value: props.attributes.sectionHeader || '',
            onChange: function (v) {
              props.setAttributes({ sectionHeader: v });
            },
            placeholder: __('Section header…', 'headless-core'),
            allowedFormats: [],
            style: { color: props.attributes.headerTextColor || '#22ACB6', fontSize: '12px', textAlign: 'center', marginBottom: '8px' },
          }),
          el(
            'div',
            { style: { display: 'flex', justifyContent: 'center', gap: '8px', alignItems: 'center', flexWrap: 'wrap' } },
            el(RichText, {
              tagName: 'span',
              value: props.attributes.buttonText || '',
              onChange: function (v) {
                props.setAttributes({ buttonText: v });
              },
              placeholder: __('Latest events pill…', 'headless-core'),
              allowedFormats: [],
              style: {
                display: 'inline-block',
                padding: '6px 16px',
                borderRadius: '999px',
                background: props.attributes.buttonBgColor || '#EE6E2A',
                color: props.attributes.buttonTextColor || '#ffffff',
                fontSize: '12px',
                fontWeight: 700,
              },
            }),
            el(RichText, {
              tagName: 'span',
              value: props.attributes.linkText || '',
              onChange: function (v) {
                props.setAttributes({ linkText: v });
              },
              placeholder: __('All events…', 'headless-core'),
              allowedFormats: [],
              style: {
                display: 'inline-block',
                padding: '6px 16px',
                borderRadius: '999px',
                background: props.attributes.linkBadgeBgColor || '#ffffff',
                color: props.attributes.linkTextColor || '#22ACB6',
                border: '1px solid #e8e8e8',
                fontSize: '12px',
              },
            })
          ),
          el('p', { style: { marginTop: '8px', marginBottom: 0, color: '#555', textAlign: 'center' } },
            __('Events load from the Events post type on the frontend.', 'headless-core')
          )
        )
      );
    },
    save: function () {
      return null;
    },
  });
})(window.wp.blocks, window.wp.blockEditor, window.wp.components, window.wp.data, window.wp.element, window.wp.i18n);
