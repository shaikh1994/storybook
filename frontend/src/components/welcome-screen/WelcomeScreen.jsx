// src/components/welcome-screen/WelcomeScreen.jsx
import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaMagic, FaBook, FaPalette, FaYoutube   } from "react-icons/fa";
import "./WelcomeScreen.css";

const WelcomeScreen = () => {
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="welcome-screen"
    >
      <div className="welcome-container">
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
          className="floating-element star"
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
          className="floating-element unicorn"
        >
          🦄
        </motion.div>

        <motion.div
          animate={{ 
            scale: [1, 2.1, 1],
            rotate: [0, -10, 10, 0] 
          }}
          transition={{ 
            duration: 5, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2 
          }}
          className="floating-element rainbow"
        >
          🌈
        </motion.div>

        {/* Hero Image */}
        <motion.div
          initial={{ scale: 0.8, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="hero-image"
        >
          <img 
            src="https://images.unsplash.com/photo-1519791883288-dc8bd696e667?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NjZ8MHwxfHNlYXJjaHwxfHxzdG9yeWJvb2t8ZW58MHx8fHwxNzU0NTQyOTMzfDA&ixlib=rb-4.1.0&q=85&w=600&h=400"
            alt="Magical Storybook"
            className="hero-img"
          />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="welcome-title"
        >
          StoryBook Creator
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="welcome-subtitle"
        >
          Create magical, personalized stories with AI-generated illustrations that bring your child's imagination to life
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="welcome-actions"
        >
          <motion.button
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 20px 40px rgba(147, 51, 234, 0.3)"
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/create')}
            className="welcome-btn primary"
          >
            <FaMagic className="btn-icon" />
            Start Creating
          </motion.button>
          
          <motion.button
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 15px 30px rgba(147, 51, 234, 0.2)"
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/gallery')}
            className="welcome-btn secondary"
          >
            <FaPalette className="btn-icon" />
            View Gallery
          </motion.button>

          <motion.button
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 15px 30px rgba(147, 51, 234, 0.2)"
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/gallery')}
            className="welcome-btn secondary"
          >
            <FaYoutube  className="btn-icon" />
            Our Youtube
          </motion.button>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="features-grid"
        >
          <div className="feature-card">
            <FaMagic className="feature-icon" />
            <h3>AI-Powered Stories</h3>
            <p>Create unique stories tailored to your child's interests</p>
          </div>
          
          <div className="feature-card">
            <FaBook className="feature-icon" />
            <h3>Interactive Reading</h3>
            <p>Engaging narratives with beautiful illustrations</p>
          </div>
          
          <div className="feature-card">
            <FaPalette className="feature-icon" />
            <h3>Custom Characters</h3>
            <p>Personalize characters and themes for each story</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default WelcomeScreen;