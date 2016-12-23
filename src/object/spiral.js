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





    
