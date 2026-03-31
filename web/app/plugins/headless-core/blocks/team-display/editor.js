(function (blocks, blockEditor, components, data, element, i18n) {
  var el = element.createElement;
  var registerBlockType = blocks.registerBlockType;
  var useBlockProps = blockEditor.useBlockProps;
  var InspectorControls = blockEditor.InspectorControls;
  var PanelBody = components.PanelBody;
  var SelectControl = components.SelectControl;
  var TextControl = components.TextControl;
  var RangeControl = components.RangeControl;
  var BaseControl = components.BaseControl;
  var ColorPalette = components.ColorPalette;
  var MediaUpload = blockEditor.MediaUpload;
  var MediaUploadCheck = blockEditor.MediaUploadCheck;
  var Button = components.Button;
  var useSelect = data.useSelect;
  var __ = i18n.__;

  registerBlockType('custom/team-display', {
    apiVersion: 3,
    title: __('Team Display', 'headless-core'),
    icon: 'groups',
    category: 'widgets',
    description: __('Team grid with slide-in member panel (Board of Directors layout).', 'headless-core'),
    attributes: {
      sectionId: { type: 'string', default: 'team' },
      categoryId: { type: 'number', default: 0 },
      heading: { type: 'string', default: 'The Board of Directors' },
      sectionBgColor: { type: 'string', default: '#ffffff' },
      headingColor: { type: 'string', default: '#40C9BF' },
      nameColor: { type: 'string', default: '#212529' },
      positionColor: { type: 'string', default: '#EE6E2A' },
      heroImageId: { type: 'number', default: 0 },
      heroImageUrl: { type: 'string', default: '' },
      heroHeight: { type: 'number', default: 260 },
      maxItems: { type: 'number', default: 0 },
    },
    edit: function (props) {
      var a = props.attributes;
      var blockProps = useBlockProps({ className: 'headless-team-display-block' });
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
      var colors = ['#40C9BF', '#EE6E2A', '#212529', '#ffffff', '#000000', '#e8e8e8', '#F5F4EE', '#f3f5f7'];
      function palette() {
        return colors.map(function (hex) { return { color: hex, name: hex }; });
      }

      return el(
        'div',
        blockProps,
        el(
          InspectorControls,
          null,
          el(
            PanelBody,
            { title: __('Team settings', 'headless-core'), initialOpen: true },
            el(TextControl, {
              label: __('Section ID', 'headless-core'),
              value: a.sectionId || '',
              onChange: function (v) { props.setAttributes({ sectionId: v }); },
            }),
            el(SelectControl, {
              label: __('Category filter', 'headless-core'),
              value: selectedId,
              options: options,
              onChange: function (next) {
                props.setAttributes({ categoryId: parseInt(next, 10) || 0 });
              },
            }),
            el(TextControl, {
              label: __('Heading', 'headless-core'),
              value: a.heading || '',
              onChange: function (v) { props.setAttributes({ heading: v }); },
            }),
            el('hr', { style: { margin: '12px 0' } }),
            el('p', { style: { fontWeight: 700, marginBottom: '6px' } }, __('Hero banner (full width)', 'headless-core')),
            el(RangeControl, {
              label: __('Hero height (px)', 'headless-core'),
              value: Number(a.heroHeight || 260),
              onChange: function (v) { props.setAttributes({ heroHeight: Number(v) || 260 }); },
              min: 120,
              max: 600,
            }),
            el(
              MediaUploadCheck,
              null,
              el(MediaUpload, {
                onSelect: function (media) {
                  props.setAttributes({
                    heroImageId: media && media.id ? Number(media.id) : 0,
                    heroImageUrl: media && media.url ? String(media.url) : '',
                  });
                },
                allowedTypes: ['image'],
                value: a.heroImageId || 0,
                render: function (obj) {
                  return el(
                    'div',
                    null,
                    el(Button, { variant: 'primary', onClick: obj.open }, a.heroImageId ? __('Replace hero image', 'headless-core') : __('Select hero image', 'headless-core')),
                    a.heroImageId
                      ? el(Button, { variant: 'secondary', onClick: function () { props.setAttributes({ heroImageId: 0, heroImageUrl: '' }); }, style: { marginLeft: '8px' } }, __('Clear', 'headless-core'))
                      : null
                  );
                },
              })
            ),
            el(RangeControl, {
              label: __('Max items (0 = all)', 'headless-core'),
              value: Number(a.maxItems || 0),
              onChange: function (v) { props.setAttributes({ maxItems: Number(v) || 0 }); },
              min: 0,
              max: 60,
            })
          ),
          el(
            PanelBody,
            { title: __('Colors', 'headless-core'), initialOpen: false },
            el(BaseControl, { label: __('Section background', 'headless-core') }),
            el(ColorPalette, { value: a.sectionBgColor, colors: palette(), onChange: function (c) { props.setAttributes({ sectionBgColor: c || '#ffffff' }); } }),
            el(BaseControl, { label: __('Heading color', 'headless-core') }),
            el(ColorPalette, { value: a.headingColor, colors: palette(), onChange: function (c) { props.setAttributes({ headingColor: c || '#40C9BF' }); } }),
            el(BaseControl, { label: __('Name color', 'headless-core') }),
            el(ColorPalette, { value: a.nameColor, colors: palette(), onChange: function (c) { props.setAttributes({ nameColor: c || '#212529' }); } }),
            el(BaseControl, { label: __('Position color', 'headless-core') }),
            el(ColorPalette, { value: a.positionColor, colors: palette(), onChange: function (c) { props.setAttributes({ positionColor: c || '#EE6E2A' }); } })
          )
        ),
        el(
          'div',
          { style: { padding: '16px', borderRadius: '10px', border: '1px dashed #cbd5e1', background: a.sectionBgColor || '#fff' } },
          el('div', { style: { fontWeight: 900, fontSize: '14px', marginBottom: '8px', color: a.headingColor || '#40C9BF' } }, a.heading || ''),
          el('div', { style: { color: '#666', fontSize: '12px' } }, __('Team members render from the Team CPT on the frontend. First "Stand alone" member becomes the centered card.', 'headless-core')),
          el('div', { style: { marginTop: '6px', color: '#777', fontSize: '11px' } }, __('Category filter: ', 'headless-core') + (selectedId ? selectedId : __('All', 'headless-core'))),
          el('div', { style: { marginTop: '10px', color: '#888', fontSize: '11px' } }, __('Tip: Edit each team member’s "position" and "standAlone" meta fields in the Team post editor.', 'headless-core'))
        )
      );
    },
    save: function () { return null; },
  });
})(window.wp.blocks, window.wp.blockEditor, window.wp.components, window.wp.data, window.wp.element, window.wp.i18n);

