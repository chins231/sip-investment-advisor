import React, { useState, useEffect } from 'react';
import api from '../services/api';

const FundHoldings = ({ fundName }) => {
  const [holdings, setHoldings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHoldings = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get(`/fund-holdings/${encodeURIComponent(fundName)}`);
        setHoldings(response.data);
      } catch (err) {
        setError('Failed to load fund holdings');
        console.error('Error fetching holdings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHoldings();
  }, [fundName]);

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <div className="loading-spinner"></div>
        <p>Loading holdings data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '1rem', background: '#fee2e2', borderRadius: '8px', marginTop: '1rem' }}>
        <p style={{ color: '#dc2626' }}>{error}</p>
      </div>
    );
  }

  if (!holdings) {
    return null;
  }

  return (
    <div style={{ marginTop: '1.5rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ marginBottom: '0.5rem', color: '#1e293b' }}>🏢 Portfolio Holdings</h3>
        <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '0.5rem' }}>
          {holdings.description}
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
          <span style={{ padding: '0.25rem 0.75rem', background: '#dbeafe', color: '#1e40af', borderRadius: '4px', fontSize: '0.85rem' }}>
            {holdings.fund_type}
          </span>
          <span style={{ padding: '0.25rem 0.75rem', background: '#fef3c7', color: '#92400e', borderRadius: '4px', fontSize: '0.85rem' }}>
            {holdings.sector}
          </span>
          <span style={{ padding: '0.25rem 0.75rem', background: '#dcfce7', color: '#166534', borderRadius: '4px', fontSize: '0.85rem' }}>
            Expected Return: {holdings.expected_return}%
          </span>
          <span style={{ 
            padding: '0.25rem 0.75rem', 
            background: holdings.risk_level === 'Very High' ? '#fee2e2' : holdings.risk_level === 'High' ? '#fed7aa' : '#dbeafe',
            color: holdings.risk_level === 'Very High' ? '#991b1b' : holdings.risk_level === 'High' ? '#9a3412' : '#1e40af',
            borderRadius: '4px', 
            fontSize: '0.85rem' 
          }}>
            Risk: {holdings.risk_level}
          </span>
        </div>
      </div>

      <h4 style={{ marginBottom: '1rem', color: '#334155' }}>Top 5 Holdings</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {holdings.top_holdings.map((holding, index) => (
          <div 
            key={index}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.75rem 1rem',
              background: 'white',
              borderRadius: '6px',
              border: '1px solid #e2e8f0'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '28px',
                height: '28px',
                background: '#2563eb',
                color: 'white',
                borderRadius: '50%',
                fontSize: '0.85rem',
                fontWeight: '600'
              }}>
                {index + 1}
              </span>
              <span style={{ fontWeight: '500', color: '#1e293b' }}>{holding.company}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: `${holding.percentage * 3}px`,
                height: '8px',
                background: `linear-gradient(to right, #2563eb, #60a5fa)`,
                borderRadius: '4px',
                minWidth: '40px'
              }}></div>
              <span style={{ 
                fontWeight: '600', 
                color: '#2563eb',
                minWidth: '50px',
                textAlign: 'right'
              }}>
                {holding.percentage}%
              </span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#eff6ff', borderRadius: '6px' }}>
        <p style={{ fontSize: '0.9rem', color: '#1e40af', marginBottom: '0.5rem' }}>
          <strong>📊 Total Top 5 Holdings:</strong> {holdings.top_holdings.reduce((sum, h) => sum + h.percentage, 0).toFixed(1)}%
        </p>
        <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
          Remaining {(100 - holdings.top_holdings.reduce((sum, h) => sum + h.percentage, 0)).toFixed(1)}% is distributed across other companies in the portfolio.
        </p>
      </div>

      {holdings.holdings_url && (
        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <a
            href={holdings.holdings_url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              padding: '0.75rem 1.5rem',
              background: '#2563eb',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '6px',
              fontWeight: '600',
              transition: 'all 0.3s'
            }}
            onMouseOver={(e) => e.target.style.background = '#1d4ed8'}
            onMouseOut={(e) => e.target.style.background = '#2563eb'}
          >
            🔗 View Complete Holdings on Fund Website
          </a>
        </div>
      )}
    </div>
  );
};

export default FundHoldings;

// Made with Bob
