/*
Copyright (c) 2016-2017 Alban Gerome

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
(function(){
  var a = kermit.utils;
  var b = kermit.config;
  var c, d;
  
  a.getSelector = function(element){
    var e = [], f, g;
    while(element.parentNode){
      if(element.id){
        e.unshift("#" + element.id);
        break;
      }else{
        if(element==element.ownerDocument.documentElement){
          e.unshift(element.tagName.toLowerCase());
        }else{
          f = 1;
          g = element;
          while(g = g.previousElementSibling) f++;
          e.unshift([
            element.tagName.toLowerCase(),
            ":nth-child(",
            f,
            ")"
          ].join(""));
        };
        element = element.parentNode;
      }
    };
    return e.join(">");
  };
  a.getCheckSum = function(){
    var h = [], i;
    kermit.utils.getSummary().map(function(i){
      h.push(JSON.stringify(kermit.utils.getAttributes(i)));
    });
    return kermit.utils.getMD5(h.join(""));
  };
  
  a.loadJS({
    src      : "../kermit/md5.js",
    type     : "include",
    callback : function(){
      a.addListener({
        event    : "kermit-pageview-ready",
        callback : function(){
          var e = document.getElementsByTagName("body")[0].cloneNode(true);
          [].map.call(
            e.querySelectorAll(b.pageViewDescription),
            function(element){
              if(!a.isVisible(element)) element.parentNode.removeChild(element);
            }
          );
          ["getAttributes"].map(function(c){
            a.register.pageViewProperty({
              functionReference : c,
              propertyName      : "description",
              propertyValue     : a.getMD5(e.innerHTML)
            });
            a.register.pageViewProperty({
              functionReference : c,
              propertyName      : "checksum",
              propertyValue     : a.getMD5(e.innerHTML)
            });
          });
          [].map.call(
            document.querySelectorAll(b.interactionDescription),
            function(element){
              d = a.getMD5(a.getSelector(element));
              element.setAttribute("data-analytics-interaction-id", d);
            }
          );
          [
            "getAttributes",
            "getNodeType",
            "getSummary"
          ].map(function(c){
            a.register.interactionProperty({
              functionReference : c,
              propertyName      : "interactionId",
              propertyValue     : /interactionId/
            });
          });
          a.register.filter({
            propertyName        : "interactionId",
            selector            : "[data-analytics-interaction-id]"
          });
        }
      });
    }
  });
})();