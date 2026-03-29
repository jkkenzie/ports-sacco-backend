(function (blocks, blockEditor, components, element, i18n) {
  var el = element.createElement;
  var Fragment = element.Fragment;
  var useState = element.useState;
  var registerBlockType = blocks.registerBlockType;
  var useBlockProps = blockEditor.useBlockProps;
  var InspectorControls = blockEditor.InspectorControls;
  var MediaUpload = blockEditor.MediaUpload;
  var MediaUploadCheck = blockEditor.MediaUploadCheck;
  var MediaPlaceholder = blockEditor.MediaPlaceholder;
  var RichText = blockEditor.RichText;
  var PanelBody = components.PanelBody;
  var Button = components.Button;
  var TextControl = components.TextControl;
  var TextareaControl = components.TextareaControl;
  var BaseControl = components.BaseControl;
  var ColorPalette = components.ColorPalette;
  var RangeControl = components.RangeControl || components.__experimentalRangeControl;
  var __ = i18n.__;

  var palette = ['#1BB5B5', '#22ACB6', '#22acb6', '#EE6E2A', '#ffffff', '#000000', '#f3f4f6'];

  function emptySlide() {
    return { imageId: 0, imageUrl: '', alt: '', embedHtml: '' };
  }

  function normalizeSlides(items) {
    if (!Array.isArray(items) || !items.length) {
      return [emptySlide()];
    }
    return items.map(function (row) {
      return {
        imageId: Number(row && row.imageId) || 0,
        imageUrl: String((row && row.imageUrl) || ''),
        alt: String((row && row.alt) || ''),
        embedHtml: String((row && row.embedHtml) || ''),
      };
    });
  }

  function HomeBannerEdit(props) {
    var a = props.attributes;
    var slides = normalizeSlides(a.slides);
    var selectedPair = useState(0);
    var selected = selectedPair[0];
    var setSelected = selectedPair[1];

    function setSlides(next) {
      props.setAttributes({ slides: next });
    }

    function patchSlide(index, patch) {
      var next = slides.slice();
      next[index] = Object.assign({}, next[index] || emptySlide(), patch);
      setSlides(next);
    }

    function addSlide() {
      setSlides(slides.concat([emptySlide()]));
      setSelected(slides.length);
    }

    function removeSlide(index) {
      if (!window.confirm(__('Remove this slide? This cannot be undone.', 'headless-core'))) {
        return;
      }
      var next = slides.filter(function (_, i) {
        return i !== index;
      });
      if (!next.length) {
        next = [emptySlide()];
      }
      setSlides(next);
      setSelected(Math.min(selected, Math.max(0, next.length - 1)));
    }

    var blockProps = useBlockProps({ className: 'headless-home-banner-slider-block' });

    function slideRow(s, index) {
      var isSel = index === selected;
      var hasImage = Boolean(s.imageUrl || s.imageId);

      return el(
        'div',
        {
          key: 'slide-' + index,
          onClick: function () {
            setSelected(index);
          },
          style: {
            border: isSel ? '2px solid #2271b1' : '1px solid #ddd',
            borderRadius: '4px',
            padding: '10px',
            marginBottom: '10px',
            background: '#fff',
            color: '#1e1e1e',
            cursor: 'pointer',
          },
        },
        el(
          'div',
          { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' } },
          el('strong', { style: { fontSize: '12px' } }, __('Slide', 'headless-core') + ' ' + (index + 1)),
          el(
            Button,
            {
              variant: 'secondary',
              isDestructive: true,
              isSmall: true,
              onClick: function (e) {
                e.stopPropagation();
                removeSlide(index);
              },
            },
            __('Remove slide', 'headless-core')
          )
        ),
        el(
          'div',
          {
            onClick: function (e) {
              e.stopPropagation();
            },
            style: { marginBottom: '10px' },
          },
          hasImage
            ? el(
                'div',
                null,
                el('img', {
                  src: s.imageUrl,
                  alt: s.alt || '',
                  style: {
                    width: '100%',
                    maxHeight: '160px',
                    objectFit: 'cover',
                    borderRadius: '4px',
                    display: 'block',
                    marginBottom: '8px',
                  },
                }),
                el(
                  'div',
                  { style: { display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' } },
                  el(
                    MediaUploadCheck,
                    null,
                    el(MediaUpload, {
                      allowedTypes: ['image'],
                      value: s.imageId || 0,
                      onSelect: function (media) {
                        patchSlide(index, {
                          imageId: media && media.id ? media.id : 0,
                          imageUrl: media && media.url ? media.url : '',
                          alt:
                            media && media.alt != null
                              ? String(media.alt)
                              : s.alt || '',
                        });
                      },
                      render: function (obj) {
                        return el(
                          Button,
                          { variant: 'secondary', onClick: obj.open },
                          __('Replace image', 'headless-core')
                        );
                      },
                    })
                  ),
                  el(
                    Button,
                    {
                      variant: 'tertiary',
                      isDestructive: true,
                      onClick: function () {
                        patchSlide(index, { imageId: 0, imageUrl: '' });
                      },
                    },
                    __('Remove image', 'headless-core')
                  )
                )
              )
            : typeof MediaPlaceholder === 'function'
              ? el(MediaPlaceholder, {
                  icon: 'format-image',
                  labels: {
                    title: __('Slide image', 'headless-core'),
                    instructions: __('Upload a new file or pick one from the Media Library.', 'headless-core'),
                  },
                  onSelect: function (media) {
                    patchSlide(index, {
                      imageId: media && media.id ? media.id : 0,
                      imageUrl: media && media.url ? media.url : '',
                      alt: media && media.alt != null ? String(media.alt) : '',
                    });
                  },
                  accept: 'image/*',
                  allowedTypes: ['image'],
                  multiple: false,
                })
              : el(
                  'div',
                  null,
                  el(
                    'div',
                    {
                      style: {
                        padding: '20px',
                        textAlign: 'center',
                        background: '#f6f7f7',
                        borderRadius: '4px',
                        marginBottom: '8px',
                        fontSize: '12px',
                        color: '#757575',
                      },
                    },
                    __('No image — use the button below (upload or library).', 'headless-core')
                  ),
                  el(
                    MediaUploadCheck,
                    null,
                    el(MediaUpload, {
                      allowedTypes: ['image'],
                      value: s.imageId || 0,
                      onSelect: function (media) {
                        patchSlide(index, {
                          imageId: media && media.id ? media.id : 0,
                          imageUrl: media && media.url ? media.url : '',
                          alt: media && media.alt != null ? String(media.alt) : '',
                        });
                      },
                      render: function (obj) {
                        return el(
                          Button,
                          { variant: 'primary', onClick: obj.open },
                          __('Select or upload image', 'headless-core')
                        );
                      },
                    })
                  )
                )
        ),
        el(
          'div',
          { onClick: function (e) { e.stopPropagation(); } },
          el(TextControl, {
            label: __('Alt text', 'headless-core'),
            value: s.alt || '',
            onChange: function (v) {
              patchSlide(index, { alt: v || '' });
            },
          })
        ),
        el(
          'div',
          {
            onClick: function (e) {
              e.stopPropagation();
            },
            style: { marginTop: '8px' },
          },
          el(BaseControl, { label: __('Overlay (inline editor)', 'headless-core') }),
          typeof RichText === 'function'
            ? el(RichText, {
                tagName: 'div',
                value: s.embedHtml || '',
                onChange: function (v) {
                  patchSlide(index, { embedHtml: v || '' });
                },
                placeholder: __('Optional overlay text (bold, links, …)', 'headless-core'),
                allowedFormats: ['core/bold', 'core/italic', 'core/link'],
                style: {
                  minHeight: '56px',
                  padding: '8px 10px',
                  border: '1px solid #949494',
                  borderRadius: '2px',
                  background: '#fff',
                  fontSize: '14px',
                },
              })
            : el(TextareaControl, {
                label: __('Overlay HTML', 'headless-core'),
                value: s.embedHtml || '',
                onChange: function (v) {
                  patchSlide(index, { embedHtml: v || '' });
                },
                style: { fontFamily: 'ui-monospace, Consolas, monospace', fontSize: '12px', minHeight: '88px' },
              }),
          el(
            'p',
            { style: { fontSize: '11px', color: '#757575', margin: '6px 0 0' } },
            __('HTML is sanitized when the page is saved.', 'headless-core')
          )
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
            label: __('Section ID', 'headless-core'),
            value: a.sectionId || 'hero',
            onChange: function (v) {
              props.setAttributes({ sectionId: v || 'hero' });
            },
          }),
          el(BaseControl, { label: __('Top strip background', 'headless-core') }),
          el(ColorPalette, {
            value: a.heroBg || '#1BB5B5',
            colors: palette.map(function (hex) {
              return { color: hex, name: hex };
            }),
            onChange: function (c) {
              props.setAttributes({ heroBg: c || '#1BB5B5' });
            },
          }),
          el(BaseControl, { label: __('Dot bar background', 'headless-core') }),
          el(ColorPalette, {
            value: a.dotBarBg || '#22acb6',
            colors: palette.map(function (hex) {
              return { color: hex, name: hex };
            }),
            onChange: function (c) {
              props.setAttributes({ dotBarBg: c || '#22acb6' });
            },
          }),
          el(BaseControl, { label: __('Arrow buttons background', 'headless-core') }),
          el(ColorPalette, {
            value: a.arrowBg || 'rgba(255,255,255,0.8)',
            colors: palette.map(function (hex) {
              return { color: hex, name: hex };
            }),
            onChange: function (c) {
              props.setAttributes({ arrowBg: c || 'rgba(255,255,255,0.8)' });
            },
          }),
          el(BaseControl, { label: __('Arrow icon color', 'headless-core') }),
          el(ColorPalette, {
            value: a.arrowIconColor || '#1BB5B5',
            colors: palette.map(function (hex) {
              return { color: hex, name: hex };
            }),
            onChange: function (c) {
              props.setAttributes({ arrowIconColor: c || '#1BB5B5' });
            },
          }),
          el(RangeControl, {
            label: __('Slide transition (ms)', 'headless-core'),
            value: a.transitionMs != null ? a.transitionMs : 700,
            onChange: function (v) {
              props.setAttributes({ transitionMs: Math.max(200, Math.min(2000, v)) });
            },
            min: 200,
            max: 2000,
            step: 50,
          })
        )
      ),
      el(
        'div',
        blockProps,
        el(
          'div',
          { style: { border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' } },
          el(
            'div',
            { style: { padding: '12px 16px', background: '#f6f7f7', borderBottom: '1px solid #ddd' } },
            el('strong', null, __('Home banner slider', 'headless-core'))
          ),
          el(
            'div',
            {
              style: {
                padding: '12px 16px',
                background: a.heroBg || '#1BB5B5',
                borderBottom: '1px solid rgba(0,0,0,0.06)',
              },
            },
            el(
              'p',
              { style: { margin: 0, fontSize: '11px', color: 'rgba(255,255,255,0.95)', fontWeight: 600 } },
              __('Preview strip — matches hero background', 'headless-core')
            )
          ),
          el(
            'div',
            { style: { padding: '16px', maxHeight: '70vh', overflowY: 'auto' } },
            slides.map(function (s, i) {
              return slideRow(s, i);
            }),
            el(
              Button,
              {
                variant: 'secondary',
                onClick: function () {
                  addSlide();
                },
              },
              __('Add slide', 'headless-core')
            ),
            el(
              'p',
              { style: { fontSize: '12px', color: '#757575', marginTop: '12px', marginBottom: 0 } },
              __('Click a slide to highlight it. Remove slide asks for confirmation. Upload uses the Media Library.', 'headless-core')
            )
          )
        )
      )
    );
  }

  registerBlockType('custom/home-banner-slider', {
    apiVersion: 3,
    title: __('Home banner slider', 'headless-core'),
    icon: 'slides',
    category: 'widgets',
    description: __('Full-width image hero with dots and arrows.', 'headless-core'),
    keywords: ['banner', 'hero', 'slider', 'carousel', 'home', 'image'],
    supports: { anchor: true },
    attributes: {
      sectionId: { type: 'string', default: 'hero' },
      heroBg: { type: 'string', default: '#1BB5B5' },
      dotBarBg: { type: 'string', default: '#22acb6' },
      arrowBg: { type: 'string', default: 'rgba(255,255,255,0.8)' },
      arrowIconColor: { type: 'string', default: '#1BB5B5' },
      transitionMs: { type: 'number', default: 700 },
      slides: {
        type: 'array',
        default: [{ imageId: 0, imageUrl: '', alt: '', embedHtml: '' }],
      },
    },
    edit: HomeBannerEdit,
    save: function () {
      return null;
    },
  });
})(window.wp.blocks, window.wp.blockEditor, window.wp.components, window.wp.element, window.wp.i18n);
