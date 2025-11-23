// src/pages/Dashboard.jsx
import { signOut } from 'firebase/auth';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, LogOut, Plus, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CardZoomModal from '../components/CardZoomModal';
import CreateHabitModal from '../components/CreateHabitModal';
import HabitCard from '../components/HabitCard';
import Layout from '../components/Layout';
import ReflectionModal from '../components/ReflectionModal';
import { auth } from '../firebase';
import { useHabitStore } from '../store/habitStore';

export default function Dashboard({ user, onLogout }) {
  const navigate = useNavigate();
  const habits = useHabitStore(state => state.habits);
  const punchHabit = useHabitStore(state => state.punchHabit);
  const undoPunch = useHabitStore(state => state.undoPunch);
  const fetchHabits = useHabitStore(state => state.fetchHabits);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showReflection, setShowReflection] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomedHabit, setZoomedHabit] = useState(null);

  useEffect(() => {
    if (user) {
      fetchHabits(user.uid);
    }
  }, [user, fetchHabits]);

  // Reset active index if it's out of bounds
  useEffect(() => {
    if (habits.length > 0 && activeIndex >= habits.length) {
      setActiveIndex(habits.length - 1);
    } else if (habits.length === 0) {
      setActiveIndex(0);
    }
  }, [habits.length, activeIndex]);

  // Sync zoomedHabit when habits update
  useEffect(() => {
    if (zoomedHabit) {
      const updatedHabit = habits.find(h => h.id === zoomedHabit.id);
      if (updatedHabit) {
        setZoomedHabit(updatedHabit);
      }
    }
  }, [habits, zoomedHabit?.id]);

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
      <div className="dashboard-container">
        {/* Header */}
        <header className="dashboard-header">
          <div className="dashboard-header-content">
            <div className="dashboard-header-left">
              <span className="dashboard-title">
                Punchie
              </span>
              
            </div>

            <div className="dashboard-header-right">
              <button
                onClick={() => setShowReflection(true)}
                className="btn-reflection"
              >
                <Sparkles size={18} />
                <span className="btn-reflection-text">Reflection</span>
              </button>
              <button
                onClick={handleLogout}
                className="btn-logout"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </header>
        
        <div className="habits-header">
          <span className="dashboard-welcome">
            Welcome, {user?.displayName?.split(' ')[0] || 'Friend'}! 
          </span>
        </div>


        {/* Stats Overview */}
        <div className="stats-container">
          <div className="stats-card">
            <h2 className="stats-title">
              Today's Overview 
            </h2>
            <div className="stats-grid">
              <div className="stat-card stat-card-pink">
                <div className="stat-number stat-number-pink">{todayHabits}</div>
                <div className="stat-label">Habits to punch today</div>
              </div>
              <div className="stat-card stat-card-purple">
                <div className="stat-number stat-number-purple">{totalPunches}</div>
                <div className="stat-label">Total punches</div>
              </div>
              <div className="stat-card stat-card-green">
                <div className="stat-number stat-number-green">{completedHabits}</div>
                <div className="stat-label">Rewards unlocked</div>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-new-habit"
        >
          <Plus size={20} />
          <span>New Habit</span>
        </button>

        {habits.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-emoji">🐰</div>
              <h3 className="empty-state-title">No habits right now</h3>
              <p className="empty-state-text">Create your first punch card to start your journey ✨</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn-create-first"
              >
                Create Your First Habit
              </button>
            </div>
          ) : (
            <div className="habits-carousel-container">
              <div className="habits-carousel-wrapper">
                {/* Left Navigation */}
                <button
                  onClick={() => setActiveIndex(Math.max(0, activeIndex - 1))}
                  disabled={activeIndex === 0}
                  className="carousel-nav-btn carousel-nav-left"
                  aria-label="Previous habit"
                >
                  <ChevronLeft size={24} />
                </button>

                {/* Carousel Cards */}
                <div className="habits-carousel">
                  {habits.map((habit, index) => {
                    const offset = index - activeIndex;
                    const scale = index === activeIndex ? 1 : 0.85;
                    const opacity = Math.abs(offset) <= 1 ? 1 - Math.abs(offset) * 0.3 : 0.3;
                    const zIndex = habits.length - Math.abs(offset);
                    // Calculate x position as percentage offset from center
                    const xPosition = `${offset * 110}%`;

                    return (
                      <motion.div
                        key={habit.id}
                        className="carousel-card"
                        style={{
                          zIndex,
                        }}
                        animate={{
                          scale,
                          opacity,
                          x: xPosition,
                        }}
                        transition={{
                          type: 'spring',
                          stiffness: 300,
                          damping: 30,
                        }}
                        onClick={() => setZoomedHabit(habit)}
                      >
                        <HabitCard
                          habit={habit}
                          onPunch={() => handlePunch(habit.id)}
                          hideControls={true}
                          size="medium"
                        />
                      </motion.div>
                    );
                  })}
                </div>

                {/* Right Navigation */}
                <button
                  onClick={() => setActiveIndex(Math.min(habits.length - 1, activeIndex + 1))}
                  disabled={activeIndex === habits.length - 1}
                  className="carousel-nav-btn carousel-nav-right"
                  aria-label="Next habit"
                >
                  <ChevronRight size={24} />
                </button>
              </div>

              {/* Carousel Indicators */}
              {habits.length > 1 && (
                <div className="carousel-indicators">
                  {habits.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveIndex(index)}
                      className={`carousel-indicator ${index === activeIndex ? 'active' : ''}`}
                      aria-label={`Go to habit ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
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

      {zoomedHabit && (
        <CardZoomModal
          habit={zoomedHabit}
          onClose={() => setZoomedHabit(null)}
          onPunch={async () => {
            await handlePunch(zoomedHabit.id);
            // Don't close immediately - let the modal handle the delay
            // The modal will stay open for 2 seconds after punching
          }}
          onUndo={async () => {
            await undoPunch(zoomedHabit.id);
            // The useEffect will automatically sync the updated habit
          }}
        />
      )}
    </Layout>
  );
}