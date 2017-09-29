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
/*
  Beavis v0.3
*/
(function(){
  var a = kermit.utils;
  var b = kermit.config;
  var c, d;
  
  a.get.selector = function(element){
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
  a.get.checkSum = function(){
    var h = [], i;
    kermit.utils.get.summary().map(function(i){
      h.push(JSON.stringify(kermit.utils.getAttributes(i)));
    });
    return kermit.utils.get.MD5(h.join(""));
  };
  a.get.outerMD5 = function(element){
    var j, k;
    j = document.getElementsByTagName("body")[0].cloneNode(true);
    [].map.call(j, function(k){
      if(a.get.selector(element)==a.get.selector(k)) k.parentNode.removeChild(j);
    });
    return a.get.MD5(j.innerHTML);
  };
  
  a.loadJS({
    src      : "../kermit/md5.0.2.js",
    type     : "include",
    callback : function(){
      a.addListener({
        event    : "kermit-pageview-ready",
        callback : function(){
          [].map.call(
            document.querySelectorAll(b.pageViewDescription),
            function(element){
              e = a.get.outerMD5(element);
              [a.get.attributes].map(function(c){
                [
                  "description",
                  "checksum"
                ].map(function(g){
                  [].map.call(
                    document.querySelectorAll(b.pageViewDescription),
                    function(element){
                      a.register.pageViewProperty({
                        functionReference : c,
                        propertyName      : g,
                        propertyValue     : e
                      });
                    }
                  );
                });
              });
            }
          );
          var l = kermit.utils.get.summary("interaction");
          if(l){
            kermit.utils.get.summary("interaction").map(function(element){
              d = [
                a.get.selector(element),
                element.dataset.analyticsInteractionDedupe || ""
              ].join("");
              element.setAttribute("data-analytics-interaction-id", a.get.MD5(d));
            });
          };
          [
            a.get.attributes,
            a.get.nodeType,
            a.get.summary
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
          
          (function(a, callback){
            var b = {}, c, d, e = !1;
            [].map.call(
              document.querySelectorAll("[" + a + "]"),
              function(c){
                d    = c.getAttribute(a);
                b[d] = b[d]||[];
                b[d].push(c);
                e = b[d].length > 1 ? !0 : e;
              }
            );
            if(e) console.warn("Kermit says:These interaction ids are not unique. Check the innerHTML of these elements, adding a dummy but unique HTML comment in each of these elements does the trick.", b);
          })("data-analytics-interaction-id");
        }
      });
    }
  });
})();
