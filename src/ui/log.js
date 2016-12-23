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

    Log and strings

*/ 
 
/* Attach Log textarea */
Sm2D.prototype.attachLog = function (id) {  
    this.clog  = (id)?document.getElementById(id):null;
}

/* Basic log method, to get print information on screen */
Sm2D.prototype.log = function (str)
{
	console.log(str);
	if (!this.clog) return;
	this.clog.value += str+"\n"; 
	this.clog.scrollTop = this.clog.scrollHeight;
}
  
/* Basic log method, to get print information on screen */
Sm2D.prototype.clearLog = function ()
{
	if (!this.clog) return;
	this.clog.value = "";
}

// ----

/* Convert float to string  */
Sm2D.prototype.f2str = function (f,digit) {
    if (digit===undefined) digit = 1;
    var p = Math.pow(10,digit);
    return parseFloat(Math.round(f*p)/p).toFixed(digit);
}

/* Convert radian angle to degree string  */
Sm2D.prototype.rad2str = function (a,digit) {
    var deg = a*180/Math.PI;
    return Sm2D.prototype.f2str(deg,digit) + "\u00B0";
}