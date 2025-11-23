import { Loader2, Sparkles, Wand2, X } from 'lucide-react';
import { useState } from 'react';
import { generateRewardIdeas, transformGoalToHabits } from '../services/geminiService';
import { useHabitStore } from '../store/habitStore';
import FramerCarousel from './FramerCarousel';
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

// Create punch card options array
const punchCardOptions = Object.keys(punchCardMap).map(filename => ({
  id: filename,
  name: filename.replace('.png', '').replace(/([A-Z])/g, ' $1').trim(),
  url: punchCardMap[filename],
  filename: filename
}));

// Create icon options array
const iconOptions = Object.keys(iconMap).map(filename => ({
  id: filename,
  name: filename.replace('.png', ''),
  url: iconMap[filename],
  filename: filename
}));

// Default layout configurations for each punch card
const defaultLayouts = {
  'WindowsGreen.png': {
    title: { top: '4%', left: '0%', textAlign: 'center', color: '#0b693c', fontSize: '2rem', fontWeight: 'bold', font: 'Press Start 2P', width: '70%' },
    description: { top: '23%', left: '0%', textAlign: 'center', color: '#0b693c', fontSize: '1rem', width: '70%' },
    punchGrid: { top: '45%', left: '50%', transform: 'translateX(-50%)', punchCircleSize: '100px', punchIconSize: '100px', punchHorizontalGap: '50px', punchVerticalGap: '70px', numRows: 2, punchesPerRow: 5 }
  },
  'WindowsPink.png': {
    title: { top: '15%', left: '10%', textAlign: 'left', color: '#333', fontSize: '2.8rem', fontWeight: 'bold', width: '80%' },
    description: { top: '35%', left: '10%', textAlign: 'left', color: '#555', fontSize: '1.1rem', width: '75%' },
    punchGrid: { top: '50%', left: '50%', transform: 'translateX(-50%)', punchCircleSize: '80px', punchIconSize: '60px', punchHorizontalGap: '40px', punchVerticalGap: '50px', numRows: 2, punchesPerRow: 5 }
  },
  'WindowsPurple.png': {
    title: { top: '10%', left: '0%', textAlign: 'center', color: '#6B46C1', fontSize: '2.5rem', fontWeight: 'bold', width: '100%' },
    description: { top: '25%', left: '0%', textAlign: 'center', color: '#7C3AED', fontSize: '1.2rem', width: '80%' },
    punchGrid: { top: '45%', left: '50%', transform: 'translateX(-50%)', punchCircleSize: '90px', punchIconSize: '70px', punchHorizontalGap: '45px', punchVerticalGap: '60px', numRows: 2, punchesPerRow: 5 }
  },
  'LacePink.png': {
    title: { top: '8%', left: '0%', textAlign: 'center', color: '#EC4899', fontSize: '2.2rem', fontWeight: 'bold', width: '100%' },
    description: { top: '22%', left: '0%', textAlign: 'center', color: '#F472B6', fontSize: '1rem', width: '80%' },
    punchGrid: { top: '45%', left: '50%', transform: 'translateX(-50%)', punchCircleSize: '85px', punchIconSize: '65px', punchHorizontalGap: '40px', punchVerticalGap: '55px', numRows: 2, punchesPerRow: 5 }
  },
  'LaceRed.png': {
    title: { top: '8%', left: '0%', textAlign: 'center', color: '#DC2626', fontSize: '2.2rem', fontWeight: 'bold', width: '100%' },
    description: { top: '22%', left: '0%', textAlign: 'center', color: '#EF4444', fontSize: '1rem', width: '80%' },
    punchGrid: { top: '45%', left: '50%', transform: 'translateX(-50%)', punchCircleSize: '85px', punchIconSize: '65px', punchHorizontalGap: '40px', punchVerticalGap: '55px', numRows: 2, punchesPerRow: 5 }
  },
  'PlaidBlue.png': {
    title: { top: '10%', left: '0%', textAlign: 'center', color: '#2563EB', fontSize: '2.3rem', fontWeight: 'bold', width: '100%' },
    description: { top: '24%', left: '0%', textAlign: 'center', color: '#3B82F6', fontSize: '1.1rem', width: '80%' },
    punchGrid: { top: '45%', left: '50%', transform: 'translateX(-50%)', punchCircleSize: '88px', punchIconSize: '68px', punchHorizontalGap: '42px', punchVerticalGap: '58px', numRows: 2, punchesPerRow: 5 }
  },
  'PlaidGreen.png': {
    title: { top: '10%', left: '0%', textAlign: 'center', color: '#059669', fontSize: '2.3rem', fontWeight: 'bold', width: '100%' },
    description: { top: '24%', left: '0%', textAlign: 'center', color: '#10B981', fontSize: '1.1rem', width: '80%' },
    punchGrid: { top: '45%', left: '50%', transform: 'translateX(-50%)', punchCircleSize: '88px', punchIconSize: '68px', punchHorizontalGap: '42px', punchVerticalGap: '58px', numRows: 2, punchesPerRow: 5 }
  },
  'DigiCam.png': {
    title: { top: '12%', left: '0%', textAlign: 'center', color: '#1F2937', fontSize: '2rem', fontWeight: 'bold', width: '100%' },
    description: { top: '26%', left: '0%', textAlign: 'center', color: '#4B5563', fontSize: '1rem', width: '80%' },
    punchGrid: { top: '48%', left: '50%', transform: 'translateX(-50%)', punchCircleSize: '82px', punchIconSize: '62px', punchHorizontalGap: '38px', punchVerticalGap: '52px', numRows: 2, punchesPerRow: 5 }
  },
  'FilmCam.png': {
    title: { top: '12%', left: '0%', textAlign: 'center', color: '#92400E', fontSize: '2rem', fontWeight: 'bold', width: '100%' },
    description: { top: '26%', left: '0%', textAlign: 'center', color: '#B45309', fontSize: '1rem', width: '80%' },
    punchGrid: { top: '48%', left: '50%', transform: 'translateX(-50%)', punchCircleSize: '82px', punchIconSize: '62px', punchHorizontalGap: '38px', punchVerticalGap: '52px', numRows: 2, punchesPerRow: 5 }
  }
};

export default function CreateHabitModal({ userId, onClose }) {
  const addHabit = useHabitStore(state => state.addHabit);
  const [mode, setMode] = useState('habit'); // 'habit' or 'goal'
  const [goalText, setGoalText] = useState('');
  const [generatingHabits, setGeneratingHabits] = useState(false);
  const [suggestedHabits, setSuggestedHabits] = useState([]);
  const [rewardSuggestions, setRewardSuggestions] = useState([]);
  const [showRewardSuggestions, setShowRewardSuggestions] = useState(false);
  const [selectedCardIndex, setSelectedCardIndex] = useState(0);
  const [selectedIcon1, setSelectedIcon1] = useState(iconOptions[0]?.filename || '');
  const [selectedIcon2, setSelectedIcon2] = useState(iconOptions[1]?.filename || '');
  
  const [habit, setHabit] = useState({
    title: '',
    description: '',
    targetPunches: 10,
    reward: '',
    timeWindow: 'daily',
    punchCardImage: punchCardOptions[0]?.filename || '',
    icon1: iconOptions[0]?.filename || '',
    icon2: iconOptions[1]?.filename || ''
  });

  // Get selected punch card
  const selectedCard = punchCardOptions[selectedCardIndex] || punchCardOptions[0];
  const selectedCardLayout = defaultLayouts[selectedCard?.filename] || defaultLayouts['WindowsGreen.png'];

  // Update habit when card selection changes
  const handleCardSelect = (index) => {
    setSelectedCardIndex(index);
    setHabit({ ...habit, punchCardImage: punchCardOptions[index]?.filename || '' });
  };

  const handleTransformGoal = async () => {
    if (!goalText.trim()) return;
    setGeneratingHabits(true);
    try {
      const suggestions = await transformGoalToHabits(goalText);
      setSuggestedHabits(suggestions);
      if (suggestions.length > 0) {
        const first = suggestions[0];
        setHabit({
          ...habit,
          title: first.title,
          description: first.description || '',
          targetPunches: first.targetPunches || 10,
          timeWindow: first.frequency || 'daily'
        });
        setMode('habit');
      }
    } catch (error) {
      console.error('Error transforming goal:', error);
      alert('Error generating habits. Try entering a habit directly.');
    } finally {
      setGeneratingHabits(false);
    }
  };

  const handleGetRewardSuggestions = async () => {
    if (!habit.title.trim()) {
      alert('Please enter a habit title first');
      return;
    }
    setShowRewardSuggestions(true);
    try {
      const suggestions = await generateRewardIdeas(habit.title);
      setRewardSuggestions(suggestions);
    } catch (error) {
      console.error('Error generating rewards:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!habit.title.trim()) {
      alert('Please enter a habit title');
      return;
    }
    if (!habit.punchCardImage) {
      alert('Please select a punch card design');
      return;
    }
    try {
      // Store the layout configuration with the habit
      const habitData = {
        ...habit,
        icon1: selectedIcon1,
        icon2: selectedIcon2,
        layout: selectedCardLayout
      };
      await addHabit(userId, habitData);
      onClose();
    } catch (error) {
      alert('Error creating habit: ' + error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold">Create New Habit Card</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column: Form Inputs */}
            <div className="space-y-6">
          {/* Mode Toggle: Goal vs Habit */}
          <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
            <button
              type="button"
              onClick={() => setMode('habit')}
              className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                mode === 'habit'
                  ? 'bg-white shadow-sm text-purple-600'
                  : 'text-gray-600'
              }`}
            >
              I have a habit
            </button>
            <button
              type="button"
              onClick={() => setMode('goal')}
              className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                mode === 'goal'
                  ? 'bg-white shadow-sm text-purple-600'
                  : 'text-gray-600'
              }`}
            >
              I have a goal
            </button>
          </div>

          {/* Goal Mode */}
          {mode === 'goal' && (
            <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4">
              <label className="block text-sm font-medium mb-2">
                <Sparkles className="inline mr-2" size={16} />
                What goal do you want to achieve?
              </label>
              <textarea
                className="w-full px-4 py-3 border-2 border-purple-300 rounded-xl focus:border-purple-500 focus:outline-none h-24 resize-none mb-3"
                placeholder="e.g., I want to stop cramming for exams"
                value={goalText}
                onChange={(e) => setGoalText(e.target.value)}
              />
              <button
                type="button"
                onClick={handleTransformGoal}
                disabled={generatingHabits || !goalText.trim()}
                className="w-full py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {generatingHabits ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    AI is thinking...
                  </>
                ) : (
                  <>
                    <Wand2 size={18} />
                    Transform into habits
                  </>
                )}
              </button>
              {suggestedHabits.length > 0 && (
                <div className="mt-3 text-sm text-purple-700">
                  <p className="font-medium mb-2">Suggested habits:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {suggestedHabits.map((h, i) => (
                      <li key={i}>{h.title}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-2">What's the habit?</label>
            <input
              type="text"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
              placeholder="e.g., Study for 30 minutes"
              value={habit.title}
              onChange={(e) => setHabit({ ...habit, title: e.target.value })}
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">Description (optional)</label>
            <input
              type="text"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
              placeholder="e.g., Before breakfast"
              value={habit.description}
              onChange={(e) => setHabit({ ...habit, description: e.target.value })}
            />
          </div>

          {/* Time Window */}
          <div>
            <label className="block text-sm font-medium mb-2">How often?</label>
            <div className="grid grid-cols-3 gap-2">
              {['daily', 'weekly', 'custom'].map((window) => (
                <button
                  key={window}
                  type="button"
                  onClick={() => setHabit({ ...habit, timeWindow: window })}
                  className={`py-3 rounded-xl border-2 transition-all capitalize ${
                    habit.timeWindow === window
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {window}
                </button>
              ))}
            </div>
          </div>

          {/* Target Punches */}
          <div>
            <label className="block text-sm font-medium mb-2">
              How many punches to complete? ({habit.targetPunches})
            </label>
            <input
              type="range"
              min="5"
              max="30"
              step="1"
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
              value={habit.targetPunches}
              onChange={(e) => setHabit({ ...habit, targetPunches: parseInt(e.target.value) })}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>5 days</span>
              <span>30 days</span>
            </div>
          </div>

          {/* Reward */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium">Reward when complete</label>
              <button
                type="button"
                onClick={handleGetRewardSuggestions}
                className="text-xs text-purple-600 hover:text-purple-700 flex items-center gap-1"
              >
                <Sparkles size={12} />
                AI suggestions
              </button>
            </div>
            <input
              type="text"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
              placeholder="e.g., Treat myself to ice cream 🍦"
              value={habit.reward}
              onChange={(e) => setHabit({ ...habit, reward: e.target.value })}
            />
            {showRewardSuggestions && rewardSuggestions.length > 0 && (
              <div className="mt-2 space-y-1">
                {rewardSuggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setHabit({ ...habit, reward: suggestion });
                      setShowRewardSuggestions(false);
                    }}
                    className="w-full text-left px-3 py-2 bg-purple-50 hover:bg-purple-100 rounded-lg text-sm transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>

              {/* Icon Selection */}
          <div>
                <label className="block text-sm font-medium mb-2">Choose Icons</label>
            <div className="mb-3">
                  <p className="text-xs text-gray-600 mb-2">Icon 1:</p>
                  <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                    {iconOptions.map((icon) => (
                      <button
                        key={icon.id}
                        type="button"
                        onClick={() => {
                          setSelectedIcon1(icon.filename);
                          setHabit({ ...habit, icon1: icon.filename });
                        }}
                        className={`w-10 h-10 p-1 rounded-lg border-2 transition-all ${
                          selectedIcon1 === icon.filename
                            ? 'border-purple-500 bg-purple-50 scale-110'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <img src={icon.url} alt={icon.name} className="w-full h-full object-contain" />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-2">Icon 2:</p>
                  <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                    {iconOptions.map((icon) => (
                <button
                        key={icon.id}
                  type="button"
                        onClick={() => {
                          setSelectedIcon2(icon.filename);
                          setHabit({ ...habit, icon2: icon.filename });
                        }}
                        className={`w-10 h-10 p-1 rounded-lg border-2 transition-all ${
                          selectedIcon2 === icon.filename
                            ? 'border-purple-500 bg-purple-50 scale-110'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <img src={icon.url} alt={icon.name} className="w-full h-full object-contain" />
                </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Column: Punch Card Selection & Preview */}
            <div className="space-y-6">
              {/* Punch Card Carousel */}
              <div>
                <label className="block text-sm font-medium mb-3">Choose Punch Card Design</label>
                <div className="bg-gray-50 rounded-xl p-4">
                  <FramerCarousel 
                    punchCards={punchCardOptions}
                    activeIndex={selectedCardIndex}
                    onCardSelect={handleCardSelect}
                  />
                </div>
              </div>

              {/* Preview */}
              <div>
                <label className="block text-sm font-medium mb-3">Preview</label>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div
                    className="relative rounded-2xl shadow-xl overflow-hidden mx-auto"
                    style={{
                      width: '100%',
                      maxWidth: '400px',
                      aspectRatio: '1004/591'
                    }}
                  >
                    <PunchCardPreview
                      name={habit.title || 'Punch Pass Title'}
                      description={habit.description || 'Your description will appear here.'}
                      icon1={iconMap[selectedIcon1] || selectedIcon1}
                      icon2={iconMap[selectedIcon2] || selectedIcon2}
                      cardImage={punchCardMap[selectedCard?.filename] || punchCardMap['WindowsGreen.png']}
                      isDailyPunch={habit.timeWindow === 'daily'}
                      titlePlacement={selectedCardLayout.title}
                      descriptionPlacement={selectedCardLayout.description}
                      punchGridPlacement={selectedCardLayout.punchGrid}
                    />
                  </div>
            </div>
          </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border-2 border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
            >
              Create Habit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
