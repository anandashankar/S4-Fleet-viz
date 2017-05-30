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
var m_anchors = require("anchors");
var m_geom    = require("geometry");

var m_quat = require("quat");

var _enable_camera_controls = true;
var _socket = io();

//var net = require('net');

//set the fastems subsystem names for the color changer function
//var cc = "CC";
//var sc = "SC";
//var ls1 = "LS1";
//var ls2 = "LS2";
//var mc1 ="MC1";
//var mc2 = "MC2";
//and for testing purposes, mock statuscolors (which would come from python in reality!): 
//var statusred = "Red";
//var statusblue = "Blue";
//var statusgreen = "Green";
//var statusyellow = "Yellow";

//var pythondata; //for testing
//var pythondata2; //for testing different stuff simultaneously
//var pydata2;
//var outofthedict;


exports.init = function() { //creates the main canvas container in the website
    m_app.init({
        canvas_container_id: "main_canvas_container",
        callback: init_cb,
        physics_enabled: false,
        alpha: false,
		autoresize: true,
        background_color: [0.0, 0.0, 0.0]
		
    });
};

function init_cb(canvas_elem, success) {

    if (!success) {
        console.log("b4w init failure");
        return;
    }
    load();
}

//THIS IS FOR GETTING DATA FROM THE NODE.JS SERVER! it works...
 
function init_netwok(){ 
    console.log("init_network");
	
	_socket = io.connect();

      _socket.on('connection', function () {
		});

		
	_socket.on('pydata', function(pydata) {
		console.log('Received pydata' + pydata + typeof pydata);
		
		change_subsystem_color("CC", pydata["Device_statuses"]["CC"]["StatusColor"]);
		change_subsystem_color("SC", pydata["Device_statuses"]["SC"]["StatusColor"]);
		change_subsystem_color("LS1", pydata["Device_statuses"]["LS 1"]["StatusColor"]);
		change_subsystem_color("LS2", pydata["Device_statuses"]["LS 2"]["StatusColor"]);
		change_subsystem_color("MC1", pydata["Device_statuses"]["MC 1"]["StatusColor"]);
		change_subsystem_color("MC2", pydata["Device_statuses"]["MC 2"]["StatusColor"]);
		change_subsystem_status_text(pydata["Device_statuses"]["CC"], "fms_cc_anchor_child");
		change_subsystem_status_text(pydata["Device_statuses"]["SC"], "fms_sc_anchor_child");
		change_subsystem_status_text(pydata["Device_statuses"]["LS 1"],"fms_ls1_anchor_child");
		change_subsystem_status_text(pydata["Device_statuses"]["LS 2"], "fms_ls2_anchor_child");
		change_subsystem_status_text(pydata["Device_statuses"]["MC 1"], "fms_mc1_anchor_child");
		change_subsystem_status_text(pydata["Device_statuses"]["MC 2"], "fms_mc2_anchor_child");
		update_flow_tag("FT1",pydata["Flow_tag_positions"]["FT1"][0], pydata["Flow_tag_positions"]["FT1"][1]);
		draw_work_order_path("FT1", pydata["Work_order_history"]["FT1"]["Coordinates"]);
		update_flow_tag("FT2",pydata["Flow_tag_positions"]["FT2"][0], pydata["Flow_tag_positions"]["FT2"][1]);
		update_flow_tag("FT3",pydata["Flow_tag_positions"]["FT3"][0], pydata["Flow_tag_positions"]["FT3"][1]);
		update_flow_tag("FT4",pydata["Flow_tag_positions"]["FT4"][0], pydata["Flow_tag_positions"]["FT4"][1]);
		update_flow_tag("FT5",pydata["Flow_tag_positions"]["FT5"][0], pydata["Flow_tag_positions"]["FT5"][1]);
		update_flow_tag("FT6",pydata["Flow_tag_positions"]["FT6"][0], pydata["Flow_tag_positions"]["FT6"][1]);
		update_flow_tag("FT7",pydata["Flow_tag_positions"]["FT7"][0], pydata["Flow_tag_positions"]["FT7"][1]);
		update_flow_tag("FT8",pydata["Flow_tag_positions"]["FT8"][0], pydata["Flow_tag_positions"]["FT8"][1]);
		update_flow_tag("FT9",pydata["Flow_tag_positions"]["FT9"][0], pydata["Flow_tag_positions"]["FT9"][1]);
		update_flow_tag("FT10",pydata["Flow_tag_positions"]["FT10"][0], pydata["Flow_tag_positions"]["FT10"][1]);
	
	}); 

}


//THIS LOADS THE BLENDER 3D-MODEL, WHICH IS PORTED FROM BLENDER AS JSON
function load() {
    m_data.load("ftestviz_v2.json", load_cb);
	}

//THIS LOADS THE OTHER STUFF
function load_cb(data_id) {
    m_app.enable_camera_controls();
	init_netwok();

	custom_anchors("Cell Controller", "fms_cc_anchor", "fms_cc_anchor_child")
	custom_anchors("Stacker Crane", "fms_sc_anchor", "fms_sc_anchor_child")
	custom_anchors("Machine Cell 1", "fms_mc1_anchor", "fms_mc1_anchor_child")
	custom_anchors("Machine Cell 2", "fms_mc2_anchor", "fms_mc2_anchor_child")
	custom_anchors("Loading Station 1", "fms_ls1_anchor", "fms_ls1_anchor_child")
	custom_anchors("Loading Station 2", "fms_ls2_anchor", "fms_ls2_anchor_child")
	create_flow_tag("FT1",100,100, 200,0,0)
	create_flow_tag("FT2",101,101, 200,200,0)
	create_flow_tag("FT3",102,102, 200,200,200)
	create_flow_tag("FT4",103,103, 150,150,0)
	create_flow_tag("FT5",104,104, 100,0,100)
	create_flow_tag("FT6",105,105, 200,0,200)
	create_flow_tag("FT7",106,106, 50,100,200)
	create_flow_tag("FT8",107,107, 200,0,100)
	create_flow_tag("FT9",108,108, 50,50,50)
	create_flow_tag("FT10",109,109, 0, 0,0)
	
	
}

//THIS FUNCTION CREATES A CUSTOM HTTP ANCHOR WITH A MOUSE CLICK LISTENER FOR A BLENDER GENERIC ANCHOR OBJECT
function custom_anchors(blender_object, http_anchor_name, http_anchor_child){
	//inputs: the name of the anchor in Blender, the name of the anchor in http, the name of the child anchor in http
	var s_anchor = m_scenes.get_object_by_name(blender_object);
    m_anchors.attach_move_cb(s_anchor, function(x, y, appearance, obj, elem) {
        var anchor_elem = document.getElementById(http_anchor_name);
		var anchor_child_elem = document.getElementById(http_anchor_child);
        anchor_elem.style.left = x + "px";
        anchor_elem.style.top = y + "px";

        if (appearance == "visible")
            anchor_elem.style.visibility = "visible";
        else
            anchor_elem.style.visibility = "hidden";
		
		anchor_elem.addEventListener("click", function() {
			if (anchor_child_elem.style.display == "block") {
				anchor_child_elem.style.display = "none";	
			} else {
				anchor_child_elem.style.display = "block";
			}
		
			}, false);
		
    });
	
	
}


//THIS FUNCTION TELLS THE 3D-MODEL TO CHANGE THE SUBYSTEM MODEL COLORS
function change_subsystem_color(subsystem,statuscolor) {
	//inputs: subsystem name in the Blender model, the current statuscolor
	var subsys = m_scenes.get_object_by_name(subsystem); //get the object names from the 3d-model
	var materialName = m_mat.get_materials_names(subsys); //get the object material names
	//console.log("If clause sees color " + statuscolor)
	//define the colors NOTICE THE CAPITAL LETTERS IN THE COLOR NAMES!!!
	if(statuscolor.indexOf("Red") >= 0){var col1=200;var col2=0;var col3=0;}
	else if(statuscolor.indexOf("Green") >= 0){var col1=0;var col2=200;var col3=0;}
	else if(statuscolor.indexOf("Blue") >= 0){var col1=0;var col2=0;var col3=200;}
	else if(statuscolor.indexOf("Yellow") >= 0){var col1=200;var col2=200;var col3=0;}
	else {var col1=0;var col2=0;var col3=0; console.log("I see a subsytem / I want to paint it black...");}
	
	m_mat.set_diffuse_color(subsys, materialName[0], [col1,col2,col3]); //set the color for the material in question
	//console.log("Tried change_subsystem_color function with " + statuscolor + typeof statuscolor)
}

//THIS FUNCTION CHANGES THE FMS SUBSYSTEM STATUS TEXT IN THE ANNOTATION BOXES
function change_subsystem_status_text(status_dict, http_anchor_child){
	//inputs: the dictionary containing the Fastems info: order id, status, status changed and max alert level; the name of the child anchor in http
	var status_change_time = new Date(status_dict["StatusChanged"]);
	//var status_change_time = new java.text.SimpleDateFormat("MM/dd/yyyy HH:mm:ss").format(new java.util.Date (status_dict["StatusChanged"]));
	var status_update = "Order ID: " + status_dict["OrderId"] + "</br>" + "Status: " + status_dict["Status"] + "</br>" + "Status Changed: " + status_change_time + "</br>" + "Max Alert Level: " + status_dict["MaxAlertLevel"];
	
	document.getElementById(http_anchor_child).innerHTML = status_update;
	
}

//THIS FUNCTION CREATES THE FLOWTAGS (AND GETS DATA FROM THE DATA AGENTS FLOW TAG-LIST!)
function create_flow_tag(work_number, x, y, colorR, colorG, colorB){
	//inputs: the name of the work order, starting location coordinates, colors of the tag on the 3d-model
	console.log("creation!")
	var flow_tag_object = m_scenes.get_object_by_name("Flow Tag basic");
	var tagMaterialName = m_mat.get_materials_names(flow_tag_object);
	
	var work_order = m_obj.copy(flow_tag_object, work_number, true);
	m_scenes.append_object(work_order);
		
	m_trans.set_translation(work_order, x, y, 0.5);

	m_mat.set_diffuse_color(work_order, tagMaterialName[0], [colorR,colorB,colorG]);	
	
	
}

//THIS FUNCTION UPDATES A FLOW TAGS POSITION AND INFORMATION
function update_flow_tag(work_number, x, y){
	//inputs: the name of the work order, the new coordinates
	var flow_tag_to_move = m_scenes.get_object_by_name(work_number);
	m_trans.set_translation(flow_tag_to_move, x, y, 1);
	
}

//THIS FUNCTION DRAWS LINES TO REPRESENT A WORK ORDER'S PATH
function draw_work_order_path(work_order_line, path_dict){

	//get the coordinate dictionary length for drawing all of the elements
	var dict_length = Object.keys(path_dict).length; //works only in ES5 and so on...
	
	//get the line object (empty for line rendering...)
	var line_object = m_scenes.get_object_by_name("Line basic");
	
	//var work_order_line = [];
	
	//for loop for drawing lines between every coordinate location
	var n = 0;
	var points = [];
	for (var i = 0; i < dict_length - 1; i++){
		n++
		//var work_order_line = m_obj.copy(line_object, work_order_line[i], true); //can't copy empty...
		//m_scenes.append_object(work_order_line);
		
		//line coordinates from python:
		points.push(path_dict[i][0])
		points.push(path_dict[i][1])
		points.push(0.5)
		points.push(path_dict[n][0])
		points.push(path_dict[n][1])
		points.push(0.5);
		var points2 = new Float32Array(points);
	
	}
	//draw the line and set its parameters
	m_geom.draw_line(line_object, points2);
	
	m_mat.set_line_params(line_object, {
		color: new Float32Array([200.0, 0.0, 0.0, 1.0]),
		width: 20
	});
	
	

}



});
// import the app module and start the app by calling the init method
b4w.require("ftest_b4w").init();

