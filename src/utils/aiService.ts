
// Free AI Service - Generates blog ideas only
export interface BlogIdea {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  estimatedReadTime: number;
}

// Mock blog ideas for free users
const mockBlogIdeas: BlogIdea[] = [
  {
    id: '1',
    title: '10 Essential Tips for Remote Work Productivity',
    description: 'Discover proven strategies to stay productive while working from home.',
    category: 'Productivity',
    tags: ['remote work', 'productivity', 'tips'],
    estimatedReadTime: 5
  },
  {
    id: '2',
    title: 'The Future of Artificial Intelligence in 2024',
    description: 'Explore the latest trends and predictions for AI technology.',
    category: 'Technology',
    tags: ['AI', 'technology', 'future'],
    estimatedReadTime: 8
  },
  {
    id: '3',
    title: 'Sustainable Living: Small Changes, Big Impact',
    description: 'Learn simple ways to make your lifestyle more environmentally friendly.',
    category: 'Lifestyle',
    tags: ['sustainability', 'environment', 'lifestyle'],
    estimatedReadTime: 6
  },
  {
    id: '4',
    title: 'Digital Marketing Strategies for Small Businesses',
    description: 'Effective marketing tactics that won\'t break the bank.',
    category: 'Business',
    tags: ['marketing', 'small business', 'digital'],
    estimatedReadTime: 7
  },
  {
    id: '5',
    title: 'Mental Health in the Digital Age',
    description: 'Understanding and managing mental wellness in our connected world.',
    category: 'Health',
    tags: ['mental health', 'digital wellness', 'self-care'],
    estimatedReadTime: 9
  }
];

export const generateBlogIdeas = async (topic: string, count: number = 3): Promise<BlogIdea[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Filter and return relevant ideas based on topic
  const filteredIdeas = mockBlogIdeas.filter(idea => 
    idea.title.toLowerCase().includes(topic.toLowerCase()) ||
    idea.description.toLowerCase().includes(topic.toLowerCase()) ||
    idea.category.toLowerCase().includes(topic.toLowerCase()) ||
    idea.tags.some(tag => tag.toLowerCase().includes(topic.toLowerCase()))
  );
  
  // If no matches, return random ideas
  const ideasToReturn = filteredIdeas.length > 0 ? filteredIdeas : mockBlogIdeas;
  
  return ideasToReturn.slice(0, count).map(idea => ({
    ...idea,
    id: `${idea.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }));
};
