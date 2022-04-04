from flask_swagger_ui import get_swaggerui_blueprint
import config
from flask import Flask, render_template, jsonify, request
from flask_migrate import Migrate
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, create_refresh_token, jwt_required, get_jwt_identity
# from flask_bcrypt import Bcrypt
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

import os.path



app = Flask(__name__)
app.config.from_object(config.Config)
JWTManager(app)
db = SQLAlchemy(app)
migrate = Migrate(app, db)
api = Api(app)
client = app.test_client()

# SWAGGER_URL = '/swagger'
# API_URL = '/static/swagger.json'
# SWAGGER_BLUEPRINT = get_swaggerui_blueprint(
#     SWAGGER_URL,
#     API_URL,
#     config={
#         'app_name': 'Pharmacy'
#     }
# )
#
# app.register_blueprint(SWAGGER_BLUEPRINT, url_prefix=SWAGGER_URL)


# @app.route('/', methods=['GET', 'POST'])
# def index():
#     return render_template('index.html')

from src import routes, models