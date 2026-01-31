from flask import Blueprint, request, jsonify
from sip_engine import SIPRecommendationEngine
from models import db, User, SIPRecommendation
from fund_data import FundDataService

api = Blueprint('api', __name__)
engine = SIPRecommendationEngine()
fund_service = FundDataService()

@api.route('/generate-recommendations', methods=['POST'])
def generate_recommendations():
    """
    Generate SIP recommendations based on user input
    """
    try:
        data = request.json
        
        # Validate required fields
        required_fields = ['name', 'email', 'risk_profile', 'investment_years', 'monthly_investment']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Validate risk profile
        risk_profile = data['risk_profile'].lower()
        if risk_profile not in ['low', 'medium', 'high']:
            return jsonify({'error': 'Risk profile must be low, medium, or high'}), 400
        
        risk_profile_key = f"{risk_profile}_risk"
        
        # Get max_funds if provided
        max_funds = data.get('max_funds', None)
        if max_funds is not None:
            max_funds = int(max_funds)
        
        # Generate recommendations
        recommendations = engine.generate_recommendations(
            risk_profile=risk_profile_key,
            investment_years=int(data['investment_years']),
            monthly_investment=float(data['monthly_investment']),
            max_funds=max_funds
        )
        
        # Check if user exists, create or update
        user = User.query.filter_by(email=data['email']).first()
        
        if not user:
            user = User(
                name=data['name'],
                email=data['email'],
                risk_profile=risk_profile,
                investment_years=int(data['investment_years']),
                monthly_investment=float(data['monthly_investment'])
            )
            db.session.add(user)
        else:
            user.risk_profile = risk_profile
            user.investment_years = int(data['investment_years'])
            user.monthly_investment = float(data['monthly_investment'])
        
        db.session.commit()
        
        # Delete old recommendations for this user
        SIPRecommendation.query.filter_by(user_id=user.id).delete()
        
        # Save new recommendations
        for rec in recommendations['recommendations']:
            sip_rec = SIPRecommendation(
                user_id=user.id,
                fund_name=rec['fund_name'],
                fund_type=rec['fund_type'],
                allocation_percentage=rec['allocation_percentage'],
                expected_return=rec['expected_return'],
                risk_level=rec['risk_level']
            )
            db.session.add(sip_rec)
        
        db.session.commit()
        
        return jsonify({
            'user_id': user.id,
            'recommendations': recommendations['recommendations'],
            'portfolio_summary': recommendations['portfolio_summary'],
            'investment_strategy': recommendations['investment_strategy']
        }), 200
        
    except ValueError as ve:
        return jsonify({'error': str(ve)}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500

@api.route('/user/<int:user_id>/recommendations', methods=['GET'])
def get_user_recommendations(user_id):
    """
    Get saved recommendations for a user
    """
    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        recommendations = SIPRecommendation.query.filter_by(user_id=user_id).all()
        
        # Regenerate portfolio summary
        risk_profile_key = f"{user.risk_profile}_risk"
        result = engine.generate_recommendations(
            risk_profile=risk_profile_key,
            investment_years=user.investment_years,
            monthly_investment=user.monthly_investment
        )
        
        return jsonify({
            'user': user.to_dict(),
            'recommendations': [rec.to_dict() for rec in recommendations],
            'portfolio_summary': result['portfolio_summary'],
            'investment_strategy': result['investment_strategy']
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api.route('/compare-scenarios', methods=['POST'])
def compare_scenarios():
    """
    Compare different investment scenarios
    """
    try:
        data = request.json
        scenarios = data.get('scenarios', [])
        
        if not scenarios or len(scenarios) < 2:
            return jsonify({'error': 'Please provide at least 2 scenarios to compare'}), 400
        
        results = []
        for scenario in scenarios:
            risk_profile = f"{scenario['risk_profile'].lower()}_risk"
            rec = engine.generate_recommendations(
                risk_profile=risk_profile,
                investment_years=int(scenario['investment_years']),
                monthly_investment=float(scenario['monthly_investment'])
            )
            results.append({
                'scenario_name': scenario.get('name', f"Scenario {len(results) + 1}"),
                'input': scenario,
                'portfolio_summary': rec['portfolio_summary']
            })
        
        return jsonify({'comparisons': results}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@api.route('/fund-performance/<fund_name>', methods=['GET'])
def get_fund_performance(fund_name):
    """
    Get performance data for a specific fund
    """
    try:
        period = request.args.get('period', '1Y')
        
        # Get complete fund data
        fund_data = fund_service.get_complete_fund_data(fund_name)
        
        # Get historical performance data
        performance_data = fund_service.generate_performance_data(fund_name, period)
        
        return jsonify({
            'fund_name': fund_name,
            'current_nav': fund_data['current_nav'],
            'performance': fund_data['performance'],
            'historical_data': performance_data,
            'reviews': fund_data['reviews'],
            'last_updated': fund_data['last_updated']
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api.route('/fund-reviews/<fund_name>', methods=['GET'])
def get_fund_reviews(fund_name):
    """
    Get user reviews for a specific fund
    """
    try:
        reviews = fund_service.get_fund_reviews(fund_name)
        return jsonify(reviews), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
