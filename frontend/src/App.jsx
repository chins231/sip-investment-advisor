import React, { useState, useEffect } from 'react';
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
  const [loadingMessage, setLoadingMessage] = useState('');
  const [loadingStage, setLoadingStage] = useState(0);

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
  };

  return (
    <div className="app">
      <header className="header">
        <div className="container">
          <h1>📈 SIP Investment Advisor</h1>
          <p>
            Get personalized mutual fund recommendations based on your risk profile
            and investment goals
          </p>
        </div>
      </header>

      <main className="main-content">
        <div className="container">
          {error && (
            <div className="error">
              <strong>Error:</strong> {error}
            </div>
          )}

          {!results && (
            <div className="card">
              <h2>🎯 Tell Us About Your Investment Goals</h2>
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
                  <span><strong>Privacy:</strong> Your information is processed securely and never shared with third parties.</span>
                </div>
              </div>
              <RecommendationResults data={results} />
              
              <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                <button onClick={handleReset} className="btn btn-secondary">
                  Create New Plan
                </button>
              </div>
            </>
          )}

          {/* Fund Search Section - Always visible */}
          <div style={{ marginTop: '3rem' }}>
            <FundSearch />
          </div>

          {/* Investment Platforms Section - Always visible, appears after Fund Search */}
          <InvestmentPlatforms />

          {/* FAQ Section - Always visible */}
          <FAQSection />
        </div>
      </main>

      <footer style={{
        textAlign: 'center',
        padding: '2rem',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        color: '#1e293b',
        borderTop: '2px solid rgba(255, 255, 255, 0.8)',
        marginTop: '3rem',
        boxShadow: '0 -4px 6px -1px rgb(0 0 0 / 0.1)',
        position: 'relative',
        zIndex: 10
      }}>
        <p style={{ margin: 0, fontWeight: '500' }}>
          © 2026 SIP Investment Advisor. For educational purposes only.
          <br />
          Always consult with a certified financial advisor before investing.
        </p>
      </footer>
    </div>
  );
}

export default App;

// Made with Bob
