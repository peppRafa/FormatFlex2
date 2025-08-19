import React, { useState } from 'react';
import Header from './components/Header';
import TextEditor from './components/TextEditor';
import ExportButton from './components/ExportButton';
import Footer from './components/Footer';
import './App.css';

function App() {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('My Manuscript');
  const [isExporting, setIsExporting] = useState(false);

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
          title: title
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
    </div>
  );
}

export default App;
