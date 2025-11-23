import { motion } from 'framer-motion';
import React from 'react';

/**
 * FramerCarousel displays a carousel of punch cards.
 * @param {Array} punchCards - Array of punch card objects (with id, url, name, filename)
 * @param {Number} activeIndex - Currently selected card index
 * @param {Function} onCardSelect - Callback when a card is selected
 */
function FramerCarousel({ punchCards = [], activeIndex = 0, onCardSelect }) {
  if (!punchCards || punchCards.length === 0) {
    return <div className="text-center text-gray-500">No punch cards available</div>;
  }

  // Navigation
  const goLeft = () => {
    const newIndex = Math.max(0, activeIndex - 1);
    if (onCardSelect) onCardSelect(newIndex);
  };
  
  const goRight = () => {
    const newIndex = Math.min(punchCards.length - 1, activeIndex + 1);
    if (onCardSelect) onCardSelect(newIndex);
  };

  return (
    <div className="relative w-full flex flex-col items-center">
      {/* Carousel */}
      <div
        className="relative flex items-center justify-center w-[340px] sm:w-[600px] mx-auto overflow-visible"
        style={{ minHeight: 280 }}
      >
        {/* Left arrow */}
        <button
          onClick={goLeft}
          disabled={activeIndex === 0}
          className="absolute left-0 z-30 bg-white/80 rounded-full shadow px-2 py-1 text-2xl top-1/2 -translate-y-1/2"
          style={{ pointerEvents: activeIndex === 0 ? 'none' : 'auto', opacity: activeIndex === 0 ? 0.3 : 1 }}
        >
          &#8592;
        </button>
        
        {/* Cards */}
        <div className="flex items-center justify-center w-full overflow-visible">
          {punchCards.map((item, idx) => {
            // Determine position
            let scale = 0.9, z = 10, opacity = 0.6, shadow = 'shadow';
            if (idx === activeIndex) {
              scale = 1.1;
              z = 20;
              opacity = 1;
              shadow = 'shadow-2xl';
            } else if (Math.abs(idx - activeIndex) === 1) {
              scale = 0.95;
              z = 15;
              opacity = 0.8;
              shadow = 'shadow-lg';
            }
            return (
              <motion.div
                key={item.id || item.filename || idx}
                className={`relative mx-[-40px] transition-all duration-300 cursor-pointer ${shadow}`}
                style={{
                  zIndex: z,
                  opacity,
                  scale,
                  pointerEvents: 'auto',
                }}
                onClick={() => onCardSelect && onCardSelect(idx)}
                animate={{ scale, opacity, zIndex: z }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                <img
                  src={item.url}
                  alt={item.name || 'Punch Card'}
                  className="rounded-2xl w-[260px] h-[180px] object-cover border-4 border-white"
                />
              </motion.div>
            );
          })}
        </div>
        
        {/* Right arrow */}
        <button
          onClick={goRight}
          disabled={activeIndex === punchCards.length - 1}
          className="absolute right-0 z-30 bg-white/80 rounded-full shadow px-2 py-1 text-2xl top-1/2 -translate-y-1/2"
          style={{ pointerEvents: activeIndex === punchCards.length - 1 ? 'none' : 'auto', opacity: activeIndex === punchCards.length - 1 ? 0.3 : 1 }}
        >
          &#8594;
        </button>
      </div>
      
      {/* Card name below */}
      <div className="mt-4 text-center text-lg font-bold text-pink-600">
        {punchCards[activeIndex]?.name || 'Select a card'}
      </div>
    </div>
  );
}

export default FramerCarousel;
