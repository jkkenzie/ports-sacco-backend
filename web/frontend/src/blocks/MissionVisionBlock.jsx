import React from 'react';
import roundedBg from '../../assets/image/rounded-bg-1.svg';
import visionImg from '../../assets/image/vision.png';
import missionImg from '../../assets/image/mission.png';
import purposeImg from '../../assets/image/purpose.png';
import coreValuesImg from '../../assets/image/core-values.png';
import { decodeHtmlEntities } from './CoreRichTextBlocks';

const TEAL = '#40C9BF';
const BODY_COLOR = '#333333';

/** Keep in sync with `headless_core_mission_vision_default_attrs()` in headless-core rest-api.php */
const DEFAULT_ATTRS = {
  items: [
    {
      title: 'Our Vision',
      description:
        'To be a formidable financial institution by providing competitive financial solutions to a happy, healthy and prosperous people.',
      fallbackSrc: visionImg,
      values: [],
    },
    {
      title: 'Our Mission',
      description:
        'To strengthen the socio-economic well-being of our customers through prudent management and innovative products and services.',
      fallbackSrc: missionImg,
      values: [],
    },
    {
      title: 'Our Purpose',
      description: 'Uplifting People. Inspiring happiness, optimism and hope.',
      fallbackSrc: purposeImg,
      values: [],
    },
    {
      title: 'Our Core Values',
      description: '',
      fallbackSrc: coreValuesImg,
      values: [
        {
          title: 'Caring',
          description: 'We are truthful, we listen and go extra mile-above and beyond.',
        },
        {
          title: 'Equity',
          description: 'We are committed to inclusivity, equality, fairness, public good and social justice.',
        },
        {
          title: 'Consistency',
          description: 'We are predictable, dependable, and reliable.',
        },
      ],
    },
  ],
  values: [
    {
      title: 'Caring',
      description: 'We are truthful, we listen and go extra mile-above and beyond.',
    },
    {
      title: 'Equity',
      description: 'We are committed to inclusivity, equality, fairness, public good and social justice.',
    },
    {
      title: 'Consistency',
      description: 'We are predictable, dependable, and reliable.',
    },
  ],
};

function textOrDefault(value, fallback) {
  if (value == null) {
    return fallback;
  }
  const s = String(value).trim();
  return s !== '' ? s : fallback;
}

function mergeCoreValueRows(saved, defaults = DEFAULT_ATTRS.values) {
  const rows = Array.isArray(saved) ? saved : [];
  const count = Math.max(defaults.length, rows.length);
  const out = [];
  for (let i = 0; i < count; i++) {
    const d = defaults[i] || { title: '', description: '' };
    const s = rows[i] && typeof rows[i] === 'object' ? rows[i] : {};
    const label = String(s.title ?? s.label ?? '').trim();
    const text = String(s.description ?? s.text ?? '').trim();
    out.push({
      title: label !== '' ? label : d.title,
      description: text !== '' ? text : d.description,
    });
  }
  return out;
}

function mergeTopItems(savedItems, legacy) {
  const defaults = DEFAULT_ATTRS.items;
  const incoming = Array.isArray(savedItems) && savedItems.length
    ? savedItems
    : [
        {
          title: legacy.visionTitle,
          description: legacy.visionText,
          iconUrl: legacy.visionImageUrl,
        },
        {
          title: legacy.missionTitle,
          description: legacy.missionText,
          iconUrl: legacy.missionImageUrl,
        },
        {
          title: legacy.purposeTitle,
          description: legacy.purposeText,
          iconUrl: legacy.purposeImageUrl,
        },
      ];

  const count = Math.max(defaults.length, incoming.length);
  const out = [];
  for (let i = 0; i < count; i++) {
    const d = defaults[i] || { title: '', description: '', fallbackSrc: null, values: [] };
    const s = incoming[i] && typeof incoming[i] === 'object' ? incoming[i] : {};
    const defaultValues = Array.isArray(d.values) ? d.values : [];
    let values = [];
    if (Array.isArray(s.values)) {
      values = mergeCoreValueRows(s.values, defaultValues);
    } else if (!Array.isArray(savedItems) && i === 3 && Array.isArray(legacy.values) && legacy.values.length) {
      values = mergeCoreValueRows(legacy.values, defaultValues);
    } else {
      values = mergeCoreValueRows([], defaultValues);
    }
    out.push({
      title: textOrDefault(s.title, d.title),
      description: textOrDefault(s.description, d.description),
      iconUrl: typeof s.iconUrl === 'string' ? s.iconUrl : '',
      fallbackSrc: d.fallbackSrc || visionImg,
      values,
    });
  }
  return out;
}

function IconColumn({ title, text, imageUrl, fallbackSrc }) {
  const src = imageUrl || fallbackSrc;
  return (
    <div className="flex flex-col items-center text-center">
      <div
        className="flex items-center justify-center flex-shrink-0 bg-no-repeat bg-center bg-contain"
        style={{ width: 150, height: 150, backgroundImage: `url(${roundedBg})` }}
      >
        <img src={src} alt="" className="w-19 h-19 object-contain" aria-hidden />
      </div>
      <h3 className="mt-4 mb-2" style={{ color: TEAL, fontFamily: 'Museo900-Regular, Museo, sans-serif', fontSize: '26px' }}>
        {decodeHtmlEntities(title)}
      </h3>
      <p className="text-sm md:text-base text-center" style={{ color: BODY_COLOR, lineHeight: 1.6 }}>
        {decodeHtmlEntities(text)}
      </p>
    </div>
  );
}

/**
 * Renders `custom/mission-vision` from WordPress (same layout as AboutUsWhoWeAreSection mission block).
 */
export function MissionVisionBlock({
  items,
  values,
  visionTitle,
  visionText,
  visionImageUrl,
  missionTitle,
  missionText,
  missionImageUrl,
  purposeTitle,
  purposeText,
  purposeImageUrl,
  coreValues,
}) {
  const topItems = mergeTopItems(items, {
    visionTitle,
    visionText,
    visionImageUrl,
    missionTitle,
    missionText,
    missionImageUrl,
    purposeTitle,
    purposeText,
    purposeImageUrl,
    values: Array.isArray(values) && values.length ? values : coreValues,
  });

  return (
    <div id="mission-vision" className="max-w-7xl mx-auto py-12 px-[50px] lg:py-16" style={{ scrollMarginTop: '100px' }}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
        {topItems.map((item, index) => (
          <div
            key={index}
            className={topItems.length % 3 === 1 && index === topItems.length - 1 ? 'md:col-span-3' : ''}
          >
            <IconColumn title={item.title} text={item.description} imageUrl={item.iconUrl} fallbackSrc={item.fallbackSrc} />
            {item.values && item.values.length ? (
              <div className="mt-4 space-y-2 text-center" style={{ color: BODY_COLOR, lineHeight: 1.6 }}>
                {item.values.map((row, ridx) => {
                  const label = row.title ?? '';
                  const text = row.description ?? '';
                  if (!label && !text) return null;
                  return (
                    <p key={ridx} className="text-sm md:text-base">
                      {label ? (
                        <strong style={{ color: TEAL, fontSize: '18px' }}>{decodeHtmlEntities(label)}:</strong>
                      ) : null}{' '}
                      {decodeHtmlEntities(text)}
                    </p>
                  );
                })}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
