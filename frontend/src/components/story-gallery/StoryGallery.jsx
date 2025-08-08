// src/components/story-gallery/StoryGallery.jsx
import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaChevronLeft, FaBook, FaClock } from "react-icons/fa";
import "./StoryGallery.css";

const StoryGallery = ({ stories, onSelectStory }) => {
  const navigate = useNavigate();

  const handleStoryClick = (story) => {
    onSelectStory(story);
    navigate('/reader');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="story-gallery"
    >
      {/* Header */}
      <div className="gallery-header">
        <div className="header-container">
          <div className="header-left">
            <button
              onClick={() => navigate('/')}
              className="back-button"
            >
              <FaChevronLeft size={24} />
            </button>
            <h1 className="gallery-title">Story Gallery</h1>
          </div>
          
          <div className="header-stats">
            <div className="stat-item">
              <FaBook className="stat-icon" />
              <span>{stories.length} Stories</span>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Content */}
      <div className="gallery-container">
        {stories.length === 0 ? (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="empty-gallery"
          >
            <div className="empty-content">
              <div className="empty-icon">📚</div>
              <h2 className="empty-title">No stories yet</h2>
              <p className="empty-description">Create your first magical story!</p>
              <button
                onClick={() => navigate('/create')}
                className="create-first-button"
              >
                Create Story
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="stories-grid">
            {stories.map((story, index) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleStoryClick(story)}
                className="story-card"
              >
                <div className="story-card-image">
                  <img
                    src={story.coverImage}
                    alt={story.title}
                    className="card-image"
                  />
                  <div className="image-overlay">
                    <div className="overlay-content">
                      <FaBook className="overlay-icon" />
                      <span>Read Story</span>
                    </div>
                  </div>
                </div>
                
                <div className="story-card-content">
                  <h3 className="story-card-title">{story.title}</h3>
                  
                  <div className="story-meta">
                    <div className="meta-item">
                      <FaBook className="meta-icon" />
                      <span>{story.pages.length} pages</span>
                    </div>
                    <div className="meta-item">
                      <FaClock className="meta-icon" />
                      <span>{new Date(story.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  {story.pages[0] && (
                    <p className="story-preview">
                      {story.pages[0].text.substring(0, 100)}...
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => navigate('/create')}
        className="fab"
      >
        <span className="fab-icon">✨</span>
      </motion.button>
    </motion.div>
  );
};

export default StoryGallery;