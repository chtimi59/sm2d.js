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



    
