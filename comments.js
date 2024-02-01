// Create web server
// Run the web server
// Use the web server to serve up static files
// Use the web server to serve up dynamic files
// Use the web server to serve up JSON data

// Load the http module to create an http server.
var http = require('http');
var fs = require('fs');
var url = require('url');
var path = require('path');

// Configure our HTTP server to respond with Hello World to all requests.
var server = http.createServer(function (request, response) {
  var uri = url.parse(request.url).pathname;
  var filename = path.join(process.cwd(), uri);
  console.log(filename);
  console.log(uri);
  if (uri == '/comments') {
    response.writeHead(200, {"Content-Type": "application/json"});
    response.write(JSON.stringify({name: 'John', age: 30}));
    response.end();
  } else {
    fs.exists(filename, function(exists) {
      if(!exists) {
        response.writeHead(404, {"Content-Type": "text/plain"});
        response.write("404 Not Found\n");
        response.end();
        return;
      }

      if (fs.statSync(filename).isDirectory()) filename += '/index.html';

      fs.readFile(filename, "binary", function(err, file) {
        if(err) {
          response.writeHead(500, {"Content-Type": "text/plain"});
          response.write(err + "\n");
          response.end();
          return;
        }

        response.writeHead(200);
        response.write(file, "binary");
        response.end();
      });
    });
  }
});

// Listen on port 8000, IP defaults to