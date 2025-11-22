// src/components/Dashboard.jsx
import { useState } from 'react';
import { Plus, Sparkles, Target, LogOut, Share2 } from 'lucide-react';
import { useHabitStore } from '../store/habitStore';
import HabitCard from '../components/HabitCard';
import CreateHabitModal from '../components/CreateHabitModal';
import ReflectionModal from '../components/ReflectionModal';

export default function Dashboard({ user, onLogout }) {
  const habits = useHabitStore(state => state.habits);
  const punchHabit = useHabitStore(state => state.punchHabit);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showReflection, setShowReflection] = useState(false);

  const handlePunch = async (habitId) => {
    const isComplete = await punchHabit(habitId);
    if (isComplete) {
      const habit = habits.find(h => h.id === habitId);
      setTimeout(() => {
        alert(`🎉 Reward Unlocked!\n\n${habit.reward}`);
      }, 300);
    }
  };

  // Calculate stats
  const todayHabits = habits.filter(h => h.currentPunches < h.targetPunches).length;
  const totalPunches = habits.reduce((acc, h) => acc + h.currentPunches, 0);
  const completedHabits = habits.filter(h => h.currentPunches === h.targetPunches).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                <Target className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  PunchPass
                </h1>
                <p className="text-sm text-gray-600">Welcome back, {user.displayName?.split(' ')[0]}!</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowReflection(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow hover:shadow-lg transition-all"
              >
                <Sparkles size={18} className="text-purple-600" />
                <span className="text-sm font-medium hidden sm:inline">Weekly Reflection</span>
              </button>
              <button
                onClick={onLogout}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut size={20} className="text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Target className="text-purple-600" />
              Today's Overview
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl p-4">
                <div className="text-3xl font-bold text-purple-600">{todayHabits}</div>
                <div className="text-sm text-gray-700 mt-1">Habits to punch today</div>
              </div>
              <div className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl p-4">
                <div className="text-3xl font-bold text-blue-600">{totalPunches}</div>
                <div className="text-sm text-gray-700 mt-1">Total punches this week</div>
              </div>
              <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl p-4">
                <div className="text-3xl font-bold text-green-600">{completedHabits}</div>
                <div className="text-sm text-gray-700 mt-1">Rewards unlocked 🎉</div>
              </div>
            </div>
          </div>
        </div>

        {/* Habits Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Your Punch Cards</h2>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              <Plus size={20} />
              <span className="font-medium">New Habit</span>
            </button>
          </div>

          {habits.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                <Target className="text-purple-600" size={40} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No habits yet!</h3>
              <p className="text-gray-600 mb-6">Create your first punch card to start building better habits</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
              >
                Create Your First Habit
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {habits.map(habit => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  onPunch={() => handlePunch(habit.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Info Card */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">🚀 Coming Soon: Gemini AI Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
              <h3 className="font-bold mb-2">✨ Smart Habit Suggestions</h3>
              <p className="text-white/90">Tell us your goals and get personalized habit recommendations</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
              <h3 className="font-bold mb-2">🎨 AI Theme Generator</h3>
              <p className="text-white/90">Describe your vibe and get custom color palettes</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
              <h3 className="font-bold mb-2">💬 Weekly AI Coach</h3>
              <p className="text-white/90">Get personalized feedback and habit adjustments</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
              <h3 className="font-bold mb-2">🏆 Reward Ideas</h3>
              <p className="text-white/90">AI-powered reward suggestions tailored to you</p>
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      {showCreateModal && (
        <CreateHabitModal
          userId={user.uid}
          onClose={() => setShowCreateModal(false)}
        />
      )}

      {showReflection && (
        <ReflectionModal onClose={() => setShowReflection(false)} />
      )}
    </div>
  );
}