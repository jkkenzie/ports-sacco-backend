(function (blocks, blockEditor, components, element, i18n) {
  var el = element.createElement;
  var registerBlockType = blocks.registerBlockType;
  var useBlockProps = blockEditor.useBlockProps;
  var InspectorControls = blockEditor.InspectorControls;
  var PanelBody = components.PanelBody;
  var Button = components.Button;
  var ToggleControl = components.ToggleControl;
  var TextControl = components.TextControl;
  var BaseControl = components.BaseControl;
  var ColorPalette = components.ColorPalette;
  var RangeControl = components.RangeControl;
  var __ = i18n.__;
  var headlessLink = window.headlessCoreEditor || {};

  function renderUrlField(label, item, urlKey, onChange) {
    if (headlessLink.renderLinkControl) {
      return headlessLink.renderLinkControl(el, blockEditor, components, i18n, label, item, urlKey, onChange);
    }
    return el(TextControl, {
      label: label,
      value: String((item && item[urlKey]) || ''),
      onChange: function (v) {
        var patch = {};
        patch[urlKey] = String(v || '');
        onChange(patch);
      },
    });
  }

  registerBlockType('custom/header-topbar', {
    apiVersion: 3,
    title: __('Header - Top Bar', 'headless-core'),
    icon: 'editor-kitchensink',
    category: 'widgets',
    description: __('Editable top bar above the main header.', 'headless-core'),
    attributes: {
      enabled: { type: 'boolean', default: true },
      bgColor: { type: 'string', default: '#1BB5B5' },
      bgOpacity: { type: 'number', default: 100 },
      textColor: { type: 'string', default: '#ffffff' },
      hoverColor: { type: 'string', default: '#ee6e2a' },
      fontSize: { type: 'number', default: 10 },
      menuLinkColor: { type: 'string', default: '#ffffff' },
      menuLinkHoverColor: { type: 'string', default: '#ee6e2a' },
      dropdownBgColor: { type: 'string', default: 'rgba(255,255,255,0.92)' },
      dropdownItemColor: { type: 'string', default: '#4b5563' },
      dropdownItemHoverColor: { type: 'string', default: '#ee6e2a' },
      links: { type: 'array', default: [] },
      locationItems: { type: 'array', default: [] },
      phoneText: { type: 'string', default: 'CALL US: +254 111 173 000' },
      phoneUrl: { type: 'string', default: '' },
      loginLabel: { type: 'string', default: 'MEMBER LOGIN' },
      loginUrl: { type: 'string', default: '' },
    },
    edit: function (props) {
      var a = props.attributes;
      var blockProps = useBlockProps({ className: 'headless-header-topbar-block' });
      var colors = ['#1BB5B5', '#22ACB6', '#EE6E2A', '#ffffff', '#000000', '#3b4e6b', '#e8e8e8'];
      function palette() {
        return colors.map(function (hex) {
          return { color: hex, name: hex };
        });
      }

      var links = Array.isArray(a.links) && a.links.length
        ? a.links.map(function (x) { return { label: String((x && x.label) || ''), url: String((x && x.url) || '') }; })
        : [
            { label: 'NEWS & EVENTS', url: '#' },
            { label: 'CAREERS', url: '#' },
            { label: 'TENDERS', url: '#' },
          ];

      var locationItems = Array.isArray(a.locationItems) && a.locationItems.length
        ? a.locationItems.map(function (x) { return { label: String((x && x.label) || ''), url: String((x && x.url) || '') }; })
        : [
            { label: 'MOMBASA', url: '#' },
            { label: 'VOI', url: '#' },
            { label: 'NAIROBI', url: '#' },
            { label: 'KILUMU', url: '#' },
          ];

      function setLink(i, patch) {
        var next = links.map(function (row, idx) {
          return idx === i ? Object.assign({}, row, patch) : row;
        });
        props.setAttributes({ links: next });
      }
      function addLink() {
        props.setAttributes({ links: links.concat([{ label: 'NEW LINK', url: '#' }]) });
      }
      function removeLink(i) {
        if (!window.confirm(__('Remove this link?', 'headless-core'))) return;
        props.setAttributes({ links: links.filter(function (_, idx) { return idx !== i; }) });
      }

      function setLocation(i, patch) {
        var next = locationItems.map(function (row, idx) {
          return idx === i ? Object.assign({}, row, patch) : row;
        });
        props.setAttributes({ locationItems: next });
      }
      function addLocation() {
        props.setAttributes({ locationItems: locationItems.concat([{ label: 'NEW LOCATION', url: '#' }]) });
      }
      function removeLocation(i) {
        if (!window.confirm(__('Remove this location?', 'headless-core'))) return;
        props.setAttributes({ locationItems: locationItems.filter(function (_, idx) { return idx !== i; }) });
      }

      return el(
        'div',
        blockProps,
        el(
          InspectorControls,
          null,
          el(
            PanelBody,
            { title: __('Top bar colors', 'headless-core'), initialOpen: true },
            el(ToggleControl, {
              label: __('Enable top bar', 'headless-core'),
              checked: a.enabled !== false,
              onChange: function (v) {
                props.setAttributes({ enabled: Boolean(v) });
              },
            }),
            el(BaseControl, { label: __('Background', 'headless-core') }),
            el(ColorPalette, { value: a.bgColor, colors: palette(), onChange: function (c) { props.setAttributes({ bgColor: c || '#1BB5B5' }); } }),
            el(RangeControl, {
              label: __('Background opacity (%)', 'headless-core'),
              value: typeof a.bgOpacity === 'number' ? a.bgOpacity : 100,
              min: 0,
              max: 100,
              step: 1,
              onChange: function (v) { props.setAttributes({ bgOpacity: typeof v === 'number' ? v : 100 }); },
            }),
            el(BaseControl, { label: __('Text', 'headless-core') }),
            el(ColorPalette, { value: a.textColor, colors: palette(), onChange: function (c) { props.setAttributes({ textColor: c || '#ffffff' }); } }),
            el(BaseControl, { label: __('Hover', 'headless-core') }),
            el(ColorPalette, { value: a.hoverColor, colors: palette(), onChange: function (c) { props.setAttributes({ hoverColor: c || '#ee6e2a' }); } }),
            el(BaseControl, { label: __('Top bar menu link color', 'headless-core') }),
            el(ColorPalette, { value: a.menuLinkColor, colors: palette(), onChange: function (c) { props.setAttributes({ menuLinkColor: c || '#ffffff' }); } }),
            el(BaseControl, { label: __('Top bar menu link hover', 'headless-core') }),
            el(ColorPalette, { value: a.menuLinkHoverColor, colors: palette(), onChange: function (c) { props.setAttributes({ menuLinkHoverColor: c || '#ee6e2a' }); } }),
            el(TextControl, {
              label: __('Dropdown background color', 'headless-core'),
              value: a.dropdownBgColor || 'rgba(255,255,255,0.92)',
              onChange: function (v) { props.setAttributes({ dropdownBgColor: String(v || '').trim() || 'rgba(255,255,255,0.92)' }); },
              help: __('Use hex or rgba, e.g. rgba(255,255,255,0.92)', 'headless-core'),
            }),
            el(BaseControl, { label: __('Dropdown item text color', 'headless-core') }),
            el(ColorPalette, { value: a.dropdownItemColor, colors: palette(), onChange: function (c) { props.setAttributes({ dropdownItemColor: c || '#4b5563' }); } }),
            el(BaseControl, { label: __('Dropdown item hover color', 'headless-core') }),
            el(ColorPalette, { value: a.dropdownItemHoverColor, colors: palette(), onChange: function (c) { props.setAttributes({ dropdownItemHoverColor: c || '#ee6e2a' }); } }),
            el(RangeControl, {
              label: __('Font size (px)', 'headless-core'),
              value: typeof a.fontSize === 'number' ? a.fontSize : 10,
              min: 8,
              max: 18,
              step: 1,
              onChange: function (v) { props.setAttributes({ fontSize: typeof v === 'number' ? v : 10 }); },
            })
          )
        ),
        el(
          'div',
          { style: { padding: '12px', borderRadius: '10px', border: '1px solid #e5e7eb', background: a.bgColor || '#1BB5B5', color: a.textColor || '#fff', opacity: a.enabled === false ? 0.55 : ((typeof a.bgOpacity === 'number' ? a.bgOpacity : 100) / 100) } },
          el('div', { style: { display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between', fontWeight: 900, fontSize: String(typeof a.fontSize === 'number' ? a.fontSize : 10) + 'px' } },
            el('div', { style: { display: 'flex', gap: '8px', flexWrap: 'wrap' } },
              links.map(function (row, i) {
                return el('span', { key: 'hdr-link-prev-' + i, style: { textDecoration: 'underline' } }, row.label || '');
              })
            ),
            el('div', null, __('VISIT US: ', 'headless-core') + locationItems.map(function (x) { return x.label; }).filter(Boolean).join(' | ')),
            el('div', null, a.phoneText || '')
          )
        ),
        el(
          'div',
          { style: { marginTop: '12px', padding: '12px', borderRadius: '10px', border: '1px dashed #cbd5e1', background: '#fff' } },
          el('div', { style: { fontWeight: 800, marginBottom: '8px' } }, __('Edit top bar (inline)', 'headless-core')),
          el('p', { style: { fontWeight: 700, marginBottom: '6px' } }, __('Locations (label + URL)', 'headless-core')),
          locationItems.map(function (row, i) {
            return el(
              'div',
              { key: 'hdr-loc-' + i, style: { marginBottom: '10px', padding: '8px', border: '1px solid #e5e7eb', borderRadius: '6px' } },
              el(TextControl, { label: __('Label', 'headless-core'), value: row.label, onChange: function (v) { setLocation(i, { label: v }); } }),
              renderUrlField(__('URL', 'headless-core'), row, 'url', function (patch) { setLocation(i, patch); }),
              el(Button, { isDestructive: true, variant: 'secondary', onClick: function () { removeLocation(i); } }, __('Remove', 'headless-core'))
            );
          }),
          el(Button, { variant: 'primary', onClick: addLocation }, __('Add location', 'headless-core')),
          el('hr', { style: { margin: '12px 0' } }),
          el(TextControl, { label: __('Phone text', 'headless-core'), value: a.phoneText || '', onChange: function (v) { props.setAttributes({ phoneText: v }); } }),
          headlessLink.renderLinkControlAttribute
            ? headlessLink.renderLinkControlAttribute(el, blockEditor, components, i18n, __('Phone URL (optional)', 'headless-core'), a, 'phoneUrl', props.setAttributes)
            : el(TextControl, { label: __('Phone URL (optional)', 'headless-core'), value: a.phoneUrl || '', onChange: function (v) { props.setAttributes({ phoneUrl: v }); } }),
          el(TextControl, { label: __('Login label', 'headless-core'), value: a.loginLabel || '', onChange: function (v) { props.setAttributes({ loginLabel: v }); } }),
          headlessLink.renderLinkControlAttribute
            ? headlessLink.renderLinkControlAttribute(el, blockEditor, components, i18n, __('Login URL (optional)', 'headless-core'), a, 'loginUrl', props.setAttributes)
            : el(TextControl, { label: __('Login URL (optional)', 'headless-core'), value: a.loginUrl || '', onChange: function (v) { props.setAttributes({ loginUrl: v }); } }),
          el('hr', { style: { margin: '12px 0' } }),
          el('p', { style: { fontWeight: 700, marginBottom: '6px' } }, __('Left links (label + URL)', 'headless-core')),
          links.map(function (row, i) {
            return el(
              'div',
              { key: 'hdr-link-' + i, style: { marginBottom: '10px', padding: '8px', border: '1px solid #e5e7eb', borderRadius: '6px' } },
              el(TextControl, { label: __('Label', 'headless-core'), value: row.label, onChange: function (v) { setLink(i, { label: v }); } }),
              renderUrlField(__('URL', 'headless-core'), row, 'url', function (patch) { setLink(i, patch); }),
              el(Button, { isDestructive: true, variant: 'secondary', onClick: function () { removeLink(i); } }, __('Remove', 'headless-core'))
            );
          }),
          el(Button, { variant: 'primary', onClick: addLink }, __('Add link', 'headless-core'))
        )
      );
    },
    save: function () {
      return null;
    },
  });
})(window.wp.blocks, window.wp.blockEditor, window.wp.components, window.wp.element, window.wp.i18n);

