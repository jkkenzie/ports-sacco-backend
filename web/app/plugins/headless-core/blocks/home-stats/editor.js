(function (blocks, blockEditor, components, element, i18n) {
  var el = element.createElement;
  var Fragment = element.Fragment;
  var registerBlockType = blocks.registerBlockType;
  var useBlockProps = blockEditor.useBlockProps;
  var InspectorControls = blockEditor.InspectorControls;
  var RichText = blockEditor.RichText;
  var MediaUpload = blockEditor.MediaUpload;
  var MediaUploadCheck = blockEditor.MediaUploadCheck;
  var PanelBody = components.PanelBody;
  var Button = components.Button;
  var TextControl = components.TextControl;
  var BaseControl = components.BaseControl;
  var ColorPalette = components.ColorPalette;
  var ToggleControl = components.ToggleControl;
  var RangeControl = components.RangeControl || components.__experimentalRangeControl;
  var __ = i18n.__;

  var trashSvg = el(
    'svg',
    { viewBox: '0 0 24 24', width: '16', height: '16', style: { display: 'block' }, fill: 'currentColor' },
    el('path', { d: 'M9 3h6l1 2h4v2H4V5h4l1-2zm0 6h2v12H9V9zm4 0h2v12h-2V9z' })
  );

  var DEFAULT_ITEMS = [
    {
      valueStart: 0,
      valueEnd: 15,
      showPlus: false,
      title: 'AWARDS IN 2025',
      subtitle: 'We are leading by example',
      iconId: 0,
      iconUrl: '',
    },
    {
      valueStart: 0,
      valueEnd: 26,
      showPlus: false,
      title: 'PRODUCTS OFFERED',
      subtitle: 'Products that fit your needs',
      iconId: 0,
      iconUrl: '',
    },
    {
      valueStart: 0,
      valueEnd: 10000,
      showPlus: true,
      title: 'REGISTERED MEMBERS',
      subtitle: 'A growing membership base.',
      iconId: 0,
      iconUrl: '',
    },
  ];

  var palette = ['#22acb6', '#ffffff', '#EE6E2A', '#40C9BF', '#000000', '#1F2937'];

  function normalizeItems(items) {
    if (!Array.isArray(items) || !items.length) {
      return DEFAULT_ITEMS.map(function (row) {
        return Object.assign({}, row);
      });
    }
    return items.map(function (row, i) {
      var d = DEFAULT_ITEMS[i] || {
        valueStart: 0,
        valueEnd: 0,
        showPlus: false,
        title: '',
        subtitle: '',
        iconId: 0,
        iconUrl: '',
      };
      return {
        valueStart: parseInt((row && row.valueStart) || d.valueStart, 10) || 0,
        valueEnd: parseInt((row && row.valueEnd) || d.valueEnd, 10) || 0,
        showPlus: Boolean((row && row.showPlus) || false),
        title: String((row && row.title) || d.title || ''),
        subtitle: String((row && row.subtitle) || d.subtitle || ''),
        iconId: Number((row && row.iconId) || 0) || 0,
        iconUrl: String((row && row.iconUrl) || ''),
      };
    });
  }

  function moveRow(list, index, dir) {
    var to = index + dir;
    if (to < 0 || to >= list.length) {
      return list;
    }
    var next = list.slice();
    var tmp = next[index];
    next[index] = next[to];
    next[to] = tmp;
    return next;
  }

  registerBlockType('custom/home-stats', {
    apiVersion: 3,
    title: __('Home stats', 'headless-core'),
    icon: 'chart-area',
    category: 'widgets',
    description: __('Stats row with animated counters (in-view) and optional icons.', 'headless-core'),
    keywords: ['stats', 'numbers', 'counter', 'home', 'metrics'],
    supports: { anchor: true },
    attributes: {
      sectionId: { type: 'string', default: 'stats' },
      animationDurationSec: { type: 'number', default: 2.5 },
      sectionBg: { type: 'string', default: '#22acb6' },
      numberColor: { type: 'string', default: '#ffffff' },
      titleColor: { type: 'string', default: '#ffffff' },
      subtitleColor: { type: 'string', default: '#ffffff' },
      iconColor: { type: 'string', default: '#ffffff' },
      iconWidth: { type: 'number', default: 107 },
      iconHeight: { type: 'number', default: 58 },
      items: { type: 'array', default: DEFAULT_ITEMS },
    },
    edit: function (props) {
      var blockProps = useBlockProps({ className: 'headless-home-stats-editor' });
      var a = props.attributes;
      var items = normalizeItems(a.items);
      var iconWidth = Number.isFinite(Number(a.iconWidth)) ? Number(a.iconWidth) : 107;
      var iconHeight = Number.isFinite(Number(a.iconHeight)) ? Number(a.iconHeight) : 58;
      var duration = a.animationDurationSec != null ? Number(a.animationDurationSec) : 2.5;

      function patchItem(index, patch) {
        var next = items.slice();
        next[index] = Object.assign({}, next[index], patch);
        props.setAttributes({ items: next });
      }

      function addItem() {
        var next = items.concat([
          {
            valueStart: 0,
            valueEnd: 0,
            showPlus: false,
            title: '',
            subtitle: '',
            iconId: 0,
            iconUrl: '',
          },
        ]);
        props.setAttributes({ items: next });
      }

      function removeItem(index) {
        if (!window.confirm(__('Remove this stat?', 'headless-core'))) {
          return;
        }
        var next = items.filter(function (_, i) {
          return i !== index;
        });
        props.setAttributes({ items: next.length ? next : normalizeItems([]) });
      }

      function iconChooser(item, index) {
        return el(
          'div',
          { style: { marginBottom: '8px' } },
          el(BaseControl, {
            label: __('Stat icon', 'headless-core'),
            help: __(
              'Upload or choose an SVG (recommended) or a small PNG/WebP. SVGs are inlined on the site so icon color settings apply.',
              'headless-core'
            ),
          }),
          item.iconUrl
            ? el('img', {
                src: item.iconUrl,
                alt: '',
                style: {
                  width: '48px',
                  height: '48px',
                  objectFit: 'contain',
                  marginBottom: '6px',
                  display: 'block',
                },
              })
            : null,
          el(
            MediaUploadCheck,
            null,
            el(MediaUpload, {
              allowedTypes: ['image/svg+xml', 'image'],
              value: item.iconId,
              onSelect: function (media) {
                patchItem(index, {
                  iconId: media && media.id ? media.id : 0,
                  iconUrl: media && media.url ? media.url : '',
                });
              },
              render: function (obj) {
                return el(
                  'div',
                  { style: { display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' } },
                  el(
                    Button,
                    { variant: 'secondary', onClick: obj.open },
                    item.iconId
                      ? __('Replace icon (SVG or image)', 'headless-core')
                      : __('Upload icon (SVG or image)', 'headless-core')
                  ),
                  item.iconId
                    ? el(
                        Button,
                        {
                          variant: 'tertiary',
                          isSmall: true,
                          isDestructive: true,
                          onClick: function () {
                            if (!window.confirm(__('Remove this icon?', 'headless-core'))) {
                              return;
                            }
                            patchItem(index, { iconId: 0, iconUrl: '' });
                          },
                          label: __('Remove icon', 'headless-core'),
                        },
                        trashSvg
                      )
                    : null
                );
              },
            })
          )
        );
      }

      return el(
        Fragment,
        null,
        el(
          InspectorControls,
          null,
          el(
            PanelBody,
            { title: __('Section', 'headless-core'), initialOpen: true },
            el(TextControl, {
              label: __('Section ID (HTML id)', 'headless-core'),
              value: a.sectionId || 'stats',
              onChange: function (v) {
                props.setAttributes({ sectionId: (v || 'stats').trim() });
              },
            }),
            el(RangeControl, {
              label: __('Counter duration (seconds)', 'headless-core'),
              help: __('All numbers animate from start to end over this time once the block is visible.', 'headless-core'),
              value: Math.max(0.4, Math.min(30, duration)),
              onChange: function (v) {
                props.setAttributes({ animationDurationSec: Math.max(0.4, Math.min(30, v || 2.5)) });
              },
              min: 0.4,
              max: 30,
              step: 0.1,
            })
          ),
          el(
            PanelBody,
            { title: __('Colors', 'headless-core'), initialOpen: false },
            el(BaseControl, { label: __('Section background', 'headless-core') }),
            el(ColorPalette, {
              value: a.sectionBg || '#22acb6',
              colors: palette.map(function (hex) {
                return { color: hex, name: hex };
              }),
              onChange: function (c) {
                props.setAttributes({ sectionBg: c || '#22acb6' });
              },
            }),
            el(BaseControl, { label: __('Number', 'headless-core') }),
            el(ColorPalette, {
              value: a.numberColor || '#ffffff',
              colors: palette.map(function (hex) {
                return { color: hex, name: hex };
              }),
              onChange: function (c) {
                props.setAttributes({ numberColor: c || '#ffffff' });
              },
            }),
            el(BaseControl, { label: __('Title', 'headless-core') }),
            el(ColorPalette, {
              value: a.titleColor || '#ffffff',
              colors: palette.map(function (hex) {
                return { color: hex, name: hex };
              }),
              onChange: function (c) {
                props.setAttributes({ titleColor: c || '#ffffff' });
              },
            }),
            el(BaseControl, { label: __('Subtitle', 'headless-core') }),
            el(ColorPalette, {
              value: a.subtitleColor || '#ffffff',
              colors: palette.map(function (hex) {
                return { color: hex, name: hex };
              }),
              onChange: function (c) {
                props.setAttributes({ subtitleColor: c || '#ffffff' });
              },
            }),
            el(BaseControl, { label: __('Icon', 'headless-core') }),
            el(ColorPalette, {
              value: a.iconColor || '#ffffff',
              colors: palette.map(function (hex) {
                return { color: hex, name: hex };
              }),
              onChange: function (c) {
                props.setAttributes({ iconColor: c || '#ffffff' });
              },
            }),
            el(TextControl, {
              label: __('Icon width (px, 0 = auto)', 'headless-core'),
              type: 'number',
              min: 0,
              value: iconWidth,
              onChange: function (v) {
                var n = parseInt(v, 10);
                props.setAttributes({ iconWidth: Number.isFinite(n) && n >= 0 ? n : 107 });
              },
            }),
            el(TextControl, {
              label: __('Icon height (px, 0 = auto)', 'headless-core'),
              type: 'number',
              min: 0,
              value: iconHeight,
              onChange: function (v) {
                var n = parseInt(v, 10);
                props.setAttributes({ iconHeight: Number.isFinite(n) && n >= 0 ? n : 58 });
              },
            })
          )
        ),
        el(
          'div',
          blockProps,
          el('h3', { style: { marginTop: 0 } }, __('Home stats', 'headless-core')),
          el(
            'p',
            { style: { fontSize: '12px', color: '#757575' } },
            __('Counters run once when this section scrolls into view. Set start/end and duration in the sidebar.', 'headless-core')
          ),
          el(
            'div',
            { style: { display: 'grid', gap: '12px', marginTop: '12px' } },
            items.map(function (item, index) {
              return el(
                'div',
                {
                  key: 'stat-' + index,
                  style: { border: '1px solid #ddd', borderRadius: '6px', padding: '10px', background: '#fff', color: '#1e1e1e' },
                },
                el(
                  'div',
                  { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' } },
                  el('strong', null, __('Stat', 'headless-core') + ' ' + (index + 1)),
                  el(
                    'div',
                    { style: { display: 'flex', gap: '4px' } },
                    el(
                      Button,
                      {
                        variant: 'tertiary',
                        isSmall: true,
                        disabled: index === 0,
                        onClick: function () {
                          props.setAttributes({ items: moveRow(items, index, -1) });
                        },
                      },
                      '˄'
                    ),
                    el(
                      Button,
                      {
                        variant: 'tertiary',
                        isSmall: true,
                        disabled: index === items.length - 1,
                        onClick: function () {
                          props.setAttributes({ items: moveRow(items, index, 1) });
                        },
                      },
                      '˅'
                    ),
                    el(
                      Button,
                      {
                        variant: 'tertiary',
                        isSmall: true,
                        isDestructive: true,
                        onClick: function () {
                          removeItem(index);
                        },
                      },
                      trashSvg
                    )
                  )
                ),
                el(
                  'div',
                  { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' } },
                  el(TextControl, {
                    label: __('Start value', 'headless-core'),
                    type: 'number',
                    value: item.valueStart,
                    onChange: function (v) {
                      patchItem(index, { valueStart: parseInt(v, 10) || 0 });
                    },
                  }),
                  el(TextControl, {
                    label: __('End value', 'headless-core'),
                    type: 'number',
                    value: item.valueEnd,
                    onChange: function (v) {
                      patchItem(index, { valueEnd: parseInt(v, 10) || 0 });
                    },
                  })
                ),
                el(ToggleControl, {
                  label: __('Append + to number (e.g. members)', 'headless-core'),
                  checked: !!item.showPlus,
                  onChange: function (v) {
                    patchItem(index, { showPlus: !!v });
                  },
                }),
                iconChooser(item, index),
                el(RichText, {
                  tagName: 'div',
                  value: item.title,
                  onChange: function (v) {
                    patchItem(index, { title: v });
                  },
                  placeholder: __('Title (inline)', 'headless-core'),
                  allowedFormats: ['core/bold', 'core/italic', 'core/link'],
                }),
                el(RichText, {
                  tagName: 'div',
                  value: item.subtitle,
                  onChange: function (v) {
                    patchItem(index, { subtitle: v });
                  },
                  placeholder: __('Subtitle (inline)', 'headless-core'),
                  allowedFormats: ['core/bold', 'core/italic', 'core/link'],
                })
              );
            })
          ),
          el(
            Button,
            { variant: 'primary', onClick: addItem, style: { marginTop: '8px' } },
            '+ ',
            __('Add stat', 'headless-core')
          )
        )
      );
    },
    save: function () {
      return null;
    },
  });
})(window.wp.blocks, window.wp.blockEditor, window.wp.components, window.wp.element, window.wp.i18n);
