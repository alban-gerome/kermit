/*
Copyright (c) 2016 Alban Gérôme

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
kermit.utils.hasClassName    = function(element, className){
  return (new RegExp("\b" + className + "\b", "g")).test(element.className);
};
kermit.utils.addClassName    = function(element, className){
  var a = kermit.utils.hasClassName(element, className);
  var b = element.className;
  return !a && b=="" ? className :
         !a && b!="" ? [b, className].join(" ") : b;
};
kermit.utils.removeClassName = function(element, className){
  var a = kermit.utils.hasClassName(element, className);
  if(a) element.className = element.className
    .replace(new RegExp(className, "g"), "")
    .replace(/^\s|\s$/g, "")
    .replace(/\s{2,}/g, " ");
  return element.className;
};