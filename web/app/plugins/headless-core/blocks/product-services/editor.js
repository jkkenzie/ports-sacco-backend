(function (blocks, blockEditor, components, element, i18n) {
  var el = element.createElement;
  var registerBlockType = blocks.registerBlockType;
  var useBlockProps = blockEditor.useBlockProps;
  var InspectorControls = blockEditor.InspectorControls;
  var PanelBody = components.PanelBody;
  var Button = components.Button;
  var TextControl = components.TextControl;
  var TextareaControl = components.TextareaControl;
  var BaseControl = components.BaseControl;
  var ColorPalette = components.ColorPalette;
  var RangeControl = components.RangeControl;
  var __ = i18n.__;

  function normalizeDropdown(items) {
    if (!Array.isArray(items) || items.length === 0) return [];
    return items.map(function (x) {
      return { label: String((x && x.label) || ''), url: String((x && x.url) || '') };
    });
  }

  function normalizePills(items) {
    if (!Array.isArray(items) || items.length === 0) return [];
    return items.map(function (x) {
      return { label: String((x && x.label) || ''), url: String((x && x.url) || '') };
    });
  }

  var defaultDropdown = [
    { label: 'Savings & Investments', url: '/savings-products' },
    { label: 'Loan Products', url: '/loan-products' },
    { label: 'Financial Services', url: '/services' },
  ];

  var defaultPills = [
    { label: 'LOAN PRODUCTS', url: '/loan-products' },
    { label: 'SAVINGS PRODUCTS', url: '/savings-products' },
    { label: 'INVESTMENT OPTIONS', url: '/savings-products' },
    { label: 'ASSET FINANCE', url: '/loan-products/asset-finance' },
    { label: 'LPG FINANCING', url: '/services' },
    { label: 'CHEQUE CLEARANCE', url: '/services' },
    { label: 'SALARY PROCESSING', url: '/services' },
    { label: 'TILL NUMBER FOR BUSINESS', url: '/services' },
    { label: 'MOBILE & INTERNET BANKING', url: '/services' },
    { label: 'SCHOOL FEES COLLECTION ACCOUNT', url: '/savings-products' },
    { label: 'STANDING ORDERS', url: '/services' },
    { label: 'INSURANCE', url: '/services' },
    { label: 'FINANCIAL ADVICE', url: '/services' },
    { label: 'VISA ATM', url: '/services' },
  ];

  registerBlockType('custom/product-services', {
    apiVersion: 3,
    title: __('Product & Services', 'headless-core'),
    icon: 'grid-view',
    category: 'widgets',
    description: __('Products & services section with search dropdown and pill links.', 'headless-core'),
    attributes: {
      sectionId: { type: 'string', default: 'services' },
      gradientAngle: { type: 'number', default: 90 },
      gradientFrom: { type: 'string', default: '#00B2E0' },
      gradientVia: { type: 'string', default: '#00AFBB' },
      gradientTo: { type: 'string', default: '#00AB81' },
      topBarBg: { type: 'string', default: '#F5F4EE' },
      topCurveRectFill: { type: 'string', default: '#00AFBB' },
      topCurvePathFill: { type: 'string', default: '#F5F4EE' },
      kickerText: { type: 'string', default: 'YOUR JOURNEY OF PROSPERITY START HERE!' },
      kickerColor: { type: 'string', default: '#ffffff' },
      centerPillText: { type: 'string', default: 'HOW CAN WE UPLIFT YOU TODAY?' },
      centerPillBg: { type: 'string', default: '#EE6E2A' },
      centerPillHoverBg: { type: 'string', default: '#d96525' },
      centerPillTextColor: { type: 'string', default: '#ffffff' },
      scrollArrowOuterFill: { type: 'string', default: '#ffffff' },
      scrollArrowInnerFill: { type: 'string', default: '#22ACB6' },
      boxBg: { type: 'string', default: '#ffffff' },
      boxTitle: { type: 'string', default: 'PRODUCTS & SERVICES THAT UPLIFT YOUR FINANCIAL SUCCESS!' },
      boxSubtitle: { type: 'string', default: 'SELECT THE PRODUCT OR SERVICE YOU NEED' },
      boxTitleColor: { type: 'string', default: '#3b4e6b' },
      boxSubtitleColor: { type: 'string', default: '#3b4e6b' },
      dropdownPlaceholder: { type: 'string', default: 'How can we uplift you today?' },
      dropdownItems: { type: 'array', default: [] },
      dropdownBg: { type: 'string', default: '#38f0ba' },
      dropdownBorderColor: { type: 'string', default: '#e8e8e8' },
      dropdownTextColor: { type: 'string', default: '#3b4e6b' },
      dropdownChevronColor: { type: 'string', default: '#3b4e6b' },
      goButtonBg: { type: 'string', default: '#38f0ba' },
      goButtonBorderColor: { type: 'string', default: '#e8e8e8' },
      goButtonIconColor: { type: 'string', default: '#3b4e6b' },
      goButtonHoverOpacity: { type: 'number', default: 0.85 },
      dividerColor: { type: 'string', default: '#e8e8e8' },
      productButtons: { type: 'array', default: [] },
      pillBg: { type: 'string', default: '#00ada0' },
      pillBorderColor: { type: 'string', default: '#e8e8e8' },
      pillTextColor: { type: 'string', default: '#ffffff' },
      pillHoverBg: { type: 'string', default: '#ee6e2a' },
      pillHoverBorderColor: { type: 'string', default: '#ee6e2a' },
      pillHoverTextColor: { type: 'string', default: '#ffffff' },
    },
    edit: function (props) {
      var blockProps = useBlockProps({ className: 'headless-product-services-block' });
      var a = props.attributes;
      var dropdownItems = normalizeDropdown(a.dropdownItems);
      if (!dropdownItems.length) dropdownItems = defaultDropdown.slice();
      var productButtons = normalizePills(a.productButtons);
      if (!productButtons.length) productButtons = defaultPills.slice();

      function setDropdown(i, patch) {
        var next = dropdownItems.map(function (row, idx) {
          return idx === i ? Object.assign({}, row, patch) : row;
        });
        props.setAttributes({ dropdownItems: next });
      }
      function addDropdown() {
        props.setAttributes({ dropdownItems: dropdownItems.concat([{ label: '', url: '/' }]) });
      }
      function removeDropdown(i) {
        props.setAttributes({ dropdownItems: dropdownItems.filter(function (_, idx) { return idx !== i; }) });
      }

      function setPill(i, patch) {
        var next = productButtons.map(function (row, idx) {
          return idx === i ? Object.assign({}, row, patch) : row;
        });
        props.setAttributes({ productButtons: next });
      }
      function addPill() {
        props.setAttributes({ productButtons: productButtons.concat([{ label: 'NEW LINK', url: '/' }]) });
      }
      function removePill(i) {
        if (!window.confirm(__('Remove this button?', 'headless-core'))) return;
        props.setAttributes({ productButtons: productButtons.filter(function (_, idx) { return idx !== i; }) });
      }

      var colors = ['#00B2E0', '#00AFBB', '#00AB81', '#00ada0', '#38f0ba', '#22ACB6', '#EE6E2A', '#ffffff', '#F5F4EE', '#3b4e6b', '#e8e8e8', '#ee6e2a'];
      function palette() {
        return colors.map(function (hex) {
          return { color: hex, name: hex };
        });
      }

      var grad = 'linear-gradient(' + (Number(a.gradientAngle) || 90) + 'deg, ' + (a.gradientFrom || '#00B2E0') + ', ' + (a.gradientVia || '#00AFBB') + ', ' + (a.gradientTo || '#00AB81') + ')';

      return el(
        'div',
        blockProps,
        el(
          InspectorControls,
          null,
          el(
            PanelBody,
            { title: __('Section & gradient', 'headless-core'), initialOpen: true },
            el(TextControl, {
              label: __('Section ID', 'headless-core'),
              value: a.sectionId || '',
              onChange: function (v) {
                props.setAttributes({ sectionId: v });
              },
            }),
            el(RangeControl, {
              label: __('Gradient angle (deg)', 'headless-core'),
              value: Number(a.gradientAngle || 90),
              onChange: function (v) {
                props.setAttributes({ gradientAngle: Number(v) || 90 });
              },
              min: 0,
              max: 360,
            }),
            el(BaseControl, { label: __('Gradient start', 'headless-core') }),
            el(ColorPalette, {
              value: a.gradientFrom,
              colors: palette(),
              onChange: function (c) {
                props.setAttributes({ gradientFrom: c || '#00B2E0' });
              },
            }),
            el(BaseControl, { label: __('Gradient middle', 'headless-core') }),
            el(ColorPalette, {
              value: a.gradientVia,
              colors: palette(),
              onChange: function (c) {
                props.setAttributes({ gradientVia: c || '#00AFBB' });
              },
            }),
            el(BaseControl, { label: __('Gradient end', 'headless-core') }),
            el(ColorPalette, {
              value: a.gradientTo,
              colors: palette(),
              onChange: function (c) {
                props.setAttributes({ gradientTo: c || '#00AB81' });
              },
            }),
            el(BaseControl, { label: __('Top bar (above curve)', 'headless-core') }),
            el(ColorPalette, {
              value: a.topBarBg,
              colors: palette(),
              onChange: function (c) {
                props.setAttributes({ topBarBg: c || '#F5F4EE' });
              },
            }),
            el(BaseControl, { label: __('Top curve accent (rect)', 'headless-core') }),
            el(ColorPalette, {
              value: a.topCurveRectFill,
              colors: palette(),
              onChange: function (c) {
                props.setAttributes({ topCurveRectFill: c || '#00AFBB' });
              },
            }),
            el(BaseControl, { label: __('Top curve fill (path)', 'headless-core') }),
            el(ColorPalette, {
              value: a.topCurvePathFill,
              colors: palette(),
              onChange: function (c) {
                props.setAttributes({ topCurvePathFill: c || '#F5F4EE' });
              },
            })
          ),
          el(
            PanelBody,
            { title: __('Header, pill & scroll colors', 'headless-core'), initialOpen: false },
            el(BaseControl, { label: __('Kicker color', 'headless-core') }),
            el(ColorPalette, {
              value: a.kickerColor,
              colors: palette(),
              onChange: function (c) {
                props.setAttributes({ kickerColor: c || '#ffffff' });
              },
            }),
            el(BaseControl, { label: __('Center pill background', 'headless-core') }),
            el(ColorPalette, {
              value: a.centerPillBg,
              colors: palette(),
              onChange: function (c) {
                props.setAttributes({ centerPillBg: c || '#EE6E2A' });
              },
            }),
            el(BaseControl, { label: __('Center pill hover background', 'headless-core') }),
            el(ColorPalette, {
              value: a.centerPillHoverBg,
              colors: palette(),
              onChange: function (c) {
                props.setAttributes({ centerPillHoverBg: c || '#d96525' });
              },
            }),
            el(BaseControl, { label: __('Center pill text', 'headless-core') }),
            el(ColorPalette, {
              value: a.centerPillTextColor,
              colors: palette(),
              onChange: function (c) {
                props.setAttributes({ centerPillTextColor: c || '#ffffff' });
              },
            }),
            el(BaseControl, { label: __('Scroll down arrow (outer)', 'headless-core') }),
            el(ColorPalette, {
              value: a.scrollArrowOuterFill,
              colors: palette(),
              onChange: function (c) {
                props.setAttributes({ scrollArrowOuterFill: c || '#ffffff' });
              },
            }),
            el(BaseControl, { label: __('Scroll down arrow (inner)', 'headless-core') }),
            el(ColorPalette, {
              value: a.scrollArrowInnerFill,
              colors: palette(),
              onChange: function (c) {
                props.setAttributes({ scrollArrowInnerFill: c || '#22ACB6' });
              },
            })
          ),
          el(
            PanelBody,
            { title: __('White box colors', 'headless-core'), initialOpen: false },
            el(BaseControl, { label: __('Box background', 'headless-core') }),
            el(ColorPalette, {
              value: a.boxBg,
              colors: palette(),
              onChange: function (c) {
                props.setAttributes({ boxBg: c || '#ffffff' });
              },
            }),
            el(BaseControl, { label: __('Title color', 'headless-core') }),
            el(ColorPalette, {
              value: a.boxTitleColor,
              colors: palette(),
              onChange: function (c) {
                props.setAttributes({ boxTitleColor: c || '#3b4e6b' });
              },
            }),
            el(BaseControl, { label: __('Subtitle color', 'headless-core') }),
            el(ColorPalette, {
              value: a.boxSubtitleColor,
              colors: palette(),
              onChange: function (c) {
                props.setAttributes({ boxSubtitleColor: c || '#3b4e6b' });
              },
            })
          ),
          el(
            PanelBody,
            { title: __('Dropdown colors', 'headless-core'), initialOpen: false },
            el(BaseControl, { label: __('Dropdown background', 'headless-core') }),
            el(ColorPalette, {
              value: a.dropdownBg,
              colors: palette(),
              onChange: function (c) {
                props.setAttributes({ dropdownBg: c || '#38f0ba' });
              },
            }),
            el(BaseControl, { label: __('Dropdown border', 'headless-core') }),
            el(ColorPalette, {
              value: a.dropdownBorderColor,
              colors: palette(),
              onChange: function (c) {
                props.setAttributes({ dropdownBorderColor: c || '#e8e8e8' });
              },
            }),
            el(BaseControl, { label: __('Dropdown text', 'headless-core') }),
            el(ColorPalette, {
              value: a.dropdownTextColor,
              colors: palette(),
              onChange: function (c) {
                props.setAttributes({ dropdownTextColor: c || '#3b4e6b' });
              },
            }),
            el(BaseControl, { label: __('Chevron', 'headless-core') }),
            el(ColorPalette, {
              value: a.dropdownChevronColor,
              colors: palette(),
              onChange: function (c) {
                props.setAttributes({ dropdownChevronColor: c || '#3b4e6b' });
              },
            }),
            el(BaseControl, { label: __('Go button background', 'headless-core') }),
            el(ColorPalette, {
              value: a.goButtonBg,
              colors: palette(),
              onChange: function (c) {
                props.setAttributes({ goButtonBg: c || '#38f0ba' });
              },
            }),
            el(BaseControl, { label: __('Go button border', 'headless-core') }),
            el(ColorPalette, {
              value: a.goButtonBorderColor,
              colors: palette(),
              onChange: function (c) {
                props.setAttributes({ goButtonBorderColor: c || '#e8e8e8' });
              },
            }),
            el(BaseControl, { label: __('Go button icon', 'headless-core') }),
            el(ColorPalette, {
              value: a.goButtonIconColor,
              colors: palette(),
              onChange: function (c) {
                props.setAttributes({ goButtonIconColor: c || '#3b4e6b' });
              },
            }),
            el(RangeControl, {
              label: __('Go button hover opacity', 'headless-core'),
              value: Number(a.goButtonHoverOpacity != null ? a.goButtonHoverOpacity : 0.85),
              onChange: function (v) {
                props.setAttributes({ goButtonHoverOpacity: Math.max(0.2, Math.min(1, Number(v))) });
              },
              min: 0.2,
              max: 1,
              step: 0.05,
            }),
            el(BaseControl, { label: __('Divider line', 'headless-core') }),
            el(ColorPalette, {
              value: a.dividerColor,
              colors: palette(),
              onChange: function (c) {
                props.setAttributes({ dividerColor: c || '#e8e8e8' });
              },
            })
          ),
          el(
            PanelBody,
            { title: __('Product & service pills', 'headless-core'), initialOpen: false },
            el(BaseControl, { label: __('Pill background', 'headless-core') }),
            el(ColorPalette, {
              value: a.pillBg,
              colors: palette(),
              onChange: function (c) {
                props.setAttributes({ pillBg: c || '#00ada0' });
              },
            }),
            el(BaseControl, { label: __('Pill border', 'headless-core') }),
            el(ColorPalette, {
              value: a.pillBorderColor,
              colors: palette(),
              onChange: function (c) {
                props.setAttributes({ pillBorderColor: c || '#e8e8e8' });
              },
            }),
            el(BaseControl, { label: __('Pill text', 'headless-core') }),
            el(ColorPalette, {
              value: a.pillTextColor,
              colors: palette(),
              onChange: function (c) {
                props.setAttributes({ pillTextColor: c || '#ffffff' });
              },
            }),
            el(BaseControl, { label: __('Pill hover background', 'headless-core') }),
            el(ColorPalette, {
              value: a.pillHoverBg,
              colors: palette(),
              onChange: function (c) {
                props.setAttributes({ pillHoverBg: c || '#ee6e2a' });
              },
            }),
            el(BaseControl, { label: __('Pill hover border', 'headless-core') }),
            el(ColorPalette, {
              value: a.pillHoverBorderColor,
              colors: palette(),
              onChange: function (c) {
                props.setAttributes({ pillHoverBorderColor: c || '#ee6e2a' });
              },
            }),
            el(BaseControl, { label: __('Pill hover text', 'headless-core') }),
            el(ColorPalette, {
              value: a.pillHoverTextColor,
              colors: palette(),
              onChange: function (c) {
                props.setAttributes({ pillHoverTextColor: c || '#ffffff' });
              },
            })
          )
        ),
        el(
          'div',
          {
            style: {
              padding: '16px',
              borderRadius: '10px',
              border: '1px solid #e5e7eb',
              background: grad,
              color: '#fff',
            },
          },
          el(
            'div',
            { style: { maxWidth: '960px', margin: '0 auto', background: 'rgba(255,255,255,0.12)', borderRadius: '8px', padding: '12px' } },
            el('p', { style: { fontSize: '11px', marginBottom: '8px', opacity: 0.95 } }, a.kickerText || ''),
            el('div', { style: { display: 'inline-block', background: a.centerPillBg || '#EE6E2A', color: a.centerPillTextColor || '#fff', borderRadius: '999px', padding: '6px 14px', fontSize: '11px', fontWeight: 700 } }, a.centerPillText || ''),
            el(
              'div',
              { style: { marginTop: '12px', background: a.boxBg || '#fff', color: '#222', borderRadius: '12px', padding: '12px' } },
              el('div', { style: { fontWeight: 800, fontSize: '13px', color: a.boxTitleColor || '#3b4e6b' } }, a.boxTitle || ''),
              el('div', { style: { fontSize: '11px', marginTop: '4px', color: a.boxSubtitleColor || '#3b4e6b' } }, a.boxSubtitle || ''),
              el('div', { style: { marginTop: '8px', fontSize: '10px', color: '#666' } }, __('Dropdown: ', 'headless-core') + dropdownItems.length + __(' · Pills: ', 'headless-core') + productButtons.length)
            )
          ),
          el('p', { style: { marginTop: '10px', fontSize: '11px', opacity: 0.9, textAlign: 'center' } }, __('Full layout and navigation render on the React frontend.', 'headless-core'))
        ),
        el(
          'div',
          {
            style: {
              marginTop: '12px',
              padding: '12px',
              borderRadius: '10px',
              border: '1px dashed #cbd5e1',
              background: '#fff',
            },
          },
          el('div', { style: { fontWeight: 800, marginBottom: '8px' } }, __('Edit content (inline)', 'headless-core')),

          el(TextControl, {
            label: __('Kicker text', 'headless-core'),
            value: a.kickerText || '',
            onChange: function (v) {
              props.setAttributes({ kickerText: v });
            },
          }),
          el(TextControl, {
            label: __('Center pill text', 'headless-core'),
            value: a.centerPillText || '',
            onChange: function (v) {
              props.setAttributes({ centerPillText: v });
            },
          }),
          el(TextControl, {
            label: __('Title', 'headless-core'),
            value: a.boxTitle || '',
            onChange: function (v) {
              props.setAttributes({ boxTitle: v });
            },
          }),
          el(TextareaControl, {
            label: __('Subtitle', 'headless-core'),
            value: a.boxSubtitle || '',
            onChange: function (v) {
              props.setAttributes({ boxSubtitle: v });
            },
          }),

          el('hr', { style: { margin: '12px 0' } }),
          el(TextControl, {
            label: __('Dropdown placeholder', 'headless-core'),
            value: a.dropdownPlaceholder || '',
            onChange: function (v) {
              props.setAttributes({ dropdownPlaceholder: v });
            },
          }),
          el('p', { style: { fontWeight: 700, marginBottom: '6px' } }, __('Dropdown options (label + URL)', 'headless-core')),
          dropdownItems.map(function (row, i) {
            return el(
              'div',
              { key: 'dd-inline-' + i, style: { marginBottom: '10px', padding: '8px', border: '1px solid #e5e7eb', borderRadius: '6px' } },
              el(TextControl, {
                label: __('Label', 'headless-core'),
                value: row.label,
                onChange: function (v) {
                  setDropdown(i, { label: v });
                },
              }),
              el(TextControl, {
                label: __('URL', 'headless-core'),
                value: row.url,
                onChange: function (v) {
                  setDropdown(i, { url: v });
                },
              }),
              el(
                Button,
                { isDestructive: true, variant: 'secondary', onClick: function () { removeDropdown(i); } },
                __('Remove', 'headless-core')
              )
            );
          }),
          el(Button, { variant: 'primary', onClick: addDropdown }, __('Add dropdown option', 'headless-core')),

          el('hr', { style: { margin: '12px 0' } }),
          el('p', { style: { fontWeight: 700, marginBottom: '6px' } }, __('Pill buttons (text + URL)', 'headless-core')),
          productButtons.map(function (row, i) {
            return el(
              'div',
              { key: 'pill-inline-' + i, style: { marginBottom: '10px', padding: '8px', border: '1px solid #e5e7eb', borderRadius: '6px' } },
              el(TextControl, {
                label: __('Button text', 'headless-core'),
                value: row.label,
                onChange: function (v) {
                  setPill(i, { label: v });
                },
              }),
              el(TextControl, {
                label: __('URL', 'headless-core'),
                value: row.url,
                onChange: function (v) {
                  setPill(i, { url: v });
                },
              }),
              el(
                Button,
                { isDestructive: true, variant: 'secondary', onClick: function () { removePill(i); } },
                __('Remove', 'headless-core')
              )
            );
          }),
          el(Button, { variant: 'primary', onClick: addPill }, __('Add pill button', 'headless-core'))
        )
      );
    },
    save: function () {
      return null;
    },
  });
})(window.wp.blocks, window.wp.blockEditor, window.wp.components, window.wp.element, window.wp.i18n);
