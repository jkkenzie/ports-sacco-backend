export function YouTubeVideoCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#e8e8e8] bg-white shadow-sm animate-pulse">
      <div className="aspect-video bg-[#e2e8f0]" />
      <div className="space-y-3 p-4">
        <div className="h-4 w-4/5 rounded bg-[#e2e8f0]" />
        <div className="h-3 w-1/3 rounded bg-[#eef2f7]" />
      </div>
    </div>
  );
}
