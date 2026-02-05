# Version: 2.0.5 - Fix holdings data for search results using intelligent inference
# CRITICAL FIX: Import db from models.py to avoid multiple instances
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from datetime import datetime
import json

app = Flask(__name__)
CORS(app)

# Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///sip_advisor.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')

# Import db from models and initialize with app
# Import db and models from models.py
from models import db, User, SIPRecommendation
db.init_app(app)

# Create tables
with app.app_context():
    db.create_all()

# Root route - API information
@app.route('/', methods=['GET'])
def root():
    return jsonify({
        'service': 'SIP Investment Advisor API',
        'status': 'running',
        'version': '2.0.0',
        'description': 'Backend API for personalized mutual fund recommendations',
        'endpoints': {
            'health': '/api/health',
            'recommendations': '/api/recommendations',
            'user_profile': '/api/user/profile'
        },
        'frontend_url': 'https://sip-investment-advisor.vercel.app',
        'documentation': 'Visit the frontend URL to use the application'
    })

# Routes
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'message': 'SIP Advisor API is running',
        'version': '2.0.0',
        'features': ['fund_count_info', 'sector_selection', 'api_integration']
    })

@app.route('/api/user/profile', methods=['POST'])
def create_user_profile():
    try:
        data = request.json
        
        # Validate input
        required_fields = ['name', 'email', 'risk_profile', 'investment_years', 'monthly_investment']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Check if user exists
        existing_user = User.query.filter_by(email=data['email']).first()
        if existing_user:
            return jsonify({'error': 'User with this email already exists'}), 400
        
        # Create new user
        user = User(
            name=data['name'],
            email=data['email'],
            risk_profile=data['risk_profile'],
            investment_years=data['investment_years'],
            monthly_investment=data['monthly_investment']
        )
        
        db.session.add(user)
        db.session.commit()
        
        return jsonify({
            'message': 'User profile created successfully',
            'user': user.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/user/<int:user_id>', methods=['GET'])
def get_user_profile(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    return jsonify(user.to_dict())

@app.route('/api/recommendations/<int:user_id>', methods=['GET'])
def get_recommendations(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    recommendations = SIPRecommendation.query.filter_by(user_id=user_id).all()
    return jsonify({
        'user': user.to_dict(),
        'recommendations': [rec.to_dict() for rec in recommendations]
    })

# Import and register blueprints (at end to avoid circular imports)
from routes import api
app.register_blueprint(api, url_prefix='/api')

if __name__ == '__main__':
    app.run(debug=True, port=5000)
