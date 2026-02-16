import { FaFacebookF, FaInstagram } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import svgPaths from '../imports/svg-ks2hcu51vg';
import portsSaccoLogo from '../../assets/image/ports-sacco-logo.png';
import googlePlayWhiteSvg from '../../assets/image/google-play-white.svg';
import iosIconWhiteSvg from '../../assets/image/ios-icon-white.svg';
import callIcon from '../../assets/image/call-01.svg';
import atIcon from '../../assets/image/at.svg';
import addressIcon from '../../assets/image/address.svg';
import boxAddressIcon from '../../assets/image/box-address.svg';

const TEAL = '#22ACB6';
const ORANGE = '#EE6E2A';
const FOOTER_BG = '#1f0026'; // Dark purple/indigo from SVG

const branches = [
  {
    name: 'Nairobi CBD Office',
    address: "KCS House, 7th Floor, Mama Ngina Street",
    phone: 'Tel: 0111 173 138',
  },
  {
    name: 'Nairobi Branch',
    address: "KPA-ICD Road, Off Mombasa Road",
    phone: 'Tel: 0111 173 138',
  },
  {
    name: 'Kisumu Office',
    address: "Tuff Foam Mall Ground Floor, Achieng' Oneko Road Opp. Reinsurance Plaza",
    phone: 'Tel: 0111 173 142',
  },
  {
    name: 'Voi Office',
    address: "KPLC Street, Opposite Post Bank",
    phone: 'Tel: 0111 173 143',
  },
];

export function Footer() {
  return (
    <footer id="footer" className="relative pt-0 pb-15 overflow-visible" style={{ fontFamily: 'Sans-serif, Helvetica, sans-serif', backgroundColor: FOOTER_BG }}>
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
            <path d="M0,34.47c3.38-.18,8.74-.95,14.4-3.97,6.97-3.72,10.71-8.88,11.28-10.14.05-.11.47-1.02,1.11-2.24,0,0,.44-.83.87-1.56,1.71-2.89,4.38-5.67,4.38-5.67.87-.91,2.74-2.75,5.49-4.62,1.08-.73,5.42-3.59,11.6-5.13,0,0,3.63-.98,7.46-1.09l1.93-.05c.52,0,1.35,0,2.38.08.14,0,.71.04,1.36.11,2.03.2,3.74.55,4.1.62,2.2.46,3.89,1.01,4.77,1.32,3.52,1.22,6.83,2.99,9.8,5.23,0,0,4.02,3.07,6.8,6.91.44.6.8,1.15,1.12,1.66.82,1.31,1.37,2.38,1.62,2.86l.12.24c1.61,3.23,4.04,5.77,4.04,5.77.89.93,1.66,1.57,2.15,1.98.28.23,1.23,1.01,2.58,1.91.34.23,1.17.77,2.3,1.39.47.26,1.47.8,2.8,1.38.38.17,1.08.47,1.98.8.72.27,1.68.6,2.81.91,2.66.75,5.41,1.19,7.27,1.27.09,0,.42.02.42.03,0,.04-4.48.03-5.75.03-11.58-.03-23.17.02-34.75-.03-7.66-.03-17.19,0-36.23,0H0h0Z" 
            style={{ fill: '#000000' }} />
          </svg>
        </div>
      </div>
      {/* Scroll Down Button - Top Center */}
      <div className="flex justify-center -mt-16 mb-0 relative z-10">
        <button className="hover:opacity-80 transition-opacity relative p-4" style={{ animation: 'float 3s ease-in-out infinite' }}>
          <svg className="block w-14 h-14" fill="none" preserveAspectRatio="none" viewBox="0 0 57.7882 57.648">
            <g clipPath="url(#clip0_scroll_button_news)">
              <path d={svgPaths.p1076300} fill="#FFFFFF" />
              <path d={svgPaths.p27278800} fill="transparent" />
            </g>
            <defs>
              <clipPath id="clip0_scroll_button_news">
                <rect fill="white" height="57.648" width="57.7882" />
              </clipPath>
            </defs>
          </svg>
        </button>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12" style={{ animation: 'fadeInUp 0.8s ease-out' }}>
        <div className="grid grid-cols-1 md:grid-cols-[25%_50%_25%] gap-4 lg:gap-4 relative">
          {/* Column 1: Logo, Branch Network, Mombasa Head Office */}
          <div className="flex flex-col relative pr-4 md:pr-8 md:border-r" style={{ borderRightColor: TEAL, borderRightWidth: '2px' }}>
            <div className="inline-flex flex-col items-start" style={{ maxWidth: 'fit-content' }}>
              <img src={portsSaccoLogo} alt="Ports Sacco" className="h-16 w-auto mb-0 object-contain" />
              <p className="text-xs uppercase tracking-widest mb-6 -mt-3" style={{ fontFamily: 'GothamRounded-Book, sans-serif', color: '#82cdcb', fontSize: '7.49px', letterSpacing: '0.29em', width: '100%', boxSizing: 'border-box' }}>
                UPLIFTING PEOPLE
              </p>
            </div>
            <h3 className="font-bold mb-4 uppercase" style={{ color: TEAL, fontFamily: 'Museo700-Regular, Museo', fontSize: '19.82px' }}>
              Branch Network
            </h3>
            <div className="mb-4">
              <div className="flex items-start gap-2 mb-1">
                <img src={addressIcon} alt="Address" className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-bold text-sm mb-1" style={{ fontFamily: 'GothamRounded-Bold, sans-serif', fontSize: '13px' }}>Mombasa - Head Office</p>
                  <p className="text-white text-sm leading-relaxed" style={{ fontFamily: 'GothamRounded-Book, sans-serif', fontSize: '13px' }}>Ports Sacco Plaza, Mwakilingo Road, off Moi Avenue, Mombasa</p>
                </div>
              </div>
              <div className="flex items-start gap-2 mb-1">
                <img src={callIcon} alt="Phone" className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p className="text-white text-sm" style={{ fontFamily: 'GothamRounded-Book, sans-serif', fontSize: '13px' }}>Tel: 0111 173 000</p>
              </div>
              <div className="flex items-start gap-2 mb-1">
                <img src={boxAddressIcon} alt="P.O Box" className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p className="text-white text-sm" style={{ fontFamily: 'GothamRounded-Book, sans-serif', fontSize: '13px' }}>P.O Box 95372 - 80100, Mombasa</p>
              </div>
              <div className="flex items-start gap-2">
                <img src={atIcon} alt="Email" className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p className="text-white text-sm" style={{ fontFamily: 'GothamRounded-Book, sans-serif', fontSize: '13px' }}>info@portsacco.co.ke</p>
              </div>
            </div>
          </div>

          {/* Column 2: Download Mobile App, Branch Listings */}
          <div className="flex flex-col relative px-4 md:px-8 md:border-r" style={{ borderRightColor: TEAL, borderRightWidth: '2px' }}>
            <style>{`
              @media (max-width: 480px) {
                .download-app-title {
                  text-align: left !important;
                }
                .download-app-buttons {
                  flex-direction: column !important;
                  align-items: flex-start !important;
                  justify-content: flex-start !important;
                }
                .branch-listings-grid {
                  grid-template-columns: 1fr !important;
                }
                .branch-listings-divider {
                  display: none !important;
                }
                .branch-left-column {
                  padding-right: 0 !important;
                }
                .branch-right-column {
                  padding-left: 0 !important;
                }
                .kisumu-office-divider {
                  display: block !important;
                  border-top: 2px solid ${TEAL} !important;
                  margin-top: 1rem !important;
                  margin-bottom: 1rem !important;
                }
              }
              .kisumu-office-divider {
                display: none;
              }
              @media (min-width: 481px) {
                .download-app-title {
                  text-align: center !important;
                }
                .download-app-buttons {
                  flex-direction: row !important;
                  align-items: center !important;
                  justify-content: center !important;
                }
              }
            `}</style>
            <h3 className="download-app-title text-white font-bold mb-4 uppercase" style={{ fontFamily: 'GothamRounded-Bold, sans-serif', fontSize: '13px' }}>
              Download Mobile App
            </h3>
            <div className="download-app-buttons flex flex-col gap-3 mb-4">
              <a href="#" className="inline-block">
                <img src={googlePlayWhiteSvg} alt="Get it on Google Play" className="h-12 w-auto" />
              </a>
              <a href="#" className="inline-block">
                <img src={iosIconWhiteSvg} alt="Download on the App Store" className="h-12 w-auto" />
              </a>
            </div>
            {/* Horizontal line below buttons */}
            <div className="border-b mb-4" style={{ borderBottomColor: TEAL, borderBottomWidth: '2px' }} />
            
            {/* Two-column branch layout */}
            <div className="branch-listings-grid grid grid-cols-2 gap-4 relative">
              {/* Vertical divider between columns */}
              <div className="branch-listings-divider absolute left-1/2 top-0 bottom-0 w-px" style={{ backgroundColor: TEAL, transform: 'translateX(-50%)' }} />
              
              {/* Left column: Nairobi CBD Office and Nairobi Branch */}
              <div className="branch-left-column flex flex-col pr-4">
                <div className="pb-4 mb-4">
                  <p className="text-white font-bold text-sm mb-1" style={{ fontFamily: 'GothamRounded-Bold, sans-serif', fontSize: '13px' }}>{branches[0].name}</p>
                  <p className="text-white text-sm mb-1" style={{ fontFamily: 'GothamRounded-Book, sans-serif', fontSize: '13px' }}>{branches[0].address}</p>
                  <p className="text-white text-sm" style={{ fontFamily: 'GothamRounded-Book, sans-serif', fontSize: '13px' }}>{branches[0].phone}</p>
                </div>
                <div className="pb-4">
                  <p className="text-white font-bold text-sm mb-1" style={{ fontFamily: 'GothamRounded-Bold, sans-serif', fontSize: '13px' }}>{branches[1].name}</p>
                  <p className="text-white text-sm mb-1" style={{ fontFamily: 'GothamRounded-Book, sans-serif', fontSize: '13px' }}>{branches[1].address}</p>
                  <p className="text-white text-sm" style={{ fontFamily: 'GothamRounded-Book, sans-serif', fontSize: '13px' }}>{branches[1].phone}</p>
                </div>
              </div>
              
              {/* Right column: Kisumu Office and Voi Office */}
              <div className="branch-right-column flex flex-col pl-4">
                {/* Divider above Kisumu Office - only visible at < 480px */}
                <div className="kisumu-office-divider"></div>
                <div className="pb-4 border-b mb-4" style={{ borderBottomColor: TEAL, borderBottomWidth: '2px' }}>
                  <p className="text-white font-bold text-sm mb-1" style={{ fontFamily: 'GothamRounded-Bold, sans-serif', fontSize: '13px' }}>{branches[2].name}</p>
                  <p className="text-white text-sm mb-1" style={{ fontFamily: 'GothamRounded-Book, sans-serif', fontSize: '13px' }}>{branches[2].address}</p>
                  <p className="text-white text-sm" style={{ fontFamily: 'GothamRounded-Book, sans-serif', fontSize: '13px' }}>{branches[2].phone}</p>
                </div>
                <div className="pb-4">
                  <p className="text-white font-bold text-sm mb-1" style={{ fontFamily: 'GothamRounded-Bold, sans-serif', fontSize: '13px' }}>{branches[3].name}</p>
                  <p className="text-white text-sm mb-1" style={{ fontFamily: 'GothamRounded-Book, sans-serif', fontSize: '13px' }}>{branches[3].address}</p>
                  <p className="text-white text-sm" style={{ fontFamily: 'GothamRounded-Book, sans-serif', fontSize: '13px' }}>{branches[3].phone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Column 3: Follow Us, Social Media, Banking Hours */}
          <div className="flex flex-col relative pl-4 md:pl-8">
            <h3 className="text-white font-bold mb-4 uppercase" style={{ fontFamily: 'GothamRounded-Bold, sans-serif', fontSize: '13px' }}>
              Follow Us
            </h3>
            <div className="flex gap-4 mb-6">
              <a href="#" className="hover:opacity-80 transition-opacity">
                <FaFacebookF className="w-6 h-6 text-white" />
              </a>
              <a href="#" className="hover:opacity-80 transition-opacity">
                <FaXTwitter className="w-6 h-6 text-white" />
              </a>
              <a href="#" className="hover:opacity-80 transition-opacity">
                <FaInstagram className="w-6 h-6 text-white" />
              </a>
            </div>
            <div className="border-b mb-6" style={{ borderBottomColor: TEAL, borderBottomWidth: '2px' }} />
            <h3 className="text-white font-bold mb-4 uppercase" style={{ fontFamily: 'Museo700-Regular, Museo', fontSize: '19.82px' }}>
              Banking Hours
            </h3>
            <div className="space-y-2">
                <div className="font-bold text-sm" style={{ color: TEAL, fontFamily: 'Museo700-Regular, Museo', fontSize: '19.82px' }}>Monday - Friday:</div>
                <div className="text-white text-sm pb-2" style={{ fontFamily: 'Museo700-Regular, Museo', fontSize: '19.82px' }}>08:30 AM - 04:00 PM</div>
                <div className="font-bold text-sm" style={{ color: TEAL, fontFamily: 'Museo700-Regular, Museo', fontSize: '19.82px' }}>Saturday:</div>
                <div className="text-white text-sm pb-2" style={{ fontFamily: 'Museo700-Regular, Museo', fontSize: '19.82px' }}>09:00 AM - 12:00 PM</div>
              <div>
                <span className="font-bold text-sm" style={{ color: TEAL, fontFamily: 'Museo700-Regular, Museo', fontSize: '19.82px' }}>Sunday:</span>
                <span className="text-white text-sm ml-2" style={{ fontFamily: 'Museo700-Regular, Museo', fontSize: '19.82px' }}>Closed</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="max-w-7xl mx-auto py-4">
        <div className="w-full px-4 sm:px-6">
          <style>{`
            .copyright-text {
              font-family: 'GothamRounded-Bold', sans-serif;
              font-size: 9px;
              letter-spacing: 0.15em;
            }
            .copyright-teal {
              color: ${TEAL};
            }
            .copyright-white {
              color: #fff;
            }
            .copyright-ls-19 { letter-spacing: 0.19em; }
            .copyright-ls-23 { letter-spacing: 0.23em; }
            .copyright-ls-24 { letter-spacing: 0.24em; }
            .copyright-ls-25 { letter-spacing: 0.25em; }
            .copyright-ls-26 { letter-spacing: 0.26em; }
          `}</style>
          <p className="copyright-text text-xs w-full text-center">
            {/* Copyright and Company Name */}
            <span className="copyright-teal copyright-ls-26">© 2026 PORTS SACCO</span>
            
            {/* Separator */}
            <span className="copyright-white copyright-ls-26"> | </span>
            
            {/* Rights Reserved */}
            <span className="copyright-white copyright-ls-26"> - ALL RIGHTS RESERVED</span>
            
            {/* Separator */}
            <span className="copyright-white copyright-ls-26"> | </span>
            
            {/* Privacy Policy */}
            <span className="copyright-teal copyright-ls-26">PRIVACY POLICY</span>
            
            {/* Separator */}
            <span className="copyright-white copyright-ls-26"> | </span>
            
            {/* Terms and Conditions */}
            <span className="copyright-white copyright-ls-26">TERMS AND CONDITIONS</span>
            
            {/* Separator */}
            <span className="copyright-white copyright-ls-26"> | </span>
            
            {/* Design Credit */}
            <span className="copyright-teal copyright-ls-26">A SMITH CREATIVE DESIGN</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
