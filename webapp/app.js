var express = require('express');
var routes = require("./routes");
var app = express();

app.configure('development', function(){
  
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
    
  app.use(express.cookieParser());
  app.use(express.session({
    secret: "secretkey"
  }));
  
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  
  app.use(express.static(__dirname + '/public'));
  
  app.use(app.router);
});

app.get('/', routes.index);

app.get('/sessions/twitterConnect', routes.twitterConnect);

app.get('/sessions/twitterCallback', routes.twitterCallback);

app.listen(8080);








