/*
Copyright (c) 2016-2019 Alban Gerome

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
  Consent v0.3
*/
(function(){
  var a, b, c, d;
  a = kermit.utils;
  b = kermit.config;
  c = a.cookie;
  d = b.cookie;

  [
    a.get.attributes,
    a.get.nodeType,
    a.get.summary
  ].map(function(c){
    a.register.interactionProperty({
      functionReference : c,
      propertyName      : "interactionConsentGiven",
      propertyValue     : /interactionConsentGiven/
    });
  });
  a.register.filter({
    propertyName        : "interactionConsentWithheld",
    selector            : "[data-analytics-consent-withheld]"
  });
  a.register.filter({
    propertyName        : "interactionConsentGiven",
    selector            : "[data-analytics-consent-given]"
  });   
  
  function removeConsent(){
    document.querySelector("#cookie_notice").style.display = "none";
    wasGiven.disabled                                      = !0;
    wasWithheld.disabled                                   = !0;
    applyListeners.disabled                                = !0;
  };

  function applyListeners(){
    if(arguments.callee.disabled) return;
    a.addListener({
      element  : document.querySelectorAll(b.interactionConsentGiven),
      callback : wasGiven
    });
    a.addListener({
      element  : document.querySelector(b.interactionConsentWithheld),
      callback : wasWithheld
    });
    a.addListener({
      element  : document.querySelectorAll("#cookie_notice form input")[0],
      callback : function(){
        document.location.href = "./kermit/cookies.php";
      }
    });
  };

  function wasWithheld(){
    if(arguments.callee.disabled) return;
    removeConsent();
    a.consent.status.becomes("N");
  };

  function wasGiven(){
    if(arguments.callee.disabled) return;
    var e = event.srcElement||event.target;
    var f = event.type;
    a.consent.status.becomes("Y");
    kermit.handlePageViews.disabled    = undefined;
    kermit.handleInteractions.disabled = undefined;
    kermit.handleInteractions();
    kermit.handlePageViews();
    kermit.fireInteraction(e);
    if(e!=undefined && /^#/.test(e)) a.redirectWithDelay(e, f);
    removeConsent();
  };
  
  b.cookie = {
    name   : "www.albangerome.com-GAtracking",//"www.albangerome.com-analytics-tracking",
    domain : ".albangerome.com",
    expiry : 730
  };
  a.consent = {
    status:{
      becomes : function(value, callback){
        c.update(d.name, d.domain, d.expiry, value);
        if(callback!=undefined) callback();
      },
      is      : function(callback){
        return c.read(d.name);
        if(callback!=undefined) callback();
      },
      resets  : function(callback){
        c.delete(d.name, d.domain);
        if(callback!=undefined) callback();
      }
    }
  };
  
  a.loadJS({
    src      : "../kermit/cookie.js",
    type     : "include",
    callback : function(){
      c = a.cookie;
      d = b.cookie;
      a.cookie.touch(d.name, d.domain, d.expiry);
      if(a.consent.status.is()=="" || a.consent.status.is()=="N"){
        kermit.handlePageViews.disabled    = !0;
        kermit.handleInteractions.disabled = !0;
      };
      a.addListener({
        event    : "load",
        callback : (function(){
          if(a.consent.status.is()==""){
            document.querySelector("#cookie_notice").style.display = "block";
          }else{
            removeConsent();
          };
          window.dispatchEvent(new CustomEvent("kermit-ready"))
        })()
      });
      a.addListener({
        event    : "kermit-pageview-ready",
        callback : applyListeners
      });
    }
  });
})();
