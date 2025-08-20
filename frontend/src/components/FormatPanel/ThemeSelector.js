import React from 'react';

const themes = {
  light: {
    name: 'Light',
    description: 'Classic white background',
    colors: {
      background: '#ffffff',
      text: '#2c2c2c',
      headings: '#1a1a1a'
    }
  },
  dark: {
    name: 'Dark',
    description: 'Dark background for night reading',
    colors: {
      background: '#1a1a1a',
      text: '#e0e0e0',
      headings: '#ffffff'
    }
  },
  sepia: {
    name: 'Sepia',
    description: 'Warm, vintage paper feel',
    colors: {
      background: '#f4f3e8',
      text: '#5c4b37',
      headings: '#3d2f1f'
    }
  }
};

const colorPalettes = {
  classic: {
    name: 'Classic',
    description: 'Traditional black on white',
    swatch: '#000000'
  },
  modern: {
    name: 'Modern',
    description: 'Contemporary blues and grays',
    swatch: '#667eea'
  },
  warm: {
    name: 'Warm',
    description: 'Rich browns and oranges',
    swatch: '#d97706'
  }
};

function ThemeSelector({ config, onChange }) {
  return (
    <div className="theme-selector">
      {/* Theme Selection */}
      <div className="form-group">
        <label className="form-label">Theme</label>
        <select 
          className="form-select"
          value={config.theme}
          onChange={(e) => onChange({ theme: e.target.value })}
        >
          {Object.entries(themes).map(([key, theme]) => (
            <option key={key} value={key}>
              {theme.name}
            </option>
          ))}
        </select>
        <small className="form-hint">
          {themes[config.theme]?.description}
        </small>
      </div>

      {/* Color Palette */}
      <div className="form-group">
        <label className="form-label">Color Palette</label>
        <div className="color-swatches">
          {Object.entries(colorPalettes).map(([key, palette]) => (
            <div
              key={key}
              className={`color-swatch ${config.colorPalette === key ? 'active' : ''}`}
              style={{ backgroundColor: palette.swatch }}
              onClick={() => onChange({ colorPalette: key })}
              title={`${palette.name} - ${palette.description}`}
            />
          ))}
        </div>
        <small className="form-hint">
          {colorPalettes[config.colorPalette]?.description}
        </small>
      </div>
    </div>
  );
}

export default ThemeSelector;
