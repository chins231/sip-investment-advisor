# Sector-Specific Investment Features Guide

## Overview
This guide explains the new sector-specific investment features added to the SIP Investment Advisor application.

## New Features

### 1. Sector Selection in Investment Form
Users can now select specific investment sectors to get targeted fund recommendations:

**Available Sectors:**
- 🏭 **Metal & Mining** - Steel, aluminum, copper, and mining companies
- 🛡️ **Defense & Aerospace** - Defense manufacturing and aerospace companies
- 💻 **Information Technology** - IT services, software, and technology companies
- 💊 **Pharma & Healthcare** - Pharmaceutical and healthcare companies
- 🏦 **Banking & Financial Services** - Banks, NBFCs, and financial institutions
- 🚗 **Auto & Auto Components** - Automobile manufacturers and component suppliers
- 🏗️ **Infrastructure** - Construction, cement, and infrastructure companies
- ⚡ **Energy & Power** - Power generation, oil & gas companies
- 🛒 **FMCG & Consumer** - Fast-moving consumer goods companies
- 🌐 **Diversified** - Multi-sector diversified funds

### 2. Portfolio Holdings View
Each sector-specific fund now includes:
- **Top 5 Holdings** - Major companies in the fund's portfolio with allocation percentages
- **Sector Information** - Fund type, expected returns, and risk level
- **Holdings URL** - Direct link to the fund's official holdings page
- **Visual Representation** - Bar charts showing allocation percentages

### 3. Smart Diversification Warnings
The system provides intelligent warnings:
- **Single Sector Warning** - Alerts when only one sector is selected
- **Risk Notifications** - Explains sector-specific risks
- **Diversification Recommendations** - Suggests selecting 2-3 sectors minimum

## How to Use

### For Users

1. **Fill Basic Information**
   - Name, email, risk profile, investment duration, monthly amount

2. **Select Sectors (Optional)**
   - Click "▶ Show Sectors" to expand sector selection
   - Check boxes for desired sectors
   - Leave empty for traditional diversified portfolio

3. **View Recommendations**
   - Get sector-specific fund recommendations
   - Click "🏢 View Holdings" to see portfolio composition
   - Click "📊 View Performance" for historical data

4. **Review Warnings**
   - Read sector-specific risk warnings
   - Follow diversification recommendations

### For Developers

#### Backend Changes

**New Files:**
- `backend/sector_funds.py` - Sector fund database with 20+ funds

**Modified Files:**
- `backend/sip_engine.py` - Added `sector_preferences` parameter
- `backend/routes.py` - Added 3 new API endpoints

**New API Endpoints:**
```python
GET /api/sectors
# Returns list of available sectors

GET /api/fund-holdings/<fund_name>
# Returns portfolio holdings for a specific fund

POST /api/sector-funds
# Body: { "sectors": ["metal", "it", "defense"] }
# Returns funds matching selected sectors
```

#### Frontend Changes

**New Files:**
- `frontend/src/components/FundHoldings.jsx` - Holdings display component

**Modified Files:**
- `frontend/src/components/InvestmentForm.jsx` - Added sector selection UI
- `frontend/src/components/RecommendationResults.jsx` - Added holdings button
- `frontend/src/styles/index.css` - Added sector selection styles

**New State Management:**
```javascript
const [sector_preferences, setSectorPreferences] = useState([]);
const [showSectorSelection, setShowSectorSelection] = useState(false);
```

## Technical Implementation

### Sector Fund Data Structure
```python
SECTOR_FUNDS = {
    'metal': {
        'name': 'Metal & Mining',
        'funds': [{
            'name': 'Nippon India ETF Metal',
            'type': 'ETF',
            'expected_return': 18.0,
            'risk_level': 'Very High',
            'holdings_url': 'https://...',
            'top_holdings': [
                {'company': 'Tata Steel', 'percentage': 22.5},
                {'company': 'Hindalco Industries', 'percentage': 18.3},
                # ... more holdings
            ],
            'description': 'Fund description...'
        }]
    }
}
```

### Recommendation Engine Logic
```python
def generate_recommendations(
    risk_profile, 
    investment_years, 
    monthly_investment, 
    max_funds=None, 
    sector_preferences=None
):
    if sector_preferences and len(sector_preferences) > 0:
        # Use sector-specific funds
        sector_funds = get_sector_funds(sector_preferences)
        # Distribute allocation equally
    else:
        # Use traditional diversified approach
        # Based on risk profile and duration
```

### Holdings Display Component
```javascript
<FundHoldings fundName={rec.fund_name} />
// Fetches and displays:
// - Top 5 holdings with percentages
// - Visual bar charts
// - Link to official holdings page
```

## Deployment Steps

### 1. Backend Deployment (Render)
```bash
# Changes are automatically deployed when you push to GitHub
git add .
git commit -m "Add sector-specific investment features"
git push origin main
```

### 2. Frontend Deployment (Vercel)
```bash
# Vercel auto-deploys on push
# No additional steps needed
```

### 3. Verify Deployment
1. Check Render dashboard for successful build
2. Check Vercel dashboard for deployment status
3. Test new features on live site

## Testing Checklist

- [ ] Sector selection UI appears when "Show Sectors" is clicked
- [ ] Multiple sectors can be selected/deselected
- [ ] Warning appears when only 1 sector is selected
- [ ] Recommendations change based on sector selection
- [ ] "View Holdings" button appears for sector-specific funds
- [ ] Holdings modal displays top 5 companies correctly
- [ ] Holdings URL link opens in new tab
- [ ] Diversification warnings display correctly
- [ ] Empty sector selection uses traditional approach

## Performance Considerations

1. **Sector Data Loading** - Sectors fetched once on component mount
2. **Holdings Data** - Loaded on-demand when user clicks "View Holdings"
3. **Caching** - Consider implementing browser caching for sector data
4. **API Response Time** - Holdings endpoint is fast (no external API calls)

## Future Enhancements

1. **Real-time Holdings Data** - Integrate with fund house APIs
2. **Sector Performance Comparison** - Compare sector returns over time
3. **Sector Rotation Strategy** - Suggest optimal sector allocation based on market cycles
4. **Custom Sector Weights** - Allow users to specify allocation percentages per sector
5. **Sector News Feed** - Display latest news for selected sectors

## Troubleshooting

### Issue: Sectors not loading
**Solution:** Check browser console for API errors. Verify `/api/sectors` endpoint is accessible.

### Issue: Holdings not displaying
**Solution:** Ensure fund name matches exactly with sector_funds.py database. Check `/api/fund-holdings/<fund_name>` endpoint.

### Issue: Warnings not showing
**Solution:** Verify `investment_strategy` object includes `sector_warning` and `sector_note` fields.

## Support

For issues or questions:
1. Check browser console for errors
2. Verify API endpoints are responding
3. Review backend logs in Render dashboard
4. Check frontend build logs in Vercel dashboard

## Version History

- **v2.0.0** (2026-01-31) - Added sector-specific investment features
  - Sector selection UI
  - Portfolio holdings display
  - Smart diversification warnings
  - 20+ sector-specific funds database