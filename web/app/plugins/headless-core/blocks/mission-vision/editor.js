(function (blocks, blockEditor, components, element, i18n) {
  var el = element.createElement;
  var registerBlockType = blocks.registerBlockType;
  var useBlockProps = blockEditor.useBlockProps;
  var InspectorControls = blockEditor.InspectorControls;
  var MediaUpload = blockEditor.MediaUpload;
  var MediaUploadCheck = blockEditor.MediaUploadCheck;
  var PanelBody = components.PanelBody;
  var TextControl = components.TextControl;
  var TextareaControl = components.TextareaControl;
  var Button = components.Button;
  var __ = i18n.__;

  var defaultCoreValues = [
    {
      label: 'Caring',
      text: 'We are truthful, we listen and go extra mile-above and beyond.',
    },
    {
      label: 'Equity',
      text: 'We are committed to inclusivity, equality, fairness, public good and social justice.',
    },
    {
      label: 'Consistency',
      text: 'We are predictable, dependable, and reliable.',
    },
  ];

  function ImagePicker(props) {
    var label = props.label;
    var imageId = props.imageId;
    var onSelect = props.onSelect;
    var onRemove = props.onRemove;
    return el(
      MediaUploadCheck,
      null,
      el(MediaUpload, {
        onSelect: onSelect,
        allowedTypes: ['image'],
        value: imageId,
        render: function (obj) {
          var open = obj.open;
          return el(
            'div',
            { style: { marginBottom: '12px' } },
            el('p', { style: { fontWeight: 600, marginBottom: '4px' } }, label),
            el(
              Button,
              { variant: 'secondary', onClick: open },
              imageId ? __('Replace image', 'headless-core') : __('Select image', 'headless-core')
            ),
            imageId
              ? el(
                  Button,
                  {
                    variant: 'link',
                    isDestructive: true,
                    onClick: onRemove,
                    style: { marginLeft: '8px' },
                  },
                  __('Remove', 'headless-core')
                )
              : null
          );
        },
      })
    );
  }

  registerBlockType('custom/mission-vision', {
    apiVersion: 3,
    title: __('Mission, Vision & Values', 'headless-core'),
    icon: 'grid-view',
    category: 'widgets',
    description: __(
      'Three columns (Vision, Mission, Purpose) and Core Values — rendered by the React site.',
      'headless-core'
    ),
    attributes: {
      visionTitle: { type: 'string', default: 'Our Vision' },
      visionText: {
        type: 'string',
        default:
          'To be a formidable financial institution by providing competitive financial solutions to a happy, healthy and prosperous people.',
      },
      visionImageId: { type: 'number', default: 0 },
      missionTitle: { type: 'string', default: 'Our Mission' },
      missionText: {
        type: 'string',
        default:
          'To strengthen the socio-economic well-being of our customers through prudent management and innovative products and services.',
      },
      missionImageId: { type: 'number', default: 0 },
      purposeTitle: { type: 'string', default: 'Our Purpose' },
      purposeText: {
        type: 'string',
        default: 'Uplifting People. Inspiring happiness, optimism and hope.',
      },
      purposeImageId: { type: 'number', default: 0 },
      coreValuesTitle: { type: 'string', default: 'Our Core Values' },
      coreValuesImageId: { type: 'number', default: 0 },
      coreValues: { type: 'array', default: defaultCoreValues },
    },
    edit: function (props) {
      var attributes = props.attributes;
      var setAttributes = props.setAttributes;
      var blockProps = useBlockProps({ className: 'headless-mission-vision-editor' });

      function setCoreValue(index, key, value) {
        var base =
          Array.isArray(attributes.coreValues) && attributes.coreValues.length
            ? attributes.coreValues.slice()
            : defaultCoreValues.slice();
        while (base.length < 3) {
          base.push({ label: '', text: '' });
        }
        var next = base.map(function (row, i) {
          if (i !== index) {
            return row;
          }
          var o = Object.assign({}, row);
          o[key] = value;
          return o;
        });
        setAttributes({ coreValues: next });
      }

      function coreValueRow(i) {
        var list =
          Array.isArray(attributes.coreValues) && attributes.coreValues.length
            ? attributes.coreValues
            : defaultCoreValues;
        return list[i] || { label: '', text: '' };
      }

      return el(
        'div',
        blockProps,
        el(
          InspectorControls,
          null,
          el(
            PanelBody,
            { title: __('Vision column', 'headless-core'), initialOpen: true },
            el(TextControl, {
              label: __('Title', 'headless-core'),
              value: attributes.visionTitle,
              onChange: function (v) {
                setAttributes({ visionTitle: v });
              },
            }),
            el(TextareaControl, {
              label: __('Text', 'headless-core'),
              value: attributes.visionText,
              onChange: function (v) {
                setAttributes({ visionText: v });
              },
              rows: 3,
            }),
            el(ImagePicker, {
              label: __('Icon image', 'headless-core'),
              imageId: attributes.visionImageId,
              onSelect: function (media) {
                setAttributes({ visionImageId: media.id ? media.id : 0 });
              },
              onRemove: function () {
                setAttributes({ visionImageId: 0 });
              },
            })
          ),
          el(
            PanelBody,
            { title: __('Mission column', 'headless-core'), initialOpen: false },
            el(TextControl, {
              label: __('Title', 'headless-core'),
              value: attributes.missionTitle,
              onChange: function (v) {
                setAttributes({ missionTitle: v });
              },
            }),
            el(TextareaControl, {
              label: __('Text', 'headless-core'),
              value: attributes.missionText,
              onChange: function (v) {
                setAttributes({ missionText: v });
              },
              rows: 3,
            }),
            el(ImagePicker, {
              label: __('Icon image', 'headless-core'),
              imageId: attributes.missionImageId,
              onSelect: function (media) {
                setAttributes({ missionImageId: media.id ? media.id : 0 });
              },
              onRemove: function () {
                setAttributes({ missionImageId: 0 });
              },
            })
          ),
          el(
            PanelBody,
            { title: __('Purpose column', 'headless-core'), initialOpen: false },
            el(TextControl, {
              label: __('Title', 'headless-core'),
              value: attributes.purposeTitle,
              onChange: function (v) {
                setAttributes({ purposeTitle: v });
              },
            }),
            el(TextareaControl, {
              label: __('Text', 'headless-core'),
              value: attributes.purposeText,
              onChange: function (v) {
                setAttributes({ purposeText: v });
              },
              rows: 3,
            }),
            el(ImagePicker, {
              label: __('Icon image', 'headless-core'),
              imageId: attributes.purposeImageId,
              onSelect: function (media) {
                setAttributes({ purposeImageId: media.id ? media.id : 0 });
              },
              onRemove: function () {
                setAttributes({ purposeImageId: 0 });
              },
            })
          ),
          el(
            PanelBody,
            { title: __('Core values', 'headless-core'), initialOpen: false },
            el(TextControl, {
              label: __('Section title', 'headless-core'),
              value: attributes.coreValuesTitle,
              onChange: function (v) {
                setAttributes({ coreValuesTitle: v });
              },
            }),
            el(ImagePicker, {
              label: __('Section icon image', 'headless-core'),
              imageId: attributes.coreValuesImageId,
              onSelect: function (media) {
                setAttributes({ coreValuesImageId: media.id ? media.id : 0 });
              },
              onRemove: function () {
                setAttributes({ coreValuesImageId: 0 });
              },
            }),
            [0, 1, 2].map(function (i) {
              var row = coreValueRow(i);
              return el(
                'div',
                { key: i, style: { marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #ddd' } },
                el('strong', null, __('Value', 'headless-core') + ' ' + (i + 1)),
                el(TextControl, {
                  label: __('Label', 'headless-core'),
                  value: row.label,
                  onChange: function (v) {
                    setCoreValue(i, 'label', v);
                  },
                }),
                el(TextareaControl, {
                  label: __('Text', 'headless-core'),
                  value: row.text,
                  onChange: function (v) {
                    setCoreValue(i, 'text', v);
                  },
                  rows: 2,
                })
              );
            })
          )
        ),
        el(
          'div',
          {
            style: {
              padding: '12px',
              border: '1px dashed #ccc',
              borderRadius: '4px',
              background: '#fafafa',
            },
          },
          el('strong', null, __('Mission, Vision & Values', 'headless-core')),
          el('p', { style: { fontSize: '12px', color: '#555', marginTop: '8px' } }, attributes.visionTitle),
          el('p', { style: { fontSize: '12px', color: '#555' } }, attributes.missionTitle),
          el('p', { style: { fontSize: '12px', color: '#555' } }, attributes.purposeTitle),
          el('p', { style: { fontSize: '12px', color: '#555', marginTop: '8px' } }, attributes.coreValuesTitle)
        )
      );
    },
    save: function () {
      return null;
    },
  });
})(
  window.wp.blocks,
  window.wp.blockEditor,
  window.wp.components,
  window.wp.element,
  window.wp.i18n
);
