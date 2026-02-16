import { MapPin, Phone, User } from 'lucide-react';

export function TopBar() {
  return (
    <div id="top-bar" className="bg-[#1BB5B5] text-white py-2 px-4" style={{ fontFamily: 'Gotham Rounded, sans-serif', fontWeight: 700, fontSize: '10px' }}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="hidden md:flex items-center gap-4">
          <a href="#" className="hover:text-[#ee6e2a] transition-colors">NEWS & EVENTS</a>
          <span>|</span>
          <a href="#" className="hover:text-[#ee6e2a] transition-colors">CAREERS</a>
          <span>|</span>
          <a href="#" className="hover:text-[#ee6e2a] transition-colors">TENDERS</a>
        </div>
        
        <div className="hidden md:flex items-center gap-1">
          <MapPin className="w-4 h-4" />
          <span>VISIT US: MOMBASA | VOI | NAIROBI | KILUMU</span>
        </div>
        
        <div className="flex items-center gap-1">
          <Phone className="w-4 h-4" />
          <span>CALL US: +254 111 173 000</span>
        </div>
        
        <button className="flex items-center gap-1 hover:text-[#ee6e2a] transition-colors">
          <User className="w-4 h-4" />
          <span>MEMBER LOGIN</span>
        </button>
      </div>
    </div>
  );
}
