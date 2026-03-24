(function (blocks, blockEditor, components, element, i18n) {
  var el = element.createElement;
  var registerBlockType = blocks.registerBlockType;
  var useBlockProps = blockEditor.useBlockProps;
  var InspectorControls = blockEditor.InspectorControls;
  var LinkControl = blockEditor.LinkControl || blockEditor.__experimentalLinkControl;
  var PanelBody = components.PanelBody;
  var TextControl = components.TextControl;
  var BaseControl = components.BaseControl;
  var ColorPalette = components.ColorPalette;
  var useSelect = window.wp.data.useSelect;
  var useState = element.useState;
  var useEffect = element.useEffect;
  var __ = i18n.__;

  registerBlockType('custom/footer-bottom', {
    apiVersion: 3,
    title: __('Footer Bottom', 'headless-core'),
    icon: 'editor-kitchensink',
    category: 'widgets',
    attributes: {
      copyright: { type: 'string', default: '© 2026 PORTS SACCO' },
      rights: { type: 'string', default: '- ALL RIGHTS RESERVED' },
      privacyLabel: { type: 'string', default: 'PRIVACY POLICY' },
      privacyUrl: { type: 'string', default: '#' },
      termsLabel: { type: 'string', default: 'TERMS AND CONDITIONS' },
      termsUrl: { type: 'string', default: '#' },
      credit: { type: 'string', default: 'A SMITH CREATIVE DESIGN' },
      creditUrl: { type: 'string', default: '' },
      linkColor: { type: 'string', default: '#22ACB6' },
      linkHoverColor: { type: 'string', default: '#FFFFFF' },
    },
    edit: function (props) {
      var a = props.attributes;
      var setAttributes = props.setAttributes;
      var blockProps = useBlockProps();
      var _privacyQuery = useState('');
      var privacyQuery = _privacyQuery[0];
      var setPrivacyQuery = _privacyQuery[1];
      var _termsQuery = useState('');
      var termsQuery = _termsQuery[0];
      var setTermsQuery = _termsQuery[1];

      function field(key, label) {
        return el(TextControl, {
          label: label,
          value: a[key] || '',
          onChange: function (v) {
            var next = {};
            next[key] = v;
            setAttributes(next);
          },
        });
      }
      var brandColors = [
        { name: __('Primary Teal', 'headless-core'), color: '#22ACB6' },
        { name: __('Accent Orange', 'headless-core'), color: '#EE6E2A' },
        { name: __('White', 'headless-core'), color: '#FFFFFF' },
        { name: __('Black', 'headless-core'), color: '#000000' },
      ];

      var privacyPages = useSelect(function (select) {
        if (!privacyQuery || privacyQuery.length < 3) return [];
        return select('core').getEntityRecords('postType', 'page', {
          search: privacyQuery,
          per_page: 8,
          _fields: 'id,title,link',
        }) || [];
      }, [privacyQuery]);

      var termsPages = useSelect(function (select) {
        if (!termsQuery || termsQuery.length < 3) return [];
        return select('core').getEntityRecords('postType', 'page', {
          search: termsQuery,
          per_page: 8,
          _fields: 'id,title,link',
        }) || [];
      }, [termsQuery]);

      useEffect(function () {
        setPrivacyQuery(a.privacyUrl || '');
      }, []);
      useEffect(function () {
        setTermsQuery(a.termsUrl || '');
      }, []);

      function pageAutocompleteField(key, label, query, setQuery, pages) {
        return el(
          BaseControl,
          { label: label },
          el(TextControl, {
            label: '',
            value: query,
            onChange: function (v) {
              var value = String(v || '');
              setQuery(value);
              var patch = {};
              patch[key] = value;
              setAttributes(patch);
            },
            placeholder: __('Type at least 3 characters to find a page...', 'headless-core'),
          }),
          query && query.length >= 3 && Array.isArray(pages) && pages.length > 0
            ? el('div', { style: { border: '1px solid #dcdcde', borderRadius: '4px', background: '#fff', marginTop: '4px', maxHeight: '180px', overflowY: 'auto' } },
                pages.map(function (page) {
                  var title = page && page.title && page.title.rendered ? page.title.rendered : __('(Untitled)', 'headless-core');
                  var url = page && page.link ? String(page.link) : '';
                  return el('button', {
                    key: String(page.id || url),
                    type: 'button',
                    onClick: function () {
                      setQuery(url);
                      var patch = {};
                      patch[key] = url;
                      setAttributes(patch);
                    },
                    style: {
                      width: '100%',
                      textAlign: 'left',
                      padding: '8px 10px',
                      border: 'none',
                      borderBottom: '1px solid #f0f0f1',
                      background: '#fff',
                      cursor: 'pointer',
                    }
                  }, el('strong', null, title), el('div', { style: { fontSize: '12px', color: '#666', marginTop: '2px' } }, url));
                })
              )
            : (query && query.length >= 3
              ? el('p', { style: { marginTop: '4px', color: '#666' } }, __('No matching pages found.', 'headless-core'))
              : null)
        );
      }

      return el('div', blockProps,
        el(InspectorControls, null,
          el(PanelBody, { title: __('Footer Bottom Row', 'headless-core'), initialOpen: true },
            field('copyright', __('Copyright', 'headless-core')),
            field('rights', __('Rights Label', 'headless-core')),
            field('privacyLabel', __('Privacy Label', 'headless-core')),
            pageAutocompleteField('privacyUrl', __('Privacy Page URL', 'headless-core'), privacyQuery, setPrivacyQuery, privacyPages),
            field('termsLabel', __('Terms Label', 'headless-core')),
            pageAutocompleteField('termsUrl', __('Terms Page URL', 'headless-core'), termsQuery, setTermsQuery, termsPages),
            field('credit', __('Credit', 'headless-core')),
            field('creditUrl', __('Credit URL', 'headless-core')),
            el(BaseControl, { label: __('Links Color', 'headless-core') },
              el(ColorPalette, {
                value: a.linkColor || '#22ACB6',
                colors: brandColors,
                onChange: function (v) {
                  setAttributes({ linkColor: v || '#22ACB6' });
                },
              })
            ),
            el(BaseControl, { label: __('Links Hover Color', 'headless-core') },
              el(ColorPalette, {
                value: a.linkHoverColor || '#FFFFFF',
                colors: brandColors,
                onChange: function (v) {
                  setAttributes({ linkHoverColor: v || '#FFFFFF' });
                },
              })
            )
          )
        ),
        el('div', { style: { padding: '12px', border: '1px dashed #ccc' } }, __('Footer Bottom block configured in sidebar.', 'headless-core'))
      );
    },
    save: function () {
      return null;
    },
  });
})(window.wp.blocks, window.wp.blockEditor, window.wp.components, window.wp.element, window.wp.i18n);
