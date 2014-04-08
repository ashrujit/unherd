import nltk.data, nltk.tag

def getEntities(tweetObj):
	"""
		Returns list of entites recognized inside the tweet text
		along with the category of the entitity
	"""
	tweet = tweetObj['text']
	entitiesList = []
	
	for chunk in nltk.ne_chunk(nltk.pos_tag(nltk.word_tokenize(tweet))):
		if hasattr(chunk, 'node'):
			entitiesList.append(chunk)

	return entitiesList

def getValueOld(tweetObj):
		"""
			Returns the Value as per decided logic for the list of
			entities identitied 
		"""	
		entitiesList = getEntities(tweetObj)
		
		categoryList = set(chunk.node for chunk in entitiesList)	
		return len(categoryList)


def getValue(tweetObj):
 		"""
 			Faster way to get the NER from the sentence.
 		"""	
 		tweet = tweetObj['text']
 		words = nltk.word_tokenize(tweet)
 		tagger = nltk.data.load(nltk.tag._POS_TAGGER)
 		chunks = tagger.tag(words)
 		score = 0
 		for chunk in chunks:
 			if(chunk[1] == 'NNP'):
 				score += 1
 
 		return score;
