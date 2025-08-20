import React from 'react';
import FontControls from './FontControls';
import TemplateSelector from './TemplateSelector';
import PageSettings from './PageSettings';
import HeaderFooterControls from './HeaderFooterControls';
import ThemeSelector from './ThemeSelector';
import './FormatPanel.css';

function FormatPanel({ config, onChange, onReset, onPreview, isGeneratingPreview }) {
  return (
    <div className="format-panel">
      <div className="format-panel-header">
        <h3>📝 Format Customization</h3>
        <p>Personalize your manuscript's appearance</p>
      </div>

      <div className="format-sections">
        {/* Font & Typography */}
        <div className="format-section">
          <h4>📖 Font & Typography</h4>
          <FontControls config={config} onChange={onChange} />
        </div>

        {/* Template Presets */}
        <div className="format-section">
          <h4>📋 Template</h4>
          <TemplateSelector config={config} onChange={onChange} />
        </div>

        {/* Page Settings */}
        <div className="format-section">
          <h4>📄 Page Settings</h4>
          <PageSettings config={config} onChange={onChange} />
        </div>

        {/* Header & Footer */}
        <div className="format-section">
          <h4>📑 Header & Footer</h4>
          <HeaderFooterControls config={config} onChange={onChange} />
        </div>

        {/* Theme */}
        <div className="format-section">
          <h4>🎨 Theme & Colors</h4>
          <ThemeSelector config={config} onChange={onChange} />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="format-actions">
        <button 
          className="btn btn-secondary"
          onClick={onReset}
        >
          🔄 Reset to Default
        </button>
        
        <button 
          className="btn btn-primary"
          onClick={onPreview}
          disabled={isGeneratingPreview}
        >
          {isGeneratingPreview ? (
            <>
              <div className="spinner-small"></div>
              Generating...
            </>
          ) : (
            <>👀 Preview PDF</>
          )}
        </button>
      </div>
    </div>
  );
}

export default FormatPanel;
