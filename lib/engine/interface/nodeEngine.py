from .. naive  import tscore
import json
import sys

def scoreBatch(tweetJSONArr, featureWeights =None):
	"""
		To be called from node env.
		Returns the Array of scores int the
		same order as the input tweets.
	"""
	model = tscore.ScoreModel(featureWeights)
	model.score(t)

	# tweetScoreArr = []
	
	# for t in tweetJSONArr:
		# tweetScoreArr.append(model.score(t))	
	
	# return 	tweetScoreArr

# scoreBatch(sys.argv[1], sys.argv[2])

print "hello world!!!"