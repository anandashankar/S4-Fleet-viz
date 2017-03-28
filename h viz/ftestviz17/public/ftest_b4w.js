//THIS IS THE JAVA SCRIPT THAT CONTROLS THE VISUALIZER
//This needs to be in the public folder (or somewhere similar)
//Try to get data from your Node.js database to here.

//Node.js Agent Based Model-visualizer test.


// Much of this code comes from Node.js Chess App https://www.blend4web.com/en/forums/topic/2524/
// https://github.com/WillWelker/node_chess
// Much of that code comes from the B4W example project Cartoon Interior https://www.blend4web.com/en/community/article/66/

"use strict"

// register the application module
b4w.register("ftest_b4w", function(exports, require) {

// import modules used by the app (not all of these are currently used)
var m_app    = require("app");
var m_cam    = require("camera");
var m_cont   = require("container");
var m_ctl    = require("controls");
var m_data   = require("data");
var m_mat	 = require("material");
var m_math   = require("math");
var m_mouse  = require("mouse");
var m_obj    = require("objects");
var m_phy    = require("physics");
var m_quat   = require("quat");
var m_rgb	 = require("rgb");
var m_scenes = require("scenes");
var m_time   = require('time');
var m_trans  = require("transform");
var m_util   = require("util");
var m_rgba 	 = require("rgba");
var m_version = require("version");
var m_cfg     = require("config");


var m_quat = require("quat");

var _enable_camera_controls = true;
var socket = io();

//set the fastems subsystem names for the color changer function
var fms = "FMS";
var ls1 = "LS1";
var ls2 = "LS2";
var mc1 ="MC1";
var mc2 = "MC2";
//and for testing purposes, mock statuscolors (which would come from python in reality!): 
var statusred = "red";
var statusblue = "blue";
var statusgreen = "green";
var statusyellow = "yellow";

var pythondata; //for testing
var pythondata2; //for testing different stuff simultaneously

exports.init = function() { //creates the main canvas container in the website
    m_app.init({
        canvas_container_id: "main_canvas_container",
        callback: init_cb,
        physics_enabled: false,
        alpha: false,
		autoresize: true,
        background_color: [0.0, 0.0, 0.0, 0.0]
		
    });
};

function init_cb(canvas_elem, success) {

    if (!success) {
        console.log("b4w init failure");
        return;
    }
    load();
}

//THIS IS FOR GETTING DATA FROM THE NODE.JS SERVER! Not sure if it works.
//It currently works only on refreshing the website, as it is under the init_network function
//Replace with any other method of getting the job done.  

function init_netwok(){ 
    console.log("init_network");
	
	socket = io.connect();

      socket.on('connect', function () {
		});
	
    socket.emit('pydata'); //ask the server for data
	socket.on('pydata', function (pydata) {
		change_subsystem_color(mc2, pydata);
		pythondata = pydata;
    });
		
	//THIS MIGHT BE THE PROBLEM:
    //String pydata2 = new String(pydata, bytes); 
	//Couldn't get that to work. But if you can send strings from your database, it doesn't need to work.
	
	//loop the SOME() function indefinitely... not working right now?
  m_time.set_timeout(function(){init_network()}, 1/15);
	
}

//THIS LOADS THE BLENDER 3D-MODEL, WHICH IS PORTED FROM BLENDER AS JSON
function load() {
    m_data.load("ftestviz.json", load_cb);
	}


function load_cb(data_id) {
    m_app.enable_camera_controls();
	init_netwok();
	
}


//function python_to_b4w(){
	//while(true){
	//socket.emit('pydata'); //ask the server for data
	//socket.on('pydata', function (pydata) {
		//change_subsystem_color(mc2, pydata);
		//pythondata = pydata;      
    //});
	//}
	
//};

//THIS FUNCTION TELLS THE 3D-MODEL TO CHANGE THE SUBYSTEM MODEL COLORS
function change_subsystem_color(subsystem,statuscolor) {
	
	var subsys = m_scenes.get_object_by_name(subsystem); //get the object names from the 3d-model
	var materialName=m_mat.get_materials_names(subsys); //get the object material names
	
	//define the colors NOTICE THE CAPITAL LETTERS IN THE COLOR NAMES!!!
	if(statuscolor=="Red"){var col1=200;var col2=0;var col3=0;}
	else if(statuscolor=="Green"){var col1=0;var col2=200;var col3=0;}
	else if(statuscolor=="Blue"){var col1=0;var col2=0;var col3=200;}
	else if(statuscolor=="Yellow"){var col1=200;var col2=200;var col3=0;}
	else {var col1=0;var col2=0;var col3=0;}
	
	m_mat.set_diffuse_color(subsys, materialName[0], [col1,col2,col3]); //set the color for the material in question
}

});
// import the app module and start the app by calling the init method
b4w.require("ftest_b4w").init();

