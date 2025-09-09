
import React, { useState } from 'react';
import {Trash2, Lightbulb} from 'lucide-react';
import BlogIdeaCard from './components/BlogIdeaCard.tsx';
import LoadingSpinner from './components/LoadingSpinner.tsx';
import { generateBlogIdeas, BlogIdea } from './utils/aiService.ts';

function App() {
  const [topic, setTopic] = useState('');
  const [blogIdeas, setBlogIdeas] = useState<BlogIdea[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  const handleGenerateIdeas = async () => {
    if (!topic.trim()) return;
    
    setLoading(true);
    try {
      const ideas = await generateBlogIdeas(topic.trim());
      setBlogIdeas(ideas);
      setHasGenerated(true);
    } catch (error) {
      console.error('Error generating ideas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearResults = () => {
    setBlogIdeas([]);
    setTopic('');
    setHasGenerated(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading && topic.trim()) {
      handleGenerateIdeas();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-100 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <img 
              src="https://i.imgur.com/YourImageID.png" 
              alt="TekmBlogGenie Logo" 
              className="w-12 h-12 md:w-16 md:h-16 rounded-full shadow-lg"
            />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
              TekmBlogGenie
            </h1>
          </div>
          <p className="text-xl text-gray-600 font-medium">AI Blog Idea Generator</p>
          <p className="text-gray-500 mt-2">Transform any topic into engaging blog post ideas</p>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-2">
                Enter your topic or niche
              </label>
              <input
                id="topic"
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="e.g., organic gardening, digital marketing, fitness..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200 text-lg"
                disabled={loading}
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleGenerateIdeas}
                disabled={!topic.trim() || loading}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
              >
                <Lightbulb size={20} />
                Generate Ideas
              </button>
              
              {hasGenerated && (
                <button
                  onClick={handleClearResults}
                  className="bg-gray-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-600 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <Trash2 size={18} />
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center mb-8">
            <LoadingSpinner />
          </div>
        )}

        {/* Results */}
        {blogIdeas.length > 0 && !loading && (
          <div className="space-y-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
              Generated Blog Ideas for "{topic}"
            </h2>
            <div className="grid gap-6">
              {blogIdeas.map((idea, index) => (
                <BlogIdeaCard key={index} title={idea.title} outline={idea.outline} />
              ))}
            </div>
          </div>
        )}

        {/* AdSense Ad */}
        {hasGenerated && (
          <div className="flex justify-center mb-8">
            <div className="w-80 h-64 flex items-center justify-center bg-gray-50">
              <ins className="adsbygoogle"
                style={{ display: "block", width: 300, height: 250 }}
                data-ad-client="ca-pub-XXXXXX"
                data-ad-slot="YYYYYY"></ins>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="text-center mt-12">
          <p className="text-gray-500 text-sm">Built with Lumi</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
