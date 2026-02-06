import React, { useState, useEffect, useRef } from 'react';

const Header = ({ onNavClick }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (!scrollElement) return;

    const contentWidth = scrollElement.scrollWidth / 2; // Half because we have 2 copies
    let scrollPosition = -contentWidth; // Start from left (negative position)
    const scrollSpeed = 1; // pixels per frame

    const scroll = () => {
      scrollPosition += scrollSpeed;
      
      // Reset position when we've scrolled back to start
      if (scrollPosition >= 0) {
        scrollPosition = -contentWidth;
      }
      
      scrollElement.style.transform = `translateX(${scrollPosition}px)`;
      requestAnimationFrame(scroll);
    };

    const animationId = requestAnimationFrame(scroll);

    return () => cancelAnimationFrame(animationId);
  }, []);

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

      {/* Scrolling Disclaimer Banner */}
      <div className="disclaimer-banner">
        <div className="disclaimer-scroll" ref={scrollRef}>
          <span className="disclaimer-content">
            ℹ️ Demo App | Educational Use Only | Always Consult a Certified Financial Advisor
          </span>
          <span className="disclaimer-content">
            ℹ️ Demo App | Educational Use Only | Always Consult a Certified Financial Advisor
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;

// Made with Bob
