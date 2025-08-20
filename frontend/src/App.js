import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import TextEditor from './components/TextEditor';
import ExportButton from './components/ExportButton';
import Footer from './components/Footer';
import FormatPanel from './components/FormatPanel/FormatPanel';
import PreviewModal from './components/PreviewModal/PreviewModal';
import './App.css';

// Default configuration for v1.2
const defaultFormatConfig = {
  // Font options
  fontFamily: 'Crimson Text',
  fontSize: 12,
  
  // Template options
  template: 'ebook',
  pageSize: 'A4',
  
  // Spacing options
  lineSpacing: 1.6,
  margins: 'normal',
  
  // Layout options
  textAlign: 'justify',
  headerEnabled: false,
  footerEnabled: false,
  headerText: '',
  footerText: '',
  
  // Theme options
  theme: 'light',
  colorPalette: 'classic'
};

function App() {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('My Manuscript');
  const [isExporting, setIsExporting] = useState(false);
  
  // v1.2 New state
  const [formatConfig, setFormatConfig] = useState(defaultFormatConfig);
  const [showFormatPanel, setShowFormatPanel] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);

  // Load saved configuration on mount
  useEffect(() => {
    const savedConfig = localStorage.getItem('formatflex-config');
    if (savedConfig) {
      try {
        setFormatConfig({ ...defaultFormatConfig, ...JSON.parse(savedConfig) });
      } catch (error) {
        console.error('Error loading saved config:', error);
      }
    }
  }, []);

  // Save configuration when it changes
  useEffect(() => {
    localStorage.setItem('formatflex-config', JSON.stringify(formatConfig));
  }, [formatConfig]);

  const handleExport = async () => {
    if (!content.trim()) {
      alert('Please enter some content before exporting.');
      return;
    }

    setIsExporting(true);
    
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      
      const response = await fetch(`${apiUrl}/api/export-pdf`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: content,
          title: title,
          formatConfig: formatConfig
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate PDF');
      }

      // Get the PDF blob
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
      
      // Trigger download
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
    } catch (error) {
      console.error('Export error:', error);
      alert(`Failed to export PDF: ${error.message}`);
    } finally {
      setIsExporting(false);
    }
  };

  // v1.2 New handlers
  const handlePreview = async () => {
    if (!content.trim()) {
      alert('Please enter some content before previewing.');
      return;
    }

    setIsGeneratingPreview(true);
    
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      
      const response = await fetch(`${apiUrl}/api/preview-pdf`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: content,
          title: title,
          formatConfig: formatConfig
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate preview');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      // Open preview in modal
      setShowPreview(url);
      
    } catch (error) {
      console.error('Preview error:', error);
      alert(`Failed to generate preview: ${error.message}`);
    } finally {
      setIsGeneratingPreview(false);
    }
  };

  const handleFormatConfigChange = (newConfig) => {
    setFormatConfig(prev => ({ ...prev, ...newConfig }));
  };

  const handleResetConfig = () => {
    setFormatConfig(defaultFormatConfig);
  };

  return (
    <div className="App">
      <Header />
      
      <main className="main-content">
        <div className="container">
          <div className="editor-section">
            <div className="title-input-section">
              <label htmlFor="title-input" className="title-label">
                Manuscript Title
              </label>
              <input
                id="title-input"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="title-input"
                placeholder="Enter your manuscript title..."
              />
            </div>
            
            <TextEditor 
              content={content} 
              onChange={setContent}
              placeholder="Start typing your manuscript here... 

You can paste your existing text or type directly. FormatFlex will automatically detect chapter headings and format your manuscript professionally.

Tips:
• Chapter headings like 'Chapter 1' will be formatted as main headings
• Short lines in ALL CAPS will be treated as chapter titles
• Regular paragraphs will be formatted with proper indentation and spacing"
            />
            
            {/* v1.2 Format Panel */}
            <div className="format-panel-section">
              <button 
                className="format-toggle-btn"
                onClick={() => setShowFormatPanel(!showFormatPanel)}
              >
                {showFormatPanel ? '← Hide' : '🎨 Customize Format'}
              </button>
              
              {showFormatPanel && (
                <FormatPanel 
                  config={formatConfig}
                  onChange={handleFormatConfigChange}
                  onReset={handleResetConfig}
                  onPreview={handlePreview}
                  isGeneratingPreview={isGeneratingPreview}
                />
              )}
            </div>

            <div className="export-section">
              <ExportButton 
                onExport={handleExport} 
                isLoading={isExporting}
                disabled={!content.trim() || isExporting}
              />
              
              <div className="export-info">
                <p className="word-count">
                  Word count: {content.trim().split(/\s+/).filter(word => word.length > 0).length}
                </p>
                <p className="export-hint">
                  Your manuscript will be formatted with professional typography, 
                  proper margins, and chapter headings.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      
      {/* v1.2 Preview Modal */}
      {showPreview && (
        <PreviewModal 
          pdfUrl={showPreview}
          onClose={() => {
            setShowPreview(false);
            if (typeof showPreview === 'string') {
              window.URL.revokeObjectURL(showPreview);
            }
          }}
        />
      )}
    </div>
  );
}

export default App;
