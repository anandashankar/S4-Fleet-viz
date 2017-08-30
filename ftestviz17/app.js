
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');

//route authentication at index.js and user.js
var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();
var server = app.listen(3000);
var io = require('socket.io').listen(server);
var objectAssign = require('object-assign');
var net = require('net');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(flash());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/viz', checkAuthentication, (req, res)=>{
    res.sendFile(__dirname + '/public/viz.html'); 
});
app.get('/data', checkAuthentication, (req, res)=>{
    res.sendFile(__dirname + '/public/data.html'); 
});
app.get('/data/sc', checkAuthentication, (req, res)=>{
    res.sendFile(__dirname + '/public/data/sc.html'); 
});
app.get('/data/cc', checkAuthentication, (req, res)=>{
    res.sendFile(__dirname + '/public/data/cc.html'); 
});
app.get('/data/mc1', checkAuthentication, (req, res)=>{
    res.sendFile(__dirname + '/public/data/mc1.html'); 
});
app.get('/data/mc2', checkAuthentication, (req, res)=>{
    res.sendFile(__dirname + '/public/data/mc2.html'); 
});
app.get('/data/ls1', checkAuthentication, (req, res)=>{
    res.sendFile(__dirname + '/public/data/ls1.html'); 
});
app.get('/data/ls2', checkAuthentication, (req, res)=>{
    res.sendFile(__dirname + '/public/data/ls2.html'); 
});
app.get('/link', checkAuthentication, (req, res)=>{
    res.sendFile(__dirname + '/public/link.html'); 
});

app.use('/', routes); 

// passport config
var Account = require('./models/account');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

// mongoose
mongoose.connect('mongodb://localhost/passport_local_mongoose_express4_viz');

//authenticate routes from public directory 
function checkAuthentication(req, res, next){
    if(req.isAuthenticated()){
        next();
 }else{
    res.redirect('/login');
 }
}

//aquire socket data from pydata
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
    
}).listen(8080, "127.0.0.1");

console.log('Server listening on ' + "127.0.0.1" +':'+ '8080');


//OPEN A SOCKET TO COMMUNICATE WITH THE VISUALIZATION SCRIPT

io.sockets.on('connection', function (socket) { //This refers to the first server, listening to port 2000
    console.log("Viz connected"); //Visualization script informs that it has been loaded on the website
        
    socket.on('disconnect', function () {
        console.log('Viz disconnect');
    }); 
        
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;





