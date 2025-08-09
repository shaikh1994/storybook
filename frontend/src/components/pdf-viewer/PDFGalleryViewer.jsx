// Create this file: frontend/src/components/pdf-viewer/PDFGalleryViewer.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Download, ZoomIn, ZoomOut, RotateCw, Home, Eye, Grid } from 'lucide-react';

const PDFGalleryViewer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [viewMode, setViewMode] = useState('single'); // 'single' or 'grid'
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
        } else {
          // Fetch from API if no data in state
          const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/storybook/sample/pdf-data`);
          if (response.ok) {
            const data = await response.json();
            setPdfData(data);
          } else {
            throw new Error('Failed to load PDF data');
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
  }, [location.state]);

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(pdfData.pages.length - 1, prev + 1));
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(3, prev + 0.25));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(0.5, prev - 0.25));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleDownload = () => {
    // Create a link to download the original PDF
    const link = document.createElement('a');
    link.href = `${process.env.REACT_APP_BACKEND_URL}/static/sample/sample_storybook.pdf`;
    link.download = 'sample_storybook.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleBackToGallery = () => {
    navigate('/');
  };

  const renderPageContent = (page, index, isGridView = false) => {
    const { content, type } = page;
    const isCurrentPage = index === currentPage;
    
    const pageStyle = {
      transform: isGridView ? 'none' : `scale(${zoom}) rotate(${rotation}deg)`,
      transformOrigin: 'center',
      transition: 'transform 0.3s ease'
    };

    const getLayoutClasses = (layout) => {
      switch (layout) {
        case 'image-left':
          return 'flex-row';
        case 'image-right':
          return 'flex-row-reverse';
        case 'image-top':
          return 'flex-col';
        case 'image-bottom':
          return 'flex-col-reverse';
        default:
          return 'flex-row';
      }
    };

    return (
      <div
        key={page.id}
        className={`
          ${isGridView 
            ? 'w-full aspect-[3/4] cursor-pointer hover:scale-105 transition-transform' 
            : 'w-full max-w-4xl mx-auto'
          }
          bg-white rounded-lg shadow-lg overflow-hidden
          ${isCurrentPage && isGridView ? 'ring-4 ring-purple-500' : ''}
        `}
        style={pageStyle}
        onClick={isGridView ? () => setCurrentPage(index) : undefined}
      >
        <div className={`
          h-full p-6 flex items-center justify-center gap-6
          ${getLayoutClasses(content.layout)}
        `}>
          {/* Image Section */}
          {content.images && content.images.length > 0 && (
            <div className={`
              ${content.layout === 'image-top' || content.layout === 'image-bottom' 
                ? 'w-full h-1/2' 
                : 'w-1/2 h-full'
              }
              flex items-center justify-center
            `}>
              <img
                src={content.images[0].base64.startsWith('data:') 
                  ? content.images[0].base64 
                  : content.images[0].base64
                }
                alt={`Page ${index + 1} illustration`}
                className="max-w-full max-h-full object-contain rounded-lg shadow-md"
              />
            </div>
          )}
          
          {/* Text Section */}
          <div className={`
            ${content.layout === 'image-top' || content.layout === 'image-bottom' 
              ? 'w-full h-1/2' 
              : content.images && content.images.length > 0 ? 'w-1/2 h-full' : 'w-full h-full'
            }
            flex items-center justify-center p-4
          `}>
            <p className={`
              text-gray-800 leading-relaxed text-center
              ${isGridView ? 'text-xs' : 'text-lg md:text-xl'}
            `}>
              {content.text}
            </p>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading PDF content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 flex items-center justify-center">
        <div className="text-center bg-white rounded-lg p-8 shadow-lg">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading PDF</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={handleBackToGallery}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Back to Gallery
          </button>
        </div>
      </div>
    );
  }

  if (!pdfData) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Left Section */}
            <div className="flex items-center gap-4">
              <button 
                onClick={handleBackToGallery}
                className="p-2 hover:bg-purple-100 rounded-full transition-colors"
              >
                <Home className="w-6 h-6 text-purple-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-purple-800">{pdfData.title}</h1>
                <p className="text-gray-600 text-sm">{pdfData.description}</p>
              </div>
            </div>

            {/* Center - Page Info */}
            <div className="flex items-center gap-4">
              <span className="text-purple-700 font-medium">
                Page {currentPage + 1} of {pdfData.totalPages}
              </span>
            </div>

            {/* Right Section - Controls */}
            <div className="flex items-center gap-2">
              {/* View Mode Toggle */}
              <button
                onClick={() => setViewMode(viewMode === 'single' ? 'grid' : 'single')}
                className="p-2 hover:bg-purple-100 rounded-full transition-colors"
                title={viewMode === 'single' ? 'Grid View' : 'Single View'}
              >
                {viewMode === 'single' ? <Grid className="w-5 h-5 text-purple-600" /> : <Eye className="w-5 h-5 text-purple-600" />}
              </button>

              {viewMode === 'single' && (
                <>
                  {/* Zoom Controls */}
                  <button onClick={handleZoomOut} className="p-2 hover:bg-purple-100 rounded-full transition-colors">
                    <ZoomOut className="w-5 h-5 text-purple-600" />
                  </button>
                  <span className="text-sm text-purple-700 min-w-[3rem] text-center">
                    {Math.round(zoom * 100)}%
                  </span>
                  <button onClick={handleZoomIn} className="p-2 hover:bg-purple-100 rounded-full transition-colors">
                    <ZoomIn className="w-5 h-5 text-purple-600" />
                  </button>

                  {/* Rotate */}
                  <button onClick={handleRotate} className="p-2 hover:bg-purple-100 rounded-full transition-colors">
                    <RotateCw className="w-5 h-5 text-purple-600" />
                  </button>
                </>
              )}

              {/* Download */}
              <button onClick={handleDownload} className="p-2 hover:bg-purple-100 rounded-full transition-colors">
                <Download className="w-5 h-5 text-purple-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {viewMode === 'single' ? (
          // Single Page View
          <div className="space-y-6">
            {/* Navigation */}
            <div className="flex items-center justify-center gap-6">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 0}
                className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-6 h-6 text-purple-600" />
              </button>

              <div className="flex gap-2">
                {pdfData.pages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentPage ? 'bg-purple-600' : 'bg-purple-200 hover:bg-purple-300'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={handleNextPage}
                disabled={currentPage === pdfData.pages.length - 1}
                className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight className="w-6 h-6 text-purple-600" />
              </button>
            </div>

            {/* Current Page */}
            <div className="flex justify-center">
              {renderPageContent(pdfData.pages[currentPage], currentPage)}
            </div>
          </div>
        ) : (
          // Grid View
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {pdfData.pages.map((page, index) => (
                <div key={page.id} className="relative">
                  {renderPageContent(page, index, true)}
                  <div className="absolute top-2 left-2 bg-purple-600 text-white text-xs px-2 py-1 rounded">
                    {index + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PDFGalleryViewer;