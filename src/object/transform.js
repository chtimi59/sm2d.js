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
	return local2world(o,i,j,localPt);
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
	return world2local(o,i,j,worldPt);
}