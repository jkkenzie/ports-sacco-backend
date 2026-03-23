(function (blocks, blockEditor, components, element, i18n) {
  var el = element.createElement;
  var registerBlockType = blocks.registerBlockType;
  var useBlockProps = blockEditor.useBlockProps;
  var InspectorControls = blockEditor.InspectorControls;
  var PanelBody = components.PanelBody;
  var TextControl = components.TextControl;
  var __ = i18n.__;

  registerBlockType('custom/hero', {
    apiVersion: 3,
    title: __('Hero', 'headless-core'),
    icon: 'cover-image',
    category: 'widgets',
    description: __('Structured hero (title + subtitle). Rendered by the React SPA.', 'headless-core'),
    attributes: {
      title: { type: 'string', default: '' },
      subtitle: { type: 'string', default: '' },
    },
    edit: function (props) {
      var blockProps = useBlockProps({ className: 'headless-hero-block' });
      return el(
        'div',
        blockProps,
        el(
          InspectorControls,
          null,
          el(
            PanelBody,
            { title: __('Content', 'headless-core'), initialOpen: true },
            el(TextControl, {
              label: __('Title', 'headless-core'),
              value: props.attributes.title,
              onChange: function (v) {
                props.setAttributes({ title: v });
              },
            }),
            el(TextControl, {
              label: __('Subtitle', 'headless-core'),
              value: props.attributes.subtitle,
              onChange: function (v) {
                props.setAttributes({ subtitle: v });
              },
            })
          )
        ),
        el(
          'div',
          { style: { padding: '1rem', border: '1px dashed #ccc', borderRadius: '4px' } },
          el('strong', null, props.attributes.title || __('Hero', 'headless-core')),
          el(
            'div',
            { style: { fontSize: '0.9em', marginTop: '0.5rem', color: '#555' } },
            props.attributes.subtitle || ''
          )
        )
      );
    },
    save: function () {
      return null;
    },
  });
})(window.wp.blocks, window.wp.blockEditor, window.wp.components, window.wp.element, window.wp.i18n);
