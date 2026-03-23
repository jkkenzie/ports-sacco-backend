(function (blocks, blockEditor, components, element, i18n) {
  var el = element.createElement;
  var registerBlockType = blocks.registerBlockType;
  var useBlockProps = blockEditor.useBlockProps;
  var RichText = blockEditor.RichText;
  var MediaUpload = blockEditor.MediaUpload;
  var MediaUploadCheck = blockEditor.MediaUploadCheck;
  var Button = components.Button;
  var __ = i18n.__;
  var useState = element.useState;

  var DEFAULT_VALUES = [
    { title: 'Caring', description: 'We are truthful, we listen and go extra mile-above and beyond.' },
    { title: 'Equity', description: 'We are committed to inclusivity, equality, fairness, public good and social justice.' },
    { title: 'Consistency', description: 'We are predictable, dependable, and reliable.' },
  ];

  function cloneValues(list) {
    return list.map(function (row) {
      return { title: String(row.title || ''), description: String(row.description || '') };
    });
  }

  function defaultItem(title, description, values) {
    return {
      title: title,
      description: description,
      iconId: 0,
      iconUrl: '',
      values: cloneValues(Array.isArray(values) ? values : []),
    };
  }

  var DEFAULT_ITEMS = [
    defaultItem('Our Vision', 'To be a formidable financial institution by providing competitive financial solutions to a happy, healthy and prosperous people.', []),
    defaultItem('Our Mission', 'To strengthen the socio-economic well-being of our customers through prudent management and innovative products and services.', []),
    defaultItem('Our Purpose', 'Uplifting People. Inspiring happiness, optimism and hope.', []),
    defaultItem('Our Core Values', '', DEFAULT_VALUES),
  ];

  function normalizeValues(values) {
    if (!Array.isArray(values) || !values.length) {
      return [];
    }
    return values.map(function (value) {
      return {
        title: String((value && value.title) || ''),
        description: String((value && value.description) || ''),
      };
    });
  }

  function normalizeItems(items) {
    if (!Array.isArray(items) || !items.length) {
      return DEFAULT_ITEMS.map(function (row) {
        return Object.assign({}, row, { values: cloneValues(row.values) });
      });
    }
    var count = Math.max(DEFAULT_ITEMS.length, items.length);
    var out = [];
    for (var i = 0; i < count; i++) {
      var d = DEFAULT_ITEMS[i] || defaultItem('', '');
      var item = items[i] && typeof items[i] === 'object' ? items[i] : {};
      var values = normalizeValues(item.values);
      out.push({
        title: String(item.title || d.title || ''),
        description: String(item.description || d.description || ''),
        iconId: Number(item.iconId || d.iconId || 0),
        iconUrl: String(item.iconUrl || ''),
        values: values.length ? values : cloneValues(d.values || DEFAULT_VALUES),
      });
    }
    return out;
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

  function imageChooser(imageId, imageUrl, onSelect, onRemove) {
    return el(
      'div',
      { style: { marginBottom: '10px' } },
      imageUrl
        ? el('img', {
            src: imageUrl,
            alt: '',
            style: {
              width: '44px',
              height: '44px',
              objectFit: 'cover',
              borderRadius: '4px',
              border: '1px solid #dcdcde',
              marginBottom: '8px',
              display: 'block',
            },
          })
        : null,
      el(
        MediaUploadCheck,
        null,
        el(MediaUpload, {
          allowedTypes: ['image'],
          value: imageId,
          onSelect: onSelect,
          render: function (obj) {
            return el(
              'div',
              { style: { display: 'flex', alignItems: 'center', gap: '6px' } },
              el(Button, { variant: 'secondary', onClick: obj.open }, imageId ? __('Replace Image/Icon', 'headless-core') : __('Select Image/Icon', 'headless-core')),
              imageId
                ? el(
                    Button,
                    {
                      label: __('Remove image/icon', 'headless-core'),
                      onClick: function () {
                        if (! window.confirm(__('Remove this icon?', 'headless-core'))) {
                          return;
                        }
                        onRemove();
                      },
                      isDestructive: true,
                      isSmall: true,
                      variant: 'tertiary',
                      showTooltip: true,
                      tooltipPosition: 'top center',
                    },
                    '-'
                  )
                : null
            );
          },
        })
      )
    );
  }

  var trashSvg = el(
    'svg',
    { viewBox: '0 0 24 24', width: '16', height: '16', style: { display: 'block' }, fill: 'currentColor' },
    el('path', { d: 'M9 3h6l1 2h4v2H4V5h4l1-2zm0 6h2v12H9V9zm4 0h2v12h-2V9z' })
  );

  function ActionButton(props) {
    return el(
      Button,
      {
        label: props.label,
        onClick: props.onClick,
        disabled: !!props.disabled,
        isDestructive: !!props.isDestructive,
        isSmall: true,
        variant: 'tertiary',
        showTooltip: true,
        tooltipPosition: 'top center',
      },
      props.icon ? props.icon : props.symbol
    );
  }

  registerBlockType('custom/mission-vision', {
    apiVersion: 3,
    title: __('Mission, Vision & Values', 'headless-core'),
    icon: 'grid-view',
    category: 'widgets',
    description: __('Editable repeater block with nested values per item.', 'headless-core'),
    attributes: {
      items: { type: 'array', default: DEFAULT_ITEMS },
      values: { type: 'array', default: [] }, // legacy compatibility
      coreValuesTitle: { type: 'string', default: 'Our Core Values' }, // legacy compatibility
      coreValuesImageId: { type: 'number', default: 0 }, // legacy compatibility
    },
    edit: function (props) {
      var attributes = props.attributes;
      var setAttributes = props.setAttributes;
      var blockProps = useBlockProps({ className: 'headless-mission-vision-editor' });
      var items = normalizeItems(attributes.items);
      var _useState = useState({});
      var openValues = _useState[0];
      var setOpenValues = _useState[1];

      var topLegacy = (!Array.isArray(attributes.items) || attributes.items.length === 0) &&
        (attributes.visionTitle || attributes.missionTitle || attributes.purposeTitle);
      if (topLegacy) {
        var legacyRows = normalizeValues(attributes.values).length
          ? normalizeValues(attributes.values)
          : normalizeValues(attributes.coreValues && attributes.coreValues.map(function (r) {
              return { title: r && r.label ? r.label : '', description: r && r.text ? r.text : '' };
            }));
        var seeded = [
          defaultItem(String(attributes.visionTitle || 'Our Vision'), String(attributes.visionText || '')),
          defaultItem(String(attributes.missionTitle || 'Our Mission'), String(attributes.missionText || '')),
          defaultItem(String(attributes.purposeTitle || 'Our Purpose'), String(attributes.purposeText || '')),
          defaultItem('Our Core Values', ''),
        ].map(function (row, idx) {
          row.iconId = Number([attributes.visionImageId, attributes.missionImageId, attributes.purposeImageId][idx] || 0);
          row.values = legacyRows.length ? cloneValues(legacyRows) : cloneValues(DEFAULT_VALUES);
          return row;
        });
        setAttributes({ items: seeded });
        items = normalizeItems(seeded);
      } else if (Array.isArray(attributes.values) && attributes.values.length) {
        // One-time migration: copy legacy top-level values into all items.
        var copied = cloneValues(attributes.values);
        var nextItems = items.map(function (row) {
          return Object.assign({}, row, {
            values: row.values && row.values.length ? row.values : cloneValues(copied),
          });
        });
        setAttributes({ items: nextItems, values: [] });
        items = normalizeItems(nextItems);
      }

      function patchItem(index, patch) {
        var next = items.slice();
        next[index] = Object.assign({}, next[index], patch);
        setAttributes({ items: next });
      }

      function patchValues(itemIndex, values) {
        var next = items.slice();
        next[itemIndex] = Object.assign({}, next[itemIndex], { values: values });
        setAttributes({ items: next });
      }

      function addItem() {
        var next = items.concat([defaultItem('', '')]);
        setAttributes({ items: next });
      }

      function removeItem(index) {
        if (! window.confirm(__('Remove this item?', 'headless-core'))) {
          return;
        }
        var next = items.filter(function (_, i) {
          return i !== index;
        });
        setAttributes({
          items: next.length ? next : DEFAULT_ITEMS.map(function (row) { return Object.assign({}, row, { values: cloneValues(row.values) }); }),
        });
      }

      function toggleValues(index) {
        var next = Object.assign({}, openValues);
        next[index] = !next[index];
        setOpenValues(next);
      }

      return el(
        'div',
        blockProps,
        el('h3', null, __('Mission / Vision / Purpose', 'headless-core')),
        el(
          'div',
          { style: { display: 'grid', gap: '12px', marginBottom: '16px' } },
          items.map(function (item, index) {
            var label = item.title && item.title.trim() ? item.title : __('Item', 'headless-core') + ' ' + (index + 1);
            var itemValues = normalizeValues(item.values);
            var valuesOpen = !!openValues[index];
            return el(
              'div',
              {
                key: 'item-' + index,
                style: { border: '1px solid #ddd', borderRadius: '6px', padding: '10px', background: '#fff' },
              },
              el(
                'div',
                { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', marginBottom: '10px' } },
                el('strong', null, label),
                el(
                  'div',
                  { style: { display: 'flex', alignItems: 'center', gap: '2px' } },
                  el(ActionButton, {
                    symbol: '˄',
                    label: __('Move up', 'headless-core'),
                    onClick: function () {
                      setAttributes({ items: moveRow(items, index, -1) });
                    },
                    disabled: index === 0,
                  }),
                  el(ActionButton, {
                    symbol: '˅',
                    label: __('Move down', 'headless-core'),
                    onClick: function () {
                      setAttributes({ items: moveRow(items, index, 1) });
                    },
                    disabled: index === items.length - 1,
                  }),
                  el(ActionButton, {
                    icon: trashSvg,
                    label: __('Remove item', 'headless-core'),
                    onClick: function () {
                      removeItem(index);
                    },
                    isDestructive: true,
                  })
                )
              ),
              imageChooser(
                item.iconId,
                item.iconUrl || '',
                function (media) {
                  patchItem(index, {
                    iconId: media && media.id ? media.id : 0,
                    iconUrl: media && media.url ? media.url : '',
                  });
                },
                function () {
                  patchItem(index, { iconId: 0, iconUrl: '' });
                }
              ),
              el(RichText, {
                tagName: 'h4',
                value: item.title,
                onChange: function (v) {
                  patchItem(index, { title: v });
                },
                placeholder: __('Enter title...', 'headless-core'),
                allowedFormats: [],
              }),
              el(RichText, {
                tagName: 'p',
                value: item.description,
                onChange: function (v) {
                  patchItem(index, { description: v });
                },
                placeholder: __('Enter description...', 'headless-core'),
              }),
              el(
                'div',
                { style: { marginTop: '10px', borderTop: '1px solid #eee', paddingTop: '8px' } },
                el(
                  'div',
                  { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
                  el('strong', null, __('Values', 'headless-core')),
                  el(
                    ActionButton,
                    {
                      symbol: valuesOpen ? '-' : '+',
                      label: valuesOpen ? __('Collapse values', 'headless-core') : __('Expand values', 'headless-core'),
                      onClick: function () {
                        toggleValues(index);
                      },
                    }
                  )
                ),
                valuesOpen
                  ? el(
                      'div',
                      { style: { marginTop: '8px', display: 'grid', gap: '8px' } },
                      itemValues.map(function (row, valueIndex) {
                        return el(
                          'div',
                          { key: 'value-' + index + '-' + valueIndex, style: { border: '1px solid #eee', borderRadius: '4px', padding: '8px' } },
                          el(
                            'div',
                            { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
                            el('strong', null, row.title || __('Value', 'headless-core') + ' ' + (valueIndex + 1)),
                            el(
                              'div',
                              { style: { display: 'flex', gap: '2px' } },
                              el(ActionButton, {
                                symbol: '˄',
                                label: __('Move value up', 'headless-core'),
                                onClick: function () {
                                  patchValues(index, moveRow(itemValues, valueIndex, -1));
                                },
                                disabled: valueIndex === 0,
                              }),
                              el(ActionButton, {
                                symbol: '˅',
                                label: __('Move value down', 'headless-core'),
                                onClick: function () {
                                  patchValues(index, moveRow(itemValues, valueIndex, 1));
                                },
                                disabled: valueIndex === itemValues.length - 1,
                              }),
                              el(ActionButton, {
                                icon: trashSvg,
                                label: __('Remove value', 'headless-core'),
                                onClick: function () {
                                  if (! window.confirm(__('Remove this value?', 'headless-core'))) {
                                    return;
                                  }
                                  var next = itemValues.filter(function (_, i) { return i !== valueIndex; });
                                  patchValues(index, next);
                                },
                                isDestructive: true,
                              })
                            )
                          ),
                          el(RichText, {
                            tagName: 'h5',
                            value: row.title,
                            onChange: function (v) {
                              var next = itemValues.slice();
                              next[valueIndex] = Object.assign({}, next[valueIndex], { title: v });
                              patchValues(index, next);
                            },
                            placeholder: __('Enter title...', 'headless-core'),
                            allowedFormats: [],
                          }),
                          el(RichText, {
                            tagName: 'p',
                            value: row.description,
                            onChange: function (v) {
                              var next = itemValues.slice();
                              next[valueIndex] = Object.assign({}, next[valueIndex], { description: v });
                              patchValues(index, next);
                            },
                            placeholder: __('Enter description...', 'headless-core'),
                          })
                        );
                      }),
                      el(
                        Button,
                        {
                          variant: 'primary',
                          onClick: function () {
                            patchValues(index, itemValues.concat([{ title: '', description: '' }]));
                          },
                        },
                        '+ ',
                        __('Add Value', 'headless-core')
                      )
                    )
                  : null
              )
            );
          })
        ),
        el(
          Button,
          { variant: 'primary', onClick: addItem, style: { marginBottom: '12px' } },
          '+ ',
          __('Add Item', 'headless-core')
        )
      );
    },
    save: function () {
      return null;
    },
  });
})(window.wp.blocks, window.wp.blockEditor, window.wp.components, window.wp.element, window.wp.i18n);
