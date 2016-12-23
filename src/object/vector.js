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

// filename: @@__SOURCE_FILE__ 

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