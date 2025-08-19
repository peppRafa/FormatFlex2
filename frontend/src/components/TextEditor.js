import React from 'react';
import './TextEditor.css';

function TextEditor({ content, onChange, placeholder }) {
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div className="text-editor">
      <div className="editor-header">
        <h3 className="editor-title">Manuscript Content</h3>
        <div className="editor-tools">
          <span className="char-count">
            {content.length.toLocaleString()} characters
          </span>
        </div>
      </div>
      
      <div className="editor-container">
        <textarea
          value={content}
          onChange={handleChange}
          placeholder={placeholder}
          className="editor-textarea"
          spellCheck="true"
          autoComplete="off"
          rows={20}
        />
        
        <div className="editor-footer">
          <div className="format-tips">
            <strong>Formatting Tips:</strong>
            <ul>
              <li>Type "Chapter 1", "Chapter 2", etc. for chapter headings</li>
              <li>Use ALL CAPS for titles (keep them short)</li>
              <li>Regular paragraphs will be auto-formatted with proper spacing</li>
              <li>Press Enter twice to create paragraph breaks</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TextEditor;
