import React, { useMemo, useState } from 'react';
import { Plus, Minus, HelpCircle } from 'lucide-react';
import { decodeHtmlEntities } from '../blocks/CoreRichTextBlocks';

const MUSEO = 'Museo900-Regular, Museo, sans-serif';
const BODY = 'sans-serif, Helvetica, sans-serif';

function stripHtml(html) {
  return String(html || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeRows(rows) {
  const src = Array.isArray(rows) ? rows : [];
  return src
    .map((row) => {
      if (!row || typeof row !== 'object') return null;
      const heading = String(row.heading || '').trim();
      const itemsIn = Array.isArray(row.items) ? row.items : [];
      const items = itemsIn
        .map((item) => ({
          title: String(item?.title || '').trim(),
          content: String(item?.content || '').trim(),
        }))
        .filter((item) => item.title || stripHtml(item.content));
      const hasContent = heading || items.length > 0;
      return hasContent ? { heading, items } : null;
    })
    .filter(Boolean);
}

function FaqAccordionItem({
  item,
  isOpen,
  onToggle,
  questionColor,
  answerColor,
  borderColor,
  hoverBgColor,
  iconColor,
  cardBgColor,
}) {
  const title = decodeHtmlEntities(item.title);
  const hasHtml = /<[^>]+>/.test(item.content);

  return (
    <div
      className="overflow-hidden rounded-xl transition-shadow duration-300"
      style={{
        border: `1px solid ${borderColor}`,
        backgroundColor: cardBgColor,
      }}
    >
      <button
        type="button"
        onClick={onToggle}
        className="group flex w-full items-start gap-4 p-5 text-left transition-colors duration-200 sm:p-6"
        style={{ backgroundColor: isOpen ? hoverBgColor : cardBgColor }}
        aria-expanded={isOpen}
      >
        <span
          className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full"
          style={{ backgroundColor: `${iconColor}18`, color: iconColor }}
          aria-hidden
        >
          <HelpCircle className="size-5" strokeWidth={1.75} />
        </span>
        <span className="min-w-0 flex-1">
          <span
            className="block text-base font-bold leading-snug sm:text-lg"
            style={{ color: questionColor, fontFamily: MUSEO }}
          >
            {title || 'Untitled question'}
          </span>
        </span>
        <span
          className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-full border transition-colors duration-200"
          style={{
            borderColor: isOpen ? iconColor : borderColor,
            color: iconColor,
            backgroundColor: isOpen ? `${iconColor}12` : 'transparent',
          }}
          aria-hidden
        >
          {isOpen ? <Minus className="size-4" /> : <Plus className="size-4" />}
        </span>
      </button>
      <div
        className="grid transition-[grid-template-rows] duration-300 ease-in-out"
        style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <div
            className="border-t px-5 pb-5 pt-4 sm:px-6 sm:pb-6 sm:pl-[4.75rem]"
            style={{ borderColor, color: answerColor, fontFamily: BODY }}
          >
            {hasHtml ? (
              <div
                className="prose prose-sm max-w-none leading-relaxed [&_a]:underline [&_p]:mb-2 [&_p:last-child]:mb-0 [&_ul]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:mb-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-1"
                style={{ color: answerColor }}
                dangerouslySetInnerHTML={{ __html: item.content }}
              />
            ) : (
              <p className="text-base leading-relaxed">{decodeHtmlEntities(stripHtml(item.content))}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function FaqSection({
  sectionTitle = 'Frequently Asked Questions',
  sectionIntro = '',
  sectionBgColor = '#f8fafc',
  cardBgColor = '#ffffff',
  accentColor = '#22acb6',
  groupHeadingColor = '#1e293b',
  questionColor = '#1e293b',
  answerColor = '#475569',
  borderColor = '#e2e8f0',
  hoverBgColor = '#f8fafc',
  iconColor = '#22acb6',
  rows = [],
}) {
  const normalizedRows = useMemo(() => normalizeRows(rows), [rows]);
  const [openKey, setOpenKey] = useState(null);

  if (normalizedRows.length === 0) return null;

  const title = decodeHtmlEntities(sectionTitle);
  const intro = decodeHtmlEntities(sectionIntro);

  return (
    <section className="relative w-full overflow-hidden py-12 lg:py-16" style={{ backgroundColor: sectionBgColor }}>
      <div
        className="pointer-events-none absolute -right-20 top-0 size-64 rounded-full opacity-25 blur-3xl"
        style={{ background: `radial-gradient(circle, ${accentColor}55 0%, transparent 70%)` }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6">
        <header className="mb-10 text-center">
          {title ? (
            <h2
              className="mb-3 text-3xl font-bold tracking-tight sm:text-4xl"
              style={{ color: groupHeadingColor, fontFamily: MUSEO }}
            >
              {title}
            </h2>
          ) : null}
          {intro ? (
            <p className="mx-auto max-w-2xl text-base leading-relaxed text-[#64748b] sm:text-lg" style={{ fontFamily: BODY }}>
              {intro}
            </p>
          ) : null}
          <div
            className="mx-auto mt-5 h-1 w-20 rounded-full"
            style={{ background: `linear-gradient(90deg, ${accentColor}, #ee6e2a)` }}
            aria-hidden
          />
        </header>

        <div className="space-y-12">
          {normalizedRows.map((row, rowIndex) => (
            <div key={`${row.heading}-${rowIndex}`}>
              {row.heading ? (
                <div className="mb-5 flex items-center gap-3">
                  <span
                    className="inline-flex h-8 w-1 shrink-0 rounded-full"
                    style={{ backgroundColor: accentColor }}
                    aria-hidden
                  />
                  <h3
                    className="text-xl font-bold sm:text-2xl"
                    style={{ color: groupHeadingColor, fontFamily: MUSEO }}
                  >
                    {decodeHtmlEntities(row.heading)}
                  </h3>
                </div>
              ) : null}

              <div className="space-y-3">
                {row.items.map((item, itemIndex) => {
                  const key = `${rowIndex}-${itemIndex}`;
                  return (
                    <FaqAccordionItem
                      key={key}
                      item={item}
                      isOpen={openKey === key}
                      onToggle={() => setOpenKey((prev) => (prev === key ? null : key))}
                      questionColor={questionColor}
                      answerColor={answerColor}
                      borderColor={borderColor}
                      hoverBgColor={hoverBgColor}
                      iconColor={iconColor}
                      cardBgColor={cardBgColor}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
