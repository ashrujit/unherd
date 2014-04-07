import ner
import tweetFeatures

class LinearModel:
	"""
		Linear model to evaluate score of the tweet.
	"""

	featuresWeights = [5.1, 2, 1, 1, 1, 1, 1]
	featuresValues = []

	def __init__(self, features_weights =None):
		"""
			Initialize the linear model with the input weights given,
			or use the default weights.
		"""
		if(features_weights != None):
			self.featuresWeights = features_weights

		self.score = 0

	def evaluate(self, tweetObj):
		"""
			Evaluates the score of tweetObj using linear model
			of weighted average for the features
		"""
		self.featuresValues.append(ner.getValue(tweetObj))
		# self.featuresValues.append(1)
		self.featuresValues.append(tweetFeatures.getRetweet(tweetObj))
		self.featuresValues.append(tweetFeatures.getURL(tweetObj))
		self.featuresValues.append(tweetFeatures.getFavorite(tweetObj))		
		
		self.featuresValues.append(tweetFeatures.getHashTags(tweetObj))
		self.featuresValues.append(tweetFeatures.getMentions(tweetObj))
		self.featuresValues.append(tweetFeatures.getFollowersCount(tweetObj))


		# Weighted sum of the features values.
		self.score = sum(value * weight for value, weight in \
					 zip(self.featuresValues, self.featuresWeights))
		# print self.featuresValues
		self.featuresValues = []
		return self.score

	def updateWeight(self, featuresWeights):
		self.featuresWeights = featuresWeights
