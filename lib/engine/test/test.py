from .. naive  import tscore

import nltk
import json

m = tscore.ScoreModel()

f = open('engine/test/earth.txt', 'r')

for line in f.readlines():

	tweetJSON = json.loads(line)
	print m.score(line), tweetJSON['text']
	# break
f.close()


