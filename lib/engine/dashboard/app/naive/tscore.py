import json
import nltk
import linearmodel

class ScoreModel:

	"""
		Model to assign score the tweet. High scores for 
		the "good" tweets.
	"""	

	def __init__(self, featuresWeights = None):
		"""
			Initialize the the model with the params
			and configuration required.
		"""
		self.model = linearmodel.LinearModel(featuresWeights)

	def score(self, tweetJSON):
		"""
			Returns a float score based on the features of the 
			tweetJSON object in JSON format. 
		"""
		try:
			tweetObj = json.loads(tweetJSON)
		except:
			raise Exception("Error while loading json from the input!")
		
		return self.model.evaluate(tweetObj)

	def updateWeight(self, featuresWeights):
		"""Updates the weights"""

		self.model.updateWeight(featuresWeights)