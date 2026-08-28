(function (blocks, blockEditor, components, element, i18n) {
  var el = element.createElement;
  var useState = element.useState;
  var registerBlockType = blocks.registerBlockType;
  var useBlockProps = blockEditor.useBlockProps;
  var InspectorControls = blockEditor.InspectorControls;
  var RichText = blockEditor.RichText;
  var PanelBody = components.PanelBody;
  var Button = components.Button;
  var TextControl = components.TextControl;
  var TextareaControl = components.TextareaControl;
  var BaseControl = components.BaseControl;
  var ColorPalette = components.ColorPalette;
  var __ = i18n.__;
  var headlessLink = window.headlessCoreEditor || {};

  var BLOCK_TITLE = __('Intro Block V2', 'headless-core');

  function HomeAboutEdit(props) {
    var collapsedState = useState(false);
    var editorCollapsed = collapsedState[0];
    var setEditorCollapsed = collapsedState[1];
    var blockProps = useBlockProps({ className: 'headless-home-about-block' });
    var colors = ['#22ACB6', '#22acb6', '#EE6E2A', '#ffffff', '#000000', '#eef0f3', '#65605f', '#3b4e6b'];
    function palette() {
      return colors.map(function (hex) {
        return { color: hex, name: hex };
      });
    }

    var a = props.attributes;

    function toggleCollapsed() {
      setEditorCollapsed(!editorCollapsed);
    }

    return el(
      'div',
      blockProps,
      el(
        InspectorControls,
        null,
        el(
          PanelBody,
          { title: __('Section', 'headless-core'), initialOpen: true },
          el(TextControl, {
            label: __('Section ID', 'headless-core'),
            value: a.sectionId || 'about',
            onChange: function (v) {
              props.setAttributes({ sectionId: v || 'about' });
            },
            help: __('Used as the section id for hash links (e.g. #about).', 'headless-core'),
          })
        ),
        el(
          PanelBody,
          { title: __('Colors', 'headless-core'), initialOpen: false },
          el(BaseControl, { label: __('Top bar background', 'headless-core') }),
          el(ColorPalette, {
            value: a.barBgColor,
            colors: palette(),
            onChange: function (c) {
              props.setAttributes({ barBgColor: c || '#22acb6' });
            },
          }),
          el(BaseControl, { label: __('Curved cutout color', 'headless-core') }),
          el(ColorPalette, {
            value: a.curvedRectColor,
            colors: palette(),
            onChange: function (c) {
              props.setAttributes({ curvedRectColor: c || '#ffffff' });
            },
          }),
          el(BaseControl, { label: __('Badge background', 'headless-core') }),
          el(ColorPalette, {
            value: a.buttonBgColor,
            colors: palette(),
            onChange: function (c) {
              props.setAttributes({ buttonBgColor: c || '#EE6E2A' });
            },
          }),
          el(BaseControl, { label: __('Badge text', 'headless-core') }),
          el(ColorPalette, {
            value: a.buttonTextColor,
            colors: palette(),
            onChange: function (c) {
              props.setAttributes({ buttonTextColor: c || '#ffffff' });
            },
          }),
          el(BaseControl, { label: __('Body text', 'headless-core') }),
          el(ColorPalette, {
            value: a.bodyTextColor,
            colors: palette(),
            onChange: function (c) {
              props.setAttributes({ bodyTextColor: c || '#3b4e6b' });
            },
          }),
          el(BaseControl, { label: __('Read more text', 'headless-core') }),
          el(ColorPalette, {
            value: a.readMoreTextColor,
            colors: palette(),
            onChange: function (c) {
              props.setAttributes({ readMoreTextColor: c || '#3b4e6b' });
            },
          }),
          el(BaseControl, { label: __('Read more hover text', 'headless-core') }),
          el(ColorPalette, {
            value: a.readMoreHoverColor,
            colors: palette(),
            onChange: function (c) {
              props.setAttributes({ readMoreHoverColor: c || '#22ACB6' });
            },
          }),
          el(BaseControl, { label: __('Read more circle', 'headless-core') }),
          el(ColorPalette, {
            value: a.readMoreCircleColor,
            colors: palette(),
            onChange: function (c) {
              props.setAttributes({ readMoreCircleColor: c || '#22ACB6' });
            },
          })
        )
      ),
      el(
        'div',
        {
          style: {
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            overflow: 'hidden',
            background: '#fff',
          },
        },
        el(
          'div',
          {
            style: {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              padding: '10px 12px',
              background: '#f6f7f7',
              borderBottom: editorCollapsed ? 'none' : '1px solid #e5e7eb',
              cursor: 'pointer',
            },
            onClick: toggleCollapsed,
            role: 'button',
            tabIndex: 0,
            'aria-expanded': !editorCollapsed,
            onKeyDown: function (e) {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleCollapsed();
              }
            },
          },
          el(
            'div',
            { style: { display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: '1 1 auto' } },
            el(
              'span',
              {
                'aria-hidden': true,
                style: {
                  display: 'inline-flex',
                  width: '22px',
                  height: '22px',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '4px',
                  background: '#e2e8f0',
                  color: '#334155',
                  fontSize: '12px',
                  fontWeight: 700,
                  flex: '0 0 auto',
                  transform: editorCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)',
                  transition: 'transform 0.15s ease',
                },
              },
              '▾'
            ),
            el('strong', { style: { fontSize: '14px', color: '#1e1e1e' } }, BLOCK_TITLE)
          ),
          el(
            Button,
            {
              variant: 'tertiary',
              isSmall: true,
              onClick: function (e) {
                e.stopPropagation();
                toggleCollapsed();
              },
            },
            editorCollapsed ? __('Expand', 'headless-core') : __('Collapse', 'headless-core')
          )
        ),
        editorCollapsed
          ? null
          : el(
              'div',
              { style: { padding: '16px' } },
              el(RichText, {
                tagName: 'div',
                value: a.badgeText || '',
                onChange: function (v) {
                  props.setAttributes({ badgeText: v });
                },
                placeholder: __('Badge text…', 'headless-core'),
                allowedFormats: [],
                style: {
                  display: 'inline-block',
                  padding: '6px 18px',
                  borderRadius: '999px',
                  background: a.buttonBgColor,
                  color: a.buttonTextColor,
                  fontWeight: 700,
                  fontSize: '12px',
                  marginBottom: '12px',
                },
              }),
              el(TextareaControl, {
                label: __('Body text', 'headless-core'),
                value: a.bodyText,
                onChange: function (v) {
                  props.setAttributes({ bodyText: v });
                },
              }),
              el(
                'div',
                { style: { marginTop: '10px' } },
                el(TextControl, {
                  label: __('Read more label', 'headless-core'),
                  value: a.readMoreLabel,
                  onChange: function (v) {
                    props.setAttributes({ readMoreLabel: v });
                  },
                }),
                headlessLink.renderLinkControlAttribute
                  ? headlessLink.renderLinkControlAttribute(
                      el,
                      blockEditor,
                      components,
                      i18n,
                      __('Read more URL', 'headless-core'),
                      a,
                      'readMoreUrl',
                      props.setAttributes
                    )
                  : el(TextControl, {
                      label: __('Read more URL', 'headless-core'),
                      value: a.readMoreUrl,
                      onChange: function (v) {
                        props.setAttributes({ readMoreUrl: v });
                      },
                    })
              ),
              el(
                'div',
                { style: { marginTop: '10px', fontSize: '12px', color: '#666' } },
                __('The animated scroll button renders on the frontend.', 'headless-core')
              )
            )
      )
    );
  }

  registerBlockType('custom/home-about', {
    apiVersion: 3,
    title: BLOCK_TITLE,
    icon: 'info-outline',
    category: 'widgets',
    description: __('Homepage intro (V2) with badge, body text, and read more link.', 'headless-core'),
    keywords: ['intro', 'about', 'home', 'v2', 'badge'],
    supports: { anchor: true },
    attributes: {
      sectionId: { type: 'string', default: 'about' },
      barBgColor: { type: 'string', default: '#22acb6' },
      curvedRectColor: { type: 'string', default: '#ffffff' },
      scrollButtonBg: { type: 'string', default: '#22ACB6' },
      scrollButtonArrow: { type: 'string', default: '#ffffff' },
      buttonBgColor: { type: 'string', default: '#EE6E2A' },
      buttonTextColor: { type: 'string', default: '#ffffff' },
      badgeText: { type: 'string', default: 'ABOUT US' },
      bodyText: {
        type: 'string',
        default:
          'Ports DT Sacco, your trusted financial partner since 1966, is a Tier 1 licensed deposit-taking Sacco regulated by the Sacco Society Regulatory Authority (SASRA)...',
      },
      bodyTextColor: { type: 'string', default: '#3b4e6b' },
      readMoreLabel: { type: 'string', default: 'READ MORE' },
      readMoreUrl: { type: 'string', default: '/about-us' },
      readMoreTextColor: { type: 'string', default: '#3b4e6b' },
      readMoreHoverColor: { type: 'string', default: '#22ACB6' },
      readMoreCircleColor: { type: 'string', default: '#22ACB6' },
    },
    edit: HomeAboutEdit,
    save: function () {
      return null;
    },
  });
})(window.wp.blocks, window.wp.blockEditor, window.wp.components, window.wp.element, window.wp.i18n);
