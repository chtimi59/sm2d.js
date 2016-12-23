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

    Draw a Axes

*/ 
 
Sm2D.prototype.drawYaxis= function(y, styleLenght, styleWidth)  {
	if (!Sm2D.prototype.isValidNumber(styleLenght)) styleLenght = this.width();
	if (!Sm2D.prototype.isValidNumber(styleWidth))  styleWidth = 1;
	this.d.beginPath();
	this.drawLine(this.createPoint(-styleLenght,y),this.createPoint(styleLenght,y));
	this.d.lineWidth = styleWidth;
	this.d.strokeStyle = '#555';
	this.d.stroke();
}

Sm2D.prototype.drawXaxis= function(x, styleLenght, styleWidth)  {
	if (!Sm2D.prototype.isValidNumber(styleLenght)) styleLenght = this.height();
	if (!Sm2D.prototype.isValidNumber(styleWidth))  styleWidth = 1;  
	this.d.beginPath();
	this.drawLine(this.createPoint(x,-styleLenght),this.createPoint(x,styleLenght));
	this.d.lineWidth = styleWidth;
	this.d.strokeStyle = '#555';
	this.d.stroke();
}

Sm2D.prototype.drawXmark= function(s) { 
	for(x=0;x<this.MAXX;x+=s) this.drawXaxis(x,this.height()/100,1);
	for(x=0;x>this.MINX;x-=s) this.drawXaxis(x,this.height()/100,1);
}

Sm2D.prototype.drawYmark= function(s) { 
	for(y=0;y<this.MAXY;y+=s) this.drawYaxis(y,this.width()/100,1);
	for(y=0;y>this.MINY;y-=s) this.drawYaxis(y,this.width()/100,1);
}
