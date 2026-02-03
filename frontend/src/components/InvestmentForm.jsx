import React, { useState, useEffect } from 'react';
import api from '../services/api';

const InvestmentForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    risk_profile: '',
    investment_years: 5,
    monthly_investment: 5000,
    max_funds: 5,
    sector_preferences: [],
    fund_selection_mode: 'curated', // 'curated' or 'comprehensive'
    index_funds_only: false, // Index funds only filter
  });

  const [errors, setErrors] = useState({});
  const [availableSectors, setAvailableSectors] = useState([]);
  const [showSectorSelection, setShowSectorSelection] = useState(false);

  // Fetch available sectors on component mount
  useEffect(() => {
    const fetchSectors = async () => {
      try {
        const response = await api.get('/sectors');
        setAvailableSectors(response.data.sectors);
      } catch (error) {
        console.error('Failed to fetch sectors:', error);
      }
    };
    fetchSectors();
  }, []);

  const riskProfiles = [
    {
      value: 'low',
      title: 'Conservative',
      description: 'Low risk, stable returns. Focus on capital preservation.',
      icon: '🛡️',
    },
    {
      value: 'medium',
      title: 'Balanced',
      description: 'Moderate risk, balanced growth. Mix of stability and returns.',
      icon: '⚖️',
    },
    {
      value: 'high',
      title: 'Aggressive',
      description: 'High risk, high returns. Focus on wealth creation.',
      icon: '🚀',
    },
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.risk_profile) {
      newErrors.risk_profile = 'Please select a risk profile';
    }

    if (formData.investment_years < 1 || formData.investment_years > 30) {
      newErrors.investment_years = 'Investment years must be between 1 and 30';
    }

    if (formData.monthly_investment < 500) {
      newErrors.monthly_investment = 'Minimum investment is ₹500';
    }

    if (formData.max_funds < 1 || formData.max_funds > 15) {
      newErrors.max_funds = 'Number of funds must be between 1 and 15';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleRiskSelect = (risk) => {
    setFormData((prev) => ({
      ...prev,
      risk_profile: risk,
    }));
    if (errors.risk_profile) {
      setErrors((prev) => ({
        ...prev,
        risk_profile: '',
      }));
    }
  };

  const handleSectorToggle = (sectorKey) => {
    console.log('[TOGGLE] Clicked sector:', sectorKey);
    
    setFormData((prev) => {
      const currentSectors = Array.isArray(prev.sector_preferences) ? prev.sector_preferences : [];
      const isSelected = currentSectors.includes(sectorKey);
      
      console.log('[TOGGLE] Before:', currentSectors, 'Adding:', sectorKey, 'IsSelected:', isSelected);
      
      const newSectors = isSelected
        ? currentSectors.filter(s => s !== sectorKey)
        : [...currentSectors, sectorKey];
      
      console.log('[TOGGLE] After:', newSectors);
      
      return {
        ...prev,
        sector_preferences: newSectors
      };
    });
  };

  return (
    <form onSubmit={handleSubmit} className="investment-form">
      <div className="form-group">
        <label htmlFor="name">Full Name *</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter your full name"
          disabled={loading}
        />
        {errors.name && <small className="error">{errors.name}</small>}
      </div>

      <div className="form-group">
        <label htmlFor="email">Email Address *</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="your.email@example.com"
          disabled={loading}
        />
        {errors.email && <small className="error">{errors.email}</small>}
      </div>

      <div className="form-group">
        <label>Risk Profile *</label>
        <div className="radio-group-horizontal">
          {riskProfiles.map((profile) => (
            <label
              key={profile.value}
              className={`radio-option ${
                formData.risk_profile === profile.value ? 'selected' : ''
              }`}
            >
              <input
                type="radio"
                name="risk_profile"
                value={profile.value}
                checked={formData.risk_profile === profile.value}
                onChange={(e) => !loading && handleRiskSelect(e.target.value)}
                disabled={loading}
              />
              <span className="radio-content">
                <span className="radio-icon">{profile.icon}</span>
                <span className="radio-text">
                  <strong>{profile.title}</strong>
                  <small>{profile.description}</small>
                </span>
              </span>
            </label>
          ))}
        </div>
        {errors.risk_profile && (
          <small className="error">{errors.risk_profile}</small>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="investment_years">
          Investment Duration (Years) *
        </label>
        <input
          type="number"
          id="investment_years"
          name="investment_years"
          value={formData.investment_years}
          onChange={handleChange}
          min="1"
          max="30"
          disabled={loading}
        />
        <small>Choose between 1 to 30 years</small>
        {errors.investment_years && (
          <small className="error">{errors.investment_years}</small>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="monthly_investment">
          Monthly Investment Amount (₹) *
        </label>
        <input
          type="number"
          id="monthly_investment"
          name="monthly_investment"
          value={formData.monthly_investment}
          onChange={handleChange}
          min="500"
          step="500"
          disabled={loading}
        />
        <small>Minimum ₹500 per month</small>
        {errors.monthly_investment && (
          <small className="error">{errors.monthly_investment}</small>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="max_funds">
          Maximum Number of Funds to Recommend *
        </label>
        <input
          type="number"
          id="max_funds"
          name="max_funds"
          value={formData.max_funds}
          onChange={handleChange}
          min="1"
          max="15"
          disabled={loading}
        />
        <small>Choose between 1 to 15 funds (Recommended: 3-7 for diversification)</small>
        {errors.max_funds && (
          <small className="error">{errors.max_funds}</small>
        )}
      </div>

      <div className="form-group">
        <label>
          Fund Selection Mode * <span style={{fontSize: '0.7rem', color: '#10b981'}}>NEW</span>
        </label>
        <div className="radio-group-horizontal">
          <label className={`radio-option ${formData.fund_selection_mode === 'curated' ? 'selected' : ''}`}>
            <input
              type="radio"
              name="fund_selection_mode"
              value="curated"
              checked={formData.fund_selection_mode === 'curated'}
              onChange={(e) => !loading && setFormData(prev => ({ ...prev, fund_selection_mode: e.target.value }))}
              disabled={loading}
            />
            <span className="radio-content">
              <span className="radio-icon">⭐</span>
              <span className="radio-text">
                <strong>Top Picks</strong>
                <small>Curated high-quality funds (Recommended)</small>
              </span>
            </span>
          </label>
          <label className={`radio-option ${formData.fund_selection_mode === 'comprehensive' ? 'selected' : ''}`}>
            <input
              type="radio"
              name="fund_selection_mode"
              value="comprehensive"
              checked={formData.fund_selection_mode === 'comprehensive'}
              onChange={(e) => !loading && setFormData(prev => ({ ...prev, fund_selection_mode: e.target.value }))}
              disabled={loading}
            />
            <span className="radio-content">
              <span className="radio-icon">📊</span>
              <span className="radio-text">
                <strong>All Available</strong>
                <small>Complete MFApi database (More options)</small>
              </span>
            </span>
          </label>
        </div>
        <details style={{
          marginTop: '10px',
          padding: '12px',
          backgroundColor: '#f0f9ff',
          borderLeft: '3px solid #3b82f6',
          borderRadius: '4px',
          cursor: 'pointer'
        }}>
          <summary style={{ fontWeight: 'bold', cursor: 'pointer' }}>ℹ️ What's the difference?</summary>
          <ul style={{ marginTop: '8px', marginBottom: '0', paddingLeft: '20px', fontSize: '0.9rem' }}>
            <li><strong>Top Picks:</strong> Hand-selected funds based on popularity, AUM, and track record</li>
            <li><strong>All Available:</strong> Fetches complete fund list from MFApi (may include newer/smaller funds)</li>
            <li>Both modes use real-time NAV data and the same recommendation algorithm</li>
          </ul>
        </details>
      </div>

      <div className="form-group">
        <label>
          Investment Strategy <span style={{fontSize: '0.7rem', color: '#f59e0b'}}>NEW</span>
        </label>
        <div className="index-funds-toggle" style={{
          padding: '15px',
          backgroundColor: formData.index_funds_only ? '#fef3c7' : '#f3f4f6',
          border: `2px solid ${formData.index_funds_only ? '#f59e0b' : '#d1d5db'}`,
          borderRadius: '8px',
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}
        onClick={() => !loading && setFormData(prev => ({
          ...prev,
          index_funds_only: !prev.index_funds_only,
          sector_preferences: prev.index_funds_only ? prev.sector_preferences : [] // Clear sectors when enabling index funds
        }))}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '4px',
              border: '2px solid #f59e0b',
              backgroundColor: formData.index_funds_only ? '#f59e0b' : 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '16px'
            }}>
              {formData.index_funds_only ? '✓' : ''}
            </div>
            <div style={{ flex: 1 }}>
              <strong style={{ fontSize: '1.05rem', color: formData.index_funds_only ? '#92400e' : '#374151' }}>
                📊 Index Funds Only (Passive Investing)
              </strong>
              <p style={{ margin: '5px 0 0 0', fontSize: '0.9rem', color: '#6b7280' }}>
                Low-cost passive funds that track market indices like Nifty 50, Nifty Midcap, etc.
              </p>
            </div>
          </div>
        </div>
        
        {formData.index_funds_only && (
          <div className="info-box" style={{
            marginTop: '10px',
            padding: '12px',
            backgroundColor: '#fffbeb',
            borderLeft: '3px solid #f59e0b',
            borderRadius: '4px'
          }}>
            <strong>💡 Index Funds Benefits:</strong>
            <ul style={{ marginTop: '8px', marginBottom: '0', paddingLeft: '20px', fontSize: '0.9rem' }}>
              <li>Lower expense ratios (0.1-0.5% vs 1-2% for active funds)</li>
              <li>Transparent holdings (tracks index composition)</li>
              <li>Consistent with market returns (no fund manager risk)</li>
              <li>Ideal for long-term passive investing strategy</li>
            </ul>
          </div>
        )}
      </div>

      <div className="form-group">
        <label>
          Sector Preferences (Optional) <span style={{fontSize: '0.7rem', color: '#10b981'}}>v2.1</span>
          <button
            type="button"
            className="btn-link"
            onClick={() => !formData.index_funds_only && setShowSectorSelection(!showSectorSelection)}
            style={{ marginLeft: '10px', fontSize: '0.9rem', opacity: formData.index_funds_only ? 0.5 : 1 }}
            disabled={formData.index_funds_only}
          >
            {showSectorSelection ? '▼ Hide Sectors' : '▶ Show Sectors'}
          </button>
        </label>
        <small style={{ display: 'block', marginBottom: '10px' }}>
          {formData.index_funds_only
            ? '⚠️ Sector selection is disabled when "Index Funds Only" is enabled.'
            : 'Select specific sectors for targeted investments. Leave empty for diversified portfolio.'}
        </small>
        
        {showSectorSelection && (
          <div className="sector-selection">
            {availableSectors.map((sector) => {
              // Explicitly check if sector is selected
              const sectorPrefs = formData.sector_preferences || [];
              const isSelected = Array.isArray(sectorPrefs) && sectorPrefs.length > 0 && sectorPrefs.includes(sector.value);
              
              return (
                <div
                  key={sector.value}
                  className={`sector-option${isSelected ? ' selected' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    if (!loading) {
                      handleSectorToggle(sector.value);
                    }
                  }}
                >
                  <div className="sector-checkbox">
                    {isSelected ? '✓' : ''}
                  </div>
                  <div className="sector-info">
                    <strong>{sector.label}</strong>
                    <small>{sector.description}</small>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        {Array.isArray(formData.sector_preferences) && formData.sector_preferences.length > 0 && (
          <div className="selected-sectors-summary">
            <strong>Selected: </strong>
            {formData.sector_preferences.map(value => {
              const sector = availableSectors.find(s => s.value === value);
              return sector ? sector.label : value;
            }).join(', ')}
          </div>
        )}
        
        {Array.isArray(formData.sector_preferences) && formData.sector_preferences.length === 1 && (
          <div className="warning-message">
            ⚠️ Single sector selection increases risk. Consider selecting 2-3 sectors for better diversification.
          </div>
        )}
      </div>

      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? 'Generating Recommendations...' : 'Get SIP Recommendations'}
      </button>
    </form>
  );
};

export default InvestmentForm;

