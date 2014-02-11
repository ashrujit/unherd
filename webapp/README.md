<hr />
##Web App
This is the nodejs app which interacts with twitter api and is responsible for serving the ui for unherd site.
This is a copy of openshift app we deployed at: http://web-unheard.rhcloud.com/

<hr />

###Tech stack used
* Nodejs
* Express.js
* jade - templating engine
* Grunt for automating tasks : linting and unit tests

<hr />

###Folder Structure

1. **/public** :
Contains the js and css files used by the web app. 

2. **/models** :
Right now it doesnt use an ODM like mongoose but the default mongo db native driver for node. But we may put the document schemas which goes into the mongodb storage in this folder for reference. 

3. **/lib** :
We may separate the ap specific modules we build into separate files and and require from this folder.

4. **/views** :
This folder includes the templates files for the web app. Written in jade.

5. **server.js** :
Entry point of web app.

6. **config.js** :
We may put the configuration parameters into this json file and use them in the modules we need.
<hr />

###Running the web app
<code>
$ node server.js
</code>

<hr />

###Routes in express app

* `/` :

Index route

* `/test` :

The profile page under development which is integrating the Endless template with the web app.

* `/ranktweet` :

This route is supposed to make a post request to the python api and return the rank of the tweet as json. Currently set to consume from UI through ajax requests as we cannot make n number of web service calls before rendering the template.

* `/tweet` :

The route which handles the rendering the template for inserting a tweet and triggering the tweet action from twitter api.

* `/DM` :

The route which handles the rendering the template for direct message and triggering the DM from twitter api.

* `/getTweets` :

The route which handles fetching the home time line and render the template.

* `/doReTweet` :

The route which handles retweeting a tweet with its tweet id.

* `/timeline/:id` :

The route which handles fetching the timeline of a specific user. `:id` refers to the id of the user.

* `/account` :

Route responsible for rendering the account details.

* `/login` :

Route responsible for rendering the login template.

* `/json/getTweets` & `/json/timeline/:id`

gives user timeline and tweetlist in json format.

* `/logout` :

handles the logout from app.

<hr />

###NPM Modules that are used

1. express
2. jade
3. mongodb
4. oauth
5. passport
6. passport-twitter
7. grunt
* check package.json for more info

<hr />

###local modules we use

1. `mongodb.js` : The light wight abstraction layer built on top of native mongo client.
2. `passport.js` : Layer built on top of passport which handles the twitter login.
3. `twitter.js` : Layer built on top of oauth which handles the twitter actions.
4. `validation.js` : file to contain all the validation middlewares used in express.  

<hr />

###TO DO

1. Integration of endless template with the other view templates.
2. adding retweet/favourite/reply tweet actions.
