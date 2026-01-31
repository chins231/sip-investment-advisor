from flask import Flask
from flask_cors import CORS
import os

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///sip_advisor.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')

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

# Health check route
@app.route('/')
def index():
    return {
        'message': 'SIP Advisor API',
        'version': '1.0.0',
        'status': 'running'
    }

@app.route('/api/health')
def health():
    return {'status': 'healthy', 'message': 'API is running'}

if __name__ == '__main__':
    print("🚀 Starting SIP Advisor API...")
    print("📡 API will be available at http://localhost:5001")
    print("📊 Frontend should connect to this API")
    print("\nPress CTRL+C to stop the server\n")
    app.run(debug=True, host='0.0.0.0', port=5001)

