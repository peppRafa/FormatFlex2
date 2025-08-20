import React from 'react';

const fontOptions = [
  { name: 'Crimson Text', value: 'Crimson Text', type: 'serif' },
  { name: 'Libre Baskerville', value: 'Libre Baskerville', type: 'serif' },
  { name: 'Merriweather', value: 'Merriweather', type: 'serif' },
  { name: 'Open Sans', value: 'Open Sans', type: 'sans-serif' },
  { name: 'Source Sans Pro', value: 'Source Sans Pro', type: 'sans-serif' }
];

function FontControls({ config, onChange }) {
  return (
    <div className="font-controls">
      {/* Font Family */}
      <div className="form-group">
        <label className="form-label">Font Family</label>
        <select 
          className="form-select"
          value={config.fontFamily}
          onChange={(e) => onChange({ fontFamily: e.target.value })}
        >
          {fontOptions.map(font => (
            <option key={font.value} value={font.value}>
              {font.name} ({font.type})
            </option>
          ))}
        </select>
      </div>

      {/* Font Size */}
      <div className="form-group">
        <label className="form-label">Font Size</label>
        <div className="range-group">
          <input
            type="range"
            className="form-range"
            min="10"
            max="18"
            step="1"
            value={config.fontSize}
            onChange={(e) => onChange({ fontSize: parseInt(e.target.value) })}
          />
          <span className="range-value">{config.fontSize}pt</span>
        </div>
      </div>

      {/* Line Spacing */}
      <div className="form-group">
        <label className="form-label">Line Spacing</label>
        <select 
          className="form-select"
          value={config.lineSpacing}
          onChange={(e) => onChange({ lineSpacing: parseFloat(e.target.value) })}
        >
          <option value={1.0}>Single (1.0)</option>
          <option value={1.15}>1.15</option>
          <option value={1.5}>1.5</option>
          <option value={1.6}>1.6 (Default)</option>
          <option value={2.0}>Double (2.0)</option>
        </select>
      </div>

      {/* Text Alignment */}
      <div className="form-group">
        <label className="form-label">Text Alignment</label>
        <select 
          className="form-select"
          value={config.textAlign}
          onChange={(e) => onChange({ textAlign: e.target.value })}
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
          <option value="justify">Justify</option>
        </select>
      </div>
    </div>
  );
}

export default FontControls;
