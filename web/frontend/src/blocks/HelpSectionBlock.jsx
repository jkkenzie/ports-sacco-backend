import React, { useId } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import svgPaths from '../imports/svg-ks2hcu51vg';
import { scrollToNearestSection } from '../utils/scrollToSection';

function str(v) {
  return typeof v === 'string' ? v.trim() : '';
}

function phoneToTelHref(phone) {
  const raw = typeof phone === 'string' ? phone.trim() : '';
  if (!raw) return '';
  const cleaned = raw.replace(/[^\d+]/g, '');
  return cleaned ? `tel:${cleaned}` : '';
}

function emailToMailtoHref(email) {
  const raw = typeof email === 'string' ? email.trim() : '';
  if (!raw) return '';
  return `mailto:${raw}`;
}

function resolveCardPrimaryHref(card) {
  const mode = str(card.ctaMode);
  const ctaUrl = str(card.ctaUrl);
  const waUrl = str(card.whatsappUrl);

  if (mode === 'whatsapp' && waUrl) {
    return { href: waUrl, openInNewTab: true };
  }
  if (mode === 'link' && ctaUrl) {
    return { href: ctaUrl, openInNewTab: !ctaUrl.startsWith('/') };
  }
  return null;
}

function hasInlineContactLinks(card) {
  return Boolean(phoneToTelHref(card.phone) || emailToMailtoHref(card.email));
}

function stopNestedCardNav(event) {
  event.stopPropagation();
}

function navigateToHref(href, openInNewTab, navigate) {
  if (href.startsWith('/')) {
    navigate(href);
    return;
  }
  if (openInNewTab) {
    window.open(href, '_blank', 'noopener,noreferrer');
    return;
  }
  window.location.assign(href);
}

function cardAriaLabel(card) {
  const title = String(card.titleHtml || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  return title || 'Help option';
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

function ApplyLoanIcon({ className = 'w-12 h-12' }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 33.97 44.29" className={className} style={{ fill: 'currentColor' }} aria-hidden>
      <path d="M33.97,44.29H0V0h33.97v44.29ZM31.46,2.6H2.62v39h18.35v-10.64h10.49V2.6ZM23.66,33.76v5.49c1.87-1.79,3.77-3.61,5.73-5.49h-5.73ZM31.38,36.89c-1.55,1.48-3.27,3.12-4.87,4.66h4.87v-4.66Z" />
      <path d="M25.91,21.09v2.39H8.57v-2.39h17.34Z" />
      <path d="M8.52,12.57v-2.33h17.33v2.33H8.52Z" />
      <path d="M8.51,18.12v-2.35h17.33v2.35H8.51Z" />
    </svg>
  );
}

function CallUsIcon({ className = 'w-12 h-12' }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 41.42 41.37" className={className} style={{ fill: 'currentColor' }} aria-hidden>
      <path d="M34.87,41.37c-.73-.08-1.46-.16-2.2-.24-3.74-.41-7.35-1.36-10.76-2.95C11.14,33.15,4.19,24.87,1.1,13.39.3,10.43-.04,7.4,0,4.33c.02-1.18.74-2.16,1.91-2.43C4.48,1.28,7.04.68,9.61.12c.56-.12,1.18-.16,1.74-.08.79.12,1.34.67,1.66,1.4,1.27,2.93,2.53,5.87,3.78,8.81.46,1.08.16,2.21-.76,2.98-1.42,1.18-2.85,2.34-4.32,3.54,2.88,5.7,7.16,9.98,12.88,12.88,1.12-1.36,2.23-2.7,3.31-4.06.62-.77,1.35-1.28,2.37-1.21.31.02.64.1.93.23,2.9,1.23,5.78,2.48,8.68,3.71.82.35,1.27,1,1.55,1.8v1.13s-.07.09-.08.14c-.6,2.6-1.2,5.21-1.79,7.81-.15.68-.44,1.28-1.02,1.68-.28.2-.6.32-.91.48h-2.75ZM30.15,27.02c-.11.12-.19.21-.27.3-1.43,1.75-2.87,3.5-4.28,5.27-.22.27-.38.29-.66.14-.49-.27-1.01-.5-1.51-.76-3.37-1.74-6.46-3.88-9.04-6.7-2.44-2.67-4.26-5.74-5.82-8.98-.13-.26.01-.36.18-.49,1.79-1.45,3.57-2.91,5.36-4.37.16-.13.25-.23.15-.46-1.17-2.7-2.33-5.41-3.48-8.12-.1-.25-.23-.28-.46-.22-.42.11-.84.2-1.25.3-2.13.49-4.26.99-6.46,1.49.2,9.76,3.68,18.12,10.75,24.86,6.58,6.27,14.51,9.33,23.59,9.48.61-2.64,1.21-5.21,1.81-7.79.05-.22-.05-.3-.24-.38-.67-.28-1.33-.57-2-.85-2.11-.9-4.22-1.81-6.36-2.72Z" />
      <path d="M21.31,3.32c7.92.33,14.52,5.89,16.12,13.62.23,1.1.27,2.24.34,3.37.05.78-.46,1.3-1.15,1.32-.72.01-1.2-.51-1.24-1.3-.04-.74-.06-1.48-.17-2.21-.46-3.03-1.77-5.65-3.88-7.86-2.28-2.39-5.06-3.84-8.31-4.37-.77-.13-1.55-.15-2.33-.19-.76-.03-1.31-.5-1.32-1.18,0-.68.54-1.19,1.3-1.19.22,0,.43,0,.65,0Z" />
      <path d="M21.14,8.98c5.43.18,10,4.26,10.83,9.65.08.54.13,1.1.15,1.65.02.81-.47,1.34-1.18,1.34-.72,0-1.2-.52-1.22-1.32-.07-4.13-2.76-7.6-6.77-8.65-.73-.19-1.51-.25-2.27-.3-.76-.05-1.3-.5-1.31-1.19-.01-.69.52-1.19,1.29-1.19.16,0,.32,0,.49,0Z" />
    </svg>
  );
}

function TalkToAdvisorIcon({ className = 'w-12 h-12' }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44.53 40.99" className={className} style={{ fill: 'currentColor' }} aria-hidden>
      <path d="M0,40.99v-4.56c0-.11.97-1.71,1.15-1.96,1.57-2.17,4.93-3.09,6.85-4.72.84-.71.88-2.5.62-3.5-.15-.58-1.21-1.51-1.59-2.19-1.26-2.27-2.27-4.56-1.93-7.21.09-.68.57-.94.67-1.56.16-.99-.08-2.23.04-3.3.69-6.42,7.42-7.91,12.65-5.93.67-2.75,1.99-4.51,4.73-5.4,4.55-1.47,11.66-.73,12.99,4.73.53,2.17.03,4.16.34,6.11.1.63.57,1.03.66,1.79s.1,2.8-.02,3.55c-.2,1.28-1.25,1.7-1.85,2.6-.26.39-2.47,4.33-2.53,4.59-.17.65-.13,2.73.12,3.34.57,1.41,7.53,3.85,9.29,5.4.63.56,2.34,2.93,2.34,3.67v4.23l-.33.33H0ZM12.02,39.21h30.95c.88-6.73-6.9-6.81-10.54-9.82-1.46-1.21-1.9-4.01-1.38-5.76.22-.75,1.57-2.22,2.02-3.09.35-.69.6-1.99.89-2.44.24-.37.91-.47,1.15-.74.6-.68.62-2.89.46-3.78-.14-.78-.74-1.11-.83-1.61-.53-2.74.95-5.63-1.11-8.23-2.01-2.54-8.8-2.6-11.34-.87-3.27,2.22-1.83,5.75-2.23,8.89-.09.68-.57.94-.67,1.56-.1.58-.11,2.77,0,3.32s.62.7.84,1.17c.6,1.3.82,2.62,1.57,4,.31.57,1.1,1.25,1.28,1.84.23.77.17,2.76,0,3.57-.78,3.47-8.51,4.68-10.36,7.89-.8,1.39-.71,2.55-.66,4.12ZM10.24,39.21c-.8-6.83,5.91-8.32,10.45-11.25.9-.61.87-3.04.63-3.94-.13-.48-1.13-1.68-1.44-2.34-.65-1.39-1.24-2.76-1.89-4.12-1.32-2.74.21-4.35.5-6.49.11-.85-.06-1.98-.05-2.87-2.69-2.26-9.09-1.57-10.48,1.92-.89,2.23-.35,3.53-.46,5.59-.03.53-.48.52-.59.75-.3.64-.34,2.33-.23,3.04.03.21,1.57,3.3,1.81,3.75.35.64,1.84,2.29,1.91,2.54.17.56.08,2.15-.01,2.79-.57,3.84-7.49,4.42-8.66,8.25-.18.58-.56,1.98-.08,2.37h8.57Z" />
    </svg>
  );
}

function WhatsAppIcon({ className = 'w-10 h-10' }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 42.88 42.88" className={className} aria-hidden>
      <path d="M21.44,42.88c-3.75,0-7.43-.99-10.69-2.88l-8.35,2.88,1.72-8.84C1.42,30.34,0,26.01,0,21.44,0,9.62,9.62,0,21.44,0s21.44,9.62,21.44,21.44-9.62,21.44-21.44,21.44Z" style={{ fill: '#32ba46' }} />
      <g>
        <path d="M21.44,35.44c-2.45,0-4.86-.65-6.99-1.88l-5.46,1.88,1.12-5.78c-1.76-2.41-2.68-5.24-2.68-8.23,0-7.72,6.28-14.01,14.01-14.01s14.01,6.28,14.01,14.01-6.28,14.01-14.01,14.01ZM14.71,31.27l.42.26c1.9,1.19,4.08,1.82,6.31,1.82,6.57,0,11.92-5.35,11.92-11.92s-5.35-11.92-11.92-11.92-11.92,5.35-11.92,11.92c0,2.67.88,5.21,2.53,7.33l.29.37-.61,3.16,2.98-1.02Z" style={{ fill: '#fff' }} />
        <path d="M14.37,16.06s.82-1.44,1.49-1.52c.67-.08,1.53-.08,1.76.36.23.44,1.27,2.98,1.27,2.98,0,0,.18.44-.1.86-.27.42-.89,1.04-.89,1.04,0,0-.34.44,0,.9.34.46.87,1.32,1.97,2.42,1.1,1.1,3.2,1.88,3.2,1.88,0,0,.3.04.49-.15.19-.19,1.23-1.49,1.23-1.49,0,0,.33-.43.89-.18.55.25,2.96,1.45,2.96,1.45,0,0,.28.1.28.53s-.17,1.46-.52,1.81c-.35.35-1.38,1.43-2.92,1.43s-5.21-1.25-7.17-3.21c-1.96-1.96-3.69-3.94-4.1-5.75-.41-1.81-.36-2.62.15-3.37Z" style={{ fill: '#fff' }} />
      </g>
    </svg>
  );
}

const ICON_MAP = {
  apply: ApplyLoanIcon,
  call: CallUsIcon,
  advisor: TalkToAdvisorIcon,
};

const DEFAULT_CARDS = [
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

function normalizeCards(raw) {
  const src = Array.isArray(raw) && raw.length > 0 ? raw.slice(0, 3) : [];
  const out = [];
  for (let i = 0; i < 3; i++) {
    const row = src[i];
    const d = DEFAULT_CARDS[i];
    if (!row) {
      out.push({ ...d });
      continue;
    }
    out.push({
      iconKey: ['apply', 'call', 'advisor'].includes(str(row?.iconKey)) ? str(row.iconKey) : d.iconKey,
      titleHtml: row?.titleHtml != null ? String(row.titleHtml) : d.titleHtml,
      bodyHtml: row?.bodyHtml != null ? String(row.bodyHtml) : d.bodyHtml,
      ctaMode: ['link', 'whatsapp', 'none'].includes(str(row?.ctaMode)) ? str(row.ctaMode) : d.ctaMode,
      ctaLabelHtml: row?.ctaLabelHtml != null ? String(row.ctaLabelHtml) : d.ctaLabelHtml,
      ctaUrl: row?.ctaUrl != null ? String(row.ctaUrl) : d.ctaUrl,
      whatsappUrl: row?.whatsappUrl != null ? String(row.whatsappUrl) : d.whatsappUrl,
      phone: row?.phone != null ? String(row.phone) : d.phone,
      email: row?.email != null ? String(row.email) : d.email,
    });
  }
  return out;
}

function HelpCard({
  card,
  index,
  cardSurfaceHover,
  iconColor,
  iconHoverCol,
  titleCol,
  bodyCol,
  metaCol,
  ctaCol,
  chevronBg,
  chevronBgHover,
  chevronIcon,
  chevronIconHover,
}) {
  const navigate = useNavigate();
  const Icon = ICON_MAP[card.iconKey] || ApplyLoanIcon;
  const phoneHref = phoneToTelHref(card.phone);
  const emailHref = emailToMailtoHref(card.email);
  const destination = resolveCardPrimaryHref(card);
  const inlineContactLinks = hasInlineContactLinks(card);
  const isCardClickable = Boolean(destination?.href);
  const useSplitInteraction = isCardClickable && inlineContactLinks;
  const cardClassName =
    'group/card relative flex flex-col items-center overflow-hidden rounded-2xl p-6 text-center transition-shadow duration-200 lg:p-8 min-h-[298px] w-full min-w-[273px] max-w-[330px] no-underline';
  const clickableClassName = isCardClickable
    ? 'cursor-pointer hover:shadow-[0_12px_28px_rgba(34,172,182,0.18)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#22acb6]'
    : 'cursor-default';
  const cardStyle = {
    '--card-surface': '#ffffff',
    '--card-surface-hover': cardSurfaceHover,
    '--card-icon': iconColor,
    '--card-icon-hover': iconHoverCol,
    '--card-chevron-bg': chevronBg,
    '--card-chevron-bg-hover': chevronBgHover,
    '--card-chevron-fg': chevronIcon,
    '--card-chevron-fg-hover': chevronIconHover,
  };

  const activateCard = () => {
    if (!destination?.href) return;
    navigateToHref(destination.href, destination.openInNewTab, navigate);
  };

  const handleCardKeyDown = (event) => {
    if (!isCardClickable || !useSplitInteraction) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      activateCard();
    }
  };

  const cardInner = (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 272.94 298.2"
        className="pointer-events-none absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          className="transition-[fill] duration-200 [fill:var(--card-surface)] group-hover/card:[fill:var(--card-surface-hover)]"
          d="M13.61.11l244.59-.11c8.13.38,14.14,6.34,14.75,14.44v232.7c-.55,6.93-6.27,13.04-13.25,13.76-7.4.76-11.9.54-17.66,6.25-5.68,5.63-5.69,10.18-6.37,17.53-.65,6.94-6.38,12.61-13.23,13.47l-207.69.05c-8.23-.54-14.07-6.21-14.75-14.44V14.44C.57,6.84,5.98.92,13.61.11Z"
        />
      </svg>
      <div className="relative z-10 flex h-full w-full flex-col items-center justify-between text-center">
        <div className="flex flex-col items-center">
          <div className="mb-4 flex-shrink-0 transition-colors duration-200 [color:var(--card-icon)] group-hover/card:[color:var(--card-icon-hover)]">
            <Icon className="h-12 w-12" />
          </div>
          <h3
            className="font-bold uppercase text-sm lg:text-base mb-3 [&_p]:m-0"
            style={{ color: titleCol }}
            dangerouslySetInnerHTML={{ __html: card.titleHtml || '' }}
          />
          {str(card.bodyHtml) ? (
            <div
              className="text-sm leading-relaxed mb-4 [&_p]:m-0"
              style={{ color: bodyCol }}
              dangerouslySetInnerHTML={{ __html: card.bodyHtml }}
            />
          ) : null}
          {str(card.phone) ? (
            phoneHref ? (
              <a
                href={phoneHref}
                className="relative z-20 font-bold text-base mb-1 transition-colors hover:text-[#22acb6] hover:underline"
                style={{ color: metaCol }}
                onClick={stopNestedCardNav}
              >
                {card.phone}
              </a>
            ) : (
              <span className="font-bold text-base mb-1" style={{ color: metaCol }}>
                {card.phone}
              </span>
            )
          ) : null}
          {str(card.email) ? (
            emailHref ? (
              <a
                href={emailHref}
                className="relative z-20 text-sm mb-4 transition-colors hover:text-[#22acb6] hover:underline"
                style={{ color: metaCol }}
                onClick={stopNestedCardNav}
              >
                {card.email}
              </a>
            ) : (
              <span className="text-sm mb-4" style={{ color: metaCol }}>
                {card.email}
              </span>
            )
          ) : null}
        </div>
        <div className="pt-2">
          {card.ctaMode === 'whatsapp' ? (
            <div className="flex flex-col items-center">
              <WhatsAppIcon />
              <span className="inline-block mt-1 w-16 border-b-2 border-[#22acb6] transition-colors duration-200 group-hover/card:border-[#ee6e2a]" />
            </div>
          ) : card.ctaMode === 'link' && str(card.ctaLabelHtml) ? (
            <span
              className="text-sm font-bold border-b-2 transition-colors duration-200 border-[#22acb6] group-hover/card:border-[#ee6e2a] inline-block"
              style={{ color: ctaCol }}
              dangerouslySetInnerHTML={{ __html: card.ctaLabelHtml }}
            />
          ) : null}
        </div>
      </div>
      <span
        className="pointer-events-none absolute bottom-0 right-0 z-20 flex h-[31px] w-[31px] items-center justify-center rounded-full shadow transition-[background-color] duration-200 [background-color:var(--card-chevron-bg)] group-hover/card:[background-color:var(--card-chevron-bg-hover)]"
        aria-hidden
      >
        <ChevronRight
          className="h-4 w-4 transition-colors [color:var(--card-chevron-fg)] group-hover/card:[color:var(--card-chevron-fg-hover)]"
          strokeWidth={2}
        />
      </span>
    </>
  );

  if (!isCardClickable) {
    return (
      <div
        key={`${card.iconKey}-${index}`}
        className={`${cardClassName} ${clickableClassName}`}
        style={cardStyle}
      >
        {cardInner}
      </div>
    );
  }

  const ariaLabel = cardAriaLabel(card);

  if (useSplitInteraction) {
    return (
      <div
        key={`${card.iconKey}-${index}`}
        role="link"
        tabIndex={0}
        className={`${cardClassName} ${clickableClassName}`}
        style={cardStyle}
        aria-label={ariaLabel}
        onClick={activateCard}
        onKeyDown={handleCardKeyDown}
      >
        {cardInner}
      </div>
    );
  }

  const { href, openInNewTab } = destination;

  if (href.startsWith('/')) {
    return (
      <a
        key={`${card.iconKey}-${index}`}
        href={href}
        className={`${cardClassName} ${clickableClassName}`}
        style={cardStyle}
        aria-label={ariaLabel}
        onClick={(event) => {
          event.preventDefault();
          navigate(href);
        }}
      >
        {cardInner}
      </a>
    );
  }

  return (
    <a
      key={`${card.iconKey}-${index}`}
      href={href}
      className={`${cardClassName} ${clickableClassName}`}
      style={cardStyle}
      aria-label={ariaLabel}
      {...(openInNewTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {cardInner}
    </a>
  );
}

/**
 * CMS-driven “We are here to help” section (Gutenberg: custom/help-section).
 */
export function HelpSectionBlock({
  sectionId,
  anchor,
  sectionBgColor,
  showTopBar = true,
  topBarBg,
  waveAccentColor,
  scrollOuterColor,
  scrollInnerColor,
  kickerHtml,
  kickerColor,
  talkButtonHtml,
  talkButtonBg,
  talkButtonTextColor,
  cardIconColor,
  cardIconHoverColor,
  cardBgHoverColor,
  titleHeadingColor,
  bodyTextColor,
  metaTextColor,
  ctaTextColor,
  cardChevronBg,
  cardChevronBgHover,
  cardChevronIconColor,
  cardChevronIconHoverColor,
  cards,
}) {
  const reactId = useId().replace(/:/g, '');
  const clipTop = `clip-help-top-${reactId}`;
  const clipScroll = `clip0_scroll_help_${reactId}`;

  const explicitAnchor = str(anchor);
  const derived = slugifyId(str(sectionId));
  const sectionDomId = explicitAnchor || derived || 'help';

  const bg = str(sectionBgColor) || '#00AFBB';
  const barWhite = str(topBarBg) || '#FFFFFF';
  const waveAccent = str(waveAccentColor) || '#00AFBB';
  const scrollOut = str(scrollOuterColor) || '#ffffff';
  const scrollIn = str(scrollInnerColor) || '#22ACB6';
  const kicker = str(kickerHtml);
  const kickerCol = str(kickerColor) || '#ffffff';
  const talkBtn = str(talkButtonHtml) || 'TALK TO US!';
  const talkBg = str(talkButtonBg) || '#EE6E2A';
  const talkFg = str(talkButtonTextColor) || '#ffffff';
  const iconColor = str(cardIconColor) || '#22acb6';
  const iconHoverCol = str(cardIconHoverColor) || '#EE6E2A';
  const cardSurfaceHover = str(cardBgHoverColor) || '#f0fdfa';
  const titleCol = str(titleHeadingColor) || '#808080';
  const bodyCol = str(bodyTextColor) || '#000000';
  const metaCol = str(metaTextColor) || '#808080';
  const ctaCol = str(ctaTextColor) || '#808080';
  const chevronBg = str(cardChevronBg) || '#ffffff';
  const chevronBgHover = str(cardChevronBgHover) || chevronBg;
  const chevronIcon = str(cardChevronIconColor) || '#22acb6';
  const chevronIconHover = str(cardChevronIconHoverColor) || '#ee6e2a';

  const cardList = normalizeCards(cards);
  const hasTopBar = showTopBar !== false;

  return (
    <div
      id={sectionDomId}
      className="relative pt-0 pb-16 overflow-visible"
      style={{ fontFamily: 'Sans-serif, Helvetica, sans-serif', backgroundColor: bg }}
    >
      {hasTopBar ? (
        <div className="relative w-full overflow-hidden flex-shrink-0" style={{ backgroundColor: barWhite, minHeight: '37px' }}>
          <svg
            viewBox="0 0 1088.78 38.01"
            xmlns="http://www.w3.org/2000/svg"
            className="h-auto absolute left-1/2"
            style={{
              display: 'block',
              minWidth: '1089px',
              width: '1089px',
              transform: 'translateX(-50%)',
            }}
            preserveAspectRatio="none"
            aria-hidden
          >
            <defs>
              <clipPath id={clipTop}>
                <rect x="484.39" y="0" width="120" height="38.01" />
              </clipPath>
            </defs>
            <g clipPath={`url(#${clipTop})`}>
              <rect x="422.93" width="240.31" height="38.01" style={{ fill: waveAccent }} />
              <path
                d="M1088.78,38.01h-485.18c-9.52-.55-19.25-5.16-24.51-12.52-1.19-1.67-1.76-3.43-2.78-5.14-13.44-22.42-47.98-22.41-61.41,0-1.02,1.71-1.59,3.47-2.78,5.14-5.25,7.34-15.01,11.97-24.51,12.52H0V0h1088.78v38.01Z"
                style={{ fill: barWhite }}
              />
            </g>
          </svg>
        </div>
      ) : null}

      {/* Kicker | scroll + badge | spacer — same grid as PartnersCarouselBlock */}
      <div
        className={`max-w-7xl mx-auto px-4 relative z-10 ${hasTopBar ? '-mt-7' : 'mt-0'} mb-0`}
        style={{ animation: 'fadeInUp 0.8s ease-out' }}
      >
        <div
          className={`grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] gap-x-4 gap-y-4 mb-8 lg:mb-12 pt-0 lg:items-end`}
        >
          {kicker ? (
            <div className="order-2 min-w-0 w-full justify-self-start self-end lg:order-none lg:max-w-[100%] lg:pr-4">
              <div
                className="uppercase text-left [&_p]:m-0"
                style={{
                  fontFamily: 'Sans-serif, Helvetica, sans-serif',
                  fontWeight: 500,
                  fontSize: '14px',
                  color: kickerCol,
                }}
                dangerouslySetInnerHTML={{ __html: kicker }}
              />
            </div>
          ) : (
            <div className="min-w-0 hidden lg:block" aria-hidden="true" />
          )}

          <div
            className={`order-1 flex flex-col items-center justify-self-center self-end shrink-0 mb-0 lg:order-none ${
              talkBtn ? 'gap-[50px]' : ''
            }`}
          >
            {hasTopBar ? (
              <button
                type="button"
                onClick={scrollToNearestSection}
                className="hover:opacity-80 transition-opacity relative p-3 sm:p-4 cursor-pointer shrink-0"
                style={{ animation: 'float 3s ease-in-out infinite' }}
                aria-label="Scroll section to top"
              >
                <svg className="block w-14 h-14" fill="none" preserveAspectRatio="none" viewBox="0 0 57.7882 57.648">
                  <g clipPath={`url(#${clipScroll})`}>
                    <path d={svgPaths.p1076300} fill={scrollOut} />
                    <path d={svgPaths.p27278800} fill={scrollIn} />
                  </g>
                  <defs>
                    <clipPath id={clipScroll}>
                      <rect fill="white" height="57.648" width="57.7882" />
                    </clipPath>
                  </defs>
                </svg>
              </button>
            ) : null}
            {talkBtn ? (
              <div
                className="px-6 rounded-full text-xs font-medium whitespace-nowrap inline-flex items-center shadow-sm [&_p]:m-0"
                style={{
                  fontFamily: 'Sans-serif, Helvetica, sans-serif',
                  minHeight: '36px',
                  backgroundColor: talkBg,
                  color: talkFg,
                }}
                dangerouslySetInnerHTML={{ __html: talkBtn }}
              />
            ) : null}
          </div>

          <div className="order-3 min-w-0 hidden lg:block" aria-hidden="true" />
        </div>
      </div>

      <div className="max-w-full mx-auto px-0 py-12" style={{ animation: 'fadeInUp 0.8s ease-out' }}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 justify-items-center">
          {cardList.map((card, index) => (
            <HelpCard
              key={`${card.iconKey}-${index}`}
              card={card}
              index={index}
              cardSurfaceHover={cardSurfaceHover}
              iconColor={iconColor}
              iconHoverCol={iconHoverCol}
              titleCol={titleCol}
              bodyCol={bodyCol}
              metaCol={metaCol}
              ctaCol={ctaCol}
              chevronBg={chevronBg}
              chevronBgHover={chevronBgHover}
              chevronIcon={chevronIcon}
              chevronIconHover={chevronIconHover}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export const HELP_SECTION_DEFAULT_PROPS = {
  sectionId: 'help',
  sectionBgColor: '#00AFBB',
  topBarBg: '#FFFFFF',
  waveAccentColor: '#00AFBB',
  scrollOuterColor: '#ffffff',
  scrollInnerColor: '#22ACB6',
  kickerHtml: '<p>WE ARE HERE TO HELP YOU</p>',
  kickerColor: '#ffffff',
  talkButtonHtml: 'TALK TO US!',
  talkButtonBg: '#EE6E2A',
  talkButtonTextColor: '#ffffff',
  cardIconColor: '#22acb6',
  cardIconHoverColor: '#EE6E2A',
  cardBgHoverColor: '#f0fdfa',
  titleHeadingColor: '#808080',
  bodyTextColor: '#000000',
  metaTextColor: '#808080',
  ctaTextColor: '#808080',
  cardChevronBg: '#ffffff',
  cardChevronBgHover: '#ffffff',
  cardChevronIconColor: '#22acb6',
  cardChevronIconHoverColor: '#ee6e2a',
  cards: DEFAULT_CARDS.map((c) => ({ ...c })),
};
