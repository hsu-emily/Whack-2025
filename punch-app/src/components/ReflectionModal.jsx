import { useState } from 'react';
import { X, Sparkles } from 'lucide-react';

export default function ReflectionModal({ onClose }) {
  const [reflection, setReflection] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Reflection saved! AI analysis coming soon.');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Weekly Reflection 🌟</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              How did this week feel?
            </label>
            <textarea
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none h-32 resize-none transition-colors"
              placeholder="Share what went well, what was challenging..."
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              required
            />
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
            <div className="flex items-start gap-2">
              <Sparkles className="text-purple-600 mt-1" size={20} />
              <div>
                <p className="font-medium text-purple-900">AI Coach Coming Soon</p>
                <p className="text-sm text-purple-700 mt-1">
                  Gemini AI will analyze your reflection and provide personalized suggestions.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border-2 border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
            >
              Save Reflection
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
