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
var kermit = {
  version:0.7,
  utils:{
    addListener:function(obj){
      if(obj==undefined)          return;
      if(obj.callback==undefined) return;
      var elementConstructor, eventName;
      function eventListener(element, event, callback){
        if(element.addEventListener){
          element.addEventListener(  event, callback);
        }else if(element.attachEvent){
          element.attachEvent("on" + event, callback);
        }else{
          element["on" + event] =           callback;
        };
      };
      if(obj.element==undefined){
        if(obj.event==undefined) return;
              eventListener(window, obj.event, obj.callback);
      }else{
        elementConstructor = obj.element.constructor;
        eventName          = obj.event;
        if(elementConstructor===NodeList || elementConstructor===String){
          if(elementConstructor === NodeList && obj.element.length==0)                            return;
          if(elementConstructor===String     && document.querySelectorAll(obj.element).length==0) return; 
          [].map.call(
            elementConstructor === NodeList ? obj.element : document.querySelectorAll(obj.element),
            function(element){
              eventName = eventName||kermit.utils.getEventType(element);
              eventListener(element, eventName, obj.callback);
            }
          );
        }else if(/^function HTML[a-zA-Z]*Element/.test(obj.element.constructor + "")){
              eventName = eventName||kermit.utils.getEventType(obj.element);
              eventListener(obj.element, eventName, obj.callback);
        };
      };
    },
    getAbsoluteURL:function(url){
      var a  = document.createElement("a");
      a.href = url;
      return a.href;
    },
    getAttributes:function(element){
      if(element==null) return;
      var a = kermit.config;
      var b = kermit.utils.getAttributes; b.pageView = b.pageView || {};
      var c = {
        interactionAttributes  : {
          event : kermit.utils.getEventType(element),
          hasHref : element.hasAttribute("href")
        },
        pageViewAttributes     : {
          description : arguments.callee.pageName
        },
        isDefault              : !0
      };
      var d = arguments.callee.filter || /(interaction(Description|Key|Attribute|Event))|(pageView(Description|Key|Attribute))/;
      var e, f, g, h, i, j, k, l, m;
      for(e in a) if(d.test(e)){
        f = new RegExp(a[e].replace(/\[|\]|\*/g,""));
        [].map.call(
          element.attributes,
          function(attribute){
            g = attribute.nodeName.toLowerCase();
            h = g
              .replace(a.interactionAttribute.replace(/\[|\]|\*/g,""), "")
              .replace(a.pageViewAttribute.replace(/\[|\]|\*/g,""), "");
            i = attribute.nodeValue;
            j = kermit.config.maps[i];
            k = c.interactionAttributes;
            l = c.pageViewAttributes;
            if(f.test(g)){
              delete c.isDefault;
              switch(e){
                case "interactionEvent":
                                                       k.event       = i;
                break;
                case "interactionDescription":
                                                       k.description = i;
                  for(m in b.pageView)                 l[m]          = b.pageView[m];
                break;
                case "interactionAttribute":
                                                       k[h]          = i;
                  for(m in b.pageView)                 l[m]          = b.pageView[m];
                break;
                case "interactionKey":
                                                       k.lookupKey   = i;
                  for(m in j)                          k[m]          = j[m];
                  for(m in b.pageView)                 l[m]          = b.pageView[m];
                break;
                case "pageViewDescription":
                  if(i!="")   b.pageView.description = l.description = i;
                break;
                case "pageViewAttribute":
                              b.pageView[h]          = l[h]          = i;
                break;
                case "pageViewKey":
                              b.pageView.lookupKey   = l.lookupKey   = i;
                  for(m in j) b.pageView[m]          = l[m]          = j[m];
                break;
              };
            };
          }
        );
      };
      c = !!c.isDefault ? undefined : c;
      if(k && k.event==null) delete c.interactionAttributes;
      return c;
    },
    getElementSelector(element){
      var b = element.nodeName.toLowerCase();
      var c = element.hasAttribute("type") ? element.getAttribute("type") :
              element.hasAttribute("href") ? "href" : "";
      var d = [b, "[", c, "]"].join("").toLowerCase().replace(/\[\]$/,"");
      return d;
    },
    getEventSource:function(event){
      var a = event.target ? event.target : event.srcElement;
      if(kermit.getNodeType(a)) return a;
      while((a = a.parentElement) && kermit.getNodeType(a)!="interaction") ;
      return a;
    },
    getEventType:function(element){
      if(element==null) return;
      var a = kermit.utils.getElementSelector(element);
      return kermit.config.maps.events[a];
    },
    getNodeType(element){
      var a = kermit.config;
      var b = arguments.callee.filter || /interaction(Description|Key|Attribute|Event)/;
      var c = /pageView(Description|Key|Attribute)/gi;
      var d, e, f, g;
      [].map.call(
        element.attributes,
        function(attribute){
          d = attribute.nodeName;
          for(e in a) if(typeof a[e]=="string"){
            f = new RegExp(a[e].replace(/\[|\]|\*/g,""));
            g = f.test(d) && b.test(e) ? "interaction" :
                f.test(d) && c.test(e) ? "pageView"    : g;
          };
        }
      );
      return g;
    },
    getSummary(type){
      var a = kermit.config;
      var b = arguments.callee.filter || /(interaction(Description|Key|Event))|(pageView(Description|Key))/;
      var c, d = "." + a.usesKermitClass, e = [], f, g, h, i, j, k = [];
      [].map.call(
        document.querySelectorAll(d),
        function(f){
          e.push(f);
        }
      );
      for(g in a) if(b.test(g)) e.push(a[g]);
      f = a.interactionAttribute.replace(/\[|\]|\*/g,"");
      h = a.pageViewAttribute.replace(/\[|\]|\*/g,"");
      if(typeof document.evaluate=="function"){
        i = document.evaluate(
          "//@*[starts-with(name(),'" + f + "') or starts-with(name(),'" + h + "')]",
          document, 
          null, 
          XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
          null
        );
        j = i.snapshotLength;
        while(j--) e.push("[" + i.snapshotItem(j).nodeName + "]");
      };
      [].map.call(
        document.querySelectorAll(e.join(",")),
        function(element){
          var l = kermit.utils.getNodeType(element);
          if(type==undefined)  k.push(element);
          if(type==l)          k.push(element);
        }
      );
      return k.length==0 ? null :
             k.length==1 ? k[0] : k;
    },
    isVisible:function(element){
      return (!!(element.offsetWidth || element.offsetHeight || element.getClientRects));
    },
    loadJS:function(obj){
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
      a.appendChild(b);
    },
    pageViewListener:function(callback){
      var a, b, c, d, e, f, g, h, i, j, k, l;
      a = kermit.utils;
      b = a.addListener;
      c = a.getNodeType;
      d = a.getEventSource;
      e = window.MutationObserver || window.WebKitMutationObserver;
      f = (function(){
        g = document.createElement("p");
        h = !1;
        b({
          element    : g,
          event      : "load",
          callback   : function(){h = !0}
        });
        g.setAttribute("kermit", "test");
        return h;
      })();
      if(typeof e!="undefined"){
        b({
          event      : "load",//DOMContentLoaded
          callback   : function(){
            callback();
            i =  {
              subtree    : !0,
              attributes : !0
            };
            j = new MutationObserver(function(k){
              l = k.length;
              while(l--) if(c(k[l].target)=="pageView") callback();
            });
            j.observe(document.body, i);
          }
        });
      }else if(f){
        callback();
        b({
          event      : "DOMAttrModified",
          callback   : function(){
            if(c(d(event))=="pageView") callback();
          }
        });
      }else if(document.body.onpropertychange){
        callback();
        b({
          event      : "propertychange",
          callback   : function(){
            if(c(d(event))=="pageView") callback();
          }
        });
      }else{
        callback();
        setInterval(callback, 500);
      };
    },
    processJSONP(payload){
      for(var a in payload) kermit.config.maps[a] = payload[a];
    },
    redirectWithDelay:function(element, event){//do forms submit?
      event.preventDefault();
      var d = setTimeout(function(){
      clearTimeout(d);
        document.location.href = element.href;
      }, kermit.config.delayBeforeNewPage);
    },
    removeListener(obj){
      if(obj==undefined)          return;
      if(obj.function==undefined) return;
      function remove(element, eventName, functionRef){
        var a = element.removeEventListener;
        var b = element.detachEvent;
        var c = eventName||kermit.utils.getEventType(obj.element);
        if(a){
          a(c, functionRef);
        }else if(b){
          b("on" + c, functionRef);
        };
      };
      if(obj.element==undefined){
        if(obj.event==undefined) return;
              remove(window, obj.event, obj.function);
      }else{
        elementConstructor = obj.element.constructor;
        eventName          = obj.event||kermit.utils.getEventType(obj.element);
        if(elementConstructor===NodeList || elementConstructor===String){
          [].map.call(
            elementConstructor === NodeList ? obj.element : document.querySelectorAll(obj.element),
            function(element){
              remove(element, eventName, obj.callback);
            }
          );
        }else if(/^function HTML[a-zA-Z]*Element/.test(obj.element.constructor + "")){
              remove(obj.element, eventName, obj.callback);
        };
      };
    }
  },
  config:{
    delayBeforeNewPage          : 500,
    usesKermitClass             : "usesKermit",
    interactionDescription      : "[data-analytics-interaction-description]",
    interactionKey              : "[data-analytics-interaction-key]",
    interactionAttribute        : "[data-analytics-interaction-attribute-*]",//an attribute will override what was declared under a key
    interactionEvent            : "[data-analytics-interaction-event]",
    pageViewDescription         : "[data-analytics-pageview-description]",
    pageViewKey                 : "[data-analytics-pageview-key]",
    pageViewAttribute           : "[data-analytics-pageview-attribute-*]",
    maps:{
      events:{
        "input[text]"           : "blur",   "input[color]"  : "blur",  "input[date]"     : "blur", "input[datetime]" : "blur",
        "input[datetime-local]" : "blur",   "input[email]"  : "blur",  "input[month]"    : "blur", "input[number]"   : "blur",
        "input[range]"          : "blur",   "input[search]" : "blur",  "input[tel]"      : "blur", "input[time]"     : "blur",
        "input[url]"            : "blur",   "input[week]"   : "blur",  "textarea"        : "blur",

        "input[button]"         : "click",  "input[submit]" : "click", "input[checkbox]" : "click", "button"         : "click",
        "a[href]"               : "click",  "area[href]"    : "click",

        "select"                : "change", "input[radio]"  : "change"
      }
    },
    dependencies:[
      "../kermit/md5.js",
      "../kermit/google.js",
      "../kermit/consent.js"
    ]
  },
  /*
  handlePageViews:function(){
    window.dispatchEvent(new CustomEvent("kermit-pageview"));
    var a = kermit.utils;
    var b = a.getSummary;
    var c = a.getAttributes;
    var d = b("pageView"); if(d==null) return;
    var e = c(d);
    if(typeof e=="object"){
      a.google.trackView(e);
      //a.adobe.trackView(e);
    };
  },
  handleInteractions:function(){
    window.dispatchEvent(new CustomEvent("kermit-interaction"));
    var a = kermit.utils;
    var b = a.getSummary;
    var c = a.getAttributes;
    var d = b("interaction"); if(d==null) return;
    var e;
    [].map.call(d, function(element){
      e = c(element);
      if(typeof e=="object" && typeof e.interactionAttributes!="undefined"){
        a.addListener({
          element  : element,
          callback : function(){
            e = c(element);
            a.google.trackInteraction(e);
            //a.adobe.trackInteraction(e);
          }
        });
      };
    });
  },
  init:function(){
    kermit.utils.getAttributes.pageViewAttributes = {};// what's this for again?
    var a = kermit.config.dependencies.reverse(), b = a.length;
    var c = kermit.utils;
    if(b==0){
      window.dispatchEvent(new CustomEvent("kermit-ready"));
    }else{
      while(b--) c.loadJS({
        src    : a[b],
        type   : "include"
      });
    };
    kermit.utils.addListener({
      event    : "kermit-ready",
      callback : function(){
        kermit.utils.pageViewListener(function(){
          kermit.handlePageViews();
          kermit.handleInteractions();
        });
      }
    });
  }
};
*/
  heartbeat:function(){
    window.dispatchEvent(new CustomEvent("kermit-pageview"));
    var c = kermit.utils;
    var d = c.getSummary;
    var e = c.getAttributes;
    var f = c.addListener;
    var g = d("pageView"); if(g==null) return;
    var h = e(g);
    var i = h.pageViewAttributes.description;
    if(typeof h=="object"){
      c.google.trackView(h);
      //c.adobe.trackView(h);
    };
    var j = d("interaction"); if(j==null) return;    
    var k = j.length;
    var l;
    [].map.call(j, function(element){
      k = e(element);
      if(typeof k=="object" && typeof k.interactionAttributes!="undefined"){
        f({
          element  : element,
          callback : function(){
            k = e(element);
            c.google.trackInteraction(k);
            //c.adobe.trackInteraction(k);
          }
        })
      };
    });
  },
  init:function(){
    kermit.utils.getAttributes.pageViewAttributes = {};
    var a = kermit.config.dependencies.reverse(), b = a.length;
    var c = kermit.utils;
    if(b==0){
      window.dispatchEvent(new CustomEvent("kermit-ready"));
    }else{
      while(b--) c.loadJS({
        src  : a[b],
        type : "include"
      });
    };
    kermit.utils.addListener({
      event    : "kermit-ready",
      callback : function(){
        kermit.utils.pageViewListener(function(){
          kermit.heartbeat();
        });
      }
    });
  }
};
kermit.init();