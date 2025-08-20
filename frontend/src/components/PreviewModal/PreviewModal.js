import React from 'react';
import './PreviewModal.css';

function PreviewModal({ pdfUrl, onClose }) {
  return (
    <div className="preview-modal-overlay" onClick={onClose}>
      <div className="preview-modal" onClick={(e) => e.stopPropagation()}>
        <div className="preview-header">
          <h3>📄 PDF Preview</h3>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>
        
        <div className="preview-content">
          <iframe
            src={pdfUrl}
            title="PDF Preview"
            className="pdf-iframe"
          />
        </div>
        
        <div className="preview-actions">
          <button className="btn btn-secondary" onClick={onClose}>
            Close Preview
          </button>
          <a 
            href={pdfUrl} 
            download="preview.pdf"
            className="btn btn-primary"
          >
            💾 Download PDF
          </a>
        </div>
      </div>
    </div>
  );
}

export default PreviewModal;
