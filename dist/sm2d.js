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
	//this.clog   = (logId)?document.getElementById(logId):null;
	this.canvas = document.getElementById(canvasId);
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
	//this.containBox = new this.boundingBox();
	//this.xaxis(0); this.yaxis(0);	
	//this.xmark(1); this.ymark(1);
	if (this.clog) this.clog.value = "";
}


Sm2D.prototype.width  = function () { return this.MAXX-this.MINX; }
Sm2D.prototype.height = function () { return this.MAXY-this.MINY; }
Sm2D.prototype.scalex = function () { return this.canvas.width/this.width(); }
Sm2D.prototype.scaley = function () { return this.canvas.height/this.height(); }

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

	BoundingBox

*/  

/* constructor */
Sm2D.BoundingBox = function() {
	this.minx = null;
	this.maxx = null;
	this.miny = null;
	this.maxy = null;
}

Sm2D.BoundingBox.prototype.add  = function(point) { 
    this.minx = (this.minx==null)?point.x:Math.min(this.minx,point.x);
    this.maxx = (this.maxx==null)?point.x:Math.max(this.maxx,point.x);
    this.miny = (this.miny==null)?point.y:Math.min(this.miny,point.y);
    this.maxy = (this.maxy==null)?point.y:Math.max(this.maxy,point.y);
}

/* To String */
Sm2D.BoundingBox.prototype.str = function(digit) {
    var s = "";
    if ((this.minx==null)||(this.maxx==null)||(this.miny==null)||(this.maxy==null)) return "empty";
    s += "(" + Sm2D.prototype.f2str(this.minx,digit) + ", "+Sm2D.prototype.f2str(this.miny,digit)+")";
    s += "-";
    s += "(" + Sm2D.prototype.f2str(this.maxx,digit) + ", "+Sm2D.prototype.f2str(this.maxy,digit)+")";
    return s;
}
