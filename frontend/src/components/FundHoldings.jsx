import React from 'react';

const FundHoldings = ({ holdingsData }) => {
  // If no holdings data provided, show message
  if (!holdingsData || !holdingsData.holdings || holdingsData.holdings.length === 0) {
    return (
      <div style={{ padding: '1.5rem', background: '#fef3c7', borderRadius: '8px', marginTop: '1rem', border: '1px solid #fbbf24' }}>
        <p style={{ color: '#92400e', marginBottom: '0.5rem', fontWeight: '600' }}>
          ℹ️ Holdings data not available for this fund
        </p>
        <p style={{ color: '#78350f', fontSize: '0.9rem' }}>
          This fund is part of a diversified portfolio. Holdings information is only available for sector-specific funds.
        </p>
      </div>
    );
  }

  const { holdings, data_source, last_updated, note } = holdingsData;

  // Get data source badge color
  const getSourceBadge = () => {
    const badges = {
      'sector_inference': { bg: '#dbeafe', color: '#1e40af', text: '🎯 Sector-Based' },
      'name_inference': { bg: '#fef3c7', color: '#92400e', text: '📝 Name-Based' },
      'category_inference': { bg: '#e0e7ff', color: '#3730a3', text: '📊 Category-Based' },
      'index_composition': { bg: '#dcfce7', color: '#166534', text: '📈 Index-Based' },
      'api': { bg: '#fce7f3', color: '#9f1239', text: '🔗 Live Data' }
    };
    return badges[data_source] || badges['sector_inference'];
  };

  const sourceBadge = getSourceBadge();

  return (
    <div style={{ marginTop: '1.5rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <h3 style={{ margin: 0, color: '#1e293b' }}>🏢 Portfolio Holdings</h3>
          <span style={{ 
            padding: '0.25rem 0.75rem', 
            background: sourceBadge.bg, 
            color: sourceBadge.color, 
            borderRadius: '4px', 
            fontSize: '0.85rem',
            fontWeight: '600'
          }}>
            {sourceBadge.text}
          </span>
        </div>
        
        {note && (
          <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '0.5rem', fontStyle: 'italic' }}>
            {note}
          </p>
        )}
        
        <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: 0 }}>
          {last_updated}
        </p>
      </div>

      {/* Holdings List */}
      <h4 style={{ marginBottom: '1rem', color: '#334155', fontSize: '1rem' }}>
        Top {Math.min(holdings.length, 10)} Holdings
      </h4>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {holdings.slice(0, 10).map((holding, index) => (
          <div 
            key={index}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.75rem 1rem',
              background: 'white',
              borderRadius: '6px',
              border: '1px solid #e2e8f0',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
              e.currentTarget.style.borderColor = '#2563eb';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = '#e2e8f0';
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                <span style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '28px',
                  height: '28px',
                  background: index < 3 ? '#2563eb' : '#64748b',
                  color: 'white',
                  borderRadius: '50%',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  flexShrink: 0
                }}>
                  {index + 1}
                </span>
                <span style={{ fontWeight: '600', color: '#1e293b', fontSize: '0.95rem' }}>
                  {holding.name}
                </span>
              </div>
              <div style={{ marginLeft: '40px' }}>
                <span style={{ 
                  fontSize: '0.8rem', 
                  color: '#64748b',
                  padding: '0.15rem 0.5rem',
                  background: '#f1f5f9',
                  borderRadius: '3px'
                }}>
                  {holding.sector}
                </span>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: '140px', justifyContent: 'flex-end' }}>
              <div style={{
                width: `${Math.min(holding.percentage * 4, 100)}px`,
                height: '10px',
                background: `linear-gradient(to right, ${index < 3 ? '#2563eb' : '#64748b'}, ${index < 3 ? '#60a5fa' : '#94a3b8'})`,
                borderRadius: '5px',
                minWidth: '30px'
              }}></div>
              <span style={{ 
                fontWeight: '700', 
                color: index < 3 ? '#2563eb' : '#64748b',
                minWidth: '55px',
                textAlign: 'right',
                fontSize: '0.95rem'
              }}>
                {holding.percentage.toFixed(1)}%
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#eff6ff', borderRadius: '6px', border: '1px solid #bfdbfe' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <p style={{ fontSize: '0.9rem', color: '#1e40af', margin: 0, fontWeight: '600' }}>
            📊 Top {Math.min(holdings.length, 10)} Holdings Total:
          </p>
          <p style={{ fontSize: '1.1rem', color: '#1e40af', margin: 0, fontWeight: '700' }}>
            {holdings.slice(0, 10).reduce((sum, h) => sum + h.percentage, 0).toFixed(1)}%
          </p>
        </div>
        <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
          Remaining {(100 - holdings.slice(0, 10).reduce((sum, h) => sum + h.percentage, 0)).toFixed(1)}% is distributed across other companies in the portfolio.
        </p>
      </div>

      {/* Info Note */}
      <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#fef3c7', borderRadius: '6px', border: '1px solid #fbbf24' }}>
        <p style={{ fontSize: '0.85rem', color: '#92400e', margin: 0 }}>
          💡 <strong>Note:</strong> Holdings data is representative and may vary. For exact current holdings, please check the fund's official factsheet.
        </p>
      </div>
    </div>
  );
};

export default FundHoldings;

// Made with Bob
