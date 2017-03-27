Kermit v.0.8 core
=================

Introduction:
-------------

There are several types of tracking requirements, two of which are page views and interactions with elements on the page such as button clicks. Other types of tracking requirements will be related to e-commerce transactions, such as adding items to a shopping basket. At the time of writing this markdown file Kermit is a client-side Javascript to support page views and interactions only.

Kermit will help you on different levels. It will infer default settings from the page HTML which will get your started fast and make the learning curve less steep. When you revisit your tagging either as a result of curiousity or necessity you will be able to override the default settings.

Once the developers have a tagging guide describing your tracking requirements your code might be reinterpreted or split into several files. The developers need to see whether the tracking will still work and the implementation specialist or team will need to be able to check the tags. Kermit provides you with an easy way to see your Kermit tags as they fire.

If you are based in Europe like me you may only collect web analytics data from a visitor after they have provided consent. Kermit provides support for tagging elements for implicit consent. This requires a separate module.

Another frequent issue is the sudden loss of analytics reporting after the developers made code changes. The point made above about better visibility of whether the tag will fire or not will help but Kermit can do more to address these. Kermit collects all Kermit tags on a given page and generates a fixed-length verification code. This also requires a separate module. If the source code of a given page changes by even as little as a space added or removed this verification code will change. If you run automated tests this verification code will no longer match the expected verification code and the Kermit tagging has to be reviewed before going live.

In a nutshell Kermit will help you prepare, maintain your analytics implementation, get more accurate data, catch potential reporting outages earlier and stay compliant with the cookie legislation. With better data and longer stretches of data collection without outages your web analysts can be more confident with their actionable insight. When actionable insight contradicts the understanding the management has of the business belief persistence often leads the management to question the methodology of the data analysis but also how the data was collected, i.e. the tagging itself.


Examples:
---------

Kermit leverages HTML5 _data-_ attributes to describe your page views and interactions. It will generate a JSON object which you will be able to use with your web analytics tool. At the time of writing the Kermit modules for Google Analytics and Adobe Analytics are in development. The Google Analytics and GTM module will be open source. The Adobe Analytics and DTM module will not be open source though.

Page view example:

    <div _data-analytics-pageview-description="homepage"_></div>

This will produce the following JSON:

    {
      pageViewAttributes : {
        description : "homepage"
      }
    }

Now if you need to check your page view tagging, open your browser devtools and your Javascript console. The following code will you show you the _div_ element describing your page view:

    document.querySelector([data-analytics-page-description]);

If you use jQuery you can use the code above or the following:

    $([data-analytics-page-description]);


Now let's have a look at the interaction example:

    <input value="B" type="button" _data-analytics-interaction-description="Button XYZ was clicked"_ />

This will produce the following JSON:

    {
      interactionAttributes : {
        description : "Button XYZ was clicked"
    },
      pageViewAttributes : {
        description : "homepage"
      }
    }

Now checking the description of your interaction is ridiculously simple: inspect the element. Notice how the interaction JSON contains the page view description. Imagine having a call to action button on several pages. You have a requirement for a report to break down the clicks by page. Use a unique interaction description and break them down by the page description.


Event tracking:
---------------

Browsers implement these differently but Kermit handles these using cross-browser Javascript. Let's revisit our interaction example above:

    <input value="B" type="button" _data-analytics-interaction-description="Button XYZ was clicked"_ />

Kermit does need to know that clicks are what you need to measure. If this is a button it will infer that clicks is what you are after by default. If the element was drop-down menu or a text field the click event is not relevant there. Kermit will infer these Javascript events based on the HTML tag:

 * _click_ - buttons (not radio buttons), links and checkboxes
 * _changes_ - drop-downs and radio buttons
 * _blur_ - input text fields (all variants thereof) and textarea

The _click_ event fires on drop-down menus but once when you open the menu and each time you select an item in the menu. The _blur_ event only fires when the element was interacted with and the interaction has finished. Tracking every key pressed in a text field is overkill, knowing that the element was interacted with is sufficient. A text field interacted with but left blank is still an interaction, perhaps an indicator that the field label contains confusing copy which is actionable insight.

 You might have specific reasons to override the default event or capture a different event. Let's introduce a new Kermit tag:

    data-analytics-interaction-event

Example:

    data-analytics-interaction-event="keypress"

The supported values are any Javascript-supported events.


Page views tracking:
--------------------

Kermit recognises two types of page views. Some page views will be the result of a full page load. Some websites optimise the user experience by treating every following page view as a page update of the previous page. Most pages will contain the same header with the brand logo, internal search and navigation and legal, privacy and terms and conditions links in the footer. Loading this common content only once seems like a smart thing to do. These are commonly referred to as _single page applications_ or _SPAs_.

With some single page applications the back button will even work as if a full page load happened, the URL might change or not. The _hashchange_ Javascript event might work on your website. You might support the back button using _history.pushState()_ but neither of these are generic enough to recognise a page view. Kermit leverages _document object model mutations_, aka _DOM mutations_ instead. Support for DOM mutations is here again browser-specific like event tracking covered above. On browsers not supporting DOM mutations natively Kermit emulates this support. If the content change contains a _data-analytics-page-description_ tag is found with a new value Kermit treats this as a new page view.

Regardless of whether your website uses only full page loads or a SPA if you have tagged the page using the _data-analytics-pageview-description_ tag Kermit will treat this as a page view. If the value of that tag changes Kermit will treat this as a new page view, period.


Extensible and modular architecture:
------------------------------------

A single library trying to support every requirement would be a huge file even after minifaction and could impact your page load performance. Page render speed is measured by search engines and slow websites rank lower. For this reason Kermit is built around a core file augmented by modules. You use only the modules you need and keep Kermit small. A Kermit module should also not require the Kermit core code to change. Rewriting functions of the Kermit core also means that the original functions in the core are dead code which was loaded for nothing. The module is responsible for working with the core and not the other way around. The Kermit core configuration section excepted the core should not change or only very rarely.

One important point to keep in mind is that Kermit wraps all functionality inside a single _kermit_ Javascript object which acts like a namespace and wrapper for all the Kermit core and modules code. Basically Kermit leverages the Kermit singleton pattern which limits any strange and hard to find bugs with the pre-existing code on your website to a minimum.

Kermit also provides another way to create your own Kermit tags. Kermit core can also be configured to support future HTML tags and declare which Javascript will be triggered by default when interacted with. This will be covered further below.


Configuring Kermit core
-----------------------

The Kermit core configuration section acts as a repository of settings that you or Kermit modules can change or add in the core. The configuration section is declared under the _kermit.config_ object. 

Some web analytics solutions need a delay to track an interaction which leads to a new page to be loaded or the current page to be updated. You need to track the submit button on a form. Without this delay you cannot guarantee that the click will be tracked before the new page loads. You need to delay that page load to ensure that the interaction tracking fires. This delay is declared in the configuration section under _kermit.config.delayBeforeNewPage_.

Should the _data-analytics-_ attributes conflict with your pre-existing code base the Kermit core section lets you rename any Kermit tag. A few Kermit modules will introduce new Kermit tags like the _consent_ module. When the visitor interacts with an element using this new Kermit tag this means that the visitor has provided consent, albeit implicitly. The consent module will be covered in a separate markdown file. 

The configuration section also declares which Javascript event should be triggered by default when a specific HTML element was interacted with. This will help you expand the list and support future HTML elements or perhaps custom HTML elements. Here are the current elements declared in _kermit.config.maps.events_. The full list is detailed in the _Core defaults tag-event mappings reference_ section further below.

Kermit also supports lookup tables declared in _kermit.config.maps_. These can make your Kermit core file very large. The lookup keys are declared with the following tags:

* data-analytics-pageview-key
* data-analytics-interaction-key

The configuration also contains a list of modules to load as dependencies. Instead of using lookup tables in the config section you can create them as a separate module. These modules are declared in _kermit.config.dependencies_.


Custom interaction and page view tags:
--------------------------------------

Most web analytics implementations require detailed descriptions of a page view or an interaction rather than just a few words. You will often need to group these into categories. Kermit supports wild card tags:

    _data-analytics-interaction-attribute-*_
    _data-analytics-pageview-attribute-*_

Examples:

    _data-analytics-interaction-attribute-prop1_
    _data-analytics-pageview-attribute-channel_


Controlling the number of server calls:
---------------------------------------

Some of you might want to use Kermit with an entreprise web analytics solution. Each time a tracking request is triggered a server call is generated and this incurs a cost. To be more precise this cost is deducted from a monthly server calls allowance. The business owners fearing that a key interaction would not be tracked tend to require all page element interactions to be tracked. Kermit would certainly make this easier than ever before but be prepared to discuss your server calls allowance with your web analytics provider sooner rather than later.

I recommend keeping track the number of page element interactions tracked on each page. You could use a page view attribute such as a _s.prop_ if you use Adobe Analytics. Examples:

    s.prop67 = kermit.utils.getSummary().length;

or if you prefer using Adobe processing rules:    

    s.contextData.kermitUse = kermit.utils.getSummary().length;

Then consider a 2-dimension quadrant to identify pages with:

* high number of page element interactions using Kermit
* high number of page views

This specific quadrant will generate most server calls.

![High traffic and many interactions](https://github.com/alban-gerome/kermit/blob/master/matrix.png)

Create a second custom metric with the following formula:

number of page elements using Kermit / number of page views

You can then create a page report, i.e each row will represent a page, with this custom metric. By ranking that report by the custom metric in descending order the pages at the top of the report will be pages with traffic and a large number of page element interactions tracked. Your next course of action is to review these page element interactions and remove the Kermit HTML attribute from page elements without business value.

Of course a better plan would be to require a review of which page element interactions represent a key interaction and using Kermit only on these elements. In a nutshell Kermit might not need a web analytics implementation expert but a web analyst is still required to keep your volume of server calls down.


Core tags reference:
--------------------

* data-analytics-interaction-description : short text description of the interaction
* data-analytics-interaction-key : lookup key, the lookup table can be declared in the configuration section or an external module
* data-analytics-interaction-attribute-* : custom interaction attribute
* data-analytics-interaction-event : overrides the default event or provides the event for an unrecognised HTML tag

* data-analytics-pageview-description : short text description of the page view
* data-analytics-pageview-key : lookup key, the lookup table can be declared in the configuration section or an external module
* data-analytics-pageview-attribute-* : custom page view attribute


Core internal events reference:
--------------------------------------

Kermit leverages custom Javascript events. When the Kermit tags have reached key stages of processing certain events will be fired to control when certain functions can start executing, including functions declared in modules or when all modules have done their work and the core functions should take over.

* kermit-ready : all the modules have done their work and now Kermit can now generate the JSON object for the page view and register the event handlers required to track the page elements interactions

* kermit-pageview-ready : the page views are about to be tracked
* kermit-before-pageview : the page view JSON has been processed and is about to be passed on to the web analytics module(s)
* kermit-after-pageview : the page view JSON has been passed on to the web analytics module(s)

* kermit-interaction-ready : the interactions are about to be tracked
* kermit-before-interaction : the interaction JSON has been processed and is about to be passed on to the web analytics module(s)
* kermit-after-interaction : the interaction JSON has been passed on to the web analytics module(s)


Core default tag-event mappings reference:
------------------------------------------

Kermit supports three Javascript events, _click_, _change_ and _blur_. When the following HTML5 elements have been tagged with a Kermit interaction tag one of these three events will be automatically attached to the element. You can override this with _data-analytics-interaction-event_.

_click_ category
* input[button]
* input[submit]
* input[checkbox]
* button
* a[href]
* area[href]

_change_ category
* select[]
* input[radio]

_blur_ category
* input[text]
* input[color]
* input[date]
* input[datetime]
* input[datetime-local]
* input[email]
* input[month]
* input[number]
* input[range]
* input[search]
* input[tel]
* input[time]
* input[url]
* input[week]
* textarea


Core public methods reference:
------------------------------

* kermit.utils.addListener : cross-browser event handler
* kermit.utils.getAbsoluteURL : convert a relative URL into an absolute URL
* kermit.utils.getAttributes : generates the JSON object for interactions and page views from HTML5 data- attributes and additional external attributes referred to as _properties_. These additional properties are often added by modules
* kermit.utils.getElementSelector : generates a basic CSS selector for an element like "input[type]"
* kermit.utils.getEventSource : cross-browser way of finding the real element that the source of an event, i.e. the link and the HTML or text content of a link
* kermit.utils.getEventType : finds the default Javascript event for a given HTML element
* kermit.utils.getNodeType : tells whether an element contains a Kermit interaction or page view tag
* kermit.utils.getSummary : returns a Javascript array of all HTML elements containing Kermit tags
* kermit.utils.isVisible : tells whether the element is visible
* kermit.utils.loadJS : lazy loads a script and executes a callback after it has loaded. This is how modules are loaded
* kermit.utils.pageViewListener : cross-browser page load or page update detection based on DOM mutations or equivalent
* kermit.utils.processJSONP : attaches JSON data to kermit.config.maps, used for external modules declaring lookup tables
* kermit.utils.redirectWithDelay : enforces a delay before redirecting to a new page based on the delay declared in the configuration section
* kermit.utils.register.interactionProperty : adds a property for an interaction JSON, usually used by modules
* kermit.utils.register.pageViewProperty : adds a property for a page view JSON, usually used by modules
* kermit.utils.register.filter : adds a CSS selector for a new Kermit tag in the configuration section, usually used by modules
* kermit.fireInteraction : simulates an interaction on an element
* kermit.handlePageViews : initiates the page views tracking
* kermit.handleInteractions : initiates the interactions tracking
* kermit.init : starts Kermit


Core properties reference:
--------------------------

* kermit.utils.getAttributes.pageViewProperties : stores the page views data to be used later inside in an interaction JSON
* kermit.utils.getAttributes.interactionProperties : stores interaction data for to be used later

* handlePageViews.disabled : aborts the function call as long as it remains set to _true_
* handleInteractions.disabled : aborts the function call as long as it remains set to _true_

* kermit.config.delayBeforeNewPage : delay for interactions that will result in loading a new page. This gives 500ms to send the tracking request. You can change the delay. Some web analytics tools need this, others do not
* kermit.config.usesKermitClass : optional class name for all HTML elements with Kermit tags
* kermit.config.interactionDescription : contains the CSS selector for the interaction description tags
* kermit.config.interactionKey : contains the CSS selector for the interaction lookup key tags
* kermit.config.interactionAttribute : contains the CSS selector for the interaction custom attrtibute tags
* kermit.config.interactionEvent : contains the CSS selector for the interaction event tag
* kermit.config.pageViewDescription : contains the CSS selector for the page view description tag
* kermit.config.pageViewKey : contains the CSS selector for the page view lookup key tag
* kermit.config.pageViewAttribute : contains the CSS selector for the page view custom attribute tag
* kermit.config.maps.events : maps the HTML5 element to their default Javascript event, i.e. click, change or blur
* kermit.config.maps.* : internal lookup references for interactions and page views
* kermit.config.dependencies : list of modules to be loaded


Links:
------

* http://www.albangerome.com/kermit/demo.php -  uses AngularJS 1.x
* http://www.albangerome.com/kermit/demo2.php - relies on CSS to update the page


Alban Gérôme
27 Mar 2017

Follow me on Twitter: @albangerome