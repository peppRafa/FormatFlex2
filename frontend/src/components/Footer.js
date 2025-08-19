import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h4>FormatFlex</h4>
            <p>Professional manuscript formatting made simple</p>
          </div>
          
          <div className="footer-section">
            <h4>Features</h4>
            <ul>
              <li>Automatic chapter detection</li>
              <li>Professional typography</li>
              <li>Instant PDF generation</li>
              <li>Clean, readable formatting</li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>About</h4>
            <p>
              FormatFlex MVP v1.0 - Transform your manuscripts into 
              professionally formatted PDFs with just one click.
            </p>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2024 FormatFlex. Built for writers, by writers.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
