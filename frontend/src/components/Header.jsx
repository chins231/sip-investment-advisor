import React, { useState } from 'react';

const Header = ({ onNavClick }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId) => {
    setMobileMenuOpen(false);
    if (onNavClick) {
      onNavClick(sectionId);
    } else {
      // Fallback if onNavClick is not provided
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <header className="sticky-header">
      {/* Teal Navigation Bar */}
      <div className="header-nav-bar">
        <div className="header-container">
          {/* Logo/Brand - Single Title */}
          <div className="header-brand-section">
            <div className="header-brand">
              <span className="brand-icon">💰</span>
              <h1 className="brand-title">SIP Investment Advisor</h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="header-nav desktop-nav">
            <button onClick={() => scrollToSection('goals')} className="nav-link">
              📊 Goals
            </button>
            <button onClick={() => scrollToSection('search')} className="nav-link">
              🔍 Search
            </button>
            <button onClick={() => scrollToSection('platforms')} className="nav-link">
              🏦 Platforms
            </button>
            <button onClick={() => scrollToSection('faq')} className="nav-link">
              ❓ FAQ
            </button>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
        
        {/* Static Disclaimer Banner */}
        <div className="disclaimer-banner">
          ℹ️ Demo App | Educational Use Only | Always Consult a Certified Financial Advisor
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav className="header-nav mobile-nav">
          <button onClick={() => scrollToSection('goals')} className="nav-link">
            📊 Goals
          </button>
          <button onClick={() => scrollToSection('search')} className="nav-link">
            🔍 Search
          </button>
          <button onClick={() => scrollToSection('platforms')} className="nav-link">
            🏦 Platforms
          </button>
          <button onClick={() => scrollToSection('faq')} className="nav-link">
            ❓ FAQ
          </button>
        </nav>
      )}
    </header>
  );
};

export default Header;

// Made with Bob
