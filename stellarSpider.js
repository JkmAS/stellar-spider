/*!
 * Stellar spider v1.1.0
 * Stellar spider is canvas decoration for your website
 * Author JkmAS Mejstrik
 * Website jkmas.cz
 * Licensed under MIT (https://github.com/JkmAS/stellar-spider/blob/master/LICENSE)
 */

/*
 * =====================================================================
 * Constants
 * =====================================================================
 */ 
 
//quantity of points and time to change position of point
var POINTS_QUANTITY = MOVE_TIME = 500;
//difference between distance of two points
var DIFFERENCE = 50;

/*
 * =====================================================================
 * Variables
 * =====================================================================
 */ 
var canvas = document.getElementById('stellarSpider');
var ctx = canvas.getContext('2d'); 
var points = [];
var cursor = {
	x: null,
	y: null
};
//to disable texts set tags to null;
var tags = null;
/*
 * =====================================================================
 * Logic
 * =====================================================================
 */
 
//generate coordinates of points 
function generatePointsCoordinates(){
	for (var i = 0; i < POINTS_QUANTITY; i++){
		var pointX = Math.random()*canvas.width;
		var pointY = Math.random()*canvas.height;
		var point = {
			x: pointX,
			y: pointY,
			//size of point
			sizePoint: Math.floor((Math.random() * 3) + 1),
			//determining the direction
			moveToPoint: Math.floor((Math.random() * POINTS_QUANTITY) + 0),
			//time to change of position 
			moveTime: i,
			//text tag for point
			tag: ((typeof tags !== 'undefined' && tags != null) ? tags[i] : null)
		};
		points.push(point);
	}
} 

//generate and draw points and lines
function generatePoints(){
	for (var p = 0; p < points.length; p++) {
		//set transparency of point
		points[p].transparency = getTransparency(points[p]);
	
		drawPoint(points[p].x, points[p].y, points[p].sizePoint, points[p].transparency);
		generateLines(points[p]);
		generateTags(points[p]);
	}
}

//find the closest points and draw lines
function generateLines(point){
	//maximum lines among points is 5
	var lines = 0;	
	for (var c = 0; c < points.length; c++) {
		//get distance
		var distance = getDistance(point, points[c]);
		//is this point the closest one?
		if (distance[0] < DIFFERENCE && distance[1] < DIFFERENCE &&
		    distance[0] > -DIFFERENCE && distance[1] > -DIFFERENCE &&
		    lines <= 5){
			//draw line	
			drawLine(point, points[c], point.transparency);
			//increase max
			lines++;		
		} 
	}
}

//generate tags
function generateTags(point){
	//check if tag is set
	if (point.tag != null) {
		drawTag(point.x, point.y, point.tag, point.transparency);
	}
}

//move points
function movePoints(){
	for (var i = 0; i < POINTS_QUANTITY; i++){
		//get distance between points
		var distance = getDistance(points[i], points[points[i].moveToPoint]);
		//increase moveTime		
		points[i].moveTime++;
		
		//change position of point							
		//X recognize +/- distance
		if(distance[0] > 0){
			points[i].x = points[i].x - 0.5;
		} else {
			points[i].x = points[i].x + 0.5;
		}						
		//Y recognize +/- distance
		if(distance[1] > 0){
			points[i].y = points[i].y - 0.5;
		} else {
			points[i].y = points[i].y + 0.5;
		}
				
		//change randomly position if true
		if(points[i].moveTime > MOVE_TIME){
			points[i].x = Math.random()*canvas.width;
			points[i].y = Math.random()*canvas.height;
			points[i].moveTime = i;
		}
	}
}

//get distance between two points
function getDistance(pointFirst, pointSecond){
	distanceX = pointFirst.x - pointSecond.x;
	distanceY = pointFirst.y - pointSecond.y;
	return [distanceX, distanceY];	
}

//get position of cursor and set variables
function setCursorPosition(e){	
	cursor.x = e.pageX;
    cursor.y = e.pageY;
}

//get transparency
function getTransparency(point){
	var displayAreaMain = 150;	
	var distance = getDistance(point, cursor);
	
	//is in display area?
	if (distance[0] < 150 && distance[1] < 150  &&
		distance[0] > -150  && distance[1] > -150 ){
		
		//interval - (100,150] & [-150,-100)	
		if((distance[0] <= 150 && distance[0] > 100) || 
		  (distance[0] >= -150 && distance[0] < -100)){
			return "0.1";
		//interval - (50, 100] & [-100,-50)
		} else if((distance[0] <= 100 && distance[0] > 50) || 
		  (distance[0] >= -100 && distance[0] < -50)){
			return "0.3";
		//interval - [0, 50] & [-50, 0]	
		} else if((distance[0] <= 50 && distance[0] >= 0) || 
		  (distance[0] >= -50 && distance[0] >= 0)){
			return "0.9";
		}
		
	} else {
		return "0";
	}
}

/*
 * =====================================================================
 * Drawing functions 
 * =====================================================================
 */ 
 
//draw point
function drawPoint(x, y, size, transparency){
	ctx.beginPath();
	ctx.arc(x, y, 1, 0, 2*Math.PI, false);
	ctx.lineWidth = size;
	ctx.strokeStyle = "rgba(255,255,255,"+transparency+")";
	ctx.closePath();
	ctx.stroke();
}

//draw line
function drawLine(pointFrom, pointTo, transparency){
	ctx.beginPath();
	ctx.moveTo(pointFrom.x, pointFrom.y);
	ctx.lineTo(pointTo.x, pointTo.y);
	ctx.lineWidth = 1;
	ctx.strokeStyle = "rgba(255,255,255,"+transparency+")";	
	ctx.closePath();
	ctx.stroke();	
}

//draw text
function drawTag(x, y, text, transparency){
	ctx.font = "bold 9px Ubuntu";
	ctx.fillStyle = "rgba(255,255,255,"+transparency+")";
	ctx.fillText(text,x,y);
}

/*
 * =====================================================================
 * Animation
 * =====================================================================
 */
 
// Cross-browser support for requestAnimationFrame
var w = window;
var requestAnimationFrame = w.requestAnimationFrame ||
							w.webkitRequestAnimationFrame || 
							w.msRequestAnimationFrame || 
							w.mozRequestAnimationFrame;							

function main(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);	
	generatePoints();	
	movePoints();	
	requestAnimationFrame(main);
}
//add event listener
window.addEventListener('mousemove', setCursorPosition);
//fill array with points
generatePointsCoordinates();

main();
