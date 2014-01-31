from flask import Flask


app = Flask(__name__)

UPLOAD_FOLDER = 'app/data'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

from app import views
