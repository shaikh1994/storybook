// src/components/toast/Toast.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaExclamationTriangle, FaInfoCircle } from "react-icons/fa";
import "./Toast.css";

const Toast = ({ 
  message, 
  type = 'info', // 'info', 'warning', 'error', 'success'
  duration = 8000, // 8 seconds for API key messages
  onClose,
  persistent = false // If true, won't auto-dismiss
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!persistent && duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, persistent]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      if (onClose) onClose();
    }, 300); // Wait for exit animation
  };

  const getIcon = () => {
    switch (type) {
      case 'warning':
        return <FaExclamationTriangle />;
      case 'error':
        return <FaExclamationTriangle />;
      case 'info':
      default:
        return <FaInfoCircle />;
    }
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -100, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -100, scale: 0.8 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={`toast toast-${type}`}
      >
        <div className="toast-content">
          <div className="toast-icon">
            {getIcon()}
          </div>
          <div className="toast-message">
            {message}
          </div>
          <button
            onClick={handleClose}
            className="toast-close"
          >
            <FaTimes />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Toast;