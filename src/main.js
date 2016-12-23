/** 
    Copyright 2016 Jan d'Orgeville

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.


Description:
    
    SimpleMath2D, Sm2D for short is a poor 2D library to draw points, vectors...
    jdorgeville[at]gmail.com

*/  


/** Main Constructor 
    minx, maxx, miny  are optional
*/
function Sm2D(canvasId, minx, maxx, miny, maxy)
{
    var ctx = this;

    /* attach context */
    this.canvas = document.getElementById(canvasId);
    this.clog = null;
    if (!this.canvas) { console.error("Invalid canvas!"); return null; }
    this.d = this.canvas.getContext("2d");
    if (!this.canvas) { console.error("Invalid canvas!"); return null; }    

    /* mouse listener */
	this.mouseMoveListener = null;
	this.mouseClickListener = null;
    
	this.canvas.addEventListener('mousemove', function (e) { 
		if (!ctx.mouseMoveListener) return;
		var rect = this.getBoundingClientRect();
    	var x = e.clientX - rect.left;          
    	var y = e.clientY - rect.top;    
		e=e || window.event;
		if(e.stopPropagation) e.stopPropagation();
	    if(e.preventDefault) e.preventDefault();
	    e.cancelBubble=true;
	    e.returnValue=false;
    	ctx.mouseMoveListener(ctx.canvas2word(ctx.createPoint(x,y)),e);
    	return false;      
	}, false);
    
	this.canvas.addEventListener('mousedown', function (e) { 
		if (!ctx.mouseClickListener) return;
		var rect = this.getBoundingClientRect();
    	var x = e.clientX - rect.left;          
    	var y = e.clientY - rect.top;        	
    	e=e || window.event;
		if(e.stopPropagation) e.stopPropagation();
	    if(e.preventDefault) e.preventDefault();
	    e.cancelBubble=true;
	    e.returnValue=false;
    	ctx.mouseClickListener(ctx.canvas2word(ctx.createPoint(x,y)),e);  
    	return false;     	
	}, false);
    
    /* set default value */
    this.MINX = (!this.isValidNumber(minx))?-10:minx;
    this.MAXX = (!this.isValidNumber(maxx))?+10:maxx;
    this.MINY = (!this.isValidNumber(miny))?-10:miny;    
    this.MAXY = (!this.isValidNumber(maxy))?+10:maxy;    
    this.clear(minx, maxx, miny, maxy);
}

  
/* Clear and Scale screen (square) */
Sm2D.prototype.clear = function (minx, maxx, miny, maxy)
{  
    this.MINX = (!this.isValidNumber(minx))?this.MINX:minx;
    this.MAXX = (!this.isValidNumber(maxx))?this.MAXX:maxx;
    this.MINY = (!this.isValidNumber(miny))?this.MINY:miny;
    this.MAXY = (!this.isValidNumber(maxy))?this.MAXY:maxy;
    if (this.MAXX<this.MINX) { var tmp = this.MINX; this.MINX = this.MAXX; this.MAXX = tmp;  }    
    if (this.MAXY<this.MINY) { var tmp = this.MINY; this.MINY = this.MAXY; this.MAXY = tmp;  }

    this.d.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.containBox = new this.createBoundingBox();
    this.drawXaxis(0); this.drawYaxis(0);    
    this.drawXmark(1); this.drawYmark(1);
    this.clearLog();
}

Sm2D.prototype.width  = function () { return this.MAXX-this.MINX; }
Sm2D.prototype.height = function () { return this.MAXY-this.MINY; }
Sm2D.prototype.scalex = function () { return this.canvas.width/this.width(); }
Sm2D.prototype.scaley = function () { return this.canvas.height/this.height(); }

/* Convert a canvas coordinate to a point */
Sm2D.prototype.canvas2word = function(pt) {
	return this.createPoint(pt.x/this.scalex() + this.MINX , (this.canvas.height - pt.y)/this.scaley() + this.MINY);
}

/* Convert a point in canvas coordinate point*/
Sm2D.prototype.word2canvas = function(pt) {
	var pt2 = pt.copy();
	pt2.x = this.scalex()*(pt.x - this.MINX);
	pt2.y = this.canvas.height - this.scaley()*(pt.y - this.MINY);
	return pt2;
}

/* Move To a point */
Sm2D.prototype.moveTo = function(pt) {
    if (!this.isValidPoint(pt)) console.error("invalid point");
    var pt2 = this.word2canvas(pt);
    this.d.moveTo(pt2.x,pt2.y);
}

/* Is it a valid Number ?*/
Sm2D.prototype.isValidNumber = function(obj) { 
    if (obj===undefined) return false;
    if (obj===null) return false;    
    return !isNaN(obj);
}





