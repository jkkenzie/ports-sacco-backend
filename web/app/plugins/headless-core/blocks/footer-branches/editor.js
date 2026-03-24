(function (blocks, blockEditor, components, element, i18n) {
  var el = element.createElement;
  var registerBlockType = blocks.registerBlockType;
  var useBlockProps = blockEditor.useBlockProps;
  var InspectorControls = blockEditor.InspectorControls;
  var PanelBody = components.PanelBody;
  var TextControl = components.TextControl;
  var Button = components.Button;
  var __ = i18n.__;

  registerBlockType('custom/footer-branches', {
    apiVersion: 3,
    title: __('Footer Branches', 'headless-core'),
    icon: 'building',
    category: 'widgets',
    attributes: {
      branches: { type: 'array', default: [] },
    },
    edit: function (props) {
      var a = props.attributes;
      var setAttributes = props.setAttributes;
      var blockProps = useBlockProps();
      var branches = Array.isArray(a.branches) ? a.branches : [];

      function updateBranch(index, key, value) {
        var next = branches.slice();
        next[index] = Object.assign({}, next[index] || {}, (function(){ var o = {}; o[key] = value; return o; })());
        setAttributes({ branches: next });
      }

      function addBranch() {
        setAttributes({ branches: branches.concat([{ name: '', address: '', phone: '' }]) });
      }

      function removeBranch(index) {
        var next = branches.slice();
        next.splice(index, 1);
        setAttributes({ branches: next });
      }

      var items = branches.map(function (branch, index) {
        return el('div', { key: index, style: { border: '1px solid #ddd', padding: '10px', marginBottom: '10px' } },
          el(TextControl, { label: __('Name', 'headless-core'), value: branch.name || '', onChange: function (v) { updateBranch(index, 'name', v); } }),
          el(TextControl, { label: __('Address', 'headless-core'), value: branch.address || '', onChange: function (v) { updateBranch(index, 'address', v); } }),
          el(TextControl, { label: __('Phone', 'headless-core'), value: branch.phone || '', onChange: function (v) { updateBranch(index, 'phone', v); } }),
          el(Button, { isDestructive: true, onClick: function () { removeBranch(index); } }, __('Remove Branch', 'headless-core'))
        );
      });

      return el('div', blockProps,
        el(InspectorControls, null,
          el(PanelBody, { title: __('Footer Branches', 'headless-core'), initialOpen: true },
            items,
            el(Button, { isPrimary: true, onClick: addBranch }, __('Add Branch', 'headless-core'))
          )
        ),
        el('div', { style: { padding: '12px', border: '1px dashed #ccc' } }, __('Footer Branches block configured in sidebar.', 'headless-core'))
      );
    },
    save: function () {
      return null;
    },
  });
})(window.wp.blocks, window.wp.blockEditor, window.wp.components, window.wp.element, window.wp.i18n);
