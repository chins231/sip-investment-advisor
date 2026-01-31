import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import yfinance as yf

class SIPRecommendationEngine:
    """
    Engine to recommend SIP investments based on user risk profile and investment duration
    """
    
    def __init__(self):
        # Define fund categories with Indian mutual funds focus
        self.fund_categories = {
            'low_risk': {
                'debt_funds': {
                    'allocation': 70,
                    'expected_return': 7.5,
                    'funds': [
                        'HDFC Short Term Debt Fund',
                        'ICICI Prudential Corporate Bond Fund',
                        'Axis Banking & PSU Debt Fund'
                    ]
                },
                'hybrid_funds': {
                    'allocation': 20,
                    'expected_return': 9.0,
                    'funds': [
                        'HDFC Hybrid Debt Fund',
                        'ICICI Prudential Equity & Debt Fund'
                    ]
                },
                'equity_funds': {
                    'allocation': 10,
                    'expected_return': 12.0,
                    'funds': [
                        'HDFC Index Fund - Nifty 50',
                        'UTI Nifty Index Fund'
                    ]
                }
            },
            'medium_risk': {
                'debt_funds': {
                    'allocation': 40,
                    'expected_return': 7.5,
                    'funds': [
                        'HDFC Corporate Bond Fund',
                        'Axis Corporate Debt Fund'
                    ]
                },
                'hybrid_funds': {
                    'allocation': 30,
                    'expected_return': 10.0,
                    'funds': [
                        'HDFC Balanced Advantage Fund',
                        'ICICI Prudential Balanced Advantage Fund'
                    ]
                },
                'equity_funds': {
                    'allocation': 30,
                    'expected_return': 13.5,
                    'funds': [
                        'Axis Bluechip Fund',
                        'Mirae Asset Large Cap Fund',
                        'HDFC Top 100 Fund'
                    ]
                }
            },
            'high_risk': {
                'debt_funds': {
                    'allocation': 10,
                    'expected_return': 7.5,
                    'funds': [
                        'HDFC Short Term Debt Fund'
                    ]
                },
                'hybrid_funds': {
                    'allocation': 20,
                    'expected_return': 11.0,
                    'funds': [
                        'HDFC Balanced Advantage Fund'
                    ]
                },
                'equity_funds': {
                    'allocation': 70,
                    'expected_return': 15.0,
                    'funds': [
                        'Axis Bluechip Fund',
                        'Parag Parikh Flexi Cap Fund',
                        'Mirae Asset Emerging Bluechip Fund',
                        'Axis Midcap Fund',
                        'Kotak Small Cap Fund'
                    ]
                }
            }
        }
    
    def round_sip_amount(self, amount):
        """
        Round SIP amount to nearest 50 or 100 for cleaner values
        """
        if amount < 100:
            return round(amount / 10) * 10  # Round to nearest 10
        elif amount < 1000:
            return round(amount / 50) * 50  # Round to nearest 50
        else:
            return round(amount / 100) * 100  # Round to nearest 100
    
    def adjust_allocation_by_duration(self, risk_profile, investment_years):
        """
        Adjust asset allocation based on investment duration
        Longer duration allows for more equity exposure
        """
        base_allocation = self.fund_categories[risk_profile].copy()
        
        if investment_years >= 10:
            # Long term - can take more risk
            if risk_profile == 'low_risk':
                base_allocation['equity_funds']['allocation'] = 20
                base_allocation['hybrid_funds']['allocation'] = 30
                base_allocation['debt_funds']['allocation'] = 50
            elif risk_profile == 'medium_risk':
                base_allocation['equity_funds']['allocation'] = 40
                base_allocation['hybrid_funds']['allocation'] = 30
                base_allocation['debt_funds']['allocation'] = 30
        elif investment_years <= 3:
            # Short term - reduce risk
            if risk_profile == 'high_risk':
                base_allocation['equity_funds']['allocation'] = 50
                base_allocation['hybrid_funds']['allocation'] = 30
                base_allocation['debt_funds']['allocation'] = 20
            elif risk_profile == 'medium_risk':
                base_allocation['equity_funds']['allocation'] = 20
                base_allocation['hybrid_funds']['allocation'] = 30
                base_allocation['debt_funds']['allocation'] = 50
        
        return base_allocation
    
    def calculate_expected_returns(self, monthly_investment, investment_years, allocation):
        """
        Calculate expected returns based on SIP investment
        """
        total_months = investment_years * 12
        results = {}
        
        for category, details in allocation.items():
            annual_return = details['expected_return'] / 100
            monthly_return = annual_return / 12
            
            # SIP Future Value calculation
            future_value = monthly_investment * (
                ((1 + monthly_return) ** total_months - 1) / monthly_return
            ) * (1 + monthly_return)
            
            allocation_amount = monthly_investment * (details['allocation'] / 100)
            category_future_value = future_value * (details['allocation'] / 100)
            
            results[category] = {
                'monthly_investment': allocation_amount,
                'total_invested': allocation_amount * total_months,
                'expected_value': category_future_value,
                'expected_return_percentage': details['expected_return'],
                'allocation_percentage': details['allocation'],
                'funds': details['funds']
            }
        
        # Calculate overall portfolio
        total_invested = monthly_investment * total_months
        total_expected_value = sum(r['expected_value'] for r in results.values())
        total_gains = total_expected_value - total_invested
        
        return {
            'category_wise': results,
            'portfolio_summary': {
                'total_monthly_investment': monthly_investment,
                'total_invested': total_invested,
                'expected_portfolio_value': total_expected_value,
                'expected_gains': total_gains,
                'overall_return_percentage': (total_gains / total_invested) * 100
            }
        }
    
    def generate_recommendations(self, risk_profile, investment_years, monthly_investment, max_funds=None, sector_preferences=None):
        """
        Generate complete SIP recommendations
        If sector_preferences is provided, include sector-specific funds
        """
        # Validate inputs
        if risk_profile not in ['low_risk', 'medium_risk', 'high_risk']:
            raise ValueError("Risk profile must be 'low_risk', 'medium_risk', or 'high_risk'")
        
        if investment_years < 1 or investment_years > 30:
            raise ValueError("Investment years must be between 1 and 30")
        
        if monthly_investment < 500:
            raise ValueError("Minimum monthly investment should be ₹500")
        
        if max_funds is not None and (max_funds < 1 or max_funds > 15):
            raise ValueError("Maximum funds must be between 1 and 15")
        
        # Get adjusted allocation
        allocation = self.adjust_allocation_by_duration(risk_profile, investment_years)
        
        # Calculate returns
        returns = self.calculate_expected_returns(monthly_investment, investment_years, allocation)
        
        # Generate fund recommendations
        recommendations = []
        data_source_info = None
        
        # If sector preferences are specified, use sector-specific funds
        if sector_preferences and len(sector_preferences) > 0:
            from sector_funds import get_sector_funds
            sector_funds, data_source_info = get_sector_funds(sector_preferences)
            
            # Limit to max 5 funds per sector to avoid overwhelming user
            max_funds_per_request = 10
            if len(sector_funds) > max_funds_per_request:
                # Sort by expected return and take top funds
                sector_funds = sorted(sector_funds, key=lambda x: x.get('expected_return', 0), reverse=True)[:max_funds_per_request]
            
            # Distribute allocation across sector funds
            if sector_funds:
                allocation_per_fund = 100 / len(sector_funds)
                for fund in sector_funds:
                    raw_monthly_investment = monthly_investment * (allocation_per_fund / 100)
                    rec = {
                        'fund_name': fund['name'],
                        'fund_type': fund['type'],
                        'allocation_percentage': allocation_per_fund,
                        'monthly_investment': self.round_sip_amount(raw_monthly_investment),
                        'expected_return': fund['expected_return'],
                        'risk_level': fund['risk_level'],
                        'sector': fund.get('sector', 'Sector-Specific'),
                        'has_holdings': True  # Flag to show holdings button
                    }
                    # Add API-specific fields if available
                    if fund.get('is_dynamic'):
                        rec['nav'] = fund.get('nav')
                        rec['nav_date'] = fund.get('nav_date')
                        rec['scheme_code'] = fund.get('scheme_code')
                        rec['fund_house'] = fund.get('fund_house')
                    recommendations.append(rec)
        else:
            # Use traditional diversified approach
            for category, details in returns['category_wise'].items():
                for fund in details['funds']:
                    raw_monthly_investment = details['monthly_investment'] / len(details['funds'])
                    recommendations.append({
                        'fund_name': fund,
                        'fund_type': category.replace('_', ' ').title(),
                        'allocation_percentage': details['allocation_percentage'] / len(details['funds']),
                        'monthly_investment': self.round_sip_amount(raw_monthly_investment),
                        'expected_return': details['expected_return_percentage'],
                        'risk_level': risk_profile.replace('_', ' ').title(),
                        'has_holdings': False
                    })
        
        # Limit number of funds if max_funds is specified
        if max_funds is not None and len(recommendations) > max_funds:
            # Sort by allocation percentage (highest first) and take top max_funds
            recommendations = sorted(recommendations, key=lambda x: x['allocation_percentage'], reverse=True)[:max_funds]
            
            # Recalculate allocations to sum to 100%
            total_allocation = sum(r['allocation_percentage'] for r in recommendations)
            for rec in recommendations:
                rec['allocation_percentage'] = (rec['allocation_percentage'] / total_allocation) * 100
                raw_monthly_investment = monthly_investment * (rec['allocation_percentage'] / 100)
                rec['monthly_investment'] = self.round_sip_amount(raw_monthly_investment)
        
        result = {
            'recommendations': recommendations,
            'portfolio_summary': returns['portfolio_summary'],
            'investment_strategy': self.get_investment_strategy(risk_profile, investment_years, sector_preferences)
        }
        
        # Add data source information if available
        if data_source_info:
            result['data_source'] = data_source_info
        
        # Add fund count explanation if fewer funds than requested
        # This helps users understand why they're seeing fewer funds and how to get more
        print(f"[DEBUG] max_funds={max_funds}, len(recommendations)={len(recommendations)}")
        if max_funds is not None and len(recommendations) < max_funds:
            print(f"[DEBUG] Adding fund_count_info to response")
            min_sip_for_max_funds = max_funds * 500  # Minimum ₹500 per fund
            result['fund_count_info'] = {
                'requested': max_funds,
                'showing': len(recommendations),
                'reason': 'optimal_diversification',
                'message': f'Showing {len(recommendations)} out of {max_funds} requested funds based on optimal portfolio diversification for your risk profile.',
                'suggestion': f'To invest in more funds, consider increasing your SIP amount to at least ₹{min_sip_for_max_funds:,}/month (₹500 minimum per fund).' if monthly_investment < min_sip_for_max_funds else None
            }
        
        return result
    
    def get_investment_strategy(self, risk_profile, investment_years, sector_preferences=None):
        """
        Provide investment strategy advice
        """
        strategies = {
            'low_risk': {
                'short': 'Focus on capital preservation with debt funds. Minimal equity exposure.',
                'medium': 'Balanced approach with majority in debt, some hybrid funds for growth.',
                'long': 'Gradual equity exposure while maintaining debt foundation for stability.'
            },
            'medium_risk': {
                'short': 'Balanced portfolio with equal focus on stability and growth.',
                'medium': 'Diversified across debt, hybrid, and equity for optimal risk-return.',
                'long': 'Increased equity allocation to maximize long-term wealth creation.'
            },
            'high_risk': {
                'short': 'Aggressive but cautious - higher equity with safety net.',
                'medium': 'Equity-focused portfolio with diversification across market caps.',
                'long': 'Maximum equity exposure across large, mid, and small cap funds.'
            }
        }
        
        duration_key = 'short' if investment_years <= 3 else 'long' if investment_years >= 10 else 'medium'
        
        strategy_response = {
            'strategy': strategies[risk_profile][duration_key],
            'rebalancing': 'Review and rebalance portfolio annually',
            'sip_benefits': [
                'Rupee cost averaging reduces market timing risk',
                'Disciplined investment approach',
                'Power of compounding over time',
                'Flexibility to increase SIP amount'
            ]
        }
        
        # Add sector-specific warnings if applicable
        if sector_preferences and len(sector_preferences) > 0:
            if len(sector_preferences) == 1:
                strategy_response['sector_warning'] = (
                    f"⚠️ You've selected only {sector_preferences[0]} sector. "
                    "Sector-specific investments carry higher risk due to lack of diversification. "
                    "Consider adding 2-3 more sectors for better risk management."
                )
            strategy_response['sector_note'] = (
                "Sector funds can be volatile. Monitor sector performance regularly and "
                "consider rebalancing if any sector becomes overweight in your portfolio."
            )
        
        return strategy_response

# Example usage
if __name__ == '__main__':
    engine = SIPRecommendationEngine()
    
    # Test case
    result = engine.generate_recommendations(
        risk_profile='medium_risk',
        investment_years=10,
        monthly_investment=10000
    )
    
    print("SIP Recommendations:")
    print(f"\nPortfolio Summary:")
    print(f"Total Investment: ₹{result['portfolio_summary']['total_invested']:,.2f}")
    print(f"Expected Value: ₹{result['portfolio_summary']['expected_portfolio_value']:,.2f}")
    print(f"Expected Gains: ₹{result['portfolio_summary']['expected_gains']:,.2f}")
    print(f"\nRecommended Funds:")
    for rec in result['recommendations']:
        print(f"- {rec['fund_name']} ({rec['allocation_percentage']:.1f}%)")

