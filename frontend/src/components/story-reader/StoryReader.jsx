// src/components/story-reader/StoryReader.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  FaChevronLeft, 
  FaChevronRight, 
  FaPlay, 
  FaPause, 
  FaDownload 
} from "react-icons/fa";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import "./StoryReader.css";

const StoryReader = ({ story }) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [isReading, setIsReading] = useState(false);

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
            return prev;
          }
        });
      }, 5000); // Change page every 5 seconds
    }
    return () => clearInterval(interval);
  }, [isReading, story.pages.length]);

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
    </motion.div>
  );
};

export default StoryReader;