(function (blocks, blockEditor, components, element, i18n) {
  var el = element.createElement;
  var Fragment = element.Fragment;
  var registerBlockType = blocks.registerBlockType;
  var useBlockProps = blockEditor.useBlockProps;
  var RichText = blockEditor.RichText;
  var MediaUpload = blockEditor.MediaUpload;
  var MediaUploadCheck = blockEditor.MediaUploadCheck;
  var Button = components.Button;
  var TextControl = components.TextControl;
  var BaseControl = components.BaseControl;
  var ColorPalette = components.ColorPalette;
  var __ = i18n.__;

  var PALETTE = [
    '#22acb6',
    '#00AFBB',
    '#ee6e2a',
    '#eb651b',
    '#1e293b',
    '#334155',
    '#64748b',
    '#f8fafc',
    '#ffffff',
    '#F5F4EE',
    '#e2e8f0',
  ];

  var DEFAULT_ITEM = { title: '', fileId: 0, fileUrl: '' };

  var DEFAULT_ROWS = [
    {
      heading: 'Financial Reports',
      items: [
        { title: 'Annual Report 2024', fileId: 0, fileUrl: '' },
        { title: 'Quarterly Statement Q1', fileId: 0, fileUrl: '' },
      ],
    },
    {
      heading: 'Membership Forms',
      items: [
        { title: 'New Member Application', fileId: 0, fileUrl: '' },
        { title: 'Account Update Form', fileId: 0, fileUrl: '' },
      ],
    },
  ];

  function defaultItem() {
    return { title: '', fileId: 0, fileUrl: '' };
  }

  function normalizeItem(item) {
    var row = item && typeof item === 'object' ? item : {};
    return {
      title: String(row.title != null ? row.title : ''),
      fileId: row.fileId ? parseInt(row.fileId, 10) || 0 : 0,
      fileUrl: String(row.fileUrl != null ? row.fileUrl : ''),
    };
  }

  function normalizeItems(items) {
    var src = Array.isArray(items) ? items : [];
    if (!src.length) {
      return [defaultItem()];
    }
    return src.map(normalizeItem);
  }

  function normalizeRows(rows) {
    var src = Array.isArray(rows) && rows.length ? rows : DEFAULT_ROWS;
    return src.map(function (r) {
      return {
        heading: String(r && r.heading != null ? r.heading : ''),
        items: normalizeItems(r && r.items),
      };
    });
  }

  function patchRows(rows, index, patch) {
    var next = rows.slice();
    next[index] = Object.assign({}, next[index], patch);
    return next;
  }

  function patchItem(rows, rowIndex, itemIndex, patch) {
    var next = rows.slice();
    var row = Object.assign({}, next[rowIndex]);
    var items = normalizeItems(row.items).slice();
    items[itemIndex] = Object.assign({}, items[itemIndex], patch);
    row.items = items;
    next[rowIndex] = row;
    return next;
  }

  function addItem(rows, rowIndex) {
    var next = rows.slice();
    var row = Object.assign({}, next[rowIndex]);
    row.items = normalizeItems(row.items).concat([defaultItem()]);
    next[rowIndex] = row;
    return next;
  }

  function removeItem(rows, rowIndex, itemIndex) {
    var next = rows.slice();
    var row = Object.assign({}, next[rowIndex]);
    var items = normalizeItems(row.items).slice();
    if (items.length <= 1) {
      return rows;
    }
    items.splice(itemIndex, 1);
    row.items = items;
    next[rowIndex] = row;
    return next;
  }

  function moveItem(rows, rowIndex, itemIndex, dir) {
    var next = rows.slice();
    var row = Object.assign({}, next[rowIndex]);
    var items = normalizeItems(row.items).slice();
    var to = itemIndex + dir;
    if (to < 0 || to >= items.length) {
      return rows;
    }
    var tmp = items[itemIndex];
    items[itemIndex] = items[to];
    items[to] = tmp;
    row.items = items;
    next[rowIndex] = row;
    return next;
  }

  function moveRow(rows, rowIndex, dir) {
    var to = rowIndex + dir;
    if (to < 0 || to >= rows.length) {
      return rows;
    }
    var next = rows.slice();
    var tmp = next[rowIndex];
    next[rowIndex] = next[to];
    next[to] = tmp;
    return next;
  }

  function inlineColorField(label, value, fallback, onChange) {
    return el(
      'div',
      { style: { marginBottom: '10px' } },
      el(BaseControl, { label: label }),
      el(ColorPalette, {
        value: value || fallback,
        colors: PALETTE.map(function (hex) {
          return { color: hex, name: hex };
        }),
        onChange: function (c) {
          onChange(c || fallback);
        },
      })
    );
  }

  function renderPdfField(item, onChange) {
    var hasFile = !!(item.fileId || (item.fileUrl && String(item.fileUrl).trim()));
    return el(
      'div',
      { style: { marginTop: '8px' } },
      el('div', { style: { display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' } },
        el(MediaUploadCheck, null,
          el(MediaUpload, {
            allowedTypes: ['application/pdf'],
            value: item.fileId || 0,
            onSelect: function (media) {
              onChange({
                fileId: media && media.id ? media.id : 0,
                fileUrl: media && media.url ? media.url : '',
                title: item.title || (media && media.title ? String(media.title) : ''),
              });
            },
            render: function (obj) {
              return el(
                Button,
                { variant: 'secondary', onClick: obj.open, style: { height: '32px' } },
                item.fileId ? __('Replace PDF', 'headless-core') : __('Select PDF', 'headless-core')
              );
            },
          })
        ),
        item.fileId
          ? el(Button, {
            variant: 'tertiary',
            isDestructive: true,
            onClick: function () {
              onChange({ fileId: 0, fileUrl: '' });
            },
          }, __('Remove file', 'headless-core'))
          : null
      ),
      el(TextControl, {
        label: __('Or paste PDF URL', 'headless-core'),
        value: item.fileUrl || '',
        onChange: function (v) {
          onChange({ fileUrl: String(v || ''), fileId: 0 });
        },
        help: hasFile && item.fileUrl ? __('External URL in use.', 'headless-core') : '',
      }),
      item.fileUrl && !item.fileId
        ? el('p', { style: { margin: '4px 0 0', fontSize: '11px', color: '#64748b', wordBreak: 'break-all' } }, item.fileUrl)
        : null
    );
  }

  registerBlockType('custom/downloads-grid', {
    apiVersion: 3,
    title: __('Downloads Grid', 'headless-core'),
    icon: 'download',
    category: 'widgets',
    description: __('PDF download sections with repeatable items in a two-column grid. Edited inline in the canvas.', 'headless-core'),
    attributes: {
      sectionTitle: { type: 'string', default: 'Downloads' },
      sectionIntro: {
        type: 'string',
        default: 'Access our forms, reports, and policy documents below.',
      },
      downloadLabel: { type: 'string', default: 'Download PDF' },
      sectionBgColor: { type: 'string', default: '#f8fafc' },
      cardBgColor: { type: 'string', default: '#ffffff' },
      accentColor: { type: 'string', default: '#22acb6' },
      buttonHoverColor: { type: 'string', default: '#ee6e2a' },
      headingColor: { type: 'string', default: '#1e293b' },
      titleColor: { type: 'string', default: '#334155' },
      rows: { type: 'array', default: DEFAULT_ROWS },
    },
    edit: function (props) {
      var a = props.attributes;
      var rows = normalizeRows(a.rows);
      var blockProps = useBlockProps({
        className: 'headless-downloads-grid-block',
        style: {
          background: a.sectionBgColor || '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '20px',
        },
      });

      function setRows(next) {
        props.setAttributes({ rows: next });
      }

      return el(
        'div',
        blockProps,
        el(
          'div',
          {
            style: {
              marginBottom: '20px',
              padding: '14px',
              background: '#fff',
              border: '1px dashed #cbd5e1',
              borderRadius: '10px',
            },
          },
          el('strong', { style: { display: 'block', marginBottom: '10px' } }, __('Block styles (inline)', 'headless-core')),
          el(
            'div',
            { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px' } },
            inlineColorField(__('Section background', 'headless-core'), a.sectionBgColor, '#f8fafc', function (c) {
              props.setAttributes({ sectionBgColor: c });
            }),
            inlineColorField(__('Card background', 'headless-core'), a.cardBgColor, '#ffffff', function (c) {
              props.setAttributes({ cardBgColor: c });
            }),
            inlineColorField(__('Accent / button', 'headless-core'), a.accentColor, '#22acb6', function (c) {
              props.setAttributes({ accentColor: c });
            }),
            inlineColorField(__('Button hover', 'headless-core'), a.buttonHoverColor, '#ee6e2a', function (c) {
              props.setAttributes({ buttonHoverColor: c });
            }),
            inlineColorField(__('Row heading', 'headless-core'), a.headingColor, '#1e293b', function (c) {
              props.setAttributes({ headingColor: c });
            }),
            inlineColorField(__('Download title', 'headless-core'), a.titleColor, '#334155', function (c) {
              props.setAttributes({ titleColor: c });
            })
          ),
          el(TextControl, {
            label: __('Download button label', 'headless-core'),
            value: a.downloadLabel || 'Download PDF',
            onChange: function (v) {
              props.setAttributes({ downloadLabel: v || 'Download PDF' });
            },
            style: { marginTop: '8px' },
          })
        ),
        el(RichText, {
          tagName: 'h2',
          value: a.sectionTitle || '',
          onChange: function (v) {
            props.setAttributes({ sectionTitle: v });
          },
          allowedFormats: [],
          placeholder: __('Section title…', 'headless-core'),
          style: { margin: '0 0 8px', color: a.headingColor || '#1e293b', fontSize: '28px', fontWeight: '700' },
        }),
        el(RichText, {
          tagName: 'p',
          value: a.sectionIntro || '',
          onChange: function (v) {
            props.setAttributes({ sectionIntro: v });
          },
          allowedFormats: [],
          placeholder: __('Section intro…', 'headless-core'),
          style: { margin: '0 0 24px', color: '#64748b', maxWidth: '640px' },
        }),
        rows.map(function (row, rowIndex) {
          return el(
            'div',
            {
              key: 'row-' + rowIndex,
              style: {
                marginBottom: '20px',
                padding: '16px',
                background: a.cardBgColor || '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(15,23,42,0.06)',
              },
            },
            el(
              'div',
              {
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  marginBottom: '14px',
                  paddingBottom: '10px',
                  borderBottom: '2px solid ' + (a.accentColor || '#22acb6'),
                },
              },
              el(RichText, {
                tagName: 'h3',
                value: row.heading || '',
                onChange: function (v) {
                  setRows(patchRows(rows, rowIndex, { heading: v }));
                },
                allowedFormats: [],
                placeholder: __('Row heading…', 'headless-core'),
                style: {
                  margin: 0,
                  flex: '1 1 auto',
                  color: a.headingColor || '#1e293b',
                  fontSize: '20px',
                  fontWeight: '700',
                },
              }),
              el(
                'div',
                { style: { display: 'flex', gap: '4px', flexShrink: 0 } },
                rows.length > 1
                  ? el(Button, {
                    variant: 'tertiary',
                    isSmall: true,
                    label: __('Move section up', 'headless-core'),
                    disabled: rowIndex === 0,
                    onClick: function () {
                      setRows(moveRow(rows, rowIndex, -1));
                    },
                  }, '˄')
                  : null,
                rows.length > 1
                  ? el(Button, {
                    variant: 'tertiary',
                    isSmall: true,
                    label: __('Move section down', 'headless-core'),
                    disabled: rowIndex === rows.length - 1,
                    onClick: function () {
                      setRows(moveRow(rows, rowIndex, 1));
                    },
                  }, '˅')
                  : null,
                rows.length > 1
                  ? el(Button, {
                    variant: 'tertiary',
                    isDestructive: true,
                    isSmall: true,
                    onClick: function () {
                      var next = rows.slice();
                      next.splice(rowIndex, 1);
                      setRows(next);
                    },
                  }, __('Remove row', 'headless-core'))
                  : null
              )
            ),
            el(
              'div',
              { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' } },
              normalizeItems(row.items).map(function (item, itemIndex) {
                var rowItems = normalizeItems(row.items);
                return el(
                  'div',
                  {
                    key: 'item-' + rowIndex + '-' + itemIndex,
                    style: {
                      padding: '12px',
                      border: '1px dashed #cbd5e1',
                      borderRadius: '10px',
                      background: '#fafbfc',
                    },
                  },
                  el(
                    'div',
                    {
                      style: {
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '8px',
                        marginBottom: '8px',
                      },
                    },
                    el('span', {
                      style: {
                        fontSize: '11px',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                        color: a.accentColor || '#22acb6',
                      },
                    }, __('Download', 'headless-core') + ' ' + (itemIndex + 1)),
                    el(
                      'div',
                      { style: { display: 'flex', gap: '4px', alignItems: 'center' } },
                      rowItems.length > 1
                        ? el(Button, {
                          variant: 'tertiary',
                          isSmall: true,
                          label: __('Move up', 'headless-core'),
                          disabled: itemIndex === 0,
                          onClick: function () {
                            setRows(moveItem(rows, rowIndex, itemIndex, -1));
                          },
                        }, '˄')
                        : null,
                      rowItems.length > 1
                        ? el(Button, {
                          variant: 'tertiary',
                          isSmall: true,
                          label: __('Move down', 'headless-core'),
                          disabled: itemIndex === rowItems.length - 1,
                          onClick: function () {
                            setRows(moveItem(rows, rowIndex, itemIndex, 1));
                          },
                        }, '˅')
                        : null,
                      rowItems.length > 1
                        ? el(Button, {
                          variant: 'tertiary',
                          isDestructive: true,
                          isSmall: true,
                          label: __('Remove', 'headless-core'),
                          onClick: function () {
                            setRows(removeItem(rows, rowIndex, itemIndex));
                          },
                        }, __('Remove', 'headless-core'))
                        : null
                    )
                  ),
                  el(TextControl, {
                    label: __('Download name', 'headless-core'),
                    value: item.title || '',
                    onChange: function (v) {
                      setRows(patchItem(rows, rowIndex, itemIndex, { title: v }));
                    },
                  }),
                  renderPdfField(item, function (patch) {
                    setRows(patchItem(rows, rowIndex, itemIndex, patch));
                  })
                );
              })
            ),
            el(
              Button,
              {
                variant: 'secondary',
                onClick: function () {
                  setRows(addItem(rows, rowIndex));
                },
                style: { marginTop: '12px' },
              },
              __('Add download', 'headless-core')
            )
          );
        }),
        el(
          Button,
          {
            variant: 'primary',
            onClick: function () {
              setRows(rows.concat([{ heading: 'New section', items: [defaultItem()] }]));
            },
            style: { marginTop: '4px' },
          },
          __('Add section row', 'headless-core')
        ),
        el('p', { style: { marginTop: '14px', color: '#94a3b8', fontSize: '12px' } },
          __('Use ˄ / ˅ to reorder downloads or whole sections. The frontend shows downloads in this order (two per row).', 'headless-core')
        )
      );
    },
    save: function () {
      return null;
    },
  });
})(window.wp.blocks, window.wp.blockEditor, window.wp.components, window.wp.element, window.wp.i18n);
