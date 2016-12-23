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

    Draw a spiral

*/ 
 
Sm2D.prototype.drawSpiral = function(spiral, name, color, details)
{    
    if (!this.isValidSpiral(spiral)) console.error("invalid spiral");    
    if (name===undefined    || name===null)    name="";
    if (color===undefined   || color===null)   color='#CCC';
    if (details===undefined || details===null) details=false;
    
    // for test and UI
    var testLenght = 0;
    var firstDelta = null;
    var lastDelta = null;
    
    this.d.beginPath();
    this.d.lineWidth = 3;
    this.d.strokeStyle = color;

    var a = spiral.a();
    var l1 = spiral.l1();
    var l2 = spiral.l2();
        
    var dS = this.createVectorFromDelta(Sm2D.prototype.POINTZERO,0,0);
    var ds = Math.abs(l2-l1)/10000; // 10000 steps
    var dx, dy;
    var s=l1;
    var signe = ((spiral.isCCW)?1:-1);
    while (s<l2)
    { 
       dx = a * Math.cos(s*s) * ds;
       dy = signe * a * Math.sin(s*s) * ds;
       dS = this.createVectorFromDelta(dS.end, dx, dy);

       s += ds;       

       // for test and UI
       testLenght += dS.lenght();
       if (!firstDelta) firstDelta = dS.copy();
       lastDelta= dS.copy();
              
       var worldPt = this.localCCS2world(spiral.entryVector, dS.end);       
	     this.drawLineTo(worldPt);
    }
    this.d.stroke();
    
    if (details)
    {                
        var inRadius     = spiral.radiusIn();
        var inStrRadius  = this.f2str(inRadius);
        var outRadius    = spiral.radiusOut();
        var outStrRadius = this.f2str(outRadius);        
        var inAngle  = spiral.angleIn();
        var outAngle = spiral.angleOut();

        var firstDeltaWorld = ctx.createVector(
            this.localCCS2world(spiral.entryVector, firstDelta.start),       
            this.localCCS2world(spiral.entryVector, firstDelta.end)
        );
        
        var lastDeltaWorld = ctx.createVector(
            this.localCCS2world(spiral.entryVector, lastDelta.start),       
            this.localCCS2world(spiral.entryVector, lastDelta.end)
        );
        
        firstDeltaWorld.setLenght(3);
        this.drawRay(firstDeltaWorld, "input (R="+inStrRadius+")", "#F88", true);

        lastDeltaWorld.setLenght(3);
        this.drawRay(lastDeltaWorld, "output (R="+outStrRadius+")", "#88E", true);
    
        if (inRadius!=Infinity) { 
            firstDeltaWorld.setLenght(Math.abs(inRadius));  
            firstDeltaWorld = firstDeltaWorld.rotate(((inRadius<0)?-1:1) * signe * Math.PI/2);      
            this.drawArc(this.createArc(firstDeltaWorld.end, firstDeltaWorld.lenght()),null,"#755");
        };
        
        if (outRadius!=Infinity) { 
            lastDeltaWorld.setLenght(Math.abs(outRadius));  
            lastDeltaWorld = lastDeltaWorld.rotate(((outRadius<0)?-1:1) * signe * Math.PI/2);
            this.drawArc(this.createArc(lastDeltaWorld.end, lastDeltaWorld.lenght()),null,"#557");
        };
    }    
}
