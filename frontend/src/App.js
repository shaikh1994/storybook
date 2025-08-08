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

import "./App.css";

function App() {
  const [currentStory, setCurrentStory] = useState(null);
  const [savedStories, setSavedStories] = useState([]);

  const handleStoryGenerated = (story) => {
    setCurrentStory(story);
    setSavedStories(prev => [story, ...prev]);
  };

  const handleSelectStory = (story) => {
    setCurrentStory(story);
  };

  return (
    <Router>
      <div className="App">
        <Navbar />
        <AnimatePresence mode="wait">
          <Routes>
            <Route 
              path="/" 
              element={<WelcomeScreen />} 
            />
            <Route 
              path="/create" 
              element={
                <StoryCreationForm 
                  onStoryGenerated={handleStoryGenerated}
                />
              } 
            />
            <Route 
              path="/reader" 
              element={
                currentStory ? (
                  <StoryReader story={currentStory} />
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
            {/* Redirect any unknown routes to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </div>
    </Router>
  );
}

export default App;