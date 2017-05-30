
//THIS IS THE NODE.JS SERVER CODE. TAKE WHAT YOU NEED AND IGNORE THE REST.

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
//var serv = require('http').Server(app);
//var io = require('socket.io')(serv);
var objectAssign = require('object-assign');
var net = require('net');
//var Chart = require('chart.js');

//var listener = io.listen(serv);
//var client = new net.Socket();

//START THE SERVER
http.listen(2000, function(){
  console.log('listening on *:2000');
});
/*serv.listen(5000, function(){
    console.log("Server started and operational");
});
*/
//LOAD THE WEBSITE
app.get('/',function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});
app.get('/data',function(req, res) {
    res.sendFile(__dirname + '/public/data.html');
});
app.get('/link',function(req, res) {
    res.sendFile(__dirname + '/public/link.html');
});
app.get('/data/sc',function(req, res) {
    res.sendFile(__dirname + '/public/data/sc.html');
});
app.get('/data/ls1',function(req, res) {
    res.sendFile(__dirname + '/public/data/ls1.html');
});
app.get('/data/ls2',function(req, res) {
    res.sendFile(__dirname + '/public/data/ls2.html');
});
app.get('/data/mc1',function(req, res) {
    res.sendFile(__dirname + '/public/data/mc1.html');
});
app.get('/data/mc2',function(req, res) {
    res.sendFile(__dirname + '/public/data/mc2.html');
});
app.get('/data/cc',function(req, res) {
    res.sendFile(__dirname + '/public/data/cc.html');
});
app.use(express.static('public'));



var pydata = JSON.stringify({"CC": {"StatusColor" : "Green"}, "SC": {"StatusColor" : "Green"}, "LS 1" : {"StatusColor" : "Green"}, "LS 2": {"StatusColor" : "Green"}, "MC 1": {"StatusColor" : "Green"}, "MC 2": {"StatusColor" : "Green"}}); //THIS IS FOR THE DATA LOADED FROM PYTHON
var pydata2 = JSON.stringify({"SC": "Green", "LS 1" : "Green", "LS 2": "Green", "MC 1": "Green", "MC 2": "Green"});
//CREATE A SOCKET SERVER THAT IS LISTENING TO THE PYTHON MODEL
net.createServer(function(sock) {
    
    // We have a connection - a socket object is assigned to the connection automatically
    console.log('CONNECTED: ' + sock.remoteAddress +':'+ sock.remotePort);
    
    // Add a 'data' event handler to this instance of socket
    sock.on('data', function(data) {
        
        //console.log('DATA ' + sock.remoteAddress + ': ' + data);
        pydata = data; //THIS IS THE DATA WE GET FROM PYTHON
    });
    console.log('pydata' + pydata + typeof pydata);

	//pydata2  = JSON.stringify(pydata);
	//pydata2 = pydata.toString();
	pydata2 = JSON.parse(pydata);
	//console.log('attempting to access pydata2 dict: ' + pydata2["Device_statuses"]["MC 1"])
	console.log('after JSON parse' + pydata2 + typeof pydata2);
	
	io.emit('pydata', pydata2);
	console.log("Sent pydata straight to b4w! ");
	
}).listen(1337, '127.0.0.1.');

console.log('Server listening on ' + '127.0.0.1.' +':'+ '1337');


//OPEN A SOCKET TO COMMUNICATE WITH THE VISUALIZATION SCRIPT

io.sockets.on('connection', function (socket) { //This refers to the first server, listening to port 2000
	console.log("Viz connected"); //Visualization script informs that it has been loaded on the website
		
	socket.on('disconnect', function () {
	  	console.log('Viz disconnect');
	});
	
	/* socket.on('pydata', function () { //This socket is listening to visualization color change function
		console.log('Im trying to send ' + pydata);
		io.emit('pydata', pydata2); //This is where we send the data from Python over the socket to the visualizer
		console.log("Sent pydata to b4w! " + pydata);
	}); */
	
	/* setTimeout(function() {
		io.emit('pydata', pydata2);
		console.log("Sent pydata straight to b4w! " + pydata);
	}, 5000 ); */
	
		
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
