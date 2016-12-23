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

    add ControlPanel

*/ 
 
/* Add a control panel */
Sm2D.prototype.addControlPanel = function (id)
{  
    var ctx = this;
	var controlPanel = document.getElementById(id);
	if (!controlPanel) { console.error("Invalid ControlPanel!"); return null; }
	var dragBtn = document.createElement('i');
	dragBtn.className  = "fa fa-arrows-alt btn";
	controlPanel.insertBefore(dragBtn, controlPanel.firstChild);
	
	ctx.draggingNode = null;
	ctx.draggingPos  = null;

	dragBtn.addEventListener('mousedown', function (e) { 
		ctx.draggingNode = this;
		ctx.draggingPos = {x: e.x - parseInt(ctx.draggingNode.parentNode.style.left,10), y: e.y - parseInt(ctx.draggingNode.parentNode.style.top,10) }
	},false);

	document.addEventListener('mouseup', function (e) { 
		ctx.draggingNode = null;
	},false);

	document.addEventListener('mousemove', function (e) { 
		if(ctx.draggingNode==null) return;
		e=e || window.event;
		if(e.stopPropagation) e.stopPropagation();
	    if(e.preventDefault) e.preventDefault();
	    e.cancelBubble=true;
	    e.returnValue=false;
	    ctx.draggingNode.parentNode.style.top = e.y - ctx.draggingPos.y;
	    ctx.draggingNode.parentNode.style.left = e.x - ctx.draggingPos.x;
	},false);
}
