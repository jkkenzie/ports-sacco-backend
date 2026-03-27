(function (blocks, blockEditor, components, element, i18n) {
  var el = element.createElement;
  var registerBlockType = blocks.registerBlockType;
  var useBlockProps = blockEditor.useBlockProps;
  var InspectorControls = blockEditor.InspectorControls;
  var PanelBody = components.PanelBody;
  var Button = components.Button;
  var TextControl = components.TextControl;
  var TextareaControl = components.TextareaControl;
  var BaseControl = components.BaseControl;
  var ColorPalette = components.ColorPalette;
  var ToggleControl = components.ToggleControl;
  var MediaUpload = blockEditor.MediaUpload;
  var MediaUploadCheck = blockEditor.MediaUploadCheck;
  var __ = i18n.__;

  function normalizeCards(cards) {
    if (!Array.isArray(cards) || cards.length === 0) return [];
    return cards.map(function (c) {
      return {
        imageId: Number((c && c.imageId) || 0) || 0,
        imageUrl: String((c && c.imageUrl) || ''),
        imageBgFrom: String((c && c.imageBgFrom) || ''),
        imageBgTo: String((c && c.imageBgTo) || ''),
        imageAboveContent: Boolean((c && c.imageAboveContent) || false),
        title: String((c && c.title) || ''),
        description: String((c && c.description) || ''),
        tag: String((c && c.tag) || ''),
        href: String((c && c.href) || '#'),
      };
    });
  }

  registerBlockType('custom/home-product-cards', {
    apiVersion: 3,
    title: __('Home Product Cards', 'headless-core'),
    icon: 'screenoptions',
    category: 'widgets',
    description: __('Homepage product/service cards with repeater.', 'headless-core'),
    attributes: {
      sectionId: { type: 'string', default: 'products' },
      sectionBgColor: { type: 'string', default: '#F5F4EE' },
      topCurveBgColor: { type: 'string', default: '#ffffff' },
      topCurveCutoutColor: { type: 'string', default: '#F5F4EE' },
      badgeText: { type: 'string', default: 'EXPLORE' },
      badgeBgColor: { type: 'string', default: '#EE6E2A' },
      badgeTextColor: { type: 'string', default: '#ffffff' },
      kickerText: { type: 'string', default: 'EXPLORE OUR WIDE RANGE OF PRODUCTS AND SERVICES.' },
      kickerColor: { type: 'string', default: '#22ACB6' },
      cardTagBarColor: { type: 'string', default: '#F06E2A' },
      cardTagTextColor: { type: 'string', default: '#3b4e6b' },
      cardTitleColor: { type: 'string', default: '#22ACB6' },
      cardTitleHoverColor: { type: 'string', default: '#ee6e2a' },
      cardTextColor: { type: 'string', default: '#3b4e6b' },
      arrowBgColor: { type: 'string', default: '#82cdcb' },
      arrowHoverBgColor: { type: 'string', default: '#ee6e2a' },
      arrowColor: { type: 'string', default: '#ffffff' },
      cardBorderColor: { type: 'string', default: '#e8e8e8' },
      cardHoverBorderColor: { type: 'string', default: '#cfeeed' },
      imageBgFrom: { type: 'string', default: '#00B2E0' },
      imageBgTo: { type: 'string', default: '#00AB81' },
      cards: { type: 'array', default: [] },
    },
    edit: function (props) {
      var blockProps = useBlockProps({ className: 'headless-home-product-cards-block' });
      var a = props.attributes;
      var cards = normalizeCards(a.cards);
      if (!cards.length) {
        cards = [
          { imageId: 0, imageUrl: '', title: 'Join Us', description: 'Join Ports Sacco today and get all your financial needs under one roof!', tag: 'BECOME A MEMBER TODAY', href: '#' },
          { imageId: 0, imageUrl: '', title: 'SecureYour Future', description: 'Maximize your savings with attractive interest rates and peace of mind.', tag: 'SAVE & INVEST WITH US', href: '#' },
          { imageId: 0, imageUrl: '', title: 'Flexible Loan Options', description: 'Get flexible loan options tailored to your needs and goals.', tag: 'GET A LOAN FROM US', href: '#' },
        ];
      }

      function setCard(i, patch) {
        var next = cards.map(function (c, idx) { return idx === i ? Object.assign({}, c, patch) : c; });
        props.setAttributes({ cards: next });
      }
      function addCard() {
        props.setAttributes({ cards: cards.concat([{ imageId: 0, imageUrl: '', imageBgFrom: '', imageBgTo: '', imageAboveContent: false, title: '', description: '', tag: '', href: '#' }]) });
      }
      function removeCard(i) {
        if (!window.confirm(__('Remove this card?', 'headless-core'))) return;
        props.setAttributes({ cards: cards.filter(function (_, idx) { return idx !== i; }) });
      }

      var colors = ['#22ACB6', '#EE6E2A', '#ffffff', '#000000', '#F5F4EE', '#3b4e6b', '#e8e8e8', '#cfeeed', '#82cdcb', '#ee6e2a', '#F06E2A'];
      function palette() {
        return colors.map(function (hex) { return { color: hex, name: hex }; });
      }

      return el(
        'div',
        blockProps,
        el(
          InspectorControls,
          null,
          el(
            PanelBody,
            { title: __('Section', 'headless-core'), initialOpen: true },
            el(TextControl, { label: __('Section ID', 'headless-core'), value: a.sectionId, onChange: function (v) { props.setAttributes({ sectionId: v }); } }),
            el(TextControl, { label: __('Kicker text', 'headless-core'), value: a.kickerText, onChange: function (v) { props.setAttributes({ kickerText: v }); } }),
            el(TextControl, { label: __('Badge text', 'headless-core'), value: a.badgeText, onChange: function (v) { props.setAttributes({ badgeText: v }); } })
          ),
          el(
            PanelBody,
            { title: __('Colors', 'headless-core'), initialOpen: false },
            el(BaseControl, { label: __('Section background', 'headless-core') }),
            el(ColorPalette, { value: a.sectionBgColor, colors: palette(), onChange: function (c) { props.setAttributes({ sectionBgColor: c || '#F5F4EE' }); } }),
            el(BaseControl, { label: __('Top curve background', 'headless-core') }),
            el(ColorPalette, { value: a.topCurveBgColor, colors: palette(), onChange: function (c) { props.setAttributes({ topCurveBgColor: c || '#ffffff' }); } }),
            el(BaseControl, { label: __('Top curve cutout', 'headless-core') }),
            el(ColorPalette, { value: a.topCurveCutoutColor, colors: palette(), onChange: function (c) { props.setAttributes({ topCurveCutoutColor: c || '#F5F4EE' }); } }),
            el(BaseControl, { label: __('Kicker color', 'headless-core') }),
            el(ColorPalette, { value: a.kickerColor, colors: palette(), onChange: function (c) { props.setAttributes({ kickerColor: c || '#22ACB6' }); } }),
            el(BaseControl, { label: __('Badge background', 'headless-core') }),
            el(ColorPalette, { value: a.badgeBgColor, colors: palette(), onChange: function (c) { props.setAttributes({ badgeBgColor: c || '#EE6E2A' }); } }),
            el(BaseControl, { label: __('Badge text', 'headless-core') }),
            el(ColorPalette, { value: a.badgeTextColor, colors: palette(), onChange: function (c) { props.setAttributes({ badgeTextColor: c || '#ffffff' }); } }),
            el(BaseControl, { label: __('Card title', 'headless-core') }),
            el(ColorPalette, { value: a.cardTitleColor, colors: palette(), onChange: function (c) { props.setAttributes({ cardTitleColor: c || '#22ACB6' }); } }),
            el(BaseControl, { label: __('Card title hover', 'headless-core') }),
            el(ColorPalette, { value: a.cardTitleHoverColor, colors: palette(), onChange: function (c) { props.setAttributes({ cardTitleHoverColor: c || '#ee6e2a' }); } }),
            el(BaseControl, { label: __('Card text', 'headless-core') }),
            el(ColorPalette, { value: a.cardTextColor, colors: palette(), onChange: function (c) { props.setAttributes({ cardTextColor: c || '#3b4e6b' }); } }),
            el(BaseControl, { label: __('Card border', 'headless-core') }),
            el(ColorPalette, { value: a.cardBorderColor, colors: palette(), onChange: function (c) { props.setAttributes({ cardBorderColor: c || '#e8e8e8' }); } }),
            el(BaseControl, { label: __('Card hover border', 'headless-core') }),
            el(ColorPalette, { value: a.cardHoverBorderColor, colors: palette(), onChange: function (c) { props.setAttributes({ cardHoverBorderColor: c || '#cfeeed' }); } }),
            el(BaseControl, { label: __('Tag bar', 'headless-core') }),
            el(ColorPalette, { value: a.cardTagBarColor, colors: palette(), onChange: function (c) { props.setAttributes({ cardTagBarColor: c || '#F06E2A' }); } }),
            el(BaseControl, { label: __('Tag text', 'headless-core') }),
            el(ColorPalette, { value: a.cardTagTextColor, colors: palette(), onChange: function (c) { props.setAttributes({ cardTagTextColor: c || '#3b4e6b' }); } }),
            el(BaseControl, { label: __('Arrow bg', 'headless-core') }),
            el(ColorPalette, { value: a.arrowBgColor, colors: palette(), onChange: function (c) { props.setAttributes({ arrowBgColor: c || '#82cdcb' }); } }),
            el(BaseControl, { label: __('Arrow hover bg', 'headless-core') }),
            el(ColorPalette, { value: a.arrowHoverBgColor, colors: palette(), onChange: function (c) { props.setAttributes({ arrowHoverBgColor: c || '#ee6e2a' }); } }),
            el(BaseControl, { label: __('Image background gradient (from)', 'headless-core') }),
            el(ColorPalette, { value: a.imageBgFrom, colors: palette(), onChange: function (c) { props.setAttributes({ imageBgFrom: c || '#00B2E0' }); } }),
            el(BaseControl, { label: __('Image background gradient (to)', 'headless-core') }),
            el(ColorPalette, { value: a.imageBgTo, colors: palette(), onChange: function (c) { props.setAttributes({ imageBgTo: c || '#00AB81' }); } })
          )
        ),
        el(
          'div',
          { style: { padding: '16px', border: '1px solid #e5e7eb', borderRadius: '10px', background: a.sectionBgColor || '#F5F4EE' } },
          el('div', { style: { maxWidth: '1100px', margin: '0 auto' } },
            el('div', { style: { textAlign: 'center' } },
              el('div', { style: { color: a.kickerColor || '#22ACB6', fontSize: '12px', marginBottom: '8px' } }, a.kickerText || ''),
              el('span', { style: { display: 'inline-block', background: a.badgeBgColor || '#EE6E2A', color: a.badgeTextColor || '#fff', borderRadius: '999px', padding: '6px 16px', fontSize: '12px', fontWeight: 700 } }, a.badgeText || 'EXPLORE')
            ),
            el('div', { style: { marginTop: '16px' } },
              cards.map(function (card, i) {
                return el(
                  'div',
                  { key: i, style: { padding: '12px', border: '1px solid #eee', borderRadius: '8px', marginTop: '10px', background: '#fff' } },
                  el('div', { style: { display: 'flex', justifyContent: 'space-between', gap: '8px', alignItems: 'center' } },
                    el('strong', null, __('Card', 'headless-core') + ' ' + (i + 1)),
                    el(Button, { variant: 'tertiary', isDestructive: true, onClick: function () { removeCard(i); } }, __('Remove', 'headless-core'))
                  ),
                  el(MediaUploadCheck, null,
                    el(MediaUpload, {
                      allowedTypes: ['image'],
                      value: card.imageId || 0,
                      onSelect: function (media) {
                        setCard(i, { imageId: media && media.id ? media.id : 0, imageUrl: media && media.url ? media.url : '' });
                      },
                      render: function (obj) {
                        return el(Button, { variant: 'secondary', onClick: obj.open }, card.imageId ? __('Replace image', 'headless-core') : __('Select image', 'headless-core'));
                      }
                    })
                  ),
                  card.imageUrl
                    ? el('div', { style: { marginTop: '10px' } },
                      el('img', { src: card.imageUrl, alt: '', style: { width: '180px', height: 'auto', borderRadius: '8px', border: '1px solid #e5e7eb' } })
                    )
                    : null,
                  el('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' } },
                    el('div', null,
                      el(BaseControl, { label: __('Image BG from (optional)', 'headless-core') }),
                      el(ColorPalette, { value: card.imageBgFrom || '', colors: palette(), onChange: function (c) { setCard(i, { imageBgFrom: c || '' }); } })
                    ),
                    el('div', null,
                      el(BaseControl, { label: __('Image BG to (optional)', 'headless-core') }),
                      el(ColorPalette, { value: card.imageBgTo || '', colors: palette(), onChange: function (c) { setCard(i, { imageBgTo: c || '' }); } })
                    )
                  ),
                  el(ToggleControl, {
                    label: __('Image above content (may overlap text)', 'headless-core'),
                    checked: Boolean(card.imageAboveContent),
                    onChange: function (v) { setCard(i, { imageAboveContent: !!v }); },
                  }),
                  el(TextControl, { label: __('Title', 'headless-core'), value: card.title, onChange: function (v) { setCard(i, { title: v }); } }),
                  el(TextareaControl, { label: __('Description', 'headless-core'), value: card.description, onChange: function (v) { setCard(i, { description: v }); } }),
                  el(TextControl, { label: __('Tag', 'headless-core'), value: card.tag, onChange: function (v) { setCard(i, { tag: v }); } }),
                  el(TextControl, { label: __('Link (href)', 'headless-core'), value: card.href, onChange: function (v) { setCard(i, { href: v }); } })
                );
              }),
              el('div', { style: { marginTop: '12px' } },
                el(Button, { variant: 'primary', onClick: addCard }, '+ ', __('Add card', 'headless-core'))
              )
            )
          )
        )
      );
    },
    save: function () { return null; },
  });
})(window.wp.blocks, window.wp.blockEditor, window.wp.components, window.wp.element, window.wp.i18n);

