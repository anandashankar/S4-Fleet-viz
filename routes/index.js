const express = require('express');
const passport = require('passport');
const Account = require('../models/account');
const McOne = require('../models/mcone');
const McTwo = require('../models/mctwo');
const Cc = require('../models/cc');
const Ftone = require('../models/ftone');
const Fttwo = require('../models/fttwo');
const Ftthree = require('../models/ftthree');
const Ftfour = require('../models/ftfour');
const Ftfive = require('../models/ftfive');
const Ftsix = require('../models/ftsix');
const Ftseven = require('../models/ftseven');
const Fteight = require('../models/fteight');
const Ftnine = require('../models/ftnine');
const Ftten = require('../models/ftten');

router = express.Router();

router.get('/', (req, res) => {
    res.render('index', { user : req.user });
});

router.get('/register', (req, res) => {
    res.render('register', { });
});
/*
router.post('/register', (req, res, next) => {
    Account.register(new Account({ username : req.body.username }), req.body.password, (err, account) => {
        if (err) {
          return res.render('register', { error : err.message });
        }

        passport.authenticate('local')(req, res, () => {
            req.session.save((err) => {
                if (err) {
                    return next(err);
                }
                res.redirect('/');
            });
        });
    });
});

*/


router.get('/login', (req, res) => {
    res.render('login', { user : req.user, error : req.flash('error')});
});

router.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), (req, res, next) => {
    req.session.save((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});

router.get('/logout', (req, res, next) => {
    req.logout();
    req.session.save((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});

function checkAuthentication(req, res, next){
    if(req.isAuthenticated()){
        next();
 }else{
    res.redirect('/login');
 }
}

router.get('/ping', checkAuthentication, (req, res) => {
    res.status(200).send("pong!");
});

router.get('/viz', checkAuthentication, function(req, res){
        res.render('viz', {});
});

router.get('/data', checkAuthentication, function(req, res){
        res.render('data', {});
});

router.get('/subsys', checkAuthentication, function(req, res){
        res.render('subsys', {});
});

router.get('/subsystem', checkAuthentication, function(req, res) {
    var obj = ['http://localhost:3000/subsystem/cc/', 'http://localhost:3000/subsystem/mc1/', 'http://localhost:3000/subsystem/mc2/'];
  res.json(obj);
});

router.get('/flowtags', checkAuthentication, function(req, res) {
  
  res.json({
  	name: 'flowtags', Quantity: 10, flowtag1: {
  		id: 001, 
  		data: 'http://localhost:3000/flowtags/ft1/', 
  		time: {
  			createdAt: '',
  			updatedAt: ''
  		}, 
  		timespent: ''
  	}, 
  	flowtag2: {
  		id: 002, 
  		data: 'http://localhost:3000/flowtags/ft2/', 
  		time: {
  			createdAt: '',
  			updatedAt: ''
  		}, 
  		timespent: ''
  	}, 
  	flowtag3: {
  		id: 003, 
  		data: 'http://localhost:3000/flowtags/ft3/', 
  		time: {
  			createdAt: '',
  			updatedAt: ''
  		}, 
  		timespent: ''
  	}, 
  	flowtag4: {
  		id: 004, 
  		data: 'http://localhost:3000/flowtags/ft4/', 
  		time: {
  			createdAt: '',
  			updatedAt: ''
  		},
  		timespent: ''
  	}, 
  	flowtag5: {
  		id: 005, 
  		data: 'http://localhost:3000/flowtags/ft5/', 
  		time: {
  			createdAt: '',
  			updatedAt: ''
  		},
  		timespent: ''
  	}, 
  	flowtag6: {
  		id: 006, 
  		data: 'http://localhost:3000/flowtags/ft6/', 
  		time: {
  			createdAt: '',
  			updatedAt: ''
  		}, 
  		timespent: ''
  	}, 
  	flowtag7: {
  		id: 007, 
  		data: 'http://localhost:3000/flowtags/ft7/',
  		time: {
  			createdAt: '',
  			updatedAt: ''
  		}, 
  		timespent: ''
  	}, 
  	flowtag8: {
  		id: 008, 
  		data: 'http://localhost:3000/flowtags/ft8/', 
  		time: {
  			createdAt: '',
  			updatedAt: ''
  		}, 
  		timespent: ''
  	}, 
  	flowtag9: {
  		id: 009, 
  		data: 'http://localhost:3000/flowtags/ft9/', 
  		time: {
  			createdAt: '',
  			updatedAt: ''
  		},
  		timespent: ''
  	}, 
  	flowtag10: {
  		id: 10,
  		data: 'http://localhost:3000/flowtags/ft10/', 
  		time: {
  			createdAt: '',
  			updatedAt: ''
  		}, 
  		timespent: ''
  	}
  });  
  
});

//*******************Flowtags*********************************

//Flowtag 1 status###############
var ft1Route = router.route('/flowtags/ft1');
ft1Route.post(function(req, res){
  var ft1 = new Ftone();
  ft1.name = 'FT1',
  ft1.location = req.body.location;
  ft1.timeOfArrival = req.body.timeOfArrival;
  ft1.timeSpent = req.body.timeSpent;


  ft1.save(function(err){
    if (err)
      res.send(err);
    res.json({ message: 'FT 1 data', data: ft1});
  });
});

//creating new route using endpoint for GET
ft1Route.get(checkAuthentication, function(req, res){
  Ftone.find(function(err, ft1){
    if(err)
      res.send(err);
    res.json(ft1);
  });
});

//Flowtag 2 status###############
var ft2Route = router.route('/flowtags/ft2');
ft2Route.post(function(req, res){
  var ft2 = new Fttwo();
  ft2.name = 'FT2',
  ft2.location = req.body.location;
  ft2.timeOfArrival = req.body.timeOfArrival;
  ft2.timeSpent = req.body.timeSpent;


  ft2.save(function(err){
    if (err)
      res.send(err);
    res.json({ message: 'FT 2 data', data: ft2});
  });
});

//creating new route using endpoint for GET
ft2Route.get(checkAuthentication, function(req, res){
  Fttwo.find(function(err, ft2){
    if(err)
      res.send(err);
    res.json(ft2);
  });
});

//Flowtag 3 status###############
var ft3Route = router.route('/flowtags/ft3');
ft3Route.post(function(req, res){
  var ft3 = new Ftthree();
  ft3.name = 'FT3',
  ft3.location = req.body.location;
  ft3.timeOfArrival = req.body.timeOfArrival;
  ft3.timeSpent = req.body.timeSpent;


  ft3.save(function(err){
    if (err)
      res.send(err);
    res.json({ message: 'FT 3 data', data: ft3});
  });
});

//creating new route using endpoint for GET
ft3Route.get(function(req, res){
  Ftthree.find(function(err, ft3){
    if(err)
      res.send(err);
    res.json(ft3);
  });
});

//Flowtag 4 status###############
var ft4Route = router.route('/flowtags/ft4');
ft4Route.post(function(req, res){
  var ft4 = new Ftfour();
  ft4.name = 'FT4',
  ft4.location = req.body.location;
  ft4.timeOfArrival = req.body.timeOfArrival;
  ft4.timeSpent = req.body.timeSpent;


  ft4.save(function(err){
    if (err)
      res.send(err);
    res.json({ message: 'FT 4 data', data: ft4});
  });
});

//creating new route using endpoint for GET
ft4Route.get(checkAuthentication, function(req, res){
  Ftfour.find(function(err, ft4){
    if(err)
      res.send(err);
    res.json(ft4);
  });
});

//Flowtag 5 status###############
var ft5Route = router.route('/flowtags/ft5');
ft5Route.post(function(req, res){
  var ft5 = new Ftfive();
  ft5.name = 'FT5',
  ft5.location = req.body.location;
  ft5.timeOfArrival = req.body.timeOfArrival;
  ft5.timeSpent = req.body.timeSpent;


  ft5.save(function(err){
    if (err)
      res.send(err);
    res.json({ message: 'FT 5 data', data: ft5});
  });
});

//creating new route using endpoint for GET
ft5Route.get(checkAuthentication, function(req, res){
  Ftfive.find(function(err, ft5){
    if(err)
      res.send(err);
    res.json(ft5);
  });
});

//Flowtag 6 status###############
var ft6Route = router.route('/flowtags/ft6');
ft6Route.post(function(req, res){
  var ft6 = new Ftsix();
  ft6.name = 'FT6',
  ft6.location = req.body.location;
  ft6.timeOfArrival = req.body.timeOfArrival;
  ft6.timeSpent = req.body.timeSpent;


  ft6.save(function(err){
    if (err)
      res.send(err);
    res.json({ message: 'FT 6 data', data: ft6});
  });
});

//creating new route using endpoint for GET
ft6Route.get(checkAuthentication, function(req, res){
  Ftsix.find(function(err, ft6){
    if(err)
      res.send(err);
    res.json(ft6);
  });
});

//Flowtag 7 status###############
var ft7Route = router.route('/flowtags/ft7');
ft7Route.post(function(req, res){
  var ft7 = new Ftseven();
  ft7.name = 'FT7',
  ft7.location = req.body.location;
  ft7.timeOfArrival = req.body.timeOfArrival;
  ft7.timeSpent = req.body.timeSpent;


  ft7.save(function(err){
    if (err)
      res.send(err);
    res.json({ message: 'FT 7 data', data: ft7});
  });
});

//creating new route using endpoint for GET
ft7Route.get(checkAuthentication, function(req, res){
  Ftseven.find(function(err, ft7){
    if(err)
      res.send(err);
    res.json(ft7);
  });
});

//Flowtag 8 status###############
var ft8Route = router.route('/flowtags/ft8');
ft8Route.post(function(req, res){
  var ft8 = new Fteight();
  ft8.name = 'FT8',
  ft8.location = req.body.location;
  ft8.timeOfArrival = req.body.timeOfArrival;
  ft8.timeSpent = req.body.timeSpent;


  ft8.save(function(err){
    if (err)
      res.send(err);
    res.json({ message: 'FT 8 data', data: ft8});
  });
});

//creating new route using endpoint for GET
ft8Route.get(checkAuthentication, function(req, res){
  Fteight.find(function(err, ft8){
    if(err)
      res.send(err);
    res.json(ft8);
  });
});

//Flowtag 9 status###############
var ft9Route = router.route('/flowtags/ft9');
ft9Route.post(function(req, res){
  var ft9 = new Ftnine();
  ft9.name = 'FT9',
  ft9.location = req.body.location;
  ft9.timeOfArrival = req.body.timeOfArrival;
  ft9.timeSpent = req.body.timeSpent;


  ft9.save(function(err){
    if (err)
      res.send(err);
    res.json({ message: 'FT 9 data', data: ft9});
  });
});

//creating new route using endpoint for GET
ft9Route.get(checkAuthentication, function(req, res){
  Ftnine.find(function(err, ft9){
    if(err)
      res.send(err);
    res.json(ft9);
  });
});

//Flowtag 10 status###############
var ft10Route = router.route('/flowtags/ft10');
ft10Route.post(function(req, res){
  var ft10 = new Ftten();
  ft10.name = 'FT10',
  ft10.location = req.body.location;
  ft10.timeOfArrival = req.body.timeOfArrival;
  ft10.timeSpent = req.body.timeSpent;


  ft10.save(function(err){
    if (err)
      res.send(err);
    res.json({ message: 'FT 10 data', data: ft10});
  });
});

//creating new route using endpoint for GET
ft10Route.get(checkAuthentication, function(req, res){
  Ftten.find(function(err, ft10){
    if(err)
      res.send(err);
    res.json(ft10);
  });
});


//*******************System*******************************************

//Machine 1 status###############
var mc1Route = router.route('/subsystem/mc1');
mc1Route.post(function(req, res){
  var mc1 = new McOne();
  mc1.maxAlertLevel = req.body.maxAlertLevel;
  mc1.orderID = req.body.orderID;
  mc1.status = req.body.status;
  mc1.statusChange = req.body.statusChange;
  mc1.colorChange = req.body.colorChange;

  mc1.save(function(err){
    if (err)
      res.send(err);
    res.json({ message: 'M/c 1 data', data: mc1});
  });
});

//creating new route using endpoint for GET
mc1Route.get(checkAuthentication, function(req, res){
  McOne.find(function(err, mc1){
    if(err)
      res.send(err);
    res.json(mc1);
  });
});


//Machine 2 status ##################
var mc2Route = router.route('/subsystem/mc2');
mc2Route.post(function(req, res){
  var mc2 = new McTwo();
  mc2.maxAlertLevel = req.body.maxAlertLevel;
  mc2.orderID = req.body.orderID;
  mc2.status = req.body.status;
  mc2.statusChange = req.body.statusChange;
  mc2.colorChange = req.body.colorChange;

  mc2.save(function(err){
    if (err)
      res.send(err);
    res.json({ message: 'M/c 2 data', data: mc2});
  });
});

//creating new route using endpoint for GET
mc2Route.get(checkAuthentication, function(req, res){
  McTwo.find(function(err, mc2){
    if(err)
      res.send(err);
    res.json(mc2);
  });
});


//CC status ######################
var ccRoute = router.route('/subsystem/cc');
ccRoute.post(function(req, res){
  var cc = new Cc();
  cc.maxAlertLevel = req.body.maxAlertLevel;
  cc.orderID = req.body.orderID;
  cc.status = req.body.status;
  cc.statusChange = req.body.statusChange;
  cc.colorChange = req.body.colorChange;

  cc.save(function(err){
    if (err)
      res.send(err);
    res.json({ message: 'CC 2 data', data: cc});
  });
});

//creating new route using endpoint for GET
ccRoute.get(checkAuthentication, function(req, res){
  Cc.find(function(err, cc){
    if(err)
      res.send(err);
    res.json(cc);
  });
});

module.exports = router;    
