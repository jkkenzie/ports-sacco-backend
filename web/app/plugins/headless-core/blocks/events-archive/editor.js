(function (blocks, blockEditor, components, data, element, i18n) {
  var el = element.createElement;
  var registerBlockType = blocks.registerBlockType;
  var useBlockProps = blockEditor.useBlockProps;
  var InspectorControls = blockEditor.InspectorControls;
  var PanelBody = components.PanelBody;
  var SelectControl = components.SelectControl;
  var TextControl = components.TextControl;
  var TextareaControl = components.TextareaControl;
  var useSelect = data.useSelect;
  var __ = i18n.__;

  registerBlockType('custom/events-archive', {
    apiVersion: 3,
    title: __('Events Archive', 'headless-core'),
    icon: 'calendar',
    category: 'widgets',
    description: __('Lists all Events posts as cards linking to each event page.', 'headless-core'),
    attributes: {
      title: { type: 'string', default: 'News & Events' },
      intro: {
        type: 'string',
        default: 'Stay up to date with the latest happenings, community initiatives, and milestones at Ports SACCO.',
      },
      categoryId: { type: 'number', default: 0 },
      emptyMessage: { type: 'string', default: 'No events available right now.' },
    },
    edit: function (props) {
      var a = props.attributes;
      var blockProps = useBlockProps({ className: 'headless-events-archive-block' });
      var selectedId = Number(a.categoryId || 0);
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
          ),
          el(
            PanelBody,
            { title: __('Section copy', 'headless-core'), initialOpen: true },
            el(TextControl, {
              label: __('Heading', 'headless-core'),
              value: a.title || '',
              onChange: function (v) { props.setAttributes({ title: v }); },
            }),
            el(TextareaControl, {
              label: __('Intro', 'headless-core'),
              value: a.intro || '',
              onChange: function (v) { props.setAttributes({ intro: v }); },
            }),
            el(TextControl, {
              label: __('Empty message', 'headless-core'),
              value: a.emptyMessage || '',
              onChange: function (v) { props.setAttributes({ emptyMessage: v }); },
            })
          )
        ),
        el(
          'div',
          { style: { padding: '1rem', border: '1px dashed #22acb6', borderRadius: '8px', background: '#f0fafb' } },
          el('strong', null, __('Events Archive', 'headless-core')),
          a.title
            ? el('h3', { style: { margin: '12px 0 4px', fontSize: '18px' } }, a.title)
            : null,
          a.intro
            ? el('p', { style: { margin: '0 0 12px', color: '#3b4e6b', fontSize: '13px' } }, a.intro)
            : null,
          el(
            'p',
            { style: { margin: 0, color: '#555', fontSize: '12px' } },
            selectedId > 0
              ? __('Frontend will render events for the selected category.', 'headless-core')
              : __('Frontend will fetch and render all published events.', 'headless-core')
          )
        )
      );
    },
    save: function () {
      return null;
    },
  });
})(window.wp.blocks, window.wp.blockEditor, window.wp.components, window.wp.data, window.wp.element, window.wp.i18n);
