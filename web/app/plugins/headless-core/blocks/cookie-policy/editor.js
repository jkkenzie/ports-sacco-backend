(function (blocks, blockEditor, components, element, i18n) {
  var el = element.createElement;
  var useEffect = element.useEffect;
  var useState = element.useState;
  var Fragment = element.Fragment;
  var registerBlockType = blocks.registerBlockType;
  var useBlockProps = blockEditor.useBlockProps;
  var InspectorControls = blockEditor.InspectorControls;
  var RichText = blockEditor.RichText;
  var Button = components.Button;
  var TextControl = components.TextControl;
  var PanelBody = components.PanelBody;
  var BaseControl = components.BaseControl;
  var ColorPalette = components.ColorPalette;
  var __ = i18n.__;
  var cc = window.headlessCoreColorControls || {};

  var DESC_FORMATS = ['core/bold', 'core/italic', 'core/link'];

  var boot = window.headlessCookiePolicyDefaults || {};
  var DEFAULT_SECTION_TITLE = boot.sectionTitle || 'Cookie Policy';
  var DEFAULT_SECTION_INTRO = boot.sectionIntro || '';
  var DEFAULT_SECTIONS = Array.isArray(boot.sections) ? boot.sections : [];

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

  function makeSectionId() {
    return 'cp-' + Date.now() + '-' + Math.random().toString(36).slice(2, 9);
  }

  function decodeBasicEntities(html) {
    return String(html || '')
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .replace(/&apos;/g, "'")
      .replace(/&#39;/g, "'")
      .replace(/&amp;/g, '&');
  }

  function stripTags(html) {
    return String(html || '')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function extractBulletsFromHtml(html) {
    var source = String(html || '');
    var bullets = [];
    var re = /<li\b[^>]*>([\s\S]*?)<\/li>/gi;
    var match;
    while ((match = re.exec(source))) {
      var text = decodeBasicEntities(stripTags(match[1]));
      if (text) {
        bullets.push(text);
      }
    }
    return bullets;
  }

  function stripListsFromHtml(html) {
    return String(html || '')
      .replace(/<ul\b[^>]*>[\s\S]*?<\/ul>/gi, '')
      .replace(/<ol\b[^>]*>[\s\S]*?<\/ol>/gi, '')
      .trim();
  }

  function normalizeBullets(bullets) {
    if (!Array.isArray(bullets)) {
      return [];
    }
    return bullets.map(function (b) {
      return String(b != null ? b : '');
    });
  }

  function defaultSection() {
    return { id: makeSectionId(), title: '', content: '', bullets: [''], contentAfter: '' };
  }

  function normalizeSection(section, index) {
    var row = section && typeof section === 'object' ? section : {};
    var id = row.id ? String(row.id) : ('cp-pending-' + index);
    var rawContent = String(row.content != null ? row.content : '');
    var rawAfter = String(row.contentAfter != null ? row.contentAfter : '');
    var bullets = normalizeBullets(row.bullets);
    var content = decodeBasicEntities(rawContent);
    var contentAfter = decodeBasicEntities(rawAfter);

    // Migrate legacy HTML lists into editable bullet fields.
    if (!bullets.length) {
      var extracted = extractBulletsFromHtml(content);
      if (extracted.length) {
        bullets = extracted;
        content = stripListsFromHtml(content);
      }
    } else {
      content = stripListsFromHtml(content);
    }
    contentAfter = stripListsFromHtml(contentAfter);

    return {
      id: id,
      title: String(row.title != null ? row.title : ''),
      content: content,
      bullets: bullets,
      contentAfter: contentAfter,
    };
  }

  function normalizeSections(sections) {
    var src = Array.isArray(sections) && sections.length ? sections : DEFAULT_SECTIONS;
    return src.map(normalizeSection);
  }

  function ensureSectionIds(sections) {
    var changed = false;
    var next = sections.map(function (section, index) {
      var normalized = normalizeSection(section, index);
      if (normalized.id && normalized.id.indexOf('cp-pending-') !== 0) {
        return normalized;
      }
      changed = true;
      return Object.assign({}, normalized, { id: makeSectionId() });
    });
    return { sections: next, changed: changed };
  }

  function sectionsNeedMigration(sections) {
    if (!Array.isArray(sections)) {
      return false;
    }
    return sections.some(function (section) {
      if (!section || typeof section !== 'object') {
        return false;
      }
      var hasBulletsAttr = Object.prototype.hasOwnProperty.call(section, 'bullets');
      var content = String(section.content || '');
      if (!hasBulletsAttr && /<li\b/i.test(content)) {
        return true;
      }
      if (/&quot;|&#039;|&apos;|&#39;/.test(content)) {
        return true;
      }
      return false;
    });
  }

  function patchSection(sections, index, patch) {
    var next = sections.slice();
    next[index] = Object.assign({}, next[index], patch);
    return next;
  }

  function patchBullet(sections, sectionIndex, bulletIndex, value) {
    var section = sections[sectionIndex];
    var bullets = normalizeBullets(section.bullets).slice();
    bullets[bulletIndex] = value;
    return patchSection(sections, sectionIndex, { bullets: bullets });
  }

  function addBullet(sections, sectionIndex, atIndex) {
    var section = sections[sectionIndex];
    var bullets = normalizeBullets(section.bullets).slice();
    var insertAt = typeof atIndex === 'number' ? atIndex : bullets.length;
    bullets.splice(insertAt, 0, '');
    return patchSection(sections, sectionIndex, { bullets: bullets });
  }

  function removeBullet(sections, sectionIndex, bulletIndex) {
    var section = sections[sectionIndex];
    var bullets = normalizeBullets(section.bullets).slice();
    if (!bullets.length) {
      return sections;
    }
    bullets.splice(bulletIndex, 1);
    return patchSection(sections, sectionIndex, { bullets: bullets });
  }

  function moveBullet(sections, sectionIndex, fromIndex, toIndex) {
    var section = sections[sectionIndex];
    var bullets = normalizeBullets(section.bullets).slice();
    if (fromIndex < 0 || toIndex < 0 || fromIndex >= bullets.length || toIndex >= bullets.length) {
      return sections;
    }
    var item = bullets.splice(fromIndex, 1)[0];
    bullets.splice(toIndex, 0, item);
    return patchSection(sections, sectionIndex, { bullets: bullets });
  }

  function insertSectionAt(sections, index) {
    var next = sections.slice();
    next.splice(index, 0, defaultSection());
    return next;
  }

  function removeSection(sections, index) {
    if (sections.length <= 1) {
      return sections;
    }
    var next = sections.slice();
    next.splice(index, 1);
    return next;
  }

  function moveSection(sections, fromIndex, toIndex) {
    if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0) {
      return sections;
    }
    if (fromIndex >= sections.length || toIndex > sections.length) {
      return sections;
    }
    var next = sections.slice();
    var item = next.splice(fromIndex, 1)[0];
    var insertAt = toIndex > fromIndex ? toIndex - 1 : toIndex;
    next.splice(insertAt, 0, item);
    return next;
  }

  function InsertBetween(props) {
    var onInsert = props.onInsert;
    var label = props.label;
    return el(
      'div',
      {
        className: 'headless-pp-insert-between',
        style: {
          position: 'relative',
          height: '28px',
          margin: '4px 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
      },
      el('div', {
        style: {
          position: 'absolute',
          left: 0,
          right: 0,
          top: '50%',
          height: '1px',
          background: '#e2e8f0',
        },
      }),
      el(
        Button,
        {
          variant: 'secondary',
          isSmall: true,
          onClick: onInsert,
          style: {
            position: 'relative',
            zIndex: 1,
            fontSize: '11px',
            height: '24px',
            background: '#fff',
          },
        },
        label || __('+ Add section here', 'headless-core')
      )
    );
  }

  registerBlockType('custom/cookie-policy', {
    apiVersion: 3,
    title: __('Cookie Policy', 'headless-core'),
    icon: 'lock',
    category: 'widgets',
    description: __('Modern cookie policy page with drag-and-drop reorderable sections and editable bullet lists.', 'headless-core'),
    attributes: {
      sectionTitle: { type: 'string', default: DEFAULT_SECTION_TITLE },
      sectionIntro: { type: 'string', default: DEFAULT_SECTION_INTRO },
      sectionBgColor: { type: 'string', default: '#ffffff' },
      cardBgColor: { type: 'string', default: '#f8fafc' },
      accentColor: { type: 'string', default: '#22acb6' },
      headingColor: { type: 'string', default: '#22acb6' },
      titleColor: { type: 'string', default: '#1e293b' },
      bodyColor: { type: 'string', default: '#334155' },
      borderColor: { type: 'string', default: '#e2e8f0' },
      sections: { type: 'array', default: DEFAULT_SECTIONS },
    },
    edit: function (props) {
      var a = props.attributes;
      var sections = normalizeSections(a.sections);
      var dragState = useState(null);
      var dragFrom = dragState[0];
      var setDragFrom = dragState[1];
      var overState = useState(null);
      var dropOver = overState[0];
      var setDropOver = overState[1];

      useEffect(function () {
        var sectionsIn = Array.isArray(props.attributes.sections) ? props.attributes.sections : [];
        if (!sectionsIn.length) {
          if (DEFAULT_SECTIONS.length) {
            props.setAttributes({ sections: normalizeSections(DEFAULT_SECTIONS) });
          }
          return;
        }
        var normalized = normalizeSections(sectionsIn);
        var idResult = ensureSectionIds(normalized);
        if (idResult.changed || sectionsNeedMigration(sectionsIn)) {
          props.setAttributes({ sections: idResult.sections });
        }
      }, []);

      var blockProps = useBlockProps({
        className: 'headless-cookie-policy-block',
        style: {
          background: a.sectionBgColor || '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '20px',
        },
      });

      function setSections(next) {
        props.setAttributes({ sections: next });
      }

      function onDragStart(index, event) {
        setDragFrom(index);
        event.dataTransfer.effectAllowed = 'move';
        try {
          event.dataTransfer.setData('text/plain', String(index));
        } catch (err) {
          // IE / restricted contexts
        }
      }

      function onDragEnd() {
        setDragFrom(null);
        setDropOver(null);
      }

      function onDragOverSlot(slotIndex, event) {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
        if (dropOver !== slotIndex) {
          setDropOver(slotIndex);
        }
      }

      function onDropAtSlot(slotIndex, event) {
        event.preventDefault();
        var from = dragFrom;
        if (from == null) {
          try {
            from = parseInt(event.dataTransfer.getData('text/plain'), 10);
          } catch (err) {
            from = NaN;
          }
        }
        if (isNaN(from)) {
          onDragEnd();
          return;
        }
        setSections(moveSection(sections, from, slotIndex));
        onDragEnd();
      }

      return el(
        Fragment,
        null,
        cc.panel
          ? cc.panel(el, InspectorControls, PanelBody, BaseControl, ColorPalette, i18n, [
              { label: __('Section background', 'headless-core'), value: a.sectionBgColor, fallback: '#ffffff', onChange: function (c) { props.setAttributes({ sectionBgColor: c }); } },
              { label: __('Card background', 'headless-core'), value: a.cardBgColor, fallback: '#f8fafc', onChange: function (c) { props.setAttributes({ cardBgColor: c }); } },
              { label: __('Accent', 'headless-core'), value: a.accentColor, fallback: '#22acb6', onChange: function (c) { props.setAttributes({ accentColor: c }); } },
              { label: __('Page heading', 'headless-core'), value: a.headingColor, fallback: '#22acb6', onChange: function (c) { props.setAttributes({ headingColor: c }); } },
              { label: __('Section title', 'headless-core'), value: a.titleColor, fallback: '#1e293b', onChange: function (c) { props.setAttributes({ titleColor: c }); } },
              { label: __('Body text', 'headless-core'), value: a.bodyColor, fallback: '#334155', onChange: function (c) { props.setAttributes({ bodyColor: c }); } },
              { label: __('Border', 'headless-core'), value: a.borderColor, fallback: '#e2e8f0', onChange: function (c) { props.setAttributes({ borderColor: c }); } },
            ], { extraColors: PALETTE })
          : null,
        el(
          'div',
          blockProps,
        el(RichText, {
          tagName: 'h2',
          value: a.sectionTitle || '',
          onChange: function (v) {
            props.setAttributes({ sectionTitle: v });
          },
          allowedFormats: [],
          placeholder: __('Cookie policy title…', 'headless-core'),
          style: {
            margin: '0 0 8px',
            color: a.headingColor || '#22acb6',
            fontSize: '28px',
            fontWeight: '700',
          },
        }),
        el(RichText, {
          tagName: 'div',
          multiline: 'p',
          value: a.sectionIntro || '',
          onChange: function (v) {
            props.setAttributes({ sectionIntro: v });
          },
          allowedFormats: [],
          placeholder: __('Intro paragraphs…', 'headless-core'),
          style: {
            margin: '0 0 20px',
            color: a.bodyColor || '#334155',
            lineHeight: '1.6',
            minHeight: '72px',
            padding: '10px 12px',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            background: '#fff',
          },
        }),
        el(
          'div',
          {
            onDragOver: function (event) {
              onDragOverSlot(0, event);
            },
            onDrop: function (event) {
              onDropAtSlot(0, event);
            },
            style: {
              borderTop: dropOver === 0 ? '3px solid ' + (a.accentColor || '#22acb6') : '3px solid transparent',
              transition: 'border-color 0.15s ease',
            },
          },
          el(InsertBetween, {
            onInsert: function () {
              setSections(insertSectionAt(sections, 0));
            },
          })
        ),
        sections.map(function (section, index) {
          var sectionId = section.id || ('cp-pending-' + index);
          var isDragging = dragFrom === index;
          var bullets = normalizeBullets(section.bullets);

          return el(
            Fragment,
            { key: sectionId },
            el(
              'div',
              {
                style: {
                  marginBottom: '4px',
                  padding: '16px',
                  background: a.cardBgColor || '#f8fafc',
                  border: '1px solid ' + (a.borderColor || '#e2e8f0'),
                  borderRadius: '12px',
                  boxShadow: isDragging ? '0 8px 24px rgba(15,23,42,0.12)' : '0 1px 3px rgba(15,23,42,0.06)',
                  opacity: isDragging ? 0.55 : 1,
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
                    marginBottom: '12px',
                    paddingBottom: '10px',
                    borderBottom: '2px solid ' + (a.accentColor || '#22acb6'),
                  },
                },
                el(
                  'div',
                  { style: { display: 'flex', alignItems: 'center', gap: '10px', flex: '1 1 auto', minWidth: 0 } },
                  el(
                    'span',
                    {
                      title: __('Drag to reorder', 'headless-core'),
                      draggable: true,
                      onDragStart: function (event) {
                        onDragStart(index, event);
                      },
                      onDragEnd: onDragEnd,
                      style: {
                        display: 'inline-flex',
                        padding: '4px 6px',
                        borderRadius: '6px',
                        background: '#fff',
                        border: '1px solid #e2e8f0',
                        color: '#64748b',
                        cursor: 'grab',
                        flexShrink: 0,
                        lineHeight: 1,
                        fontSize: '10px',
                        letterSpacing: '1px',
                        userSelect: 'none',
                      },
                    },
                    '⋮⋮'
                  ),
                  el('span', {
                    style: {
                      fontSize: '11px',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      color: a.accentColor || '#22acb6',
                      flexShrink: 0,
                    },
                  }, __('Section', 'headless-core') + ' ' + (index + 1)),
                  el(RichText, {
                    identifier: 'cp-title-' + sectionId,
                    tagName: 'h3',
                    value: section.title || '',
                    onChange: function (v) {
                      setSections(patchSection(sections, index, { title: v }));
                    },
                    allowedFormats: [],
                    placeholder: __('Section title…', 'headless-core'),
                    style: {
                      margin: 0,
                      flex: '1 1 auto',
                      color: a.titleColor || '#1e293b',
                      fontSize: '18px',
                      fontWeight: '700',
                    },
                  })
                ),
                sections.length > 1
                  ? el(Button, {
                    variant: 'tertiary',
                    isDestructive: true,
                    isSmall: true,
                    onClick: function () {
                      setSections(removeSection(sections, index));
                    },
                  }, __('Remove', 'headless-core'))
                  : null
              ),
              el('p', {
                style: { margin: '0 0 6px', fontSize: '11px', color: '#64748b' },
              }, __('Description', 'headless-core')),
              el(RichText, {
                identifier: 'cp-content-' + sectionId,
                tagName: 'div',
                multiline: 'p',
                value: section.content || '',
                onChange: function (v) {
                  setSections(patchSection(sections, index, { content: v }));
                },
                allowedFormats: DESC_FORMATS,
                placeholder: __('Section description…', 'headless-core'),
                style: {
                  margin: '0 0 14px',
                  color: a.bodyColor || '#334155',
                  fontSize: '14px',
                  lineHeight: '1.6',
                  minHeight: '56px',
                  padding: '10px 12px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  background: '#fff',
                },
              }),
              el('p', {
                style: { margin: '0 0 8px', fontSize: '11px', color: '#64748b' },
              }, __('Bullets (optional)', 'headless-core')),
              bullets.map(function (bullet, bulletIndex) {
                return el(
                  'div',
                  {
                    key: sectionId + '-bullet-' + bulletIndex,
                    style: {
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '8px',
                      marginBottom: '8px',
                    },
                  },
                  el('span', {
                    style: {
                      marginTop: '10px',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: a.accentColor || '#22acb6',
                      flexShrink: 0,
                    },
                  }),
                  el(
                    'div',
                    { style: { flex: '1 1 auto', minWidth: 0 } },
                    el(TextControl, {
                      value: bullet,
                      onChange: function (v) {
                        setSections(patchBullet(sections, index, bulletIndex, v));
                      },
                      placeholder: __('Bullet text…', 'headless-core'),
                      __nextHasNoMarginBottom: true,
                    })
                  ),
                  el(
                    'div',
                    { style: { display: 'flex', gap: '2px', flexShrink: 0, marginTop: '4px' } },
                    bullets.length > 1
                      ? el(Button, {
                        variant: 'tertiary',
                        isSmall: true,
                        disabled: bulletIndex === 0,
                        label: __('Move bullet up', 'headless-core'),
                        onClick: function () {
                          setSections(moveBullet(sections, index, bulletIndex, bulletIndex - 1));
                        },
                      }, '˄')
                      : null,
                    bullets.length > 1
                      ? el(Button, {
                        variant: 'tertiary',
                        isSmall: true,
                        disabled: bulletIndex === bullets.length - 1,
                        label: __('Move bullet down', 'headless-core'),
                        onClick: function () {
                          setSections(moveBullet(sections, index, bulletIndex, bulletIndex + 1));
                        },
                      }, '˅')
                      : null,
                    el(Button, {
                      variant: 'tertiary',
                      isDestructive: true,
                      isSmall: true,
                      label: __('Remove bullet', 'headless-core'),
                      onClick: function () {
                        setSections(removeBullet(sections, index, bulletIndex));
                      },
                    }, '×')
                  )
                );
              }),
              el(
                Button,
                {
                  variant: 'secondary',
                  isSmall: true,
                  onClick: function () {
                    setSections(addBullet(sections, index));
                  },
                  style: { marginTop: '4px' },
                },
                __('Add bullet', 'headless-core')
              ),
              el('p', {
                style: { margin: '14px 0 6px', fontSize: '11px', color: '#64748b' },
              }, __('Notes after bullets (optional)', 'headless-core')),
              el(RichText, {
                identifier: 'cp-after-' + sectionId,
                tagName: 'div',
                multiline: 'p',
                value: section.contentAfter || '',
                onChange: function (v) {
                  setSections(patchSection(sections, index, { contentAfter: v }));
                },
                allowedFormats: DESC_FORMATS,
                placeholder: __('Optional text after the bullet list…', 'headless-core'),
                style: {
                  margin: 0,
                  color: a.bodyColor || '#334155',
                  fontSize: '14px',
                  lineHeight: '1.6',
                  minHeight: '40px',
                  padding: '10px 12px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  background: '#fff',
                },
              })
            ),
            el(
              'div',
              {
                onDragOver: function (event) {
                  onDragOverSlot(index + 1, event);
                },
                onDrop: function (event) {
                  onDropAtSlot(index + 1, event);
                },
                style: {
                  borderTop: dropOver === index + 1 ? '3px solid ' + (a.accentColor || '#22acb6') : '3px solid transparent',
                  transition: 'border-color 0.15s ease',
                },
              },
              el(InsertBetween, {
                onInsert: function () {
                  setSections(insertSectionAt(sections, index + 1));
                },
              })
            )
          );
        }),
        el(
          Button,
          {
            variant: 'primary',
            onClick: function () {
              setSections(sections.concat([defaultSection()]));
            },
            style: { marginTop: '8px' },
          },
          __('Add section at end', 'headless-core')
        ),
        el('p', {
          style: { marginTop: '14px', color: '#94a3b8', fontSize: '12px' },
        }, __('Drag ⋮⋮ to reorder sections. Edit bullets as plain text fields — they render as a list on the site.', 'headless-core'))
        )
      );
    },
    save: function () {
      return null;
    },
  });
})(window.wp.blocks, window.wp.blockEditor, window.wp.components, window.wp.element, window.wp.i18n);
