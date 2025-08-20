import React from 'react';

const pageSizes = {
  'A4': { name: 'A4 (210 × 297mm)', description: 'Standard document' },
  'Letter': { name: 'Letter (8.5 × 11in)', description: 'US standard' },
  'A5': { name: 'A5 (148 × 210mm)', description: 'Small book' },
  '6x9': { name: '6" × 9"', description: 'Trade paperback' },
  '5x8': { name: '5" × 8"', description: 'Mass market' }
};

const marginPresets = {
  'narrow': { name: 'Narrow', description: '0.5" margins' },
  'normal': { name: 'Normal', description: '0.75" margins' },
  'wide': { name: 'Wide', description: '1" margins' }
};

function PageSettings({ config, onChange }) {
  return (
    <div className="page-settings">
      {/* Page Size */}
      <div className="form-group">
        <label className="form-label">Page Size</label>
        <select 
          className="form-select"
          value={config.pageSize}
          onChange={(e) => onChange({ pageSize: e.target.value })}
        >
          {Object.entries(pageSizes).map(([key, size]) => (
            <option key={key} value={key}>
              {size.name}
            </option>
          ))}
        </select>
        <small className="form-hint">
          {pageSizes[config.pageSize]?.description}
        </small>
      </div>

      {/* Margins */}
      <div className="form-group">
        <label className="form-label">Margins</label>
        <select 
          className="form-select"
          value={config.margins}
          onChange={(e) => onChange({ margins: e.target.value })}
        >
          {Object.entries(marginPresets).map(([key, margin]) => (
            <option key={key} value={key}>
              {margin.name}
            </option>
          ))}
        </select>
        <small className="form-hint">
          {marginPresets[config.margins]?.description}
        </small>
      </div>
    </div>
  );
}

export default PageSettings;
