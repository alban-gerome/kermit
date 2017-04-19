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
var kermit = {
  version:"0.8.2",
  utils:{
    addListener:function(obj){
      if(obj==undefined)          return;
      if(obj.callback==undefined) return;
      var elementConstructor, eventName;
      function eventListener(element, event, callback){
        if(element.addEventListener){
          element.addEventListener(   event, callback);
        }else if(element.attachEvent){
          element.attachEvent("on" +  event, callback);
        }else{
          element["on" + event] =            callback;
        };
      };
      if(obj.element==undefined){
        if(obj.event==undefined) return;
              eventListener(window, obj.event, obj.callback);
      }else{
        elementConstructor = obj.element.constructor;
        if(elementConstructor===NodeList || elementConstructor===String){
          if(elementConstructor === NodeList && obj.element.length==0)                            return;
          if(elementConstructor===String     && document.querySelectorAll(obj.element).length==0) return; 
          [].map.call(
            elementConstructor === NodeList ? obj.element : document.querySelectorAll(obj.element),
            function(element){
              eventName = obj.event||kermit.utils.get.eventType(element);
              eventListener(element, eventName, obj.callback);
            }
          );
        }else if(/^function HTML[a-zA-Z]*Element/.test(obj.element.constructor + "")){
              eventName = eventName||kermit.utils.get.eventType(obj.element);
              eventListener(obj.element, eventName, obj.callback);
        };
      };
    },
    get:{
      absoluteURL:function(url){
        var a  = document.createElement("a");
        a.href = url;
        return a.href;
      },
      attributes:function(element){
        if(element==null) return;
        var a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q;
        a = kermit.utils;
        b = kermit.config;
        c = {
          interactionAttributes  : {
            event   : a.get.eventType(element),
            hasHref : element.hasAttribute("href")
          },
          pageViewAttributes     : {},
          isDefault              : !0
        };
        d = arguments.callee;
        e = d.pageViewProperties;
        f = c.pageViewAttributes;
        g = d.interactionProperties;
        h = c.interactionAttributes;
        i = [/(interaction(Description|Key|Attribute|Event))|(pageView(Description|Key|Attribute))/];
        function aggregateRegExp(core, extension){
          var properties = extension=="pageView"    ? e :
                           extension=="interaction" ? g : null;
          var attributes = extension=="pageView"    ? f :
                           extension=="interaction" ? h : null;
          if(!properties || !attributes) return;
          for(j in properties) switch(properties[j].constructor){
            case RegExp:
              core = core
                .concat(properties[j]||[])
                .join("|")
                .replace(/\/|\//g, "")
                .replace(/\|*$/, "")
                .split();
            break;
            case String:
              attributes[j] = properties[j];
            break;
          };
          return core;
        };
        i = aggregateRegExp(i, "pageView");
        i = aggregateRegExp(i, "interaction");
        i = new RegExp(i);
        for(j in b) if(i.test(j)){
          k = new RegExp(b[j].replace(/\[|\]|\*/g,""));
          [].map.call(
            element.attributes,
            function(attribute){
              l = attribute.nodeName.toLowerCase();
              m = l
                .replace(b.interactionAttribute.replace(/\[|\]|\*/g,""), "")
                .replace(b.pageViewAttribute.replace(/\[|\]|\*/g,""), "");
              n = attribute.nodeValue;
              o = kermit.config.maps[n];
              if(k.test(l)){
                delete c.isDefault;
                switch(j){
                  case "interactionEvent":
                    h.event                                   = n;
                  break;
                  case "interactionDescription":
                    h.description                             = n;
                    for(p in e)                 f[p]          = e[p];
                  break;
                  case "interactionAttribute":
                    h[m]                                      = n;
                    for(p in e)                 f[p]          = e[p];
                  break;
                  case "interactionKey":
                    h.lookupKey                               = n;
                    for(p in o)                 h[p]          = o[p];
                    for(p in e)                 f[p]          = e[p];
                  break;
                  case "pageViewDescription":
                    if(n!="")   e.description = f.description = n;
                  break;
                  case "pageViewAttribute":
                                e[j]          = f[m]          = n;
                  break;
                  case "pageViewKey":
                                e.lookupKey   = f.lookupKey   = n;
                    for(p in o) e[p]          = f[p]          = o[p];
                  break;
                  default: if(e[j]){
                    f[j] = n;
                  }else if(g[j]){
                    h[j] = n;
                  };
                };
              };
            }
          );
        };
        c = !!c.isDefault ? undefined : c;
        if(h && h.event==null) delete c.interactionAttributes;
        return c;
      },
      elementSelector:function(element){
        var b = element.nodeName.toLowerCase();
        var c = element.hasAttribute("type") ? element.getAttribute("type") :
                element.hasAttribute("href") ? "href" : "";
        var d = [b, "[", c, "]"].join("").toLowerCase().replace(/\[\]$/,"");
        return d;
      },
      eventSource:function(event){
        var a = event.target ? event.target : event.srcElement;
        if(kermit.get.nodeType(a)) return a;
        while((a = a.parentElement) && kermit.get.nodeType(a)!="interaction");
        return a;
      },
      eventType:function(element){
        if(element==null) return;
        var a = kermit.utils.get.elementSelector(element);
        return kermit.config.maps.events[a];
      },
      nodeType:function(element, isVisible){
        var a = kermit.config;
        var b = new RegExp(
          [/interaction(Description|Key|Attribute|Event)/]
            .concat(arguments.callee.re||[])
            .join("|")
            .replace(/\/|\//g, "")
            .replace(/\|*$/, "")
        );
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
      summary:function(type, showAll){
        var a = kermit.config;
        var b = new RegExp(
          [/(interaction(Description|Key|Event))|(pageView(Description|Key))/]
            .concat(arguments.callee.re||[])
            .join("|")
            .replace(/\/|\//g, "")
            .replace(/\|*$/, "")
        );
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
            if(kermit.utils.isVisible(element) || showAll==!0){
              var l = kermit.utils.get.nodeType(element);
              if(type==undefined)  k.push(element);
              if(type==l)          k.push(element);
            };
          }
        );
        return k.length==0 ? null :
               k.length==1 ? k[0] : k;
      }
    },
    isVisible:function(element){
      return !!(element.offsetWidth || element.offsetHeight || element.getClientRects().length);
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
      c = a.get.nodeType;
      d = a.get.eventSource;
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
    register : {
      interactionProperty : function(obj){
        var a = kermit.utils;
        var b = typeof obj.functionReference==="function" ? obj.functionReference : a[obj.functionReference];
        b.interactionProperties = b.interactionProperties||{};
        b.interactionProperties[obj.propertyName] = obj.propertyValue;
      },
      pageViewProperty : function(obj){
        var a = kermit.utils;
        var b = typeof obj.functionReference==="function" ? obj.functionReference : a[obj.functionReference];
        b.pageViewProperties = b.pageViewProperties||{};
        b.pageViewProperties[obj.propertyName]    = obj.propertyValue;
      },
      filter : function(obj){
        kermit.config[obj.propertyName]           = obj.selector;
      }
    }
  },
  config:{
    delayBeforeNewPage             : 500,
    usesKermitClass                : "usesKermit",
    interactionDescription         : "[data-analytics-interaction-description]",
    interactionKey                 : "[data-analytics-interaction-key]",
    interactionAttribute           : "[data-analytics-interaction-attribute-*]",//an attribute will override what was declared under a key
    interactionEvent               : "[data-analytics-interaction-event]",
    pageViewDescription            : "[data-analytics-pageview-description]",
    pageViewKey                    : "[data-analytics-pageview-key]",
    pageViewAttribute              : "[data-analytics-pageview-attribute-*]",
    maps:{
      events:{
        "input[text]"              : "blur",   "input[color]"  : "blur",  "input[date]"     : "blur", "input[datetime]" : "blur",
        "input[datetime-local]"    : "blur",   "input[email]"  : "blur",  "input[month]"    : "blur", "input[number]"   : "blur",
        "input[range]"             : "blur",   "input[search]" : "blur",  "input[tel]"      : "blur", "input[time]"     : "blur",
        "input[url]"               : "blur",   "input[week]"   : "blur",  "textarea"        : "blur",

        "input[button]"            : "click",  "input[submit]" : "click", "input[checkbox]" : "click", "button"         : "click",
        "a[href]"                  : "click",  "area[href]"    : "click",

        "select"                   : "change", "input[radio]"  : "change"
      }
    },
    dependencies:[
      "http://www.albangerome.com/kermit/include.js",
      "http://www.albangerome.com/kermit/beavis.0.3.js",
      "http://www.albangerome.com/kermit/google.js",
      "http://www.albangerome.com/kermit/consent.0.2.js"
    ]
  },
  fireInteraction:function(element){
    var a = this.utils;
    var g = a.get.summary;
    var h = a.get.attributes;
    var i = g("interaction", !0); if(i==null) return 1;
    var j = h(element);
    window.dispatchEvent(new CustomEvent("kermit-before-interaction", {data:j}));
    console.log(j);
    //a.google.trackInteraction(j);
    //a.adobe.trackInteraction(j);
    window.dispatchEvent(new CustomEvent("kermit-after-interaction", {data:j}));
  },
  handlePageViews:function(){
    window.dispatchEvent(new CustomEvent("kermit-pageview-ready"));
    if(arguments.callee.disabled) return;
    var a = kermit.utils;
    var b = a.get.summary;
    var c = a.get.attributes;
    var d = b("pageView"); if(d==null) return;
    var e = c(d);
    if(typeof e=="object"){
      window.dispatchEvent(new CustomEvent("kermit-before-pageview", {data:e}));
      console.log(e);
      //a.google.trackView(e);
      //a.adobe.trackView(e);
      window.dispatchEvent(new CustomEvent("kermit-after-pageview", {data:e}));
    };
  },
  handleInteractions:function(){
    window.dispatchEvent(new CustomEvent("kermit-interaction-ready"));
    if(arguments.callee.disabled) return 0;
    var a = kermit.utils;
    var b = a.get.summary;
    var c = a.get.attributes;
    var d = b("interaction", !0); if(d==null) return 1;
    var e;
    [].map.call(d, function(element){
      e = c(element);
      if(typeof e=="object" && typeof e.interactionAttributes!="undefined"){
        a.addListener({
          element  : element,
          callback : function(){
            e = c(element);
            window.dispatchEvent(new CustomEvent("kermit-before-interaction", {data:e}));
            console.log(e);
            //a.google.trackInteraction(e);
            //a.adobe.trackInteraction(e);
            window.dispatchEvent(new CustomEvent("kermit-after-interaction", {data:e}));
          }
        });
      };
    });
  },
  init:function(){
    kermit.utils.get.attributes.pageViewAttributes = {};
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
        c.pageViewListener(kermit.handlePageViews);
        c.pageViewListener(kermit.handleInteractions);
      }
    });
  }
};
kermit.init();
