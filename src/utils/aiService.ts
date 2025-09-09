
export interface BlogIdea {
  title: string;
  outline: string[];
}

// Simulated AI service - replace with actual AI API call
export const generateBlogIdeas = async (topic: string): Promise<BlogIdea[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock AI-generated blog ideas based on the topic
  const ideas: BlogIdea[] = [
    {
      title: `The Ultimate Beginner's Guide to ${topic}`,
      outline: [
        `What is ${topic} and why should you care?`,
        'Essential tools and resources to get started',
        'Common mistakes to avoid as a beginner'
      ]
    },
    {
      title: `10 Expert Tips for Mastering ${topic}`,
      outline: [
        'Advanced techniques from industry professionals',
        'Time-saving strategies that actually work',
        'How to measure your progress and success'
      ]
    },
    {
      title: `${topic}: Myths vs Reality - What You Need to Know`,
      outline: [
        'Debunking the most common misconceptions',
        'Evidence-based facts that might surprise you',
        'Making informed decisions in your journey'
      ]
    },
    {
      title: `Building a Sustainable ${topic} Routine That Sticks`,
      outline: [
        'Creating habits that last beyond motivation',
        'Overcoming obstacles and staying consistent',
        'Tracking progress and celebrating small wins'
      ]
    },
    {
      title: `The Future of ${topic}: Trends and Predictions`,
      outline: [
        'Emerging technologies and innovations',
        'What experts predict for the next 5 years',
        'How to prepare and stay ahead of the curve'
      ]
    },
    {
      title: `${topic} on a Budget: Maximum Results, Minimum Investment`,
      outline: [
        'Free and low-cost alternatives that work',
        'DIY solutions and creative workarounds',
        'When it\'s worth investing more money'
      ]
    },
    {
      title: `Case Study: How I Transformed My Life with ${topic}`,
      outline: [
        'My personal journey and initial struggles',
        'The breakthrough moment that changed everything',
        'Lessons learned and advice for others'
      ]
    },
    {
      title: `${topic} Mistakes That Are Costing You Time and Money`,
      outline: [
        'The most expensive errors people make',
        'Warning signs you\'re on the wrong track',
        'Quick fixes to get back on course'
      ]
    }
  ];

  // Return 5-8 random ideas
  const shuffled = ideas.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.floor(Math.random() * 4) + 5);
};
