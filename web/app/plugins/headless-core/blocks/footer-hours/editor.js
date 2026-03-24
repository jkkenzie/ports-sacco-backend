(function (blocks, blockEditor, components, element, i18n) {
  var el = element.createElement;
  var registerBlockType = blocks.registerBlockType;
  var useBlockProps = blockEditor.useBlockProps;
  var InspectorControls = blockEditor.InspectorControls;
  var PanelBody = components.PanelBody;
  var TextControl = components.TextControl;
  var __ = i18n.__;

  registerBlockType('custom/footer-hours', {
    apiVersion: 3,
    title: __('Footer Hours', 'headless-core'),
    icon: 'clock',
    category: 'widgets',
    attributes: {
      title: { type: 'string', default: 'Banking Hours' },
      weekdaysLabel: { type: 'string', default: 'Monday - Friday:' },
      weekdaysTime: { type: 'string', default: '08:30 AM - 04:00 PM' },
      saturdayLabel: { type: 'string', default: 'Saturday:' },
      saturdayTime: { type: 'string', default: '09:00 AM - 12:00 PM' },
      sundayLabel: { type: 'string', default: 'Sunday:' },
      sundayTime: { type: 'string', default: 'Closed' },
    },
    edit: function (props) {
      var a = props.attributes;
      var setAttributes = props.setAttributes;
      var blockProps = useBlockProps();

      function field(key, label) {
        return el(TextControl, {
          label: label,
          value: a[key] || '',
          onChange: function (v) {
            var next = {};
            next[key] = v;
            setAttributes(next);
          },
        });
      }

      return el('div', blockProps,
        el(InspectorControls, null,
          el(PanelBody, { title: __('Footer Hours', 'headless-core'), initialOpen: true },
            field('title', __('Title', 'headless-core')),
            field('weekdaysLabel', __('Weekdays Label', 'headless-core')),
            field('weekdaysTime', __('Weekdays Time', 'headless-core')),
            field('saturdayLabel', __('Saturday Label', 'headless-core')),
            field('saturdayTime', __('Saturday Time', 'headless-core')),
            field('sundayLabel', __('Sunday Label', 'headless-core')),
            field('sundayTime', __('Sunday Time', 'headless-core'))
          )
        ),
        el('div', { style: { padding: '12px', border: '1px dashed #ccc' } }, __('Footer Hours block configured in sidebar.', 'headless-core'))
      );
    },
    save: function () {
      return null;
    },
  });
})(window.wp.blocks, window.wp.blockEditor, window.wp.components, window.wp.element, window.wp.i18n);
