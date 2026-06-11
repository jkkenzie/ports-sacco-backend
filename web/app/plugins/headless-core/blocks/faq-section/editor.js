(function (blocks, blockEditor, components, element, i18n) {
  var el = element.createElement;
  var useEffect = element.useEffect;
  var registerBlockType = blocks.registerBlockType;
  var useBlockProps = blockEditor.useBlockProps;
  var RichText = blockEditor.RichText;
  var Button = components.Button;
  var BaseControl = components.BaseControl;
  var ColorPalette = components.ColorPalette;
  var __ = i18n.__;

  var ANSWER_FORMATS = ['core/bold', 'core/italic', 'core/link', 'core/list', 'core/indent'];

  function makeItemId() {
    return 'faq-' + Date.now() + '-' + Math.random().toString(36).slice(2, 9);
  }

  function preventRichTextSplit() {
    return false;
  }

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
    '#eef0f3',
    '#e2e8f0',
    '#e5e7eb',
    '#f9fafb',
    '#000000',
  ];

  var DEFAULT_ROWS = [
    {
      heading: 'General Questions',
      items: [
        {
          title: 'What is Ports SACCO?',
          content: '<p>Ports SACCO is a member-owned financial cooperative offering savings, loans, and other financial services.</p>',
        },
        {
          title: 'How do I become a member?',
          content: '<p>Visit our membership page or any branch with your ID and completed application form to join.</p>',
        },
      ],
    },
    {
      heading: 'Loans & Savings',
      items: [
        {
          title: 'What loan products do you offer?',
          content: '<p>We offer personal loans, asset finance, school fees loans, emergency loans, and more.</p>',
        },
        {
          title: 'What savings accounts are available?',
          content: '<p>Choose from fixed deposit, joint, children\'s, and ordinary savings accounts.</p>',
        },
      ],
    },
  ];

  function defaultItem() {
    return { id: makeItemId(), title: '', content: '' };
  }

  function normalizeItem(item, rowIndex, itemIndex) {
    var row = item && typeof item === 'object' ? item : {};
    var id = row.id ? String(row.id) : ('faq-pending-' + rowIndex + '-' + itemIndex);
    return {
      id: id,
      title: String(row.title != null ? row.title : ''),
      content: String(row.content != null ? row.content : ''),
    };
  }

  function normalizeItems(items, rowIndex) {
    var src = Array.isArray(items) ? items : [];
    if (!src.length) {
      return [defaultItem()];
    }
    return src.map(function (item, itemIndex) {
      return normalizeItem(item, rowIndex, itemIndex);
    });
  }

  function normalizeRows(rows) {
    var src = Array.isArray(rows) && rows.length ? rows : DEFAULT_ROWS;
    return src.map(function (r, rowIndex) {
      return {
        heading: String(r && r.heading != null ? r.heading : ''),
        items: normalizeItems(r && r.items, rowIndex),
      };
    });
  }

  function ensureRowIds(rows) {
    var changed = false;
    var next = rows.map(function (row, rowIndex) {
      var items = normalizeItems(row.items, rowIndex).map(function (item) {
        if (item.id && item.id.indexOf('faq-pending-') !== 0) {
          return item;
        }
        changed = true;
        return Object.assign({}, item, { id: makeItemId() });
      });
      return Object.assign({}, row, { items: items });
    });
    return { rows: next, changed: changed };
  }

  function patchRows(rows, index, patch) {
    var next = rows.slice();
    next[index] = Object.assign({}, next[index], patch);
    return next;
  }

  function patchItem(rows, rowIndex, itemIndex, patch) {
    var next = rows.slice();
    var row = Object.assign({}, next[rowIndex]);
    var items = normalizeItems(row.items, rowIndex).slice();
    items[itemIndex] = Object.assign({}, items[itemIndex], patch);
    row.items = items;
    next[rowIndex] = row;
    return next;
  }

  function addItem(rows, rowIndex) {
    var next = rows.slice();
    var row = Object.assign({}, next[rowIndex]);
    row.items = normalizeItems(row.items, rowIndex).concat([defaultItem()]);
    next[rowIndex] = row;
    return next;
  }

  function removeItem(rows, rowIndex, itemIndex) {
    var next = rows.slice();
    var row = Object.assign({}, next[rowIndex]);
    var items = normalizeItems(row.items, rowIndex).slice();
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
    var items = normalizeItems(row.items, rowIndex).slice();
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

  registerBlockType('custom/faq-section', {
    apiVersion: 3,
    title: __('FAQ Section', 'headless-core'),
    icon: 'editor-help',
    category: 'widgets',
    description: __('Grouped FAQ sections with inline editing, reordering, and color controls.', 'headless-core'),
    attributes: {
      sectionTitle: { type: 'string', default: 'Frequently Asked Questions' },
      sectionIntro: {
        type: 'string',
        default: 'Find answers to common questions about our products and services.',
      },
      sectionBgColor: { type: 'string', default: '#f8fafc' },
      cardBgColor: { type: 'string', default: '#ffffff' },
      accentColor: { type: 'string', default: '#22acb6' },
      groupHeadingColor: { type: 'string', default: '#1e293b' },
      questionColor: { type: 'string', default: '#1e293b' },
      answerColor: { type: 'string', default: '#475569' },
      borderColor: { type: 'string', default: '#e2e8f0' },
      hoverBgColor: { type: 'string', default: '#f8fafc' },
      iconColor: { type: 'string', default: '#22acb6' },
      rows: { type: 'array', default: DEFAULT_ROWS },
    },
    edit: function (props) {
      var a = props.attributes;
      var rows = normalizeRows(a.rows);

      useEffect(function () {
        var rowsIn = Array.isArray(props.attributes.rows) ? props.attributes.rows : [];
        if (!rowsIn.length) {
          return;
        }
        var normalized = normalizeRows(rowsIn);
        var idResult = ensureRowIds(normalized);
        if (idResult.changed) {
          props.setAttributes({ rows: idResult.rows });
        }
      }, []);

      var blockProps = useBlockProps({
        className: 'headless-faq-section-block',
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
            { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '8px' } },
            inlineColorField(__('Section background', 'headless-core'), a.sectionBgColor, '#f8fafc', function (c) {
              props.setAttributes({ sectionBgColor: c });
            }),
            inlineColorField(__('Card background', 'headless-core'), a.cardBgColor, '#ffffff', function (c) {
              props.setAttributes({ cardBgColor: c });
            }),
            inlineColorField(__('Accent', 'headless-core'), a.accentColor, '#22acb6', function (c) {
              props.setAttributes({ accentColor: c });
            }),
            inlineColorField(__('Group heading', 'headless-core'), a.groupHeadingColor, '#1e293b', function (c) {
              props.setAttributes({ groupHeadingColor: c });
            }),
            inlineColorField(__('Question', 'headless-core'), a.questionColor, '#1e293b', function (c) {
              props.setAttributes({ questionColor: c });
            }),
            inlineColorField(__('Answer', 'headless-core'), a.answerColor, '#475569', function (c) {
              props.setAttributes({ answerColor: c });
            }),
            inlineColorField(__('Border', 'headless-core'), a.borderColor, '#e2e8f0', function (c) {
              props.setAttributes({ borderColor: c });
            }),
            inlineColorField(__('Row hover', 'headless-core'), a.hoverBgColor, '#f8fafc', function (c) {
              props.setAttributes({ hoverBgColor: c });
            }),
            inlineColorField(__('Icon', 'headless-core'), a.iconColor, '#22acb6', function (c) {
              props.setAttributes({ iconColor: c });
            })
          )
        ),
        el(RichText, {
          tagName: 'h2',
          value: a.sectionTitle || '',
          onChange: function (v) {
            props.setAttributes({ sectionTitle: v });
          },
          allowedFormats: [],
          placeholder: __('Section title…', 'headless-core'),
          style: { margin: '0 0 8px', color: a.groupHeadingColor || '#1e293b', fontSize: '28px', fontWeight: '700' },
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
              key: 'faq-row-' + rowIndex,
              style: {
                marginBottom: '20px',
                padding: '16px',
                background: a.cardBgColor || '#fff',
                border: '1px solid ' + (a.borderColor || '#e2e8f0'),
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
                placeholder: __('FAQ group heading…', 'headless-core'),
                style: {
                  margin: 0,
                  flex: '1 1 auto',
                  color: a.groupHeadingColor || '#1e293b',
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
                    label: __('Move group up', 'headless-core'),
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
                    label: __('Move group down', 'headless-core'),
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
                  }, __('Remove group', 'headless-core'))
                  : null
              )
            ),
            normalizeItems(row.items, rowIndex).map(function (item, itemIndex) {
              var rowItems = normalizeItems(row.items, rowIndex);
              var itemId = item.id || ('faq-pending-' + rowIndex + '-' + itemIndex);
              return el(
                'div',
                {
                  key: itemId,
                  style: {
                    marginBottom: itemIndex < rowItems.length - 1 ? '12px' : 0,
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
                  }, __('FAQ', 'headless-core') + ' ' + (itemIndex + 1)),
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
                el(RichText, {
                  identifier: 'faq-title-' + itemId,
                  tagName: 'h4',
                  value: item.title || '',
                  onChange: function (v) {
                    setRows(patchItem(rows, rowIndex, itemIndex, { title: v }));
                  },
                  allowedFormats: [],
                  placeholder: __('Question title…', 'headless-core'),
                  __unstableOnSplitAtEnd: preventRichTextSplit,
                  __unstableOnSplitAtDoubleLineEnd: preventRichTextSplit,
                  style: { margin: '0 0 8px', color: a.questionColor || '#1e293b', fontSize: '16px', fontWeight: '600' },
                }),
                el('p', {
                  style: { margin: '0 0 6px', fontSize: '11px', color: '#64748b' },
                }, __('Answer (use toolbar for bullets, bold, links)', 'headless-core')),
                el(RichText, {
                  identifier: 'faq-content-' + itemId,
                  tagName: 'div',
                  multiline: 'p',
                  value: item.content || '',
                  onChange: function (v) {
                    setRows(patchItem(rows, rowIndex, itemIndex, { content: v }));
                  },
                  allowedFormats: ANSWER_FORMATS,
                  placeholder: __('Answer paragraph…', 'headless-core'),
                  __unstableOnSplitAtEnd: preventRichTextSplit,
                  __unstableOnSplitAtDoubleLineEnd: preventRichTextSplit,
                  style: {
                    margin: 0,
                    color: a.answerColor || '#475569',
                    fontSize: '14px',
                    lineHeight: '1.6',
                    minHeight: '48px',
                    padding: '8px 10px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    background: '#fff',
                  },
                })
              );
            }),
            el(
              Button,
              {
                variant: 'secondary',
                onClick: function () {
                  setRows(addItem(rows, rowIndex));
                },
                style: { marginTop: '12px' },
              },
              __('Add FAQ', 'headless-core')
            )
          );
        }),
        el(
          Button,
          {
            variant: 'primary',
            onClick: function () {
              setRows(rows.concat([{ heading: 'New FAQ group', items: [defaultItem()] }]));
            },
            style: { marginTop: '4px' },
          },
          __('Add FAQ group', 'headless-core')
        ),
        el('p', { style: { marginTop: '14px', color: '#94a3b8', fontSize: '12px' } },
          __('Use ˄ / ˅ to reorder FAQ groups or individual questions. Rendered as accordions on the React frontend.', 'headless-core')
        )
      );
    },
    save: function () {
      return null;
    },
  });
})(window.wp.blocks, window.wp.blockEditor, window.wp.components, window.wp.element, window.wp.i18n);
