// Card Layout Configurations
// Each card has separate Medium and Large size values

// Base layout configuration with medium/large values
const baseLayout = {
  title: {
    topMedium: '3%',
    topLarge: '3%',
    leftMedium: '7%',
    leftLarge: '7%',
    textAlign: 'left',
    colorMedium: '#333',
    colorLarge: '#333',
    fontSizeMedium: '1.4rem',
    fontSizeLarge: '2rem',
    fontFamilyMedium: 'Press Start 2P',
    fontFamilyLarge: 'Press Start 2P',
    fontWeight: 'bold',
    widthMedium: '80%',
    widthLarge: '80%'
  },
  description: {
    topMedium: '20%',
    topLarge: '20%',
    leftMedium: '7%',
    leftLarge: '7%',
    textAlign: 'left',
    colorMedium: '#555',
    colorLarge: '#555',
    fontSizeMedium: '1rem',
    fontSizeLarge: '1.3rem',
    fontFamilyMedium: 'Press Start 2P',
    fontFamilyLarge: 'Press Start 2P',
    widthMedium: '80%',
    widthLarge: '80%'
  },
  punchGrid: {
    topMedium: '33%',
    topLarge: '34%',
    leftMedium: '50%',
    leftLarge: '50%',
    transform: 'translateX(-50%)',
    punchCircleSizeMedium: '70px',
    punchCircleSizeLarge: '80px',
    punchIconSizeMedium: '70px',
    punchIconSizeLarge: '80px',
    punchHorizontalGapMedium: '7px',
    punchHorizontalGapLarge: '13px',
    punchVerticalGapMedium: '10px',
    punchVerticalGapLarge: '15px',
    numRows: 2,
    punchesPerRow: 5
  }
};

// Default layout configurations for each punch card
// Each card uses the base layout but can override colors
export const cardLayouts = {
  'WindowsGreen.png': {
    ...baseLayout,
    title: { ...baseLayout.title, colorMedium: '#0b693c', colorLarge: '#0b693c' },
    description: { ...baseLayout.description, colorMedium: '#0b693c', colorLarge: '#0b693c' }
  },
  'WindowsPink.png': {
    ...baseLayout,
    title: { ...baseLayout.title, colorMedium: '#f677a2', colorLarge: '#f677a2' },
    description: { ...baseLayout.description, colorMedium: '#f677a2', colorLarge: '#f677a2' }
  },
  'WindowsPurple.png': {
    ...baseLayout,
    title: { ...baseLayout.title, colorMedium: '#8c52ff', colorLarge: '#8c52ff' },
    description: { ...baseLayout.description, colorMedium: '#8c52ff', colorLarge: '#8c52ff' }
  },
  'LacePink.png': {
    ...baseLayout,
    title: { ...baseLayout.title, colorMedium: '#EC4899', colorLarge: '#EC4899' },
    description: { ...baseLayout.description, colorMedium: '#F472B6', colorLarge: '#F472B6' }
  },
  'LaceRed.png': {
    ...baseLayout,
    title: { ...baseLayout.title, colorMedium: '#DC2626', colorLarge: '#DC2626' },
    description: { ...baseLayout.description, colorMedium: '#EF4444', colorLarge: '#EF4444' }
  },
  'PlaidBlue.png': {
    ...baseLayout,
    title: { ...baseLayout.title, colorMedium: '#2563EB', colorLarge: '#2563EB' },
    description: { ...baseLayout.description, colorMedium: '#3B82F6', colorLarge: '#3B82F6' }
  },
  'PlaidGreen.png': {
    ...baseLayout,
    title: { ...baseLayout.title, colorMedium: '#059669', colorLarge: '#059669' },
    description: { ...baseLayout.description, colorMedium: '#10B981', colorLarge: '#10B981' }
  },
  'DigiCam.png': {
    ...baseLayout,
    title: { ...baseLayout.title, colorMedium: '#1F2937', colorLarge: '#1F2937' },
    description: { ...baseLayout.description, colorMedium: '#4B5563', colorLarge: '#4B5563' }
  },
  'FilmCam.png': {
    ...baseLayout,
    title: { ...baseLayout.title, colorMedium: '#92400E', colorLarge: '#92400E' },
    description: { ...baseLayout.description, colorMedium: '#B45309', colorLarge: '#B45309' }
  }
};

// Get layout for a specific card image filename
export const getCardLayout = (cardImageFilename) => {
  return cardLayouts[cardImageFilename] || cardLayouts['WindowsGreen.png'];
};

