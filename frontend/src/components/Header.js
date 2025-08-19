import React from 'react';
import './Header.css';

function Header() {
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo-section">
            <h1 className="logo">FormatFlex</h1>
            <span className="tagline">Professional Manuscript Formatting</span>
          </div>
          
          <div className="version-badge">
            v1.0 MVP
          </div>
        </div>
        
        <div className="header-description">
          <p>Transform your manuscript into a professionally formatted PDF with just one click</p>
        </div>
      </div>
    </header>
  );
}

export default Header;
