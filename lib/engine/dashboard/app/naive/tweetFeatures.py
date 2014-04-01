def getRetweet(tweetObj):
	"""
		Returns value of the feature retweet count as per the
		logic.
		TODO:
			Variable score depending on the retweet count.
	"""

	# Retweeted by the logged in user or not.
	isRetweeted = tweetObj['retweeted']
	retweet_count = tweetObj['retweet_count']
	
	if(retweet_count > 0):
		return 1
	else:
		return 0

def getURL(tweetObj):
	"""
		Returns value of the feature URL content in the tweetObj.
		TODO : return value based on the relevant or importance of
			   the URL.

	"""		
	entities = tweetObj['entities']
	urls = entities['urls']

	return len(urls)

def getHashTags(tweetObj):		

	entities = tweetObj['entities']
	hashTags = entities['hashtags']

	return len(hashtags)

def getFavorite(tweetObj):

	favorite_count = tweetObj['favorite_count']
	if(favorite_count > 0):
		return 1
	else:
		return 0
def getTweetText(tweetObj):
	return tweetObj['text']