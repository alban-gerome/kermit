/*
Copyright (c) 2016-2017 Alban Gérôme

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy,
modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the
Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
/*
  type == "include" - the callback executes as soon as the file as loaded which may be before the file has finished executing
  type == "inner"   - will create an inline script from the file loaded and the callback function is executed last
*/
kermit.utils.loadJS = function(obj){
  var a                         = document.getElementsByTagName("head")[0];
  var b                         = document.createElement("script");
  obj.type = obj.type || "include";
  if(obj.type=="include") b.src = obj.src;
      b.type                    = "text/javascript";
  if(obj.type=="include" && obj.callback!=undefined){       
    b.onload               = obj.callback;
    b.onreadystatechange   = function(){
      if(this.readyState.match(/complete|loaded/gi)){
        b.onreadystatechange = null;
        obj.callback();
      };
    };
  };
  var c, d, e, f, g;
  if(obj.type=="inner"){
    c = new XMLHttpRequest();// IE support?
    c.open("GET", obj.src);
      c.onreadystatechange = function(){
        if(this.readyState==4 && obj.callback.constructor===Function){
          d = c.responseText;
          e = /\}\)\(\);?$/;
          f = /\};?$/;              
          g = ["  var callback = ", obj.callback, "; callback();"].join("");
          if(e.test(d)){
            b.innerHTML = d.replace(e, [g, "\n})()"].join(""));
          }else if(f.test(d)){                
            b.innerHTML = d.replace(f, [g, "\n}"].join(""));
          };
        };
      };
    c.send();
  };
  a.appendChild(b);
};