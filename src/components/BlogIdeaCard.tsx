
import React from 'react';
import {Copy, Check} from 'lucide-react';
import { useState } from 'react';

interface BlogIdeaCardProps {
  title: string;
  outline: string[];
}

const BlogIdeaCard: React.FC<BlogIdeaCardProps> = ({ title, outline }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const content = `${title}\n\nOutline:\n${outline.map(point => `• ${point}`).join('\n')}`;
    
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-4 hover:shadow-xl transition-shadow duration-300">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-bold text-purple-700 pr-4 leading-tight">
          {title}
        </h3>
        <button
          onClick={handleCopy}
          className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            copied 
              ? 'bg-green-500 text-white' 
              : 'bg-purple-500 hover:bg-purple-600 text-white'
          }`}
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-600 mb-2">Outline:</p>
        {outline.map((point, index) => (
          <div key={index} className="flex items-start gap-2">
            <span className="text-purple-500 mt-1">•</span>
            <p className="text-gray-700 text-sm leading-relaxed">{point}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogIdeaCard;
