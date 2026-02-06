import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../services/api';

const FundPerformance = ({ fundName }) => {
  const [performanceData, setPerformanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('1Y');
  const [error, setError] = useState(null);
  const [chartReady, setChartReady] = useState(false);

  const periods = [
    { value: '7D', label: '7 Days' },
    { value: '1M', label: '1 Month' },
    { value: '3M', label: '3 Months' },
    { value: '6M', label: '6 Months' },
    { value: '1Y', label: '1 Year' }
  ];

  useEffect(() => {
    fetchPerformanceData();
  }, [fundName]); // Only re-fetch when fund name changes, not period

  const fetchPerformanceData = async () => {
    try {
      setLoading(true);
      setChartReady(false);
      // Fetch data for the selected period to get the correct historical chart data
      const response = await api.get(
        `/fund-performance/${encodeURIComponent(fundName)}?period=${selectedPeriod}`
      );
      setPerformanceData(response.data);
      setError(null);
      // Small delay to ensure data is fully set before rendering chart
      setTimeout(() => setChartReady(true), 100);
    } catch (err) {
      setError('Failed to load performance data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch data when period changes (for chart data only)
  useEffect(() => {
    if (fundName && selectedPeriod) {
      fetchPerformanceData();
    }
  }, [selectedPeriod]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const getReturnColor = (value) => {
    return value >= 0 ? '#10b981' : '#ef4444';
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} style={{ color: i <= rating ? '#f59e0b' : '#e5e7eb', fontSize: '1.2rem' }}>
          ★
        </span>
      );
    }
    return stars;
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <div className="spinner"></div>
        <p>Loading performance data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error" style={{ margin: '1rem 0' }}>
        {error}
      </div>
    );
  }

  if (!performanceData) return null;

  return (
    <div className="fund-performance" style={{ marginTop: '2rem' }}>
      <div className="card">
        <h3 style={{ marginBottom: '1.5rem', color: '#1e293b' }}>
          📊 {fundName} - Detailed Performance
        </h3>

        {/* Current NAV */}
        <div style={{ 
          background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
          color: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          marginBottom: '1.5rem'
        }}>
          <div style={{ fontSize: '0.875rem', opacity: 0.9, marginBottom: '0.5rem' }}>
            CURRENT NAV
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: '700' }}>
            {formatCurrency(performanceData.current_nav)}
          </div>
          <div style={{ fontSize: '0.875rem', opacity: 0.8, marginTop: '0.5rem' }}>
            Last Updated: {new Date(performanceData.last_updated).toLocaleString()}
          </div>
        </div>

        {/* Returns Summary */}
        <div style={{ marginBottom: '2rem' }}>
          <h4 style={{ marginBottom: '1rem' }}>Returns Overview</h4>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '1rem'
          }}>
            {Object.entries(performanceData.performance.returns).map(([period, value]) => (
              <div key={period} style={{
                padding: '1rem',
                background: '#f8fafc',
                borderRadius: '8px',
                textAlign: 'center',
                border: '2px solid #e2e8f0'
              }}>
                <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>
                  {period.replace('_', ' ').toUpperCase()}
                </div>
                <div style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: '700',
                  color: getReturnColor(value)
                }}>
                  {value >= 0 ? '+' : ''}{value.toFixed(2)}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Period Selector */}
        <div style={{ marginBottom: '1rem' }}>
          <h4 style={{ marginBottom: '0.5rem' }}>Historical Performance</h4>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {periods.map((period) => (
              <button
                key={period.value}
                onClick={() => setSelectedPeriod(period.value)}
                style={{
                  padding: '0.5rem 1rem',
                  border: selectedPeriod === period.value ? '2px solid #2563eb' : '2px solid #e2e8f0',
                  background: selectedPeriod === period.value ? '#eff6ff' : 'white',
                  color: selectedPeriod === period.value ? '#2563eb' : '#64748b',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: selectedPeriod === period.value ? '600' : '400',
                  transition: 'all 0.2s'
                }}
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>

        {/* NAV Chart */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{
            textAlign: 'center',
            marginBottom: '0.5rem',
            fontSize: '0.875rem',
            color: '#64748b'
          }}>
            <strong>NAV Trend Over Time</strong> (Vertical axis: NAV in ₹, Horizontal axis: Date)
          </div>
          {loading || !chartReady ? (
            <div style={{
              height: '300px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#f8fafc',
              borderRadius: '8px'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div className="spinner"></div>
                <p style={{ marginTop: '1rem', color: '#64748b' }}>Loading chart data...</p>
              </div>
            </div>
          ) : (
            performanceData?.historical_data && (
              <ResponsiveContainer width="100%" height={300} key={`chart-${selectedPeriod}-${performanceData.historical_data.length}`}>
                <LineChart data={performanceData.historical_data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(date) => new Date(date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                    label={{ value: 'Date', position: 'insideBottom', offset: -5, style: { fontSize: 12 } }}
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    domain={['auto', 'auto']}
                    label={{ value: 'NAV (₹)', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }}
                  />
                  <Tooltip
                    formatter={(value) => formatCurrency(value)}
                    labelFormatter={(date) => new Date(date).toLocaleDateString('en-IN')}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="nav"
                    stroke="#2563eb"
                    strokeWidth={2}
                    dot={false}
                    name="Fund NAV"
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            )
          )}
        </div>

        {/* User Reviews */}
        <div>
          <h4 style={{ marginBottom: '1rem' }}>
            ⭐ User Reviews ({performanceData.reviews.total_reviews})
          </h4>
          
          {/* Disclaimer Banner */}
          <div style={{
            background: '#fef3c7',
            border: '2px solid #fbbf24',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'start',
            gap: '0.75rem'
          }}>
            <span style={{ fontSize: '1.25rem' }}>ℹ️</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: '600', color: '#92400e', marginBottom: '0.25rem' }}>
                Sample Reviews for Demonstration
              </div>
              <div style={{ fontSize: '0.875rem', color: '#78350f', lineHeight: '1.5' }}>
                These are simulated reviews for demonstration purposes only. Real user reviews coming soon!
              </div>
            </div>
          </div>
          
          <div style={{
            background: '#f8fafc',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ fontSize: '2rem', fontWeight: '700' }}>
                {performanceData.reviews.average_rating}
              </div>
              <div>
                <div>{renderStars(Math.round(performanceData.reviews.average_rating))}</div>
                <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                  Based on {performanceData.reviews.total_reviews} reviews
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {performanceData.reviews.reviews.map((review, index) => (
              <div key={index} style={{
                padding: '1rem',
                background: 'white',
                border: '2px solid #e2e8f0',
                borderRadius: '8px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <div style={{ fontWeight: '600' }}>{review.user}</div>
                  <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                    {new Date(review.date).toLocaleDateString('en-IN')}
                  </div>
                </div>
                <div style={{ marginBottom: '0.5rem' }}>
                  {renderStars(review.rating)}
                </div>
                <div style={{ color: '#475569', lineHeight: '1.6' }}>
                  {review.comment}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FundPerformance;

