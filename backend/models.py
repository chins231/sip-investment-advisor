from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    """User model for storing user profile information"""
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    risk_profile = db.Column(db.String(20), nullable=False)  # low, medium, high
    investment_years = db.Column(db.Integer, nullable=False)
    monthly_investment = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationship
    recommendations = db.relationship('SIPRecommendation', backref='user', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'risk_profile': self.risk_profile,
            'investment_years': self.investment_years,
            'monthly_investment': self.monthly_investment,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    def __repr__(self):
        return f'<User {self.email}>'

class SIPRecommendation(db.Model):
    """Model for storing SIP fund recommendations"""
    __tablename__ = 'sip_recommendations'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    fund_name = db.Column(db.String(200), nullable=False)
    fund_type = db.Column(db.String(50), nullable=False)  # Debt Funds, Hybrid Funds, Equity Funds
    allocation_percentage = db.Column(db.Float, nullable=False)
    expected_return = db.Column(db.Float, nullable=False)
    risk_level = db.Column(db.String(20), nullable=False)
    monthly_investment = db.Column(db.Float, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'fund_name': self.fund_name,
            'fund_type': self.fund_type,
            'allocation_percentage': round(self.allocation_percentage, 2),
            'expected_return': round(self.expected_return, 2),
            'risk_level': self.risk_level,
            'monthly_investment': round(self.monthly_investment, 2) if self.monthly_investment else None,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
    
    def __repr__(self):
        return f'<SIPRecommendation {self.fund_name}>'

