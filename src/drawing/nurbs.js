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

    Draw a nurbs

*/  
 
Sm2D.prototype.drawNURBS = function(nurbs, name, color, details)
{
    if (!this.isValidNURBS(nurbs)) console.error("invalid nurbs");    
    if (name===undefined     || name===null)    name="";
    if (color===undefined    || color===null)   color='#CCC';
    if (details===undefined  || details===null) details=false;
    
    this.d.beginPath();
    this.d.lineWidth = 0.5;
    this.d.strokeStyle = color;
    for(t=0;t<1;t=t+0.001) {
        var x=0;
        var y=0;
        var w=0;
        for(i=0;i<4;i++) {
            var Bernstein = 0;
            switch(i) {
                case 0: Bernstein += 1*Math.pow(t,0)*Math.pow(1-t,3); break;
                case 1: Bernstein += 3*Math.pow(t,1)*Math.pow(1-t,2); break;
                case 2: Bernstein += 3*Math.pow(t,2)*Math.pow(1-t,1); break;
                case 3: Bernstein += 1*Math.pow(t,3)*Math.pow(1-t,0); break;
            }
            x += Bernstein * nurbs.w[i] * nurbs.p[i].x;
            y += Bernstein * nurbs.w[i] * nurbs.p[i].y;
            w += Bernstein * nurbs.w[i];
        }
        var p = this.createPoint(x/w,y/w);
        this.drawLineTo(p);
    }
    this.d.stroke();
    
    this.d.beginPath();
    this.d.lineWidth = 0.25;
    this.d.strokeStyle = '#CCC';
    this.d.setLineDash([5, 3]);
    for(i=1;i<4;i++) this.drawLine(nurbs.p[i-1], nurbs.p[i]);
    this.d.stroke();
    this.d.setLineDash([]);    
    
    for(i=0;i<4;i++) this.drawPoint(nurbs.p[i],"P"+i+"("+nurbs.w[i]+")");
}