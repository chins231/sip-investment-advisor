import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import FundPerformance from './FundPerformance';
import FundHoldings from './FundHoldings';
import { generatePDF } from '../utils/pdfGenerator';

const RecommendationResults = ({ data, userName, userPreferences }) => {
  const { recommendations, portfolio_summary, investment_strategy, data_source, fund_count_info } = data;
  const [selectedFund, setSelectedFund] = useState(null);
  const [selectedHoldings, setSelectedHoldings] = useState(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  
  // Debug logging
  console.log('[RecommendationResults] Full data:', data);
  console.log('[RecommendationResults] fund_count_info:', fund_count_info);
  console.log('[RecommendationResults] recommendations count:', recommendations?.length);

  const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  // Prepare data for pie chart
  const chartData = recommendations.reduce((acc, rec) => {
    const existing = acc.find((item) => item.name === rec.fund_type);
    if (existing) {
      existing.value += rec.allocation_percentage;
    } else {
      acc.push({
        name: rec.fund_type,
        value: rec.allocation_percentage,
      });
    }
    return acc;
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return `${value.toFixed(2)}%`;
  };

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    await generatePDF(userName || 'User', data, userPreferences);
    setIsGeneratingPDF(false);
  };

  return (
    <div className="results-section">
      {/* Download PDF Button - Prominent placement at top */}
      <div className="pdf-download-container" style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '2rem',
        gap: '1rem',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={handleDownloadPDF}
          disabled={isGeneratingPDF}
          style={{
            padding: '1rem 2rem',
            background: isGeneratingPDF ? '#94a3b8' : 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: isGeneratingPDF ? 'not-allowed' : 'pointer',
            fontWeight: '700',
            fontSize: '1.1rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            transform: isGeneratingPDF ? 'none' : 'translateY(0)',
          }}
          onMouseEnter={(e) => {
            if (!isGeneratingPDF) {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.15)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isGeneratingPDF) {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
            }
          }}
        >
          <span style={{ fontSize: '1.5rem' }}>
            {isGeneratingPDF ? '⏳' : '📄'}
          </span>
          <span>
            {isGeneratingPDF ? 'Generating PDF...' : 'Download Investment Plan (PDF)'}
          </span>
        </button>
      </div>
      {/* Data Source Banner */}
      {data_source && (
        <div className={`data-source-banner ${data_source.source === 'api' ? 'api-data' : 'static-data'}`}>
          {data_source.source === 'api' ? (
            <>
              <span className="badge-success">✓ Live Data</span>
              <span>
                Showing {data_source.fund_count} funds with real-time NAV from {data_source.api_name}
                {data_source.ranking && data_source.ranking !== 'None' && (
                  <strong style={{ marginLeft: '8px', color: '#10b981' }}>
                    • Ranked by {data_source.ranking}
                  </strong>
                )}
              </span>
            </>
          ) : (
            <>
              <span className="badge-warning">⚠ Static Data</span>
              <span>
                {data_source.reason === 'api_unavailable'
                  ? 'API temporarily unavailable. Showing curated fund recommendations.'
                  : data_source.message || `Showing ${data_source.fund_count} curated funds.`}
              </span>
            </>
          )}
        </div>
      )}
      
      {/* Fund Count Information Banner */}
      {fund_count_info && (
        <div className="fund-count-info-banner">
          <div className="info-icon">ℹ️</div>
          <div className="info-content">
            <div className="info-message">
              <strong>{fund_count_info.message}</strong>
            </div>
            {fund_count_info.suggestion && (
              <div className="info-suggestion">
                💡 <em>{fund_count_info.suggestion}</em>
              </div>
            )}
          </div>
        </div>
      )}
      
      <div className="card">
        <h2>📊 Portfolio Summary</h2>
        <div className="summary-grid">
          <div className="summary-card">
            <h3>Monthly Investment</h3>
            <div className="value">
              {formatCurrency(portfolio_summary.total_monthly_investment)}
            </div>
            <div className="subtext">Per month</div>
          </div>
          <div className="summary-card">
            <h3>Total Investment</h3>
            <div className="value">
              {formatCurrency(portfolio_summary.total_invested)}
            </div>
            <div className="subtext">Over investment period</div>
          </div>
          <div className="summary-card">
            <h3>Expected Value</h3>
            <div className="value">
              {formatCurrency(portfolio_summary.expected_portfolio_value)}
            </div>
            <div className="subtext">At maturity</div>
          </div>
          <div className="summary-card">
            <h3>Expected Gains</h3>
            <div className="value">
              {formatCurrency(portfolio_summary.expected_gains)}
            </div>
            <div className="subtext">
              {formatPercentage(portfolio_summary.overall_return_percentage)} returns
            </div>
          </div>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Asset Allocation</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value.toFixed(2)}%`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <h2>💼 Recommended SIP Funds</h2>
        <div className="recommendations-list">
          {recommendations.map((rec, index) => (
            <div key={index} className="recommendation-item">
              <div className="recommendation-header">
                <h3>{rec.fund_name}</h3>
                <span className="allocation-badge">
                  {formatPercentage(rec.allocation_percentage)}
                </span>
              </div>
              <div className="recommendation-details">
                <div className="detail-item">
                  <label>Fund Type</label>
                  <value>{rec.fund_type}</value>
                </div>
                <div className="detail-item">
                  <label>Expected Return</label>
                  <value>{formatPercentage(rec.expected_return)}</value>
                </div>
                <div className="detail-item">
                  <label>Risk Level</label>
                  <value>{rec.risk_level}</value>
                </div>
                <div className="detail-item">
                  <label>Monthly SIP</label>
                  <value>{formatCurrency(rec.monthly_investment)}</value>
                </div>
                {rec.cagr_3y && (
                  <div className="detail-item">
                    <label>3-Year CAGR</label>
                    <value style={{ color: rec.cagr_3y > 0 ? '#10b981' : '#ef4444', fontWeight: '600' }}>
                      {formatPercentage(rec.cagr_3y)}
                    </value>
                  </div>
                )}
                {rec.nav ? (
                  <div className="detail-item">
                    <label>Current NAV</label>
                    <value>₹{rec.nav}</value>
                  </div>
                ) : (
                  <div className="detail-item" style={{ gridColumn: '1 / -1' }}>
                    <div style={{
                      padding: '0.75rem',
                      background: '#fef3c7',
                      borderRadius: '6px',
                      border: '1px solid #f59e0b',
                      fontSize: '0.9rem'
                    }}>
                      <strong style={{ color: '#92400e' }}>ℹ️ NAV Unavailable</strong>
                      <p style={{ margin: '0.5rem 0 0 0', color: '#78350f' }}>
                        Real-time NAV data is currently unavailable. Please visit the fund's official website for the latest NAV and performance data.
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '1rem', flexWrap: 'wrap' }}>
                {/* Only show performance button if NAV data is available */}
                {rec.nav && (
                  <button
                    onClick={() => setSelectedFund(selectedFund === rec.fund_name ? null : rec.fund_name)}
                    style={{
                      padding: '0.75rem 1.5rem',
                      background: selectedFund === rec.fund_name ? '#ef4444' : '#2563eb',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      transition: 'all 0.3s'
                    }}
                  >
                    {selectedFund === rec.fund_name ? '✕ Hide Performance' : '📊 View Performance'}
                  </button>
                )}
                
                <button
                  onClick={() => setSelectedHoldings(selectedHoldings === rec.fund_name ? null : rec.fund_name)}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: selectedHoldings === rec.fund_name ? '#ef4444' : '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    transition: 'all 0.3s'
                  }}
                >
                  {selectedHoldings === rec.fund_name ? '✕ Hide Holdings' : '🏢 View Holdings'}
                </button>
                
                {/* Only show fund website link if we have scheme_code (verified API data) */}
                {!rec.nav && rec.scheme_code && (
                  <a
                    href={`https://www.moneycontrol.com/mutual-funds/nav/scheme-name/${rec.scheme_code}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      padding: '0.75rem 1.5rem',
                      background: '#f59e0b',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      textDecoration: 'none',
                      display: 'inline-block',
                      transition: 'all 0.3s'
                    }}
                  >
                    🔗 Check NAV on Moneycontrol
                  </a>
                )}
              </div>
              
              {selectedFund === rec.fund_name && (
                <FundPerformance fundName={rec.fund_name} />
              )}
              
              {selectedHoldings === rec.fund_name && (
                <FundHoldings holdingsData={rec.holdings} />
              )}
            </div>
          ))}
        </div>
      </div>

      {investment_strategy && (
        <div className="card">
          <h2>📈 Investment Strategy</h2>
          <div className="strategy-section">
            <h3>Recommended Approach</h3>
            <p style={{ marginBottom: '1rem', lineHeight: '1.8' }}>
              {investment_strategy.strategy}
            </p>

            {investment_strategy.sector_warning && (
              <div style={{ marginTop: '1rem', padding: '1rem', background: '#fee2e2', borderRadius: '8px', border: '1px solid #ef4444' }}>
                <strong style={{ color: '#dc2626' }}>⚠️ Sector Risk Warning:</strong>
                <p style={{ marginTop: '0.5rem', color: '#7f1d1d' }}>{investment_strategy.sector_warning}</p>
              </div>
            )}

            {investment_strategy.sector_note && (
              <div style={{ marginTop: '1rem', padding: '1rem', background: '#dbeafe', borderRadius: '8px', border: '1px solid #2563eb' }}>
                <strong style={{ color: '#1e40af' }}>ℹ️ Sector Investment Note:</strong>
                <p style={{ marginTop: '0.5rem', color: '#1e3a8a' }}>{investment_strategy.sector_note}</p>
              </div>
            )}

            <h3 style={{ marginTop: '1.5rem' }}>Key Benefits of SIP</h3>
            <ul>
              {investment_strategy.sip_benefits.map((benefit, index) => (
                <li key={index}>{benefit}</li>
              ))}
            </ul>

            <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#fff3cd', borderRadius: '8px' }}>
              <strong>💡 Pro Tip:</strong> {investment_strategy.rebalancing}
            </div>
          </div>
        </div>
      )}

      <div className="card" style={{ background: '#f0f9ff', border: '2px solid #2563eb' }}>
        <h2>⚠️ Important Disclaimer</h2>
        <p style={{ lineHeight: '1.8', color: '#1e293b' }}>
          These recommendations are based on historical data and mathematical projections. 
          Actual returns may vary based on market conditions. Past performance is not indicative 
          of future results. Please consult with a certified financial advisor before making 
          investment decisions. Mutual fund investments are subject to market risks. 
          Read all scheme-related documents carefully before investing.
        </p>
      </div>
    </div>
  );
};

export default RecommendationResults;

