// src/utils/sessionStorage.js

const FORM_DATA_KEY = 'storybook_form_data';

/**
 * Save form data to session storage
 * @param {Object} formData - The form data to save
 */
export const saveFormData = (formData) => {
  try {
    // Only save if there's meaningful data (at least API key or character description)
    if (formData.openaiApiKey || formData.characterDescription) {
      const dataToSave = {
        ...formData,
        savedAt: new Date().toISOString()
      };
      sessionStorage.setItem(FORM_DATA_KEY, JSON.stringify(dataToSave));
    }
  } catch (error) {
    console.warn('Failed to save form data to session storage:', error);
  }
};

/**
 * Load form data from session storage
 * @returns {Object|null} - The saved form data or null if none exists
 */
export const loadFormData = () => {
  try {
    const savedData = sessionStorage.getItem(FORM_DATA_KEY);
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      
      // Check if data is from current session (not too old)
      const savedAt = new Date(parsedData.savedAt);
      const now = new Date();
      const hoursDiff = (now - savedAt) / (1000 * 60 * 60);
      
      // Keep data for up to 6 hours
      if (hoursDiff < 6) {
        // Remove the savedAt timestamp before returning
        const { savedAt: _, ...formData } = parsedData;
        return formData;
      } else {
        // Clean up old data
        clearFormData();
      }
    }
    return null;
  } catch (error) {
    console.warn('Failed to load form data from session storage:', error);
    return null;
  }
};

/**
 * Clear saved form data
 */
export const clearFormData = () => {
  try {
    sessionStorage.removeItem(FORM_DATA_KEY);
  } catch (error) {
    console.warn('Failed to clear form data:', error);
  }
};

/**
 * Get default form data with saved values merged in
 * @returns {Object} - Default form data with any saved values
 */
export const getInitialFormData = () => {
  const defaultData = {
    age: 5,
    theme: 'fairy',
    characterDescription: '',
    pageCount: 5,
    language: 'English',
    illustrationStyle: 'Classic Cartoon Style',
    moralLesson: '',
    openaiApiKey: ''
  };

  const savedData = loadFormData();
  
  if (savedData) {
    // Merge saved data with defaults, prioritizing saved values
    return {
      ...defaultData,
      ...savedData
    };
  }
  
  return defaultData;
};