# backend/__init__.py

from flask import Flask
from flask_dance.contrib.google import make_google_blueprint
from .config import GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_CLIENT_SECRET, SECRET_KEY
from .routes import routes

def create_app():
    app = Flask(__name__, static_folder='../frontend', static_url_path='/static')
    app.secret_key = SECRET_KEY

    # Google OAuth setup
    blueprint = make_google_blueprint(
        client_id=GOOGLE_OAUTH_CLIENT_ID,
        client_secret=GOOGLE_OAUTH_CLIENT_SECRET,
        scope=["https://www.googleapis.com/auth/userinfo.email", "openid"],
        redirect_url="/login/google/authorized"
    )
    app.register_blueprint(blueprint, url_prefix="/login")

    app.register_blueprint(routes)

    return app
