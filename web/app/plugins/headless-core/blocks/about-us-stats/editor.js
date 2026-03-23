(function (blocks, blockEditor, components, element, i18n) {
  var el = element.createElement;
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
  var trashSvg = el(
    'svg',
    { viewBox: '0 0 24 24', width: '16', height: '16', style: { display: 'block' }, fill: 'currentColor' },
    el('path', { d: 'M9 3h6l1 2h4v2H4V5h4l1-2zm0 6h2v12H9V9zm4 0h2v12h-2V9z' })
  );

  var DEFAULT_ITEMS = [
    { number: '15', title: 'AWARDS IN 2025', subtitle: 'We are leading by example', iconId: 0, iconUrl: '' },
    { number: '26', title: 'PRODUCTS OFFERED', subtitle: 'Products that fit your needs', iconId: 0, iconUrl: '' },
    { number: '10,000+', title: 'REGISTERED MEMBERS', subtitle: 'A growing membership base.', iconId: 0, iconUrl: '' },
  ];

  function normalizeItems(items) {
    if (!Array.isArray(items) || !items.length) {
      return DEFAULT_ITEMS.map(function (row) {
        return Object.assign({}, row);
      });
    }
    return items.map(function (row, i) {
      var d = DEFAULT_ITEMS[i] || { number: '', title: '', subtitle: '', iconId: 0, iconUrl: '' };
      return {
        number: String((row && row.number) || d.number || ''),
        title: String((row && row.title) || d.title || ''),
        subtitle: String((row && row.subtitle) || d.subtitle || ''),
        iconId: Number((row && row.iconId) || d.iconId || 0),
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

  registerBlockType('custom/about-us-stats', {
    apiVersion: 3,
    title: __('About Us Stats', 'headless-core'),
    icon: 'chart-bar',
    category: 'widgets',
    description: __('About Us stats section rendered by the React app.', 'headless-core'),
    attributes: {
      items: { type: 'array', default: DEFAULT_ITEMS },
      iconWidth: { type: 'number', default: 107 },
      iconHeight: { type: 'number', default: 58 },
      iconColor: { type: 'string', default: '#40C9BF' },
    },
    edit: function (props) {
      var blockProps = useBlockProps({ className: 'headless-about-us-stats-editor' });
      var items = normalizeItems(props.attributes.items);
      var iconWidth = Number.isFinite(Number(props.attributes.iconWidth)) ? Number(props.attributes.iconWidth) : 107;
      var iconHeight = Number.isFinite(Number(props.attributes.iconHeight)) ? Number(props.attributes.iconHeight) : 58;
      var iconColor = String(props.attributes.iconColor || '#40C9BF');
      var iconColorChoices = ['#40C9BF', '#EE6E2A', '#000000', '#FFFFFF', '#1F2937', '#6B7280'];

      function patchItem(index, patch) {
        var next = items.slice();
        next[index] = Object.assign({}, next[index], patch);
        props.setAttributes({ items: next });
      }

      function addItem() {
        var next = items.concat([{ number: '', title: '', subtitle: '', iconId: 0, iconUrl: '' }]);
        props.setAttributes({ items: next });
      }

      function removeItem(index) {
        if (!window.confirm(__('Remove this stat item?', 'headless-core'))) {
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
          item.iconUrl
            ? el('img', {
                src: item.iconUrl,
                alt: '',
                style: {
                  width: '40px',
                  height: '40px',
                  objectFit: 'cover',
                  borderRadius: '4px',
                  border: '1px solid #dcdcde',
                  marginBottom: '6px',
                  display: 'block',
                },
              })
            : null,
          el(
            MediaUploadCheck,
            null,
            el(MediaUpload, {
              allowedTypes: ['image'],
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
                  { style: { display: 'flex', alignItems: 'center', gap: '6px' } },
                  el(
                    Button,
                    { variant: 'secondary', onClick: obj.open },
                    item.iconId ? __('Replace Image/Icon', 'headless-core') : __('Select Image/Icon', 'headless-core')
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
                          label: __('Remove image/icon', 'headless-core'),
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
        'div',
        blockProps,
        el('h3', null, __('About Us Stats', 'headless-core')),
        el(
          'div',
          {
            style: {
              display: 'grid',
              gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
              gap: '8px',
              marginBottom: '12px',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              background: '#fff',
            },
          },
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
          }),
          el(TextControl, {
            label: __('Icon color (hex)', 'headless-core'),
            value: iconColor,
            onChange: function (v) {
              props.setAttributes({ iconColor: String(v || '').trim() || '#40C9BF' });
            },
          }),
          el('div', null,
            el(BaseControl, { label: __('Icon color selector', 'headless-core') }),
            el(ColorPalette, {
              value: iconColor,
              colors: iconColorChoices.map(function (hex) {
                return { color: hex, name: hex };
              }),
              onChange: function (nextColor) {
                props.setAttributes({ iconColor: nextColor || '#40C9BF' });
              },
            })
          )
        ),
        el(
          'div',
          { style: { display: 'grid', gap: '12px', marginBottom: '12px' } },
          items.map(function (item, index) {
            return el(
              'div',
              {
                key: 'stat-' + index,
                style: { border: '1px solid #ddd', borderRadius: '6px', padding: '10px', background: '#fff' },
              },
              el(
                'div',
                { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' } },
                el('strong', null, item.title || __('Stat', 'headless-core') + ' ' + (index + 1)),
                el(
                  'div',
                  { style: { display: 'flex', gap: '4px' } },
                  el(
                    Button,
                    {
                      variant: 'tertiary',
                      isSmall: true,
                      label: __('Move up', 'headless-core'),
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
                      label: __('Move down', 'headless-core'),
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
                      label: __('Remove stat', 'headless-core'),
                      onClick: function () {
                        removeItem(index);
                      },
                    },
                    trashSvg
                  )
                )
              ),
              el(RichText, {
                tagName: 'p',
                value: item.number,
                onChange: function (v) {
                  patchItem(index, { number: v });
                },
                placeholder: __('Enter number...', 'headless-core'),
                allowedFormats: [],
              }),
              iconChooser(item, index),
              el(RichText, {
                tagName: 'p',
                value: item.title,
                onChange: function (v) {
                  patchItem(index, { title: v });
                },
                placeholder: __('Enter title...', 'headless-core'),
                allowedFormats: [],
              }),
              el(RichText, {
                tagName: 'p',
                value: item.subtitle,
                onChange: function (v) {
                  patchItem(index, { subtitle: v });
                },
                placeholder: __('Enter subtitle...', 'headless-core'),
                allowedFormats: [],
              })
            );
          })
        ),
        el(
          Button,
          { variant: 'primary', onClick: addItem },
          '+ ',
          __('Add Stat', 'headless-core')
        )
      );
    },
    save: function () {
      return null;
    },
  });
})(window.wp.blocks, window.wp.blockEditor, window.wp.components, window.wp.element, window.wp.i18n);
