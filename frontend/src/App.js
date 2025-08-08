import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaMagic, 
  FaBook, 
  FaPalette, 
  FaDownload, 
  FaPlay, 
  FaPause,
  FaChevronLeft,
  FaChevronRight,
  FaStar,
  FaHeart,
  FaRocket,
  FaMoon,
  FaTree,
  FaCrown,
  FaDragon,
  FaGem
} from "react-icons/fa";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import "./App.css";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Conditional OpenAI integration - uncomment when API key is available
/*
const generateStoryWithAI = async (storyData) => {
  try {
    const response = await fetch(`${API}/generate-story`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        age: storyData.age,
        theme: storyData.theme,
        characterName: storyData.characterName,
        characterTraits: storyData.characterTraits,
        pageCount: storyData.pageCount,
        moralLesson: storyData.moralLesson,
        openaiApiKey: storyData.openaiApiKey // User provides API key
      })
    });
    return await response.json();
  } catch (error) {
    console.error('Error generating story:', error);
    return null;
  }
};
*/

// Mock story data for development
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

const WelcomeScreen = ({ onStartCreating }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-purple-200 via-pink-100 to-blue-200 flex items-center justify-center p-4"
    >
      <div className="max-w-4xl mx-auto text-center">
        {/* Floating elements */}
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, -5, 0] 
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity,
            ease: "easeInOut" 
          }}
          className="absolute top-20 left-10 text-6xl"
        >
          ⭐
        </motion.div>
        
        <motion.div
          animate={{ 
            y: [0, 15, 0],
            x: [0, 10, 0] 
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1 
          }}
          className="absolute top-40 right-20 text-5xl"
        >
          🦄
        </motion.div>

        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, -10, 10, 0] 
          }}
          transition={{ 
            duration: 5, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2 
          }}
          className="absolute bottom-40 left-20 text-4xl"
        >
          🌈
        </motion.div>

        {/* Hero Image */}
        <motion.div
          initial={{ scale: 0.8, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8"
        >
          <img 
            src="https://images.unsplash.com/photo-1519791883288-dc8bd696e667?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NjZ8MHwxfHNlYXJjaHwxfHxzdG9yeWJvb2t8ZW58MHx8fHwxNzU0NTQyOTMzfDA&ixlib=rb-4.1.0&q=85&w=600&h=400"
            alt="Magical Storybook"
            className="w-96 h-64 object-cover rounded-3xl shadow-2xl mx-auto"
          />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-7xl font-bold text-purple-800 mb-4 tracking-tight"
        >
          StoryBook Creator
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-2xl text-purple-600 mb-8 max-w-2xl mx-auto leading-relaxed"
        >
          Create magical, personalized stories with AI-generated illustrations that bring your child's imagination to life
        </motion.p>

        {/* CTA Button */}
        <motion.button
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          whileHover={{ 
            scale: 1.05,
            boxShadow: "0 20px 40px rgba(147, 51, 234, 0.3)"
          }}
          whileTap={{ scale: 0.95 }}
          onClick={onStartCreating}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-12 py-4 rounded-full text-xl font-semibold shadow-xl transition-all duration-300 flex items-center mx-auto gap-3"
        >
          <FaMagic className="text-2xl" />
          Create Your Story
        </motion.button>

        {/* Sample stories preview */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="mt-16 grid md:grid-cols-3 gap-6 max-w-4xl mx-auto"
        >
          {[
            { title: "Space Adventure", emoji: "🚀" },
            { title: "Underwater Quest", emoji: "🌊" },
            { title: "Fairy Tale Magic", emoji: "✨" }
          ].map((sample, index) => (
            <motion.div
              key={sample.title}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
            >
              <div className="text-4xl mb-3">{sample.emoji}</div>
              <h3 className="text-lg font-semibold text-purple-800">{sample.title}</h3>
              <p className="text-purple-600 text-sm mt-2">
                Magical adventures await your little one
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

const StoryCreationForm = ({ onStoryGenerated, onBack }) => {
  const [formData, setFormData] = useState({
    age: 5,
    theme: 'fairy',
    characterName: '',
    characterTraits: '',
    pageCount: 5,
    moralLesson: '',
    openaiApiKey: '' // For when user has API key
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
    setIsGenerating(true);

    try {
      // Use AI generation when API key is available, otherwise use mock data
      let story;
      if (formData.openaiApiKey && formData.openaiApiKey.trim()) {
        // story = await generateStoryWithAI(formData); // Uncomment when backend is ready
        story = generateMockStory(formData); // Fallback to mock for now
      } else {
        story = generateMockStory(formData);
      }
      
      if (story) {
        onStoryGenerated(story);
      }
    } catch (error) {
      console.error('Error generating story:', error);
    }
    
    setIsGenerating(false);
  };

  if (isGenerating) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-purple-200 via-pink-100 to-blue-200 flex items-center justify-center p-4"
      >
        <div className="text-center">
          <motion.div
            animate={{ 
              rotate: 360,
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              rotate: { duration: 2, repeat: Infinity, ease: "linear" },
              scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
            }}
            className="text-8xl mb-8"
          >
            ✨
          </motion.div>
          
          <motion.h2
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-3xl font-bold text-purple-800 mb-4"
          >
            Creating Your Magical Story...
          </motion.h2>
          
          <p className="text-purple-600 text-lg">
            Our AI is weaving words and painting pictures just for {formData.characterName || 'your little one'}!
          </p>

          <div className="mt-8 flex justify-center gap-4">
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
                className="text-4xl"
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
      className="min-h-screen bg-gradient-to-br from-purple-200 via-pink-100 to-blue-200 p-4"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={onBack}
            className="mr-4 p-2 text-purple-600 hover:text-purple-800 hover:bg-white/50 rounded-full transition-all"
          >
            <FaChevronLeft size={24} />
          </button>
          <h1 className="text-4xl font-bold text-purple-800">Create Your Story</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Age Selector */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
          >
            <h3 className="text-2xl font-semibold text-purple-800 mb-4 flex items-center gap-2">
              <span className="text-3xl">👶</span>
              Child's Age
            </h3>
            <div className="flex gap-2 flex-wrap">
              {[1,2,3,4,5,6,7,8,9,10,11,12].map((age) => (
                <button
                  key={age}
                  type="button"
                  onClick={() => setFormData({...formData, age})}
                  className={`px-4 py-2 rounded-full transition-all ${
                    formData.age === age 
                      ? 'bg-purple-600 text-white shadow-lg' 
                      : 'bg-white text-purple-600 hover:bg-purple-100'
                  }`}
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
            className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
          >
            <h3 className="text-2xl font-semibold text-purple-800 mb-4 flex items-center gap-2">
              <FaPalette />
              Story Theme
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              {themes.map((theme) => (
                <motion.button
                  key={theme.id}
                  type="button"
                  onClick={() => setFormData({...formData, theme: theme.id})}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-4 rounded-xl transition-all ${
                    formData.theme === theme.id 
                      ? 'bg-purple-600 text-white shadow-lg' 
                      : 'bg-white text-purple-600 hover:bg-purple-50'
                  }`}
                >
                  <div className="text-3xl mb-2">{theme.emoji}</div>
                  <div className="font-semibold">{theme.name}</div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Character Details */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
          >
            <h3 className="text-2xl font-semibold text-purple-800 mb-4 flex items-center gap-2">
              <span className="text-3xl">👦</span>
              Character Details
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-purple-700 font-medium mb-2">Character Name *</label>
                <input
                  type="text"
                  value={formData.characterName}
                  onChange={(e) => setFormData({...formData, characterName: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-purple-200 focus:border-purple-500 focus:outline-none"
                  placeholder="Enter your child's name or character name"
                  required
                />
              </div>
              <div>
                <label className="block text-purple-700 font-medium mb-2">Character Traits</label>
                <input
                  type="text"
                  value={formData.characterTraits}
                  onChange={(e) => setFormData({...formData, characterTraits: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-purple-200 focus:border-purple-500 focus:outline-none"
                  placeholder="brave, curious, kind, funny..."
                />
              </div>
            </div>
          </motion.div>

          {/* Story Settings */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
          >
            <h3 className="text-2xl font-semibold text-purple-800 mb-4 flex items-center gap-2">
              <FaBook />
              Story Settings
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-purple-700 font-medium mb-2">
                  Number of Pages: {formData.pageCount}
                </label>
                <input
                  type="range"
                  min="3"
                  max="15"
                  value={formData.pageCount}
                  onChange={(e) => setFormData({...formData, pageCount: parseInt(e.target.value)})}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-purple-500 mt-1">
                  <span>3 pages</span>
                  <span>15 pages</span>
                </div>
              </div>
              
              <div>
                <label className="block text-purple-700 font-medium mb-2">Moral Lesson (Optional)</label>
                <input
                  type="text"
                  value={formData.moralLesson}
                  onChange={(e) => setFormData({...formData, moralLesson: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-purple-200 focus:border-purple-500 focus:outline-none"
                  placeholder="friendship, sharing, courage..."
                />
              </div>
            </div>
          </motion.div>

          {/* OpenAI API Key (Conditional) */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6"
          >
            <h3 className="text-xl font-semibold text-yellow-800 mb-2 flex items-center gap-2">
              🔑 OpenAI API Key (Optional)
            </h3>
            <p className="text-yellow-700 text-sm mb-4">
              To use AI-generated stories and illustrations, provide your OpenAI API key. Leave blank to use sample content.
            </p>
            <input
              type="password"
              value={formData.openaiApiKey}
              onChange={(e) => setFormData({...formData, openaiApiKey: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-yellow-200 focus:border-yellow-500 focus:outline-none"
              placeholder="sk-..."
            />
          </motion.div>

          {/* Submit Button */}
          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={!formData.characterName}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-4 rounded-xl text-xl font-semibold shadow-lg transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaMagic />
            Generate Story
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};

const StoryReader = ({ story, onBack, onExportPDF }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isReading, setIsReading] = useState(false);

  const nextPage = () => {
    if (currentPage < story.pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const exportToPDF = async () => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    // Add title page
    pdf.setFontSize(24);
    pdf.text(story.title, 105, 50, { align: 'center' });
    
    // Add pages
    for (let i = 0; i < story.pages.length; i++) {
      if (i > 0) pdf.addPage();
      
      pdf.setFontSize(16);
      const splitText = pdf.splitTextToSize(story.pages[i].text, 180);
      pdf.text(splitText, 15, 30);
    }
    
    pdf.save(`${story.title}.pdf`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-purple-200 via-pink-100 to-blue-200"
    >
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-sm shadow-lg p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 text-purple-600 hover:text-purple-800 hover:bg-white/50 rounded-full transition-all"
            >
              <FaChevronLeft size={24} />
            </button>
            <h1 className="text-2xl font-bold text-purple-800">{story.title}</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsReading(!isReading)}
              className="p-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-all"
            >
              {isReading ? <FaPause /> : <FaPlay />}
            </button>
            
            <button
              onClick={exportToPDF}
              className="p-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-all"
            >
              <FaDownload />
            </button>
          </div>
        </div>
      </div>

      {/* Book Interface */}
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="max-w-4xl w-full">
          {/* Page Navigation */}
          <div className="flex justify-center items-center mb-6 gap-4">
            <button
              onClick={prevPage}
              disabled={currentPage === 0}
              className={`p-3 rounded-full transition-all ${
                currentPage === 0 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-purple-600 hover:bg-white/50'
              }`}
            >
              <FaChevronLeft size={24} />
            </button>
            
            <span className="text-purple-700 font-medium">
              Page {currentPage + 1} of {story.pages.length}
            </span>
            
            <button
              onClick={nextPage}
              disabled={currentPage === story.pages.length - 1}
              className={`p-3 rounded-full transition-all ${
                currentPage === story.pages.length - 1 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-purple-600 hover:bg-white/50'
              }`}
            >
              <FaChevronRight size={24} />
            </button>
          </div>

          {/* Book Pages */}
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="bg-white rounded-3xl shadow-2xl p-8 max-w-3xl mx-auto"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill-opacity='0.03'%3E%3Cpolygon fill='%23000' points='50 0 60 40 100 50 60 60 50 100 40 60 0 50 40 40'/%3E%3C/g%3E%3C/svg%3E")`,
            }}
          >
            {/* Page Image */}
            <div className="mb-6">
              <img
                src={story.pages[currentPage].image}
                alt={`Story illustration for page ${currentPage + 1}`}
                className="w-full h-64 object-cover rounded-2xl shadow-lg"
              />
            </div>

            {/* Page Text */}
            <div className="text-center">
              <p className="text-lg leading-relaxed text-gray-800 font-medium">
                {story.pages[currentPage].text}
              </p>
            </div>

            {/* Reading indicator */}
            {isReading && (
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="mt-4 text-center text-purple-600"
              >
                🎵 Reading aloud...
              </motion.div>
            )}
          </motion.div>

          {/* Page Dots */}
          <div className="flex justify-center mt-6 gap-2">
            {story.pages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentPage 
                    ? 'bg-purple-600 scale-125' 
                    : 'bg-white/60 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const StoryGallery = ({ stories, onSelectStory, onBack }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen bg-gradient-to-br from-purple-200 via-pink-100 to-blue-200 p-4"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-8">
          <button
            onClick={onBack}
            className="mr-4 p-2 text-purple-600 hover:text-purple-800 hover:bg-white/50 rounded-full transition-all"
          >
            <FaChevronLeft size={24} />
          </button>
          <h1 className="text-4xl font-bold text-purple-800">Your Story Collection</h1>
        </div>

        {stories.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-2xl font-semibold text-purple-800 mb-2">No stories yet</h2>
            <p className="text-purple-600">Create your first magical story!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((story, index) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                onClick={() => onSelectStory(story)}
                className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg cursor-pointer transition-all hover:shadow-xl"
              >
                <img
                  src={story.coverImage}
                  alt={story.title}
                  className="w-full h-48 object-cover rounded-xl mb-4"
                />
                <h3 className="text-xl font-semibold text-purple-800 mb-2">{story.title}</h3>
                <p className="text-purple-600 text-sm">
                  {story.pages.length} pages • Created {new Date(story.createdAt).toLocaleDateString()}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

function App() {
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [currentStory, setCurrentStory] = useState(null);
  const [savedStories, setSavedStories] = useState([]);

  const handleStoryGenerated = (story) => {
    setCurrentStory(story);
    setSavedStories(prev => [story, ...prev]);
    setCurrentScreen('reader');
  };

  const handleSelectStory = (story) => {
    setCurrentStory(story);
    setCurrentScreen('reader');
  };

  return (
    <div className="App">
      <AnimatePresence mode="wait">
        {currentScreen === 'welcome' && (
          <WelcomeScreen 
            key="welcome"
            onStartCreating={() => setCurrentScreen('create')}
          />
        )}
        
        {currentScreen === 'create' && (
          <StoryCreationForm
            key="create"
            onStoryGenerated={handleStoryGenerated}
            onBack={() => setCurrentScreen('welcome')}
          />
        )}
        
        {currentScreen === 'reader' && currentStory && (
          <StoryReader
            key="reader"
            story={currentStory}
            onBack={() => setCurrentScreen('welcome')}
          />
        )}
        
        {currentScreen === 'gallery' && (
          <StoryGallery
            key="gallery"
            stories={savedStories}
            onSelectStory={handleSelectStory}
            onBack={() => setCurrentScreen('welcome')}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;