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
    	ctx.mouseMoveListener(ctx.canvas2word(x,y),e);
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
    	ctx.mouseClickListener(ctx.canvas2word(x,y),e);  
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


// filename: src/object/arc.js 

Description:

    circle or arc

*/  

/* -- Is it a valid Arc ? -- */
Sm2D.prototype.isValidArc = function(obj) { 
    if (obj===undefined   || obj===null) return false;
    if (!Sm2D.prototype.isValidPoint(obj.center))       return false;
	if (!Sm2D.prototype.isValidNumber(obj.radius))      return false;
	if (!Sm2D.prototype.isValidNumber(obj.startAngle))  return false;
	if (!Sm2D.prototype.isValidNumber(obj.stopAngle))   return false;
    return true;
}

/* -- Shortcut to object constructor -- */
Sm2D.prototype.createArc = function(center, radius, startAngle, stopAngle, tag) {
    if (!Sm2D.prototype.isValidPoint(center))       center = Sm2D.prototype.POINTZERO;
	if (!Sm2D.prototype.isValidNumber(radius))      radius = 10;
	if (!Sm2D.prototype.isValidNumber(startAngle))  startAngle = 0;
	if (!Sm2D.prototype.isValidNumber(stopAngle))   stopAngle = 2*Math.PI;
    var a = new Sm2D.Arc();
	a.center      = center.copy();
	a.radius      = radius;
    a.startAngle  = startAngle;
    a.stopAngle   = stopAngle;
    a.tag         = tag;    
	return a;
}

// ------
   
/* Object Constructor */
Sm2D.Arc = function() { 
    this.center      = null;
	this.radius      = null;
    this.startAngle  = null;
    this.stopAngle   = null;
    this.tag         = null;
};

/* Copy */
Sm2D.Arc.prototype.Copy = function() {
    return Sm2D.prototype.createArc(this.center,this.radius,this.startAngle,this.stopAngle,this.tag); 
}

/* Various properties */
Sm2D.Arc.prototype.start = function() { return Sm2D.prototype.createVectorFromAngle(this.center, this.startAngle, this.radius).end; }
Sm2D.Arc.prototype.end   = function() { return Sm2D.prototype.createVectorFromAngle(this.center, this.stopAngle, this.radius).end; }

/* To String */
Sm2D.Arc.prototype.str  = function(digit) {
    str = "";    
    str += this.center.str(digit) + " R="+Sm2D.prototype.f2str(this.radius,digit);
    str += " from " + Sm2D.prototype.rad2str(this.startAngle,digit) + " to "+ Sm2D.prototype.rad2str(this.stopAngle,digit);
    return str;
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


// filename: src/object/boundingBox.js 

Description:

    BoundingBox

*/  

/* -- Is it a valid BoundingBox ? -- */
Sm2D.prototype.isValidBoundingBox = function(b) { 
    if (obj===undefined   || obj===null) return false;   
    return true;
}

/* -- Shortcut to object constructor -- */
Sm2D.prototype.createBoundingBox = function(tag) {
    var obj = new Sm2D.BoundingBox();
    obj.tag = tag;    
    return obj;
}

// ------

/* Object Constructor */
Sm2D.BoundingBox = function() {
    this.minx = null;
    this.maxx = null;
    this.miny = null;
    this.maxy = null;
    this.tag = null;
}

/* Copy */
Sm2D.BoundingBox.prototype.copy = function() {
    var obj = new Sm2D.BoundingBox();
    obj.minx = this.minx;
    obj.maxx = this.maxx;
    obj.miny = this.miny;
    obj.maxy = this.maxy;
    obj.tag  = this.tag;
}

/* Add Point in bounding box */
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


// filename: src/object/point.js 

Description:

    2D point

*/ 
 
/* -- Is it a valid point ? -- */
Sm2D.prototype.isValidPoint = function(obj) { 
    if (obj===undefined   || obj===null)      return false;
    if (!Sm2D.prototype.isValidNumber(obj.x)) return false;
    if (!Sm2D.prototype.isValidNumber(obj.y)) return false;
    return true;
}

/* -- Shortcut to object constructor -- */
Sm2D.prototype.createPoint = function(x,y,tag) { 
    if (!Sm2D.prototype.isValidNumber(x)) x = 0;
    if (!Sm2D.prototype.isValidNumber(y)) y = 0;
    var obj = new Sm2D.Point();    
    obj.x = x;
    obj.y = y;
    obj.tag = tag;
    return obj;
}

// ------
   
/* Object Constructor */
Sm2D.Point = function() { 
    this.x = null;
    this.y = null;
    this.tag = null;
};

/* Copy */
Sm2D.Point.prototype.copy = function() {
    return Sm2D.prototype.createPoint(this.x,this.y,this.tag);
}

/* Add a vector to a point (translation) */
Sm2D.Point.prototype.add = function(vector) {
   if (!Sm2D.prototype.isValidVector(vector)) console.error("invalid vector");
   return Sm2D.prototype.createPoint(this.x+vector.dx(), this.y+vector.dy());
}

/* To String */
Sm2D.Point.prototype.str = function(digit) {
    var s = "";
    if (this.tag!=null) s+="[" + obj.tag + "] "
    s += "(" + Sm2D.prototype.f2str(this.x,digit) + ", "+Sm2D.prototype.f2str(this.y,digit)+")";
    return s;
}

/* DEFAULT */
Sm2D.prototype.POINTZERO = new Sm2D.prototype.createPoint(0,0);



    

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

// filename: src/object/vector.js 

Description:
    
    2D vector

*/  

/* -- Is it a valid Vector ? -- */
Sm2D.prototype.isValidVector = function(obj) { 
    if (obj===undefined || obj===null)  return false;
    if (!Sm2D.prototype.isValidPoint(obj.start)) return false;
    if (!Sm2D.prototype.isValidPoint(obj.end))   return false;
    return true;
}

/* -- Shortcut to object constructor -- */
Sm2D.prototype.createVector = function(start, end, tag) {
	if (!Sm2D.prototype.isValidPoint(start)) start = Sm2D.prototype.POINTZERO;
	if (!Sm2D.prototype.isValidPoint(end))   end = start;
    var obj = new Sm2D.Vector();
	obj.start = start.copy(); 
	obj.end = end.copy(); 
	obj.tag = tag;
	return obj;
}

/* -- Shortcut to object constructor -- */
Sm2D.prototype.createVectorFromDelta = function(start, dx, dy, tag) {
	var obj = new Sm2D.Vector();
	if (!Sm2D.prototype.isValidPoint(start)) start = Sm2D.prototype.POINTZERO;
	if (!Sm2D.prototype.isValidNumber(dx))   dx = 0;
	if (!Sm2D.prototype.isValidNumber(dx))   dy = 0;
	obj.start = start.copy(); 
	obj.end = Sm2D.prototype.createPoint(start.x + dx, start.y + dy);
	obj.tag = tag;
	return obj;
}

/* -- Shortcut to object constructor -- */
Sm2D.prototype.createVectorFromAngle = function(start, angle, lenght, tag) {
	return Sm2D.prototype.createVectorFromDelta(start, lenght*Math.cos(angle), lenght*Math.sin(angle), tag);
}

// ------

/* Vector definition */
Sm2D.Vector = function() { 
	this.start     = null;
    this.end       = null;
    this.tag       = null;    
}

/* Copy */
Sm2D.Vector.prototype.copy = function() {
    return Sm2D.prototype.createVector(this.start,this.dx,this.dy,this.tag);
} 

/* Various properties */
Sm2D.Vector.prototype.dx        = function() { return this.end.x-this.start.x }
Sm2D.Vector.prototype.dy        = function() { return this.end.y-this.start.y }
Sm2D.Vector.prototype.lenght    = function() { return Math.sqrt(this.dx()*this.dx() + this.dy()*this.dy()); }
Sm2D.Vector.prototype.gradient  = function() { return this.dy() / this.dx(); }
Sm2D.Vector.prototype.angle     = function() { return Math.atan2(this.dy(),this.dx()); }
Sm2D.Vector.prototype.middle    = function() { return this.mult(0.5).end; }

/* Rotate a vector (radian) */
Sm2D.Vector.prototype.rotate = function(angle) { 
    return Sm2D.prototype.createVectorFromAngle(this.start, this.angle()+angle, this.lenght());
}

/* Add a vector to a Vector */
Sm2D.Vector.prototype.add = function(vector) {
    if (!Sm2D.prototype.isValidVector(vector)) console.error("invalid vector");
    return Sm2D.prototype.createVector(this.start, this.end.add(vector))
}

/* Vector multiply by a scalar */
Sm2D.Vector.prototype.mult = function(factor) {
    var v2 = Sm2D.prototype.createPoint(this.start.x+factor*this.dx(), this.start.y+factor*this.dy())
    return Sm2D.prototype.createVector(this.start, v2);
}

/* To String */
Sm2D.Vector.prototype.str  = function(digit) {
    str = "";
    str += "Dx=" + Sm2D.prototype.f2str(this.dx(),digit) + " ";
    str += "Dy=" + Sm2D.prototype.f2str(this.dy(),digit) + ", ";
    str += "g="  + Sm2D.prototype.f2str(this.gradient(),digit) + " ";
    str += "("+ Sm2D.prototype.rad2str(this.angle(),digit)+")";
    return str;
}
    
/* DEFAULT */
Sm2D.prototype.UZERO = new Sm2D.prototype.createVectorFromDelta(null,1,0);
Sm2D.prototype.VZERO = new Sm2D.prototype.createVectorFromDelta(null,0,1);
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


// filename: src/drawing/arc.js 

Description:

    Draw a dot

*/ 
 
Sm2D.prototype.drawArc = function(arc, name, color, details)
{
    if (!this.isValidArc(arc)) console.error("invalid arc");    
	if (name===undefined    || name===null)    name = "R=" + Sm2D.prototype.f2str(arc.radius);
    if (color===undefined   || color===null)   color='#CCC';
	if (details===undefined || details===null) details=false;

	var pc = arc.center;
	var p1 = arc.start();
	var p2 = arc.end();

	this.containBox.add(p1);
	this.containBox.add(p2);

	// center
	this.d.beginPath();
    this.drawLine(this.createPoint(pc.x-this.width()/100,pc.y),   this.createPoint(pc.x+this.width()/100,pc.y));
    this.drawLine(this.createPoint(pc.x, pc.y-this.height()/100), this.createPoint(pc.x, pc.y+this.height()/100));
    this.d.lineWidth = 0.5;
    this.d.strokeStyle = color;
    this.d.stroke();
    this.d.beginPath();

    // arc
	this.d.beginPath();
	this.d.strokeStyle = color;
	this.d.lineWidth = 2;
	var a1 = arc.startAngle % (2*Math.PI);
	var a2 = arc.stopAngle % (2*Math.PI);
	if (a1<0)  a1 += (2*Math.PI);
	if (a2<=0) a2 += (2*Math.PI);
	var first = false;
	for (t=a1; t<a2; t=t+0.001) {
		var v = this.createVectorFromAngle(arc.center, t, arc.radius);
		if (first) {
			this.moveTo(v.start);			
			first = false;
		} else {
			ctx.drawLineTo(v.end);
		}
	}
	this.d.stroke();	

	if (details) {
    	
    	this.drawPoint(p1," ",color); 
    	this.drawPoint(p2," ",color); 
    	
    	var a1 = arc.startAngle % (2*Math.PI);
		var a2 = arc.stopAngle % (2*Math.PI);
		if (a1!=a2) {
			this.d.beginPath();
			this.d.strokeStyle = color;
			this.d.lineWidth = 0.5;
			this.drawLine(p1,pc);
			this.drawLine(p2,pc);
			this.d.stroke();	
		}
    }

	var pt2 = this.word2canvas(pc);
	this.d.beginPath();	
	this.d.fillStyle = color;
	this.d.fillText(name,pt2.x+7,pt2.y-7); 
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


// filename: src/drawing/axes.js 

Description:

    Draw a Axes

*/ 
 
Sm2D.prototype.drawYaxis= function(y, styleLenght, styleWidth)  {
	if (!Sm2D.prototype.isValidNumber(styleLenght)) styleLenght = this.width();
	if (!Sm2D.prototype.isValidNumber(styleWidth))  styleWidth = 1;
	this.d.beginPath();
	this.drawLine(this.createPoint(-styleLenght,y),this.createPoint(styleLenght,y));
	this.d.lineWidth = styleWidth;
	this.d.strokeStyle = '#555';
	this.d.stroke();
}

Sm2D.prototype.drawXaxis= function(x, styleLenght, styleWidth)  {
	if (!Sm2D.prototype.isValidNumber(styleLenght)) styleLenght = this.height();
	if (!Sm2D.prototype.isValidNumber(styleWidth))  styleWidth = 1;  
	this.d.beginPath();
	this.drawLine(this.createPoint(x,-styleLenght),this.createPoint(x,styleLenght));
	this.d.lineWidth = styleWidth;
	this.d.strokeStyle = '#555';
	this.d.stroke();
}

Sm2D.prototype.drawXmark= function(s) { 
	for(x=0;x<this.MAXX;x+=s) this.drawXaxis(x,this.height()/100,1);
	for(x=0;x>this.MINX;x-=s) this.drawXaxis(x,this.height()/100,1);
}

Sm2D.prototype.drawYmark= function(s) { 
	for(y=0;y<this.MAXY;y+=s) this.drawYaxis(y,this.width()/100,1);
	for(y=0;y>this.MINY;y-=s) this.drawYaxis(y,this.width()/100,1);
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


// filename: src/drawing/line.js 

Description:

    Draw a line

*/ 
 
/* Basic line */
Sm2D.prototype.drawLineTo = function(pt) {
    if (!this.isValidPoint(pt)) console.error("invalid point");
    var pt2 = this.word2canvas(pt);
    this.d.lineTo(pt2.x,pt2.y);
}

/* Basic line */
Sm2D.prototype.drawLine   = function(pt1,pt2) {
    if (!this.isValidPoint(pt1)) console.error("invalid point pt1");
    if (!this.isValidPoint(pt2)) console.error("invalid point pt2");
    this.moveTo(pt1);
    this.drawLineTo(pt2);
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


// filename: src/drawing/point.js 

Description:

    Draw a dot

*/  
 
Sm2D.prototype.drawPoint = function(pt, name, color, details)
{
    if (!this.isValidPoint(pt)) console.error("invalid point");    
    if (name===undefined     || name===null)    name="("+Sm2D.prototype.f2str(pt.x)+", "+Sm2D.prototype.f2str(pt.y)+")";
    if (color===undefined    || color===null)   color='#CCC';
    if (details===undefined  || details===null) details=false;

	this.containBox.add(pt);

    this.d.beginPath();
    this.drawLine(this.createPoint(pt.x-this.width()/100,pt.y),   this.createPoint(pt.x+this.width()/100,pt.y));
    this.drawLine(this.createPoint(pt.x, pt.y-this.height()/100), this.createPoint(pt.x, pt.y+this.height()/100));
    this.d.lineWidth = 1;
    this.d.strokeStyle = color;
    this.d.stroke();
   
    var pt2 = this.word2canvas(pt);

    if (details) {
	    this.d.beginPath();
		this.d.arc(pt2.x,pt2.y, 2, 0, 2*Math.PI);
		this.d.fillStyle = color;
		this.d.fill();
		this.d.stroke(); 
	}

    this.d.fillStyle = color;
    this.d.font = "12px Arial";
    this.d.fillText(name,pt2.x+7,pt2.y-7);
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


// filename: src/drawing/ray.js 

Description:

    Draw a ray

*/ 
 
Sm2D.prototype.drawRay = function(vector, name, color, details)
{
    if (!this.isValidVector(vector)) console.error("invalid vector");    
	if (name===undefined     || name===null)    name="("+Sm2D.prototype.f2str(vector.dx())+", "+Sm2D.prototype.f2str(vector.dy())+")";
    if (color===undefined    || color===null)   color='#CCC';
	if (details===undefined  || details===null) details=false;

    var p1 = vector.start;
    var p2 = vector.end;
    var p3 = this.createVectorFromAngle(p2,vector.angle()+9*Math.PI/10, this.width()/50).end;
    var p4 = this.createVectorFromAngle(p2,vector.angle()-9*Math.PI/10, this.width()/50).end;
    var p5 = vector.middle();

	this.containBox.add(p1);
	this.containBox.add(p2);
        
    this.d.beginPath();
    this.d.lineWidth = 0.5;
    this.drawLine(p1,p2);
    this.d.strokeStyle = color;
    this.d.stroke();

    this.d.beginPath();
    this.d.lineWidth = 0.5;    
    this.moveTo(p3);
    this.drawLineTo(p4);
    this.drawLineTo(p2);
    this.drawLineTo(p3);    
    this.d.fillStyle = color;
    this.d.fill();
    this.d.stroke();
    this.d.fillStyle = color;
    this.d.font = "12px Arial";
    
	var pt2 = this.word2canvas(p5);
	this.d.fillText(name,pt2.x+7,pt2.y-7); 
	if (details) {
		this.drawPoint(p1," ",color); 
	}
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


// filename: src/ui/controlPanel.js 

Description:

    add ControlPanel

*/ 
 
/* Add a control panel */
Sm2D.prototype.addControlPanel = function (id)
{  
    var ctx = this;
	var controlPanel = document.getElementById(id);
	if (!controlPanel) { console.error("Invalid ControlPanel!"); return null; }
	var dragBtn = document.createElement('i');
	dragBtn.className  = "fa fa-arrows-alt btn";
	controlPanel.insertBefore(dragBtn, controlPanel.firstChild);
	
	ctx.draggingNode = null;
	ctx.draggingPos  = null;

	dragBtn.addEventListener('mousedown', function (e) { 
		ctx.draggingNode = this;
		ctx.draggingPos = {x: e.x - parseInt(ctx.draggingNode.parentNode.style.left,10), y: e.y - parseInt(ctx.draggingNode.parentNode.style.top,10) }
	},false);

	document.addEventListener('mouseup', function (e) { 
		ctx.draggingNode = null;
	},false);

	document.addEventListener('mousemove', function (e) { 
		if(ctx.draggingNode==null) return;
		e=e || window.event;
		if(e.stopPropagation) e.stopPropagation();
	    if(e.preventDefault) e.preventDefault();
	    e.cancelBubble=true;
	    e.returnValue=false;
	    ctx.draggingNode.parentNode.style.top = e.y - ctx.draggingPos.y;
	    ctx.draggingNode.parentNode.style.left = e.x - ctx.draggingPos.x;
	},false);
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


// filename: src/ui/log - Copy.js 

Description:

    Log and strings

*/ 
 
/* Attach Log textarea */
Sm2D.prototype.attachLog = function (id) {  
    this.clog  = (id)?document.getElementById(id):null;
}

/* Basic log method, to get print information on screen */
Sm2D.prototype.log = function (str)
{
	console.log(str);
	if (!this.clog) return;
	this.clog.value += str+"\n"; 
	this.clog.scrollTop = this.clog.scrollHeight;
}
  
/* Basic log method, to get print information on screen */
Sm2D.prototype.clearLog = function ()
{
	if (!this.clog) return;
	clog.value = "";
}

// ----

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


// filename: src/ui/log.js 

Description:

    Log and strings

*/ 
 
/* Attach Log textarea */
Sm2D.prototype.attachLog = function (id) {  
    this.clog  = (id)?document.getElementById(id):null;
}

/* Basic log method, to get print information on screen */
Sm2D.prototype.log = function (str)
{
	console.log(str);
	if (!this.clog) return;
	this.clog.value += str+"\n"; 
	this.clog.scrollTop = this.clog.scrollHeight;
}
  
/* Basic log method, to get print information on screen */
Sm2D.prototype.clearLog = function ()
{
	if (!this.clog) return;
	this.clog.value = "";
}

// ----

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
//# sourceMappingURL=sm2d.js.map