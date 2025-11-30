from flask import Flask
from .routes import bp

def create_app():
    app = Flask(__name__)

    # Registro de Blueprint
    app.register_blueprint(bp)

    # Datos globales (persisten)
    app.config["lecturas"] = []

    return app
