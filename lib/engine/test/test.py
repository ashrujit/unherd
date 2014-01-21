from .. naive  import tscore

import nltk
import json

model = tscore.ScoreModel()

f = open('engine/test/earth.txt', 'r')

for line in f.readlines():

	tweetJSON = json.loads(line)

	print model.score(line), tweetJSON['text']

f.close()


