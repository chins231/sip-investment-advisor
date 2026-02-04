from flask import Blueprint, request, jsonify
from sip_engine import SIPRecommendationEngine
from models import db, User, SIPRecommendation
from fund_data import FundDataService
from sector_funds import get_sectors_list, get_sector_funds, SECTOR_FUNDS
from holdings_service import holdings_service

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
        
        # Get fund_selection_mode (default to 'curated')
        fund_selection_mode = data.get('fund_selection_mode', 'curated')
        if fund_selection_mode not in ['curated', 'comprehensive']:
            return jsonify({'error': 'fund_selection_mode must be curated or comprehensive'}), 400
        
        # Get index_funds_only flag (default to False)
        index_funds_only = data.get('index_funds_only', False)
        if not isinstance(index_funds_only, bool):
            index_funds_only = str(index_funds_only).lower() == 'true'
        
        # Get sector preferences if provided
        sector_preferences = data.get('sector_preferences', None)
        if sector_preferences and len(sector_preferences) > 0:
            # Validate sectors
            valid_sectors = list(SECTOR_FUNDS.keys())
            for sector in sector_preferences:
                if sector not in valid_sectors:
                    return jsonify({'error': f'Invalid sector: {sector}'}), 400
        
        # Validate: Cannot use both sector preferences and index funds only
        if sector_preferences and len(sector_preferences) > 0 and index_funds_only:
            return jsonify({'error': 'Cannot use both sector preferences and index funds only filter'}), 400
        
        # Generate recommendations
        recommendations = engine.generate_recommendations(
            risk_profile=risk_profile_key,
            investment_years=int(data['investment_years']),
            monthly_investment=float(data['monthly_investment']),
            max_funds=max_funds,
            sector_preferences=sector_preferences,
            fund_selection_mode=fund_selection_mode,
            index_funds_only=index_funds_only
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
        
        # Enrich recommendations with NAV and holdings data
        enriched_recommendations = []
        for rec in recommendations['recommendations']:
            # Add NAV data if not already present (for non-sector funds)
            if 'nav' not in rec or rec.get('nav') is None:
                try:
                    nav = fund_service.get_current_nav(rec['fund_name'])
                    if nav and nav != 100.00:  # 100.00 is the default fallback
                        rec['nav'] = nav
                        rec['nav_date'] = 'Latest'
                        rec['data_source'] = 'static_fallback'
                except Exception as e:
                    print(f"Failed to get NAV for {rec['fund_name']}: {e}")
            
            # Get holdings for this fund
            holdings_data = holdings_service.get_holdings(rec)
            if holdings_data:
                rec['holdings'] = holdings_data
            enriched_recommendations.append(rec)
        
        response_data = {
            'user_id': user.id,
            'recommendations': enriched_recommendations,
            'portfolio_summary': recommendations['portfolio_summary'],
            'investment_strategy': recommendations['investment_strategy']
        }
        
        # Include data_source if available and update fund_count to actual displayed count
        if 'data_source' in recommendations:
            data_source = recommendations['data_source'].copy()
            # Update fund_count to reflect actual displayed recommendations
            data_source['fund_count'] = len(enriched_recommendations)
            response_data['data_source'] = data_source
        
        # Include fund_count_info if available
        if 'fund_count_info' in recommendations:
            response_data['fund_count_info'] = recommendations['fund_count_info']
        
        return jsonify(response_data), 200
        
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

@api.route('/sectors', methods=['GET'])
def get_sectors():
    """
    Get list of available investment sectors
    """
    try:
        sectors = get_sectors_list()
        return jsonify({'sectors': sectors}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
@api.route('/search-fund', methods=['POST'])
def search_fund():
    """
    Search for mutual funds by name using MFAPI
    Returns fund details with NAV, CAGR, and other information
    """
    try:
        data = request.json
        query = data.get('query', '').strip()
        
        if not query:
            return jsonify({'error': 'Search query is required'}), 400
        
        if len(query) < 2:
            return jsonify({'error': 'Search query must be at least 2 characters'}), 400
        
        # Search for funds using MFAPI
        from mf_api_service import search_funds_by_name
        
        search_results = search_funds_by_name(query)
        
        if not search_results:
            return jsonify({
                'funds': [],
                'message': f'No funds found matching "{query}"'
            }), 200
        
        # Format results to match our fund card structure
        formatted_funds = []
        for fund in search_results[:10]:  # Limit to top 10 results
            formatted_fund = {
                'name': fund.get('name', 'Unknown Fund'),
                'scheme_code': fund.get('scheme_code'),
                'fund_type': fund.get('fund_type', 'Other Scheme'),
                'expected_return': fund.get('expected_return', 'N/A'),
                'risk_level': fund.get('risk_level', 'Medium'),
                'monthly_sip': fund.get('monthly_sip', 1000),
                'cagr_3y': fund.get('cagr_3y'),
                'current_nav': fund.get('current_nav'),
                'data_source': fund.get('data_source', 'mfapi')
            }
            formatted_funds.append(formatted_fund)
        
        return jsonify({
            'funds': formatted_funds,
            'count': len(formatted_funds),
            'query': query
        }), 200
        
    except Exception as e:
        print(f"Search error: {str(e)}")
        return jsonify({'error': f'Search failed: {str(e)}'}), 500


@api.route('/fund-holdings/<fund_name>', methods=['GET'])
def get_fund_holdings(fund_name):
    """
    Get portfolio holdings for a specific fund
    """
    try:
        # Search for fund in all sectors
        for sector_key, sector_data in SECTOR_FUNDS.items():
            for fund in sector_data['funds']:
                if fund['name'].lower() == fund_name.lower():
                    return jsonify({
                        'fund_name': fund['name'],
                        'fund_type': fund['type'],
                        'sector': sector_data['name'],
                        'top_holdings': fund['top_holdings'],
                        'holdings_url': fund['holdings_url'],
                        'description': fund['description'],
                        'expected_return': fund['expected_return'],
                        'risk_level': fund['risk_level']
                    }), 200
        
        return jsonify({'error': 'Fund not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api.route('/sector-funds', methods=['POST'])
def get_sector_specific_funds():
    """
    Get funds based on selected sectors
    """
    try:
        data = request.json
        sector_preferences = data.get('sectors', ['diversified'])
        
        funds = get_sector_funds(sector_preferences)
        
        return jsonify({
            'funds': funds,
            'selected_sectors': sector_preferences
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
