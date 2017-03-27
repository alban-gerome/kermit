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
kermit.config.forceGA  = !1;
kermit.config.forceGTM = !0;
kermit.utils.google = {
  trackInteraction:function(obj){
    var a = (
      typeof dataLayer=="object"    && 
      dataLayer.constructor===Array && 
      kermit.config.forceGA!=1
    ) || kermit.config.forceGTM!=0;
    var b = obj.interactionAttributes;
    var c = obj.pageViewAttributes;
    var d = b.hasHref && typeof navigator.sendBeacon=="function";
    var e, f, g;
    function generatePropertyName(prefix, string){
      return prefix, string.charAt(0).toUpperCase() + string.slice(1);
    };
    e = {
      eventAction      : b.event,
      eventCategory    : b.category||"default",
      eventLabel       : b.lookupKey ? "lookup" : b.description,
      eventValue       : (b.value||0) - 0
    };
    if(d){
      e.hitCallback    =  function(){document.location.href = element.href};
      e.transport      = "beacon";
    };
    for(g in b) e[generatePropertyName("kermitInteraction", g)] = b[g];
    for(g in c) e[generatePropertyName("kermitPageView",    g)] = c[g];
    if(a){
      e.event          = "KermitInteraction";
      e.nonInteraction = false;
      console.log("GTM", c);
      dataLayer.push(e);
    }else{
      e.hitType        = "event";
      console.log("GA", e);
      ga("send", e);
    };
  },
  trackView:function(obj){
    var a = (
      typeof dataLayer=="object"    && 
      dataLayer.constructor===Array && 
      kermit.config.forceGA!=1
    ) || kermit.config.forceGTM!=0;
    var b = {
       'event':'KermitPageView'
    };
    if(a){
      for(var c in obj.pageViewAttributes) b[c] = obj.pageViewAttributes[c];
      console.log("GTM", b);
      dataLayer.push(b);
    }else{
      obj.hitType = "pageview";
      console.log("GA", obj);
      ga("send", obj);
    };
  }
};