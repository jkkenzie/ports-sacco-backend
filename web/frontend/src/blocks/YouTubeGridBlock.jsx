import React from 'react';
import { YouTubeGridSection } from '../components/YouTubeGridSection';

export function YouTubeGridBlock({
  title = 'Our YouTube Channel',
  intro = '',
  maxVideos = 6,
  columns = 3,
  channelId = '',
  channelUrl = '',
  viewChannelLabel = 'Visit our YouTube channel',
  accentColor = '#22acb6',
  showPublishedDate = true,
}) {
  return (
    <YouTubeGridSection
      title={title}
      intro={intro}
      maxVideos={maxVideos}
      columns={columns}
      channelId={channelId}
      channelUrl={channelUrl}
      viewChannelLabel={viewChannelLabel}
      accentColor={accentColor}
      showPublishedDate={showPublishedDate !== false}
    />
  );
}
