import { useState } from 'react';
import { X, Sparkles, Loader2, Heart } from 'lucide-react';
import { useHabitStore } from '../store/habitStore';
import { analyzeReflection } from '../services/geminiService';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

export default function ReflectionModal({ onClose, user }) {
  const habits = useHabitStore(state => state.habits);
  const [reflection, setReflection] = useState('');
  const [loading, setLoading] = useState(false);
  const [coachFeedback, setCoachFeedback] = useState(null);
  const [step, setStep] = useState('input'); // 'input' or 'feedback'
  const [journalId, setJournalId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reflection.trim()) return;

    setLoading(true);
    try {
      // First, save the reflection as a journal entry
      let docRef = null;
      if (user) {
        docRef = await addDoc(collection(db, 'reflections'), {
          userId: user.uid,
          text: reflection,
          habits: habits.map(h => ({
            id: h.id,
            title: h.title,
            currentPunches: h.currentPunches,
            targetPunches: h.targetPunches
          })),
          createdAt: new Date().toISOString()
        });
        setJournalId(docRef.id);
      }

      // Then get AI feedback
      const feedback = await analyzeReflection(reflection, habits, {});
      if (feedback) {
        setCoachFeedback(feedback);
        setStep('feedback');
        
        // Update the journal entry with AI feedback if we have a docRef
        if (docRef && user) {
          await updateDoc(doc(db, 'reflections', docRef.id), {
            aiFeedback: feedback
          });
        }
      } else {
        alert('Reflection saved! AI analysis unavailable at the moment.');
        onClose();
      }
    } catch (error) {
      console.error('Error saving reflection:', error);
      alert('Error saving reflection. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* HEADER */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4 flex items-center justify-center rounded-t-2xl relative z-10">
          <h2 className="text-2xl font-bold text-white text-center">
            Weekly Reflection
          </h2>
          <button
            onClick={onClose}
            className="absolute right-4 p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
          >
            <X size={22} />
          </button>
        </div>

        {step === 'input' ? (
          <form
            onSubmit={handleSubmit}
            className="p-6 md:p-8 space-y-6 flex flex-col items-center"
          >
            {/* Reflection input */}
            <div className="max-w-2xl w-full mx-auto space-y-3">
              <label className="block text-sm font-semibold text-gray-800 text-center">
                How did this week feel?
              </label>
              <textarea
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none h-32 resize-none transition-colors"
                placeholder="Share what went well, what was challenging, which habits felt easy or hard..."
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            {/* AI Coach blurb */}
            <div className="max-w-2xl w-full mx-auto bg-purple-50 border border-purple-200 rounded-xl p-4">
              <div className="flex flex-col items-center text-center gap-2">
                <Sparkles className="text-purple-600" size={20} />
                <div>
                  <p className="font-medium text-purple-900">AI Coach</p>
                  <p className="text-sm text-purple-700 mt-1">
                    Our AI will analyze your reflection and provide personalized
                    suggestions to help you improve.
                  </p>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="max-w-2xl w-full mx-auto flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 border-2 border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Analyzing...
                  </>
                ) : (
                  <>
                    Get AI Feedback
                    <Sparkles size={20} />
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="p-6 md:p-8 space-y-6 flex flex-col items-center">
            <div className="max-w-2xl w-full mx-auto space-y-6">
              {/* AI Coach Message */}
              {coachFeedback?.message && (
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-6">
                  <div className="flex flex-col items-center text-center gap-3">
                    <Heart className="text-purple-600 flex-shrink-0" size={24} />
                    <div>
                      <h3 className="font-bold text-purple-900 mb-2">
                        Your AI Coach
                      </h3>
                      <p className="text-gray-800 leading-relaxed">
                        {coachFeedback.message}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Suggestions */}
              {coachFeedback?.suggestions && coachFeedback.suggestions.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-bold text-gray-800 mb-1 flex items-center justify-center gap-2 text-center">
                    <Sparkles className="text-purple-600" size={20} />
                    <span>Personalized Suggestions</span>
                  </h3>
                  <div className="space-y-2">
                    {coachFeedback.suggestions.map((suggestion, idx) => (
                      <div
                        key={idx}
                        className="bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-purple-300 transition-colors"
                      >
                        <div className="flex items-start gap-3 justify-center">
                          <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-purple-600 font-bold text-sm">
                              {idx + 1}
                            </span>
                          </div>
                          <div>
                            <p className="text-gray-800 text-left">
                              {suggestion}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom buttons */}
            <div className="max-w-2xl w-full mx-auto flex gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  setStep('input');
                  setCoachFeedback(null);
                  setReflection('');
                }}
                className="flex-1 py-3 border-2 border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                New Reflection
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}