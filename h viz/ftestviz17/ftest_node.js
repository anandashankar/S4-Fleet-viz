
//THIS IS THE NODE.JS SERVER CODE. TAKE WHAT YOU NEED AND IGNORE THE REST.

var express = require('express');
var app = express();
var serv = require('http').Server(app);
var io = require('socket.io')(serv);
var objectAssign = require('object-assign');
var net = require('net');

var listener = io.listen(serv);
//var client = new net.Socket();

//START THE SERVER
serv.listen(2000, function(){
    console.log("Server started and operational");
});

//LOAD THE WEBSITE
app.get('/',function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});
app.use(express.static('public'));




var pydata //THIS IS FOR THE DATA LOADED FROM PYTHON

//CREATE A SOCKET SERVER THAT IS LISTENING TO THE PYTHON MODEL
net.createServer(function(sock) {
    
    // We have a connection - a socket object is assigned to the connection automatically
    console.log('CONNECTED: ' + sock.remoteAddress +':'+ sock.remotePort);
    
    // Add a 'data' event handler to this instance of socket
    sock.on('data', function(data) {
        
        console.log('DATA ' + sock.remoteAddress + ': ' + data);
        pydata = data; //THIS IS THE DATA WE GET FROM PYTHON
    });
    console.log('pydata' + pydata);

	
}).listen(1337, '127.0.0.1.');

console.log('Server listening on ' + '127.0.0.1.' +':'+ '1337');


//OPEN A SOCKET TO COMMUNICATE WITH THE VISUALIZATION SCRIPT

io.sockets.on('connection', function (socket) { //This refers to the first server, listening to port 2000
	console.log("Viz connected"); //Visualization script informs that it has been loaded on the website
		
	socket.on('disconnect', function () {
	  	console.log('Viz disconnect');
	});
	
	socket.on('pydata', function () { //THis socket is listening to visualization color change function
		console.log('Im trying to send ' + pydata);
		io.emit('pydata', pydata); //This is where we send the data from Python over the socket to the visualizer
		console.log("Sent pydata to b4w! " + pydata);
	});
	
		
});



//server side loop to run position checking and updates THIS IS NOT USED NOW? I THINK?
setInterval(function(){
    // loop here
    // The plan is to cycle through all the positions periodically to correct any client positions that might be off.
  
},1000/25);


//             --Node.js commands--
// sending to sender-client only
//socket.emit('message', "this is a test");

// sending to all clients, include sender
//io.emit('message', "this is a test");

// sending to all clients except sender
//socket.broadcast.emit('message', "this is a test");

// sending to all clients in 'game' room(channel) except sender
//socket.broadcast.to('game').emit('message', 'nice game');

// sending to all clients in 'game' room(channel), include sender
//io.in('game').emit('message', 'cool game');

// sending to sender client, only if they are in 'game' room(channel)
//socket.to('game').emit('message', 'enjoy the game');

// sending to all clients in namespace 'myNamespace', include sender
//io.of('myNamespace').emit('message', 'gg');

// sending to individual socketid
//socket.broadcast.to(socketid).emit('message', 'for your eyes only');

//TRYING TO GET A MESSAGE FROM PYTHON
//function getSocketMessage(){
	//var outData;
	
	
	//client.connect(3000,'127.0.0.1.',function(){
		//client.write(tpcmsg);
	//});
	
	//client.on('data', function(data){
		//pythonData = data.toString('utf8');
		//console.log(pythonData);
	//});
	
	//client.on('error', function(error) {
    //console.log('Error Connection: ' + error);
	//});

//}
