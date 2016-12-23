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