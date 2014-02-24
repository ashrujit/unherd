var http = require('http');
var config = require("../config.json");

function post(post_data,cb) {
	
	var post_options = {
      host: config.api.host,
      port: config.api.port,
      path: '/unherd/api/v0.1/tweet',
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Content-Length': post_data.length
      }
	};
	
	var post_req = http.request(post_options, function(res) {
      res.setEncoding('utf8');
      var data = '';
      res.on('data', function (chunk) {
          
          data += chunk;
          
      });
      
      res.on('end', function () {
          
          cb(data);
          
      });
      
	});
	
	post_req.write(post_data);
	post_req.end();
	
}


module.exports.post = post;
