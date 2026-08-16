/**
 * Matches SavingsProductsCardsSection / EventsCardsSection archive skeleton.
 */
export function NewsArchiveCardSkeleton({ index = 0 }) {
  return (
    <div
      key={`news-skeleton-${index}`}
      className="relative w-full max-w-[350px] bg-white rounded-3xl p-2 my-6 border-[#e8e8e8] border-[2px] animate-pulse"
    >
      <div className="relative w-full h-[220px] rounded-t-3xl bg-[#dfe5ea]" />
      <div className="p-6 pt-6 pb-[0px]">
        <div className="h-7 w-3/4 rounded bg-[#dfe5ea] mb-3" />
        <div className="w-full h-px bg-gray-300 mb-3" />
        <div className="h-4 w-full rounded bg-[#e7ebef] mb-2" />
        <div className="h-4 w-5/6 rounded bg-[#e7ebef] mb-2" />
        <div className="h-4 w-2/3 rounded bg-[#e7ebef] mb-4" />
        <div className="h-10 w-full rounded-full bg-[#e7ebef]" />
      </div>
    </div>
  );
}
