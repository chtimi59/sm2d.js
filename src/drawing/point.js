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