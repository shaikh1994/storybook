// Updated StoryGallery.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaChevronLeft, 
  FaPlus, 
  FaBook, 
  FaImage, 
  FaFilePdf,
  FaEye,
  FaDownload,
  FaTrash
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import './StoryGallery.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const StoryGallery = ({ stories = [], onSelectStory, onDeleteStory }) => {
  const navigate = useNavigate();
  const [samplePdf, setSamplePdf] = useState(null);
  const [loadingPdf, setLoadingPdf] = useState(true);

  // Load sample PDF data from backend
  useEffect(() => {
    const loadSamplePdf = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/storybook/sample/pdf-data`);
        if (response.ok) {
          const pdfData = await response.json();
          setSamplePdf(pdfData);
        }
      } catch (error) {
        console.error('Failed to load sample PDF:', error);
      } finally {
        setLoadingPdf(false);
      }
    };

    loadSamplePdf();
  }, []);

  const handleStoryClick = (story) => {
    if (onSelectStory) {
      onSelectStory(story);
      navigate('/reader');
    } else {
      // Fallback: navigate with state
      navigate('/reader', { state: { story } });
    }
  };

  const handlePdfClick = () => {
    if (samplePdf) {
      navigate('/pdf-viewer', { state: { pdfData: samplePdf } });
    }
  };

  const handleCreateStory = () => {
    navigate('/create');
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const renderStoryCard = (story) => (
    <motion.div
      key={story.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="story-card"
      onClick={() => handleStoryClick(story)}
    >
      <div className="story-card-image">
        <img 
          src={story.coverImage} 
          alt={story.title}
          className="card-image"
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1533561304446-88a43deb6229?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHwxfHxjaGlsZHJlbiUyMGJvb2t8ZW58MHx8fHwxNzU0NTQyOTM4fDA&ixlib=rb-4.1.0&q=85&w=600&h=400";
          }}
        />
        <div className="image-overlay">
          <div className="overlay-content">
            <FaEye className="overlay-icon" />
            <span>Read Story</span>
          </div>
        </div>
      </div>
      
      <div className="story-card-content">
        <h3 className="story-card-title">{story.title}</h3>
        <div className="story-card-meta">
          <div className="meta-item">
            <FaBook className="meta-icon" />
            <span>{story.pages?.length || 0} pages</span>
          </div>
          <div className="meta-item">
            <FaImage className="meta-icon" />
            <span>Illustrated</span>
          </div>
        </div>
        <div className="story-card-date">
          Created {new Date(story.createdAt).toLocaleDateString()}
        </div>
        
        {onDeleteStory && (
          <button 
            className="delete-button"
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm('Are you sure you want to delete this story?')) {
                onDeleteStory(story.id);
              }
            }}
          >
            <FaTrash />
          </button>
        )}
      </div>
    </motion.div>
  );

  const renderPdfCard = () => {
    if (loadingPdf) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="story-card loading-card"
        >
          <div className="story-card-image">
            <div className="loading-placeholder">
              <div className="loading-spinner"></div>
            </div>
          </div>
          <div className="story-card-content">
            <h3 className="story-card-title">Loading PDF...</h3>
          </div>
        </motion.div>
      );
    }

    if (!samplePdf) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="story-card pdf-card"
        onClick={handlePdfClick}
      >
        <div className="story-card-image">
          <div className="pdf-preview">
            <FaFilePdf className="pdf-icon" />
            <div className="pdf-badge">PDF</div>
          </div>
          <div className="image-overlay">
            <div className="overlay-content">
              <FaEye className="overlay-icon" />
              <span>View PDF</span>
            </div>
          </div>
        </div>
        
        <div className="story-card-content">
          <h3 className="story-card-title">{samplePdf.title}</h3>
          <p className="story-card-description">{samplePdf.description}</p>
          <div className="story-card-meta">
            <div className="meta-item">
              <FaBook className="meta-icon" />
              <span>{samplePdf.totalPages} pages</span>
            </div>
            <div className="meta-item">
              <FaFilePdf className="meta-icon" />
              <span>PDF Format</span>
            </div>
          </div>
          <div className="story-card-actions">
            <button 
              className="action-btn view-btn"
              onClick={(e) => {
                e.stopPropagation();
                handlePdfClick();
              }}
            >
              <FaEye /> View
            </button>
            <button 
              className="action-btn download-btn"
              onClick={(e) => {
                e.stopPropagation();
                // Implement PDF download
                window.open(`${BACKEND_URL}/static/sample/sample_storybook.pdf`, '_blank');
              }}
            >
              <FaDownload /> Download
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  const totalItems = stories.length + (samplePdf ? 1 : 0);

  return (
    <div className="story-gallery">
      {/* Header */}
      <div className="gallery-header">
        <div className="header-container">
          <div className="header-left">
            <button onClick={handleBackToHome} className="back-button">
              <FaChevronLeft size={24} />
            </button>
            <h1 className="gallery-title">Story Gallery</h1>
          </div>
          
          <div className="header-stats">
            <div className="stat-item">
              <FaBook className="stat-icon" />
              <span>{stories.length} Stories</span>
            </div>
            {samplePdf && (
              <div className="stat-item">
                <FaFilePdf className="stat-icon" />
                <span>1 PDF</span>
              </div>
            )}
            <div className="stat-item">
              <FaImage className="stat-icon" />
              <span>{totalItems} Total</span>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Container */}
      <div className="gallery-container">
        {totalItems === 0 ? (
          // Empty State
          <div className="empty-gallery">
            <div className="empty-content">
              <div className="empty-icon">📚</div>
              <h2 className="empty-title">No Stories Yet</h2>
              <p className="empty-description">
                Create your first magical story and watch it come to life!
              </p>
              <button onClick={handleCreateStory} className="create-first-button">
                <FaPlus style={{ marginRight: '0.5rem' }} />
                Create Your First Story
              </button>
            </div>
          </div>
        ) : (
          // Stories Grid
          <div className="stories-grid">
            {/* Sample PDF Card */}
            {renderPdfCard()}
            
            {/* Story Cards */}
            {stories.map(renderStoryCard)}
            
            {/* Add New Story Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="story-card add-new-card"
              onClick={handleCreateStory}
            >
              <div className="add-new-content">
                <div className="add-icon">
                  <FaPlus size={48} />
                </div>
                <h3>Create New Story</h3>
                <p>Start a new magical adventure</p>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoryGallery;