// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { Plus, Sparkles, Target, LogOut } from 'lucide-react';
import { useHabitStore } from '../store/habitStore';
import HabitCard from '../components/HabitCard';
import CreateHabitModal from '../components/CreateHabitModal';
import ReflectionModal from '../components/ReflectionModal';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';

export default function Dashboard({ user, onLogout }) {
  const navigate = useNavigate();
  const habits = useHabitStore(state => state.habits);
  const punchHabit = useHabitStore(state => state.punchHabit);
  const fetchHabits = useHabitStore(state => state.fetchHabits);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showReflection, setShowReflection] = useState(false);

  useEffect(() => {
    if (user) {
      fetchHabits(user.uid);
    }
  }, [user, fetchHabits]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

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
    <Layout>
      <div className="w-full max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <header className="bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-gray-200 px-8 py-4 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-2xl font-bold text-pink-500" style={{ fontFamily: 'Press Start 2P' }}>
                Punchie
              </span>
              <span className="text-sm text-gray-600 hidden sm:inline">
                Welcome, {user?.displayName?.split(' ')[0] || 'Friend'}! 🐰
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowReflection(true)}
                className="flex items-center gap-2 px-4 py-2 bg-pink-100 hover:bg-pink-200 rounded-full transition-all text-pink-600"
              >
                <Sparkles size={18} />
                <span className="text-sm font-medium hidden sm:inline">Reflection</span>
              </button>
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-pink-100 rounded-full transition-colors text-pink-600"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </header>

        {/* Stats Overview */}
        <div className="mb-8">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg p-6 border-2 border-pink-200">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-pink-600">
              <Target size={24} />
              Today's Overview ✨
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-pink-100 to-pink-50 rounded-2xl p-4 border border-pink-200">
                <div className="text-4xl font-bold text-pink-500">{todayHabits}</div>
                <div className="text-sm text-gray-700 mt-1">Habits to punch today 🎯</div>
              </div>
              <div className="bg-gradient-to-br from-purple-100 to-purple-50 rounded-2xl p-4 border border-purple-200">
                <div className="text-4xl font-bold text-purple-500">{totalPunches}</div>
                <div className="text-sm text-gray-700 mt-1">Total punches 💪</div>
              </div>
              <div className="bg-gradient-to-br from-green-100 to-green-50 rounded-2xl p-4 border border-green-200">
                <div className="text-4xl font-bold text-green-500">{completedHabits}</div>
                <div className="text-sm text-gray-700 mt-1">Rewards unlocked 🎉</div>
              </div>
            </div>
          </div>
        </div>

        {/* Habits Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-pink-600" style={{ fontFamily: 'Press Start 2P' }}>
              Your Punch Cards 📇
            </h2>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-400 to-pink-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
              style={{ fontFamily: 'Press Start 2P', fontSize: '0.75rem' }}
            >
              <Plus size={20} />
              <span>New Habit</span>
            </button>
          </div>

          {habits.length === 0 ? (
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg p-12 text-center border-2 border-pink-200">
              <div className="text-6xl mb-4">🐰</div>
              <h3 className="text-xl font-bold text-pink-600 mb-2">No habits yet!</h3>
              <p className="text-gray-600 mb-6">Create your first punch card to start your journey ✨</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-8 py-3 bg-gradient-to-r from-pink-400 to-pink-500 text-white rounded-full font-medium hover:shadow-lg transition-all"
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
      </div>

      {/* Modals */}
      {showCreateModal && user && (
        <CreateHabitModal
          userId={user.uid}
          onClose={() => setShowCreateModal(false)}
        />
      )}

      {showReflection && (
        <ReflectionModal onClose={() => setShowReflection(false)} />
      )}
    </Layout>
  );
}