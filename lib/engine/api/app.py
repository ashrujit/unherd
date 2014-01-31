#!flask/bin/python
from flask import Flask
from flask import request
from flask import jsonify

from .. naive  import tscore
import json
import sys

model = tscore.ScoreModel()

app = Flask(__name__)
@app.route('/')

#Initialize the model with the default weights
def index():
	return "<h1>Hello, Universe!</h1>-Unherd Team"


@app.route('/unherd/api/v1.0/model/update', methods = ['POST'])
def update_weight():
	"""
		Update the weight of the linear model.
	"""
	wts = request.json['featureWeights']

	# Intialize new model with the latest weights
	model = tscore.ScoreModel(wts)
	return jsonify( { 'updated': "True" } ), 201


@app.route('/unherd/api/v0.1/tweet', methods = ['POST'])
def score_tweets():
	"""
		REST API end point.
		post request with tweet JSON String 
		returns the JSON object with score etc.

	"""
	
	s = -1
	status = 'Error'
	reason = ""
	tid = -1

	try:
		tjson = request.json['tweetJSON']
		tobj = json.loads(tjson)
		s = model.score(tjson)
		status = 'ok'
		tid = tobj['id']

	except e:
		reason = str(e)

	return jsonify({ 
					 'status' : status,
					 'score' : s,
					 'tid' : tid,
					 'reason' : reason
					 })