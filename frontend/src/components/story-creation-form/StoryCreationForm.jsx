// src/components/story-creation-form/StoryCreationForm.jsx
import React, { useState, useEffect } from "react";
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
  FaGem,
  FaGlobe,
  FaBrush
} from "react-icons/fa";
import { saveFormData, getInitialFormData } from "../../utils/sessionStorage";
import "./StoryCreationForm.css";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/storybook`;

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

const StoryCreationForm = ({ onStoryGenerated, preserveForms, onFormsLoaded }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(getInitialFormData()); // Load saved data
  const [isGenerating, setIsGenerating] = useState(false);

  // Handle form loading signal
  useEffect(() => {
    if (preserveForms && onFormsLoaded) {
      onFormsLoaded();
    }
  }, [preserveForms, onFormsLoaded]);

  // Save form data whenever it changes (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveFormData(formData);
    }, 1000); // Save after 1 second of no changes

    return () => clearTimeout(timeoutId);
  }, [formData]);

  // Clear session storage when page is unloaded (browser closed/refreshed)
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Clear the session storage when user closes browser/tab
      sessionStorage.removeItem('storybook_form_data');
    };

    // Add event listener for page unload
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const themes = [
    { id: 'space', name: 'Space Adventure', icon: <FaRocket />, emoji: '🚀' },
    { id: 'underwater', name: 'Underwater Quest', icon: <FaHeart />, emoji: '🌊' },
    { id: 'jungle', name: 'Jungle Explorer', icon: <FaTree />, emoji: '🌴' },
    { id: 'fairy', name: 'Fairy Tale Magic', icon: <FaStar />, emoji: '✨' },
    { id: 'dragon', name: 'Dragon Friend', icon: <FaDragon />, emoji: '🐉' },
    { id: 'unicorn', name: 'Unicorn Dreams', icon: <FaGem />, emoji: '🦄' }
  ];

  // NEW: Language options
  const languages = [
    { code: 'English', name: 'English', flag: '🇺🇸' },
    { code: 'Spanish', name: 'Español', flag: '🇪🇸' },
    { code: 'French', name: 'Français', flag: '🇫🇷' },
    { code: 'German', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'Italian', name: 'Italiano', flag: '🇮🇹' },
    { code: 'Portuguese', name: 'Português', flag: '🇵🇹' },
    { code: 'Chinese', name: '中文', flag: '🇨🇳' },
    { code: 'Japanese', name: '日本語', flag: '🇯🇵' },
    { code: 'Korean', name: '한국어', flag: '🇰🇷' },
    { code: 'Dutch', name: 'Nederlands', flag: '🇳🇱' }
  ];

  // NEW: Illustration style options (from backend)
  const illustrationStyles = [
    { id: 'Classic Cartoon Style', name: 'Classic Cartoon', description: 'Exaggerated expressions, rounded features, bright playful colors' },
    { id: 'Watercolor Style', name: 'Watercolor', description: 'Soft, hand-painted feel, gentle brush strokes' },
    { id: 'Flat Vector Style', name: 'Flat Vector', description: 'Clean, minimalistic shapes, bold color blocks' },
    { id: 'Anime/Manga Style (Chibi)', name: 'Anime/Chibi', description: 'Big eyes, tiny bodies, cute fantasy design' },
    { id: '3D CGI / Pixar-Like Style', name: '3D/Pixar Style', description: 'Realistic lighting, detailed textures, 3D forms' },
    { id: 'Paper Cutout / Collage Style', name: 'Paper Cutout', description: 'Layered textures, handmade visual vibe' },
    { id: 'Line Art / Sketch Style', name: 'Line Art/Sketch', description: 'Pencil-like, suitable for coloring-in' },
    { id: 'Fantasy / Medieval Style', name: 'Fantasy/Medieval', description: 'Mythical creatures, detailed, epic themes' },
    { id: 'Pixel Art Style', name: 'Pixel Art', description: 'Retro, video-game inspired design' },
    { id: 'Vintage Storybook Style', name: 'Vintage Storybook', description: 'Faded tones, hand-drawn old-fashioned look' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.characterDescription.trim()) {
        alert('Please provide a character description for your story.');
        return;
    }

    setIsGenerating(true);

    // DECLARE the apiKeyStatus variable at the top
    let apiKeyStatus = null;

    try {
        // Create the proper payload for the backend
        const backendPayload = {
        short_description: `${formData.characterDescription} ${formData.moralLesson ? `The story teaches about ${formData.moralLesson}.` : ''}`.trim(),
        pages: formData.pageCount,
        age: formData.age.toString(),
        topic: formData.theme,
        language: formData.language,
        illustration_style: formData.illustrationStyle,
        openai_api_key: formData.openaiApiKey || null
        };

        // Determine API key status BEFORE the API call
        if (!backendPayload.openai_api_key) {
        apiKeyStatus = 'no_key';
        } else if (!backendPayload.openai_api_key.startsWith('sk-')) {
        apiKeyStatus = 'invalid_key';
        }

        // Try API call to story-book-backend
        let story;
        try {
        const response = await fetch(`${API}/get_stories`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(backendPayload)
        });
        
        if (response.ok) {
            const result = await response.json();
            // Transform backend response to frontend format
            story = {
            id: Date.now().toString(),
            title: result.story_title,
            coverImage: result.story_book[0]?.illustration_path || "https://images.unsplash.com/photo-1533561304446-88a43deb6229?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHwxfHxjaGlsZHJlbiUyMGJvb2t8ZW58MHx8fHwxNzU0NTQyOTM4fDA&ixlib=rb-4.1.0&q=85&w=600&h=400",
            pages: result.story_book.map(page => ({
                id: page.page,
                text: page.story_text,
                image: page.illustration_path || "https://images.unsplash.com/photo-1519791883288-dc8bd696e667?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NjZ8MHwxfHNlYXJjaHwxfHxzdG9yeWJvb2t8ZW58MHx8fHwxNzU0NTQyOTMzfDA&ixlib=rb-4.1.0&q=85&w=400&h=300"
            })),
            createdAt: new Date().toISOString(),
            // Add API key status even for successful calls if there was an issue
            apiKeyStatus: apiKeyStatus,
            providedApiKey: backendPayload.openai_api_key
            };
        } else {
            // API call failed, use mock
            if (!apiKeyStatus) {
            apiKeyStatus = backendPayload.openai_api_key ? 'invalid_key' : 'api_error';
            }
            throw new Error('API not available');
        }
        } catch (error) {
        console.log('Using mock story generation');
        story = generateMockStory(formData);
        story.apiKeyStatus = apiKeyStatus;
        story.providedApiKey = backendPayload.openai_api_key;
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
          <p>Our AI is crafting a personalized adventure based on your character description</p>
          
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
              Character Description
            </h3>
            <div className="input-group">
              <label className="input-label">Describe your main character *</label>
              <textarea
                value={formData.characterDescription}
                onChange={(e) => setFormData({...formData, characterDescription: e.target.value})}
                className="text-input character-description"
                placeholder="e.g., Emma is a brave 7-year-old girl with curly red hair who loves adventure and helping animals..."
                rows={4}
                required
              />
              <small className="input-help">
                Include the character's name, age, appearance, personality, and any special traits
              </small>
            </div>
          </motion.div>

          {/* NEW: Language Selection */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="form-section"
          >
            <h3 className="section-title">
              <FaGlobe />
              Story Language
            </h3>
            <div className="language-grid">
              {languages.map((lang) => (
                <motion.button
                  key={lang.code}
                  type="button"
                  onClick={() => setFormData({...formData, language: lang.code})}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`language-button ${formData.language === lang.code ? 'active' : ''}`}
                >
                  <span className="language-flag">{lang.flag}</span>
                  <span className="language-name">{lang.name}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* NEW: Illustration Style Selection */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="form-section"
          >
            <h3 className="section-title">
              <FaBrush />
              Illustration Style
            </h3>
            <div className="illustration-styles">
              {illustrationStyles.map((style) => (
                <motion.div
                  key={style.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`style-option ${formData.illustrationStyle === style.id ? 'active' : ''}`}
                  onClick={() => setFormData({...formData, illustrationStyle: style.id})}
                >
                  <div className="style-name">{style.name}</div>
                  <div className="style-description">{style.description}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Story Settings */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
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

          {/* OpenAI API Key (Optional) - Keep for mock fallback */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
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
                Provide your OpenAI API key for AI-generated stories. If not provided, the system will use the server's API key or generate a sample story.
              </small>
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.button
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 20px 40px rgba(147, 51, 234, 0.3)"
            }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="submit-button"
            disabled={!formData.characterDescription.trim()}
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