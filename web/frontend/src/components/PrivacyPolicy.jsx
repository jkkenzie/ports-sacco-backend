import React, { useMemo } from 'react';
import { decodeHtmlEntities } from '../blocks/CoreRichTextBlocks';

const MUSEO = 'Museo900-Regular, Museo, sans-serif';
const BODY = 'sans-serif, Helvetica, sans-serif';

const DEFAULT_TITLE = 'PORTS SACCO Privacy Policy';
const DEFAULT_INTRO =
  'We respect your right to privacy, and we guard it jealously. In this respect, this Privacy Policy sets out details of the personal data the SACCO collects, processes and for what purposes. This Policy should be read alongside, and in addition to, the Data Protection Policy and therefore read it carefully. The policy applies to all customers, suppliers, agents, and all visitors frequenting any of the SACCOs premises.';

function stripHtml(html) {
  return String(html || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function slugifyId(input) {
  if (typeof input !== 'string') return '';
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function extractBulletsFromHtml(html) {
  const source = String(html || '');
  const bullets = [];
  const re = /<li\b[^>]*>([\s\S]*?)<\/li>/gi;
  let match;
  while ((match = re.exec(source))) {
    const text = stripHtml(match[1]);
    if (text) bullets.push(text);
  }
  return bullets;
}

function stripListsFromHtml(html) {
  return String(html || '')
    .replace(/<ul\b[^>]*>[\s\S]*?<\/ul>/gi, '')
    .replace(/<ol\b[^>]*>[\s\S]*?<\/ol>/gi, '')
    .trim();
}

function normalizeSections(sections) {
  const src = Array.isArray(sections) ? sections : [];

  return src
    .map((section, index) => {
      if (!section || typeof section !== 'object') return null;
      const title = String(section.title || '').trim();
      let content = String(section.content || '').trim();
      let contentAfter = String(section.contentAfter || '').trim();
      let bullets = Array.isArray(section.bullets)
        ? section.bullets.map((b) => String(b || '').trim()).filter(Boolean)
        : [];

      if (!bullets.length) {
        const extracted = extractBulletsFromHtml(content);
        if (extracted.length) {
          bullets = extracted;
          content = stripListsFromHtml(content);
        }
      } else {
        content = stripListsFromHtml(content);
      }
      contentAfter = stripListsFromHtml(contentAfter);

      if (!title && !stripHtml(content) && !stripHtml(contentAfter) && bullets.length === 0) return null;
      const id = String(section.id || '').trim() || slugifyId(title) || `privacy-section-${index + 1}`;
      return { id, title, content, contentAfter, bullets };
    })
    .filter(Boolean);
}

export function PrivacyPolicy({
  sectionTitle = DEFAULT_TITLE,
  sectionIntro = DEFAULT_INTRO,
  sectionBgColor = '#ffffff',
  cardBgColor = '#f8fafc',
  accentColor = '#22acb6',
  headingColor = '#22acb6',
  titleColor = '#1e293b',
  bodyColor = '#334155',
  borderColor = '#e2e8f0',
  sections = [],
}) {
  const normalized = useMemo(() => normalizeSections(sections), [sections]);
  const title = decodeHtmlEntities(sectionTitle);
  const intro = decodeHtmlEntities(sectionIntro);

  if (!title && !intro && normalized.length === 0) return null;

  return (
    <section className="relative w-full overflow-hidden py-12 lg:py-16" style={{ backgroundColor: sectionBgColor }}>
      <div
        className="pointer-events-none absolute -left-24 top-10 size-72 rounded-full opacity-20 blur-3xl"
        style={{ background: `radial-gradient(circle, ${accentColor}55 0%, transparent 70%)` }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-16 bottom-0 size-64 rounded-full opacity-15 blur-3xl"
        style={{ background: 'radial-gradient(circle, #ee6e2a55 0%, transparent 70%)' }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-full px-[50px]">
        <header className="mb-10">
          {title ? (
            <h1
              className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl"
              style={{ color: headingColor, fontFamily: MUSEO }}
            >
              {title}
            </h1>
          ) : null}
          {intro ? (
            /<[^>]+>/.test(String(sectionIntro || '')) ? (
              <div
                className="space-y-4 text-base leading-relaxed sm:text-lg [&_p]:mb-0"
                style={{ color: bodyColor, fontFamily: BODY }}
                dangerouslySetInnerHTML={{ __html: sectionIntro }}
              />
            ) : (
              String(intro)
                .split(/\n\n+/)
                .map((part) => part.trim())
                .filter(Boolean)
                .map((part, index) => (
                  <p
                    key={`intro-${index}`}
                    className="mb-4 text-base leading-relaxed last:mb-0 sm:text-lg"
                    style={{ color: bodyColor, fontFamily: BODY }}
                  >
                    {part}
                  </p>
                ))
            )
          ) : null}
          <div
            className="mt-5 h-1 w-20 rounded-full"
            style={{ background: `linear-gradient(90deg, ${accentColor}, #ee6e2a)` }}
            aria-hidden
          />
        </header>

        <div className="space-y-5">
          {normalized.map((section, index) => (
            <article
              key={section.id}
              id={section.id}
              className="scroll-mt-24 rounded-2xl p-5 sm:p-7"
              style={{
                backgroundColor: cardBgColor,
                border: `1px solid ${borderColor}`,
                boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)',
              }}
            >
              <div className="mb-4 flex items-start gap-3">
                <span
                  className="mt-1 inline-flex h-8 min-w-8 items-center justify-center rounded-full text-xs font-bold text-white"
                  style={{ backgroundColor: accentColor, fontFamily: MUSEO }}
                  aria-hidden
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className="min-w-0 flex-1">
                  {section.title ? (
                    <h2
                      className="text-xl font-bold leading-snug sm:text-2xl"
                      style={{ color: titleColor, fontFamily: MUSEO }}
                    >
                      {decodeHtmlEntities(section.title)}
                    </h2>
                  ) : null}
                  <div
                    className="mt-2 h-0.5 w-12 rounded-full"
                    style={{ backgroundColor: accentColor }}
                    aria-hidden
                  />
                </div>
              </div>

              {section.content ? (
                <div
                  className="prose prose-sm max-w-none leading-relaxed sm:prose-base [&_a]:font-semibold [&_a]:underline [&_p]:mb-3 [&_p:last-child]:mb-0 [&_strong]:font-bold"
                  style={{ color: bodyColor, fontFamily: BODY }}
                  dangerouslySetInnerHTML={{ __html: section.content }}
                />
              ) : null}

              {section.bullets.length > 0 ? (
                <ul
                  className="mt-4 space-y-2 pl-6"
                  style={{
                    listStyleType: 'disc',
                    color: bodyColor,
                    fontFamily: BODY,
                    lineHeight: 1.6,
                  }}
                >
                  {section.bullets.map((bullet, bulletIndex) => (
                    <li key={`${section.id}-b-${bulletIndex}`} className="text-sm md:text-base">
                      {decodeHtmlEntities(bullet)}
                    </li>
                  ))}
                </ul>
              ) : null}

              {section.contentAfter ? (
                <div
                  className="prose prose-sm mt-4 max-w-none leading-relaxed sm:prose-base [&_a]:font-semibold [&_a]:underline [&_p]:mb-3 [&_p:last-child]:mb-0 [&_strong]:font-bold"
                  style={{ color: bodyColor, fontFamily: BODY }}
                  dangerouslySetInnerHTML={{ __html: section.contentAfter }}
                />
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
