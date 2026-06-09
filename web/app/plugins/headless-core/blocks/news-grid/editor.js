(function (blocks, blockEditor, components, element, i18n) {
  var el = element.createElement;
  var registerBlockType = blocks.registerBlockType;
  var useBlockProps = blockEditor.useBlockProps;
  var InspectorControls = blockEditor.InspectorControls;
  var PanelBody = components.PanelBody;
  var RangeControl = components.RangeControl;
  var TextControl = components.TextControl;
  var __ = i18n.__;

  registerBlockType('custom/news-grid', {
    apiVersion: 3,
    title: __('News Grid', 'headless-core'),
    icon: 'admin-post',
    category: 'widgets',
    description: __('Archive grid of blog posts with category filters and pagination.', 'headless-core'),
    attributes: {
      perPage: { type: 'number', default: 9 },
      readMoreLabel: { type: 'string', default: 'Read More' },
    },
    edit: function (props) {
      var blockProps = useBlockProps({ className: 'headless-news-grid-block' });
      var a = props.attributes;

      return el(
        'div',
        blockProps,
        el(
          InspectorControls,
          null,
          el(
            PanelBody,
            { title: __('Query', 'headless-core'), initialOpen: true },
            el(RangeControl, {
              label: __('Posts per page', 'headless-core'),
              value: typeof a.perPage === 'number' ? a.perPage : 9,
              min: 3,
              max: 24,
              step: 3,
              onChange: function (v) {
                props.setAttributes({ perPage: typeof v === 'number' ? v : 9 });
              },
            }),
            el(TextControl, {
              label: __('Read more button label', 'headless-core'),
              value: a.readMoreLabel || 'Read More',
              onChange: function (v) {
                props.setAttributes({ readMoreLabel: String(v || 'Read More') });
              },
            })
          )
        ),
        el(
          'div',
          { style: { padding: '1rem', border: '1px dashed #22acb6', borderRadius: '8px', background: '#f0fafb' } },
          el('strong', null, __('News Grid', 'headless-core')),
          el(
            'p',
            { style: { marginTop: '8px', marginBottom: 0, color: '#555' } },
            __('Frontend renders published posts with category filters, pagination, and read-more links.', 'headless-core')
          )
        )
      );
    },
    save: function () {
      return null;
    },
  });
})(window.wp.blocks, window.wp.blockEditor, window.wp.components, window.wp.element, window.wp.i18n);
