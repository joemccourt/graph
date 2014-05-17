"use strict";
var GRA = {};

GRA.initDefaultValues = function() {
	GRA.canvasID = "#canvas";
	GRA.dirtyCanvas = true;
	GRA.dirtyInfoBG = true;
	GRA.dirtySelectBG = true;
	GRA.lastFrameTime = 0;
	GRA.mousePos = {'x':0.5,'y':0.5};
	GRA.mouseDownPos = {x:-1,y:-1};
	GRA.mouseState = "up";

	GRA.mouseMoved = false;
	GRA.particles = {};

	GRA.boids = [];

	GRA.gameState = {};

	GRA.time = 0;
};

GRA.main = function() {
	GRA.initDefaultValues();
	GRA.startSession();

	requestAnimationFrame(GRA.gameLoop);
};

window.onload = GRA.main;

GRA.startSession = function() {
	GRA.canvas = $(GRA.canvasID)[0];
	GRA.ctx = GRA.canvas.getContext("2d");

	GRA.loadGameState();

	GRA.initNewGameState();

	GRA.resizeToFit();

	GRA.dirtyCanvas = true;
	GRA.initEvents();
};

GRA.gameLoop = function(time) {
	var ctx = GRA.ctx;
	GRA.time = time;

	GRA.frameRenderTime = time - GRA.lastFrameTime;
	
	var m = 5;
	for(var i = 0; i < m; i++) {
		GRA.updateModel(GRA.frameRenderTime/1000/m);
	}

	GRA.drawClear();
	GRA.drawGame();

	requestAnimationFrame(GRA.gameLoop);
};

GRA.startNewGame = function() {
	GRA.initNewGameState();
	GRA.saveGameState();
};

GRA.resetGame = GRA.startNewGame;

GRA.copyBox = function(box) {
	return {
		x: box.x,
		y: box.y,
		w: box.w,
		h: box.h
	};
};

GRA.fitGameBox = function(box,w,h) {

	if(!w || !h) {
		w = GRA.canvas.width;
		h = GRA.canvas.height;
	}

	var scaleX = w/h*box.h/box.w;

	box.x += (1-scaleX)/2*box.w;
	box.w *= scaleX;

	return box;
};

GRA.moveLeft = function() {
	GRA.gameBox.x -= 0.05*GRA.gameBox.w;
};

GRA.moveRight = function() {
	GRA.gameBox.x += 0.05*GRA.gameBox.w;
};

GRA.moveUp = function() {
	GRA.gameBox.y -= 0.05*GRA.gameBox.h;
};

GRA.moveDown = function() {
	GRA.gameBox.y += 0.05*GRA.gameBox.h;
};

GRA.scaleGameBox = function(scaleX, scaleY) {
	GRA.gameBox.x += (1-scaleX)/2*GRA.gameBox.w;
	GRA.gameBox.y += (1-scaleY)/2*GRA.gameBox.h;
	
	GRA.gameBox.w *= scaleX;
	GRA.gameBox.h *= scaleY;
};

GRA.zoomOut = function() {
	GRA.scaleGameBox(1.1,1.1);
};

GRA.zoomIn = function() {
	GRA.scaleGameBox(1/1.1,1/1.1);
};

GRA.mousemove = function(x,y){
	var w = GRA.canvas.width;
	var h = GRA.canvas.height;

	GRA.mousePos = {'x':x,'y':y};

	if(GRA.mouseState == "down") {
		GRA.gameBox.x = GRA.gameBox0.x - (x-GRA.mouseDownPos.x)*GRA.gameBox0.w;
		GRA.gameBox.y = GRA.gameBox0.y - (y-GRA.mouseDownPos.y)*GRA.gameBox0.w;
	}
};

GRA.mousedown = function(x,y) {
	GRA.mousePos = {'x':x,'y':y};
	GRA.mouseDownPos = {'x':x,'y':y};
	GRA.mouseState = "down";
	GRA.mouseMoved = false;

	GRA.gameBox0 = GRA.copyBox(GRA.gameBox);
};

GRA.mouseup = function(x,y) {
	var w = GRA.canvas.width;
	var h = GRA.canvas.height;

	GRA.mousePos = {'x':x,'y':y};
	GRA.mouseState = "up";
};

GRA.resizeToFit = function() {
	var w = $(window).width();
	var h = $(window).height();

	GRA.canvas.width  = w;
	GRA.canvas.height = h;

	GRA.gameBox = GRA.fitGameBox(GRA.gameBox, w, h);
	GRA.dirtyCanvas = true;

	GRA.dirtyInfoBG = true;
	GRA.dirtySelectBG = true;
};

GRA.keydown = function(e) {
	GRA.keyControlDown(e.which);
}

// *** Event binding *** //
GRA.initEvents = function(){
	$(window).resize(function(){
		GRA.resizeToFit();
	});

	$(window).mousemove(function (e) {
		var offset = $(GRA.canvasID).offset();
		var x = e.pageX - offset.left;
		var y = e.pageY - offset.top;

		var w = GRA.canvas.width;
		var h = GRA.canvas.height;

		GRA.mousemove(x/w,y/h);
	});

	$(window).mousedown(function (e) {
		var offset = $(GRA.canvasID).offset();
		var x = e.pageX - offset.left;
		var y = e.pageY - offset.top;

		var w = GRA.canvas.width;
		var h = GRA.canvas.height;

		GRA.mousedown(x/w,y/h);
	});

	$(window).mouseup(function (e) {
		var offset = $(GRA.canvasID).offset();
		var x = e.pageX - offset.left;
		var y = e.pageY - offset.top;

		var w = GRA.canvas.width;
		var h = GRA.canvas.height;
		GRA.mouseup(x/w,y/h);
	});

	$(document).keydown(function (e) {
		GRA.keydown(e);
	});
};

GRA.loadGameState = function(){
	// if (!supports_html5_storage()) { return false; }
	
	// var gameData = localStorage["GRA.gameData"];
	// if(typeof gameData === "string") {
	// 	GRA.gameData = JSON.parse(gameData);
	// }
};

GRA.saveGameState = function() {
	// if (!supports_html5_storage()) { return false; }

	// localStorage["GRA.gameData"] = JSON.stringify(GRA.gameData);
};

// *** LocalStorage Check ***
function supports_html5_storage() {
	try{
		return 'localStorage' in window && window['localStorage'] !== null;
	}catch (e){
		return false;
	}
}

// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
 
// MIT license
 
(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());