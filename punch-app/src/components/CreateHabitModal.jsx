import { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import { useHabitStore } from '../store/habitStore';

const EMOJI_OPTIONS = ['⭐', '🌅', '⚡', '🎯', '💪', '📚', '🧘', '🎨', '🏃', '💡', '🌟', '🔥'];
const THEME_PRESETS = [
  { name: 'Purple Dream', primary: '#8B5CF6', secondary: '#EC4899', emoji: '⭐' },
  { name: 'Sunrise', primary: '#FF6B6B', secondary: '#FFE66D', emoji: '🌅' },
  { name: 'Ocean Wave', primary: '#4ECDC4', secondary: '#95E1D3', emoji: '⚡' },
  { name: 'Forest Green', primary: '#10B981', secondary: '#34D399', emoji: '🌟' },
  { name: 'Sunset Orange', primary: '#F59E0B', secondary: '#FCD34D', emoji: '🔥' },
  { name: 'Night Sky', primary: '#3B82F6', secondary: '#8B5CF6', emoji: '🌙' },
];

export default function CreateHabitModal({ userId, onClose }) {
  const addHabit = useHabitStore(state => state.addHabit);
  const [habit, setHabit] = useState({
    title: '',
    description: '',
    targetPunches: 10,
    reward: '',
    theme: THEME_PRESETS[0]
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!habit.title.trim()) {
      alert('Please enter a habit title');
      return;
    }
    try {
      await addHabit(userId, habit);
      onClose();
    } catch (error) {
      alert('Error creating habit: ' + error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Create New Habit Card</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
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
            <label className="block text-sm font-medium mb-2">Reward when complete</label>
            <input
              type="text"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
              placeholder="e.g., Treat myself to ice cream 🍦"
              value={habit.reward}
              onChange={(e) => setHabit({ ...habit, reward: e.target.value })}
            />
          </div>

          {/* Theme Presets */}
          <div>
            <label className="block text-sm font-medium mb-2">Choose a theme</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {THEME_PRESETS.map((theme, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setHabit({ ...habit, theme })}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    habit.theme.name === theme.name
                      ? 'border-purple-500 bg-purple-50 scale-105'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-1">{theme.emoji}</div>
                  <div className="text-sm font-medium">{theme.name}</div>
                  <div className="flex gap-1 mt-2">
                    <div
                      className="w-6 h-6 rounded-full"
                      style={{ backgroundColor: theme.primary }}
                    />
                    <div
                      className="w-6 h-6 rounded-full"
                      style={{ backgroundColor: theme.secondary }}
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Emoji Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Or pick an emoji</label>
            <div className="flex flex-wrap gap-2">
              {EMOJI_OPTIONS.map((emoji, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setHabit({ ...habit, theme: { ...habit.theme, emoji } })}
                  className={`text-3xl p-3 rounded-xl transition-all ${
                    habit.theme.emoji === emoji
                      ? 'bg-purple-100 scale-110'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
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