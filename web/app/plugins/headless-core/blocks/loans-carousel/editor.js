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
  var headlessLink = window.headlessCoreEditor || {};

  registerBlockType('custom/loans-carousel', {
    apiVersion: 3,
    title: __('Loans Carousel', 'headless-core'),
    icon: 'images-alt2',
    category: 'widgets',
    description: __('Carousel of Loan Products CPT cards.', 'headless-core'),
    attributes: {
      categoryId: { type: 'number', default: 0 },
      sectionHeader: { type: 'string', default: 'ACHIEVE YOUR GOALS WITH OUR FLEXIBLE LENDING OPTIONS' },
      buttonText: { type: 'string', default: 'LOANS' },
      linkText: { type: 'string', default: 'ALL LOAN PRODUCTS' },
      linkUrl: { type: 'string', default: '/loan-products' },
      maxItems: { type: 'number', default: 9 },
      autoplayDelayMs: { type: 'number', default: 3500 },
      sectionBgColor: { type: 'string', default: '#F5F4EE' },
      topBarColor: { type: 'string', default: '#ffffff' },
      topBarGradientAngle: { type: 'number', default: 90 },
      topBarGradientFrom: { type: 'string', default: '#ffffff' },
      topBarGradientVia: { type: 'string', default: '#ffffff' },
      topBarGradientTo: { type: 'string', default: '#ffffff' },
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
    },
    edit: function (props) {
      var blockProps = useBlockProps({ className: 'headless-loans-carousel-block' });
      var selectedId = Number(props.attributes.categoryId || 0);
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
      var colors = ['#22ACB6', '#EE6E2A', '#ffffff', '#000000', '#F5F4EE', '#3b4e6b', '#e8e8e8', '#82cdcb', '#00AFBB', '#00B2E0', '#00AB81'];
      function palette() {
        return colors.map(function (hex) { return { color: hex, name: hex }; });
      }

      function renderRightLinkField() {
        return el(
          'div',
          {
            className: 'headless-carousel-link-field',
            onClick: function (e) {
              e.stopPropagation();
            },
          },
          headlessLink.renderLinkControlAttribute
            ? headlessLink.renderLinkControlAttribute(
                el,
                blockEditor,
                components,
                i18n,
                __('Page/Post Link', 'headless-core'),
                props.attributes,
                'linkUrl',
                props.setAttributes
              )
            : el(TextControl, {
                label: __('Page/Post Link', 'headless-core'),
                value: props.attributes.linkUrl || '',
                onChange: function (v) { props.setAttributes({ linkUrl: v }); },
              })
        );
      }

      return el(
        'div',
        blockProps,
        el(
          InspectorControls,
          null,
          el(
            PanelBody,
            { title: __('Carousel settings', 'headless-core'), initialOpen: true },
            el(RangeControl, {
              label: __('Maximum items', 'headless-core'),
              value: Number(props.attributes.maxItems || 9),
              onChange: function (v) { props.setAttributes({ maxItems: Number(v || 9) }); },
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
              help: __('Autoplay pauses on hover. Example: 3500', 'headless-core'),
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
            { title: __('Colors', 'headless-core'), initialOpen: false },
            el(BaseControl, { label: __('Section background', 'headless-core') }),
            el(ColorPalette, { value: props.attributes.sectionBgColor, colors: palette(), onChange: function (c) { props.setAttributes({ sectionBgColor: c || '#F5F4EE' }); } }),
            el('hr', { style: { margin: '12px 0' } }),
            el('p', { style: { fontWeight: 700, marginBottom: '6px' } }, __('Top bar gradient', 'headless-core')),
            el(RangeControl, {
              label: __('Top bar gradient angle (deg)', 'headless-core'),
              value: Number(props.attributes.topBarGradientAngle || 90),
              onChange: function (v) { props.setAttributes({ topBarGradientAngle: Number(v) || 90 }); },
              min: 0,
              max: 360,
            }),
            el(BaseControl, { label: __('Top bar gradient start', 'headless-core') }),
            el(ColorPalette, {
              value: props.attributes.topBarGradientFrom || '#ffffff',
              colors: palette(),
              disableCustomColors: false,
              onChange: function (c) {
                props.setAttributes({ topBarGradientFrom: c && String(c).trim() !== '' ? c : '#ffffff' });
              },
            }),
            el(BaseControl, { label: __('Top bar gradient middle', 'headless-core') }),
            el(ColorPalette, { value: props.attributes.topBarGradientVia || '#ffffff', colors: palette(), onChange: function (c) { props.setAttributes({ topBarGradientVia: c && String(c).trim() !== '' ? c : '#ffffff' }); } }),
            el(BaseControl, { label: __('Top bar gradient end', 'headless-core') }),
            el(ColorPalette, { value: props.attributes.topBarGradientTo || '#ffffff', colors: palette(), onChange: function (c) { props.setAttributes({ topBarGradientTo: c && String(c).trim() !== '' ? c : '#ffffff' }); } }),

            el('hr', { style: { margin: '12px 0' } }),
            el(BaseControl, { label: __('Top bar fallback solid color', 'headless-core') }),
            el(ColorPalette, {
              value: props.attributes.topBarColor || '#ffffff',
              colors: palette(),
              disableCustomColors: false,
              onChange: function (c) {
                props.setAttributes({ topBarColor: c && String(c).trim() !== '' ? c : '#ffffff' });
              },
            }),
            el(BaseControl, { label: __('Header text', 'headless-core') }),
            el(ColorPalette, { value: props.attributes.headerTextColor, colors: palette(), onChange: function (c) { props.setAttributes({ headerTextColor: c || '#22ACB6' }); } }),
            el(BaseControl, { label: __('Center button bg', 'headless-core') }),
            el(ColorPalette, { value: props.attributes.buttonBgColor, colors: palette(), onChange: function (c) { props.setAttributes({ buttonBgColor: c || '#EE6E2A' }); } }),
            el(BaseControl, { label: __('Center button text', 'headless-core') }),
            el(ColorPalette, { value: props.attributes.buttonTextColor, colors: palette(), onChange: function (c) { props.setAttributes({ buttonTextColor: c || '#ffffff' }); } }),
            el(BaseControl, { label: __('Link text', 'headless-core') }),
            el(ColorPalette, { value: props.attributes.linkTextColor, colors: palette(), onChange: function (c) { props.setAttributes({ linkTextColor: c || '#22ACB6' }); } }),
            el(BaseControl, { label: __('Link text hover', 'headless-core') }),
            el(ColorPalette, { value: props.attributes.linkTextHoverColor, colors: palette(), onChange: function (c) { props.setAttributes({ linkTextHoverColor: c || '#EE6E2A' }); } }),
            el(BaseControl, { label: __('Link badge bg', 'headless-core') }),
            el(ColorPalette, { value: props.attributes.linkBadgeBgColor, colors: palette(), onChange: function (c) { props.setAttributes({ linkBadgeBgColor: c || '#ffffff' }); } }),
            el(BaseControl, { label: __('Link badge hover bg', 'headless-core') }),
            el(ColorPalette, { value: props.attributes.linkBadgeHoverBgColor, colors: palette(), onChange: function (c) { props.setAttributes({ linkBadgeHoverBgColor: c || '#ffffff' }); } }),
            el(BaseControl, { label: __('Link arrow bg', 'headless-core') }),
            el(ColorPalette, { value: props.attributes.linkArrowBgColor, colors: palette(), onChange: function (c) { props.setAttributes({ linkArrowBgColor: c || '#ffffff' }); } }),
            el(BaseControl, { label: __('Link arrow hover bg', 'headless-core') }),
            el(ColorPalette, { value: props.attributes.linkArrowHoverBgColor, colors: palette(), onChange: function (c) { props.setAttributes({ linkArrowHoverBgColor: c || '#EE6E2A' }); } }),
            el(BaseControl, { label: __('Link arrow icon', 'headless-core') }),
            el(ColorPalette, { value: props.attributes.linkArrowColor, colors: palette(), onChange: function (c) { props.setAttributes({ linkArrowColor: c || '#22ACB6' }); } }),
            el(BaseControl, { label: __('Link arrow icon hover', 'headless-core') }),
            el(ColorPalette, { value: props.attributes.linkArrowHoverColor, colors: palette(), onChange: function (c) { props.setAttributes({ linkArrowHoverColor: c || '#ffffff' }); } }),
            el(BaseControl, { label: __('Top down-arrow bg', 'headless-core') }),
            el(ColorPalette, { value: props.attributes.arrowButtonBgColor, colors: palette(), onChange: function (c) { props.setAttributes({ arrowButtonBgColor: c || '#00AFBB' }); } }),
            el(BaseControl, { label: __('Top down-arrow icon', 'headless-core') }),
            el(ColorPalette, { value: props.attributes.arrowButtonIconColor, colors: palette(), onChange: function (c) { props.setAttributes({ arrowButtonIconColor: c || '#ffffff' }); } })
          )
        ),
        el(
          'div',
          { style: { padding: '1rem', border: '1px dashed #ccc', borderRadius: '8px', background: props.attributes.sectionBgColor || '#F5F4EE' } },
          el(RichText, {
            tagName: 'p',
            value: props.attributes.sectionHeader || '',
            onChange: function (v) { props.setAttributes({ sectionHeader: v }); },
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
              onChange: function (v) { props.setAttributes({ buttonText: v }); },
              placeholder: __('Button text…', 'headless-core'),
              allowedFormats: [],
              style: { display: 'inline-block', padding: '6px 16px', borderRadius: '999px', background: props.attributes.buttonBgColor || '#EE6E2A', color: props.attributes.buttonTextColor || '#ffffff', fontSize: '12px', fontWeight: 700 },
            }),
            el(RichText, {
              tagName: 'span',
              value: props.attributes.linkText || '',
              onChange: function (v) { props.setAttributes({ linkText: v }); },
              placeholder: __('Link text…', 'headless-core'),
              allowedFormats: [],
              style: { display: 'inline-block', padding: '6px 16px', borderRadius: '999px', background: props.attributes.linkBadgeBgColor || '#ffffff', color: props.attributes.linkTextColor || '#22ACB6', border: '1px solid #e8e8e8', fontSize: '12px' },
            })
          ),
          renderRightLinkField(),
          el('p', { style: { marginTop: '10px', marginBottom: 0, color: '#555', textAlign: 'center', fontSize: '12px' } },
            __('Your loan products will show here as a scrolling carousel on the live site.', 'headless-core')
          )
        )
      );
    },
    save: function () { return null; },
  });
})(window.wp.blocks, window.wp.blockEditor, window.wp.components, window.wp.data, window.wp.element, window.wp.i18n);

