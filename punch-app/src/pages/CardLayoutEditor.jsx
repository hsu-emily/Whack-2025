import { Copy } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import PunchCardPreview from '../components/PunchCardPreview';

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

const cardNames = Object.keys(punchCardMap);
const iconNames = Object.keys(iconMap);

// Default layout template
const defaultLayout = {
  title: { top: '4%', left: '7%', textAlign: 'left', color: '#333', fontSize: '1.4rem', fontWeight: 'bold', width: '80%' },
  description: { top: '20%', left: '7%', textAlign: 'left', color: '#555', fontSize: '1rem', width: '80%' },
  punchGrid: { top: '33%', left: '50%', transform: 'translateX(-50%)', punchCircleSize: '85px', punchIconSize: '85px', punchHorizontalGap: '8px', punchVerticalGap: '10px', numRows: 2, punchesPerRow: 5 }
};

export default function CardLayoutEditor() {
  const [selectedCard, setSelectedCard] = useState(cardNames[0] || '');
  const [selectedIcon1, setSelectedIcon1] = useState(iconNames[0] || '');
  const [selectedIcon2, setSelectedIcon2] = useState(iconNames[1] || iconNames[0] || '');
  const [currentPunches, setCurrentPunches] = useState(3);
  const [targetPunches, setTargetPunches] = useState(10);
  const [editingSize, setEditingSize] = useState('medium'); // 'medium' or 'large'
  
  // Refs for measuring dimensions
  const mediumPreviewRef = useRef(null);
  const largePreviewRef = useRef(null);
  const [mediumDimensions, setMediumDimensions] = useState({ width: 0, height: 0 });
  const [largeDimensions, setLargeDimensions] = useState({ width: 0, height: 0 });

  // Medium size settings
  const [titleTopMedium, setTitleTopMedium] = useState(defaultLayout.title.top);
  const [titleLeftMedium, setTitleLeftMedium] = useState(defaultLayout.title.left);
  const [titleTextAlignMedium, setTitleTextAlignMedium] = useState(defaultLayout.title.textAlign);
  const [titleColorMedium, setTitleColorMedium] = useState(defaultLayout.title.color);
  const [titleFontSizeMedium, setTitleFontSizeMedium] = useState(defaultLayout.title.fontSize);
  const [titleFontFamilyMedium, setTitleFontFamilyMedium] = useState(defaultLayout.title.fontFamily || 'Arial');
  const [titleWidthMedium, setTitleWidthMedium] = useState(defaultLayout.title.width);

  const [descTopMedium, setDescTopMedium] = useState(defaultLayout.description.top);
  const [descLeftMedium, setDescLeftMedium] = useState(defaultLayout.description.left);
  const [descTextAlignMedium, setDescTextAlignMedium] = useState(defaultLayout.description.textAlign);
  const [descColorMedium, setDescColorMedium] = useState(defaultLayout.description.color);
  const [descFontSizeMedium, setDescFontSizeMedium] = useState(defaultLayout.description.fontSize);
  const [descFontFamilyMedium, setDescFontFamilyMedium] = useState(defaultLayout.description.fontFamily || 'Arial');
  const [descWidthMedium, setDescWidthMedium] = useState(defaultLayout.description.width);

  const [gridTopMedium, setGridTopMedium] = useState(defaultLayout.punchGrid.top);
  const [gridLeftMedium, setGridLeftMedium] = useState(defaultLayout.punchGrid.left);
  const [gridTransformMedium, setGridTransformMedium] = useState(defaultLayout.punchGrid.transform);
  const [punchCircleSizeMedium, setPunchCircleSizeMedium] = useState(defaultLayout.punchGrid.punchCircleSize);
  const [punchIconSizeMedium, setPunchIconSizeMedium] = useState(defaultLayout.punchGrid.punchIconSize);
  const [punchHorizontalGapMedium, setPunchHorizontalGapMedium] = useState(defaultLayout.punchGrid.punchHorizontalGap);
  const [punchVerticalGapMedium, setPunchVerticalGapMedium] = useState(defaultLayout.punchGrid.punchVerticalGap);
  const [numRows, setNumRows] = useState(defaultLayout.punchGrid.numRows);
  const [punchesPerRow, setPunchesPerRow] = useState(defaultLayout.punchGrid.punchesPerRow);

  // Large size settings (initialize with medium values)
  const [titleTopLarge, setTitleTopLarge] = useState(defaultLayout.title.top);
  const [titleLeftLarge, setTitleLeftLarge] = useState(defaultLayout.title.left);
  const [titleTextAlignLarge, setTitleTextAlignLarge] = useState(defaultLayout.title.textAlign);
  const [titleColorLarge, setTitleColorLarge] = useState(defaultLayout.title.color);
  const [titleFontSizeLarge, setTitleFontSizeLarge] = useState('2rem');
  const [titleFontFamilyLarge, setTitleFontFamilyLarge] = useState(defaultLayout.title.fontFamily || 'Arial');
  const [titleWidthLarge, setTitleWidthLarge] = useState(defaultLayout.title.width);

  const [descTopLarge, setDescTopLarge] = useState(defaultLayout.description.top);
  const [descLeftLarge, setDescLeftLarge] = useState(defaultLayout.description.left);
  const [descTextAlignLarge, setDescTextAlignLarge] = useState(defaultLayout.description.textAlign);
  const [descColorLarge, setDescColorLarge] = useState(defaultLayout.description.color);
  const [descFontSizeLarge, setDescFontSizeLarge] = useState('1.5rem');
  const [descFontFamilyLarge, setDescFontFamilyLarge] = useState(defaultLayout.description.fontFamily || 'Arial');
  const [descWidthLarge, setDescWidthLarge] = useState(defaultLayout.description.width);

  const [gridTopLarge, setGridTopLarge] = useState(defaultLayout.punchGrid.top);
  const [gridLeftLarge, setGridLeftLarge] = useState(defaultLayout.punchGrid.left);
  const [gridTransformLarge, setGridTransformLarge] = useState(defaultLayout.punchGrid.transform);
  const [punchCircleSizeLarge, setPunchCircleSizeLarge] = useState('120px');
  const [punchIconSizeLarge, setPunchIconSizeLarge] = useState('120px');
  const [punchHorizontalGapLarge, setPunchHorizontalGapLarge] = useState('12px');
  const [punchVerticalGapLarge, setPunchVerticalGapLarge] = useState('15px');

  // Get current values based on editing size
  const getCurrentValue = (medium, large) => editingSize === 'large' ? large : medium;
  const setCurrentValue = (mediumSetter, largeSetter, value) => {
    if (editingSize === 'large') {
      largeSetter(value);
    } else {
      mediumSetter(value);
    }
  };

  // Font options
  const fontOptions = [
    'Arial',
    'Helvetica',
    'Times New Roman',
    'Georgia',
    'Verdana',
    'Courier New',
    'Comic Sans MS',
    'Impact',
    'Trebuchet MS',
    'Press Start 2P',
    'Roboto',
    'Open Sans',
    'Lato',
    'Montserrat',
    'Poppins',
    'Playfair Display',
    'Merriweather',
    'Oswald',
    'Raleway',
    'Ubuntu',
  ];

  // Computed layout objects
  const layoutMedium = useMemo(() => ({
    title: {
      top: titleTopMedium,
      left: titleLeftMedium,
      textAlign: titleTextAlignMedium,
      color: titleColorMedium,
      fontSize: titleFontSizeMedium,
      fontFamily: titleFontFamilyMedium,
      fontWeight: defaultLayout.title.fontWeight,
      width: titleWidthMedium,
    },
    description: {
      top: descTopMedium,
      left: descLeftMedium,
      textAlign: descTextAlignMedium,
      color: descColorMedium,
      fontSize: descFontSizeMedium,
      fontFamily: descFontFamilyMedium,
      width: descWidthMedium,
    },
    punchGrid: {
      top: gridTopMedium,
      left: gridLeftMedium,
      transform: gridTransformMedium,
      punchCircleSize: punchCircleSizeMedium,
      punchIconSize: punchIconSizeMedium,
      punchHorizontalGap: punchHorizontalGapMedium,
      punchVerticalGap: punchVerticalGapMedium,
      numRows,
      punchesPerRow,
    },
  }), [
    titleTopMedium, titleLeftMedium, titleTextAlignMedium, titleColorMedium, titleFontSizeMedium, titleFontFamilyMedium, titleWidthMedium,
    descTopMedium, descLeftMedium, descTextAlignMedium, descColorMedium, descFontSizeMedium, descFontFamilyMedium, descWidthMedium,
    gridTopMedium, gridLeftMedium, gridTransformMedium, punchCircleSizeMedium, punchIconSizeMedium,
    punchHorizontalGapMedium, punchVerticalGapMedium, numRows, punchesPerRow,
  ]);

  const layoutLarge = useMemo(() => ({
    title: {
      top: titleTopLarge,
      left: titleLeftLarge,
      textAlign: titleTextAlignLarge,
      color: titleColorLarge,
      fontSize: titleFontSizeLarge,
      fontFamily: titleFontFamilyLarge,
      fontWeight: defaultLayout.title.fontWeight,
      width: titleWidthLarge,
    },
    description: {
      top: descTopLarge,
      left: descLeftLarge,
      textAlign: descTextAlignLarge,
      color: descColorLarge,
      fontSize: descFontSizeLarge,
      fontFamily: descFontFamilyLarge,
      width: descWidthLarge,
    },
    punchGrid: {
      top: gridTopLarge,
      left: gridLeftLarge,
      transform: gridTransformLarge,
      punchCircleSize: punchCircleSizeLarge,
      punchIconSize: punchIconSizeLarge,
      punchHorizontalGap: punchHorizontalGapLarge,
      punchVerticalGap: punchVerticalGapLarge,
      numRows,
      punchesPerRow,
    },
  }), [
    titleTopLarge, titleLeftLarge, titleTextAlignLarge, titleColorLarge, titleFontSizeLarge, titleFontFamilyLarge, titleWidthLarge,
    descTopLarge, descLeftLarge, descTextAlignLarge, descColorLarge, descFontSizeLarge, descFontFamilyLarge, descWidthLarge,
    gridTopLarge, gridLeftLarge, gridTransformLarge, punchCircleSizeLarge, punchIconSizeLarge,
    punchHorizontalGapLarge, punchVerticalGapLarge, numRows, punchesPerRow,
  ]);

  // Generate JSON output with both sizes
  const jsonOutput = useMemo(() => {
    return JSON.stringify({
      title: {
        topMedium: titleTopMedium,
        topLarge: titleTopLarge,
        leftMedium: titleLeftMedium,
        leftLarge: titleLeftLarge,
        textAlign: titleTextAlignMedium, // Same for both
        colorMedium: titleColorMedium,
        colorLarge: titleColorLarge,
        fontSizeMedium: titleFontSizeMedium,
        fontSizeLarge: titleFontSizeLarge,
        fontFamilyMedium: titleFontFamilyMedium,
        fontFamilyLarge: titleFontFamilyLarge,
        fontWeight: defaultLayout.title.fontWeight,
        widthMedium: titleWidthMedium,
        widthLarge: titleWidthLarge,
      },
      description: {
        topMedium: descTopMedium,
        topLarge: descTopLarge,
        leftMedium: descLeftMedium,
        leftLarge: descLeftLarge,
        textAlign: descTextAlignMedium,
        colorMedium: descColorMedium,
        colorLarge: descColorLarge,
        fontSizeMedium: descFontSizeMedium,
        fontSizeLarge: descFontSizeLarge,
        fontFamilyMedium: descFontFamilyMedium,
        fontFamilyLarge: descFontFamilyLarge,
        widthMedium: descWidthMedium,
        widthLarge: descWidthLarge,
      },
      punchGrid: {
        topMedium: gridTopMedium,
        topLarge: gridTopLarge,
        leftMedium: gridLeftMedium,
        leftLarge: gridLeftLarge,
        transform: gridTransformMedium,
        punchCircleSizeMedium: punchCircleSizeMedium,
        punchCircleSizeLarge: punchCircleSizeLarge,
        punchIconSizeMedium: punchIconSizeMedium,
        punchIconSizeLarge: punchIconSizeLarge,
        punchHorizontalGapMedium: punchHorizontalGapMedium,
        punchHorizontalGapLarge: punchHorizontalGapLarge,
        punchVerticalGapMedium: punchVerticalGapMedium,
        punchVerticalGapLarge: punchVerticalGapLarge,
        numRows,
        punchesPerRow,
      },
    }, null, 2);
  }, [layoutMedium, layoutLarge, numRows, punchesPerRow]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(jsonOutput);
    alert('Copied to clipboard!');
  };

  const copyAsCode = () => {
    const code = `'${selectedCard}': {
    title: { 
      topMedium: '${titleTopMedium}', topLarge: '${titleTopLarge}',
      leftMedium: '${titleLeftMedium}', leftLarge: '${titleLeftLarge}',
      textAlign: '${titleTextAlignMedium}', 
      colorMedium: '${titleColorMedium}', colorLarge: '${titleColorLarge}',
      fontSizeMedium: '${titleFontSizeMedium}', fontSizeLarge: '${titleFontSizeLarge}',
      fontFamilyMedium: '${titleFontFamilyMedium}', fontFamilyLarge: '${titleFontFamilyLarge}',
      fontWeight: 'bold',
      widthMedium: '${titleWidthMedium}', widthLarge: '${titleWidthLarge}'
    },
    description: { 
      topMedium: '${descTopMedium}', topLarge: '${descTopLarge}',
      leftMedium: '${descLeftMedium}', leftLarge: '${descLeftLarge}',
      textAlign: '${descTextAlignMedium}',
      colorMedium: '${descColorMedium}', colorLarge: '${descColorLarge}',
      fontSizeMedium: '${descFontSizeMedium}', fontSizeLarge: '${descFontSizeLarge}',
      fontFamilyMedium: '${descFontFamilyMedium}', fontFamilyLarge: '${descFontFamilyLarge}',
      widthMedium: '${descWidthMedium}', widthLarge: '${descWidthLarge}'
    },
    punchGrid: { 
      topMedium: '${gridTopMedium}', topLarge: '${gridTopLarge}',
      leftMedium: '${gridLeftMedium}', leftLarge: '${gridLeftLarge}',
      transform: '${gridTransformMedium}',
      punchCircleSizeMedium: '${punchCircleSizeMedium}', punchCircleSizeLarge: '${punchCircleSizeLarge}',
      punchIconSizeMedium: '${punchIconSizeMedium}', punchIconSizeLarge: '${punchIconSizeLarge}',
      punchHorizontalGapMedium: '${punchHorizontalGapMedium}', punchHorizontalGapLarge: '${punchHorizontalGapLarge}',
      punchVerticalGapMedium: '${punchVerticalGapMedium}', punchVerticalGapLarge: '${punchVerticalGapLarge}',
      numRows: ${numRows}, punchesPerRow: ${punchesPerRow}
    }
  }`;
    navigator.clipboard.writeText(code);
    alert('Code copied to clipboard!');
  };

  const icon1 = selectedIcon1 ? iconMap[selectedIcon1] : null;
  const icon2 = selectedIcon2 ? iconMap[selectedIcon2] : null;
  const cardImage = selectedCard ? punchCardMap[selectedCard] : null;

  // Track dimensions of preview cards
  useEffect(() => {
    const updateDimensions = () => {
      if (mediumPreviewRef.current) {
        const rect = mediumPreviewRef.current.getBoundingClientRect();
        setMediumDimensions({
          width: Math.round(rect.width),
          height: Math.round(rect.height),
        });
      }
      if (largePreviewRef.current) {
        const rect = largePreviewRef.current.getBoundingClientRect();
        setLargeDimensions({
          width: Math.round(rect.width),
          height: Math.round(rect.height),
        });
      }
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    // Use ResizeObserver for more accurate tracking
    const observers = [];
    if (mediumPreviewRef.current) {
      const observer = new ResizeObserver(updateDimensions);
      observer.observe(mediumPreviewRef.current);
      observers.push(observer);
    }
    if (largePreviewRef.current) {
      const observer = new ResizeObserver(updateDimensions);
      observer.observe(largePreviewRef.current);
      observers.push(observer);
    }
    
    return () => {
      window.removeEventListener('resize', updateDimensions);
      observers.forEach(obs => obs.disconnect());
    };
  }, [cardImage, layoutMedium, layoutLarge]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4">
      <div className="max-w-[1800px] mx-auto">
        <h1 className="text-3xl font-bold text-center mb-4 text-pink-600">Card Layout Editor</h1>
        
        {/* Top Controls Bar */}
        <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Size Toggle */}
            <div>
              <label className="block text-sm font-medium mb-2">Editing Size:</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingSize('medium')}
                  className={`flex-1 px-4 py-2 rounded text-sm font-medium ${editingSize === 'medium' ? 'bg-purple-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                  Medium
                </button>
                <button
                  onClick={() => setEditingSize('large')}
                  className={`flex-1 px-4 py-2 rounded text-sm font-medium ${editingSize === 'large' ? 'bg-purple-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                  Large
                </button>
              </div>
            </div>
            
            {/* Card Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">Card Image:</label>
              <select
                value={selectedCard}
                onChange={(e) => setSelectedCard(e.target.value)}
                className="w-full p-2 border rounded text-sm"
              >
                {cardNames.map(name => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </div>

            {/* Icon Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">Icon 1:</label>
              <select
                value={selectedIcon1}
                onChange={(e) => setSelectedIcon1(e.target.value)}
                className="w-full p-2 border rounded text-sm"
              >
                {iconNames.map(name => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Icon 2:</label>
              <select
                value={selectedIcon2}
                onChange={(e) => setSelectedIcon2(e.target.value)}
                className="w-full p-2 border rounded text-sm"
              >
                {iconNames.map(name => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Punches */}
          <div className="grid grid-cols-2 gap-4 mt-4 max-w-xs">
            <div>
              <label className="block text-sm font-medium mb-2">Current Punches:</label>
              <input
                type="number"
                value={currentPunches}
                onChange={(e) => setCurrentPunches(parseInt(e.target.value) || 0)}
                className="w-full p-2 border rounded text-sm"
                min="0"
                max={targetPunches}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Target Punches:</label>
              <input
                type="number"
                value={targetPunches}
                onChange={(e) => setTargetPunches(parseInt(e.target.value) || 0)}
                className="w-full p-2 border rounded text-sm"
                min="1"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Preview Section - Side by Side */}
          <div className="xl:col-span-2 bg-white rounded-lg shadow-lg p-4">
            <h2 className="text-xl font-bold mb-4">Live Preview</h2>
            
            {/* Preview Cards - Side by Side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-pink-600">Medium Size</h3>
                  <span className="text-xs text-gray-500">Carousel View</span>
                </div>
                <div className="relative">
                  <div 
                    ref={mediumPreviewRef}
                    className="border-4 border-pink-200 rounded-lg overflow-hidden" 
                    style={{ aspectRatio: '1004/591', maxHeight: '350px' }}
                  >
                    {cardImage && (
                      <PunchCardPreview
                        name="Sample Title"
                        description="This is a sample description text"
                        icon1={icon1}
                        icon2={icon2}
                        cardImage={cardImage}
                        isDailyPunch={false}
                        titlePlacement={layoutMedium.title}
                        descriptionPlacement={layoutMedium.description}
                        punchGridPlacement={layoutMedium.punchGrid}
                        currentPunches={currentPunches}
                        targetPunches={targetPunches}
                        size="medium"
                      />
                    )}
                  </div>
                  {mediumDimensions.width > 0 && mediumDimensions.height > 0 && (
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm border-2 border-pink-300 rounded-md px-2 py-1 text-xs font-semibold text-pink-600 shadow-md">
                      {mediumDimensions.width} × {mediumDimensions.height} px
                    </div>
                  )}
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-purple-600">Large Size</h3>
                  <span className="text-xs text-gray-500">Zoom Modal View</span>
                </div>
                <div className="relative">
                  <div 
                    ref={largePreviewRef}
                    className="border-4 border-purple-200 rounded-lg overflow-hidden" 
                    style={{ aspectRatio: '1004/591', maxHeight: '350px' }}
                  >
                    {cardImage && (
                      <PunchCardPreview
                        name="Sample Title"
                        description="This is a sample description text"
                        icon1={icon1}
                        icon2={icon2}
                        cardImage={cardImage}
                        isDailyPunch={false}
                        titlePlacement={layoutLarge.title}
                        descriptionPlacement={layoutLarge.description}
                        punchGridPlacement={layoutLarge.punchGrid}
                        currentPunches={currentPunches}
                        targetPunches={targetPunches}
                        size="large"
                      />
                    )}
                  </div>
                  {largeDimensions.width > 0 && largeDimensions.height > 0 && (
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm border-2 border-purple-300 rounded-md px-2 py-1 text-xs font-semibold text-purple-600 shadow-md">
                      {largeDimensions.width} × {largeDimensions.height} px
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Controls Section */}
          <div className="bg-white rounded-lg shadow-lg p-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
            <div className="sticky top-0 bg-white pb-2 mb-4 border-b">
              <h2 className="text-xl font-bold">
                {editingSize === 'large' ? 'Large' : 'Medium'} Size Controls
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Adjust values for {editingSize === 'large' ? 'zoom modal' : 'carousel'} view
              </p>
            </div>

            {/* Title Controls */}
            <div className="mb-6 p-4 bg-purple-50 rounded">
              <h3 className="font-bold mb-3 text-purple-700">Title Settings ({editingSize})</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1">Top:</label>
                  <input 
                    type="text" 
                    value={getCurrentValue(titleTopMedium, titleTopLarge)} 
                    onChange={(e) => setCurrentValue(setTitleTopMedium, setTitleTopLarge, e.target.value)} 
                    className="w-full p-1 border rounded text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Left:</label>
                  <input 
                    type="text" 
                    value={getCurrentValue(titleLeftMedium, titleLeftLarge)} 
                    onChange={(e) => setCurrentValue(setTitleLeftMedium, setTitleLeftLarge, e.target.value)} 
                    className="w-full p-1 border rounded text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Text Align:</label>
                  <select 
                    value={getCurrentValue(titleTextAlignMedium, titleTextAlignLarge)} 
                    onChange={(e) => {
                      setTitleTextAlignMedium(e.target.value);
                      setTitleTextAlignLarge(e.target.value);
                    }}
                    className="w-full p-1 border rounded text-sm"
                  >
                    <option value="left">left</option>
                    <option value="center">center</option>
                    <option value="right">right</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Color:</label>
                  <input 
                    type="color" 
                    value={getCurrentValue(titleColorMedium, titleColorLarge)} 
                    onChange={(e) => setCurrentValue(setTitleColorMedium, setTitleColorLarge, e.target.value)} 
                    className="w-full p-1 border rounded text-sm h-8" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Font Size:</label>
                  <input 
                    type="text" 
                    value={getCurrentValue(titleFontSizeMedium, titleFontSizeLarge)} 
                    onChange={(e) => setCurrentValue(setTitleFontSizeMedium, setTitleFontSizeLarge, e.target.value)} 
                    className="w-full p-1 border rounded text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Font Family:</label>
                  <select
                    value={getCurrentValue(titleFontFamilyMedium, titleFontFamilyLarge)}
                    onChange={(e) => setCurrentValue(setTitleFontFamilyMedium, setTitleFontFamilyLarge, e.target.value)}
                    className="w-full p-1 border rounded text-sm"
                  >
                    {fontOptions.map(font => (
                      <option key={font} value={font} style={{ fontFamily: font }}>{font}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Width:</label>
                  <input 
                    type="text" 
                    value={getCurrentValue(titleWidthMedium, titleWidthLarge)} 
                    onChange={(e) => setCurrentValue(setTitleWidthMedium, setTitleWidthLarge, e.target.value)} 
                    className="w-full p-1 border rounded text-sm" 
                  />
                </div>
              </div>
            </div>

            {/* Description Controls */}
            <div className="mb-6 p-4 bg-pink-50 rounded">
              <h3 className="font-bold mb-3 text-pink-700">Description Settings ({editingSize})</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1">Top:</label>
                  <input 
                    type="text" 
                    value={getCurrentValue(descTopMedium, descTopLarge)} 
                    onChange={(e) => setCurrentValue(setDescTopMedium, setDescTopLarge, e.target.value)} 
                    className="w-full p-1 border rounded text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Left:</label>
                  <input 
                    type="text" 
                    value={getCurrentValue(descLeftMedium, descLeftLarge)} 
                    onChange={(e) => setCurrentValue(setDescLeftMedium, setDescLeftLarge, e.target.value)} 
                    className="w-full p-1 border rounded text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Text Align:</label>
                  <select 
                    value={getCurrentValue(descTextAlignMedium, descTextAlignLarge)} 
                    onChange={(e) => {
                      setDescTextAlignMedium(e.target.value);
                      setDescTextAlignLarge(e.target.value);
                    }}
                    className="w-full p-1 border rounded text-sm"
                  >
                    <option value="left">left</option>
                    <option value="center">center</option>
                    <option value="right">right</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Color:</label>
                  <input 
                    type="color" 
                    value={getCurrentValue(descColorMedium, descColorLarge)} 
                    onChange={(e) => setCurrentValue(setDescColorMedium, setDescColorLarge, e.target.value)} 
                    className="w-full p-1 border rounded text-sm h-8" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Font Size:</label>
                  <input 
                    type="text" 
                    value={getCurrentValue(descFontSizeMedium, descFontSizeLarge)} 
                    onChange={(e) => setCurrentValue(setDescFontSizeMedium, setDescFontSizeLarge, e.target.value)} 
                    className="w-full p-1 border rounded text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Font Family:</label>
                  <select
                    value={getCurrentValue(descFontFamilyMedium, descFontFamilyLarge)}
                    onChange={(e) => setCurrentValue(setDescFontFamilyMedium, setDescFontFamilyLarge, e.target.value)}
                    className="w-full p-1 border rounded text-sm"
                  >
                    {fontOptions.map(font => (
                      <option key={font} value={font} style={{ fontFamily: font }}>{font}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Width:</label>
                  <input 
                    type="text" 
                    value={getCurrentValue(descWidthMedium, descWidthLarge)} 
                    onChange={(e) => setCurrentValue(setDescWidthMedium, setDescWidthLarge, e.target.value)} 
                    className="w-full p-1 border rounded text-sm" 
                  />
                </div>
              </div>
            </div>

            {/* Punch Grid Controls */}
            <div className="mb-6 p-4 bg-blue-50 rounded">
              <h3 className="font-bold mb-3 text-blue-700">Punch Grid Settings ({editingSize})</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1">Top:</label>
                  <input 
                    type="text" 
                    value={getCurrentValue(gridTopMedium, gridTopLarge)} 
                    onChange={(e) => setCurrentValue(setGridTopMedium, setGridTopLarge, e.target.value)} 
                    className="w-full p-1 border rounded text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Left:</label>
                  <input 
                    type="text" 
                    value={getCurrentValue(gridLeftMedium, gridLeftLarge)} 
                    onChange={(e) => setCurrentValue(setGridLeftMedium, setGridLeftLarge, e.target.value)} 
                    className="w-full p-1 border rounded text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Transform:</label>
                  <input 
                    type="text" 
                    value={getCurrentValue(gridTransformMedium, gridTransformLarge)} 
                    onChange={(e) => {
                      setGridTransformMedium(e.target.value);
                      setGridTransformLarge(e.target.value);
                    }}
                    className="w-full p-1 border rounded text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Circle Size:</label>
                  <input 
                    type="text" 
                    value={getCurrentValue(punchCircleSizeMedium, punchCircleSizeLarge)} 
                    onChange={(e) => setCurrentValue(setPunchCircleSizeMedium, setPunchCircleSizeLarge, e.target.value)} 
                    className="w-full p-1 border rounded text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Icon Size:</label>
                  <input 
                    type="text" 
                    value={getCurrentValue(punchIconSizeMedium, punchIconSizeLarge)} 
                    onChange={(e) => setCurrentValue(setPunchIconSizeMedium, setPunchIconSizeLarge, e.target.value)} 
                    className="w-full p-1 border rounded text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Horizontal Gap:</label>
                  <input 
                    type="text" 
                    value={getCurrentValue(punchHorizontalGapMedium, punchHorizontalGapLarge)} 
                    onChange={(e) => setCurrentValue(setPunchHorizontalGapMedium, setPunchHorizontalGapLarge, e.target.value)} 
                    className="w-full p-1 border rounded text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Vertical Gap:</label>
                  <input 
                    type="text" 
                    value={getCurrentValue(punchVerticalGapMedium, punchVerticalGapLarge)} 
                    onChange={(e) => setCurrentValue(setPunchVerticalGapMedium, setPunchVerticalGapLarge, e.target.value)} 
                    className="w-full p-1 border rounded text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Number of Rows:</label>
                  <input 
                    type="number" 
                    value={numRows} 
                    onChange={(e) => setNumRows(parseInt(e.target.value) || 1)} 
                    className="w-full p-1 border rounded text-sm" 
                    min="1" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Punches Per Row:</label>
                  <input 
                    type="number" 
                    value={punchesPerRow} 
                    onChange={(e) => setPunchesPerRow(parseInt(e.target.value) || 1)} 
                    className="w-full p-1 border rounded text-sm" 
                    min="1" 
                  />
                </div>
              </div>
            </div>

            {/* Output Section */}
            <div className="mb-4">
              <div className="flex gap-2 mb-2">
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                >
                  <Copy size={16} />
                  Copy JSON
                </button>
                <button
                  onClick={copyAsCode}
                  className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700"
                >
                  <Copy size={16} />
                  Copy Code
                </button>
              </div>
              <textarea
                value={jsonOutput}
                readOnly
                className="w-full p-2 border rounded text-xs font-mono h-40"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
