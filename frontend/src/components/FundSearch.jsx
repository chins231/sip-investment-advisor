import React, { useState } from 'react';
import api from '../services/api';
import FundPerformance from './FundPerformance';
import FundHoldings from './FundHoldings';

const FundSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      setError('Please enter a fund name to search');
      return;
    }

    setSearching(true);
    setError(null);
    setHasSearched(true);
    setSearchResults([]);

    try {
      // Call backend API to search for funds
      const response = await api.post('/search-fund', {
        query: searchQuery.trim()
      });

      if (response.data.funds && response.data.funds.length > 0) {
        setSearchResults(response.data.funds);
        setError(null);
      } else {
        setSearchResults([]);
        setError(`No funds found matching "${searchQuery}". Try different keywords like "HDFC", "Axis", "SBI", etc.`);
      }
    } catch (err) {
      console.error('Search error:', err);
      setError(err.response?.data?.error || 'Failed to search funds. Please try again.');
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handleClear = () => {
    setSearchQuery('');
    setSearchResults([]);
    setError(null);
    setHasSearched(false);
  };

  return (
    <div className="fund-search-section">
      <div className="card">
        <h2 style={{ marginBottom: '1rem' }}>🔍 Search Any Mutual Fund</h2>
        <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
          Search for any mutual fund by name and get complete details including NAV, returns, holdings, and performance charts.
        </p>

        <form onSubmit={handleSearch} style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter fund name (e.g., Axis Nifty, HDFC Top 100, SBI Bluechip)"
              style={{
                flex: '1',
                minWidth: '250px',
                padding: '0.75rem 1rem',
                fontSize: '1rem',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />
            <button
              type="submit"
              disabled={searching}
              style={{
                padding: '0.75rem 2rem',
                fontSize: '1rem',
                fontWeight: '600',
                color: '#ffffff',
                background: searching ? '#94a3b8' : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                border: 'none',
                borderRadius: '8px',
                cursor: searching ? 'not-allowed' : 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => {
                if (!searching) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 10px 15px -3px rgb(0 0 0 / 0.2)';
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.1)';
              }}
            >
              {searching ? '🔄 Searching...' : '🔍 Search Fund'}
            </button>
            {hasSearched && (
              <button
                type="button"
                onClick={handleClear}
                style={{
                  padding: '0.75rem 1.5rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#64748b',
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.background = '#e2e8f0'}
                onMouseLeave={(e) => e.target.style.background = '#f1f5f9'}
              >
                Clear
              </button>
            )}
          </div>
        </form>

        {/* Search Tips */}
        <div style={{
          background: '#f0f9ff',
          border: '1px solid #bae6fd',
          borderRadius: '8px',
          padding: '1rem',
          fontSize: '0.9rem',
          color: '#0c4a6e'
        }}>
          <strong>💡 Search Tips:</strong>
          <ul style={{ margin: '0.5rem 0 0 1.5rem', paddingLeft: '0' }}>
            <li>Try AMC names: "HDFC", "Axis", "SBI", "ICICI"</li>
            <li>Try fund types: "Nifty", "Bluechip", "Midcap", "Index"</li>
            <li>Try specific funds: "Axis Nifty 50", "HDFC Top 100"</li>
          </ul>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div style={{
          background: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '8px',
          padding: '1rem',
          marginTop: '1rem',
          color: '#991b1b'
        }}>
          <strong>⚠️ {error}</strong>
        </div>
      )}

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', color: '#1e293b' }}>
            📊 Found {searchResults.length} fund{searchResults.length > 1 ? 's' : ''} matching "{searchQuery}"
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {searchResults.map((fund, index) => (
              <FundCard key={index} fund={fund} />
            ))}
          </div>
        </div>
      )}

      {/* No Results Message */}
      {hasSearched && !searching && searchResults.length === 0 && !error && (
        <div style={{
          background: '#fffbeb',
          border: '1px solid #fde68a',
          borderRadius: '8px',
          padding: '1.5rem',
          marginTop: '1rem',
          textAlign: 'center',
          color: '#92400e'
        }}>
          <p style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
            🔍 No funds found
          </p>
          <p style={{ margin: 0 }}>
            Try searching with different keywords or check the spelling.
          </p>
        </div>
      )}
    </div>
  );
};

// Fund Card Component (similar to RecommendationResults)
const FundCard = ({ fund }) => {
  const [showPerformance, setShowPerformance] = useState(false);
  const [showHoldings, setShowHoldings] = useState(false);
  const [holdingsData, setHoldingsData] = useState(null);
  const [loadingHoldings, setLoadingHoldings] = useState(false);

  // Fetch holdings data when user clicks "View Holdings"
  const fetchHoldings = async () => {
    if (holdingsData) return; // Already loaded
    
    setLoadingHoldings(true);
    try {
      const response = await api.get(`/fund-holdings/${encodeURIComponent(fund.name)}`);
      setHoldingsData(response.data);
    } catch (error) {
      console.error('Error fetching holdings:', error);
      setHoldingsData({ holdings: [], note: 'Failed to load holdings data' });
    } finally {
      setLoadingHoldings(false);
    }
  };

  const handleShowHoldings = () => {
    if (!showHoldings) {
      fetchHoldings();
    }
    setShowHoldings(!showHoldings);
  };

  return (
    <div style={{
      background: '#ffffff',
      border: '2px solid #e2e8f0',
      borderRadius: '12px',
      padding: '1.5rem',
      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      transition: 'transform 0.2s, box-shadow 0.2s'
    }}>
      {/* Fund Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <h3 style={{ margin: 0, color: '#1e293b', fontSize: '1.25rem', flex: 1 }}>
          {fund.name}
        </h3>
        {fund.cagr_3y && (
          <div style={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            color: '#ffffff',
            padding: '0.5rem 1rem',
            borderRadius: '20px',
            fontWeight: '700',
            fontSize: '1.1rem',
            marginLeft: '1rem'
          }}>
            {fund.cagr_3y}%
          </div>
        )}
      </div>

      {/* Fund Details Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '1rem',
        marginBottom: '1rem'
      }}>
        <div>
          <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }}>Fund Type</div>
          <div style={{ fontWeight: '600', color: '#1e293b' }}>{fund.fund_type || 'Other Scheme'}</div>
        </div>
        <div>
          <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }}>Expected Return</div>
          <div style={{ fontWeight: '600', color: '#1e293b' }}>{fund.expected_return || 'N/A'}</div>
        </div>
        <div>
          <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }}>Risk Level</div>
          <div style={{ fontWeight: '600', color: '#1e293b' }}>{fund.risk_level || 'Medium'}</div>
        </div>
        <div>
          <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }}>Monthly SIP</div>
          <div style={{ fontWeight: '600', color: '#1e293b' }}>₹{fund.monthly_sip || '1,000'}</div>
        </div>
        <div>
          <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }}>3-Year CAGR</div>
          <div style={{ fontWeight: '600', color: '#10b981' }}>{fund.cagr_3y || 'N/A'}%</div>
        </div>
        <div>
          <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }}>Current NAV</div>
          <div style={{ fontWeight: '600', color: '#1e293b' }}>₹{fund.current_nav || 'N/A'}</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => setShowPerformance(!showPerformance)}
          style={{
            flex: '1',
            minWidth: '150px',
            padding: '0.75rem 1.5rem',
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'transform 0.2s'
          }}
        >
          📊 {showPerformance ? 'Hide' : 'View'} Performance
        </button>
        <button
          onClick={handleShowHoldings}
          disabled={loadingHoldings}
          style={{
            flex: '1',
            minWidth: '150px',
            padding: '0.75rem 1.5rem',
            background: loadingHoldings ? '#94a3b8' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: loadingHoldings ? 'not-allowed' : 'pointer',
            transition: 'transform 0.2s'
          }}
        >
          📈 {loadingHoldings ? 'Loading...' : showHoldings ? 'Hide' : 'View'} Holdings
        </button>
      </div>

      {/* Performance Chart - Using FundPerformance component */}
      {showPerformance && (
        <FundPerformance fundName={fund.name} />
      )}

      {/* Holdings - Using FundHoldings component */}
      {showHoldings && (
        <FundHoldings holdingsData={holdingsData} />
      )}
    </div>
  );
};

export default FundSearch;

// Made with Bob
