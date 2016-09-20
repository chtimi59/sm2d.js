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

	2D point

*/  


/* constructor */
Sm2D.Point = function(x,y) {
	this.x = (x===undefined || x===null)?0:x;
	this.y = (x===undefined || y===null)?0:y;
}

	
/* Point definition */
Sm2D.prototype.Point { 
    x:    null,
    y:    null,
    tag:  null,
    copy: function() { return Sm2D.prototype.createPoint(this.x,this.y,this.tag); } 
}

Sm2D.prototype.createPoint = function(x,y,tag) { 
	var p = new Sm2D.prototype.Point();
	if (x===undefined || x===null) x = 0;
	if (y===undefined || y===null) y = 0;
	p.x = x; p.y = y; p.tag = tag;
	return p;
}

/* To String */
Sm2D.Point.prototype.str = function(digit) {
    var s = "";
    if ((this.minx==null)||(this.maxx==null)||(this.miny==null)||(this.maxy==null)) return "empty";
    s += "(" + Sm2D.prototype.f2str(this.minx,digit) + ", "+Sm2D.prototype.f2str(this.miny,digit)+")";
    s += "-";
    s += "(" + Sm2D.prototype.f2str(this.maxx,digit) + ", "+Sm2D.prototype.f2str(this.maxy,digit)+")";
    return s;
}

/* DEFAULT */
Sm2D.prototype.POINTZERO = new Sm2D.prototype.createPoint(0,0);


Sm2D.Point.prototype.add(vector) {
   return Sm2D.prototype.createPoint(this.x+vector.dx(), this.y+vector.dy());
}
    
