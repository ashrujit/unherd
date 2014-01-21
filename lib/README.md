Recommendation Engine
====================
This engine is supposed to be the heart of our web application.
It will filter out the noise and run algorithm to cluster the date etc.
to recommend data to the users.

Current Status
==============
Right now it implements a simple linear model to give a score for each 
input json tweet. It uses


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

