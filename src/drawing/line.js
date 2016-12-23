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

    Draw a line

*/ 
 
/* Basic line */
Sm2D.prototype.drawLineTo = function(pt) {
    if (!this.isValidPoint(pt)) console.error("invalid point");
    var pt2 = this.word2canvas(pt);
    this.d.lineTo(pt2.x,pt2.y);
}

/* Basic line */
Sm2D.prototype.drawLine   = function(pt1,pt2) {
    if (!this.isValidPoint(pt1)) console.error("invalid point pt1");
    if (!this.isValidPoint(pt2)) console.error("invalid point pt2");
    this.moveTo(pt1);
    this.drawLineTo(pt2);
}