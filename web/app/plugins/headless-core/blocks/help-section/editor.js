(function (blocks, blockEditor, components, element, i18n) {
  var el = element.createElement;
  var Fragment = element.Fragment;
  var registerBlockType = blocks.registerBlockType;
  var useBlockProps = blockEditor.useBlockProps;
  var InspectorControls = blockEditor.InspectorControls;
  var RichText = blockEditor.RichText;
  var PanelBody = components.PanelBody;
  var TextControl = components.TextControl;
  var SelectControl = components.SelectControl;
  var BaseControl = components.BaseControl;
  var ColorPalette = components.ColorPalette;
  var __ = i18n.__;

  var DEFAULT_CARDS = [
    {
      iconKey: 'apply',
      titleHtml: 'APPLY FOR A LOAN',
      bodyHtml:
        '<p>Looking to buy a car, build a home, start a business, pay for education? Apply for a loan now!</p>',
      ctaMode: 'link',
      ctaLabelHtml: 'Get an Appointment',
      ctaUrl: '',
      whatsappUrl: '',
      phone: '',
      email: '',
    },
    {
      iconKey: 'call',
      titleHtml: 'CALL US!',
      bodyHtml: '',
      ctaMode: 'link',
      ctaLabelHtml: 'Contact us',
      ctaUrl: '',
      whatsappUrl: '',
      phone: '+254 111 173 000',
      email: 'info@portsacco.co.ke',
    },
    {
      iconKey: 'advisor',
      titleHtml: 'TALK TO AN ADVISOR',
      bodyHtml: '<p>Do you need financial planning? Talk to our advisors.</p>',
      ctaMode: 'whatsapp',
      ctaLabelHtml: '',
      ctaUrl: '',
      whatsappUrl: '',
      phone: '',
      email: '',
    },
  ];

  function normalizeCards(items) {
    var src = Array.isArray(items) && items.length ? items.slice(0, 3) : [];
    var out = [];
    for (var i = 0; i < 3; i++) {
      var row = src[i];
      var d = DEFAULT_CARDS[i];
      if (!row) {
        out.push(Object.assign({}, d));
        continue;
      }
      out.push({
        iconKey: ['apply', 'call', 'advisor'].indexOf(String(row.iconKey || '')) >= 0 ? String(row.iconKey) : d.iconKey,
        titleHtml: row.titleHtml != null ? String(row.titleHtml) : d.titleHtml,
        bodyHtml: row.bodyHtml != null ? String(row.bodyHtml) : d.bodyHtml,
        ctaMode: ['link', 'whatsapp', 'none'].indexOf(String(row.ctaMode || '')) >= 0 ? String(row.ctaMode) : d.ctaMode,
        ctaLabelHtml: row.ctaLabelHtml != null ? String(row.ctaLabelHtml) : d.ctaLabelHtml,
        ctaUrl: row.ctaUrl != null ? String(row.ctaUrl) : d.ctaUrl,
        whatsappUrl: row.whatsappUrl != null ? String(row.whatsappUrl) : d.whatsappUrl,
        phone: row.phone != null ? String(row.phone) : d.phone,
        email: row.email != null ? String(row.email) : d.email,
      });
    }
    return out;
  }

  function patchCard(cards, index, patch) {
    var next = cards.slice();
    next[index] = Object.assign({}, next[index], patch);
    return next;
  }

  registerBlockType('custom/help-section', {
    apiVersion: 3,
    title: __('Help section', 'headless-core'),
    icon: 'megaphone',
    category: 'widgets',
    description: __('“We are here to help” strip with three cards (home / landing).', 'headless-core'),
    attributes: {
      sectionId: { type: 'string', default: 'help' },
      sectionBgColor: { type: 'string', default: '#00AFBB' },
      topBarBg: { type: 'string', default: '#FFFFFF' },
      waveAccentColor: { type: 'string', default: '#00AFBB' },
      scrollOuterColor: { type: 'string', default: '#ffffff' },
      scrollInnerColor: { type: 'string', default: '#22ACB6' },
      kickerHtml: { type: 'string', default: '<p>WE ARE HERE TO HELP YOU</p>' },
      kickerColor: { type: 'string', default: '#ffffff' },
      talkButtonHtml: { type: 'string', default: 'TALK TO US!' },
      talkButtonBg: { type: 'string', default: '#EE6E2A' },
      talkButtonTextColor: { type: 'string', default: '#ffffff' },
      cardIconColor: { type: 'string', default: '#22acb6' },
      cardIconHoverColor: { type: 'string', default: '#EE6E2A' },
      cardBgHoverColor: { type: 'string', default: '#f0fdfa' },
      titleHeadingColor: { type: 'string', default: '#808080' },
      bodyTextColor: { type: 'string', default: '#000000' },
      metaTextColor: { type: 'string', default: '#808080' },
      ctaTextColor: { type: 'string', default: '#808080' },
      cardChevronBg: { type: 'string', default: '#ffffff' },
      cardChevronBgHover: { type: 'string', default: '#ffffff' },
      cardChevronIconColor: { type: 'string', default: '#22acb6' },
      cardChevronIconHoverColor: { type: 'string', default: '#ee6e2a' },
      cards: { type: 'array', default: DEFAULT_CARDS },
    },
    edit: function (props) {
      var blockProps = useBlockProps({ className: 'headless-help-section-block' });
      var a = props.attributes;
      var cards = normalizeCards(a.cards);
      var colors = ['#00AFBB', '#22ACB6', '#22acb6', '#EE6E2A', '#ffffff', '#000000', '#808080', '#3b4e6b'];

      function palette() {
        return colors.map(function (hex) {
          return { color: hex, name: hex };
        });
      }

      function setCards(next) {
        props.setAttributes({ cards: next });
      }

      var cardInspectorBox = {
        border: '1px solid #ddd',
        borderRadius: '2px',
        padding: '12px',
        background: '#fff',
        color: '#1e1e1e',
        minWidth: 0,
      };

      /** Same fields as the former sidebar “Card N” panels, shown in the block preview. */
      function cardEditorInline(index) {
        var c = cards[index];
        var label = __('Card', 'headless-core') + ' ' + (index + 1);
        return el(
          'div',
          { key: 'help-card-editor-' + index, style: cardInspectorBox },
          el(
            'div',
            {
              style: {
                fontSize: '13px',
                fontWeight: 600,
                marginBottom: '12px',
                paddingBottom: '8px',
                borderBottom: '1px solid #ddd',
              },
            },
            label
          ),
          el(RichText, {
            tagName: 'h3',
            value: c.titleHtml || '',
            onChange: function (v) {
              setCards(patchCard(cards, index, { titleHtml: v }));
            },
            placeholder: __('Title…', 'headless-core'),
            allowedFormats: ['core/bold', 'core/italic'],
            style: { fontSize: '13px', margin: '0 0 8px 0' },
          }),
          el(RichText, {
            tagName: 'div',
            value: c.bodyHtml || '',
            onChange: function (v) {
              setCards(patchCard(cards, index, { bodyHtml: v }));
            },
            placeholder: __('Description (optional)…', 'headless-core'),
            allowedFormats: ['core/bold', 'core/italic'],
            style: { marginBottom: '8px', fontSize: '13px' },
          }),
          c.ctaMode === 'link'
            ? el(RichText, {
                tagName: 'div',
                value: c.ctaLabelHtml || '',
                onChange: function (v) {
                  setCards(patchCard(cards, index, { ctaLabelHtml: v }));
                },
                placeholder: __('Link label…', 'headless-core'),
                allowedFormats: ['core/bold', 'core/italic'],
                style: { marginBottom: '12px', fontSize: '13px' },
              })
            : null,
          el(SelectControl, {
            label: __('Icon', 'headless-core'),
            value: c.iconKey,
            options: [
              { label: __('Apply / loan', 'headless-core'), value: 'apply' },
              { label: __('Phone', 'headless-core'), value: 'call' },
              { label: __('Advisor', 'headless-core'), value: 'advisor' },
            ],
            onChange: function (v) {
              setCards(patchCard(cards, index, { iconKey: v }));
            },
          }),
          el(TextControl, {
            label: __('Phone (optional)', 'headless-core'),
            value: c.phone || '',
            onChange: function (v) {
              setCards(patchCard(cards, index, { phone: v }));
            },
          }),
          el(TextControl, {
            label: __('Email (optional)', 'headless-core'),
            value: c.email || '',
            onChange: function (v) {
              setCards(patchCard(cards, index, { email: v }));
            },
          }),
          el(SelectControl, {
            label: __('Bottom CTA type', 'headless-core'),
            value: c.ctaMode,
            options: [
              { label: __('Link / underline', 'headless-core'), value: 'link' },
              { label: __('WhatsApp graphic', 'headless-core'), value: 'whatsapp' },
              { label: __('None', 'headless-core'), value: 'none' },
            ],
            onChange: function (v) {
              setCards(patchCard(cards, index, { ctaMode: v }));
            },
          }),
          c.ctaMode === 'link'
            ? el(TextControl, {
                label: __('Link URL', 'headless-core'),
                value: c.ctaUrl || '',
                onChange: function (v) {
                  setCards(patchCard(cards, index, { ctaUrl: v }));
                },
                help: __('Leave empty for a non-clickable label.', 'headless-core'),
              })
            : null,
          c.ctaMode === 'whatsapp'
            ? el(TextControl, {
                label: __('WhatsApp link URL', 'headless-core'),
                value: c.whatsappUrl || '',
                onChange: function (v) {
                  setCards(patchCard(cards, index, { whatsappUrl: v }));
                },
                help: __('Full https://wa.me/… or https://api.whatsapp.com/… URL.', 'headless-core'),
              })
            : null
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
              label: __('Section ID', 'headless-core'),
              value: a.sectionId || 'help',
              onChange: function (v) {
                props.setAttributes({ sectionId: v });
              },
            }),
            el(BaseControl, { label: __('Section background', 'headless-core') }),
            el(ColorPalette, {
              value: a.sectionBgColor,
              colors: palette(),
              onChange: function (c) {
                props.setAttributes({ sectionBgColor: c || '#00AFBB' });
              },
            }),
            el(BaseControl, { label: __('Top bar (white strip)', 'headless-core') }),
            el(ColorPalette, {
              value: a.topBarBg,
              colors: palette(),
              onChange: function (c) {
                props.setAttributes({ topBarBg: c || '#FFFFFF' });
              },
            }),
            el(BaseControl, { label: __('Wave accent (center tab)', 'headless-core') }),
            el(ColorPalette, {
              value: a.waveAccentColor,
              colors: palette(),
              onChange: function (c) {
                props.setAttributes({ waveAccentColor: c || '#00AFBB' });
              },
            })
          ),
          el(
            PanelBody,
            { title: __('Scroll button', 'headless-core'), initialOpen: false },
            el(BaseControl, { label: __('Outer ring', 'headless-core') }),
            el(ColorPalette, {
              value: a.scrollOuterColor,
              colors: palette(),
              onChange: function (c) {
                props.setAttributes({ scrollOuterColor: c || '#ffffff' });
              },
            }),
            el(BaseControl, { label: __('Inner fill', 'headless-core') }),
            el(ColorPalette, {
              value: a.scrollInnerColor,
              colors: palette(),
              onChange: function (c) {
                props.setAttributes({ scrollInnerColor: c || '#22ACB6' });
              },
            })
          ),
          el(
            PanelBody,
            { title: __('Kicker & badge', 'headless-core'), initialOpen: true },
            el(BaseControl, {
              label: __('Kicker text', 'headless-core'),
              help: __('Same as Partners carousel — color for the left headline.', 'headless-core'),
            }),
            el(ColorPalette, {
              value: a.kickerColor != null && a.kickerColor !== '' ? a.kickerColor : '#ffffff',
              colors: palette(),
              onChange: function (c) {
                props.setAttributes({ kickerColor: c || '#ffffff' });
              },
            }),
            el(BaseControl, { label: __('Badge background', 'headless-core') }),
            el(ColorPalette, {
              value: a.talkButtonBg,
              colors: palette(),
              onChange: function (c) {
                props.setAttributes({ talkButtonBg: c || '#EE6E2A' });
              },
            }),
            el(BaseControl, { label: __('Badge text', 'headless-core') }),
            el(ColorPalette, {
              value: a.talkButtonTextColor,
              colors: palette(),
              onChange: function (c) {
                props.setAttributes({ talkButtonTextColor: c || '#ffffff' });
              },
            })
          ),
          el(
            PanelBody,
            { title: __('Cards', 'headless-core'), initialOpen: false },
            el(BaseControl, { label: __('Card icons (default)', 'headless-core') }),
            el(ColorPalette, {
              value: a.cardIconColor,
              colors: palette(),
              onChange: function (c) {
                props.setAttributes({ cardIconColor: c || '#22acb6' });
              },
            }),
            el(BaseControl, { label: __('Card icons (on hover)', 'headless-core') }),
            el(ColorPalette, {
              value: a.cardIconHoverColor != null && a.cardIconHoverColor !== '' ? a.cardIconHoverColor : '#EE6E2A',
              colors: palette(),
              onChange: function (c) {
                props.setAttributes({ cardIconHoverColor: c || '#EE6E2A' });
              },
            }),
            el(BaseControl, { label: __('Card background (on hover)', 'headless-core') }),
            el(ColorPalette, {
              value: a.cardBgHoverColor != null && a.cardBgHoverColor !== '' ? a.cardBgHoverColor : '#f0fdfa',
              colors: palette(),
              onChange: function (c) {
                props.setAttributes({ cardBgHoverColor: c || '#f0fdfa' });
              },
            }),
            el(BaseControl, { label: __('Card title', 'headless-core') }),
            el(ColorPalette, {
              value: a.titleHeadingColor,
              colors: palette(),
              onChange: function (c) {
                props.setAttributes({ titleHeadingColor: c || '#808080' });
              },
            }),
            el(BaseControl, { label: __('Card body', 'headless-core') }),
            el(ColorPalette, {
              value: a.bodyTextColor,
              colors: palette(),
              onChange: function (c) {
                props.setAttributes({ bodyTextColor: c || '#000000' });
              },
            }),
            el(BaseControl, { label: __('Phone / email', 'headless-core') }),
            el(ColorPalette, {
              value: a.metaTextColor,
              colors: palette(),
              onChange: function (c) {
                props.setAttributes({ metaTextColor: c || '#808080' });
              },
            }),
            el(BaseControl, { label: __('Link CTA text', 'headless-core') }),
            el(ColorPalette, {
              value: a.ctaTextColor,
              colors: palette(),
              onChange: function (c) {
                props.setAttributes({ ctaTextColor: c || '#808080' });
              },
            })
          ),
          el(
            PanelBody,
            { title: __('Card corner arrow', 'headless-core'), initialOpen: false },
            el(BaseControl, { label: __('Circle background', 'headless-core') }),
            el(ColorPalette, {
              value: a.cardChevronBg != null && a.cardChevronBg !== '' ? a.cardChevronBg : '#ffffff',
              colors: palette(),
              onChange: function (c) {
                props.setAttributes({ cardChevronBg: c || '#ffffff' });
              },
            }),
            el(BaseControl, { label: __('Circle background (on hover)', 'headless-core') }),
            el(ColorPalette, {
              value: a.cardChevronBgHover != null && a.cardChevronBgHover !== '' ? a.cardChevronBgHover : '#ffffff',
              colors: palette(),
              onChange: function (c) {
                props.setAttributes({ cardChevronBgHover: c || '#ffffff' });
              },
            }),
            el(BaseControl, { label: __('Icon color', 'headless-core') }),
            el(ColorPalette, {
              value: a.cardChevronIconColor != null && a.cardChevronIconColor !== '' ? a.cardChevronIconColor : '#22acb6',
              colors: palette(),
              onChange: function (c) {
                props.setAttributes({ cardChevronIconColor: c || '#22acb6' });
              },
            }),
            el(BaseControl, { label: __('Icon color on card hover', 'headless-core') }),
            el(ColorPalette, {
              value: a.cardChevronIconHoverColor != null && a.cardChevronIconHoverColor !== '' ? a.cardChevronIconHoverColor : '#ee6e2a',
              colors: palette(),
              onChange: function (c) {
                props.setAttributes({ cardChevronIconHoverColor: c || '#ee6e2a' });
              },
            })
          )
        ),
        el(
          'div',
          blockProps,
          el(
            'div',
            {
              style: {
                border: '1px solid #e5e7eb',
                borderRadius: '10px',
                overflow: 'hidden',
                background: a.sectionBgColor || '#00AFBB',
              },
            },
            el('div', { style: { height: '36px', background: a.topBarBg || '#fff' } }),
            el('div', { style: { padding: '12px 16px 16px', color: '#fff' } },
              el(
                'div',
                {
                  style: {
                    display: 'grid',
                    gridTemplateColumns: 'minmax(0,1fr) auto minmax(0,1fr)',
                    gap: '16px',
                    alignItems: 'end',
                    marginBottom: '12px',
                  },
                },
                el(RichText, {
                  tagName: 'div',
                  value: a.kickerHtml || '',
                  onChange: function (v) {
                    props.setAttributes({ kickerHtml: v });
                  },
                  placeholder: __('Kicker…', 'headless-core'),
                  allowedFormats: ['core/bold', 'core/italic'],
                  style: {
                    minWidth: 0,
                    fontSize: '13px',
                    fontWeight: 500,
                    textTransform: 'uppercase',
                    textAlign: 'left',
                    margin: 0,
                    color: a.kickerColor != null && a.kickerColor !== '' ? a.kickerColor : '#ffffff',
                  },
                }),
                el(
                  'div',
                  {
                    style: {
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      gap: a.talkButtonHtml ? '50px' : '0',
                      flexShrink: 0,
                    },
                  },
                  el(
                    'div',
                    {
                      style: {
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        border: '2px solid rgba(255,255,255,0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '18px',
                        lineHeight: 1,
                        opacity: 0.85,
                      },
                    },
                    '↓'
                  ),
                  el(RichText, {
                    tagName: 'div',
                    value: a.talkButtonHtml || '',
                    onChange: function (v) {
                      props.setAttributes({ talkButtonHtml: v });
                    },
                    placeholder: __('Badge…', 'headless-core'),
                    allowedFormats: ['core/bold', 'core/italic'],
                    style: {
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '0 24px',
                      minHeight: '36px',
                      borderRadius: '999px',
                      fontSize: '12px',
                      fontWeight: 600,
                      boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
                      margin: 0,
                      background: a.talkButtonBg || '#EE6E2A',
                      color: a.talkButtonTextColor || '#ffffff',
                    },
                  })
                ),
                el('div', { style: { minWidth: 0 } })
              ),
              el(
                'div',
                { style: { marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.25)' } },
                el(
                  'div',
                  { style: { fontSize: '12px', fontWeight: 600, marginBottom: '10px', opacity: 0.95 } },
                  __('Cards', 'headless-core')
                ),
                el(
                  'div',
                  {
                    style: {
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                      gap: '12px',
                    },
                  },
                  cardEditorInline(0),
                  cardEditorInline(1),
                  cardEditorInline(2)
                )
              )
            )
          )
        )
      );
    },
    save: function () {
      return null;
    },
  });
})(window.wp.blocks, window.wp.blockEditor, window.wp.components, window.wp.element, window.wp.i18n);
