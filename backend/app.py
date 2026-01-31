# Version: 2.0.1 - Force Gunicorn worker reload
# CRITICAL FIX: Gunicorn workers cache app.py, this forces reload
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import os
from datetime import datetime
import json

app = Flask(__name__)
CORS(app)

# Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///sip_advisor.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key')

db = SQLAlchemy(app)

# Database Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    risk_profile = db.Column(db.String(20), nullable=False)  # low, medium, high
    investment_years = db.Column(db.Integer, nullable=False)
    monthly_investment = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'risk_profile': self.risk_profile,
            'investment_years': self.investment_years,
            'monthly_investment': self.monthly_investment,
            'created_at': self.created_at.isoformat()
        }

class SIPRecommendation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    fund_name = db.Column(db.String(200), nullable=False)
    fund_type = db.Column(db.String(50), nullable=False)
    allocation_percentage = db.Column(db.Float, nullable=False)
    expected_return = db.Column(db.Float, nullable=False)
    risk_level = db.Column(db.String(20), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'fund_name': self.fund_name,
            'fund_type': self.fund_type,
            'allocation_percentage': self.allocation_percentage,
            'expected_return': self.expected_return,
            'risk_level': self.risk_level
        }

# Create tables
with app.app_context():
    db.create_all()

# Import and register blueprints
from routes import api
app.register_blueprint(api, url_prefix='/api')

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

if __name__ == '__main__':
    app.run(debug=True, port=5000)
