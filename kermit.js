var kermit = {
  version:0.5,
  utils:{
    addListener:function(element, eventType, callback){
      var element = typeof element=="string" ? document.querySelector(element) : element;
      if(element.addEventListener){
        element.addEventListener(eventType, callback, false);
      }else if(element.attachEvent){
        element.attachEvent("on" + eventType, callback);
      }else{
        element["on" + eventType] = callback;
      };
    },
    getAbsoluteURL:function(url){
      var a  = document.createElement("a");
      a.href = url;
      return a.href;
    },
    getEventType:function(element){
      var elementTagName  = element.nodeName;
      var elementType     = element.hasAttribute("type") ? element.getAttribute("type") : null||
                            element.hasAttribute("href") ? "href"                       : null||"";
      var elementCombined = [elementTagName, "[", elementType, "]"].join("").toLowerCase();
      return kermit.config.maps.events[elementCombined];
    },
    loadJS:function(src, callback){
      // Adapted from Ed Eliot http://www.ejeliot.com/blog/109
      var a                    = document.getElementsByTagName("head")[0];
      var b                    = document.createElement("script");
          b.src                = kermit.utils.getAbsoluteURL(src);
          b.type               = "text/javascript";
      if(typeof callback!="undefined"){          
        b.onload               = callback;
        b.onreadystatechange   = function(){
          if(this.readyState.match(/complete|loaded/gi)){
            b.onreadystatechange = null;
            callback();
          };
        };
      }
      a.appendChild(b);
    },
    processJSONP(payload){
      for(var a in payload) kermit.config.maps[a] = payload[a];
    },
    redirectWithDelay:function(element, event){
      event.preventDefault();
      var d = setTimeout(function(){
      clearTimeout(d);
        document.location.href = href;
      }, kermit.config.delayBeforeNewPage);
    },
    google:{
      trackElement:function(element, attributesObject){
        var h          = !!kermit.utils.getEventType(element).match(/^\w+\[href\]|input\[submit\]$/);
        var mustUseGTM = (
          typeof dataLayer=="object"    && 
          dataLayer.constructor===Array && 
          kermit.config.forceGA!=1
        ) || kermit.config.forceGTM!=0;
        if(
          h && typeof navigator.sendBeacon=="undefined" ||
          h && mustUseGTM
        ) kermit.utils.redirectWithDelay(element, event);
        var a = kermit.config.interactionDescSelector.replace(/\[|\]/g,"");
        var b = kermit.config.interactionKeySelector.replace(/\[|\]/g,"");
        var fieldsObject = {
          eventCategory : "interaction",
          eventAction   : event.type
        };
        if(element.hasAttribute(a))    fieldsObject.eventLabel           = element.getAttribute(a);
        if(element.hasAttribute(b)){
                                       fieldsObject.eventLabel           = fieldsObject.eventLabel||"lookup";
                                       fieldsObject.interactionLookupKey = element.getAttribute(b);
        };
        for(var i in attributesObject) fieldsObject[i]                   = attributesObject[i];
        if(mustUseGTM){
                                       fieldsObject.event                = "interaction";
          dataLayer.push(fieldsObject);
        }else{
          if(h && typeof navigator.sendBeacon=="function"){            
                                       fieldsObject.transport            = "beacon";
                                       fieldsObject.hitCallback          = function(){document.location = element.href}//needed?
          };
          ga("send", "event", fieldsObject);
        };
      }
    }
  },
  config:{
    delayBeforeNewPage      : 500,
    interactionDescSelector : "[data-analytics-interaction-description]",
    interactionKeySelector  : "[data-analytics-interaction-key]",
    interactionAttribute    : "[data-analytics-interaction-attribute-*]",
    forceGTM                : !1,
    forceGA                 : !0,
    maps:{
      events:{ 
        "input[text]"           : "blur",
        "input[color]"          : "blur",
        "input[date]"           : "blur",
        "input[datetime]"       : "blur",
        "input[datetime-local]" : "blur",
        "input[email]"          : "blur",
        "input[month]"          : "blur",
        "input[number]"         : "blur",
        "input[range]"          : "blur",
        "input[search]"         : "blur",
        "input[tel]"            : "blur",
        "input[time]"           : "blur",
        "input[url]"            : "blur",
        "input[week]"           : "blur",
        "textarea[]"            : "blur",
        "input[button]"         : "click",
        "input[submit]"         : "click",
        "input[checkbox]"       : "click",
        "button[]"              : "click",
        "a[href]"               : "click",
        "area[href]"            : "click",
        "select[]"              : "change",
        "input[radio]"          : "change"
      },
      dependencies:[
        "include.js"
      ],
      "multipleInternalClick-aaa":{
        prop1:"aaa prop1",
        prop2:"aaa prop2"
      },
      "multipleInternalClick-bbb":{
        prop1:"bbb prop1",
        prop2:"bbb prop2"
      },
      "multipleInternalClick-ccc":{
        prop1:"ccc prop1",
        prop2:"ccc prop2"
      },
      "multipleInternalClick-ddd":{
        prop1:"ddd prop1",
        prop2:"ddd prop2"
      },
      "multipleInternalChange-eee":{
        prop1:"eee prop1",
        prop2:"eee prop2",
        eVar1:"eee eVar1",
        events:"event1"
      },
      "multipleInternalChange-hhh":{
        prop1:"hhh prop1",
        prop2:"hhh prop2"
      },
      "multipleInternalChange-iii":{
        prop1:"iii prop1",
        prop2:"iii prop2"
      },
      "multipleInternalChange-jjj":{
        prop1:"jjj prop1",
        prop2:"jjj prop2"
      },
      "multipleInternalBlur-kkk":{
        prop1:"kkk prop1",
        prop2:"kkk prop2"
      },
      "multipleInternalBlur-lll":{
        prop1:"lll prop1",
        prop2:"lll prop2"
      },
      "mixMatchClick-ccc":{
        prop1:"ccc prop1",
        prop2:"ccc prop2"
      },
      "mixMatchClick-ddd":{
        prop1:"ddd prop1",
        prop2:"ddd prop2"
      },
      "mixMatchChange-hhh":{
        prop1:"hhh prop1",
        prop2:"hhh prop2"
      },
      "mixMatchChange-hhh":{
        prop1:"hhh prop1",
        prop2:"hhh prop2"
      },
      "mixMatchChange-iii":{
        prop1:"iii prop1",
        prop2:"iii prop2",
        list3:"iii list3",
        eVar1:"iii eVar1",
        events:"event1"
      },
      "mixMatchChange-iii":{
        prop1:"iii prop1",
        prop2:"iii prop2",
        list3:"iii list3",
        eVar1:"iii eVar1",
        events:"event1"
      },
      "mixMatchChange-jjj":{
        prop1:"jjj prop1",
        prop2:"jjj prop2",
        list3:"jjj list3",
        eVar1:"jjj eVar1",
        events:"event1"
      },
      "mixMatchBlur-kkk":{
        prop1:"kkk prop1",
        prop2:"kkk prop2",
        list3:"kkk list3",
        eVar1:"kkk eVar1",
        events:"event1"
      },
      "mixMatchBlur-lll":{
        prop1:"lll prop1",
        prop2:"lll prop2"
      },
      "mixMatchClickOverloaded-aaa":{
        prop1:"aaa prop1",
        prop2:"aaa prop2"
      },
      "mixMatchClickOverloaded-bbb":{
        prop1:"bbb prop1",
        prop2:"bbb prop2"
      },
      "mixMatchClickOverloaded-ccc":{
        prop1:"ccc prop1",
        prop2:"ccc prop2"
      },
      "mixMatchClickOverloaded-ddd":{
        prop1:"ddd prop1",
        prop2:"ddd prop2"
      },
      "mixMatchChangeOverloaded-eee":{
        prop1:"eee prop1",
        prop2:"eee prop2"
      },
      "mixMatchChangeOverloaded-hhh":{
        prop1:"hhh prop1",
        prop2:"hhh prop2"
      },
      "mixMatchBlurOverloaded-kkk":{
        prop1:"kkk prop1",
        prop2:"kkk prop2"
      },
      "mixMatchClickOverloaded-lll":{
        prop1:"lll prop1",
        prop2:"lll prop2"
      }
    },
  },
  init:function(){
    var h = kermit.config.maps.dependencies.reverse(), i = h.length;
    while(i--) kermit.utils.loadJS(h[i], function(){
      [].map.call(
        document.getElementsByTagName("*"),
        function(element){
          var attributesObject = {};
          var a = kermit.utils.getEventType(element), b, c, d, e, f, g;
          if(!!a){
            b = kermit.config.interactionDescSelector.replace(/\[|\]/g,"");
            c = kermit.config.interactionKeySelector.replace(/\[|\]/g,"");
            if(element.hasAttribute(b)) attributesObject.interactionDescription = element.getAttribute(b);
            if(element.hasAttribute(c)){
                                        attributesObject.interactionLookupKey   = element.getAttribute(c);
              d = kermit.config.maps[element.getAttribute(c)];
              for(e in d)               attributesObject[e]                     = d[e];
            };
            [].map.call(
              element.attributes,
              function(attribute){
                f = new RegExp(kermit.config.interactionAttribute.replace(/\[|\]|\*/g,""));
                g = attribute.nodeName;
                if(g.match(f))          attributesObject[g.replace(f,"")]       = attribute.nodeValue;
              }
            );
            if(JSON.stringify(attributesObject)!="{}" && !!a){
              kermit.utils.addListener(element, a, function(){
                /*
                if(element.tagName=="INPUT" && element.type=="checkbox" && element.hasAttribute(b)){
                  attributesObject.interactionDescription = [
                    element.getAttribute(b),
                    element.checked ? "checked" : "unchecked"
                  ].join(" - ");
                };
                */
                kermit.utils.google.trackElement(element, attributesObject);
              });
            };
          }
        }
      );
    });
  }
};
kermit.init();