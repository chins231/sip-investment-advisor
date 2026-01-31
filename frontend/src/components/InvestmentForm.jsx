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
        <div className="risk-selector">
          {riskProfiles.map((profile) => (
            <div
              key={profile.value}
              className={`risk-option risk-${profile.value} ${
                formData.risk_profile === profile.value ? 'selected' : ''
              }`}
              onClick={() => !loading && handleRiskSelect(profile.value)}
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                {profile.icon}
              </div>
              <h3>{profile.title}</h3>
              <p>{profile.description}</p>
            </div>
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
          Sector Preferences (Optional) <span style={{fontSize: '0.7rem', color: '#10b981'}}>v2.1</span>
          <button
            type="button"
            className="btn-link"
            onClick={() => setShowSectorSelection(!showSectorSelection)}
            style={{ marginLeft: '10px', fontSize: '0.9rem' }}
          >
            {showSectorSelection ? '▼ Hide Sectors' : '▶ Show Sectors'}
          </button>
        </label>
        <small style={{ display: 'block', marginBottom: '10px' }}>
          Select specific sectors for targeted investments. Leave empty for diversified portfolio.
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

