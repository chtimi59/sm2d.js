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

