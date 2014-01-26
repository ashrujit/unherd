from .. naive  import tscore
# from .. interface  import nodeEngine

import json
import sys

def rawTest():
	model = tscore.ScoreModel()
	f = open('engine/test/earth.txt', 'r')

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



# rawTest()
# batchTest()	