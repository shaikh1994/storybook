// src/App.js
import React, { useState } from "react";
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

import "./App.css";

function App() {
  const [currentStory, setCurrentStory] = useState(null);
  const [savedStories, setSavedStories] = useState([]);
  const [shouldPreserveForms, setShouldPreserveForms] = useState(false);

  const handleStoryGenerated = (story) => {
    setCurrentStory(story);
    setSavedStories(prev => [story, ...prev]);
  };

  const handleSelectStory = (story) => {
    setCurrentStory(story);
  };

  const handleCreateAnother = () => {
    // Signal that we want to preserve form data when navigating to create page
    setShouldPreserveForms(true);
  };

  // Reset the preserve flag when forms are loaded
  const handleFormsLoaded = () => {
    setShouldPreserveForms(false);
  };

  return (
    <Router>
      <div className="App">
        <Navbar />
        <AnimatePresence mode="wait">
          <Routes>
            <Route 
              path="/" 
              element={<MarketingHomepage />} 
            />
            <Route 
              path="/create" 
              element={
                <StoryCreationForm 
                  onStoryGenerated={handleStoryGenerated}
                  preserveForms={shouldPreserveForms}
                  onFormsLoaded={handleFormsLoaded}
                />
              } 
            />
            <Route 
              path="/pricing" 
              element={<PricingPage />} 
            />
            <Route 
              path="/reader" 
              element={
                currentStory ? (
                  <StoryReader 
                    story={currentStory} 
                    onCreateAnother={handleCreateAnother}
                  />
                ) : (
                  <Navigate to="/" replace />
                )
              } 
            />
            <Route 
              path="/gallery" 
              element={
                <StoryGallery 
                  stories={savedStories}
                  onSelectStory={handleSelectStory}
                />
              } 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </div>
    </Router>
  );
}

export default App;