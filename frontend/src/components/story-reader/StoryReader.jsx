// src/components/story-reader/StoryReader.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  FaChevronLeft, 
  FaChevronRight, 
  FaPlay, 
  FaPause, 
  FaDownload,
  FaMagic,
  FaShoppingCart
} from "react-icons/fa";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import Toast from "../toast/Toast";
import "./StoryReader.css";

const StoryReader = ({ story, onCreateAnother }) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [isReading, setIsReading] = useState(false);
  const [showEndActions, setShowEndActions] = useState(false);
  const [showToast, setShowToast] = useState(true);

  // Check if we're on the last page
  const isLastPage = currentPage === story.pages.length - 1;

  // Determine toast message and type based on API key status
  const getToastInfo = () => {
    if (!story.apiKeyStatus) return null;

    switch (story.apiKeyStatus) {
      case 'invalid_key':
        return {
          type: 'warning',
          message: `Invalid API key provided (${story.providedApiKey?.substring(0, 7)}...). Please check your key format - it should start with "sk-". Currently showing mock story.`
        };
      case 'no_key':
        return {
          type: 'info', 
          message: 'No API key provided, so showing a sample mock story. Add your OpenAI API key to generate personalized AI stories.'
        };
      case 'api_error':
        return {
          type: 'warning',
          message: 'API connection failed. Currently showing mock story. Please check your API key and try again.'
        };
      default:
        return null;
    }
  };

  const toastInfo = getToastInfo();

  // Auto-advance pages when reading
  useEffect(() => {
    let interval;
    if (isReading) {
      interval = setInterval(() => {
        setCurrentPage(prev => {
          if (prev < story.pages.length - 1) {
            return prev + 1;
          } else {
            setIsReading(false);
            setShowEndActions(true); // Show action buttons when story ends
            return prev;
          }
        });
      }, 5000); // Change page every 5 seconds
    }
    return () => clearInterval(interval);
  }, [isReading, story.pages.length]);

  // Show end actions when manually reaching last page
  useEffect(() => {
    if (isLastPage) {
      const timer = setTimeout(() => {
        setShowEndActions(true);
      }, 2000); // Show buttons after 2 seconds on last page
      return () => clearTimeout(timer);
    } else {
      setShowEndActions(false);
    }
  }, [isLastPage]);

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

  const handleCreateAnother = () => {
    // Call parent function to preserve form data
    if (onCreateAnother) {
      onCreateAnother();
    }
    navigate('/create');
  };

  const handleBuyProduct = () => {
    // TODO: Implement your product/subscription logic here
    alert('Product page coming soon! This will redirect to your pricing/subscription page.');
    // Future: navigate('/pricing') or window.open('https://your-product-page.com')
  };

  const exportToPDF = async () => {
    try {
      const pdf = new jsPDF();
      const pageElement = document.querySelector('.story-page-content');
      
      if (pageElement) {
        const canvas = await html2canvas(pageElement);
        const imgData = canvas.toDataURL('image/png');
        
        pdf.addImage(imgData, 'PNG', 10, 10, 190, 270);
        pdf.save(`${story.title}.pdf`);
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  if (!story) {
    return (
      <div className="story-reader error">
        <div className="error-content">
          <h2>Story not found</h2>
          <button onClick={() => navigate('/')} className="home-button">
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="story-reader"
    >
      {/* Header */}
      <div className="reader-header">
        <div className="header-container">
          <div className="header-left">
            <button
              onClick={() => navigate('/')}
              className="back-button"
            >
              <FaChevronLeft size={24} />
            </button>
            <h1 className="story-title">{story.title}</h1>
          </div>
          
          <div className="header-actions">
            <button
              onClick={() => setIsReading(!isReading)}
              className="action-button primary"
            >
              {isReading ? <FaPause /> : <FaPlay />}
            </button>
            
            <button
              onClick={exportToPDF}
              className="action-button secondary"
            >
              <FaDownload />
            </button>
          </div>
        </div>
      </div>

      {/* Book Interface */}
      <div className="book-container">
        <div className="book-wrapper">
          {/* Page Navigation */}
          <div className="page-navigation">
            <button
              onClick={prevPage}
              disabled={currentPage === 0}
              className={`nav-button ${currentPage === 0 ? 'disabled' : ''}`}
            >
              <FaChevronLeft size={24} />
            </button>
            
            <span className="page-counter">
              Page {currentPage + 1} of {story.pages.length}
            </span>
            
            <button
              onClick={nextPage}
              disabled={currentPage === story.pages.length - 1}
              className={`nav-button ${currentPage === story.pages.length - 1 ? 'disabled' : ''}`}
            >
              <FaChevronRight size={24} />
            </button>
          </div>

          {/* Story Page */}
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="story-page"
          >
            <div className="story-page-content">
              {/* Page Image */}
              <div className="page-image-container">
                <img
                  src={story.pages[currentPage]?.image || story.coverImage}
                  alt={`Page ${currentPage + 1}`}
                  className="page-image"
                />
              </div>

              {/* Page Text */}
              <div className="page-text-container">
                <p className="page-text">
                  {story.pages[currentPage]?.text}
                </p>
              </div>
            </div>
          </motion.div>

          {/* End of Story Action Buttons */}
          {isLastPage && showEndActions && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="end-story-actions"
            >
              <div className="actions-container">
                <h3 className="actions-title">What would you like to do next?</h3>
                <div className="action-buttons">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCreateAnother}
                    className="end-action-button primary"
                  >
                    <FaMagic className="button-icon" />
                    <div className="button-content">
                      <span className="button-title">Create Another Story</span>
                      <span className="button-subtitle">Your settings will be saved</span>
                    </div>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleBuyProduct}
                    className="end-action-button secondary"
                  >
                    <FaShoppingCart className="button-icon" />
                    <div className="button-content">
                      <span className="button-title">Get Full Access</span>
                      <span className="button-subtitle">Unlimited stories & features</span>
                    </div>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Page Indicators */}
          <div className="page-indicators">
            {story.pages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index)}
                className={`page-indicator ${index === currentPage ? 'active' : ''}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Reading Progress */}
      <div className="reading-progress">
        <div 
          className="progress-bar"
          style={{ 
            width: `${((currentPage + 1) / story.pages.length) * 100}%` 
          }}
        />
      </div>

      {/* Toast Notification */}
      {showToast && toastInfo && (
        <Toast
          message={toastInfo.message}
          type={toastInfo.type}
          duration={8000}
          onClose={() => setShowToast(false)}
        />
      )}
    </motion.div>
  );
};

export default StoryReader;