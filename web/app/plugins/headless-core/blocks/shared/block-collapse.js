(function (blockEditor, components, element, i18n, hooks) {
  var el = element.createElement;
  var Fragment = element.Fragment;
  var Children = element.Children;
  var useState = element.useState;
  var InspectorControls = blockEditor.InspectorControls;
  var Button = components.Button;
  var __ = i18n.__;

  /** Blocks that ship their own collapsible editor chrome. */
  var SKIP_COLLAPSE = {
    'custom/help-section': true,
    'custom/home-about': true,
    'custom/home-banner-slider': true,
    'custom/home-product-cards': true,
    'custom/home-stats': true,
    'custom/member-reviews': true,
    'custom/product-services': true,
    'custom/membership-content': true,
  };

  function getBlockTitle(name, settings) {
    var labels = window.headlessCoreBlockLabels || {};
    if (labels[name] && labels[name].title) {
      return labels[name].title;
    }
    if (settings && typeof settings.title === 'string') {
      return settings.title;
    }
    return name;
  }

  function renderCollapseFrame(title, collapsed, onToggle, canvasChildren) {
    return el(
      'div',
      {
        className: 'headless-block-collapse-frame',
        style: {
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          overflow: 'hidden',
          background: '#fff',
        },
      },
      el(
        'div',
        {
          className: 'headless-block-collapse-header',
          style: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            padding: '10px 12px',
            background: '#f6f7f7',
            borderBottom: collapsed ? 'none' : '1px solid #e5e7eb',
            cursor: 'pointer',
          },
          onClick: onToggle,
          role: 'button',
          tabIndex: 0,
          'aria-expanded': !collapsed,
          onKeyDown: function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onToggle();
            }
          },
        },
        el(
          'div',
          { style: { display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: '1 1 auto' } },
          el(
            'span',
            {
              'aria-hidden': true,
              style: {
                display: 'inline-flex',
                width: '22px',
                height: '22px',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '4px',
                background: '#e2e8f0',
                color: '#334155',
                fontSize: '12px',
                fontWeight: 700,
                flex: '0 0 auto',
                transform: collapsed ? 'rotate(-90deg)' : 'rotate(0deg)',
                transition: 'transform 0.15s ease',
              },
            },
            '▾'
          ),
          el('strong', { style: { fontSize: '14px', color: '#1e1e1e' } }, title)
        ),
        el(
          Button,
          {
            variant: 'tertiary',
            isSmall: true,
            onClick: function (e) {
              e.stopPropagation();
              onToggle();
            },
          },
          collapsed ? __('Expand', 'headless-core') : __('Collapse', 'headless-core')
        )
      ),
      collapsed
        ? null
        : el(
            'div',
            { className: 'headless-block-collapse-body' },
            canvasChildren.length === 1 ? canvasChildren[0] : el(Fragment, null, canvasChildren)
          )
    );
  }

  function splitEditChildren(editResult) {
    if (!editResult) {
      return { inspector: [], canvas: [], rootType: null, rootProps: null };
    }

    var rootType = editResult.type;
    var rootProps = editResult.props || null;
    var children = rootProps ? Children.toArray(rootProps.children) : [];

    if (rootType === Fragment) {
      var inspectorFrag = [];
      var canvasFrag = [];
      children.forEach(function (child) {
        if (child && child.type === InspectorControls) {
          inspectorFrag.push(child);
        } else if (child != null && child !== false) {
          canvasFrag.push(child);
        }
      });
      return { inspector: inspectorFrag, canvas: canvasFrag, rootType: null, rootProps: null };
    }

    if (!children.length) {
      return { inspector: [], canvas: [editResult], rootType: null, rootProps: null };
    }

    var inspector = [];
    var canvas = [];
    children.forEach(function (child) {
      if (child && child.type === InspectorControls) {
        inspector.push(child);
      } else if (child != null && child !== false) {
        canvas.push(child);
      }
    });

    return { inspector: inspector, canvas: canvas, rootType: rootType, rootProps: rootProps };
  }

  window.headlessCoreBlockCollapse = {
    getTitle: getBlockTitle,
    SKIP_COLLAPSE: SKIP_COLLAPSE,
  };

  hooks.addFilter('blocks.registerBlockType', 'headless-core/block-labels', function (settings, name) {
    if (name.indexOf('custom/') !== 0) {
      return settings;
    }
    var labels = window.headlessCoreBlockLabels || {};
    var entry = labels[name];
    if (!entry) {
      return settings;
    }
    if (entry.title) {
      settings.title = entry.title;
    }
    if (entry.description) {
      settings.description = entry.description;
    }
    if (entry.keywords) {
      settings.keywords = entry.keywords;
    }
    return settings;
  });

  hooks.addFilter('blocks.registerBlockType', 'headless-core/block-collapse', function (settings, name) {
    if (name.indexOf('custom/') !== 0 || SKIP_COLLAPSE[name]) {
      return settings;
    }
    if (!settings.edit || settings.__headlessCollapseWrapped) {
      return settings;
    }

    var originalEdit = settings.edit;
    settings.edit = function (props) {
      var collapsedState = useState(false);
      var collapsed = collapsedState[0];
      var setCollapsed = collapsedState[1];
      var title = getBlockTitle(name, settings);

      function toggleCollapsed() {
        setCollapsed(!collapsed);
      }

      var inner = originalEdit(props);
      var parts = splitEditChildren(inner);

      if (!parts.canvas.length) {
        return inner;
      }

      var frame = renderCollapseFrame(title, collapsed, toggleCollapsed, parts.canvas);

      if (parts.rootType && parts.rootProps) {
        return el(parts.rootType, parts.rootProps, parts.inspector.concat(frame));
      }

      if (parts.inspector.length) {
        return el(Fragment, null, parts.inspector.concat(frame));
      }

      return frame;
    };
    settings.__headlessCollapseWrapped = true;
    return settings;
  });
})(window.wp.blockEditor, window.wp.components, window.wp.element, window.wp.i18n, window.wp.hooks);
