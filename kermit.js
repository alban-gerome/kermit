
(function(){
  var kermit = {
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
      getCheckboxValue:function(element, that){
      	var a, b = kermit.config.interactionDescSelector.replace(/[\[\]]/g,"");
        if(element.tagName=="INPUT" && element.type=="checkbox"){
          a = [
            element.getAttribute(b),
            that.checked ? "checked" : "unchecked"
          ].join(" - ");
        }else{
          a = element.getAttribute(b);
        };
        return a;
      },
      getEventType:function(element){
        var elementTagName  = element.nodeName;
        var elementType     = element.hasAttribute("type") ? element.getAttribute("type") : null||
                              element.hasAttribute("href") ? "href"                       : null||"";
        var elementCombined = [elementTagName, "[", elementType, "]"].join("").toLowerCase();
        return kermit.config.maps.events[elementCombined];
      },
      redirectWithDelay:function(element, event){
        var h = element.href;
        if(!h) return null;
        event.preventDefault();
        var d = setTimeout(function(){
        clearTimeout(d);
          document.location.href = href;
        }, kermit.config.delayBeforeNewPage);
      }
    },
    config:{
      delayBeforeNewPage:500,
      interactionDescSelector:"[data-analytics-interaction-description]",
      interactionKeySelector:"[data-analytics-interaction-key]",
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
        }
      },
    },
    init:function(){
      [].map.call(
        document.querySelectorAll(kermit.config.interactionDescSelector),
        function(element){
          var a = kermit.utils.getEventType(element);
          if(!!a) kermit.utils.addListener(
            element,
            a,
            function(){
              var b = kermit.utils.getCheckboxValue(element, this);
              console.log(b);
            }
          );
        }
      );
    }
  };
  kermit.init();
})();