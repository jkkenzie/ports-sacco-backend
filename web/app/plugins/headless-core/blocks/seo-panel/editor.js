(function (plugins, editPost, element, components, data, coreData, blockEditor, i18n) {
  var el = element.createElement;
  var Fragment = element.Fragment;
  var registerPlugin = plugins.registerPlugin;
  var PluginDocumentSettingPanel = editPost.PluginDocumentSettingPanel;
  var PanelRow = components.PanelRow;
  var TextControl = components.TextControl;
  var TextareaControl = components.TextareaControl;
  var SelectControl = components.SelectControl;
  var ToggleControl = components.ToggleControl;
  var Button = components.Button;
  var MediaUpload = blockEditor.MediaUpload;
  var MediaUploadCheck = blockEditor.MediaUploadCheck;
  var useSelect = data.useSelect;
  var useDispatch = data.useDispatch;
  var __ = i18n.__;

  var CFG = window.HeadlessCoreSeo || {};
  var META_KEYS = CFG.metaKeys || [];
  var SCHEMA_CHOICES = CFG.schemaChoices || {};
  var FRONTEND_BASE = (CFG.frontendBase || '').replace(/\/+$/, '');
  var SITE_NAME = CFG.siteName || '';
  var SEPARATOR = CFG.separator || '|';
  var TITLE_TEMPLATE = CFG.titleTemplate || '%title% %sep% %sitename%';
  var DEFAULT_DESCRIPTION = CFG.defaultDescription || '';
  var DEFAULT_IMAGE = CFG.defaultImage || '';

  var TITLE_MIN = 30;
  var TITLE_MAX = 60;
  var DESC_MIN = 70;
  var DESC_MAX = 160;

  function applyTemplate(postTitle) {
    return TITLE_TEMPLATE
      .replace(/%title%/g, postTitle || '')
      .replace(/%sitename%/g, SITE_NAME)
      .replace(/%sep%/g, SEPARATOR)
      .replace(/\s+/g, ' ')
      .trim();
  }

  function routeFor(postType, slug) {
    slug = slug || '';
    switch (postType) {
      case 'savings_product':
        return '/savings-products/' + slug;
      case 'loan_product':
        return '/loan-products/' + slug;
      case 'service':
        return '/services/' + slug;
      case 'event':
        return '/events/' + slug;
      case 'post':
        return '/news/' + slug;
      case 'team_member':
        return '/team/' + slug;
      case 'page':
        return slug ? '/' + slug : '/';
      default:
        return '/' + slug;
    }
  }

  function counterColor(len, min, max) {
    if (len === 0) return '#6b7280';
    if (len < min) return '#d97706';
    if (len > max) return '#dc2626';
    return '#16a34a';
  }

  function counterLabel(len, min, max) {
    if (len === 0) return __('Empty — a value will be generated automatically.', 'headless-core');
    if (len < min) return __('A little short.', 'headless-core');
    if (len > max) return __('Too long — may be truncated in search results.', 'headless-core');
    return __('Good length.', 'headless-core');
  }

  function SeoPanel() {
    var editor = useSelect(function (select) {
      var ed = select('core/editor');
      return {
        meta: ed.getEditedPostAttribute('meta') || {},
        postType: ed.getCurrentPostType(),
        postTitle: ed.getEditedPostAttribute('title') || '',
        slug: ed.getEditedPostAttribute('slug') || '',
      };
    }, []);

    var meta = editor.meta;
    var postType = editor.postType;
    var editPostAction = useDispatch('core/editor').editPost;

    function get(key) {
      return meta[key] != null ? meta[key] : '';
    }

    function setMeta(key, value) {
      var next = {};
      next[key] = value;
      editPostAction({ meta: Object.assign({}, meta, next) });
    }

    var ogImageId = parseInt(get('_hc_seo_og_image'), 10) || 0;
    var ogImage = useSelect(function (select) {
      return ogImageId ? select('core').getMedia(ogImageId) : null;
    }, [ogImageId]);
    var ogImageUrl = ogImage && ogImage.source_url ? ogImage.source_url : '';

    var resolvedTitle = get('_hc_seo_title') || applyTemplate(editor.postTitle);
    var resolvedDesc = get('_hc_seo_description') || DEFAULT_DESCRIPTION;
    var canonical = get('_hc_seo_canonical') || (FRONTEND_BASE + routeFor(postType, editor.slug));

    var titleLen = (get('_hc_seo_title') || '').length;
    var descLen = (get('_hc_seo_description') || '').length;

    var schemaOptions = (SCHEMA_CHOICES[postType] || ['WebPage']).map(function (t) {
      return { label: t, value: t };
    });
    schemaOptions.unshift({ label: __('Default', 'headless-core'), value: '' });

    // ---- Search preview ---------------------------------------------------
    var searchPreview = el(
      'div',
      {
        style: {
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          padding: '12px',
          marginBottom: '16px',
          background: '#fff',
        },
      },
      el('div', { style: { fontSize: '11px', color: '#6b7280', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '.04em' } }, __('Google preview', 'headless-core')),
      el('div', { style: { color: '#1a0dab', fontSize: '16px', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, resolvedTitle || __('Untitled', 'headless-core')),
      el('div', { style: { color: '#006621', fontSize: '12px', margin: '2px 0' } }, canonical),
      el('div', { style: { color: '#4d5156', fontSize: '13px', lineHeight: 1.4 } }, resolvedDesc || __('No description set yet.', 'headless-core'))
    );

    // ---- Social preview ---------------------------------------------------
    var previewImg = ogImageUrl || DEFAULT_IMAGE;
    var socialPreview = el(
      'div',
      { style: { border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', marginBottom: '16px', background: '#fff' } },
      previewImg
        ? el('img', { src: previewImg, alt: '', style: { width: '100%', height: '140px', objectFit: 'cover', display: 'block' } })
        : el('div', { style: { width: '100%', height: '80px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '12px' } }, __('No share image', 'headless-core')),
      el(
        'div',
        { style: { padding: '10px 12px' } },
        el('div', { style: { fontSize: '11px', color: '#6b7280', textTransform: 'uppercase' } }, (FRONTEND_BASE || '').replace(/^https?:\/\//, '')),
        el('div', { style: { fontWeight: 600, fontSize: '13px', color: '#0f172a', marginTop: '2px' } }, (get('_hc_seo_og_title') || resolvedTitle)),
        el('div', { style: { fontSize: '12px', color: '#475569', marginTop: '2px' } }, (get('_hc_seo_og_description') || resolvedDesc))
      )
    );

    return el(
      Fragment,
      null,
      // Main panel
      el(
        PluginDocumentSettingPanel,
        { name: 'headless-core-seo', title: __('SEO', 'headless-core'), className: 'headless-core-seo-panel' },
        searchPreview,
        el(TextControl, {
          label: __('SEO title', 'headless-core'),
          value: get('_hc_seo_title'),
          onChange: function (v) { setMeta('_hc_seo_title', v); },
          placeholder: applyTemplate(editor.postTitle),
          help: el('span', { style: { color: counterColor(titleLen, TITLE_MIN, TITLE_MAX) } }, titleLen + ' / ' + TITLE_MAX + ' — ' + counterLabel(titleLen, TITLE_MIN, TITLE_MAX)),
        }),
        el(TextareaControl, {
          label: __('Meta description', 'headless-core'),
          value: get('_hc_seo_description'),
          onChange: function (v) { setMeta('_hc_seo_description', v); },
          rows: 3,
          placeholder: DEFAULT_DESCRIPTION || __('Auto-generated from page content when empty.', 'headless-core'),
          help: el('span', { style: { color: counterColor(descLen, DESC_MIN, DESC_MAX) } }, descLen + ' / ' + DESC_MAX + ' — ' + counterLabel(descLen, DESC_MIN, DESC_MAX)),
        }),
        el(TextControl, {
          label: __('Focus keyphrase', 'headless-core'),
          value: get('_hc_seo_keyphrase'),
          onChange: function (v) { setMeta('_hc_seo_keyphrase', v); },
          help: __('Optional. The main term this page targets (for your reference).', 'headless-core'),
        }),
        el(SelectControl, {
          label: __('Schema type', 'headless-core'),
          value: get('_hc_seo_schema_type'),
          options: schemaOptions,
          onChange: function (v) { setMeta('_hc_seo_schema_type', v); },
          help: __('Structured-data type used for this page.', 'headless-core'),
        })
      ),
      // Social panel
      el(
        PluginDocumentSettingPanel,
        { name: 'headless-core-seo-social', title: __('SEO: Social sharing', 'headless-core') },
        socialPreview,
        el(TextControl, {
          label: __('Social title (Open Graph)', 'headless-core'),
          value: get('_hc_seo_og_title'),
          onChange: function (v) { setMeta('_hc_seo_og_title', v); },
          placeholder: resolvedTitle,
        }),
        el(TextareaControl, {
          label: __('Social description', 'headless-core'),
          value: get('_hc_seo_og_description'),
          onChange: function (v) { setMeta('_hc_seo_og_description', v); },
          rows: 2,
          placeholder: resolvedDesc,
        }),
        el(PanelRow, null,
          el(MediaUploadCheck, null,
            el(MediaUpload, {
              onSelect: function (m) { setMeta('_hc_seo_og_image', m.id); },
              allowedTypes: ['image'],
              value: ogImageId,
              render: function (obj) {
                return el(
                  'div',
                  { style: { width: '100%' } },
                  ogImageUrl ? el('img', { src: ogImageUrl, alt: '', style: { width: '100%', borderRadius: '6px', marginBottom: '8px', display: 'block' } }) : null,
                  el(Button, { variant: 'secondary', onClick: obj.open }, ogImageId ? __('Replace image', 'headless-core') : __('Select share image', 'headless-core')),
                  ogImageId ? el(Button, { variant: 'tertiary', isDestructive: true, onClick: function () { setMeta('_hc_seo_og_image', 0); }, style: { marginLeft: '6px' } }, __('Remove', 'headless-core')) : null
                );
              },
            })
          )
        ),
        el(SelectControl, {
          label: __('Twitter card type', 'headless-core'),
          value: get('_hc_seo_twitter_card'),
          options: [
            { label: __('Default (auto)', 'headless-core'), value: '' },
            { label: __('Summary with large image', 'headless-core'), value: 'summary_large_image' },
            { label: __('Summary', 'headless-core'), value: 'summary' },
          ],
          onChange: function (v) { setMeta('_hc_seo_twitter_card', v); },
        })
      ),
      // Advanced panel
      el(
        PluginDocumentSettingPanel,
        { name: 'headless-core-seo-advanced', title: __('SEO: Advanced', 'headless-core') },
        el(ToggleControl, {
          label: __('Discourage search engines (noindex)', 'headless-core'),
          checked: !!get('_hc_seo_noindex'),
          onChange: function (v) { setMeta('_hc_seo_noindex', v); },
          help: get('_hc_seo_noindex') ? __('This page will NOT appear in search results.', 'headless-core') : __('This page can appear in search results.', 'headless-core'),
        }),
        el(ToggleControl, {
          label: __('Do not follow links (nofollow)', 'headless-core'),
          checked: !!get('_hc_seo_nofollow'),
          onChange: function (v) { setMeta('_hc_seo_nofollow', v); },
        }),
        el(TextControl, {
          label: __('Canonical URL', 'headless-core'),
          value: get('_hc_seo_canonical'),
          onChange: function (v) { setMeta('_hc_seo_canonical', v); },
          placeholder: FRONTEND_BASE + routeFor(postType, editor.slug),
          help: __('Leave empty to use the page URL automatically.', 'headless-core'),
        })
      )
    );
  }

  registerPlugin('headless-core-seo', {
    render: SeoPanel,
    icon: 'search',
  });
})(
  window.wp.plugins,
  window.wp.editPost,
  window.wp.element,
  window.wp.components,
  window.wp.data,
  window.wp.coreData,
  window.wp.blockEditor,
  window.wp.i18n
);
