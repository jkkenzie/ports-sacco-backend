(function (blocks, blockEditor, components, element, i18n) {
  var el = element.createElement;
  var registerBlockType = blocks.registerBlockType;
  var useBlockProps = blockEditor.useBlockProps;
  var InspectorControls = blockEditor.InspectorControls;
  var RichText = blockEditor.RichText;
  var MediaUpload = blockEditor.MediaUpload;
  var MediaUploadCheck = blockEditor.MediaUploadCheck;
  var PanelBody = components.PanelBody;
  var Button = components.Button;
  var BaseControl = components.BaseControl;
  var ColorPalette = components.ColorPalette;
  var TextControl = components.TextControl;
  var ToggleControl = components.ToggleControl;
  var __ = i18n.__;
  var trashSvg = el(
    'svg',
    { viewBox: '0 0 24 24', width: '16', height: '16', style: { display: 'block' }, fill: 'currentColor' },
    el('path', { d: 'M9 3h6l1 2h4v2H4V5h4l1-2zm0 6h2v12H9V9zm4 0h2v12h-2V9z' })
  );

  var DEFAULT_ITEMS = [
    { heading: 'Membership Form:', paragraph: 'Complete and submit the membership application form.', hasLink: true, linkText: '(click here)', linkUrl: '#' },
    { heading: 'ID or Passport:', paragraph: 'Attach a copy of your Kenyan National Identity Card or a valid Kenyan Passport.' },
    { heading: 'Passport Photo:', paragraph: 'Attach coloured passport size photograph.' },
    { heading: 'KRA PIN Certificate:', paragraph: 'Attach a copy of your KRA PIN Certificate.' },
  ];

  var DEFAULT_HEADERS = [
    'Membership Category',
    'Registration (KSH)',
    'Minimum Monthly Deposits Contribution (KSH)',
    'Share Capital',
  ];

  function normalizeItems(items) {
    if (!Array.isArray(items) || !items.length) {
      return DEFAULT_ITEMS.map(function (row) { return Object.assign({}, row); });
    }
    return items.map(function (row, i) {
      var d = DEFAULT_ITEMS[i] || { heading: '', paragraph: '', hasLink: false, linkText: '(click here)', linkUrl: '' };
      return {
        heading: String((row && row.heading) || d.heading || ''),
        paragraph: String((row && row.paragraph) || d.paragraph || ''),
        hasLink: Boolean((row && row.hasLink) || false),
        linkText: String((row && row.linkText) || d.linkText || '(click here)'),
        linkUrl: String((row && row.linkUrl) || d.linkUrl || ''),
      };
    });
  }

  function normalizeHeaders(h) {
    if (!Array.isArray(h) || h.length !== 4) {
      return DEFAULT_HEADERS.slice();
    }
    return h.map(function (x, i) { return String(x || DEFAULT_HEADERS[i] || ''); });
  }

  function normalizeRows(rows) {
    if (!Array.isArray(rows) || !rows.length) {
      return [['Individual', '500', '1,000', '40,000']];
    }
    return rows.map(function (row) {
      var cells = Array.isArray(row) ? row : (row && row.cells) || [];
      var out = [];
      for (var i = 0; i < 4; i++) {
        out.push(String(cells[i] != null ? cells[i] : ''));
      }
      return out;
    });
  }

  function moveRow(list, index, dir) {
    var to = index + dir;
    if (to < 0 || to >= list.length) return list;
    var next = list.slice();
    var tmp = next[index];
    next[index] = next[to];
    next[to] = tmp;
    return next;
  }

  registerBlockType('custom/membership-content', {
    apiVersion: 3,
    title: __('Membership Content', 'headless-core'),
    icon: 'groups',
    category: 'widgets',
    description: __('Membership section with intro, points, fees table, and CTA button.', 'headless-core'),
    attributes: {
      heading: { type: 'string', default: 'Individual Membership' },
      description: { type: 'string', default: 'To join the SACCO as an individual, one needs to:' },
      iconId: { type: 'number', default: 0 },
      iconUrl: { type: 'string', default: '' },
      headingColor: { type: 'string', default: '#22ABB5' },
      descriptionColor: { type: 'string', default: '#000000' },
      titleColor: { type: 'string', default: '#000000' },
      textColor: { type: 'string', default: '#000000' },
      iconBgColor: { type: 'string', default: '#ED6E2A' },
      backgroundColor: { type: 'string', default: '#ffffff' },
      tableHeaderBg: { type: 'string', default: '#e7f0f9' },
      tableCellBg: { type: 'string', default: '#f8f9fa' },
      tableHeaders: { type: 'array', default: DEFAULT_HEADERS },
      tableRows: {
        type: 'array',
        default: [['Individual', '500', '1,000', '40,000']],
      },
      buttonLabel: { type: 'string', default: 'JOIN US!' },
      buttonUrl: { type: 'string', default: '/contact-us' },
      buttonBgColor: { type: 'string', default: '#40C9BF' },
      buttonTextColor: { type: 'string', default: '#ffffff' },
      buttonHoverBgColor: { type: 'string', default: '#35b5ad' },
      items: { type: 'array', default: DEFAULT_ITEMS },
    },
    edit: function (props) {
      var blockProps = useBlockProps({ className: 'headless-membership-content-block' });
      var items = normalizeItems(props.attributes.items);
      var tableHeaders = normalizeHeaders(props.attributes.tableHeaders);
      var tableRows = normalizeRows(props.attributes.tableRows);
      var colorChoices = ['#22ABB5', '#ED6E2A', '#40C9BF', '#000000', '#FFFFFF', '#eef0f3', '#65605f', '#3b4e6b', '#e7f0f9', '#f8f9fa'];

      function setItem(index, patch) {
        var next = items.map(function (item, i) {
          if (i !== index) return item;
          return Object.assign({}, item || {}, patch);
        });
        props.setAttributes({ items: next });
      }

      function addItem() {
        props.setAttributes({ items: items.concat([{ heading: '', paragraph: '', hasLink: false, linkText: '(click here)', linkUrl: '' }]) });
      }

      function removeItem(index) {
        if (!window.confirm(__('Remove this point?', 'headless-core'))) return;
        var next = items.filter(function (_, i) { return i !== index; });
        props.setAttributes({ items: next.length ? next : normalizeItems([]) });
      }

      function setHeader(i, v) {
        var h = tableHeaders.slice();
        h[i] = v;
        props.setAttributes({ tableHeaders: h });
      }

      function setCell(ri, ci, v) {
        var rows = tableRows.map(function (r) { return r.slice(); });
        if (!rows[ri]) rows[ri] = ['', '', '', ''];
        rows[ri][ci] = v;
        props.setAttributes({ tableRows: rows });
      }

      function addTableRow() {
        props.setAttributes({ tableRows: tableRows.concat([['', '', '', '']]) });
      }

      function removeTableRow(ri) {
        var next = tableRows.filter(function (_, i) { return i !== ri; });
        props.setAttributes({ tableRows: next.length ? next : [['', '', '', '']] });
      }

      return el(
        'div',
        blockProps,
        el(
          InspectorControls,
          null,
          el(
            PanelBody,
            { title: __('Colors', 'headless-core'), initialOpen: false },
            el('div', null, el(BaseControl, { label: __('Background', 'headless-core') }), el(ColorPalette, {
              value: props.attributes.backgroundColor,
              colors: colorChoices.map(function (hex) { return { color: hex, name: hex }; }),
              onChange: function (c) { props.setAttributes({ backgroundColor: c || '#ffffff' }); },
            })),
            el('div', null, el(BaseControl, { label: __('Section heading', 'headless-core') }), el(ColorPalette, {
              value: props.attributes.headingColor,
              colors: colorChoices.map(function (hex) { return { color: hex, name: hex }; }),
              onChange: function (c) { props.setAttributes({ headingColor: c || '#22ABB5' }); },
            })),
            el('div', null, el(BaseControl, { label: __('Intro / body text', 'headless-core') }), el(ColorPalette, {
              value: props.attributes.descriptionColor,
              colors: colorChoices.map(function (hex) { return { color: hex, name: hex }; }),
              onChange: function (c) { props.setAttributes({ descriptionColor: c || '#000000' }); },
            })),
            el('div', null, el(BaseControl, { label: __('Point titles', 'headless-core') }), el(ColorPalette, {
              value: props.attributes.titleColor,
              colors: colorChoices.map(function (hex) { return { color: hex, name: hex }; }),
              onChange: function (c) { props.setAttributes({ titleColor: c || '#000000' }); },
            })),
            el('div', null, el(BaseControl, { label: __('Point paragraphs', 'headless-core') }), el(ColorPalette, {
              value: props.attributes.textColor,
              colors: colorChoices.map(function (hex) { return { color: hex, name: hex }; }),
              onChange: function (c) { props.setAttributes({ textColor: c || '#000000' }); },
            })),
            el('div', null, el(BaseControl, { label: __('Icon background', 'headless-core') }), el(ColorPalette, {
              value: props.attributes.iconBgColor,
              colors: colorChoices.map(function (hex) { return { color: hex, name: hex }; }),
              onChange: function (c) { props.setAttributes({ iconBgColor: c || '#ED6E2A' }); },
            })),
            el('div', null, el(BaseControl, { label: __('Table header bg', 'headless-core') }), el(ColorPalette, {
              value: props.attributes.tableHeaderBg,
              colors: colorChoices.map(function (hex) { return { color: hex, name: hex }; }),
              onChange: function (c) { props.setAttributes({ tableHeaderBg: c || '#e7f0f9' }); },
            })),
            el('div', null, el(BaseControl, { label: __('Table cell bg', 'headless-core') }), el(ColorPalette, {
              value: props.attributes.tableCellBg,
              colors: colorChoices.map(function (hex) { return { color: hex, name: hex }; }),
              onChange: function (c) { props.setAttributes({ tableCellBg: c || '#f8f9fa' }); },
            })),
            el('div', null, el(BaseControl, { label: __('Button background', 'headless-core') }), el(ColorPalette, {
              value: props.attributes.buttonBgColor,
              colors: colorChoices.map(function (hex) { return { color: hex, name: hex }; }),
              onChange: function (c) { props.setAttributes({ buttonBgColor: c || '#40C9BF' }); },
            })),
            el('div', null, el(BaseControl, { label: __('Button text', 'headless-core') }), el(ColorPalette, {
              value: props.attributes.buttonTextColor,
              colors: colorChoices.map(function (hex) { return { color: hex, name: hex }; }),
              onChange: function (c) { props.setAttributes({ buttonTextColor: c || '#ffffff' }); },
            })),
            el('div', null, el(BaseControl, { label: __('Button hover', 'headless-core') }), el(ColorPalette, {
              value: props.attributes.buttonHoverBgColor,
              colors: colorChoices.map(function (hex) { return { color: hex, name: hex }; }),
              onChange: function (c) { props.setAttributes({ buttonHoverBgColor: c || '#35b5ad' }); },
            })),
            el('div', { style: { marginTop: '10px' } },
              el('strong', null, __('Point link (click here)', 'headless-core'))
            ),
            el('div', null, el(BaseControl, { label: __('Link text color', 'headless-core') }), el(ColorPalette, {
              value: props.attributes.linkTextColor,
              colors: colorChoices.map(function (hex) { return { color: hex, name: hex }; }),
              onChange: function (c) { props.setAttributes({ linkTextColor: c || '#22ABB5' }); },
            })),
            el('div', null, el(BaseControl, { label: __('Link hover text color', 'headless-core') }), el(ColorPalette, {
              value: props.attributes.linkHoverTextColor,
              colors: colorChoices.map(function (hex) { return { color: hex, name: hex }; }),
              onChange: function (c) { props.setAttributes({ linkHoverTextColor: c || '#ED6E2A' }); },
            })),
            el('div', null, el(BaseControl, { label: __('Icon background', 'headless-core') }), el(ColorPalette, {
              value: props.attributes.linkIconBgColor,
              colors: colorChoices.map(function (hex) { return { color: hex, name: hex }; }),
              onChange: function (c) { props.setAttributes({ linkIconBgColor: c || '#22ABB5' }); },
            })),
            el('div', null, el(BaseControl, { label: __('Icon hover background', 'headless-core') }), el(ColorPalette, {
              value: props.attributes.linkIconHoverBgColor,
              colors: colorChoices.map(function (hex) { return { color: hex, name: hex }; }),
              onChange: function (c) { props.setAttributes({ linkIconHoverBgColor: c || '#ED6E2A' }); },
            }))
          )
        ),
        // Inline editor UI (in-canvas), so user can compare styling while editing.
        el(
          'div',
          { style: { padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px', background: props.attributes.backgroundColor || '#ffffff' } },
          el('div', { style: { maxWidth: '1100px', margin: '0 auto' } },
            el(RichText, {
              tagName: 'h2',
              value: props.attributes.heading || '',
              onChange: function (v) { props.setAttributes({ heading: v }); },
              placeholder: __('Section heading…', 'headless-core'),
              allowedFormats: [],
              style: { fontSize: '28px', fontWeight: 900, color: props.attributes.headingColor || '#22ABB5', marginBottom: '8px' },
            }),
            el(RichText, {
              tagName: 'p',
              value: props.attributes.description || '',
              onChange: function (v) { props.setAttributes({ description: v }); },
              placeholder: __('Intro under the heading…', 'headless-core'),
              allowedFormats: [],
              style: { color: props.attributes.descriptionColor || '#000000', marginBottom: '16px' },
            }),

            el('div', { style: { marginBottom: '16px' } },
              el('strong', null, __('Global icon (all points)', 'headless-core')),
              props.attributes.iconUrl
                ? el('div', { style: { marginTop: '8px' } }, el('img', { src: props.attributes.iconUrl, alt: '', style: { width: '44px', height: '44px', objectFit: 'contain', border: '1px solid #dcdcde', borderRadius: '6px' } }))
                : null,
              el('div', { style: { marginTop: '8px', display: 'flex', gap: '8px', alignItems: 'center' } },
                el(MediaUploadCheck, null,
                  el(MediaUpload, {
                    allowedTypes: ['image'],
                    value: props.attributes.iconId || 0,
                    onSelect: function (media) {
                      props.setAttributes({
                        iconId: media && media.id ? media.id : 0,
                        iconUrl: media && media.url ? media.url : '',
                      });
                    },
                    render: function (obj) {
                      return el(Button, { variant: 'secondary', onClick: obj.open }, props.attributes.iconId ? __('Replace Icon', 'headless-core') : __('Select Icon', 'headless-core'));
                    },
                  })
                ),
                props.attributes.iconId
                  ? el(Button, { variant: 'tertiary', isDestructive: true, onClick: function () { props.setAttributes({ iconId: 0, iconUrl: '' }); } }, trashSvg)
                  : null
              )
            ),

            el('hr', { style: { margin: '18px 0' } }),

            el('h3', { style: { margin: 0, marginBottom: '10px', fontSize: '16px' } }, __('Points', 'headless-core')),
            items.map(function (item, index) {
              return el(
                'div',
                { key: index, style: { padding: '12px', border: '1px solid #eee', borderRadius: '8px', marginBottom: '10px' } },
                el('div', { style: { display: 'flex', justifyContent: 'space-between', gap: '8px', alignItems: 'center', marginBottom: '8px' } },
                  el('strong', null, __('Point', 'headless-core') + ' ' + (index + 1)),
                  el('div', { style: { display: 'flex', gap: '6px' } },
                    el(Button, { variant: 'tertiary', isSmall: true, disabled: index === 0, onClick: function () { props.setAttributes({ items: moveRow(items, index, -1) }); } }, '˄'),
                    el(Button, { variant: 'tertiary', isSmall: true, disabled: index === items.length - 1, onClick: function () { props.setAttributes({ items: moveRow(items, index, 1) }); } }, '˅'),
                    el(Button, { variant: 'tertiary', isSmall: true, isDestructive: true, onClick: function () { removeItem(index); } }, trashSvg)
                  )
                ),
                el(RichText, {
                  tagName: 'p',
                  value: (item && item.heading) || '',
                  onChange: function (v) { setItem(index, { heading: v }); },
                  placeholder: __('Point title…', 'headless-core'),
                  allowedFormats: [],
                  style: { fontWeight: 800, marginBottom: '6px', color: props.attributes.titleColor || '#000000' },
                }),
                el(RichText, {
                  tagName: 'p',
                  value: (item && item.paragraph) || '',
                  onChange: function (v) { setItem(index, { paragraph: v }); },
                  placeholder: __('Point text…', 'headless-core'),
                  allowedFormats: [],
                  style: { color: props.attributes.textColor || '#000000' },
                })
                ,
                el('div', { style: { marginTop: '8px' } },
                  el(ToggleControl, {
                    label: __('Enable link', 'headless-core'),
                    checked: Boolean(item && item.hasLink),
                    onChange: function (v) { setItem(index, { hasLink: !!v }); },
                  }),
                  Boolean(item && item.hasLink)
                    ? el('div', { style: { marginTop: '8px', display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '8px' } },
                        el(TextControl, {
                          label: __('Link text', 'headless-core'),
                          value: (item && item.linkText) || '(click here)',
                          onChange: function (v) { setItem(index, { linkText: v }); },
                        }),
                        el(TextControl, {
                          label: __('Link URL', 'headless-core'),
                          value: (item && item.linkUrl) || '',
                          onChange: function (v) { setItem(index, { linkUrl: v }); },
                          help: __('Use /path, #section, or https://…', 'headless-core'),
                        })
                      )
                    : null
                )
              );
            }),
            el(Button, { variant: 'primary', onClick: addItem }, '+ ', __('Add Point', 'headless-core')),

            el('hr', { style: { margin: '18px 0' } }),

            el('h3', { style: { margin: 0, marginBottom: '10px', fontSize: '16px' } }, __('Table (4 columns)', 'headless-core')),
            el('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '8px' } },
              [0, 1, 2, 3].map(function (ci) {
                return el(TextControl, {
                  key: 'th-inline-' + ci,
                  label: __('Header', 'headless-core') + ' ' + (ci + 1),
                  value: tableHeaders[ci] || '',
                  onChange: function (v) { setHeader(ci, v); },
                });
              })
            ),
            tableRows.map(function (row, ri) {
              return el(
                'div',
                { key: 'row-inline-' + ri, style: { marginTop: '10px', padding: '10px', border: '1px dashed #ccc', borderRadius: '8px' } },
                el('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' } },
                  el('strong', null, __('Row', 'headless-core') + ' ' + (ri + 1)),
                  el(Button, { isDestructive: true, variant: 'tertiary', isSmall: true, onClick: function () { removeTableRow(ri); } }, __('Remove row', 'headless-core'))
                ),
                el('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '8px' } },
                  [0, 1, 2, 3].map(function (ci) {
                    return el(TextControl, {
                      key: 'cell-inline-' + ri + '-' + ci,
                      label: __('Cell', 'headless-core') + ' ' + (ci + 1),
                      value: row[ci] || '',
                      onChange: function (v) { setCell(ri, ci, v); },
                    });
                  })
                )
              );
            }),
            el(Button, { variant: 'secondary', onClick: addTableRow, style: { marginTop: '8px' } }, '+ ', __('Add row', 'headless-core')),

            el('hr', { style: { margin: '18px 0' } }),

            el('h3', { style: { margin: 0, marginBottom: '10px', fontSize: '16px' } }, __('Button', 'headless-core')),
            el(TextControl, {
              label: __('Label', 'headless-core'),
              value: props.attributes.buttonLabel,
              onChange: function (v) { props.setAttributes({ buttonLabel: v }); },
            }),
            el(TextControl, {
              label: __('URL', 'headless-core'),
              value: props.attributes.buttonUrl,
              onChange: function (v) { props.setAttributes({ buttonUrl: v }); },
              help: __('Use a path like /contact-us or #section', 'headless-core'),
            }),
            el('div', { style: { marginTop: '10px', display: 'flex', justifyContent: 'center' } },
              el('span', {
                style: {
                  display: 'inline-block',
                  padding: '10px 18px',
                  borderRadius: '8px',
                  background: props.attributes.buttonBgColor || '#40C9BF',
                  color: props.attributes.buttonTextColor || '#ffffff',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }
              }, props.attributes.buttonLabel || __('JOIN US!', 'headless-core'))
            )
          )
        ),
        el(
          'div',
          { style: { padding: '1rem', border: '1px dashed #ccc', borderRadius: '4px', background: props.attributes.backgroundColor || '#fff' } },
          el('strong', null, props.attributes.heading || __('Membership Content', 'headless-core')),
          el('p', { style: { marginTop: '8px', fontSize: '12px', color: '#555' } }, __('Rendered by React frontend.', 'headless-core'))
        )
      );
    },
    save: function () { return null; },
  });
})(window.wp.blocks, window.wp.blockEditor, window.wp.components, window.wp.element, window.wp.i18n);
