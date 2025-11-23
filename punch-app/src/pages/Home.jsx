import React from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import NavBar from "../components/NavBar";
import { Sparkles, Target, Calendar, Heart } from "lucide-react";

const Home = () => {
  return (
    <Layout>
      <NavBar />
      <div className="page-content">
        <h1 className="page-heading">
          Turn Your Goals Into Fun Daily Habits
        </h1>
        
        <p className="page-text" style={{ marginBottom: '2rem' }}>
          Welcome to <span style={{ fontWeight: 'bold', color: '#EC4899' }}>Punchie Pass</span> — 
          the habit tracker that makes building better routines feel like collecting rewards at 
          your favorite coffee shop. ☕✨
        </p>

        <div style={{ maxWidth: '48rem', margin: '3rem auto', display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
          {/* Feature 1 */}
          <div style={{ 
            background: 'linear-gradient(to bottom right, #fce7f3, #fff)', 
            padding: '2rem', 
            borderRadius: '1.5rem',
            border: '2px solid #FBCFE8'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <Target size={32} style={{ color: '#EC4899' }} />
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#DB2777', margin: 0 }}>
                Visual Punch Cards
              </h3>
            </div>
            <p style={{ color: '#4B5563', lineHeight: '1.6', margin: 0 }}>
              Each habit gets its own beautiful punch card. Complete a task? Punch it! 
              Watch your progress fill up like a vintage loyalty card — but way cuter.
            </p>
          </div>

          {/* Feature 2 */}
          <div style={{ 
            background: 'linear-gradient(to bottom right, #f3e8ff, #fff)', 
            padding: '2rem', 
            borderRadius: '1.5rem',
            border: '2px solid #E9D5FF'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <Sparkles size={32} style={{ color: '#9333EA' }} />
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#7C3AED', margin: 0 }}>
                AI-Powered Coaching
              </h3>
            </div>
            <p style={{ color: '#4B5563', lineHeight: '1.6', margin: 0 }}>
              Reflect weekly and get personalized feedback from your AI coach. 
              Get encouragement, suggestions, and keep all your reflections in a private journal.
            </p>
          </div>

          {/* Feature 3 */}
          <div style={{ 
            background: 'linear-gradient(to bottom right, #d1fae5, #fff)', 
            padding: '2rem', 
            borderRadius: '1.5rem',
            border: '2px solid #A7F3D0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <Heart size={32} style={{ color: '#10B981' }} />
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10B981', margin: 0 }}>
                Rewards You Actually Want
              </h3>
            </div>
            <p style={{ color: '#4B5563', lineHeight: '1.6', margin: 0 }}>
              Set rewards that motivate YOU — whether it's a treat, a break, or finally buying 
              that thing you've been eyeing. Complete your card, unlock your reward!
            </p>
          </div>
        </div>

        <div style={{ marginTop: '3rem' }}>
          <Link 
            to="/signup"
            style={{
              display: 'inline-block',
              padding: '1rem 2.5rem',
              background: 'linear-gradient(to right, #9333EA, #EC4899)',
              color: 'white',
              borderRadius: '9999px',
              fontWeight: '600',
              fontSize: '1.125rem',
              textDecoration: 'none',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
            }}
          >
            Start Building Habits ✨
          </Link>
        </div>

        <p style={{ 
          marginTop: '2rem', 
          fontSize: '0.875rem', 
          color: '#6B7280' 
        }}>
          Already have an account? <Link to="/login" style={{ color: '#EC4899', fontWeight: '500' }}>Log in</Link>
        </p>
      </div>
    </Layout>
  );
};

export default Home;