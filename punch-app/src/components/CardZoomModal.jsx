import { AnimatePresence, motion } from 'framer-motion';
import { Home, LayoutDashboard, Settings, Undo2, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import holePunchCursor from '../assets/cursors/holePunch.png';
import holePunchClickCursor from '../assets/cursors/holePunchClick.png';
import { getCardLayout } from '../utils/cardLayouts';
import PunchCardPreview from './PunchCardPreview';

// Load punch card PNGs
const punchCardModules = import.meta.glob('../assets/punch_cards/*.png', { eager: true });
const punchCardMap = {};
for (const path in punchCardModules) {
  const filename = path.split('/').pop();
  punchCardMap[filename] = punchCardModules[path].default;
}

// Load icon PNGs
const iconModules = import.meta.glob('../assets/icons/*.png', { eager: true });
const iconMap = {};
for (const path in iconModules) {
  const filename = path.split('/').pop();
  iconMap[filename] = iconModules[path].default;
}

export default function CardZoomModal({ habit, onClose, onPunch, onUndo }) {
  const navigate = useNavigate();
  const cardRef = useRef(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [justPunched, setJustPunched] = useState(false);

  // Helper function to reduce font size by 25%
  const reduceFontSize = (fontSize) => {
    if (!fontSize) return undefined;
    const match = fontSize.toString().match(/^([\d.]+)(.*)$/);
    if (match) {
      const value = parseFloat(match[1]);
      const unit = match[2] || 'rem';
      return `${(value * 0.75).toFixed(2)}${unit}`;
    }
    return fontSize;
  };

  // Get punch card image and layout
  const punchCardImage = punchCardMap[habit.punchCardImage] || Object.values(punchCardMap)[0] || null;
  // Always use cardLayouts to ensure we have Medium/Large structure
  const layout = getCardLayout(habit.punchCardImage);
  
  // Reduce font sizes for better visibility (25% smaller)
  const reducedLayout = {
    ...layout,
    title: {
      ...layout.title,
      fontSizeLarge: reduceFontSize(layout.title.fontSizeLarge) || reduceFontSize(layout.title.fontSize) || '1.05rem',
      fontSize: reduceFontSize(layout.title.fontSize) || '1.05rem',
      fontSizeMedium: reduceFontSize(layout.title.fontSizeMedium) || reduceFontSize(layout.title.fontSize) || '1.05rem',
    },
    description: {
      ...layout.description,
      fontSizeLarge: reduceFontSize(layout.description.fontSizeLarge) || reduceFontSize(layout.description.fontSize) || '0.75rem',
      fontSize: reduceFontSize(layout.description.fontSize) || '0.75rem',
      fontSizeMedium: reduceFontSize(layout.description.fontSizeMedium) || reduceFontSize(layout.description.fontSize) || '0.75rem',
    },
  };

  // Get icons
  const icon1 = habit.icon1 ? (iconMap[habit.icon1] || habit.icon1) : null;
  const icon2 = habit.icon2 ? (iconMap[habit.icon2] || habit.icon2) : null;

  const punchGridLayout = {
    ...layout.punchGrid,
    filledPunches: habit.currentPunches,
    totalPunches: habit.targetPunches
  };


  useEffect(() => {
    // Hide default cursor on body
    document.body.style.cursor = 'none';
    
    const handleMouseMove = (e) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
      
      if (!cardRef.current) {
        setIsHovering(false);
        return;
      }
      
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Check if mouse is over the card
      if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const handleMouseDown = () => {
      setIsClicking(true);
    };

    const handleMouseUp = () => {
      setIsClicking(false);
    };

    const handleMouseEnter = () => {
      setIsHovering(true);
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
    };

    // Close settings dropdown when clicking outside
    const handleClickOutside = (e) => {
      if (showSettings && !e.target.closest('.card-zoom-settings-container')) {
        setShowSettings(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('click', handleClickOutside);
    
    const cardElement = cardRef.current;
    if (cardElement) {
      cardElement.addEventListener('mouseenter', handleMouseEnter);
      cardElement.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      document.body.style.cursor = '';
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('click', handleClickOutside);
      if (cardElement) {
        cardElement.removeEventListener('mouseenter', handleMouseEnter);
        cardElement.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [showSettings]);

  const handleCardClick = (e) => {
    e.stopPropagation();
    // Only punch if the card is not complete
    if (onPunch && habit.currentPunches < habit.targetPunches && !justPunched) {
      onPunch();
      setJustPunched(true);
      // Stay on page for 2 seconds after punching
      setTimeout(() => {
        setJustPunched(false);
      }, 2000);
    }
  };

  const handleUndo = () => {
    if (onUndo && habit.currentPunches > 0) {
      onUndo();
      setShowSettings(false);
    }
  };

  const handleNavigateHome = () => {
    navigate('/');
    onClose();
  };

  const handleNavigateDashboard = () => {
    navigate('/dashboard');
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        className="card-zoom-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={(e) => {
          // Don't close if we just punched (wait for delay)
          if (!justPunched) {
            onClose();
          }
        }}
      >
        <motion.div
          className="card-zoom-content"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Navigation Buttons - Top Left */}
          <div className="card-zoom-nav-buttons">
            <button
              className="card-zoom-nav-btn"
              onClick={handleNavigateHome}
              aria-label="Go to Home"
              title="Home"
            >
              <Home size={20} />
            </button>
            <button
              className="card-zoom-nav-btn"
              onClick={handleNavigateDashboard}
              aria-label="Go to Dashboard"
              title="Dashboard"
            >
              <LayoutDashboard size={20} />
            </button>
          </div>

          {/* Settings Button - Top Right */}
          <div className="card-zoom-settings-container">
            <button
              className="card-zoom-settings-btn"
              onClick={() => setShowSettings(!showSettings)}
              aria-label="Settings"
              title="Settings"
            >
              <Settings size={20} />
            </button>
            
            {/* Settings Dropdown */}
            {showSettings && (
              <motion.div
                className="card-zoom-settings-dropdown"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <button
                  className="card-zoom-settings-item"
                  onClick={handleUndo}
                  disabled={habit.currentPunches === 0}
                >
                  <Undo2 size={16} />
                  <span>Undo Last Punch</span>
                </button>
              </motion.div>
            )}
          </div>

          <button
            className="card-zoom-close"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={24} />
          </button>

          <div
            ref={cardRef}
            className="card-zoom-card"
            onClick={handleCardClick}
            style={{ cursor: 'none' }}
            role="button"
            aria-label="Click to punch hole"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleCardClick(e);
              }
            }}
          >
            {punchCardImage ? (
              <PunchCardPreview
                name={habit.title}
                description={habit.description || ''}
                icon1={icon1}
                icon2={icon2}
                cardImage={punchCardImage}
                isDailyPunch={habit.timeWindow === 'daily'}
                titlePlacement={reducedLayout.title}
                descriptionPlacement={reducedLayout.description}
                punchGridPlacement={punchGridLayout}
                currentPunches={habit.currentPunches}
                size="large"
                targetPunches={habit.targetPunches}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-2">{habit.theme?.emoji || '⭐'}</div>
                  <h3 className="text-xl font-bold text-gray-800">{habit.title}</h3>
                </div>
              </div>
            )}
          </div>

          {/* Custom Hole Punch Cursor - Only show when hovering over card */}
          {isHovering && (
            <motion.div
              className="card-zoom-cursor"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              style={{
                position: 'fixed',
                left: `${cursorPosition.x}px`,
                top: `${cursorPosition.y}px`,
                width: '200px',
                height: '200px',
                pointerEvents: 'none',
                zIndex: 10000,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <img
                src={isClicking ? holePunchClickCursor : holePunchCursor}
                alt="hole punch cursor"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  userSelect: 'none',
                  draggable: false,
                }}
              />
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

