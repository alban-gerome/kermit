kermit.utils.adobe = {
  convertAttributesObject:function(attributesObject){
    var a, b, c, d, e, f;
    a = {
      contextData : {}
    };
    b = /^((prop|eVar|hier|list)\d+|events|products)$/;
    c = attributesObject.pageViewAttributes;
    d = attributesObject.interactionAttributes;
    for(e in c) if(b.test(e)){
                  a[e] = c[e];
    }else{
      a.contextData[e] = c[e];
    };
    for(e in d) if(b.test(e)){
                  a[e] = d[e];
    }else{
      a.contextData[e] = d[e];
    };
    f = a.contextData.description
    if(f) a.pageName = f;
    return a;
  },
  getLinkType:function(element){
    var a, b, c, s, result = null;
    s = window[kermit.utils.adobe.rootObject];
    if(element.hasAttribute("href")){
      a = kermit.utils.getAbsoluteURL(element.getAttribute("href"));
      if(s.linkDownloadFileTypes){
        b = a.match(/\.([^.#?/]*)/gi);
        if(!b) return null;
        b = b.reverse()[0].substr(1);
        c = s.linkDownloadFileTypes.match(new RegExp(b ,"i"));
      };
      if(result=="" && s.linkInternalFilters){
        b = a.match(/^(?:https?:\/\/)?(?:[^@\n]+@)?([^:\/\n]+)/i)[1];
        c = s.linkInternalFilters.match(new RegExp(b, "i"));
        if(!c) result = "e";
      };
    }else{
      result = "o";
    };
    return result;
  },
  getLinkTrackEvents:function(attributesObject){
    var a = attributesObject.interactionAttributes.events;
    return typeof a=="undefined" ? "None" : a;
  },
  getLinkTrackVars:function(attributesObject){
    var a = ["channel", "pageName"];
    var b = kermit.utils.adobe.convertAttributesObject(attributesObject);
    var c, d = [];
    for(c in b) d.push(b[c]);
    return d.join(",").replace(/(event\d+,?)+/gi,"events,").replace(/,$/,"");
  },
  getOverrides:function(attributesObject){
    var a = {
      mobile      : "true",
      contextData : {}
    };
    var b = kermit.utils.adobe.convertAttributesObject(attributesObject);
    var c = b.contextData, d;
    for(d in b) if(d!="contextData")               a[d]             = b[d];
    for(d in c)                                    a.contextData[d] = c[d];
    if(JSON.stringify(a.contextData)=="{}") delete a.contextData;
    return a;
  },
  trackInteraction:function(element){
    var a             = kermit.utils.getAttributes(element);
    var s             = window[kermit.utils.adobe.rootObject];
    var h             = !!/^\w+\[href\]|input\[submit\]$/.test(kermit.utils.getElementSelector(element));
    kermit.utils.redirectWithDelay(element, event);
    //s.linkTrackVars   = kermit.utils.adobe.getLinkTrackVars(a);
    //s.linkTrackEvents = kermit.utils.adobe.getLinkTrackEvents(a);
    console.log(
      h ? element : !h,
      a.interactionAttributes.description,
      kermit.utils.adobe.getOverrides(a)
    );
    /*
    s.tl(
      h ? element : !h,
      kermit.utils.adobe.getLinkType(element),
      attributesObject.interactionAttributes.description,
      kermit.utils.adobe.getOverrides(attributesObject)
    );
    */
  },
  trackView:function(attributesObject){
    var s = window[kermit.utils.adobe.rootObject];
    console.log(kermit.utils.adobe.getOverrides(attributesObject));
    //s.t(kermit.utils.adobe.getOverrides(attributesObject));
  },
  rootObject:"s"
};