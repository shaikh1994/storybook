// src/App.js
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

// Import components
import Navbar from "./components/navbar/Navbar";
import WelcomeScreen from "./components/welcome-screen/WelcomeScreen";
import StoryCreationForm from "./components/story-creation-form/StoryCreationForm";
import StoryReader from "./components/story-reader/StoryReader";
import StoryGallery from "./components/story-gallery/StoryGallery";
import MarketingHomepage from "./components/marketing-homepage/MarketingHomepage";
import PricingPage from "./components/pricing/PricingPage";
import PDFGalleryViewer from './components/pdf-viewer/PDFGalleryViewer';

import "./App.css";

function App() {
  // Consolidated state management
  const [currentStory, setCurrentStory] = useState(null);
  const [stories, setStories] = useState([]);
  const [preserveFormData, setPreserveFormData] = useState(false);

  // Load stories from localStorage on app start
  useEffect(() => {
    const savedStories = localStorage.getItem('storybook-stories');
    if (savedStories) {
      try {
        setStories(JSON.parse(savedStories));
      } catch (error) {
        console.error('Error loading stories:', error);
      }
    }
  }, []);
  
  // Save stories to localStorage whenever stories change
  useEffect(() => {
    localStorage.setItem('storybook-stories', JSON.stringify(stories));
  }, [stories]);

  // Handler functions
  const handleStoryGenerated = (newStory) => {
    setStories(prev => [newStory, ...prev]);
    setCurrentStory(newStory); // Set as current story for immediate viewing
    setPreserveFormData(false);
  };

  const handleSelectStory = (story) => {
    setCurrentStory(story);
  };

  const handleCreateAnother = () => {
    setPreserveFormData(true);
    setCurrentStory(null); // Clear current story when creating another
  };

  const handleDeleteStory = (storyId) => {
    setStories(prev => prev.filter(story => story.id !== storyId));
    // If the deleted story is currently selected, clear it
    if (currentStory && currentStory.id === storyId) {
      setCurrentStory(null);
    }
  };

  const handleFormsLoaded = () => {
    setPreserveFormData(false);
  };

  return (
    <Router>
      <div className="App">
        <Navbar />
        <AnimatePresence mode="wait">
          <Routes>
            {/* Marketing Homepage Route */}
            <Route 
              path="/" 
              element={<MarketingHomepage />} 
            />

            {/* Demo/Welcome Route */}
            <Route 
              path="/demo" 
              element={<WelcomeScreen />} 
            />
            
            {/* Story Gallery Route */}
            <Route 
              path="/gallery" 
              element={
                <StoryGallery 
                  stories={stories} 
                  onSelectStory={handleSelectStory}
                  onDeleteStory={handleDeleteStory}
                />
              } 
            />
            
            {/* Story Creation Route */}
            <Route 
              path="/create" 
              element={
                <StoryCreationForm 
                  onStoryGenerated={handleStoryGenerated}
                  preserveForms={preserveFormData}
                  onFormsLoaded={handleFormsLoaded}
                />
              } 
            />
            
            {/* Story Reader Route */}
            <Route 
              path="/reader" 
              element={
                currentStory ? (
                  <StoryReader 
                    story={currentStory} 
                    onCreateAnother={handleCreateAnother}
                  />
                ) : (
                  <Navigate to="/gallery" replace />
                )
              } 
            />
            
            {/* PDF Viewer Route */}
            <Route path="/pdf-viewer" element={<PDFGalleryViewer />} />
            <Route path="/pdf-viewer/:pdfId" element={<PDFGalleryViewer />} />

            {/* Pricing Route */}
            <Route 
              path="/pricing" 
              element={<PricingPage />} 
            />

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </div>
    </Router>
  );
}

export default App;