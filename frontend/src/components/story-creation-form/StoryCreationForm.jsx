// src/components/story-creation-form/StoryCreationForm.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  FaMagic, 
  FaPalette, 
  FaChevronLeft,
  FaRocket,
  FaHeart,
  FaTree,
  FaStar,
  FaMoon,
  FaCrown,
  FaDragon,
  FaGem
} from "react-icons/fa";
import "./StoryCreationForm.css";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Mock story generation for development
const generateMockStory = (storyData) => {
  const themes = {
    space: "🚀 Space Adventure",
    underwater: "🌊 Underwater Quest", 
    jungle: "🌴 Jungle Explorer",
    fairy: "✨ Fairy Tale Magic",
    dragon: "🐉 Dragon Friend",
    unicorn: "🦄 Unicorn Dreams"
  };

  const pages = [];
  for (let i = 0; i < storyData.pageCount; i++) {
    pages.push({
      id: i + 1,
      text: `Once upon a time, ${storyData.characterName} embarked on a magical ${themes[storyData.theme]} adventure. This brave little explorer discovered wonderful things in this enchanted world full of wonder and excitement.`,
      image: `https://images.unsplash.com/photo-1519791883288-dc8bd696e667?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NjZ8MHwxfHNlYXJjaHwxfHxzdG9yeWJvb2t8ZW58MHx8fHwxNzU0NTQyOTMzfDA&ixlib=rb-4.1.0&q=85&w=400&h=300`
    });
  }

  return {
    id: Date.now().toString(),
    title: `${storyData.characterName} and the ${themes[storyData.theme]}`,
    coverImage: "https://images.unsplash.com/photo-1533561304446-88a43deb6229?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHwxfHxjaGlsZHJlbiUyMGJvb2t8ZW58MHx8fHwxNzU0NTQyOTM4fDA&ixlib=rb-4.1.0&q=85&w=600&h=400",
    pages: pages,
    createdAt: new Date().toISOString()
  };
};

const StoryCreationForm = ({ onStoryGenerated }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    age: 5,
    theme: 'fairy',
    characterName: '',
    characterTraits: '',
    pageCount: 5,
    moralLesson: '',
    openaiApiKey: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const themes = [
    { id: 'space', name: 'Space Adventure', icon: <FaRocket />, emoji: '🚀' },
    { id: 'underwater', name: 'Underwater Quest', icon: <FaHeart />, emoji: '🌊' },
    { id: 'jungle', name: 'Jungle Explorer', icon: <FaTree />, emoji: '🌴' },
    { id: 'fairy', name: 'Fairy Tale Magic', icon: <FaStar />, emoji: '✨' },
    { id: 'dragon', name: 'Dragon Friend', icon: <FaDragon />, emoji: '🐉' },
    { id: 'unicorn', name: 'Unicorn Dreams', icon: <FaGem />, emoji: '🦄' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.characterName.trim()) {
      alert('Please enter a character name!');
      return;
    }

    setIsGenerating(true);

    try {
      // Try API call first, fall back to mock if it fails
      let story;
      try {
        const response = await fetch(`${API}/generate-story`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            age: formData.age,
            theme: formData.theme,
            character_name: formData.characterName,
            character_traits: formData.characterTraits,
            page_count: formData.pageCount,
            moral_lesson: formData.moralLesson,
            openai_api_key: formData.openaiApiKey
          })
        });
        
        if (response.ok) {
          const result = await response.json();
          story = result.story;
        } else {
          throw new Error('API not available');
        }
      } catch (error) {
        console.log('Using mock story generation');
        story = generateMockStory(formData);
      }

      onStoryGenerated(story);
      navigate('/reader');
    } catch (error) {
      console.error('Error generating story:', error);
      alert('Failed to generate story. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  if (isGenerating) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="story-creation-form generating"
      >
        <div className="generating-content">
          <div className="loading-spinner"></div>
          <h2>Creating Your Magical Story...</h2>
          <p>Our AI is crafting a personalized adventure for {formData.characterName}</p>
          
          <div className="loading-animation">
            {['🌟', '🎨', '📖', '✨'].map((emoji, index) => (
              <motion.div
                key={index}
                animate={{ 
                  y: [0, -20, 0],
                  opacity: [0.3, 1, 0.3]
                }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity,
                  delay: index * 0.2 
                }}
                className="loading-emoji"
              >
                {emoji}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="story-creation-form"
    >
      <div className="form-container">
        {/* Header */}
        <div className="form-header">
          <button
            onClick={() => navigate('/')}
            className="back-button"
          >
            <FaChevronLeft size={24} />
          </button>
          <h1 className="form-title">Create Your Story</h1>
        </div>

        <form onSubmit={handleSubmit} className="creation-form">
          {/* Age Selector */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="form-section"
          >
            <h3 className="section-title">
              <span className="section-emoji">👶</span>
              Child's Age
            </h3>
            <div className="age-selector">
              {[1,2,3,4,5,6,7,8,9,10,11,12].map((age) => (
                <button
                  key={age}
                  type="button"
                  onClick={() => setFormData({...formData, age})}
                  className={`age-button ${formData.age === age ? 'active' : ''}`}
                >
                  {age}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Theme Selection */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="form-section"
          >
            <h3 className="section-title">
              <FaPalette />
              Story Theme
            </h3>
            <div className="theme-grid">
              {themes.map((theme) => (
                <motion.button
                  key={theme.id}
                  type="button"
                  onClick={() => setFormData({...formData, theme: theme.id})}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className={`theme-button ${formData.theme === theme.id ? 'active' : ''}`}
                >
                  <div className="theme-emoji">{theme.emoji}</div>
                  <div className="theme-name">{theme.name}</div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Character Details */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="form-section"
          >
            <h3 className="section-title">
              <span className="section-emoji">👦</span>
              Character Details
            </h3>
            <div className="character-inputs">
              <div className="input-group">
                <label className="input-label">Character Name *</label>
                <input
                  type="text"
                  value={formData.characterName}
                  onChange={(e) => setFormData({...formData, characterName: e.target.value})}
                  className="text-input"
                  placeholder="Enter your child's name or character name"
                  required
                />
              </div>
              
              <div className="input-group">
                <label className="input-label">Character Traits (Optional)</label>
                <input
                  type="text"
                  value={formData.characterTraits}
                  onChange={(e) => setFormData({...formData, characterTraits: e.target.value})}
                  className="text-input"
                  placeholder="brave, kind, curious, funny..."
                />
              </div>
            </div>
          </motion.div>

          {/* Story Settings */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="form-section"
          >
            <h3 className="section-title">
              <span className="section-emoji">📚</span>
              Story Settings
            </h3>
            <div className="settings-grid">
              <div className="input-group">
                <label className="input-label">Number of Pages</label>
                <select
                  value={formData.pageCount}
                  onChange={(e) => setFormData({...formData, pageCount: parseInt(e.target.value)})}
                  className="select-input"
                >
                  <option value={3}>3 pages</option>
                  <option value={5}>5 pages</option>
                  <option value={8}>8 pages</option>
                  <option value={10}>10 pages</option>
                </select>
              </div>
              
              <div className="input-group">
                <label className="input-label">Moral Lesson (Optional)</label>
                <input
                  type="text"
                  value={formData.moralLesson}
                  onChange={(e) => setFormData({...formData, moralLesson: e.target.value})}
                  className="text-input"
                  placeholder="sharing, friendship, courage..."
                />
              </div>
            </div>
          </motion.div>

          {/* OpenAI API Key (Optional) */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="form-section"
          >
            <h3 className="section-title">
              <span className="section-emoji">🔑</span>
              OpenAI API Key (Optional)
            </h3>
            <div className="input-group">
              <input
                type="password"
                value={formData.openaiApiKey}
                onChange={(e) => setFormData({...formData, openaiApiKey: e.target.value})}
                className="text-input"
                placeholder="sk-... (for AI-generated stories)"
              />
              <small className="input-help">
                Provide your OpenAI API key for AI-generated stories. Otherwise, we'll create a sample story.
              </small>
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.button
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 20px 40px rgba(147, 51, 234, 0.3)"
            }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="submit-button"
            disabled={!formData.characterName.trim()}
          >
            <FaMagic className="button-icon" />
            Create My Story
          </motion.button>
          </form>
      </div>
    </motion.div>
  );
};

export default StoryCreationForm;