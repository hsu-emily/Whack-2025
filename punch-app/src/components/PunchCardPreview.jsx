import React from 'react';

export default function PunchCardPreview({
  name,
  description,
  icon1,
  icon2,
  cardImage,
  isDailyPunch = false,
  titlePlacement = {},
  descriptionPlacement = {},
  punchGridPlacement = {},
  currentPunches = 0,
  targetPunches = 10,
  size = 'medium', // 'medium' or 'large'
}) {
  // Get layout values based on size - use medium or large specific values
  const getSizeValue = (mediumValue, largeValue) => {
    return size === 'large' ? largeValue : mediumValue;
  };

  // Extract size-specific values from placement objects
  const getTitleValue = (key) => {
    if (titlePlacement[`${key}Medium`] !== undefined || titlePlacement[`${key}Large`] !== undefined) {
      return getSizeValue(titlePlacement[`${key}Medium`], titlePlacement[`${key}Large`]) ?? titlePlacement[key];
    }
    return titlePlacement[key];
  };

  const getDescValue = (key) => {
    if (descriptionPlacement[`${key}Medium`] !== undefined || descriptionPlacement[`${key}Large`] !== undefined) {
      return getSizeValue(descriptionPlacement[`${key}Medium`], descriptionPlacement[`${key}Large`]) ?? descriptionPlacement[key];
    }
    return descriptionPlacement[key];
  };

  const getGridValue = (key) => {
    if (punchGridPlacement[`${key}Medium`] !== undefined || punchGridPlacement[`${key}Large`] !== undefined) {
      return getSizeValue(punchGridPlacement[`${key}Medium`], punchGridPlacement[`${key}Large`]) ?? punchGridPlacement[key];
    }
    return punchGridPlacement[key];
  };

  const getPunchIcon = (index) => {
    const icon = (index % 2 === 0 ? icon1 : icon2);
    if (!icon) return isDailyPunch ? '🌟' : '🌸';
    return icon;
  };

  // Use values from punchGridPlacement, with fallbacks for defaults
  const currentPunchGrid = {
    top: getGridValue('top') || '40%',
    left: getGridValue('left') || '50%',
    transform: getGridValue('transform') || 'translateX(-50%)',
    punchCircleSize: getGridValue('punchCircleSize') || '48px',
    punchIconSize: getGridValue('punchIconSize') || '32px',
    punchHorizontalGap: getGridValue('punchHorizontalGap') || '24px',
    punchVerticalGap: getGridValue('punchVerticalGap') || '24px',
    numRows: punchGridPlacement.numRows || 2,
    punchesPerRow: punchGridPlacement.punchesPerRow || 4,
  };

  // Calculate total punches needed
  const totalPunches = currentPunchGrid.numRows * currentPunchGrid.punchesPerRow;
  const actualTargetPunches = Math.min(targetPunches, totalPunches);

  const rows = Array(currentPunchGrid.numRows)
    .fill(0)
    .map((_, rowIdx) =>
      Array(currentPunchGrid.punchesPerRow)
        .fill(0)
        .map((_, colIdx) => {
          const index = rowIdx * currentPunchGrid.punchesPerRow + colIdx;
          const isFilled = index < currentPunches && index < actualTargetPunches;
          return {
            icon: getPunchIcon(index),
            isFilled,
            index
          };
        })
    );

  // Create title and description styles with size-specific values
  const titleStyle = {
    top: getTitleValue('top') || titlePlacement.top,
    left: getTitleValue('left') || titlePlacement.left,
    textAlign: getTitleValue('textAlign') || titlePlacement.textAlign,
    color: getTitleValue('color') || titlePlacement.color,
    fontSize: getTitleValue('fontSize') || titlePlacement.fontSize,
    fontFamily: getTitleValue('fontFamily') || titlePlacement.fontFamily || 'Arial',
    fontWeight: getTitleValue('fontWeight') || titlePlacement.fontWeight,
    width: getTitleValue('width') || titlePlacement.width,
  };

  const descStyle = {
    top: getDescValue('top') || descriptionPlacement.top,
    left: getDescValue('left') || descriptionPlacement.left,
    textAlign: getDescValue('textAlign') || descriptionPlacement.textAlign,
    color: getDescValue('color') || descriptionPlacement.color,
    fontSize: getDescValue('fontSize') || descriptionPlacement.fontSize,
    fontFamily: getDescValue('fontFamily') || descriptionPlacement.fontFamily || 'Arial',
    width: getDescValue('width') || descriptionPlacement.width,
  };

  return (
    <div
      className="relative w-full h-full rounded-2xl overflow-hidden"
      style={{
        backgroundImage: `url(${cardImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        border: 'none',
        boxShadow: '0 4px 24px rgba(248, 187, 208, 0.5)',
      }}
    >
      {/* Title - Absolute Positioned: Fully controlled by titlePlacement */}
      <h2
        className="absolute"
        style={{
          ...titleStyle,
          zIndex: 10,
        }}
      >
        {name || 'Punch Pass Title'}
      </h2>

      {/* Description - Absolute Positioned: Fully controlled by descriptionPlacement */}
      <p
        className="absolute"
        style={{
          ...descStyle,
          zIndex: 10,
        }}
      >
        {description || 'Your description will appear here.'}
      </p>

      {/* Punch Grid - Absolute Positioned: Now correctly sizes and positions itself */}
      <div
        className="absolute flex flex-col items-center justify-center"
        style={{
          top: currentPunchGrid.top,
          left: currentPunchGrid.left,
          transform: currentPunchGrid.transform,
          // Removed width and height from here.
          // The grid's width will be determined by its content (punch circles + gaps).
          zIndex: 5,
          gap: currentPunchGrid.punchVerticalGap, // Vertical gap between rows
          // Ensure it doesn't wrap onto multiple lines if not intended
          flexWrap: 'nowrap', // Added this to prevent unwanted wrapping if there's enough space
        }}
      >
        {rows.map((row, rowIdx) => (
          <div
            key={rowIdx}
            className="flex justify-center items-center"
            style={{ 
              gap: currentPunchGrid.punchHorizontalGap, // Horizontal gap between punches
              width: '100%',
            }}
          >
            {row.map((punch, i) => {
              const punchIndex = punch.index;
              const showPunch = punchIndex < actualTargetPunches;
              
              if (!showPunch) return null;
              
              return (
                <div
                  key={i}
                  className={`flex items-center justify-center rounded-full transition-all ${
                    punch.isFilled ? 'opacity-100' : 'opacity-30'
                  }`}
                  style={{
                    width: currentPunchGrid.punchCircleSize,
                    height: currentPunchGrid.punchCircleSize,
                    minWidth: currentPunchGrid.punchCircleSize,
                    minHeight: currentPunchGrid.punchCircleSize,
                    flexShrink: 0,
                  }}
                >
                  {typeof punch.icon === 'string' && (punch.icon.includes('.png') || punch.icon.includes('.svg') || punch.icon.startsWith('http') || punch.icon.startsWith('/')) ? (
                    <img
                      src={punch.icon}
                      alt=""
                      className="object-contain"
                      style={{ 
                        width: currentPunchGrid.punchIconSize, 
                        height: currentPunchGrid.punchIconSize,
                        maxWidth: '100%',
                        maxHeight: '100%',
                      }}
                    />
                  ) : (
                    <span 
                      style={{ 
                        fontSize: currentPunchGrid.punchIconSize,
                        lineHeight: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {punch.icon || '○'}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}