(function (blocks, blockEditor, components, data, element, i18n) {
  var el = element.createElement;
  var registerBlockType = blocks.registerBlockType;
  var useBlockProps = blockEditor.useBlockProps;
  var InspectorControls = blockEditor.InspectorControls;
  var PanelBody = components.PanelBody;
  var SelectControl = components.SelectControl;
  var useSelect = data.useSelect;
  var __ = i18n.__;

  registerBlockType('custom/events-grid', {
    apiVersion: 3,
    title: __('Events Grid', 'headless-core'),
    icon: 'calendar-alt',
    category: 'widgets',
    description: __('Displays all Events posts as cards.', 'headless-core'),
    attributes: {
      categoryId: { type: 'number', default: 0 },
    },
    edit: function (props) {
      var blockProps = useBlockProps({ className: 'headless-events-grid-block' });
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

      return el(
        'div',
        blockProps,
        el(
          InspectorControls,
          null,
          el(
            PanelBody,
            { title: __('Query', 'headless-core'), initialOpen: true },
            el(SelectControl, {
              label: __('Category', 'headless-core'),
              value: selectedId,
              options: options,
              onChange: function (next) {
                props.setAttributes({ categoryId: parseInt(next, 10) || 0 });
              },
            })
          )
        ),
        el(
          'div',
          { style: { padding: '1rem', border: '1px dashed #ccc', borderRadius: '4px' } },
          el('strong', null, __('Events Grid', 'headless-core')),
          el(
            'p',
            { style: { marginTop: '8px', marginBottom: 0, color: '#555' } },
            selectedId > 0
              ? __('Frontend will render events for the selected category.', 'headless-core')
              : __('Frontend will fetch and render all events as cards.', 'headless-core')
          )
        )
      );
    },
    save: function () {
      return null;
    },
  });
})(window.wp.blocks, window.wp.blockEditor, window.wp.components, window.wp.data, window.wp.element, window.wp.i18n);
