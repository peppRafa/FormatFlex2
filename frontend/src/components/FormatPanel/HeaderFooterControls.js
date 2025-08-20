import React from 'react';

function HeaderFooterControls({ config, onChange }) {
  return (
    <div className="header-footer-controls">
      {/* Header Settings */}
      <div className="form-group">
        <label className="form-checkbox">
          <input
            type="checkbox"
            checked={config.headerEnabled}
            onChange={(e) => onChange({ headerEnabled: e.target.checked })}
          />
          Enable Header
        </label>
      </div>

      {config.headerEnabled && (
        <div className="form-group">
          <label className="form-label">Header Text</label>
          <input
            type="text"
            className="form-input"
            placeholder="Enter header text..."
            value={config.headerText}
            onChange={(e) => onChange({ headerText: e.target.value })}
          />
        </div>
      )}

      {/* Footer Settings */}
      <div className="form-group">
        <label className="form-checkbox">
          <input
            type="checkbox"
            checked={config.footerEnabled}
            onChange={(e) => onChange({ footerEnabled: e.target.checked })}
          />
          Enable Footer
        </label>
      </div>

      {config.footerEnabled && (
        <div className="form-group">
          <label className="form-label">Footer Text</label>
          <input
            type="text"
            className="form-input"
            placeholder="Enter footer text..."
            value={config.footerText}
            onChange={(e) => onChange({ footerText: e.target.value })}
          />
        </div>
      )}

      <div className="form-hint">
        <small>Headers and footers will appear on every page</small>
      </div>
    </div>
  );
}

export default HeaderFooterControls;
