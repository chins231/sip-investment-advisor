import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import InvestmentForm from './components/InvestmentForm';
import RecommendationResults from './components/RecommendationResults';
import InvestmentPlatforms from './components/InvestmentPlatforms';
import FAQSection from './components/FAQSection';
import FundSearch from './components/FundSearch';
import { generateRecommendations } from './services/api';

function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState('');
  const [userPreferences, setUserPreferences] = useState(null);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [loadingStage, setLoadingStage] = useState(0);
  
  // Collapsible sections state with timestamp to force re-expansion
  const [sectionsExpanded, setSectionsExpanded] = useState({
    search: { expanded: false, timestamp: 0 },
    platforms: { expanded: false, timestamp: 0 },
    faq: { expanded: false, timestamp: 0 }
  });

  // Progressive loading messages for cold start detection
  useEffect(() => {
    if (!loading) {
      setLoadingStage(0);
      setLoadingMessage('');
      return;
    }

    // Stage 1: Initial (0-3 seconds)
    setLoadingStage(1);
    setLoadingMessage('Analyzing your profile and generating recommendations...');

    // Stage 2: Normal processing (3-10 seconds)
    const timer1 = setTimeout(() => {
      if (loading) {
        setLoadingStage(2);
        setLoadingMessage('Fetching real-time fund data from market APIs...');
      }
    }, 3000);

    // Stage 3: Cold start detected (10-20 seconds)
    const timer2 = setTimeout(() => {
      if (loading) {
        setLoadingStage(3);
        setLoadingMessage('⏳ Backend is waking up (first request after idle). This may take 30-60 seconds...');
      }
    }, 10000);

    // Stage 4: Still processing (20-40 seconds)
    const timer3 = setTimeout(() => {
      if (loading) {
        setLoadingStage(4);
        setLoadingMessage('🔄 Almost there! Backend is initializing and processing your request...');
      }
    }, 20000);

    // Stage 5: Taking longer than expected (40+ seconds)
    const timer4 = setTimeout(() => {
      if (loading) {
        setLoadingStage(5);
        setLoadingMessage('⚡ Finalizing your personalized recommendations. Thank you for your patience!');
      }
    }, 40000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [loading]);

  const handleFormSubmit = async (formData) => {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const data = await generateRecommendations(formData);
      setResults(data);
      setUserId(data.user_id);
      setUserName(formData.name);
      
      // Store user preferences for PDF generation
      setUserPreferences({
        monthly_investment: formData.monthly_investment,
        duration: formData.investment_years,
        risk_profile: formData.risk_profile,
        fund_mode: formData.index_funds_only ? 'Index Funds Only' :
                   formData.sector_preferences?.length > 0 ? 'Sector-Specific' :
                   'Diversified Portfolio'
      });
    } catch (err) {
      setError(err.toString());
      console.error('Error generating recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResults(null);
    setError(null);
    setUserId(null);
    setUserName('');
    setUserPreferences(null);
  };

  const toggleSection = (section) => {
    setSectionsExpanded(prev => ({
      ...prev,
      [section]: {
        expanded: !prev[section].expanded,
        timestamp: Date.now()
      }
    }));
  };

  const handleNavClick = (sectionId) => {
    // Expand the section if it's collapsible (use timestamp to force re-expansion)
    if (sectionId === 'search' || sectionId === 'platforms' || sectionId === 'faq') {
      setSectionsExpanded(prev => ({
        ...prev,
        [sectionId]: {
          expanded: true,
          timestamp: Date.now()
        }
      }));
    }
    
    // Scroll to section after a brief delay to allow expansion
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  return (
    <div className="app">
      {/* New Sticky Header with Navigation */}
      <Header onNavClick={handleNavClick} />

      <main className="main-content">
        <div className="container">
          {error && (
            <div className="error">
              <strong>Error:</strong> {error}
            </div>
          )}

          {/* Goals Section */}
          <section id="goals" className="section-goals">
            {!results && (
              <div className="card">
                <div style={{
                  padding: '1.5rem',
                  background: 'linear-gradient(135deg, #00796B 0%, #00897B 100%)',
                  color: 'white',
                  borderRadius: '8px',
                  marginBottom: '1.5rem'
                }}>
                  <h2 style={{ margin: '0 0 0.5rem 0', color: 'white', fontSize: '1.75rem' }}>
                    🎯 Tell Us About Your Investment Goals
                  </h2>
                  <p style={{
                    margin: 0,
                    color: 'rgba(255, 255, 255, 0.95)',
                    fontSize: '1rem',
                    fontWeight: '400',
                    lineHeight: '1.5'
                  }}>
                    Get personalized mutual fund recommendations based on your risk profile and investment goals
                  </p>
                </div>
                <InvestmentForm onSubmit={handleFormSubmit} loading={loading} />
              </div>
            )}

            {loading && (
            <div className="loading">
              <div className="spinner"></div>
              <p style={{ fontSize: '1.1rem', fontWeight: '500', marginBottom: '1rem', color: '#ffffff' }}>
                {loadingMessage}
              </p>
              
              {/* Progress bar */}
              <div style={{
                width: '100%',
                height: '8px',
                backgroundColor: '#e0e0e0',
                borderRadius: '4px',
                overflow: 'hidden',
                marginBottom: '1.5rem'
              }}>
                <div style={{
                  width: `${loadingStage * 20}%`,
                  height: '100%',
                  backgroundColor: '#4CAF50',
                  transition: 'width 0.5s ease-in-out',
                  animation: loadingStage >= 3 ? 'pulse 1.5s ease-in-out infinite' : 'none'
                }}></div>
              </div>
              
              {/* Cold start explanation (appears after 10 seconds) */}
              {loadingStage >= 3 && (
                <div style={{
                  backgroundColor: '#fff3cd',
                  border: '1px solid #ffc107',
                  borderRadius: '8px',
                  padding: '1rem',
                  marginTop: '1rem',
                  textAlign: 'left',
                  animation: 'fadeIn 0.5s ease-in'
                }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: '#856404' }}>
                    ⏳ Why is this taking longer?
                  </h4>
                  <p style={{ margin: '0', fontSize: '0.9rem', color: '#856404', lineHeight: '1.5' }}>
                    Our backend service was idle and is now waking up. This is normal for the first request
                    after a period of inactivity. <strong>Subsequent requests will be much faster!</strong>
                  </p>
                </div>
              )}
              
              {/* Encouraging message for very long waits */}
              {loadingStage >= 5 && (
                <p style={{
                  marginTop: '1rem',
                  fontSize: '0.95rem',
                  color: '#666',
                  fontStyle: 'italic'
                }}>
                  🎯 Your personalized recommendations will be worth the wait!
                </p>
              )}
            </div>
          )}

          {results && !loading && (
            <>
              <div className="success">
                <div style={{ marginBottom: '0.75rem' }}>
                  <strong>Hi {userName}! 👋</strong>
                </div>
                <div style={{ marginBottom: '0.5rem' }}>
                  Your personalized SIP recommendations are ready. Thank you for trusting us with your investment planning!
                </div>
                <div style={{
                  fontSize: '0.9rem',
                  color: '#059669',
                  marginTop: '0.75rem',
                  padding: '0.5rem',
                  background: '#d1fae5',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <span>🔒</span>
                  <span style={{ fontWeight: '600' }}>Privacy: Your information is processed securely and never shared with third parties.</span>
                </div>
              </div>
              <RecommendationResults
                data={results}
                userName={userName}
                userPreferences={userPreferences}
                onReset={handleReset}
              />
            </>
          )}
          </section>

          {/* Fund Search Section - Has internal collapse functionality */}
          <section id="search" className="section-search" style={{ marginTop: '3rem' }}>
            <FundSearch forceExpanded={sectionsExpanded.search.expanded} key={sectionsExpanded.search.timestamp} />
          </section>

          {/* Investment Platforms Section - Has internal collapse functionality */}
          <section id="platforms" className="section-platforms">
            <InvestmentPlatforms forceExpanded={sectionsExpanded.platforms.expanded} key={sectionsExpanded.platforms.timestamp} />
          </section>

          {/* FAQ Section - Has internal collapse functionality */}
          <section id="faq" className="section-faq">
            <FAQSection forceExpanded={sectionsExpanded.faq.expanded} key={sectionsExpanded.faq.timestamp} />
          </section>
        </div>
      </main>

      <footer className="enhanced-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>📈 SIP Investment Advisor</h3>
            <p>Your trusted companion for smart SIP investments</p>
          </div>
          
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><a href="#goals">Investment Goals</a></li>
              <li><a href="#search">Fund Search</a></li>
              <li><a href="#platforms">Platforms</a></li>
              <li><a href="#faq">FAQ</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Legal</h4>
            <ul className="footer-links">
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#terms">Terms of Service</a></li>
              <li><a href="#disclaimer">Disclaimer</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Contact</h4>
            <p>📧 support@sipadvisor.com</p>
            <div className="social-links">
              <a href="#twitter" aria-label="Twitter">🐦</a>
              <a href="#linkedin" aria-label="LinkedIn">💼</a>
              <a href="#github" aria-label="GitHub">💻</a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>© 2026 SIP Investment Advisor. For educational purposes only.</p>
          <p className="footer-disclaimer">
            ⚠️ Always consult with a certified financial advisor before investing.
            Mutual fund investments are subject to market risks.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;

// Made with Bob
