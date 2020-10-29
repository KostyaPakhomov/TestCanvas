"use strict";
// get canvas related references
var cvs = document.getElementById("canvas");
var ctx = cvs.getContext("2d");
ctx.fillStyle = "red";
ctx.fillRect(0,0,800,500);
ctx.fillStyle = "black";
ctx.font = "30px Arial Black";
ctx.fillText("Choose x/y and click the button 'Add Element'",20, 250);

var BB = cvs.getBoundingClientRect();
var offsetX = BB.left;
var offsetY = BB.top;
var WIDTH = cvs.width;
var HEIGHT = cvs.height;

// drag related variables
var dragok = false;
var startX;
var startY;
var xPos;
var yPos;

var elemArr = document.getElementById("infoAria");
// an array of objects that define different rectangles
var rects = [];
var click = 0;

function setObjectsByXY(xPos, yPos, ...args){
    click = 1;
    let xPosi = parseInt(document.getElementById("x").value);
    let yPosi = parseInt(document.getElementById("y").value);
    if (click == 1){
        rects.push({
        x: xPos||xPosi,
        y: yPos||yPosi,
        width: 30,
        height: 30,
        fill: "#000000",
        isDragging: false
        });

        if (((xPos||xPosi) > cvs.width) || ((xPos||xPosi) < 0) || ((yPos||yPosi) > cvs.height) || ((yPos||yPosi) < 0)) {
            alert ("Проверьте введённые данные. Значения выходят за рамки сетки(800x500)");
            rects.pop();
        }
    }
    click=0;
    draw();
    getElementsByXY();
}

function getElementsByXY(x,y){
    if (rects.length > 0) {
        var str = "";

        for (let i in rects) {
            x = rects[i].x;
            y = rects[i].y;
            str += (parseInt(i)+1) + ' - ' + 'x: ' + x +", y: "+ y +";" + '<br>';
            elemArr.innerHTML = str;
        }
    }
}

function setObjectAraund(centerX, centerY, radius, angle){
    click = 2;
    centerX = parseInt(document.getElementById("xa").value);
    centerY = parseInt(document.getElementById("ya").value);
    radius = parseInt(document.getElementById("ra").value);
    angle = parseInt(document.getElementById("ar").value);
    
    if (click == 2){
        
        rects.push({
            x: centerX,
            y: centerY,
            width: 30,
            height: 30,
            rad: radius, 
            araund: angle,
            fill: "#FF0000",
            isDragging: false
        });

        if ((centerX > cvs.width) || (centerX < 0) || (centerY > cvs.height) || (centerY < 0) || (radius < 0)) {
            alert ("Проверьте введённые данные. Значения выходят за рамки сетки(800x500)");
            rects.pop();
        }

        var id = 0;
        for (let i in rects){
            var w = rects[i].width, h = rects[i].height;
            var x = rects[i].x, y = rects[i].x;
            var theta = rects[i].araund* Math.PI / 180, phi = 0;
            var r = rects[i].rad;
        }

        function init() {
            ctx.fillStyle = "#33eeaa";
        }
    
        function rect(angle, x, y) {
            ctx.save();
            ctx.translate(x+w*0.5, y+h*0.5);
            ctx.rotate(angle);
            ctx.translate(-x-w*0.5, -y-h*0.5);    
            for (let i in rects){
                ctx.fillRect(rects[i].x, rects[i].y, rects[i].width,rects[i].height);
            }
            ctx.restore();
        }
    
        function render() {
            ctx.clearRect(0, 0, WIDTH, HEIGHT);      
            rect(theta, x, y);   
            for (let i in rects){ 
                ctx.beginPath();
                ctx.arc(rects[i].x + 5, rects[i].y + 5, 10, 0, 2*Math.PI);
                ctx.stroke();  
                x = r*Math.cos(phi) + rects[i].x;
                y = r*Math.sin(phi) + rects[i].y;
                theta += 0.01;
                phi += 0.01;    
            }    
            id = requestAnimationFrame(render);
        }
    
        init();
        render();

        click = 0;
    }

    draw();

}


// listen for mouse events
cvs.onmousedown = myDown;
cvs.onmouseup = myUp;
cvs.onmousemove = myMove;


// draw a single rect
function rect(x, y, w, h) {
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.closePath();
    ctx.fill();
}

// clear the canvas
function clear() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
}

// redraw the scene
function draw() {
    clear();
    ctx.fillStyle = "#FAF7F8";
    rect(0, 0, WIDTH, HEIGHT);
    // redraw each rect in the rects[] array
    for (var i = 0; i < rects.length; i++) {
        var r = rects[i];
        ctx.fillStyle = r.fill;
        rect(r.x, r.y, r.width, r.height);
    }
}


// handle mousedown events
function myDown(e) {

    // tell the browser we're handling this mouse event
    e.preventDefault();
    e.stopPropagation();

    // get the current mouse position
    var mx = parseInt(e.clientX - offsetX);
    var my = parseInt(e.clientY - offsetY);

    // test each rect to see if mouse is inside
    dragok = false;
    for (var i = 0; i < rects.length; i++) {
        var r = rects[i];
        if (mx > r.x && mx < r.x + r.width && my > r.y && my < r.y + r.height) {
            // if yes, set that rects isDragging=true
            dragok = true;
            r.isDragging = true;
        }
    }
    // save the current mouse position
    startX = mx;
    startY = my;
}


// handle mouseup events
function myUp(e) {  
    // tell the browser we're handling this mouse event
    e.preventDefault();
    e.stopPropagation();

    // clear all the dragging flags
    dragok = false;
    for (var i = 0; i < rects.length; i++) {
        rects[i].isDragging = false;
    }
    getElementsByXY();
}


// handle mouse moves
function myMove(e) {
    // if we're dragging anything...
    if (dragok) {

        // tell the browser we're handling this mouse event
        e.preventDefault();
        e.stopPropagation();

        // get the current mouse position
        var mx = parseInt(e.clientX - offsetX);
        var my = parseInt(e.clientY - offsetY);

        // calculate the distance the mouse has moved
        // since the last mousemove
        var dx = mx - startX;
        var dy = my - startY;

        // move each rect that isDragging 
        // by the distance the mouse has moved
        // since the last mousemove
        for (var i = 0; i < rects.length; i++) {
            var r = rects[i];
            if (r.isDragging) {
                r.x += dx;
                r.y += dy;
            }
        }

        // redraw the scene with the new rect positions
        draw();

        // reset the starting mouse position for the next mousemove
        startX = mx;
        startY = my;

    }
}