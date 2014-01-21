import nltk

def getEntities(tweetObj):
	"""
		Returns list of entites recognized inside the tweet text
		along with the category of the entitity
	"""
	tweet = tweetObj['text']
	entitiesList = []
	
	for chunk in nltk.ne_chunk(nltk.pos_tag(nltk.word_tokenize(tweet))):
		# print chunk
		if hasattr(chunk, 'node'):
			# print chunk.node, chunk.leaves()
			entitiesList.append(chunk)

	return entitiesList

def getValue(tweetObj):
		"""
			Returns the Value as per decided logic for the list of
			entities identitied 
		"""	
		entitiesList = getEntities(tweetObj)
		# print entitiesList
		
		categoryList = set(chunk.node for chunk in entitiesList)	
		return len(categoryList)