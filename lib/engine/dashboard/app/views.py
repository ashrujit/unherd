from app import app
from flask import render_template
from app.naive import tscore

import os
from flask import request, redirect, url_for
from werkzeug import secure_filename
import json

current_user_file_content = "Pranay"
model = tscore.ScoreModel()

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
def render_tweets():
	"""
		Uploads the file with tweets json,
		ranks them and returns the result.
	"""
	if request.method == 'POST':
		control = request.form['control']
		
		if control == "upload":
			file = request.files['file']
			filename = secure_filename(file.filename)
			content = file.read()
			global current_user_file_content
			current_user_file_content = content
			plainTweets = plain_tweets(content)
			return render_template("tool.html", tweets = plainTweets)
		else:
			global current_user_file_content
			rankedTweets = rank_tweets(current_user_file_content, request.form)
			return render_template("tool.html", tweets = rankedTweets)
	else:
		return render_template("tool.html")

def rank_tweets(content, htmlForm):
	"""
		returns tweets sorted in order of score 
		generated by the model.
		
	"""
	global model;
	
	nerWt = htmlForm['ner']
	retweetWt = htmlForm['retweet']
	urlWt = htmlForm['url']
	favWt = htmlForm['fav']
	
	# If the feature Weights given by the user.
	if(nerWt != "" and retweetWt != ""
	and urlWt != "" and favWt != ""):
		featureWeights = [int(nerWt), int(retweetWt),
						  int(urlWt), int(favWt)]
		model.updateWeight(featureWeights)
	
	jsonArr = json.loads(content)
	rankedTweets = []
	for tobj in jsonArr:
		score = model.score(json.dumps(tobj))
		# score = nerWt+"hello"
		rankedTweets.append([score, tobj['text']])
	
	rankedTweets.sort(key=lambda tup:tup[0], reverse = True)
	return rankedTweets

def plain_tweets(content):
	"""
		returns tweets sorted in order of score 
		generated by the model.
		
	"""

	jsonArr = json.loads(content)
	rankedTweets = []
	for tobj in jsonArr:
		# score = model.score(json.dumps(tobj))
		score = -1
		rankedTweets.append([score, tobj['text']])
	
	return rankedTweets





















