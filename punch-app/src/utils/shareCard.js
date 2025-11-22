// Utility for generating shareable PNG cards
// Note: You'll need to install html2canvas: npm install html2canvas

export async function generateShareableCard(cardElement, habit) {
  try {
    // Dynamic import to avoid issues if html2canvas isn't installed
    const html2canvas = (await import('html2canvas')).default;
    
    const canvas = await html2canvas(cardElement, {
      backgroundColor: '#ffffff',
      scale: 2, // Higher quality
      logging: false,
      useCORS: true
    });

    // Convert to blob
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/png');
    });
  } catch (error) {
    console.error('Error generating shareable card:', error);
    // Fallback: open share dialog with text
    if (navigator.share) {
      navigator.share({
        title: `My ${habit.title} Progress`,
        text: `I've completed ${habit.currentPunches}/${habit.targetPunches} punches! ${habit.reward ? `Reward: ${habit.reward}` : ''}`,
      });
    } else {
      // Copy to clipboard as fallback
      const text = `My ${habit.title} Progress: ${habit.currentPunches}/${habit.targetPunches} punches! ${habit.reward ? `Reward: ${habit.reward}` : ''}`;
      navigator.clipboard.writeText(text).then(() => {
        alert('Progress copied to clipboard!');
      });
    }
    return null;
  }
}

export function downloadCard(blob, habitTitle) {
  if (!blob) return;
  
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${habitTitle.replace(/\s+/g, '-')}-progress.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function shareCard(blob, habit) {
  if (!blob) return;
  
  if (navigator.share && navigator.canShare) {
    const file = new File([blob], `${habit.title}-progress.png`, { type: 'image/png' });
    if (navigator.canShare({ files: [file] })) {
      navigator.share({
        title: `My ${habit.title} Progress`,
        text: `I've completed ${habit.currentPunches}/${habit.targetPunches} punches! 🎉`,
        files: [file]
      }).catch(() => {
        // Fallback to download
        downloadCard(blob, habit.title);
      });
    } else {
      downloadCard(blob, habit.title);
    }
  } else {
    downloadCard(blob, habit.title);
  }
}

