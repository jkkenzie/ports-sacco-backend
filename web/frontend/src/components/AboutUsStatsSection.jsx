import {
  STATS_ITEMS,
  AwardsIcon,
  ProductsIcon,
  MembersIcon,
} from './StatsSection';

const TEAL = '#40C9BF';
const ORANGE = '#EE6E2A';

const ICONS = [AwardsIcon, ProductsIcon, MembersIcon];

export function AboutUsStatsSection() {
  return (
    <section
      id="stats"
      className="w-full py-12 lg:py-16"
      style={{
        backgroundColor: '#eef0f3',
        fontFamily: 'Sans-serif, Helvetica, sans-serif',
      }}
    >
      <style>{`
        .about-us-stats-section .about-us-stat-icon {
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .about-us-stats-section .about-us-stat-icon svg {
          width: 100%;
          height: 100%;
          min-width: 0;
          min-height: 0;
        }
      `}</style>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 min-[480px]:grid-cols-3 gap-8 lg:gap-10">
          {STATS_ITEMS.map((item, index) => {
            const Icon = ICONS[index];
            return (
              <div
                key={index}
                className="flex flex-col items-center text-center"
              >
                {/* Figure and icon in same row, TEAL, aligned to bottom */}
                <div
                  className="flex flex-row items-end justify-center gap-3 mb-3"
                  style={{ color: TEAL }}
                >
                  <span
                    className="text-[34px] min-[768px]:text-[48px]"
                    style={{ fontFamily: 'Museo, sans-serif', fontWeight: 700, lineHeight: 0.8 }}
                  >
                    {item.number}
                  </span>
                  <div className="flex-shrink-0 about-us-stat-icon w-18 h-18 min-w-0 min-h-0">
                    <Icon />
                  </div>
                </div>
                {/* Text below, centered: title TEAL, subtitle Orange */}
                <div
                  className="font-bold text-xs leading-tight mb-1"
                  style={{ fontFamily: 'Sans-serif, Helvetica, sans-serif', color: TEAL }}
                >
                  {item.title}
                </div>
                <div
                  className="text-[10px] leading-tight"
                  style={{ fontFamily: 'Museo, sans-serif', fontWeight: 300, color: ORANGE }}
                >
                  {item.subtitle}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
