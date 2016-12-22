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

    2D point

*/ 
 
/* -- Is it a valid point ? -- */
Sm2D.prototype.isValidPoint = function(obj) { 
    if (obj===undefined   || obj===null) return false;
    if (obj.x===undefined || obj===null) return false;
    if (obj.y===undefined || obj===null) return false;
    return true;
}

/* -- Shortcut to object constructor -- */
Sm2D.prototype.createPoint = function(x,y,tag) { 
    var obj = new Sm2D.Point();    
    if (x===undefined || x===null) x = 0;
    if (y===undefined || y===null) y = 0;
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
    var obj = new Sm2D.Point();
    obj.x = this.x;
    obj.y = this.y;
    obj.tag = this.tag;
    return obj;
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



    
