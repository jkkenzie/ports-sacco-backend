(function (blocks, blockEditor, components, element, i18n) {
  var el = element.createElement;
  var registerBlockType = blocks.registerBlockType;
  var useBlockProps = blockEditor.useBlockProps;
  var RichText = blockEditor.RichText;
  var Button = components.Button;
  var BaseControl = components.BaseControl;
  var __ = i18n.__;
  var trashSvg = el(
    'svg',
    { viewBox: '0 0 24 24', width: '16', height: '16', style: { display: 'block' }, fill: 'currentColor' },
    el('path', { d: 'M9 3h6l1 2h4v2H4V5h4l1-2zm0 6h2v12H9V9zm4 0h2v12h-2V9z' })
  );

  var DEFAULT_ITEMS = [
    {
      heading: 'ICD AWARDS 2025 - NATIONAL',
      content:
        '<ul><li>Best Managed Sacco countrywide (Employer based, Asset base over 10B) - <strong>Position 3</strong></li><li>Best in Technology Optimization Country wide (Employer based, Asset base above 10B) - <strong>Position 2</strong></li><li>Best in Capitalization country wide (Employer based, asset base above 10B) - <strong>Position 3</strong></li></ul>',
    },
    {
      heading: 'ICD AWARDS 2025 - MOMBASA COUNTY',
      content:
        '<ul><li>Best Co-operative Society - <strong>Position 1</strong></li><li>Best Capitalized Co-operative Society - <strong>Position 1</strong></li><li>Highest Returns on Assets - <strong>Position 1</strong></li><li>1st to present Audited Accounts - <strong>Position 1</strong></li><li>Best in Education and Training - <strong>Position 2</strong></li><li>Best Insured Sacco Society - <strong>Position 2</strong></li><li>Most Innovative Sacco Society Position - <strong>Position 2</strong></li></ul>',
    },
    {
      heading: 'ASK NAIROBI INTERNATIONAL SHOW - 2025',
      content: '<ul><li>Best Cooperative Movement stand - <strong>Position 1</strong></li></ul>',
    },
  ];

  function normalizeItems(items) {
    if (!Array.isArray(items) || !items.length) {
      return DEFAULT_ITEMS.map(function (row) {
        return Object.assign({}, row);
      });
    }
    return items.map(function (row, i) {
      var d = DEFAULT_ITEMS[i] || { heading: '', content: '' };
      return {
        heading: String((row && row.heading) || d.heading || ''),
        content: String((row && row.content) || d.content || ''),
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

  registerBlockType('custom/about-us-awards', {
    apiVersion: 3,
    title: __('About Us Awards', 'headless-core'),
    icon: 'awards',
    category: 'widgets',
    description: __('About Us awards accordion rendered by the React app.', 'headless-core'),
    attributes: {
      title: { type: 'string', default: 'Awards' },
      items: { type: 'array', default: DEFAULT_ITEMS },
    },
    edit: function (props) {
      var blockProps = useBlockProps({ className: 'headless-about-us-awards-editor' });
      var title = String(props.attributes.title || 'Awards');
      var items = normalizeItems(props.attributes.items);

      function patchItem(index, patch) {
        var next = items.slice();
        next[index] = Object.assign({}, next[index], patch);
        props.setAttributes({ items: next });
      }

      function addItem() {
        props.setAttributes({
          items: items.concat([{ heading: '', content: '' }]),
        });
      }

      function removeItem(index) {
        if (!window.confirm(__('Remove this accordion item?', 'headless-core'))) {
          return;
        }
        var next = items.filter(function (_, i) {
          return i !== index;
        });
        props.setAttributes({ items: next.length ? next : normalizeItems([]) });
      }

      return el(
        'div',
        blockProps,
        el('h3', null, __('About Us Awards', 'headless-core')),
        el(
          'div',
          { style: { marginBottom: '12px', padding: '8px', border: '1px solid #ddd', borderRadius: '6px', background: '#fff' } },
          el(RichText, {
            tagName: 'h4',
            value: title,
            onChange: function (v) {
              props.setAttributes({ title: v });
            },
            placeholder: __('Section title...', 'headless-core'),
            allowedFormats: [],
          })
        ),
        el(
          'div',
          { style: { display: 'grid', gap: '12px', marginBottom: '12px' } },
          items.map(function (item, index) {
            return el(
              'div',
              {
                key: 'awards-' + index,
                style: { border: '1px solid #ddd', borderRadius: '6px', padding: '10px', background: '#fff' },
              },
              el(
                'div',
                { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' } },
                el('strong', null, item.heading || __('Accordion item', 'headless-core') + ' ' + (index + 1)),
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
                      label: __('Remove item', 'headless-core'),
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
                value: item.heading,
                onChange: function (v) {
                  patchItem(index, { heading: v });
                },
                placeholder: __('Accordion heading...', 'headless-core'),
                allowedFormats: [],
              }),
              el(
                BaseControl,
                { label: __('Description', 'headless-core') },
                el(RichText, {
                  tagName: 'div',
                  value: item.content,
                  onChange: function (v) {
                    patchItem(index, { content: v });
                  },
                  placeholder: __('Accordion content/description...', 'headless-core'),
                  style: { minHeight: '110px', border: '1px solid #dcdcde', padding: '8px', borderRadius: '4px' },
                })
              )
            );
          })
        ),
        el(
          Button,
          { variant: 'primary', onClick: addItem },
          '+ ',
          __('Add Accordion Item', 'headless-core')
        )
      );
    },
    save: function () {
      return null;
    },
  });
})(window.wp.blocks, window.wp.blockEditor, window.wp.components, window.wp.element, window.wp.i18n);
