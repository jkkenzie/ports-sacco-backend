(function (blocks, blockEditor, components, element, i18n) {
  var el = element.createElement;
  var registerBlockType = blocks.registerBlockType;
  var useBlockProps = blockEditor.useBlockProps;
  var InspectorControls = blockEditor.InspectorControls;
  var PanelBody = components.PanelBody;
  var RangeControl = components.RangeControl;
  var TextControl = components.TextControl;
  var TextareaControl = components.TextareaControl;
  var ToggleControl = components.ToggleControl;
  var SelectControl = components.SelectControl;
  var __ = i18n.__;

  registerBlockType('custom/youtube-grid', {
    apiVersion: 3,
    title: __('YouTube Grid', 'headless-core'),
    icon: 'video-alt3',
    category: 'widgets',
    description: __('Grid of latest videos from a YouTube channel (API configured in Headless Core settings).', 'headless-core'),
    attributes: {
      title: { type: 'string', default: 'Our YouTube Channel' },
      intro: { type: 'string', default: 'Watch our latest videos, updates, and stories from Ports SACCO.' },
      maxVideos: { type: 'number', default: 6 },
      columns: { type: 'number', default: 3 },
      channelId: { type: 'string', default: '' },
      channelUrl: { type: 'string', default: '' },
      viewChannelLabel: { type: 'string', default: 'Visit our YouTube channel' },
      accentColor: { type: 'string', default: '#22acb6' },
      showPublishedDate: { type: 'boolean', default: true },
    },
    edit: function (props) {
      var blockProps = useBlockProps({ className: 'headless-youtube-grid-block' });
      var a = props.attributes;

      return el(
        'div',
        blockProps,
        el(
          InspectorControls,
          null,
          el(
            PanelBody,
            { title: __('Content', 'headless-core'), initialOpen: true },
            el(TextControl, {
              label: __('Section title', 'headless-core'),
              value: a.title || '',
              onChange: function (v) {
                props.setAttributes({ title: String(v || '') });
              },
            }),
            el(TextareaControl, {
              label: __('Intro text', 'headless-core'),
              value: a.intro || '',
              onChange: function (v) {
                props.setAttributes({ intro: String(v || '') });
              },
            }),
            el(TextControl, {
              label: __('View channel button label', 'headless-core'),
              value: a.viewChannelLabel || 'Visit our YouTube channel',
              onChange: function (v) {
                props.setAttributes({ viewChannelLabel: String(v || '') });
              },
            })
          ),
          el(
            PanelBody,
            { title: __('Layout', 'headless-core'), initialOpen: true },
            el(RangeControl, {
              label: __('Maximum videos', 'headless-core'),
              value: typeof a.maxVideos === 'number' ? a.maxVideos : 6,
              min: 3,
              max: 12,
              onChange: function (v) {
                props.setAttributes({ maxVideos: typeof v === 'number' ? v : 6 });
              },
            }),
            el(SelectControl, {
              label: __('Columns (desktop)', 'headless-core'),
              value: String(a.columns || 3),
              options: [
                { label: '2 columns', value: '2' },
                { label: '3 columns', value: '3' },
                { label: '4 columns', value: '4' },
              ],
              onChange: function (v) {
                props.setAttributes({ columns: parseInt(String(v || '3'), 10) || 3 });
              },
            }),
            el(ToggleControl, {
              label: __('Show published date', 'headless-core'),
              checked: a.showPublishedDate !== false,
              onChange: function (v) {
                props.setAttributes({ showPublishedDate: Boolean(v) });
              },
            })
          ),
          el(
            PanelBody,
            { title: __('Channel override', 'headless-core'), initialOpen: false },
            el(TextControl, {
              label: __('Channel ID or @handle', 'headless-core'),
              value: a.channelId || '',
              help: __('Leave empty to use the default channel from Headless Core → YouTube settings.', 'headless-core'),
              onChange: function (v) {
                props.setAttributes({ channelId: String(v || '') });
              },
            }),
            el(TextControl, {
              label: __('Custom channel URL (optional)', 'headless-core'),
              value: a.channelUrl || '',
              help: __('Overrides the default “visit channel” link.', 'headless-core'),
              onChange: function (v) {
                props.setAttributes({ channelUrl: String(v || '') });
              },
            }),
            el(TextControl, {
              label: __('Accent color', 'headless-core'),
              value: a.accentColor || '#22acb6',
              onChange: function (v) {
                props.setAttributes({ accentColor: String(v || '#22acb6') });
              },
            })
          )
        ),
        el(
          'div',
          {
            style: {
              padding: '1.25rem',
              border: '1px dashed #ee6e2a',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #fff7f2 0%, #f0fafb 100%)',
            },
          },
          el(
            'div',
            { style: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' } },
            el('span', { style: { fontSize: '22px' } }, '▶'),
            el('strong', { style: { fontSize: '15px' } }, a.title || __('YouTube Grid', 'headless-core'))
          ),
          a.intro
            ? el('p', { style: { margin: '0 0 12px', color: '#555', fontSize: '13px' } }, a.intro)
            : null,
          el(
            'div',
            { style: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' } },
            [1, 2, 3].map(function (i) {
              return el('div', {
                key: 'yt-preview-' + i,
                style: {
                  height: '72px',
                  borderRadius: '8px',
                  background: '#1e293b',
                  opacity: 0.85 - i * 0.08,
                },
              });
            })
          ),
          el(
            'p',
            { style: { marginTop: '12px', marginBottom: 0, color: '#666', fontSize: '12px' } },
            __('Frontend loads videos via YouTube Data API (key stored in Headless Core settings).', 'headless-core')
          )
        )
      );
    },
    save: function () {
      return null;
    },
  });
})(window.wp.blocks, window.wp.blockEditor, window.wp.components, window.wp.element, window.wp.i18n);
