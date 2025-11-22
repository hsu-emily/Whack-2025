import { useState } from 'react';
import { Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { useHabitStore } from '../store/habitStore';
import { generateHabitSuggestions } from '../services/geminiService';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const STRUGGLING_OPTIONS = [
  'motivation',
  'burnout',
  'time management',
  'mental health',
  'imposter syndrome',
  'exams'
];

export default function Onboarding() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addHabit } = useHabitStore();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [suggestedHabits, setSuggestedHabits] = useState([]);
  const [selectedHabits, setSelectedHabits] = useState([]);
  
  const [answers, setAnswers] = useState({
    strugglingWith: '',
    numClasses: '',
    goals: '',
    additionalContext: ''
  });

  const handleAnswer = (field, value) => {
    setAnswers({ ...answers, [field]: value });
  };

  const handleNext = async () => {
    if (step === 4) {
      // Generate habits with Gemini
      setLoading(true);
      try {
        const suggestions = await generateHabitSuggestions(answers);
        setSuggestedHabits(suggestions);
        setStep(5);
      } catch (error) {
        console.error('Error generating habits:', error);
        alert('Error generating suggestions. You can still create habits manually!');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    } else {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const toggleHabitSelection = (index) => {
    setSelectedHabits(prev => 
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const handleCompleteOnboarding = async () => {
    setLoading(true);
    try {
      // Add all selected habits
      for (const index of selectedHabits) {
        const habit = suggestedHabits[index];
        await addHabit(user.uid, {
          title: habit.title,
          description: habit.description || '',
          targetPunches: habit.targetPunches || 10,
          reward: habit.reward || 'Great job!',
          timeWindow: habit.frequency || 'daily',
          theme: {
            name: 'Default',
            primary: '#8B5CF6',
            secondary: '#EC4899',
            emoji: '⭐'
          }
        });
      }
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating habits:', error);
      alert('Error creating habits. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Step {step} of 5</span>
            <span>{Math.round((step / 5) * 100)}%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Struggling With */}
        {step === 1 && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="text-purple-600" size={32} />
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                What are you struggling with right now?
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {STRUGGLING_OPTIONS.map(option => (
                <button
                  key={option}
                  onClick={() => handleAnswer('strugglingWith', option)}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    answers.strugglingWith === option
                      ? 'border-purple-500 bg-purple-50 scale-105'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="font-medium capitalize">{option}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Number of Classes */}
        {step === 2 && (
          <div>
            <h2 className="text-3xl font-bold mb-6">How many classes are you juggling?</h2>
            <div className="grid grid-cols-4 gap-3">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                <button
                  key={num}
                  onClick={() => handleAnswer('numClasses', num.toString())}
                  className={`p-6 rounded-xl border-2 transition-all text-2xl font-bold ${
                    answers.numClasses === num.toString()
                      ? 'border-purple-500 bg-purple-50 scale-105'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Goals */}
        {step === 3 && (
          <div>
            <h2 className="text-3xl font-bold mb-6">What are your big goals this month?</h2>
            <textarea
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none h-32 resize-none transition-colors"
              placeholder="e.g., Finish all assignments on time, maintain a healthy sleep schedule, exercise 3x per week..."
              value={answers.goals}
              onChange={(e) => handleAnswer('goals', e.target.value)}
            />
          </div>
        )}

        {/* Step 4: Additional Context */}
        {step === 4 && (
          <div>
            <h2 className="text-3xl font-bold mb-6">Anything else we should know?</h2>
            <textarea
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none h-32 resize-none transition-colors"
              placeholder="Optional: Share any challenges, preferences, or context that might help us suggest better habits..."
              value={answers.additionalContext}
              onChange={(e) => handleAnswer('additionalContext', e.target.value)}
            />
            <p className="text-sm text-gray-500 mt-2">
              This helps our AI generate more personalized suggestions for you.
            </p>
          </div>
        )}

        {/* Step 5: Suggested Habits */}
        {step === 5 && (
          <div>
            <h2 className="text-3xl font-bold mb-6">✨ Your Personalized Habit Suggestions</h2>
            <p className="text-gray-600 mb-6">
              Based on your answers, here are some habits we think would help you. Select the ones you want to start with:
            </p>
            
            {suggestedHabits.length === 0 ? (
              <div className="text-center py-8">
                <Loader2 className="animate-spin mx-auto mb-4 text-purple-600" size={32} />
                <p className="text-gray-600">Generating suggestions...</p>
              </div>
            ) : (
              <div className="space-y-4 mb-6">
                {suggestedHabits.map((habit, index) => (
                  <button
                    key={index}
                    onClick={() => toggleHabitSelection(index)}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                      selectedHabits.includes(index)
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg mb-1">{habit.title}</h3>
                        {habit.description && (
                          <p className="text-sm text-gray-600 mb-2">{habit.description}</p>
                        )}
                        <div className="flex gap-4 text-xs text-gray-500">
                          <span>Frequency: {habit.frequency || 'daily'}</span>
                          <span>Punches: {habit.targetPunches || 10}</span>
                          <span>Reward: {habit.reward || 'Great job!'}</span>
                        </div>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedHabits.includes(index)
                          ? 'border-purple-500 bg-purple-500'
                          : 'border-gray-300'
                      }`}>
                        {selectedHabits.includes(index) && (
                          <span className="text-white text-xs">✓</span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {selectedHabits.length === 0 && suggestedHabits.length > 0 && (
              <p className="text-sm text-orange-600 mb-4">
                Select at least one habit to continue, or skip to create your own.
              </p>
            )}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-3 mt-8">
          {step > 1 && step < 5 && (
            <button
              onClick={handleBack}
              className="flex-1 py-3 border-2 border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
          )}
          {step < 4 && (
            <button
              onClick={handleNext}
              disabled={!answers.strugglingWith || (step === 2 && !answers.numClasses) || (step === 3 && !answers.goals)}
              className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              Next
              <ArrowRight size={20} />
            </button>
          )}
          {step === 4 && (
            <button
              onClick={handleNext}
              disabled={loading}
              className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Generating...
                </>
              ) : (
                <>
                  Get Suggestions
                  <Sparkles size={20} />
                </>
              )}
            </button>
          )}
          {step === 5 && (
            <>
              <button
                onClick={() => navigate('/dashboard')}
                className="flex-1 py-3 border-2 border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                Skip for Now
              </button>
              <button
                onClick={handleCompleteOnboarding}
                disabled={loading || selectedHabits.length === 0}
                className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Creating...
                  </>
                ) : (
                  <>
                    Create {selectedHabits.length} Habit{selectedHabits.length !== 1 ? 's' : ''}
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

