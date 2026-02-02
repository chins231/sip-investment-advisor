import React, { useState } from 'react';

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      category: '🎯 SIP Basics',
      questions: [
        {
          q: 'What is SIP (Systematic Investment Plan)?',
          a: 'SIP is a method of investing a fixed amount regularly (monthly/quarterly) in mutual funds. It\'s like a recurring deposit but in mutual funds. Instead of timing the market, you invest consistently regardless of market conditions.',
          video: 'https://www.youtube.com/watch?v=Zn-3Zq8cZKw'
        },
        {
          q: 'How much should I invest in SIP?',
          a: 'Start with what you can afford consistently. Even ₹500/month is good to begin. A general rule: invest 20-30% of your monthly income. Start small, increase gradually as your income grows.',
          video: 'https://www.youtube.com/watch?v=8qFNnXmJZWs'
        },
        {
          q: 'What is the minimum amount for SIP?',
          a: 'Most mutual funds allow SIP starting from ₹500 per month. Some funds even allow ₹100. There\'s no maximum limit - invest as much as you\'re comfortable with.',
          video: null
        },
        {
          q: 'Can I stop or pause my SIP?',
          a: 'Yes! You can stop, pause, or modify your SIP anytime. There\'s no penalty. You can also increase or decrease the amount. SIPs are completely flexible.',
          video: null
        }
      ]
    },
    {
      category: '📊 Direct vs Regular Funds',
      questions: [
        {
          q: 'What is the difference between Direct and Regular mutual funds?',
          a: 'Direct Plans: You buy directly from AMC (fund house). Lower expense ratio, higher returns. No distributor commission.\n\nRegular Plans: Bought through distributors/agents. Higher expense ratio due to commission. Lower returns compared to direct.\n\nExample: If Direct plan has 1% expense ratio, Regular might have 2%. Over 20 years, this 1% difference can mean lakhs of rupees!',
          video: 'https://www.youtube.com/watch?v=nKMldHjKJKI'
        },
        {
          q: 'Should I choose Direct or Regular plans?',
          a: 'Always choose Direct Plans if you can research and select funds yourself (like using this app!). You save on commission and get better returns. Choose Regular only if you need hand-holding from an advisor.',
          video: null
        },
        {
          q: 'How much more do Direct plans return?',
          a: 'Typically 0.5-1.5% more annually. On a ₹10,000 monthly SIP for 20 years:\n- Regular Plan: ~₹75 lakhs\n- Direct Plan: ~₹85 lakhs\nThat\'s ₹10 lakhs more just by choosing Direct!',
          video: null
        }
      ]
    },
    {
      category: '🌍 Fund Types & Categories',
      questions: [
        {
          q: 'What are Equity Funds?',
          a: 'Funds that invest primarily in stocks/shares. Higher risk, higher potential returns (12-18% annually). Best for long-term goals (5+ years). Examples: Large Cap, Mid Cap, Small Cap funds.',
          video: 'https://www.youtube.com/watch?v=7FMm413400A'
        },
        {
          q: 'What are Debt Funds?',
          a: 'Funds that invest in bonds, government securities, and fixed-income instruments. Lower risk, stable returns (6-9% annually). Good for short-term goals (1-3 years) or conservative investors.',
          video: 'https://www.youtube.com/watch?v=Oj_vqPqPqPo'
        },
        {
          q: 'What are Hybrid/Balanced Funds?',
          a: 'Mix of equity and debt. Moderate risk and returns (9-12% annually). Good for investors who want balance between growth and stability. Automatically rebalances between equity and debt.',
          video: null
        },
        {
          q: 'Which funds have US equities?',
          a: 'International/Global funds invest in US and other foreign markets:\n- Parag Parikh Flexi Cap Fund (30-35% in US stocks)\n- Motilal Oswal Nasdaq 100 Fund\n- ICICI Prudential US Bluechip Fund\n- Edelweiss US Technology Fund\n\nThese give you exposure to Apple, Microsoft, Google, Amazon, etc.',
          video: 'https://www.youtube.com/watch?v=qKXrVriacPo'
        },
        {
          q: 'What is Large Cap, Mid Cap, Small Cap?',
          a: 'Based on company size:\n- Large Cap: Top 100 companies (TCS, Reliance). Lower risk, stable returns.\n- Mid Cap: 101-250 companies. Moderate risk, good growth potential.\n- Small Cap: 251+ companies. Higher risk, highest growth potential.\n\nBeginners should start with Large Cap or Flexi Cap funds.',
          video: 'https://www.youtube.com/watch?v=Oj_vqPqPqPo'
        }
      ]
    },
    {
      category: '📊 Index Funds & Passive Investing',
      questions: [
        {
          q: 'What are Index Funds?',
          a: 'Index funds are passive mutual funds that track a market index like Nifty 50, Nifty Midcap 150, or Sensex. Instead of a fund manager actively picking stocks, the fund simply mirrors the index composition.\n\nExample: A Nifty 50 index fund will hold the same 50 stocks in the same proportion as the Nifty 50 index.',
          video: 'https://www.youtube.com/watch?v=fvGLnthJDsg'
        },
        {
          q: 'Index Funds vs Active Funds - Which is better?',
          a: 'Index Funds Advantages:\n✓ Lower expense ratio (0.1-0.5% vs 1-2%)\n✓ Transparent holdings (you know exactly what you own)\n✓ No fund manager risk\n✓ Consistent with market returns\n✓ Better for long-term passive investing\n\nActive Funds Advantages:\n✓ Potential to beat the market\n✓ Fund manager expertise\n✓ Can avoid bad stocks\n\nFor most investors, index funds are better due to lower costs and simplicity.',
          video: 'https://www.youtube.com/watch?v=fvGLnthJDsg'
        },
        {
          q: 'What are the advantages of Index Funds?',
          a: '1. Low Cost: Expense ratios as low as 0.1-0.5% (vs 1-2% for active funds)\n2. Transparency: You always know what stocks you own\n3. Diversification: Instant exposure to 50-250 companies\n4. No Fund Manager Risk: Performance doesn\'t depend on one person\n5. Tax Efficient: Lower portfolio turnover means less capital gains tax\n6. Simplicity: Easy to understand and track\n7. Long-term Performance: Over 10+ years, most active funds fail to beat index',
          video: 'https://www.youtube.com/watch?v=fvGLnthJDsg'
        },
        {
          q: 'What are the disadvantages of Index Funds?',
          a: '1. No Outperformance: Can never beat the market, only match it\n2. Tracking Error: Small difference between fund and index returns\n3. No Downside Protection: Falls with the market during crashes\n4. Limited to Index: Can\'t avoid bad companies in the index\n5. Not Suitable for Short-term: Best for 5+ years investment\n\nDespite these, index funds are excellent for long-term wealth creation.',
          video: null
        },
        {
          q: 'Which Index Funds should I invest in?',
          a: 'Popular Index Funds in India:\n\n1. Nifty 50 Index Funds (Large Cap):\n- HDFC Index Fund - Nifty 50\n- ICICI Prudential Nifty Index Fund\n- UTI Nifty Index Fund\n\n2. Nifty Next 50 (Large Cap):\n- HDFC Nifty Next 50 Index Fund\n\n3. Nifty Midcap 150 (Mid Cap):\n- HDFC Nifty Midcap 150 Index Fund\n- ICICI Prudential Nifty Midcap 150\n\n4. Nifty Smallcap 250 (Small Cap):\n- HDFC Nifty Smallcap 250 Index Fund\n\nStart with Nifty 50 for stability, add Midcap for growth.',
          video: null
        },
        {
          q: 'How much should I allocate to Index Funds?',
          a: 'Recommended Allocation:\n\nConservative (Low Risk):\n- 70% Debt funds\n- 20% Nifty 50 Index\n- 10% Nifty Midcap Index\n\nBalanced (Medium Risk):\n- 30% Debt funds\n- 40% Nifty 50 Index\n- 30% Nifty Midcap Index\n\nAggressive (High Risk):\n- 10% Debt funds\n- 30% Nifty 50 Index\n- 30% Nifty Midcap Index\n- 30% Nifty Smallcap Index\n\nYou can also mix index funds with active funds (50-50 split).',
          video: null
        },
        {
          q: 'Are Index Funds good for SIP?',
          a: 'Yes! Index funds are excellent for SIP:\n✓ Rupee cost averaging works perfectly\n✓ Lower costs compound over time\n✓ No need to time the market\n✓ Disciplined long-term investing\n✓ Reduces emotional decision-making\n\nSIP in index funds is one of the simplest and most effective wealth creation strategies for 10+ years.',
          video: 'https://www.youtube.com/watch?v=fvGLnthJDsg'
        }
      ]
    },
    {
      category: '� Returns & Taxation',
      questions: [
        {
          q: 'What returns can I expect from SIP?',
          a: 'Historical averages (not guaranteed):\n- Equity Funds: 12-15% annually\n- Hybrid Funds: 9-12% annually\n- Debt Funds: 6-9% annually\n\nActual returns vary based on market conditions. SIP works best over 5+ years.',
          video: 'https://www.youtube.com/watch?v=8qFNnXmJZWs'
        },
        {
          q: 'How is SIP taxed?',
          a: 'Equity Funds:\n- Short term (<1 year): 15% tax\n- Long term (>1 year): 10% tax on gains above ₹1 lakh\n\nDebt Funds:\n- Taxed as per your income tax slab\n- No special long-term benefit\n\nELSS Funds: Tax deduction under 80C (up to ₹1.5 lakh)',
          video: 'https://www.youtube.com/watch?v=Zn-3Zq8cZKw'
        },
        {
          q: 'What is ELSS (Tax Saving Fund)?',
          a: 'Equity Linked Savings Scheme. Invest and save tax under Section 80C. Lock-in period: 3 years. Can invest up to ₹1.5 lakh per year and save up to ₹46,800 in taxes (30% bracket).',
          video: null
        }
      ]
    },
    {
      category: '🎓 Investment Strategy',
      questions: [
        {
          q: 'Should I invest lumpsum or SIP?',
          a: 'SIP is better for most people:\n- Reduces timing risk\n- Rupee cost averaging\n- Disciplined investing\n- Less stressful\n\nLumpsum only if you have experience and can handle volatility.',
          video: 'https://www.youtube.com/watch?v=nKMldHjKJKI'
        },
        {
          q: 'When should I stop my SIP?',
          a: 'Don\'t stop during market falls - that\'s the best time to accumulate! Stop only when:\n- You\'ve reached your financial goal\n- You need money urgently\n- Fund performance is consistently poor (3+ years)\n\nNever stop due to short-term market volatility.',
          video: null
        },
        {
          q: 'How many funds should I invest in?',
          a: 'Ideal: 3-7 funds for good diversification\n- Too few (1-2): Not diversified enough\n- Too many (10+): Hard to track, over-diversification\n\nMix across:\n- 1-2 Large Cap funds\n- 1-2 Mid/Small Cap funds\n- 1 International fund\n- 1 Debt fund (if needed)',
          video: null
        },
        {
          q: 'What is the best day for SIP?',
          a: 'Choose 5-10 days after your salary date. This ensures money is available. The specific date (1st, 10th, 15th) doesn\'t matter much for long-term returns. Consistency matters more than timing.',
          video: null
        }
      ]
    },
    {
      category: '🔒 Safety & Risks',
      questions: [
        {
          q: 'Is SIP safe? Can I lose money?',
          a: 'SIPs in equity funds have market risk - value can go up or down. However:\n- Over 5+ years, equity funds historically give positive returns\n- SIP reduces risk through rupee cost averaging\n- Diversification reduces risk further\n- Debt funds are safer but lower returns\n\nNever invest money you need in next 1-2 years.',
          video: 'https://www.youtube.com/watch?v=7FMm413400A'
        },
        {
          q: 'What if the fund house shuts down?',
          a: 'Your money is safe! Mutual funds are regulated by SEBI. Your units are held in demat form. If a fund house shuts, another fund house takes over or you get your money back. Fund house and your money are kept separate.',
          video: null
        },
        {
          q: 'How to check if a fund is good?',
          a: 'Check these factors:\n- 5-year returns (compare with benchmark)\n- Expense ratio (lower is better)\n- Fund manager experience\n- AUM (Assets Under Management)\n- Consistency of returns\n- Rating (4-5 stars)\n\nUse this app\'s recommendations as a starting point!',
          video: null
        }
      ]
    }
  ];

  const toggleFAQ = (categoryIndex, questionIndex) => {
    const index = `${categoryIndex}-${questionIndex}`;
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="card" style={{ marginTop: '2rem' }}>
      <h2>❓ Frequently Asked Questions</h2>
      <p style={{ color: '#64748b', marginBottom: '2rem' }}>
        Everything you need to know about SIP investing. Click on any question to see the answer!
      </p>

      {faqs.map((category, catIndex) => (
        <div key={catIndex} style={{ marginBottom: '2rem' }}>
          <h3 style={{ 
            background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
            color: 'white',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1rem'
          }}>
            {category.category}
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {category.questions.map((faq, qIndex) => {
              const index = `${catIndex}-${qIndex}`;
              const isOpen = openIndex === index;

              return (
                <div key={qIndex} style={{
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  transition: 'all 0.3s'
                }}>
                  <div
                    onClick={() => toggleFAQ(catIndex, qIndex)}
                    style={{
                      padding: '1rem',
                      background: isOpen ? '#eff6ff' : 'white',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontWeight: '600',
                      color: isOpen ? '#2563eb' : '#1e293b'
                    }}
                  >
                    <span>{faq.q}</span>
                    <span style={{ fontSize: '1.5rem', transition: 'transform 0.3s', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                      ▼
                    </span>
                  </div>

                  {isOpen && (
                    <div style={{ padding: '1rem', background: '#f8fafc', borderTop: '2px solid #e2e8f0' }}>
                      <p style={{ whiteSpace: 'pre-line', lineHeight: '1.8', color: '#475569' }}>
                        {faq.a}
                      </p>
                      {faq.video && (
                        <a
                          href={faq.video}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            marginTop: '1rem',
                            padding: '0.5rem 1rem',
                            background: '#ef4444',
                            color: 'white',
                            borderRadius: '6px',
                            textDecoration: 'none',
                            fontWeight: '600',
                            fontSize: '0.875rem'
                          }}
                        >
                          ▶️ Watch Video Explanation
                        </a>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <div style={{
        marginTop: '2rem',
        padding: '1.5rem',
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        color: 'white',
        borderRadius: '12px'
      }}>
        <h4 style={{ marginBottom: '1rem' }}>📚 Want to Learn More?</h4>
        <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
          Check out these excellent YouTube channels for investment education:
        </p>
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          <a href="https://www.youtube.com/@FreefincalTV" target="_blank" rel="noopener noreferrer" style={{ color: 'white', textDecoration: 'underline' }}>
            📺 Freefincal - Detailed mutual fund analysis
          </a>
          <a href="https://www.youtube.com/@LaboratoryGrowth" target="_blank" rel="noopener noreferrer" style={{ color: 'white', textDecoration: 'underline' }}>
            📺 Labour Law Advisor - SIP strategies
          </a>
          <a href="https://www.youtube.com/@AshuSehrawat" target="_blank" rel="noopener noreferrer" style={{ color: 'white', textDecoration: 'underline' }}>
            📺 Asset Yogi - Beginner-friendly content
          </a>
          <a href="https://www.youtube.com/@pranjalkamra" target="_blank" rel="noopener noreferrer" style={{ color: 'white', textDecoration: 'underline' }}>
            📺 Pranjal Kamra - Financial planning
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQSection;

