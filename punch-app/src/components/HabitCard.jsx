import { Share2, RotateCcw, Trash2, Download } from 'lucide-react';
import { useHabitStore } from '../store/habitStore';
import { motion } from 'framer-motion';
import { useState, useRef } from 'react';
import { generateShareableCard, downloadCard, shareCard } from '../utils/shareCard';

export default function HabitCard({ habit, onPunch }) {
  const { resetHabit, deleteHabit } = useHabitStore();
  const cardRef = useRef(null);
  const [sharing, setSharing] = useState(false);
  const progress = (habit.currentPunches / habit.targetPunches) * 100;
  const isComplete = habit.currentPunches >= habit.targetPunches;

  const handleReset = () => {
    if (confirm('Reset this habit card? This will clear all punches.')) {
      resetHabit(habit.id);
    }
  };

  const handleDelete = () => {
    if (confirm('Delete this habit permanently?')) {
      deleteHabit(habit.id);
    }
  };

  const handleShare = async () => {
    if (!cardRef.current) return;
    
    setSharing(true);
    try {
      const blob = await generateShareableCard(cardRef.current, habit);
      if (blob) {
        shareCard(blob, habit);
      }
    } catch (error) {
      console.error('Error sharing card:', error);
      alert('Error generating shareable card. Please try again.');
    } finally {
      setSharing(false);
    }
  };

  const handleDownload = async () => {
    if (!cardRef.current) return;
    
    setSharing(true);
    try {
      const blob = await generateShareableCard(cardRef.current, habit);
      if (blob) {
        downloadCard(blob, habit.title);
      }
    } catch (error) {
      console.error('Error downloading card:', error);
      alert('Error generating card. Please try again.');
    } finally {
      setSharing(false);
    }
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all hover:shadow-2xl"
      style={{ borderTop: `4px solid ${habit.theme?.primary || '#8B5CF6'}` }}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="text-3xl mb-2">{habit.theme?.emoji || '⭐'}</div>
            <h3 className="text-xl font-bold text-gray-800 mb-1">{habit.title}</h3>
            {habit.description && (
              <p className="text-sm text-gray-600">{habit.description}</p>
            )}
          </div>
          <div className="flex gap-1">
            <button
              onClick={handleShare}
              disabled={sharing}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              title="Share"
            >
              <Share2 size={16} className="text-gray-600" />
            </button>
            <button
              onClick={handleDownload}
              disabled={sharing}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              title="Download"
            >
              <Download size={16} className="text-gray-600" />
            </button>
            <button
              onClick={handleReset}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Reset"
            >
              <RotateCcw size={16} className="text-gray-600" />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Delete"
            >
              <Trash2 size={16} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              {habit.currentPunches} / {habit.targetPunches} punches
            </span>
            <span 
              className="text-sm font-bold"
              style={{ color: habit.theme?.primary || '#8B5CF6' }}
            >
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="h-full rounded-full"
              style={{
                background: `linear-gradient(to right, ${habit.theme?.primary || '#8B5CF6'}, ${habit.theme?.secondary || '#EC4899'})`
              }}
            />
          </div>
        </div>

        {/* Punch Grid */}
        <div className="grid grid-cols-5 gap-2 mb-4">
          {Array.from({ length: habit.targetPunches }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: i < habit.currentPunches ? 0.95 : 1 }}
              className={`aspect-square rounded-lg border-2 flex items-center justify-center text-xl transition-all ${
                i < habit.currentPunches
                  ? 'border-transparent'
                  : 'border-dashed border-gray-300'
              }`}
              style={{
                backgroundColor: i < habit.currentPunches ? habit.theme?.primary : 'transparent',
                color: i < habit.currentPunches ? 'white' : habit.theme?.primary || '#8B5CF6'
              }}
            >
              {i < habit.currentPunches ? '✓' : '○'}
            </motion.div>
          ))}
        </div>

        {/* Action Button */}
        {!isComplete ? (
          <button
            onClick={onPunch}
            className="w-full py-3 rounded-xl font-bold text-white transition-all hover:scale-105 active:scale-95 shadow-md"
            style={{
              background: `linear-gradient(to right, ${habit.theme?.primary || '#8B5CF6'}, ${habit.theme?.secondary || '#EC4899'})`
            }}
          >
            Punch Today! 👊
          </button>
        ) : (
          <div className="w-full py-3 rounded-xl font-bold text-center bg-gradient-to-r from-green-500 to-emerald-500 text-white">
            🎉 Reward: {habit.reward || 'Completed!'}
          </div>
        )}

        {/* Timestamp */}
        {habit.lastPunchedAt && (
          <p className="text-xs text-gray-500 mt-2 text-center">
            Last punched: {new Date(habit.lastPunchedAt).toLocaleDateString()}
          </p>
        )}
      </div>
    </motion.div>
  );
}