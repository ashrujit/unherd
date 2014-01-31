from app import app
from flask import render_template

import os
from flask import request, redirect, url_for
from werkzeug import secure_filename
import json

from .. import app

@app.route('/')
@app.route('/index')

def index():
    user = { 'nickname': 'Miguel' } # fake user
    posts = [ # fake array of posts
        { 
            'author': { 'nickname': 'John' }, 
            'body': 'Beautiful day in Portland!' 
        },
        { 
            'author': { 'nickname': 'Susan' }, 
            'body': 'The Avengers movie was so cool!' 
        }
    ]
    return render_template("index.html",
        title = 'Home',
        user = user,
        posts = posts)

@app.route('/dashboard', methods=['GET', 'POST'])   
def rank_tweets():
	"""
		Uploads the file with tweets json,
		ranks them and returns the result.
	"""
	if request.method == 'POST':
		file = request.files['file']
		if file:
			filename = secure_filename(file.filename)
			content = file.read()
			jsonArr = json.loads(content)
			tweet = jsonArr[0]['text']
			file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
			# return redirect(url_for('uploaded_file', filename=filename))
			return render_template("tool.html", tweets = tweet)
	else:
		return render_template("tool.html")