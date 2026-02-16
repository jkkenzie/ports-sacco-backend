import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useRef } from 'react';
import bannerImage from '../../assets/image/portsbanner.jpg';

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef(0);

  // Using local banner image
  const heroImage = bannerImage;

  const slides = [
    { id: 1, image: heroImage, alt: 'Welcome - Diverse group of happy people' },
    { id: 2, image: heroImage, alt: 'Slide 2' },
    { id: 3, image: heroImage, alt: 'Slide 3' },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      // Swiped left
      nextSlide();
    }

    if (touchStart - touchEnd < -75) {
      // Swiped right
      prevSlide();
    }
  };

  // Mouse handlers for desktop drag
  const handleMouseDown = (e) => {
    setIsDragging(true);
    dragStartRef.current = e.clientX;
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
  };

  const handleMouseUp = (e) => {
    if (!isDragging) return;
    setIsDragging(false);
    
    const dragEnd = e.clientX;
    const diff = dragStartRef.current - dragEnd;

    if (diff > 75) {
      // Dragged left
      nextSlide();
    }

    if (diff < -75) {
      // Dragged right
      prevSlide();
    }
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  return (
    <div id="hero" className="relative bg-[#1BB5B5] overflow-hidden" style={{ animation: 'fadeInUp 0.8s ease-out' }}>
      <div 
        className="relative w-full cursor-grab active:cursor-grabbing select-none overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        <div 
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className="min-w-full flex-shrink-0"
            >
              <img
                src={slide.image}
                alt={slide.alt}
                className="w-full h-auto object-cover object-center pointer-events-none"
              />
            </div>
          ))}
        </div>

        {/* Previous Arrow - Hidden on mobile */}
        <button
          onClick={prevSlide}
          className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/80 hover:bg-white rounded-full items-center justify-center text-[#1BB5B5] transition-all shadow-lg"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Next Arrow - Hidden on mobile */}
        <button
          onClick={nextSlide}
          className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/80 hover:bg-white rounded-full items-center justify-center text-[#1BB5B5] transition-all shadow-lg"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
      
      {/* Dot Indicators - Below the hero banner */}
      <div className="relative flex justify-center gap-2 py-4 bg-[#22acb6]">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide ? 'bg-white' : 'bg-white/40'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
