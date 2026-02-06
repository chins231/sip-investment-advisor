import React, { useState } from 'react';

const InvestmentPlatforms = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const platforms = [
    {
      name: 'Zerodha Coin',
      logo: '🟢',
      url: 'https://coin.zerodha.com',
      features: ['Zero commission', 'Direct mutual funds', 'Easy to use'],
      rating: 4.5,
      description: 'India\'s largest stockbroker. Invest in direct mutual funds with zero commission.',
      howTo: [
        'Open Zerodha account (free)',
        'Complete KYC verification',
        'Login to Coin platform',
        'Search for your fund',
        'Click "Start SIP"',
        'Set amount and date',
        'Confirm and invest!'
      ]
    },
    {
      name: 'Groww',
      logo: '🌱',
      url: 'https://groww.in',
      features: ['User-friendly', 'No paperwork', 'Direct funds'],
      rating: 4.6,
      description: 'Simple and intuitive platform for beginners. Start investing in minutes.',
      howTo: [
        'Download Groww app or visit website',
        'Sign up with mobile number',
        'Complete KYC (Aadhaar + PAN)',
        'Browse mutual funds',
        'Select fund and click "Invest"',
        'Choose SIP option',
        'Set up auto-debit and start!'
      ]
    },
    {
      name: 'Paytm Money',
      logo: '💰',
      url: 'https://www.paytmmoney.com',
      features: ['Integrated with Paytm', 'Direct plans', 'Low minimum'],
      rating: 4.3,
      description: 'Invest through your Paytm account. Seamless experience for Paytm users.',
      howTo: [
        'Open Paytm Money app',
        'Complete one-time KYC',
        'Link bank account',
        'Go to Mutual Funds section',
        'Search and select fund',
        'Choose SIP and amount',
        'Confirm investment'
      ]
    },
    {
      name: 'ET Money',
      logo: '📊',
      url: 'https://www.etmoney.com',
      features: ['Goal-based investing', 'Tax planning', 'Expert advice'],
      rating: 4.4,
      description: 'Backed by Times Group. Offers goal-based investment planning.',
      howTo: [
        'Download ET Money app',
        'Register with mobile',
        'Complete KYC process',
        'Set investment goals',
        'Get fund recommendations',
        'Start SIP with one tap',
        'Track performance easily'
      ]
    },
    {
      name: 'Kuvera',
      logo: '🎯',
      url: 'https://kuvera.in',
      features: ['Free platform', 'Import existing', 'Tax harvesting'],
      rating: 4.5,
      description: 'Completely free platform. Import existing investments from other platforms.',
      howTo: [
        'Visit Kuvera website',
        'Sign up for free',
        'Complete KYC online',
        'Import existing folios (optional)',
        'Browse fund categories',
        'Select fund and SIP amount',
        'Set up mandate and invest'
      ]
    },
    {
      name: 'HDFC Securities',
      logo: '🏦',
      url: 'https://www.hdfcsec.com',
      features: ['Trusted brand', 'Research reports', 'Advisory'],
      rating: 4.2,
      description: 'From HDFC Bank. Offers research and advisory services.',
      howTo: [
        'Visit HDFC Securities',
        'Open trading + demat account',
        'Complete KYC at branch/online',
        'Login to platform',
        'Navigate to Mutual Funds',
        'Select fund and SIP',
        'Authorize and start investing'
      ]
    }
  ];

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} style={{ color: i <= rating ? '#f59e0b' : '#e5e7eb' }}>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="card" style={{ marginTop: '2rem' }}>
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem',
          background: 'linear-gradient(135deg, #00796B 0%, #00897B 100%)',
          color: 'white',
          borderRadius: '8px',
          marginBottom: isExpanded ? '1.5rem' : '0',
          transition: 'all 0.3s ease'
        }}
      >
        <div>
          <h2 style={{ margin: 0, color: 'white' }}>🚀 Where to Invest - Top SIP Platforms</h2>
          <p style={{ color: '#64748b', margin: 0 }}>
            Choose any of these trusted platforms to start your SIP journey
          </p>
        </div>
        <span style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: '#2563eb',
          transition: 'transform 0.3s',
          transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
          display: 'inline-block'
        }}>
          ▼
        </span>
      </div>

      {isExpanded && (
        <div style={{ marginTop: '1.5rem' }}>
          <p style={{ color: '#64748b', marginBottom: '2rem' }}>
            All platforms offer direct mutual funds with zero commission!
          </p>

          <div style={{ display: 'grid', gap: '1.5rem' }}>
        {platforms.map((platform, index) => (
          <div key={index} style={{
            border: '2px solid #e2e8f0',
            borderRadius: '12px',
            padding: '1.5rem',
            transition: 'all 0.3s',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#2563eb';
            e.currentTarget.style.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#e2e8f0';
            e.currentTarget.style.boxShadow = 'none';
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '2.5rem' }}>{platform.logo}</span>
                <div>
                  <h3 style={{ marginBottom: '0.25rem' }}>{platform.name}</h3>
                  <div>{renderStars(platform.rating)} {platform.rating}/5</div>
                </div>
              </div>
              <a 
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '0.5rem 1rem',
                  background: '#2563eb',
                  color: 'white',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  fontWeight: '600',
                  fontSize: '0.875rem'
                }}
              >
                Visit Website →
              </a>
            </div>

            <p style={{ color: '#475569', marginBottom: '1rem', lineHeight: '1.6' }}>
              {platform.description}
            </p>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              {platform.features.map((feature, idx) => (
                <span key={idx} style={{
                  padding: '0.25rem 0.75rem',
                  background: '#eff6ff',
                  color: '#2563eb',
                  borderRadius: '12px',
                  fontSize: '0.875rem'
                }}>
                  ✓ {feature}
                </span>
              ))}
            </div>

            <details style={{ marginTop: '1rem' }}>
              <summary style={{ 
                cursor: 'pointer', 
                fontWeight: '600',
                color: '#2563eb',
                padding: '0.5rem',
                background: '#f8fafc',
                borderRadius: '6px'
              }}>
                📝 Step-by-Step Guide to Start SIP
              </summary>
              <ol style={{ 
                marginTop: '1rem', 
                paddingLeft: '1.5rem',
                lineHeight: '2'
              }}>
                {platform.howTo.map((step, idx) => (
                  <li key={idx} style={{ marginBottom: '0.5rem' }}>
                    {step}
                  </li>
                ))}
              </ol>
            </details>
          </div>
        ))}
          </div>

          <div style={{
            marginTop: '2rem',
            padding: '1.5rem',
            background: '#fff3cd',
            borderRadius: '8px',
            border: '2px solid #f59e0b'
          }}>
            <h4 style={{ marginBottom: '0.5rem' }}>💡 Pro Tips for Beginners:</h4>
            <ul style={{ paddingLeft: '1.5rem', lineHeight: '1.8' }}>
              <li>Always choose <strong>Direct Plans</strong> (lower expense ratio)</li>
              <li>Start with a small amount (₹500-1000) to learn</li>
              <li>Set SIP date after your salary date (5th-10th of month)</li>
              <li>Enable auto-debit for hassle-free investing</li>
              <li>Don't stop SIP during market falls (best time to accumulate)</li>
              <li>Review portfolio once every 6 months</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvestmentPlatforms;

