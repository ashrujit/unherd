Recommendation Engine
====================
This engine is supposed to be the heart of our web application.
It will filter out the noise and run algorithm to cluster the date etc.
to recommend data to the users.

Current Status
==============
Right now it implements a simple linear model to give a score for each 
input json tweet. It uses

REST Server
=======
Start the server first from the engine and it will start serving REST API
at port 5000. This intializes the model with a default value once and once
intialized the response would be fast.

<code>
$ python runserver.py
</code>

REST APIs
========
Only POST methods

+ '/unherd/api/v0.1/tweet' 
   Returns score of the tweetJSON as per the current feature weights. It
   doesn't initializes the model and hence fast response for the tweets.
+ 'unherd/api/v0.1/model/update'
   Reinitializes the model with the current feature weights vector. All subsequent
   calls till next update will be scored by this model.

Dash Board
=========
Web interface to test and play with the current ranking model.
change to this location unherd/lib/engine/dashboard and run folling command

<code>
$ python unherd.py
</code>

Install Flask, if not already.

Test
====
runs the engine on sample tweets and outputs score for each of them.
put sample json tweet object in earth.txt file to run on new tweets.

<code>
$ python -m engine.test.test
</code>

TODO
====
+ Replace the ntlk library with twitternlp wasn't working on osx platform
+ Learn better weights for the feature from generated training data.
+ Include more features in the model.
+ User ML tools to learn better models for the users

