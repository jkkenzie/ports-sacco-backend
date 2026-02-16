import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Search, Menu, X } from 'lucide-react';
import { useState } from 'react';

const ORANGE = '#ee6e2a';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isActive = (href) => href && location.pathname === href;

  return (
    <>
      <header id="header" className="bg-white shadow-sm relative z-50" style={{ animation: 'fadeInUp 0.8s ease-out' }}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between" style={{ fontFamily: 'Sans-serif, Helvetica, sans-serif' }}>
          <div className="flex items-center">
            <svg width="112" height="60" viewBox="0 0 111.16 59.19" xmlns="http://www.w3.org/2000/svg">
              <g>
                <path d="M58.38,3.63h-8.43v2.88h1.69v15.54h3.4v-6.36h3.35c3.45,0,5.86-2.49,5.86-6.07s-2.41-5.99-5.86-5.99ZM57.76,12.79h-2.72v-6.28h2.78c1.87,0,2.96,1.22,2.96,3.11s-1.09,3.16-3.01,3.16Z" style={{ fill: '#22acb6' }}/>
                <path d="M71.66,8.51c-4.02,0-7.24,2.88-7.24,6.93s3.22,6.93,7.24,6.93,7.26-2.85,7.26-6.93-3.22-6.93-7.26-6.93ZM71.66,19.56c-2.13,0-3.92-1.66-3.92-4.12s1.79-4.12,3.92-4.12,3.94,1.69,3.94,4.12-1.79,4.12-3.94,4.12Z" style={{ fill: '#22acb6' }}/>
                <path d="M84.42,12.04h-.05s.05-.34.05-.83v-.78c0-1.12-.6-1.61-1.76-1.61h-3.01v2.8h1.04c.36,0,.57.18.57.57v9.86h3.27v-5.24c0-.78.1-1.5.29-2.15.6-1.97,2.2-2.78,3.61-2.78.47,0,.8.05.8.05v-3.24s-.31-.05-.6-.05c-2.02,0-3.61,1.5-4.2,3.4Z" style={{ fill: '#22acb6' }}/>
                <path d="M94.64,16.78v-5.34h3.01v-2.62h-3.01v-3.61h-3.22v3.61h-1.79v2.62h1.71v5.76c0,4.44,3.66,4.98,5.5,4.98.6,0,1.01-.08,1.01-.08v-2.88s-.23.05-.6.05c-.91,0-2.62-.31-2.62-2.49Z" style={{ fill: '#22acb6' }}/>
                <path d="M102.29,12.24c0-.78.8-1.19,1.97-1.19.73,0,1.66.31,1.66.93v.65h2.91v-1.38c0-2.15-2.85-2.75-4.64-2.75-2.75,0-5.14,1.22-5.14,3.86,0,4.28,6.98,4.25,6.98,6.12,0,.88-.78,1.3-1.79,1.3-2.26,0-3.94-1.95-3.94-1.95l-1.56,2.15s1.87,2.36,5.5,2.36c2.88,0,5.08-1.56,5.08-4.05,0-4.41-7.03-3.99-7.03-6.07Z" style={{ fill: '#22acb6' }}/>
              </g>
              <g>
                <path d="M53.04,29.64c0-1.02,1-1.73,2.36-1.73,1.07,0,2.14.5,2.14,1.25v.73h2.68v-1.5c0-2.29-2.91-3.18-4.79-3.18-3.11,0-5.38,1.93-5.38,4.54,0,5.02,7.59,4.79,7.59,7.54,0,1.25-1.09,1.91-2.32,1.91-2.25,0-3.91-1.91-3.91-1.91l-1.68,2.09s1.98,2.5,5.54,2.5,5.36-2.18,5.36-4.75c0-5.29-7.59-4.75-7.59-7.5Z" style={{ fill: '#ee6e2a' }}/>
                <path d="M71.78,38.68v-4.32c0-2.59-1.14-4.61-5-4.61-1.21,0-4.25.23-4.25,2.39v1.23h2.68v-.61c0-.64,1.02-.77,1.54-.77,1.48,0,2.14.61,2.14,2.27v.09h-.36c-1.89,0-6.88.3-6.88,3.93,0,2.32,1.89,3.61,3.95,3.61,2.61,0,3.5-2.04,3.5-2.04h.04s-.02.2-.02.5c0,.68.41,1.27,1.48,1.27h2.59v-2.43h-.91c-.32,0-.5-.18-.5-.5ZM68.94,36.59c0,1.41-1.09,3.04-2.64,3.04-1.18,0-1.75-.73-1.75-1.5,0-1.61,2.38-1.82,3.88-1.82h.5v.27Z" style={{ fill: '#ee6e2a' }}/>
                <path d="M80.31,39.37c-1.86,0-3.61-1.2-3.61-3.57,0-2.09,1.43-3.61,3.43-3.61.7,0,1.66.27,1.66.91v.64h2.54v-1.36c0-2-2.7-2.61-4.2-2.61-3.98,0-6.34,2.79-6.34,6.07s2.45,6.07,6.27,6.07c3.16,0,4.88-2.09,4.88-2.09l-1.2-2s-1.45,1.57-3.43,1.57Z" style={{ fill: '#ee6e2a' }}/>
                <path d="M91.96,39.37c-1.86,0-3.61-1.2-3.61-3.57,0-2.09,1.43-3.61,3.43-3.61.71,0,1.66.27,1.66.91v.64h2.54v-1.36c0-2-2.7-2.61-4.2-2.61-3.98,0-6.34,2.79-6.34,6.07s2.45,6.07,6.27,6.07c3.16,0,4.88-2.09,4.88-2.09l-1.2-2s-1.45,1.57-3.43,1.57Z" style={{ fill: '#ee6e2a' }}/>
                <path d="M103.44,29.76c-3.52,0-6.34,2.52-6.34,6.07s2.82,6.07,6.34,6.07,6.36-2.5,6.36-6.07-2.82-6.07-6.36-6.07ZM103.44,39.43c-1.86,0-3.43-1.45-3.43-3.61s1.57-3.61,3.43-3.61,3.45,1.48,3.45,3.61-1.57,3.61-3.45,3.61Z" style={{ fill: '#ee6e2a' }}/>
              </g>
              <path d="M5.17,20.63l-2.9-5.03C-.41,10.96,1.19,4.99,5.83,2.31c4.64-2.68,10.61-1.08,13.29,3.56l3.53,6.11c.66,1.14,2.13,1.53,3.27.88l7.26-4.19c1-.58,2.29-.23,2.87.77.58,1,.23,2.29-.77,2.87l-7.26,4.19c-3.13,1.81-7.2.72-9.01-2.41l-3.53-6.11c-1.52-2.64-4.92-3.54-7.55-2.02-2.64,1.52-3.54,4.92-2.02,7.55l2.9,5.03c.25.43.1.98-.33,1.23l-2.08,1.2c-.43.25-.98.1-1.23-.33h0Z" style={{ fill: '#22acb6', fillRule: 'evenodd' }}/>
              <path d="M40,24.13l2.9,5.03c2.68,4.64,1.08,10.61-3.56,13.29-4.64,2.68-10.61,1.08-13.29-3.56l-3.53-6.11c-.66-1.14-2.13-1.53-3.27-.88l-7.26,4.19c-1,.58-2.29.23-2.87-.77-.58-1-.23-2.29.77-2.87l7.26-4.19c3.13-1.81,7.2-.72,9.01,2.41l3.53,6.11c1.52,2.63,4.92,3.54,7.55,2.02,2.63-1.52,3.54-4.92,2.02-7.55l-2.9-5.03c-.25-.43-.1-.98.33-1.23l2.08-1.2c.43-.25.98-.1,1.23.33h0Z" style={{ fill: '#22acb6', fillRule: 'evenodd' }}/>
              <path d="M20.84,39.8l-5.03,2.9c-4.64,2.68-10.61,1.08-13.29-3.56-2.68-4.64-1.08-10.61,3.56-13.29l6.11-3.53c1.14-.66,1.53-2.13.88-3.27l-4.19-7.26c-.58-1-.23-2.29.77-2.87,1-.58,2.29-.23,2.87.77l4.19,7.26c1.81,3.13.72,7.2-2.41,9.01l-6.11,3.53c-2.64,1.52-3.54,4.92-2.02,7.55,1.52,2.64,4.92,3.54,7.55,2.02l5.03-2.9c.43-.25.98-.1,1.23.33l1.2,2.08c.25.43.1.98-.33,1.23h0Z" style={{ fill: '#ee6e2a', fillRule: 'evenodd' }}/>
              <path d="M24.46,4.9l5.03-2.9c4.64-2.68,10.61-1.08,13.29,3.56,2.68,4.64,1.08,10.61-3.56,13.29l-6.11,3.53c-1.14.66-1.53,2.13-.88,3.27l4.19,7.26c.58,1,.23,2.29-.77,2.87-1,.58-2.29.23-2.87-.77l-4.19-7.26c-1.81-3.13-.72-7.2,2.41-9.01l6.11-3.53c2.63-1.52,3.54-4.92,2.02-7.55-1.52-2.64-4.92-3.54-7.55-2.02l-5.03,2.9c-.43.25-.98.1-1.23-.33l-1.2-2.08c-.25-.43-.1-.98.33-1.23h0Z" style={{ fill: '#ee6e2a', fillRule: 'evenodd' }}/>
              <g>
                <path d="M5.94,52.09c-.16,0-.3.13-.3.3v2.79c0,1.15-.61,1.73-1.58,1.73s-1.6-.64-1.6-1.77v-2.75c0-.16-.13-.3-.3-.3s-.29.13-.29.3v2.79c0,1.48.88,2.28,2.18,2.28s2.19-.79,2.19-2.32v-2.74c0-.16-.14-.3-.29-.3Z"/>
                <path d="M11.73,52.13h-1.67c-.16,0-.29.13-.29.3v4.68c0,.17.13.3.29.3.17,0,.3-.13.3-.3v-1.59h1.27c1.12,0,2.06-.58,2.06-1.72h0c0-1.05-.78-1.68-1.96-1.68ZM13.1,53.83c0,.69-.57,1.15-1.44,1.15h-1.3v-2.31h1.33c.85,0,1.41.39,1.41,1.14v.02Z"/>
                <path d="M20.22,56.82h-2.72v-4.44c0-.16-.13-.3-.3-.3s-.29.13-.29.3v4.68c0,.16.13.3.29.3h3.02c.15,0,.27-.12.27-.27s-.12-.28-.27-.28Z"/>
                <path d="M24.03,52.09c-.16,0-.29.13-.29.3v4.72c0,.17.14.3.29.3s.3-.13.3-.3v-4.72c0-.16-.14-.3-.3-.3Z"/>
                <path d="M31.54,52.13h-3.24c-.16,0-.29.13-.29.3v4.68c0,.17.13.3.29.3.17,0,.3-.13.3-.3v-2.02h2.61c.15,0,.27-.12.27-.27s-.12-.27-.27-.27h-2.61v-1.87h2.94c.15,0,.27-.13.27-.28s-.12-.27-.27-.27Z"/>
                <path d="M38.57,52.13h-3.64c-.15,0-.28.13-.28.28s.13.27.28.27h1.52v4.44c0,.17.13.3.3.3s.3-.13.3-.3v-4.44h1.52c.15,0,.28-.12.28-.27s-.13-.28-.28-.28Z"/>
                <path d="M42.4,52.09c-.16,0-.29.13-.29.3v4.72c0,.17.14.3.29.3s.3-.13.3-.3v-4.72c0-.16-.14-.3-.3-.3Z"/>
                <path d="M50.52,52.09c-.16,0-.29.13-.29.29v3.96l-3.18-4.06c-.08-.11-.17-.17-.3-.17h-.08c-.16,0-.29.14-.29.29v4.72c0,.16.13.29.28.29.17,0,.29-.13.29-.29v-4.06l3.25,4.16c.09.1.18.18.31.18h.03c.16,0,.27-.12.27-.28v-4.74c0-.16-.13-.29-.29-.29Z"/>
                <path d="M58.67,54.57h-1.69c-.14,0-.26.12-.26.27,0,.14.12.26.26.26h1.41v1.3c-.36.29-.91.52-1.51.52-1.27,0-2.08-.93-2.08-2.18v-.02c0-1.17.83-2.15,1.99-2.15.66,0,1.08.2,1.45.48.06.04.12.08.19.08.16,0,.29-.13.29-.3,0-.1-.05-.19-.12-.24-.48-.35-1-.56-1.79-.56-1.57,0-2.63,1.27-2.63,2.71h0c0,1.51,1.02,2.71,2.67,2.71.78,0,1.42-.28,1.9-.64.13-.09.2-.22.2-.36v-1.6c0-.16-.13-.3-.29-.3Z"/>
                <path d="M68.79,52.13h-1.67c-.16,0-.29.13-.29.3v4.68c0,.17.13.3.29.3.17,0,.3-.13.3-.3v-1.59h1.27c1.12,0,2.06-.58,2.06-1.72h0c0-1.05-.78-1.68-1.96-1.68ZM70.15,53.83c0,.69-.57,1.15-1.44,1.15h-1.3v-2.31h1.33c.85,0,1.41.39,1.41,1.14v.02Z"/>
                <path d="M77.55,56.83h-3v-1.84h2.62c.15,0,.27-.12.27-.27,0-.14-.12-.27-.27-.27h-2.62v-1.79h2.96c.15,0,.27-.12.27-.27s-.12-.27-.27-.27h-3.26c-.16,0-.29.13-.29.3v4.65c0,.16.13.3.29.3h3.3c.15,0,.27-.12.27-.27s-.12-.27-.27-.27Z"/>
                <path d="M83.57,52.04c-1.6,0-2.68,1.27-2.68,2.71h0c0,1.46,1.07,2.71,2.67,2.71s2.68-1.27,2.68-2.71v-.02c0-1.45-1.07-2.7-2.67-2.7ZM85.63,54.76c0,1.19-.85,2.15-2.05,2.15s-2.07-.97-2.07-2.16v-.02c0-1.19.85-2.15,2.05-2.15s2.07.97,2.07,2.17h0Z"/>
                <path d="M91.59,52.13h-1.67c-.16,0-.29.13-.29.3v4.68c0,.17.13.3.29.3.17,0,.3-.13.3-.3v-1.59h1.27c1.12,0,2.06-.58,2.06-1.72h0c0-1.05-.78-1.68-1.96-1.68ZM92.95,53.83c0,.69-.57,1.15-1.44,1.15h-1.3v-2.31h1.33c.85,0,1.41.39,1.41,1.14v.02Z"/>
                <path d="M100.08,56.82h-2.72v-4.44c0-.16-.13-.3-.3-.3s-.29.13-.29.3v4.68c0,.16.13.3.29.3h3.02c.15,0,.27-.12.27-.27s-.12-.28-.27-.28Z"/>
                <path d="M107.13,56.83h-3v-1.84h2.62c.15,0,.27-.12.27-.27,0-.14-.12-.27-.27-.27h-2.62v-1.79h2.96c.15,0,.27-.12.27-.27s-.12-.27-.27-.27h-3.26c-.16,0-.29.13-.29.3v4.65c0,.16.13.3.29.3h3.3c.15,0,.27-.12.27-.27s-.12-.27-.27-.27Z"/>
              </g>
            </svg>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <NavItem label="HOME" href="/" active={isActive('/')} />
            <NavItem label="ABOUT US" href="/about-us" hasDropdown active={isActive('/about-us')} />
            <NavItem label="PRODUCTS" hasDropdown />
            <NavItem label="SERVICES" hasDropdown />
            <NavItem label="MEMBERSHIP" hasDropdown />
            <NavItem label="PORTALS" hasDropdown />
            <NavItem label="CONTACT US" hasDropdown />
            <button className="text-[#22acb6] hover:text-[#FF8C42]">
              <Search className="w-5 h-5" />
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden text-[#22acb6] hover:text-[#FF8C42]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Slide-in */}
      <div 
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6">
          {/* Close Button */}
          <div className="flex justify-end mb-6">
            <button 
              className="text-[#22acb6] hover:text-[#FF8C42]"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Mobile Navigation */}
          <nav className="flex flex-col gap-6">
            <MobileNavItem label="HOME" href="/" active={isActive('/')} onClick={() => setIsMobileMenuOpen(false)} />
            <MobileNavItem label="ABOUT US" href="/about-us" hasDropdown active={isActive('/about-us')} onClick={() => setIsMobileMenuOpen(false)} />
            <MobileNavItem label="PRODUCTS" hasDropdown onClick={() => setIsMobileMenuOpen(false)} />
            <MobileNavItem label="SERVICES" hasDropdown onClick={() => setIsMobileMenuOpen(false)} />
            <MobileNavItem label="MEMBERSHIP" hasDropdown onClick={() => setIsMobileMenuOpen(false)} />
            <MobileNavItem label="PORTALS" hasDropdown onClick={() => setIsMobileMenuOpen(false)} />
            <MobileNavItem label="CONTACT US" hasDropdown onClick={() => setIsMobileMenuOpen(false)} />
            
            {/* Search Button */}
            <button className="flex items-center gap-2 text-sm font-bold text-[#22acb6] hover:text-[#FF8C42] transition-colors">
              <Search className="w-5 h-5" />
              <span>SEARCH</span>
            </button>
          </nav>
        </div>
      </div>
    </>
  );
}

function NavItem({ label, hasDropdown = false, href, active = false }) {
  const className = `flex items-center gap-1 transition-colors ${active ? '' : 'text-[#65605f]'} hover:text-[#ee6e2a]`;
  const style = {
    fontFamily: 'Gotham Rounded, sans-serif',
    fontWeight: 500,
    fontSize: '12px',
    ...(active && { color: ORANGE }),
  };
  if (href) {
    return (
      <Link to={href} className={className} style={style}>
        {label}
        {hasDropdown && <ChevronDown className="w-4 h-4" />}
      </Link>
    );
  }
  return (
    <button className={className} style={style}>
      {label}
      {hasDropdown && <ChevronDown className="w-4 h-4" />}
    </button>
  );
}

function MobileNavItem({ label, hasDropdown = false, onClick, href, active = false }) {
  const className = `flex items-center justify-between text-left transition-colors w-full ${active ? '' : 'text-[#65605f]'} hover:text-[#ee6e2a]`;
  const style = {
    fontFamily: 'Gotham Rounded, sans-serif',
    fontWeight: 500,
    fontSize: '12px',
    ...(active && { color: ORANGE }),
  };
  if (href) {
    return (
      <Link to={href} className={className} style={style} onClick={onClick}>
        <span>{label}</span>
        {hasDropdown && <ChevronDown className="w-4 h-4" />}
      </Link>
    );
  }
  return (
    <button 
      className={className}
      style={style}
      onClick={onClick}
    >
      <span>{label}</span>
      {hasDropdown && <ChevronDown className="w-4 h-4" />}
    </button>
  );
}