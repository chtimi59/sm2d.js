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
    this.clearLog();
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


// filename: src/object/boundingBox - Copy.js 

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


// filename: src/object/nurbs.js 

Description:

    nurbs

*/ 
 
/* -- Is it a valid point ? -- */
Sm2D.prototype.isValidNURBS = function(obj) { 
    if (obj===undefined   || obj===null)      return false;
    return true;
}

/* -- Shortcut to object constructor -- */
Sm2D.prototype.createNURBS = function(controlsPoint,weight,tag) { 
    var obj = new Sm2D.NURBS();    
    obj.p = controlsPoint;
    obj.w = weight;
    obj.tag = tag;
    return obj;
}

// ------
   
/* Object Constructor */
Sm2D.NURBS = function() { 
    this.p = null;
    this.w = null;
    this.tag = null;
};

/* Copy */
Sm2D.NURBS.prototype.copy = function() {
    return Sm2D.prototype.createPoint(this.p,this.w,this.tag);
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


// filename: src/object/point - Copy.js 

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


// filename: src/object/spiral.js 

Description:

    Spiral

*/ 
 
/* -- Is it a valid Spiral ? -- */
Sm2D.prototype.isValidSpiral = function(obj) { 
    if (obj===undefined   || obj===null)                return false;
    if (!Sm2D.prototype.isValidVector(obj.entryVector)) return false;
    if (!Sm2D.prototype.isValidNumber(obj.A))           return false;
    if (!Sm2D.prototype.isValidNumber(obj.L1))          return false;
    if (!Sm2D.prototype.isValidNumber(obj.L2))          return false;
    if (obj.isCCW===undefined || obj.isCCW===null)      return false;
    return true;
}

/* -- Shortcut to object constructor -- */
Sm2D.prototype.createSpiral = function(A, L1, L2, isCCW, entryVector, tag) { 
    if (!Sm2D.prototype.isValidVector(entryVector)) entryVector = Sm2D.prototype.UZERO;
    if (!Sm2D.prototype.isValidNumber(A))  A = 5;
    if (!Sm2D.prototype.isValidNumber(L1)) L1 = 5;
    if (!Sm2D.prototype.isValidNumber(L2)) L2 = 10;
    if (isCCW===undefined || isCCW===null) isCCW = true;
    
    entryVector.normalize();
    
    var obj = new Sm2D.Spiral();    
    obj.entryVector = entryVector.copy(); 
    obj.A = A;
    obj.L1 = L1;
    obj.L2 = L2;
    obj.isCCW = isCCW;
    obj.tag = tag;
    return obj;
}

/* -- Shortcut to object constructor -- */
Sm2D.prototype.createSpiralFromRadius = function(lenght, startRadius, isCCW, isEntry, A, entryVector) {
    var startL;
    if (isEntry) {
      startL = 0;
      if (startRadius!=null) startL = A*A / startRadius;
    } else {
      startL = -lenght;
      if (startRadius!=null) startL = -A*A / startRadius;
      isCCW = !isCCW;
    }    
    stopL  = startL+lenght;
    return Sm2D.prototype.createSpiral(A, startL, stopL, isCCW, entryVector);
}


// ------
   
/* Object Constructor */
Sm2D.Spiral = function() { 
    this.entryVector = null;
    this.A     = null;
    this.L1    = null;
    this.L2    = null;
    this.isCCW = null;
    this.tag   = null;
};

/* Copy */
Sm2D.Spiral.prototype.copy = function() {
    return Sm2D.prototype.createSpiral(this.entryVector,this.A,this.L1,this.L2,this.isCCW,this.tag);
}

/* Various properties */
Sm2D.Spiral.prototype.a  = function() { return this.A*Math.sqrt(2); }
Sm2D.Spiral.prototype.l1 = function() { return this.L1/this.a(); }
Sm2D.Spiral.prototype.l2 = function() { return this.L2/this.a(); }
Sm2D.Spiral.prototype.angleIn   = function() { return this.entryVector.angle() + (this.L1*this.L1)/(this.a()*this.a()); }
Sm2D.Spiral.prototype.radiusIn  = function() { return (this.L1!=0)?this.A*this.A/this.L1:Infinity; }
Sm2D.Spiral.prototype.angleOut  = function() { return this.entryVector.angle() + (this.L2*this.L2)/(this.a()*this.a()); }
Sm2D.Spiral.prototype.radiusOut = function() { return (this.L2!=0)?this.A*this.A/this.L2:Infinity; }
  

/* To String */
Sm2D.Spiral.prototype.str = function(digit) {
    var s = "";  
    s += "Radius(" + Sm2D.prototype.f2str(this.radiusIn(),digit) + " -> " + Sm2D.prototype.f2str(this.radiusOut(),digit) + "), ";
    s += "Angle(" + Sm2D.prototype.rad2str(this.angleIn(),digit) + " -> " + Sm2D.prototype.rad2str(this.angleOut(),digit) + ")";
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


// filename: src/object/transform.js 

Description:

    Transform operation

*/  

/* Convert a local point in OIJ coordinate to world coordinate */
Sm2D.prototype.local2world = function(o,i,j, localPt) {
    if (!this.isValidPoint(o))  console.error("invalid point O");    
    if (!this.isValidVector(i)) console.error("invalid vector I");    
    if (!this.isValidVector(j)) console.error("invalid vector J");    
    if (!this.isValidPoint(localPt))  console.error("invalid point localPt");   
    
	var pt = Sm2D.prototype.createPoint(o.x + localPt.x * i.dx() + localPt.y * j.dx(), o.y + localPt.x*i.dy() + localPt.y * j.dy());
	return pt;	
}

/* Convert a local point from a Cartesian Coordinate System to world coordinate */
Sm2D.prototype.localCCS2world = function(vector, localPt) {
    if (!this.isValidVector(vector)) console.error("invalid CCS vector");    
    if (!this.isValidPoint(localPt))  console.error("invalid point localPt");
    
	var o = vector.start;
	var i = vector;
	var j = vector.rotate(Math.PI/2);
	return this.local2world(o,i,j,localPt);
}


/* Convert a world point coordinate to local (in Cartesian Coordinate System) */
Sm2D.prototype.world2local = function(o,i,j, worldPt) {
    if (!this.isValidPoint(o))  console.error("invalid point O");    
    if (!this.isValidVector(i)) console.error("invalid vector I");    
    if (!this.isValidVector(j)) console.error("invalid vector J");    
    if (!this.isValidPoint(worldPt))  console.error("invalid point worldPt");  
    
	// invert matrix
	var det =  i.dx() * j.dy() - i.dy() * j.dx();
	var du = Sm2D.prototype.createPoint(+j.dy()/det,-i.dy()/det);
	var dv = Sm2D.prototype.createPoint(-j.dx()/det,+i.dx()/det);
	var O  = Sm2D.prototype.createPoint(-o.x*du.x-o.y*dv.x,-o.x*du.y-o.y*dv.y);
	var u = Sm2D.prototype.createVectorFromDelta(O,du.x,du.y);
	var v = Sm2D.prototype.createVectorFromDelta(O,dv.x,dv.y);
	return this.local2world(O,u,v, worldPt);
}

/* Convert a world point coordinate to local (in Cartesian Coordinate System) */
Sm2D.prototype.world2localCCS = function(vector, worldPt) {
    if (!this.isValidVector(vector)) console.error("invalid CCS vector");    
    if (!this.isValidPoint(worldPt)) console.error("invalid point worldPt");
  
	var o = vector.start;
	var i = vector;
	var j = vector.rotate(Math.PI/2);
	return this.world2local(o,i,j,worldPt);
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
    return Sm2D.prototype.createVector(this.start,this.end,this.tag);
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

/* Vector Normalize */
Sm2D.Vector.prototype.normalize = function() {
    var l = this.lenght();
    if (l==0) console.error("Could not normalize null vector");
    this.end = Sm2D.prototype.createPoint(this.start.x+this.dx()/l, this.start.y+this.dy()/l);
}

/* Vector change Lenght */
Sm2D.Vector.prototype.setLenght = function(lenght) {
    this.normalize();
    this.end = Sm2D.prototype.createPoint(this.start.x+this.dx()*lenght, this.start.y+this.dy()*lenght);
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
    if (a2<a1) a2 += (2*Math.PI);
	var first = false;
	for (t=a1; t<a2; t=t+0.001) {
		var v = this.createVectorFromAngle(arc.center, t, arc.radius);
		if (first) {
			this.moveTo(v.start);			
			first = false;
		} else {
			this.drawLineTo(v.end);
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


// filename: src/drawing/nurbs.js 

Description:

    Draw a nurbs

*/  
 
Sm2D.prototype.drawNURBS = function(nurbs, name, color, details)
{
    if (!this.isValidNURBS(nurbs)) console.error("invalid nurbs");    
    if (name===undefined     || name===null)    name="";
    if (color===undefined    || color===null)   color='#CCC';
    if (details===undefined  || details===null) details=false;
    
    this.d.beginPath();
    this.d.lineWidth = 0.5;
    this.d.strokeStyle = color;
    for(t=0;t<1;t=t+0.001) {
        var x=0;
        var y=0;
        var w=0;
        for(i=0;i<4;i++) {
            var Bernstein = 0;
            switch(i) {
                case 0: Bernstein += 1*Math.pow(t,0)*Math.pow(1-t,3); break;
                case 1: Bernstein += 3*Math.pow(t,1)*Math.pow(1-t,2); break;
                case 2: Bernstein += 3*Math.pow(t,2)*Math.pow(1-t,1); break;
                case 3: Bernstein += 1*Math.pow(t,3)*Math.pow(1-t,0); break;
            }
            x += Bernstein * nurbs.w[i] * nurbs.p[i].x;
            y += Bernstein * nurbs.w[i] * nurbs.p[i].y;
            w += Bernstein * nurbs.w[i];
        }
        var p = this.createPoint(x/w,y/w);
        this.drawLineTo(p);
    }
    this.d.stroke();
    
    this.d.beginPath();
    this.d.lineWidth = 0.25;
    this.d.strokeStyle = '#CCC';
    this.d.setLineDash([5, 3]);
    for(i=1;i<4;i++) this.drawLine(nurbs.p[i-1], nurbs.p[i]);
    this.d.stroke();
    this.d.setLineDash([]);    
    
    for(i=0;i<4;i++) this.drawPoint(nurbs.p[i],"P"+i+"("+nurbs.w[i]+")");
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


// filename: src/drawing/point - Copy.js 

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


// filename: src/drawing/ray - Copy.js 

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


// filename: src/drawing/spiral.js 

Description:

    Draw a spiral

*/ 
 
Sm2D.prototype.drawSpiral = function(spiral, name, color, details)
{    
    if (!this.isValidSpiral(spiral)) console.error("invalid spiral");    
    if (name===undefined    || name===null)    name="";
    if (color===undefined   || color===null)   color='#CCC';
    if (details===undefined || details===null) details=false;
    
    // for test and UI
    var testLenght = 0;
    var firstDelta = null;
    var lastDelta = null;
    
    this.d.beginPath();
    this.d.lineWidth = 3;
    this.d.strokeStyle = color;

    var a = spiral.a();
    var l1 = spiral.l1();
    var l2 = spiral.l2();
        
    var dS = this.createVectorFromDelta(Sm2D.prototype.POINTZERO,0,0);
    var ds = Math.abs(l2-l1)/10000; // 10000 steps
    var dx, dy;
    var s=l1;
    var signe = ((spiral.isCCW)?1:-1);
    while (s<l2)
    { 
       dx = a * Math.cos(s*s) * ds;
       dy = signe * a * Math.sin(s*s) * ds;
       dS = this.createVectorFromDelta(dS.end, dx, dy);

       s += ds;       

       // for test and UI
       testLenght += dS.lenght();
       if (!firstDelta) firstDelta = dS.copy();
       lastDelta= dS.copy();
              
       var worldPt = this.localCCS2world(spiral.entryVector, dS.end);       
	     this.drawLineTo(worldPt);
    }
    this.d.stroke();
    
    if (details)
    {                
        var inRadius     = spiral.radiusIn();
        var inStrRadius  = this.f2str(inRadius);
        var outRadius    = spiral.radiusOut();
        var outStrRadius = this.f2str(outRadius);        
        var inAngle  = spiral.angleIn();
        var outAngle = spiral.angleOut();

        var firstDeltaWorld = ctx.createVector(
            this.localCCS2world(spiral.entryVector, firstDelta.start),       
            this.localCCS2world(spiral.entryVector, firstDelta.end)
        );
        
        var lastDeltaWorld = ctx.createVector(
            this.localCCS2world(spiral.entryVector, lastDelta.start),       
            this.localCCS2world(spiral.entryVector, lastDelta.end)
        );
        
        firstDeltaWorld.setLenght(3);
        this.drawRay(firstDeltaWorld, "input (R="+inStrRadius+")", "#F88", true);

        lastDeltaWorld.setLenght(3);
        this.drawRay(lastDeltaWorld, "output (R="+outStrRadius+")", "#88E", true);
    
        if (inRadius!=Infinity) { 
            firstDeltaWorld.setLenght(Math.abs(inRadius));  
            firstDeltaWorld = firstDeltaWorld.rotate(((inRadius<0)?-1:1) * signe * Math.PI/2);      
            this.drawArc(this.createArc(firstDeltaWorld.end, firstDeltaWorld.lenght()),null,"#755");
        };
        
        if (outRadius!=Infinity) { 
            lastDeltaWorld.setLenght(Math.abs(outRadius));  
            lastDeltaWorld = lastDeltaWorld.rotate(((outRadius<0)?-1:1) * signe * Math.PI/2);
            this.drawArc(this.createArc(lastDeltaWorld.end, lastDeltaWorld.lenght()),null,"#557");
        };
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