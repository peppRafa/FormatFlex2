import React from 'react';
import './ExportButton.css';

function ExportButton({ onExport, isLoading, disabled }) {
  return (
    <div className="export-button-container">
      <button
        onClick={onExport}
        disabled={disabled}
        className={`export-button ${isLoading ? 'loading' : ''}`}
      >
        {isLoading ? (
          <>
            <div className="spinner"></div>
            Generating PDF...
          </>
        ) : (
          <>
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
              className="export-icon"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7,10 12,15 17,10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Format & Export PDF
          </>
        )}
      </button>
      
      {!disabled && (
        <p className="export-description">
          Click to generate a professionally formatted PDF of your manuscript
        </p>
      )}
    </div>
  );
}

export default ExportButton;
