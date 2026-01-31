import React, { useState } from 'react';
import InvestmentForm from './components/InvestmentForm';
import RecommendationResults from './components/RecommendationResults';
import InvestmentPlatforms from './components/InvestmentPlatforms';
import FAQSection from './components/FAQSection';
import { generateRecommendations } from './services/api';

function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);
  const [userId, setUserId] = useState(null);

  const handleFormSubmit = async (formData) => {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const data = await generateRecommendations(formData);
      setResults(data);
      setUserId(data.user_id);
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
              <p>Analyzing your profile and generating recommendations...</p>
            </div>
          )}

          {results && !loading && (
            <>
              <div className="success">
                <strong>Success!</strong> Your personalized SIP recommendations are
                ready. User ID: {userId}
              </div>
              <RecommendationResults data={results} />
              
              <InvestmentPlatforms />
              
              <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                <button onClick={handleReset} className="btn btn-secondary">
                  Create New Plan
                </button>
              </div>
            </>
          )}

          {/* FAQ Section - Always visible */}
          <FAQSection />
        </div>
      </main>

      <footer style={{ 
        textAlign: 'center', 
        padding: '2rem', 
        color: '#64748b',
        borderTop: '1px solid #e2e8f0',
        marginTop: '3rem'
      }}>
        <p>
          © 2026 SIP Investment Advisor. For educational purposes only.
          <br />
          Always consult with a certified financial advisor before investing.
        </p>
      </footer>
    </div>
  );
}

export default App;

