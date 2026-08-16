import React, { Suspense, lazy } from 'react';
import { HeroBlock } from './HeroBlock';
import { CardsBlock } from './CardsBlock';
import { CtaBlock } from './CtaBlock';
import { MapBlock } from './MapBlock';
import { CoreMenuBlock } from './CoreMenuBlock';
import { CoreHeadingBlock, CoreListBlock, CoreParagraphBlock } from './CoreRichTextBlocks';
import { MissionVisionBlock } from './MissionVisionBlock';
import { AboutUsStatsBlock } from './AboutUsStatsBlock';
import { AboutUsAwardsBlock } from './AboutUsAwardsBlock';
import { AboutUsHelpBlock } from './AboutUsHelpBlock';
import { SavingsArchiveHeroBlock } from './SavingsArchiveHeroBlock';
import { SavingsWhySaveBlock } from './SavingsWhySaveBlock';
import { MembershipContentBlock } from './MembershipContentBlock';
import { SavingsProductsGridBlock } from './SavingsProductsGridBlock';
import { LoanProductsGridBlock } from './LoanProductsGridBlock';
import { ServicesGridBlock } from './ServicesGridBlock';
import { EventsGridBlock } from './EventsGridBlock';
import { EventsArchiveBlock } from './EventsArchiveBlock';
import { NewsGridBlock } from './NewsGridBlock';
import { YouTubeGridBlock } from './YouTubeGridBlock';
import { AssetFinanceWhateverBlock } from './AssetFinanceWhateverBlock';
import { AssetFinanceFaqBlock } from './AssetFinanceFaqBlock';
import { AssetFinanceApplyFormBlock } from './AssetFinanceApplyFormBlock';
import { DownloadAppBlock } from './DownloadAppBlock';
import { ContactMapBlock } from './ContactMapBlock';
import { HomeAboutBlock } from './HomeAboutBlock';
import { HomeProductCardsBlock } from './HomeProductCardsBlock';
import { ProductServicesBlock } from './ProductServicesBlock';
import { LoansCarouselBlock } from './LoansCarouselBlock';
import { TeamDisplayBlock } from './TeamDisplayBlock';
import { EventsCarouselBlock } from './EventsCarouselBlock';
import { SavingsCarouselBlock } from './SavingsCarouselBlock';
import { ServicesCarouselBlock } from './ServicesCarouselBlock';
import { MobileAppBlock } from './MobileAppBlock';
import { NewsletterBlock } from './NewsletterBlock';
import { PartnersCarouselBlock } from './PartnersCarouselBlock';
import { EventsBlock } from './EventsBlock';
import { MemberReviewsBlock } from './MemberReviewsBlock';
import { HelpSectionBlock } from './HelpSectionBlock';
import { HomeBannerSliderBlock } from './HomeBannerSliderBlock';
import { HomeStatsBlock } from './HomeStatsBlock';
import { RegistrationLinksBlock } from './RegistrationLinksBlock';
import { DownloadsGridBlock } from './DownloadsGridBlock';
import { FaqSectionBlock } from './FaqSectionBlock';
import { PrivacyPolicyBlock } from './PrivacyPolicyBlock';
import { CookiePolicyBlock } from './CookiePolicyBlock';

const ContactFormBlock = lazy(() =>
  import('./ContactFormBlock').then((module) => ({ default: module.ContactFormBlock }))
);

const NewMemberRegistrationBlock = lazy(() =>
  import('./NewMemberRegistrationBlock').then((module) => ({ default: module.NewMemberRegistrationBlock }))
);

const lazyBlockNames = new Set(['custom/contact-form', 'custom/new-member-registration']);

export const blockMap = {
  'custom/hero': HeroBlock,
  'custom/mission-vision': MissionVisionBlock,
  'custom/about-us-stats': AboutUsStatsBlock,
  'custom/about-us-awards': AboutUsAwardsBlock,
  'custom/about-us-help': AboutUsHelpBlock,
  'custom/savings-archive-hero': SavingsArchiveHeroBlock,
  'custom/savings-why-save': SavingsWhySaveBlock,
  'custom/membership-content': MembershipContentBlock,
  'custom/savings-products-grid': SavingsProductsGridBlock,
  'custom/loan-products-grid': LoanProductsGridBlock,
  'custom/services-grid': ServicesGridBlock,
  'custom/events-grid': EventsGridBlock,
  'custom/events-archive': EventsArchiveBlock,
  'custom/news-grid': NewsGridBlock,
  'custom/youtube-grid': YouTubeGridBlock,
  'custom/asset-finance-whatever': AssetFinanceWhateverBlock,
  'custom/asset-finance-faq': AssetFinanceFaqBlock,
  'custom/asset-finance-apply': AssetFinanceApplyFormBlock,
  'custom/contact-form': ContactFormBlock,
  'custom/new-member-registration': NewMemberRegistrationBlock,
  'custom/contact-map': ContactMapBlock,
  'custom/home-about': HomeAboutBlock,
  'custom/home-product-cards': HomeProductCardsBlock,
  'custom/product-services': ProductServicesBlock,
  'custom/loans-carousel': LoansCarouselBlock,
  'custom/team-display': TeamDisplayBlock,
  'custom/events-carousel': EventsCarouselBlock,
  'custom/savings-carousel': SavingsCarouselBlock,
  'custom/services-carousel': ServicesCarouselBlock,
  'custom/download-app': DownloadAppBlock,
  'custom/mobile-app-section': MobileAppBlock,
  'custom/newsletter-section': NewsletterBlock,
  'custom/partners-carousel': PartnersCarouselBlock,
  'custom/events-section': EventsBlock,
  'custom/member-reviews': MemberReviewsBlock,
  'custom/help-section': HelpSectionBlock,
  'custom/home-banner-slider': HomeBannerSliderBlock,
  'custom/home-stats': HomeStatsBlock,
  'custom/registration-links': RegistrationLinksBlock,
  'custom/downloads-grid': DownloadsGridBlock,
  'custom/faq-section': FaqSectionBlock,
  'custom/privacy-policy': PrivacyPolicyBlock,
  'custom/cookie-policy': CookiePolicyBlock,
  'custom/cards': CardsBlock,
  'custom/cta': CtaBlock,
  'custom/map': MapBlock,
  'core/paragraph': CoreParagraphBlock,
  'core/heading': CoreHeadingBlock,
  'core/list': CoreListBlock,
  'core/freeform': CoreParagraphBlock,
  'core/html': CoreParagraphBlock,
  'core/navigation': CoreMenuBlock,
  'core/menu': CoreMenuBlock,
};

function normalizeBlockAttributes(raw, blockName) {
  if (raw == null || typeof raw !== 'object' || Array.isArray(raw)) {
    return {};
  }
  const attrs = { ...raw };

  if (blockName === 'custom/mobile-app-section') {
    const links = Array.isArray(attrs.googlePlayLinks)
      ? attrs.googlePlayLinks
      : attrs.googlePlayLinks && typeof attrs.googlePlayLinks === 'object'
        ? Object.values(attrs.googlePlayLinks)
        : [];

    if (links.length > 0) {
      attrs.googlePlayLinks = links;
    }
  }

  return attrs;
}

function BlockNode({ block, keyPrefix, blockIndex }) {
  const Component = blockMap[block.name];
  const attrs = normalizeBlockAttributes(block.attributes, block.name);
  if (attrs.hiddenFromFront) {
    return null;
  }
  const childPrefix = `${keyPrefix}-${blockIndex}`;
  const inner = Array.isArray(block.innerBlocks) && block.innerBlocks.length > 0 && (
    <BlockRenderer blocks={block.innerBlocks} keyPrefix={childPrefix} />
  );

  if (!Component) {
    if (import.meta.env.DEV) {
      console.warn('[BlockRenderer] Unknown block:', block.name);
    }
    // Unknown wrapper blocks (e.g. core/group) can still contain renderable inner blocks.
    return inner || null;
  }

  const rendered = <Component {...attrs} />;

  return (
    <div data-block-name={block.name}>
      {lazyBlockNames.has(block.name) ? (
        <Suspense fallback={<p style={{ padding: '1.5rem 0', color: '#65605f' }}>Loading…</p>}>
          {rendered}
        </Suspense>
      ) : (
        rendered
      )}
      {inner}
    </div>
  );
}

export function BlockRenderer({ blocks, keyPrefix = 'blk' }) {
  if (!Array.isArray(blocks) || blocks.length === 0) {
    return null;
  }

  return blocks.map((block, index) => (
    <BlockNode
      key={`${keyPrefix}-${index}-${block.name}`}
      block={block}
      keyPrefix={keyPrefix}
      blockIndex={index}
    />
  ));
}
