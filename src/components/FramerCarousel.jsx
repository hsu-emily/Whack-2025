import { motion } from 'framer-motion';
import React, { useState } from 'react';

const exampleImages = [
  { id: 1, url: '/images/card1.png', name: 'Wakeup Early' },
  { id: 2, url: '/images/card2.png', name: 'Daily Check In' },
  { id: 3, url: '/images/card3.png', name: 'Study Card' },
];

/**
 * FramerCarousel displays a carousel of punch cards.
 * @param {Array} punchCards - Array of punch card objects (with id, imageUrl, name, etc.)
 */
function FramerCarousel() {
  const [activeIdx, setActiveIdx] = useState(1); // Center image by default

  // Navigation
  const goLeft = () => setActiveIdx((idx) => Math.max(0, idx - 1));
  const goRight = () => setActiveIdx((idx) => Math.min(exampleImages.length - 1, idx + 1));

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
          disabled={activeIdx === 0}
          className="absolute left-0 z-30 bg-white/80 rounded-full shadow px-2 py-1 text-2xl top-1/2 -translate-y-1/2"
          style={{ pointerEvents: activeIdx === 0 ? 'none' : 'auto', opacity: activeIdx === 0 ? 0.3 : 1 }}
        >
          &#8592;
        </button>
        {/* Cards */}
        <div className="flex items-center justify-center w-full overflow-visible">
          {exampleImages.map((item, idx) => {
            // Determine position
            let scale = 0.9, z = 10, opacity = 0.6, shadow = 'shadow';
            if (idx === activeIdx) {
              scale = 1.1;
              z = 20;
              opacity = 1;
              shadow = 'shadow-2xl';
            } else if (Math.abs(idx - activeIdx) === 1) {
              scale = 0.95;
              z = 15;
              opacity = 0.8;
              shadow = 'shadow-lg';
            }
            return (
              <motion.div
                key={item.id}
                className={`relative mx-[-40px] transition-all duration-300 cursor-pointer ${shadow}`}
                style={{
                  zIndex: z,
                  opacity,
                  scale,
                  pointerEvents: idx === activeIdx ? 'auto' : 'auto',
                }}
                onClick={() => setActiveIdx(idx)}
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
          disabled={activeIdx === exampleImages.length - 1}
          className="absolute right-0 z-30 bg-white/80 rounded-full shadow px-2 py-1 text-2xl top-1/2 -translate-y-1/2"
          style={{ pointerEvents: activeIdx === exampleImages.length - 1 ? 'none' : 'auto', opacity: activeIdx === exampleImages.length - 1 ? 0.3 : 1 }}
        >
          &#8594;
        </button>
      </div>
      {/* Card name below */}
      <div className="mt-4 text-center text-lg font-bold text-pink-600">
        {exampleImages[activeIdx]?.name}
      </div>
    </div>
  );
}

export default FramerCarousel; 