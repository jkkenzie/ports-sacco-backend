(function (hooks, blockEditor, components, element, i18n) {
  var el = element.createElement;
  var Fragment = element.Fragment;
  var addFilter = hooks.addFilter;
  var InspectorControls = blockEditor.InspectorControls;
  var PanelBody = components.PanelBody;
  var TextControl = components.TextControl;
  var __ = i18n.__;

  var TARGET_BLOCKS = ['core/heading', 'core/paragraph'];
  var SPACING_KEYS = [
    'marginTop',
    'marginRight',
    'marginBottom',
    'marginLeft',
    'paddingTop',
    'paddingRight',
    'paddingBottom',
    'paddingLeft',
  ];

  function spacingAttributes() {
    var attrs = {};
    SPACING_KEYS.forEach(function (key) {
      attrs[key] = { type: 'string', default: '' };
    });
    return attrs;
  }

  function renderSpacingField(label, key, attributes, setAttributes) {
    return el(TextControl, {
      label: label,
      value: attributes[key] || '',
      help: __('Examples: 24px, 1.5rem, 2em, 0', 'headless-core'),
      onChange: function (value) {
        var patch = {};
        patch[key] = String(value || '');
        setAttributes(patch);
      },
    });
  }

  addFilter('blocks.registerBlockType', 'headless-core/core-rich-text-spacing-attrs', function (settings, name) {
    if (TARGET_BLOCKS.indexOf(name) === -1) {
      return settings;
    }

    return Object.assign({}, settings, {
      attributes: Object.assign({}, settings.attributes || {}, spacingAttributes()),
    });
  });

  addFilter('editor.BlockEdit', 'headless-core/core-rich-text-spacing-controls', function (BlockEdit) {
    return function (props) {
      if (TARGET_BLOCKS.indexOf(props.name) === -1) {
        return el(BlockEdit, props);
      }

      var a = props.attributes;
      var setAttributes = props.setAttributes;

      return el(
        Fragment,
        null,
        el(BlockEdit, props),
        el(
          InspectorControls,
          null,
          el(
            PanelBody,
            {
              title: __('Frontend spacing', 'headless-core'),
              initialOpen: false,
            },
            el(
              'p',
              { style: { marginTop: 0, color: '#555', fontSize: '12px' } },
              __('Optional margin and padding overrides for the React frontend. Leave blank to use defaults.', 'headless-core')
            ),
            el('strong', { style: { display: 'block', marginBottom: '8px' } }, __('Margin', 'headless-core')),
            renderSpacingField(__('Top', 'headless-core'), 'marginTop', a, setAttributes),
            renderSpacingField(__('Right', 'headless-core'), 'marginRight', a, setAttributes),
            renderSpacingField(__('Bottom', 'headless-core'), 'marginBottom', a, setAttributes),
            renderSpacingField(__('Left', 'headless-core'), 'marginLeft', a, setAttributes),
            el('strong', { style: { display: 'block', margin: '12px 0 8px' } }, __('Padding', 'headless-core')),
            renderSpacingField(__('Top', 'headless-core'), 'paddingTop', a, setAttributes),
            renderSpacingField(__('Right', 'headless-core'), 'paddingRight', a, setAttributes),
            renderSpacingField(__('Bottom', 'headless-core'), 'paddingBottom', a, setAttributes),
            renderSpacingField(__('Left', 'headless-core'), 'paddingLeft', a, setAttributes)
          )
        )
      );
    };
  });
})(window.wp.hooks, window.wp.blockEditor, window.wp.components, window.wp.element, window.wp.i18n);
