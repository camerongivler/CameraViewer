var http = require('http'), url = require('url'), fs = require('fs'),
        sio = require('socket.io');//, cppMod = require('./build/Release/cppMod');

var server = http.createServer(function(req, res) {
    var urlStr = url.parse(req.url).pathname;
    if (urlStr === '/') {
        res.writeHead(200, {'content-type': 'text/html'});
        res.end(fs.readFileSync('./index.html'));
    } else {
        try {
            res.end(fs.readFileSync("." + urlStr));
        } catch (e) {
            res.writeHead(404, {'content-type': 'text/plain'});
            res.end('Well this sucks.\nLooks like you\'ve encountered a 404 error.');
        }
    }
});

server.listen(8000, function() {
    console.log('Server listening at http://localhost:8000/');
});

io = sio.listen(server);

io.sockets.on('connection', function(socket) {
    socket.on('slider', function(msg) {
        //socket.emit('slider', {val: cppMod.slider(msg.value)});
        console.log(msg.value);
    });
});
