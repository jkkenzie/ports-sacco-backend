import { ArrowRight } from 'lucide-react';
import svgPaths from '../imports/svg-ks2hcu51vg';
// Import news images
import championsAwardImg from '../../assets/image/Ports-Sacco-at-the-Champions-of-Governance-Awards.jpg';
import ushirikaAwardImg from '../../assets/image/Ports-Sacco-Secures-Landmark-Ushirika-Day-Awards.jpg';
import askShowImg from '../../assets/image/Ports-Sacco-bags-1st-position-at-the-ASK-Show.jpg';

const newsData = [
    {
        image: championsAwardImg,
        date: "Aug 7, 2025",
        author: "BY ADMIN",
        title: "Ports Sacco at the Champions of Governance Awards.",
    },
    {
        image: ushirikaAwardImg,
        date: "Aug 15, 2025",
        author: "BY ADMIN",
        title: "Ports Sacco Secures Landmark Ushirika Day Awards.",
    },
    {
        image: askShowImg,
        date: "Aug 22, 2025",
        author: "BY ADMIN",
        title: "Ports Sacco bags 1st position at the ASK Show.",
    }
];

export function NewsEventsSection() {
    return (
        <div id="news-events" className="relative bg-[#F5F4EE] pt-0 pb-28 overflow-visible" style={{ fontFamily: 'Sans-serif, Helvetica, sans-serif' }}>

            {/* Curved Bottom Border with Button */}
            <div className="relative w-full overflow-hidden flex-shrink-0 -top-8 pb-0 mt-0" style={{ minHeight: '37px' }}>

                {/* Bottom Center SVG */}
                <div className="flex justify-center items-end py-0 my-0">
                    <svg
                        id="uuid-cf6eeeb7-b9e9-41c3-9bc3-ae3292c2c0e0"
                        data-name="Layer 1"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 116.94 34.5"
                        className="h-auto"
                        style={{ width: '116.94px', height: 'auto' }}
                    >
                        <path d="M0,34.47c3.38-.18,8.74-.95,14.4-3.97,6.97-3.72,10.71-8.88,11.28-10.14.05-.11.47-1.02,1.11-2.24,0,0,.44-.83.87-1.56,1.71-2.89,4.38-5.67,4.38-5.67.87-.91,2.74-2.75,5.49-4.62,1.08-.73,5.42-3.59,11.6-5.13,0,0,3.63-.98,7.46-1.09l1.93-.05c.52,0,1.35,0,2.38.08.14,0,.71.04,1.36.11,2.03.2,3.74.55,4.1.62,2.2.46,3.89,1.01,4.77,1.32,3.52,1.22,6.83,2.99,9.8,5.23,0,0,4.02,3.07,6.8,6.91.44.6.8,1.15,1.12,1.66.82,1.31,1.37,2.38,1.62,2.86l.12.24c1.61,3.23,4.04,5.77,4.04,5.77.89.93,1.66,1.57,2.15,1.98.28.23,1.23,1.01,2.58,1.91.34.23,1.17.77,2.3,1.39.47.26,1.47.8,2.8,1.38.38.17,1.08.47,1.98.8.72.27,1.68.6,2.81.91,2.66.75,5.41,1.19,7.27,1.27.09,0,.42.02.42.03,0,.04-4.48.03-5.75.03-11.58-.03-23.17.02-34.75-.03-7.66-.03-17.19,0-36.23,0H0h0Z" style={{ fill: '#F5F4EE' }} />
                    </svg>
                </div>
            </div>
            {/* Scroll Down Button - Top Center */}
            <div className="flex justify-center -mt-16 mb-0 relative z-10">
                <button className="hover:opacity-80 transition-opacity relative p-4" style={{ animation: 'float 3s ease-in-out infinite' }}>
                    <svg className="block w-14 h-14" fill="none" preserveAspectRatio="none" viewBox="0 0 57.7882 57.648">
                        <g clipPath="url(#clip0_scroll_button_news)">
                            <path d={svgPaths.p1076300} fill="#00AFBB" />
                            <path d={svgPaths.p27278800} fill="white" />
                        </g>
                        <defs>
                            <clipPath id="clip0_scroll_button_news">
                                <rect fill="white" height="57.648" width="57.7882" />
                            </clipPath>
                        </defs>
                    </svg>
                </button>
            </div>

            <div className="max-w-7xl mx-auto px-4" style={{ animation: 'fadeInUp 0.8s ease-out' }}>
                {/* Section Header */}
                <div className="relative flex flex-col lg:flex-row items-center mb-8 lg:mb-12 gap-4 mt-8">
                    <p className="text-[#22ACB6] uppercase text-left flex-1 lg:flex-none lg:absolute lg:left-0 lg:max-w-[40%] pr-4" style={{ fontFamily: 'Sans-serif, Helvetica, sans-serif', fontWeight: 500, fontSize: '14px' }}>
                        CELEBRATE, EXPLORE AND SHARE OUR INCREDIBLE JOURNEYS OF PROSPERITY.
                    </p>
                    <button className="bg-[#EE6E2A] text-white px-6 rounded-full text-xs font-medium hover:bg-[#d96525] transition-colors whitespace-nowrap mx-auto lg:mx-auto" style={{ fontFamily: 'Sans-serif, Helvetica, sans-serif', minHeight: '36px' }}>
                        LATEST NEWS & EVENTS
                    </button>
                </div>

                {/* News Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {newsData.map((news, index) => (
                        <NewsCard key={index} news={news} />
                    ))}
                </div>
            </div>
        </div>
    );
}

function NewsCard({ news }) {
    return (
        <div className="bg-transparent" style={{ animation: 'slideInCard 0.6s ease-out' }}>
            {/* Image */}
            <div className="relative w-full h-48 mb-4">
                <img
                    src={news.image}
                    alt={news.title}
                    className="w-full h-full object-cover rounded-[20px]"
                />
            </div>

            {/* Content */}
            <div className="px-4 pb-4">
                {/* Date & Author */}
                <div className="flex items-center gap-2 mb-3 text-xs" style={{ fontFamily: 'Sans-serif, Helvetica, sans-serif', color: '#808080' }}>
                    <CalendarIcon />
                    <span>{news.date}</span>
                    <UserIcon />
                    <span>{news.author}</span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold mb-4" style={{ fontFamily: 'Museo, sans-serif', fontWeight: 700, color: '#808080' }}>
                    {news.title}
                </h3>

                {/* Read More Button */}
                <button className="flex items-center gap-2 text-[#ee6e2a] hover:text-[#22aab7] transition-colors text-sm font-bold group" style={{ fontFamily: 'Sans-serif, Helvetica, sans-serif' }}>
                    READ MORE
                    <div className="bg-[#ee6e2a] group-hover:bg-[#22aab7] rounded-full w-5 h-5 flex items-center justify-center transition-colors">
                        <ArrowRight className="w-4 h-4 text-white" />
                    </div>
                </button>
            </div>
        </div>
    );
}

// Calendar Icon Component
function CalendarIcon() {
    return (
        <svg className="w-3 h-3 flex-shrink-0" viewBox="0 0 12.15 12.13" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.87.92V0h.92v.9h6.55v-.91h.93v.92c.15,0,.27,0,.4,0,.87,0,1.47.61,1.47,1.47,0,2.76,0,5.52,0,8.27,0,.85-.62,1.46-1.47,1.46-3.07,0-6.15,0-9.22,0-.84,0-1.45-.62-1.45-1.46C0,7.9,0,5.13,0,2.36c0-.82.61-1.43,1.43-1.44.14,0,.27,0,.44,0ZM.94,4.67s0,.07,0,.09c0,1.97,0,3.94,0,5.91,0,.34.19.52.54.52,3.06,0,6.11,0,9.17,0,.41,0,.57-.17.57-.58,0-1.92,0-3.84,0-5.75,0-.06,0-.13,0-.19H.94ZM10.28,2.78h-.94v-.91H2.8v.91h-.93v-.92c-.14,0-.26,0-.38,0-.38,0-.56.17-.56.55,0,.24,0,.48,0,.71,0,.19,0,.39,0,.59h10.28c0-.49,0-.97,0-1.44,0-.19-.12-.35-.32-.39-.19-.03-.4,0-.61,0v.9Z" style={{ fill: '#f06e2a' }} />
        </svg>
    );
}

// User Icon Component
function UserIcon() {
    return (
        <svg className="w-3 h-3 flex-shrink-0" viewBox="0 0 12.15 12.13" xmlns="http://www.w3.org/2000/svg">
            <g>
                <g>
                    <path d="M6.7,5.65c.66,0,1.21-.54,1.21-1.21s-.54-1.21-1.21-1.21-1.21.54-1.21,1.21.54,1.21,1.21,1.21Z" style={{ fill: '#ee6e2a' }} />
                    <path d="M6.7,6.08c-1.23,0-2.26.84-2.57,1.97.3.47,1.34.81,2.57.81s2.26-.35,2.57-.81c-.3-1.13-1.34-1.97-2.57-1.97Z" style={{ fill: '#ee6e2a' }} />
                </g>
                <path d="M4.29,4.99c.51,0,.93-.42.93-.93s-.42-.93-.93-.93-.93.42-.93.93.42.93.93.93Z" style={{ fill: '#ee6e2a' }} />
                <path d="M5.55,5.75c-.35-.27-.79-.44-1.26-.44-.95,0-1.75.65-1.98,1.52.17.27.67.49,1.3.58.36-.82,1.07-1.44,1.95-1.67Z" style={{ fill: '#ee6e2a' }} />
            </g>
            <circle cx="6.07" cy="6.07" r="5.41" style={{ fill: 'none', stroke: '#ee6e2a', strokeMiterlimit: 10, strokeWidth: '0.5px' }} />
        </svg>
    );
}
