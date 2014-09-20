var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var kinect = require('kinect');
var context = new kinect();
var globalBuffer;

app.use(express.static(__dirname + '/client'));

context.resume();
context.start('depth');
context.tilt(15);

app.get('/', function (req, res) {
    res.sendfile('client/index.html'); 
});

io.on('connection', function (socket) {
    console.log('a user connected');
    
    context.on('depth', function (buffer) {
        globalBuffer = buffer;
        
        var bytearray = new Uint8Array(globalBuffer);
        
        for (var i = 0; i < 307200; i += 1) {
            if (i % 640 >= 632) {
                i += 8;
                continue;
            }
            
            if (bytearray[2 * i] === 255) {
                console.log('white'); 
                
                var x = i % 640;
                var y = Math.floor(i / 640);

                console.log('x: ' + x + ' y: ' + y);
            }
        }
        
        socket.emit('depth', buffer);
    });
    
    socket.on('getDart', function () {
        var bytearray = new Uint8Array(globalBuffer);
        
        for (var i = 0; i < 307200; i += 1) {
            if (i % 640 >= 632) {
                i += 8;
                continue;
            }
            
            if (bytearray[2 * i] === 255) {
                console.log('white'); 
                
                var x = i % 640;
                var y = Math.floor(i / 640);

                console.log('x: ' + x + ' y: ' + y);
            }
        }
    });
});

http.listen(3000, function () {
    console.log('listening on *:3000');
});