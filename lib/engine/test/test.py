from .. naive  import tscore
# from .. interface  import nodeEngine

import json
import sys
import requests

def rawTest():
	model = tscore.ScoreModel()
	f = open('engine/test/sample8.txt', 'r')

	for line in f.readlines():
		tweetJSON = json.loads(line)
		print model.score(line), tweetJSON['text']

	f.close()


def batchTest():
	"""
		Testing the node interface for batch tweet processing.
	"""
	tweetJSONArr = []
	
	f = open('engine/test/earth.txt', 'r')
	
	for line in f.readlines():
		tweetJSONArr.append(line)
	f.close()
	return nodeEngine.scoreBatch(tweetJSONArr)


def apiTest():
	"""
		Fire post request to the API.
	"""
	

	url = "http://localhost:5000/unherd/api/v0.1/tweet"
	
	f = open('engine/test/earth.txt', 'r')
	line = f.readline()
	line = line.replace("\n", "")
	f.close();

	data = {'tweetJSON' : line}

	headers = {'Content-type': 'application/json', 
				'Accept': 'text/plain'}
	
	wts = {'featureWeights' : [10, 1, 1 ,1]}

	urlUpdate = "http://localhost:5000/unherd/api/v0.1/model/update"
	
	r = requests.post(urlUpdate, data = json.dumps(wts), headers = headers)
	print r.text

	r = requests.post(url, data = json.dumps(data), headers = headers)
	print r.text



# rawTest()
# batchTest()	
apiTest()
