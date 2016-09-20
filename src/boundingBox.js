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
