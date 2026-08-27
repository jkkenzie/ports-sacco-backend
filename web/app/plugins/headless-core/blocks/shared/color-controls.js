(function () {
  var BRAND_PALETTE = [
    '#22acb6',
    '#22ACB6',
    '#00AFBB',
    '#40C9BF',
    '#ee6e2a',
    '#EE6E2A',
    '#eb651b',
    '#ED6E2A',
    '#1e293b',
    '#334155',
    '#475569',
    '#64748b',
    '#65605f',
    '#333333',
    '#000000',
    '#1F2937',
    '#6B7280',
    '#808080',
    '#f8fafc',
    '#ffffff',
    '#FFFFFF',
    '#F5F4EE',
    '#eef0f3',
    '#eef2f8',
    '#e2e8f0',
    '#e5e7eb',
    '#e8e8e8',
    '#f9fafb',
    '#c8cee3',
  ];

  function toChoices(hexList) {
    return hexList.map(function (hex) {
      return { color: hex, name: hex };
    });
  }

  window.headlessCoreColorControls = {
    palette: function (extra) {
      var seen = {};
      var out = [];
      BRAND_PALETTE.concat(extra || []).forEach(function (hex) {
        var value = String(hex || '').trim();
        if (!value || seen[value]) {
          return;
        }
        seen[value] = true;
        out.push(value);
      });
      return toChoices(out);
    },

    field: function (el, BaseControl, ColorPalette, label, value, fallback, onChange, colors) {
      return el(
        'div',
        { style: { marginBottom: '12px' } },
        el(BaseControl, { label: label }),
        el(ColorPalette, {
          value: value || fallback,
          colors: colors || window.headlessCoreColorControls.palette(),
          onChange: function (nextColor) {
            onChange(nextColor || fallback);
          },
        })
      );
    },

    panel: function (el, InspectorControls, PanelBody, BaseControl, ColorPalette, i18n, fields, options) {
      var __ = i18n.__;
      var opts = options || {};
      var cc = window.headlessCoreColorControls;
      var colors = opts.colors || cc.palette(opts.extraColors);

      return el(
        InspectorControls,
        null,
        el(
          PanelBody,
          {
            title: opts.title || __('Colors', 'headless-core'),
            initialOpen: opts.initialOpen === true,
          },
          fields.map(function (field) {
            return cc.field(
              el,
              BaseControl,
              ColorPalette,
              field.label,
              field.value,
              field.fallback,
              field.onChange,
              colors
            );
          })
        )
      );
    },
  };
})();
