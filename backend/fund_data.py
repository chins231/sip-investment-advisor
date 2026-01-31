"""
Fund Data Module - Simulates real-time fund data
In production, this would fetch from actual APIs like MFApi or RapidAPI
"""

import random
from datetime import datetime, timedelta

class FundDataService:
    """
    Service to provide fund performance data, NAV, and reviews
    Note: This uses simulated data. In production, integrate with real APIs.
    """
    
    def __init__(self):
        # Simulated NAV data for demonstration
        self.fund_nav_data = {
            'HDFC Short Term Debt Fund': 25.43,
            'ICICI Prudential Corporate Bond Fund': 22.87,
            'Axis Banking & PSU Debt Fund': 18.92,
            'HDFC Hybrid Debt Fund': 45.67,
            'ICICI Prudential Equity & Debt Fund': 156.34,
            'HDFC Index Fund - Nifty 50': 89.23,
            'UTI Nifty Index Fund': 112.45,
            'HDFC Corporate Bond Fund': 23.56,
            'Axis Corporate Debt Fund': 19.78,
            'HDFC Balanced Advantage Fund': 234.56,
            'ICICI Prudential Balanced Advantage Fund': 45.89,
            'Axis Bluechip Fund': 67.34,
            'Mirae Asset Large Cap Fund': 89.12,
            'HDFC Top 100 Fund': 678.90,
            'Parag Parikh Flexi Cap Fund': 56.78,
            'Mirae Asset Emerging Bluechip Fund': 78.45,
            'Axis Midcap Fund': 98.76,
            'Kotak Small Cap Fund': 234.12
        }
    
    def get_current_nav(self, fund_name):
        """Get current NAV for a fund"""
        return self.fund_nav_data.get(fund_name, 100.00)
    
    def generate_performance_data(self, fund_name, period='1Y'):
        """
        Generate simulated performance data for different time periods
        In production, fetch from real API
        """
        current_nav = self.get_current_nav(fund_name)
        
        # Define number of data points based on period
        periods = {
            '7D': 7,
            '1M': 30,
            '3M': 90,
            '6M': 180,
            '1Y': 365
        }
        
        days = periods.get(period, 365)
        
        # Generate historical NAV data (simulated)
        data_points = []
        base_return = self._get_base_return(fund_name)
        
        for i in range(days, -1, -1):
            date = datetime.now() - timedelta(days=i)
            # Simulate NAV with some randomness
            daily_change = random.uniform(-0.02, 0.02)  # -2% to +2% daily
            nav = current_nav * (1 - (base_return / 365) * i) * (1 + daily_change)
            
            data_points.append({
                'date': date.strftime('%Y-%m-%d'),
                'nav': round(nav, 2)
            })
        
        return data_points
    
    def _get_base_return(self, fund_name):
        """Get base annual return based on fund type"""
        if 'Debt' in fund_name or 'Bond' in fund_name:
            return random.uniform(0.06, 0.09)  # 6-9% for debt
        elif 'Hybrid' in fund_name or 'Balanced' in fund_name:
            return random.uniform(0.09, 0.12)  # 9-12% for hybrid
        else:
            return random.uniform(0.12, 0.18)  # 12-18% for equity
    
    def calculate_returns(self, fund_name):
        """Calculate returns for different periods"""
        current_nav = self.get_current_nav(fund_name)
        base_return = self._get_base_return(fund_name)
        
        # Calculate returns with some randomness
        returns = {
            '7D': round(base_return * (7/365) + random.uniform(-0.01, 0.01), 2),
            '1M': round(base_return * (30/365) + random.uniform(-0.02, 0.02), 2),
            '3M': round(base_return * (90/365) + random.uniform(-0.03, 0.03), 2),
            '6M': round(base_return * (180/365) + random.uniform(-0.04, 0.04), 2),
            '1Y': round(base_return + random.uniform(-0.05, 0.05), 2)
        }
        
        return {
            'current_nav': current_nav,
            'returns': {
                '7_days': returns['7D'] * 100,
                '1_month': returns['1M'] * 100,
                '3_months': returns['3M'] * 100,
                '6_months': returns['6M'] * 100,
                '1_year': returns['1Y'] * 100
            }
        }
    
    def get_fund_reviews(self, fund_name):
        """
        Get user reviews for a fund
        In production, fetch from database
        """
        # Simulated reviews
        review_templates = [
            {
                'user': 'Investor{id}',
                'rating': random.randint(3, 5),
                'comment': 'Great fund with consistent returns. Highly recommended for long-term investors.',
                'date': (datetime.now() - timedelta(days=random.randint(1, 90))).strftime('%Y-%m-%d')
            },
            {
                'user': 'Investor{id}',
                'rating': random.randint(3, 5),
                'comment': 'Good performance during market volatility. Fund manager is experienced.',
                'date': (datetime.now() - timedelta(days=random.randint(1, 90))).strftime('%Y-%m-%d')
            },
            {
                'user': 'Investor{id}',
                'rating': random.randint(3, 5),
                'comment': 'Steady growth with low expense ratio. Perfect for SIP investments.',
                'date': (datetime.now() - timedelta(days=random.randint(1, 90))).strftime('%Y-%m-%d')
            },
            {
                'user': 'Investor{id}',
                'rating': random.randint(4, 5),
                'comment': 'Excellent fund for risk-averse investors. Consistent dividends.',
                'date': (datetime.now() - timedelta(days=random.randint(1, 90))).strftime('%Y-%m-%d')
            },
            {
                'user': 'Investor{id}',
                'rating': random.randint(3, 5),
                'comment': 'Good diversification and professional management. Satisfied with returns.',
                'date': (datetime.now() - timedelta(days=random.randint(1, 90))).strftime('%Y-%m-%d')
            }
        ]
        
        # Generate 3-5 random reviews
        num_reviews = random.randint(3, 5)
        reviews = []
        for i in range(num_reviews):
            review = review_templates[i % len(review_templates)].copy()
            review['user'] = review['user'].format(id=random.randint(1000, 9999))
            reviews.append(review)
        
        avg_rating = sum(r['rating'] for r in reviews) / len(reviews)
        
        return {
            'average_rating': round(avg_rating, 1),
            'total_reviews': len(reviews),
            'reviews': reviews
        }
    
    def get_complete_fund_data(self, fund_name):
        """Get all data for a fund"""
        return {
            'fund_name': fund_name,
            'current_nav': self.get_current_nav(fund_name),
            'performance': self.calculate_returns(fund_name),
            'reviews': self.get_fund_reviews(fund_name),
            'last_updated': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        }

# Example usage
if __name__ == '__main__':
    service = FundDataService()
    
    # Test with a fund
    fund = 'Axis Bluechip Fund'
    data = service.get_complete_fund_data(fund)
    
    print(f"Fund: {data['fund_name']}")
    print(f"Current NAV: ₹{data['current_nav']}")
    print(f"1 Year Return: {data['performance']['returns']['1_year']}%")
    print(f"Average Rating: {data['reviews']['average_rating']}/5")
    print(f"Total Reviews: {data['reviews']['total_reviews']}")

