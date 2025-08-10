// frontend/src/components/pdf-viewer/PDFGalleryViewer.jsx
// Complete updated version to handle multiple PDFs and new data structure

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { 
  FaChevronLeft, 
  FaChevronRight, 
  FaPlay, 
  FaPause, 
  FaHome, 
  FaDownload
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import './PDFGalleryViewer.css';

const PDFGalleryViewer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { pdfId } = useParams(); // For direct URL access
  const [currentPage, setCurrentPage] = useState(0);
  const [isReading, setIsReading] = useState(false);
  const [showEndActions, setShowEndActions] = useState(false);
  const [pdfData, setPdfData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load PDF data from location state or fetch from API
  useEffect(() => {
    const loadPDF = async () => {
      try {
        setLoading(true);
        
        if (location.state?.pdfData) {
          // Use data passed from gallery
          setPdfData(location.state.pdfData);
        } else if (pdfId) {
          // Fetch specific PDF by ID from URL
          const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/storybook/sample/pdf-data/${pdfId}`);
          if (response.ok) {
            const data = await response.json();
            setPdfData(data);
          } else {
            throw new Error('Failed to load PDF data');
          }
        } else {
          // Fallback: try to get the first available PDF
          const listResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/storybook/sample/pdf-list`);
          if (listResponse.ok) {
            const listData = await listResponse.json();
            if (listData.pdfs && listData.pdfs.length > 0) {
              const firstPdf = listData.pdfs[0];
              const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/storybook/sample/pdf-data/${firstPdf.id}`);
              if (response.ok) {
                const data = await response.json();
                setPdfData(data);
              }
            }
          }
          
          if (!pdfData) {
            throw new Error('No PDF data available');
          }
        }
      } catch (err) {
        setError('Failed to load PDF content');
        console.error('Error loading PDF:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPDF();
  }, [location.state, pdfId]);

  // Auto-advance pages when reading
  useEffect(() => {
    let interval;
    if (isReading && pdfData) {
      interval = setInterval(() => {
        setCurrentPage(prev => {
          if (prev < pdfData.pages.length - 1) {
            return prev + 1;
          } else {
            setIsReading(false);
            setShowEndActions(true);
            return prev;
          }
        });
      }, 5000); // Change page every 5 seconds
    }
    return () => clearInterval(interval);
  }, [isReading, pdfData]);

  // Show end actions when manually reaching last page
  useEffect(() => {
    if (pdfData && currentPage === pdfData.pages.length - 1) {
      const timer = setTimeout(() => {
        setShowEndActions(true);
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      setShowEndActions(false);
    }
  }, [currentPage, pdfData]);

  const nextPage = () => {
    if (pdfData && currentPage < pdfData.pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleBackToGallery = () => {
    navigate('/');
  };

  const handleDownload = () => {
    if (pdfData?.id) {
      const link = document.createElement('a');
      link.href = `${process.env.REACT_APP_BACKEND_URL}/static/sample/${pdfData.id}.pdf`;
      link.download = `${pdfData.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const toggleReading = () => {
    setIsReading(!isReading);
  };

  if (loading) {
    return (
      <div className="story-reader loading">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <h2>Loading Story...</h2>
        </div>
      </div>
    );
  }

  if (error || !pdfData) {
    return (
      <div className="story-reader error">
        <div className="error-content">
          <h2>Error Loading Story</h2>
          <p>{error}</p>
          <button onClick={handleBackToGallery} className="back-button">
            Back to Gallery
          </button>
        </div>
      </div>
    );
  }

  const currentPageData = pdfData.pages[currentPage];
  const isLastPage = currentPage === pdfData.pages.length - 1;
  const progressPercentage = ((currentPage + 1) / pdfData.pages.length) * 100;

  return (
    <div className={`story-reader ${isReading ? 'reading' : ''}`}>
      {/* Header */}
      <div className="reader-header">
        <div className="header-container">
          <div className="header-left">
            <button onClick={handleBackToGallery} className="back-button">
              <FaChevronLeft size={24} />
            </button>
            <div className="story-info">
              <h1 className="story-title">{pdfData.title}</h1>
              <p className="story-subtitle">{pdfData.description}</p>
            </div>
          </div>
          
          <div className="header-actions">
            <button 
              className={`action-button play-button ${isReading ? 'reading' : ''}`}
              onClick={toggleReading}
              title={isReading ? 'Pause Reading' : 'Start Auto-Reading'}
            >
              {isReading ? <FaPause /> : <FaPlay />}
            </button>
            
            <button 
              className="action-button"
              onClick={handleDownload}
              title="Download PDF"
            >
              <FaDownload />
            </button>
            
            <button 
              className="action-button"
              onClick={handleBackToGallery}
              title="Back to Gallery"
            >
              <FaHome />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="reader-content">
        <div className="book-container">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="story-page"
            >
              <div className="story-page-content">
                {/* Image Section */}
                <div className="page-image-container">
                  {currentPageData.content.images && currentPageData.content.images.length > 0 ? (
                    <img 
                      src={currentPageData.content.images[0].base64} 
                      alt={`Page ${currentPage + 1}`}
                      className="page-image"
                    />
                  ) : (
                    <div className="page-placeholder">
                      <div className="placeholder-content">
                        <h3>Page {currentPage + 1}</h3>
                        <p>Sample Story</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Text Section */}
                <div className="page-text-container">
                  <div className="page-text">
                    {currentPageData.content.text || "No text content on this page."}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="page-navigation">
          <button 
            onClick={prevPage} 
            disabled={currentPage === 0}
            className="nav-button prev-button"
          >
            <FaChevronLeft />
            <span>Previous</span>
          </button>
          
          <div className="page-counter">
            <span>{currentPage + 1} of {pdfData.pages.length}</span>
          </div>
          
          <button 
            onClick={nextPage} 
            disabled={isLastPage}
            className="nav-button next-button"
          >
            <span>Next</span>
            <FaChevronRight />
          </button>
        </div>

        {/* Page Indicators */}
        <div className="page-indicators">
          {pdfData.pages.map((_, index) => (
            <button
              key={index}
              className={`page-indicator ${index === currentPage ? 'active' : ''}`}
              onClick={() => setCurrentPage(index)}
            />
          ))}
        </div>

        
      </div>

      {/* Progress Bar */}
      <div className="reading-progress">
        <div 
          className="progress-bar" 
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* End Actions */}
        {showEndActions && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="end-actions"
          >
            <div className="end-actions-content">
              <h3>Sample Story Complete!</h3>
              <p>This shows how your AI-generated stories will look.</p>
              <div className="end-buttons">
                <button 
                  onClick={() => navigate('/create')}
                  className="action-btn primary"
                >
                  Create Your Story
                </button>
                <button 
                  onClick={handleBackToGallery}
                  className="action-btn secondary"
                >
                  Back to Gallery
                </button>
                <button 
                  onClick={handleDownload}
                  className="action-btn secondary"
                >
                  Download PDF
                </button>
              </div>
            </div>
          </motion.div>
        )}
    </div>
  );
};

export default PDFGalleryViewer;