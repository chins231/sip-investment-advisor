# 📈 SIP Investment Advisor

A comprehensive stock market prediction and SIP (Systematic Investment Plan) recommendation application that suggests mutual funds based on user risk profile and investment duration.

## 🌟 Features

- **Risk-Based Recommendations**: Get personalized SIP suggestions based on your risk appetite (Low, Medium, High)
- **Investment Duration Analysis**: Optimized portfolio allocation based on investment timeline (1-30 years)
- **Portfolio Visualization**: Interactive charts showing asset allocation
- **Expected Returns Calculator**: Calculate projected returns based on historical data
- **Multiple Fund Categories**: Recommendations across Debt, Hybrid, and Equity funds
- **Investment Strategy Guidance**: Detailed strategy advice for your profile
- **User Profile Management**: Save and retrieve investment profiles

## 🏗️ Architecture

### Backend (Python/Flask)
- **Framework**: Flask with SQLAlchemy ORM
- **Database**: SQLite (easily upgradable to PostgreSQL)
- **API**: RESTful API with CORS support
- **Recommendation Engine**: Custom algorithm considering risk profile and duration

### Frontend (React/Vite)
- **Framework**: React 18 with Vite
- **Styling**: Custom CSS with responsive design
- **Charts**: Recharts for data visualization
- **API Client**: Axios for HTTP requests

## 📋 Prerequisites

- Python 3.8 or higher
- Node.js 16 or higher
- npm or yarn

## 🚀 Installation & Setup

### Backend Setup

1. Navigate to the backend directory:
```bash
cd stock-sip-advisor/backend
```

2. Create a virtual environment:
```bash
python -m venv venv
```

3. Activate the virtual environment:
- **Windows**: `venv\Scripts\activate`
- **macOS/Linux**: `source venv/bin/activate`

4. Install dependencies:
```bash
pip install -r requirements.txt
```

5. Initialize the database:
```bash
python main.py
```

The backend server will start at `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd stock-sip-advisor/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## 📖 Usage

### Using the Application

1. **Open the Application**: Navigate to `http://localhost:3000` in your browser

2. **Fill in Your Details**:
   - Enter your name and email
   - Select your risk profile (Conservative, Balanced, or Aggressive)
   - Choose investment duration (1-30 years)
   - Enter monthly investment amount (minimum ₹500)

3. **Get Recommendations**: Click "Get SIP Recommendations"

4. **Review Results**:
   - View portfolio summary with expected returns
   - See asset allocation chart
   - Review recommended mutual funds
   - Read investment strategy advice

### API Endpoints

#### Generate Recommendations
```http
POST /api/generate-recommendations
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "risk_profile": "medium",
  "investment_years": 10,
  "monthly_investment": 10000
}
```

#### Get User Recommendations
```http
GET /api/user/{user_id}/recommendations
```

#### Compare Scenarios
```http
POST /api/compare-scenarios
Content-Type: application/json

{
  "scenarios": [
    {
      "name": "Scenario 1",
      "risk_profile": "low",
      "investment_years": 5,
      "monthly_investment": 5000
    },
    {
      "name": "Scenario 2",
      "risk_profile": "high",
      "investment_years": 10,
      "monthly_investment": 10000
    }
  ]
}
```

#### Health Check
```http
GET /api/health
```

## 🎯 Risk Profiles

### Conservative (Low Risk)
- **Allocation**: 70% Debt, 20% Hybrid, 10% Equity
- **Expected Return**: ~8-9% annually
- **Best For**: Capital preservation, short-term goals, risk-averse investors

### Balanced (Medium Risk)
- **Allocation**: 40% Debt, 30% Hybrid, 30% Equity
- **Expected Return**: ~10-12% annually
- **Best For**: Balanced growth, medium-term goals, moderate risk tolerance

### Aggressive (High Risk)
- **Allocation**: 10% Debt, 20% Hybrid, 70% Equity
- **Expected Return**: ~13-15% annually
- **Best For**: Wealth creation, long-term goals, high risk tolerance

## 📊 Recommended Funds

The application recommends funds from various categories:

### Debt Funds
- HDFC Short Term Debt Fund
- ICICI Prudential Corporate Bond Fund
- Axis Banking & PSU Debt Fund

### Hybrid Funds
- HDFC Balanced Advantage Fund
- ICICI Prudential Balanced Advantage Fund
- HDFC Hybrid Debt Fund

### Equity Funds
- Axis Bluechip Fund
- Mirae Asset Large Cap Fund
- Parag Parikh Flexi Cap Fund
- Axis Midcap Fund
- Kotak Small Cap Fund

## 🔧 Configuration

### Backend Configuration

Edit `backend/main.py` to configure:
- Database URI
- Secret key
- CORS settings

### Frontend Configuration

Edit `frontend/src/services/api.js` to configure:
- API base URL
- Request timeout
- Headers

## 📁 Project Structure

```
stock-sip-advisor/
├── backend/
│   ├── main.py              # Application entry point
│   ├── models.py            # Database models
│   ├── routes.py            # API routes
│   ├── sip_engine.py        # Recommendation engine
│   ├── requirements.txt     # Python dependencies
│   └── sip_advisor.db       # SQLite database (auto-generated)
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── InvestmentForm.jsx
│   │   │   └── RecommendationResults.jsx
│   │   ├── services/        # API services
│   │   │   └── api.js
│   │   ├── styles/          # CSS styles
│   │   │   └── index.css
│   │   ├── App.jsx          # Main App component
│   │   └── main.jsx         # Entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## 🧪 Testing

### Backend Testing
```bash
cd backend
python -m pytest
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 🚀 Deployment

### Backend Deployment (Heroku)
```bash
cd backend
heroku create your-app-name
git push heroku main
```

### Frontend Deployment (Vercel)
```bash
cd frontend
npm run build
vercel --prod
```

## ⚠️ Important Disclaimers

1. **Educational Purpose**: This application is for educational and informational purposes only
2. **Not Financial Advice**: Recommendations are based on mathematical models and historical data
3. **Market Risks**: Mutual fund investments are subject to market risks
4. **Consult Professionals**: Always consult with certified financial advisors before investing
5. **Past Performance**: Past performance is not indicative of future results
6. **Read Documents**: Read all scheme-related documents carefully before investing

## 🔮 Future Enhancements

- [ ] Real-time market data integration using APIs
- [ ] User authentication and authorization
- [ ] Portfolio tracking and performance monitoring
- [ ] Email notifications for recommendations
- [ ] PDF report generation
- [ ] Mobile app (React Native)
- [ ] Advanced analytics and backtesting
- [ ] Integration with actual mutual fund platforms
- [ ] Tax calculation and optimization
- [ ] Goal-based investment planning

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For issues and questions, please open an issue on the GitHub repository.

---

**Remember**: Invest wisely, diversify your portfolio, and always do your own research! 🎯