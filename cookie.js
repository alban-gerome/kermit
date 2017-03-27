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
kermit.utils.cookie = {
  write:function(name, domain, days, value){
    document.cookie = [
      name + "=" + value,
      "expires=" + (function(days){
        var date = new Date();
        date.setTime(date.getTime() + (days * 86400000));
        return date.toGMTString();
      })(days),
      "domain="  + domain
    ].join("; ");
  },
  read:function(name){
   var a = document.cookie.split("; "), b = a.length, c = "";
   while(b--) if(a[b].split("=")[0]==name){
     c=a[b].split("=")[1];
     break;
   };
   return c;
  },
  delete:function(name, domain){
    document.cookie = [name, "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=", domain].join("");﻿
  },
  touch:function(name, domain, days){
    var a = kermit.utils.cookie;
    var b = a.read(name);
    if(b=="") return;
    a.update(name, domain, days, b);
  },
  update:function(name, domain, days, value){
    var a = kermit.utils.cookie;
    var b = a.read(name);
    if(b!="") a.delete(name, domain);
              a.write(name, domain, days, value);
  }
}