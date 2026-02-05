# Import app and limiter from app.py to avoid circular imports
from app import app, limiter

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

# Made with Bob
