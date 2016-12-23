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

