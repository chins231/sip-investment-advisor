from flask import Flask
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import os

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///sip_advisor.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')

# Initialize rate limiter
limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"],
    storage_uri="memory://",
    headers_enabled=True
)

# Initialize database with app
from models import db, User, SIPRecommendation
db.init_app(app)

# Import and register blueprints
from routes import api
app.register_blueprint(api, url_prefix='/api')

# Create tables
with app.app_context():
    db.create_all()
    print("✅ Database tables created successfully!")

# Add security headers to all responses
@app.after_request
def add_security_headers(response):
    """Add security headers to all responses"""
    response.headers['Content-Security-Policy'] = "default-src 'self'"
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'DENY'
    response.headers['X-XSS-Protection'] = '1; mode=block'
    response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
    response.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'
    return response

# Health check route
@app.route('/')
@limiter.limit("100 per minute")
def index():
    return {
        'message': 'SIP Advisor API',
        'version': '1.0.0',
        'status': 'running'
    }

@app.route('/api/health')
@limiter.limit("100 per minute")
def health():
    return {'status': 'healthy', 'message': 'API is running'}

if __name__ == '__main__':
    print("🚀 Starting SIP Advisor API...")
    print("📡 API will be available at http://localhost:5001")
    print("📊 Frontend should connect to this API")
    print("\nPress CTRL+C to stop the server\n")
    app.run(debug=True, host='0.0.0.0', port=5001)

