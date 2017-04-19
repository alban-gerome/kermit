(function(obj){
  var a, b, c, d, e, f, g, h;
  if(kermit) kermit.handlePageViews.disabled = true;
  a      = document.querySelector(obj.pageView.selector);
  b      = obj.pageView.attributes;
  for(c in b)   a.dataset[c] = b[c];
  obj.interactions.map(function(d){
    e    = document.querySelector(d.selector);
    f    = d.attributes;
    for(c in f) e.dataset[c] = f[c];
  });
  g      = document.createElement("script");
  g.type = "text/javascript";
  h      = new XMLHttpRequest();
  h.onreadystatechange = function(){
    if(h.readyState==4) obj.callback(h.responseText);
  };
  h.open("GET", obj.url, true);
  h.send();
})({
  version:"0.1",
  url:"http://www.albangerome.com/kermit/kermit.0.8.2.js",
  callback:function(data){
    var i = kermit.handlePageViews.disabled;
    if(i)  i = false;
  },
  pageView:{
    selector:"#ngView>div:nth-child(1)",
    attributes:{
      analyticsPageviewA:"1",
      analyticsPageviewB:"2",
      analyticsPageviewC:"3"
    }
  },
  interactions:[{
    selector:"#ngView>section:nth-child(2)>table:nth-child(3)>tbody:nth-child(1)>tr:nth-child(1)>td:nth-child(2)>a:nth-child(1)",
    attributes:{
      analyticsInteractionA:"4",
      analyticsInteractionB:"5",
      analyticsInteractionC:"6"
    }
  }]
});
