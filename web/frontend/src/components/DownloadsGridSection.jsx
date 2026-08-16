import React from 'react';
import { Calendar, Download, FileText } from 'lucide-react';
import { decodeHtmlEntities } from '../blocks/CoreRichTextBlocks';

const MUSEO = 'Museo900-Regular, Museo, sans-serif';
const BODY = 'sans-serif, Helvetica, sans-serif';

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
          fileId: Number(item?.fileId) || 0,
          fileUrl: String(item?.fileUrl || '').trim(),
          showDeadline: item?.showDeadline === true,
          deadline: String(item?.deadline || '').trim(),
        }))
        .filter((item) => item.title || item.fileUrl);
      const hasContent = heading || items.length > 0;
      return hasContent ? { heading, items } : null;
    })
    .filter(Boolean);
}

function DownloadCard({ item, downloadLabel, accentColor, buttonHoverColor, cardBgColor, titleColor }) {
  const title = decodeHtmlEntities(item.title);
  const url = item.fileUrl;
  const hasLink = Boolean(url);
  const showDeadline = item.showDeadline === true && String(item.deadline || '').trim() !== '';
  const deadline = decodeHtmlEntities(String(item.deadline || '').trim());

  return (
    <article
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[#e2e8f0] p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[color:var(--dl-accent)] hover:shadow-[0_16px_40px_rgba(15,23,42,0.1)] sm:flex-row sm:items-center sm:gap-5 sm:p-6"
      style={{
        '--dl-accent': accentColor,
        backgroundColor: cardBgColor,
      }}
    >
      <div
        className="mb-4 flex size-14 shrink-0 items-center justify-center rounded-2xl shadow-sm transition-transform duration-300 group-hover:scale-105 sm:mb-0"
        style={{ backgroundColor: `${accentColor}18`, color: accentColor }}
        aria-hidden
      >
        <FileText className="size-7" strokeWidth={1.75} />
      </div>

      <div className="min-w-0 flex-1">
        {title ? (
          <h4
            className="mb-1 text-base font-bold leading-snug sm:text-lg"
            style={{ color: titleColor, fontFamily: MUSEO }}
          >
            {title}
          </h4>
        ) : (
          <h4 className="mb-1 text-base font-bold text-[#94a3b8] sm:text-lg" style={{ fontFamily: MUSEO }}>
            Untitled document
          </h4>
        )}
        <p className="text-sm text-[#64748b]" style={{ fontFamily: BODY }}>
          PDF document
        </p>
        {showDeadline ? (
          <p
            className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-[#ee6e2a]"
            style={{ fontFamily: BODY }}
          >
            <Calendar className="size-3.5 shrink-0" aria-hidden />
            <span>
              Deadline: {deadline}
            </span>
          </p>
        ) : null}
      </div>

      {hasLink ? (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          download
          className="mt-4 inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold uppercase tracking-wide text-white transition-colors duration-300 hover:bg-[color:var(--dl-btn-hover)] sm:mt-0 sm:w-auto"
          style={{
            '--dl-btn': accentColor,
            '--dl-btn-hover': buttonHoverColor || '#ee6e2a',
            backgroundColor: 'var(--dl-btn)',
            fontFamily: BODY,
          }}
        >
          <Download className="size-4 transition-transform duration-300 group-hover:translate-y-0.5" aria-hidden />
          {decodeHtmlEntities(downloadLabel)}
        </a>
      ) : (
        <span
          className="mt-4 inline-flex w-full items-center justify-center rounded-full border border-dashed border-[#cbd5e1] px-5 py-3 text-sm font-semibold text-[#94a3b8] sm:mt-0 sm:w-auto"
          style={{ fontFamily: BODY }}
        >
          File pending
        </span>
      )}

      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-1 scale-x-0 bg-[color:var(--dl-accent)] transition-transform duration-300 group-hover:scale-x-100"
        aria-hidden
      />
    </article>
  );
}

export function DownloadsGridSection({
  sectionTitle = 'Downloads',
  sectionIntro = '',
  downloadLabel = 'Download PDF',
  sectionBgColor = '#f8fafc',
  cardBgColor = '#ffffff',
  accentColor = '#22acb6',
  buttonHoverColor = '#ee6e2a',
  headingColor = '#1e293b',
  titleColor = '#334155',
  rows = [],
}) {
  const normalizedRows = normalizeRows(rows);
  if (normalizedRows.length === 0) return null;

  const title = decodeHtmlEntities(sectionTitle);
  const intro = decodeHtmlEntities(sectionIntro);

  return (
    <section className="relative w-full overflow-hidden py-12 lg:py-16" style={{ backgroundColor: sectionBgColor }}>
      <div
        className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full opacity-30 blur-3xl"
        style={{ background: `radial-gradient(circle, ${accentColor}55 0%, transparent 70%)` }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-20 -left-20 size-64 rounded-full opacity-20 blur-3xl"
        style={{ background: `radial-gradient(circle, #ee6e2a44 0%, transparent 70%)` }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <header className="mb-10 max-w-3xl">
          {title ? (
            <h2
              className="mb-3 text-3xl font-bold tracking-tight sm:text-4xl"
              style={{ color: headingColor, fontFamily: MUSEO }}
            >
              {title}
            </h2>
          ) : null}
          {intro ? (
            <p className="text-base leading-relaxed text-[#64748b] sm:text-lg" style={{ fontFamily: BODY }}>
              {intro}
            </p>
          ) : null}
          <div
            className="mt-5 h-1 w-20 rounded-full"
            style={{ background: `linear-gradient(90deg, ${accentColor}, #ee6e2a)` }}
            aria-hidden
          />
        </header>

        <div className="space-y-10">
          {normalizedRows.map((row, rowIndex) => (
            <div key={`${row.heading}-${rowIndex}`}>
              {row.heading ? (
                <div className="mb-5 flex items-center gap-3">
                  <span
                    className="inline-flex size-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: accentColor }}
                    aria-hidden
                  />
                  <h3
                    className="text-xl font-bold sm:text-2xl"
                    style={{ color: headingColor, fontFamily: MUSEO }}
                  >
                    {decodeHtmlEntities(row.heading)}
                  </h3>
                </div>
              ) : null}

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {row.items.map((item, itemIndex) => (
                  <DownloadCard
                    key={`${rowIndex}-${itemIndex}-${item.title}-${item.fileUrl}`}
                    item={item}
                    downloadLabel={downloadLabel}
                    accentColor={accentColor}
                    buttonHoverColor={buttonHoverColor}
                    cardBgColor={cardBgColor}
                    titleColor={titleColor}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
