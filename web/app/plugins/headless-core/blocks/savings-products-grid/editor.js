(function (blocks, blockEditor, element, i18n) {
  var el = element.createElement;
  var registerBlockType = blocks.registerBlockType;
  var useBlockProps = blockEditor.useBlockProps;
  var __ = i18n.__;

  registerBlockType('custom/savings-products-grid', {
    apiVersion: 3,
    title: __('Savings Products Grid', 'headless-core'),
    icon: 'screenoptions',
    category: 'widgets',
    description: __('Displays all Savings Products posts as cards in the frontend.', 'headless-core'),
    attributes: {},
    edit: function () {
      var blockProps = useBlockProps({ className: 'headless-savings-products-grid-block' });
      return el(
        'div',
        blockProps,
        el(
          'div',
          { style: { padding: '1rem', border: '1px dashed #ccc', borderRadius: '4px' } },
          el('strong', null, __('Savings Products Grid', 'headless-core')),
          el('p', { style: { marginTop: '8px', marginBottom: 0, color: '#555' } }, __('Frontend will fetch and render all savings products using the existing card styling.', 'headless-core'))
        )
      );
    },
    save: function () {
      return null;
    },
  });
})(window.wp.blocks, window.wp.blockEditor, window.wp.element, window.wp.i18n);
