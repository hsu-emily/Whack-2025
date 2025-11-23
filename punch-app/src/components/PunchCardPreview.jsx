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
}) {
  const getPunchIcon = (index) => {
    const icon = (index % 2 === 0 ? icon1 : icon2);
    if (!icon) return isDailyPunch ? '🌟' : '🌸';
    return icon;
  };

  // Use values from punchGridPlacement, with fallbacks for defaults
  const currentPunchGrid = {
    top: punchGridPlacement.top || '40%',
    left: punchGridPlacement.left || '50%',
    transform: punchGridPlacement.transform || 'translateX(-50%)',
    punchCircleSize: punchGridPlacement.punchCircleSize || '48px', // Default size for circular punch area
    punchIconSize: punchGridPlacement.punchIconSize || '32px', // Default size for the icon itself
    punchHorizontalGap: punchGridPlacement.punchHorizontalGap || '24px', // Default gap between punches horizontally
    punchVerticalGap: punchGridPlacement.punchVerticalGap || '24px', // Default gap between punch rows vertically
    numRows: punchGridPlacement.numRows || 2, // Default number of rows
    punchesPerRow: punchGridPlacement.punchesPerRow || 4, // Default punches per row
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

  return (
    <div
      className="relative w-full h-full rounded-2xl overflow-hidden"
      style={{
        backgroundImage: `url(${cardImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        border: '3px solid #f8bbd0',
        boxShadow: '0 4px 24px rgba(248, 187, 208, 0.5)',
      }}
    >
      {/* Title - Absolute Positioned: Fully controlled by titlePlacement */}
      <h2
        className="absolute"
        style={{
          ...titlePlacement,
          zIndex: 10,
        }}
      >
        {name || 'Punch Pass Title'}
      </h2>

      {/* Description - Absolute Positioned: Fully controlled by descriptionPlacement */}
      <p
        className="absolute"
        style={{
          ...descriptionPlacement,
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
            className="flex justify-center"
            style={{ gap: currentPunchGrid.punchHorizontalGap }} // Horizontal gap between punches
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
                  }}
                >
                  {typeof punch.icon === 'string' && (punch.icon.includes('.png') || punch.icon.includes('.svg') || punch.icon.startsWith('http') || punch.icon.startsWith('/')) ? (
                    <img
                      src={punch.icon}
                      alt=""
                      className="object-contain"
                      style={{ width: currentPunchGrid.punchIconSize, height: currentPunchGrid.punchIconSize }}
                    />
                  ) : (
                    <span style={{ fontSize: currentPunchGrid.punchIconSize }}>{punch.icon || '○'}</span>
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