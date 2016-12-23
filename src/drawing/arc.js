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