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

    /* set default value */
    this.MINX = (minx===undefined || minx===null)?-10:minx;
    this.MAXX = (maxx===undefined || maxx===null)?+10:maxx;
    this.MINY = (miny===undefined || miny===null)?-10:miny;    
    this.MAXY = (maxy===undefined || maxy===null)?+10:maxy;    
    this.clear(minx, maxx, miny, maxy);
}

/* attach Log textarea */
Sm2D.prototype.attachLog = function (id) {  
    this.clog  = (id)?document.getElementById(id):null;
}

/* Basic log method, to get information on screen */
Sm2D.prototype.log = function (str)
{
	console.log(str);
	if (!this.clog) return;
	this.clog.value += str+"\n"; 
	this.clog.scrollTop = this.clog.scrollHeight;
}
    
/* Clear and Scale screen (square) */
Sm2D.prototype.clear = function (minx, maxx, miny, maxy)
{  
    this.MINX = (minx===undefined || minx===null)?this.MINX:minx;
    this.MAXX = (maxx===undefined || maxx===null)?this.MAXX:maxx;
    this.MINY = (miny===undefined || miny===null)?this.MINY:miny;
    this.MAXY = (maxy===undefined || maxy===null)?this.MAXY:maxy;
    if (this.MAXX<this.MINX) { var tmp = this.MINX; this.MINX = this.MAXX; this.MAXX = tmp;  }    
    if (this.MAXY<this.MINY) { var tmp = this.MINY; this.MINY = this.MAXY; this.MAXY = tmp;  }

    this.d.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.containBox = new this.createBoundingBox();
    this.xaxis(0); this.yaxis(0);    
    this.xmark(1); this.ymark(1);
    if (this.clog) this.clog.value = "";
}


Sm2D.prototype.width  = function () { return this.MAXX-this.MINX; }
Sm2D.prototype.height = function () { return this.MAXY-this.MINY; }
Sm2D.prototype.scalex = function () { return this.canvas.width/this.width(); }
Sm2D.prototype.scaley = function () { return this.canvas.height/this.height(); }

/* Convert a canvas coordinate to a point */
Sm2D.prototype.canvas2word = function(pt) {
	return this.createPoint(pt.x/this.scalex() + this.MINX , (this.canvas.height - pt.y)/this.scaley() + this.MINY);
}

/* Move To a point */
Sm2D.prototype.moveTo = function(pt) {
    if (!this.isValidPoint(pt)) console.error("invalid point");
    var pt2 = this.word2canvas(pt);
    this.d.moveTo(pt2.x,pt2.y);
}

/* Basic line */
Sm2D.prototype.lineTo = function(pt) {
    if (!this.isValidPoint(pt)) console.error("invalid point");
    var pt2 = this.word2canvas(pt);
    this.d.lineTo(pt2.x,pt2.y);
}

/* Basic line */
Sm2D.prototype.line   = function(a,b) {
    if (!this.isValidPoint(a)) console.error("invalid point A");
    if (!this.isValidPoint(b)) console.error("invalid point B");
    this.moveTo(a);
    this.lineTo(b);
}

/* Convert a point in canvas coordinate point*/
Sm2D.prototype.word2canvas = function(pt) {
	var pt2 = pt.copy();
	pt2.x = this.scalex()*(pt.x - this.MINX);
	pt2.y = this.canvas.height - this.scaley()*(pt.y - this.MINY);
	return pt2;
}



/* Convert float to string  */
Sm2D.prototype.f2str = function (f,digit) {
    if (digit===undefined) digit = 1;
    var p = Math.pow(10,digit);
    return parseFloat(Math.round(f*p)/p).toFixed(digit);
}

/* Convert radian angle to degree string  */
Sm2D.prototype.rad2str = function (a,digit) {
    var deg = a*180/Math.PI;
    return Sm2D.prototype.f2str(deg,digit) + "\u00B0";
}



