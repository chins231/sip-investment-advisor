import React, { useState } from 'react';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky-header">
      {/* Blue Navigation Bar */}
      <div className="header-nav-bar">
        <div className="header-container">
          {/* Logo/Brand with Title and Subtitle */}
          <div className="header-brand-section">
            <div className="header-brand">
              <span className="brand-icon">💰</span>
              <div className="brand-content">
                <h1 className="brand-title">SIP Advisor</h1>
                <p className="brand-subtitle">SIP Investment Advisor</p>
              </div>
            </div>
            <p className="brand-description">
              Get personalized mutual fund recommendations based on your risk profile and investment goals
            </p>
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

      {/* Disclaimer Banner */}
      <div className="disclaimer-banner">
        <span className="disclaimer-icon">ℹ️</span>
        <span className="disclaimer-text">
          Demo App | Educational Use Only | Always Consult a Certified Financial Advisor
        </span>
      </div>
    </header>
  );
};

export default Header;

// Made with Bob
