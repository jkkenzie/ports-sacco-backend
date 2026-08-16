import React, { useMemo } from 'react';
import { Link2, Share2 } from 'lucide-react';
import { buildEventPostShareUrl, buildShareLinks } from '../utils/shareUrl';

const PLATFORMS = [
  {
    id: 'facebook',
    label: 'Facebook',
    className: 'bg-[#1877f2] hover:bg-[#166fe0]',
    icon: (
      <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden>
        <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97H15.83c-1.49 0-1.954.93-1.954 1.887v2.273h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
      </svg>
    ),
  },
  {
    id: 'x',
    label: 'X',
    className: 'bg-[#0f1419] hover:bg-black',
    icon: (
      <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    className: 'bg-[#0a66c2] hover:bg-[#0958aa]',
    icon: (
      <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden>
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 114.127 0 2.063 2.063 0 01-2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    className: 'bg-[#25d366] hover:bg-[#1fb855]',
    icon: (
      <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden>
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
  },
];

export function EventPostShareBar({ post }) {
  const shareUrl = useMemo(() => buildEventPostShareUrl(post), [post]);
  const share = post?.share || {};
  const links = useMemo(
    () =>
      buildShareLinks({
        url: shareUrl,
        title: share.title || post?.title || '',
        description: share.description || post?.excerpt || post?.description || '',
      }),
    [shareUrl, share.title, share.description, post?.title, post?.excerpt, post?.description]
  );

  const openShare = (platformId) => {
    const href = links[platformId];
    if (!href) return;
    window.open(href, '_blank', 'noopener,noreferrer,width=600,height=520');
  };

  return (
    <section
      className="mt-8 rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] p-5 sm:p-6"
      aria-label="Share this event"
    >
      <div className="mb-4 flex items-center gap-2 text-[#1e293b]">
        <Share2 className="size-5 text-[#22acb6]" aria-hidden />
        <h2 className="text-lg font-bold" style={{ fontFamily: 'Museo, Helvetica, sans-serif' }}>
          Share this event
        </h2>
      </div>

      <div className="flex flex-wrap gap-3">
        {PLATFORMS.map((platform) => (
          <button
            key={platform.id}
            type="button"
            onClick={() => openShare(platform.id)}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white transition-colors ${platform.className}`}
            aria-label={`Share on ${platform.label}`}
          >
            {platform.icon}
            <span>{platform.label}</span>
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-[#64748b]">
        <Link2 className="size-4 shrink-0 text-[#22acb6]" aria-hidden />
        <span className="break-all">{shareUrl}</span>
      </div>
    </section>
  );
}
