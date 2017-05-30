
dataPoints = [];
dataset = []; 
dataset_max = [];
dataset_status = []; 
item = "";
max = "";
item_status = "";
order = "";    

var str = "StatusColor"; 
var max_alert = "MaxAlertLevel";
var sts = "Status"; 
var o_id = "OrderId";  
var green = "Green";
var red = "Red";
var blue = "Blue";

var status_ok = "Ok";
var status_idle = "Idle";
var status_manual = "Manual";
var status_semiAuto = "SemiAutomatic"; 
var status_busy = "Busy";

var yellow = "Yellow";
var alert2 = "warning";
var alert3 = "error";
var alert4 = ""; 

var socket = io('http://localhost:2000');
    socket.on('pydata', function(pydata){        

var parsedObj = pydata; 

$.each(parsedObj, function(key, value) { 
    dataPoints.push({x: key, y: value}); 
    var any = parsedObj[key]["MC 2"]; 
    //console.log(any); 

    for(var i in any){
        if (i == str) {
            item = any[str]; 
            console.log(item); 
        }     
    }

    for(var i in any){
        if (i == max_alert) {
            max = any[max_alert]; 
            console.log(max); 
        }     
    }

    for(var i in any){
        if (i == sts) {
            item_status = any[sts]; 
            console.log(item_status); 
        }     
    }

    for(var i in any){
        if (i == o_id) {
            order = any[o_id]; 
            console.log(order); 
        }     
    }

    $("table#dynamicTable").html(order); 
    $("table#dynamicTable2").html(item_status); 


    //$.each(any, function(i, item){
        //s_color.push({x: i, y: item});
            //var any_again = any[i].StatusColor;

           // console.log(any_again); 
         
       // var arr = Object.keys(s_color).map(function(k) {return s_color[k] });
        //console.log(arr);

        //For StatusColor
        if(item == green){
            dataset = [0,0,0,360];
        }
        else if (item == blue) {
            dataset = [0,360,0,0];
        }
        else if (item == yellow) {
            dataset = [0,0,360,0];
        }
        else {
            dataset = [360,0,0,0];
        }

        //For Status
        if(item_status == status_ok){
            dataset_status = [0,0,0,0,360];
        }
        else if (item_status == status_idle) {
            dataset_status = [0,0,0,360,0];
        }
        else if (item_status == status_semiAuto) {
            dataset_status = [0,0,360,0,0];
        }
        else if (item_status == status_manual || status_busy) {
            dataset_status = [0,360,0,0,0];
        }
        else {
            dataset_status = [360,0,0,0,0];
        }

        //For MaxAlert Level
        if (max == alert4) {
            dataset_max = [10, 0, 0];
        } 
        else if (max == alert2) {
            dataset_max = [0, 10, 0];
        }
        else {
            dataset_max = [0, 0, 10];
        }


    }); 

// ***** Render doughnut chart for StatusColor ********
const doughnutChart = document.getElementById("mydoughnutChart");
  console.log(doughnutChart);
  var mydoughnutChart = new Chart(doughnutChart, {
    type: 'doughnut',
    data:  {
    labels: [
        "Red",
        "Blue",
        "Yellow",
        "Green"
        
    ],
    datasets: [
        {
            data: dataset,
            backgroundColor: [
                "#FF0000",
                "#36A2EB",
                "#FFCE56",
                "#228B22"
            ],
            hoverBackgroundColor: [
                "#FF0000",
                "#36A2EB",
                "#FFCE56",
                "#228B22"
            ]
        }]
}, 
    options: {
        rotation: 1 * Math.PI,
        circumference: 1 * Math.PI,
        animation:{
            animateScale:true,
            animateRotate: true
        }
    }

});

// ********Render Full Pie Doughnut chart for Status*********
const piechart = document.getElementById("mypieChart");
  console.log(piechart);

  var mypieChart = new Chart(piechart, {
    type: 'doughnut',
    data:  {
    labels: [
        "Error",
        "Busy - Manual",
        "Busy - SemiAutomatic",
        "Idle",
        "Okay"
        
    ],
    datasets: [
        {
            data: dataset_status,
            backgroundColor: [
                "#FF0000",
                "#36A2EB",
                "#4169E1",
                "#FFCE56",
                "#228B22"
            ],
            hoverBackgroundColor: [
                "#FF0000",
                "#36A2EB",
                "#4169E1",
                "#FFCE56",
                "#228B22"
            ]
        }]
}, 
    options: {
        animation:{
            animateScale:true,
            animateRotate: true
        }
    }
});


//*********Render Horizontal bar chart for MaxAlertLevel*********
const chart = document.getElementById("myChart");
  console.log(chart);

  var myChart = new Chart(chart, {
    type: 'horizontalBar',
    data: {
    labels: ["okay", "warning", "error"],
    datasets: [
        {
            label: "MaxAlertLevel",
            backgroundColor: [
                'rgba(0, 153, 0, 0.7)',
                'rgba(255, 255, 0, 0.7)',
                'rgba(255, 0, 0, 0.7)'
                

               
                
            ],
            borderColor: [
                'rgba(0, 153, 0,1)',
                'rgba(255, 255, 0, 1)',
                'rgba(255, 0, 0, 1)'
                
                
            ],
            borderWidth: 1,
            data: dataset_max,
        }
    ]
},
    options: {
        scales: {
            xAxes: [{
                stacked: true
            }],
            yAxes: [{
                stacked: true
            }]
        }
    }
});

}); 