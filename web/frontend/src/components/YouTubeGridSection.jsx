import { useCallback, useEffect, useMemo, useState } from 'react';
import { Calendar, ExternalLink, Play, X, Youtube } from 'lucide-react';
import { fetchYouTubeVideos } from '../api/youtube';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { YouTubeVideoCardSkeleton } from './YouTubeVideoCardSkeleton';

const DEFAULT_ACCENT = '#22acb6';

function gridColsClass(columns) {
  const cols = Number(columns) || 3;
  if (cols === 2) return 'grid-cols-1 sm:grid-cols-2';
  if (cols === 4) return 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-4';
  return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
}

function VideoModal({ video, onClose, accent }) {
  useEffect(() => {
    if (!video) return undefined;

    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [video, onClose]);

  if (!video) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-[#0f172a]/85 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={video.title || 'YouTube video'}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-black shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-10 inline-flex size-10 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/80"
          aria-label="Close video"
        >
          <X className="size-5" />
        </button>
        <div className="aspect-video w-full bg-black">
          <iframe
            title={video.title || 'YouTube video'}
            src={video.embedUrl}
            className="h-full w-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
        <div className="border-t border-white/10 bg-[#111827] px-5 py-4 text-white">
          <h3 className="text-lg font-bold leading-snug" style={{ fontFamily: 'Museo, Helvetica, sans-serif' }}>
            {video.title}
          </h3>
          {video.date ? (
            <p className="mt-1 flex items-center gap-1.5 text-sm text-[#94a3b8]">
              <Calendar className="size-4" style={{ color: accent }} aria-hidden />
              {video.date}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function VideoCard({ video, accent, showDate, onPlay }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#e8e8e8] bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)] transition hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(15,23,42,0.12)]">
      <button
        type="button"
        onClick={() => onPlay(video)}
        className="relative block w-full overflow-hidden text-left"
        aria-label={`Play ${video.title}`}
      >
        <div className="aspect-video w-full overflow-hidden bg-[#1e293b]">
          <ImageWithFallback
            src={video.thumbnailUrl}
            alt=""
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0f172a]/70 via-transparent to-transparent opacity-80" />
        <span
          className="pointer-events-none absolute left-1/2 top-1/2 flex size-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-white shadow-lg transition group-hover:scale-110"
          style={{ backgroundColor: '#ff0000' }}
        >
          <Play className="ml-0.5 size-7 fill-current" aria-hidden />
        </span>
      </button>
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <h3
          className="mb-2 line-clamp-2 text-base font-bold leading-snug text-[#1e293b]"
          style={{ fontFamily: 'Museo, Helvetica, sans-serif' }}
        >
          {video.title}
        </h3>
        {showDate && video.date ? (
          <p className="mt-auto flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-[#64748b]">
            <Calendar className="size-3.5" style={{ color: accent }} aria-hidden />
            {video.date}
          </p>
        ) : null}
      </div>
    </article>
  );
}

export function YouTubeGridSection({
  title = 'Our YouTube Channel',
  intro = '',
  maxVideos = 6,
  columns = 3,
  channelId = '',
  channelUrl = '',
  viewChannelLabel = 'Visit our YouTube channel',
  accentColor = DEFAULT_ACCENT,
  showPublishedDate = true,
}) {
  const accent = accentColor || DEFAULT_ACCENT;
  const limit = Math.min(12, Math.max(3, Number(maxVideos) || 6));
  const [items, setItems] = useState([]);
  const [channel, setChannel] = useState({ id: '', title: '', url: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeVideo, setActiveVideo] = useState(null);

  const closeVideo = useCallback(() => {
    setActiveVideo(null);
  }, []);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await fetchYouTubeVideos({ max: limit, channelId });
      setItems(Array.isArray(data?.items) ? data.items : []);
      setChannel(data?.channel || { id: '', title: '', url: '' });
      if (data?.error) {
        setError(data.error);
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('[YouTubeGridSection] Load failed', e);
      setItems([]);
      setError('Failed to load videos. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [limit, channelId]);

  useEffect(() => {
    load();
  }, [load]);

  const channelHref = useMemo(() => {
    const custom = String(channelUrl || '').trim();
    if (custom) return custom;
    return String(channel?.url || '').trim();
  }, [channelUrl, channel]);

  const colsClass = gridColsClass(columns);

  return (
    <section className="w-full py-10 px-4 sm:px-6 lg:px-8" style={{ scrollMarginTop: '100px' }}>
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p
              className="mb-2 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em]"
              style={{ color: accent, fontFamily: 'Gotham Rounded, sans-serif' }}
            >
              <Youtube className="size-4" aria-hidden />
              YouTube
            </p>
            <h2
              className="text-3xl font-black text-[#1e293b] sm:text-4xl"
              style={{ fontFamily: 'Museo, Helvetica, sans-serif' }}
            >
              {title}
            </h2>
            {intro ? (
              <p className="mt-3 text-base leading-relaxed text-[#64748b]">{intro}</p>
            ) : null}
          </div>
          {channelHref ? (
            <a
              href={channelHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-2 self-start rounded-full px-5 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:opacity-90 lg:self-auto"
              style={{ backgroundColor: accent }}
            >
              {viewChannelLabel}
              <ExternalLink className="size-4" aria-hidden />
            </a>
          ) : null}
        </div>

        {error && !isLoading ? (
          <div className="mb-6 rounded-xl border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-sm text-[#b91c1c]">
            {error}
          </div>
        ) : null}

        <div className={`grid gap-6 ${colsClass}`}>
          {isLoading
            ? Array.from({ length: limit }, (_, i) => <YouTubeVideoCardSkeleton key={`yt-skel-${i}`} />)
            : items.map((video) => (
                <VideoCard
                  key={video.videoId || video.id}
                  video={video}
                  accent={accent}
                  showDate={showPublishedDate}
                  onPlay={setActiveVideo}
                />
              ))}
        </div>

        {!isLoading && items.length === 0 && !error ? (
          <p className="mt-6 text-center text-sm text-[#64748b]">No videos available yet.</p>
        ) : null}
      </div>

      {activeVideo ? (
        <VideoModal video={activeVideo} onClose={closeVideo} accent={accent} />
      ) : null}
    </section>
  );
}
