Kermit
======

Introduction:
-------------

If you have some experience with web analytics implementation there will be 2 types of tracking requirements. First you will need to track page views, second you will need to track interactions with page elements. Kermit is a group of Javascript functions that will help you with the 2nd type of tracking requirements, i.e. page element interactions. Many websites do not track page element interactions but typically a tagging plan would contain more requirements for interactions than page views. Once Kermit is on every web page of your site you no longer need an analytics implementation expert to tag perhaps 80% of your tracking requirements. Imagine how fewer headaches your developers will get and how much more your web analytics implementation expert could do with that free time.

So what do I mean by _page element interactions_ exactly? I mean clicks on buttons, drop-down selections, text field entries. Whenever a visitor interacts with a page element a multitude of Javascript events will fire. 3 Javascript events are of particular interest but only one Javascript event will be relevant. We will have 3 categories of page elements based on the following Javascript events

* click
* change
* blur

For example the only Javascript event that will matter for a button is a _click_ event. All other Javascript events have little to no value for us except the click event when the page element is a button. In the case of a drop-down however the _click_ event will be incorrect as it would fire twice, once when you open the drop-down and a second time when you actually select an option. When dealing with drop-downs you will want the _change_ Javascript event. This leaves the text fields and here the only event of interest is the _blur_ event.

Marking up the page elements:
-----------------------------

The first thing consists of adding a custom HTML attribute to the page elements you need to track. The HTML standards recommend using attributes starting with _data-_. I have picked _data-analytics-interaction-description_. Fellows of the Royal Academy of Poetry wanting to contact me about an award there's a contact link somewhere on this page. You can change the name of HTML attribute in the config section. More on this later.

Now the value of the _data-analytics-interaction-description_ HTML attribute will be passed to your web analytics tool. Please make sure you pass a unique value as it will help you do a proper breakdown of all in the interactions tracked across your website. Here's a code example, first without and then with the Kermit HTML attribute:

    <input value="B" type="button" />
    <input value="B" type="button" data-analytics-interaction-description="Button XYZ was clicked" />

Automatically handle the rest:
------------------------------

Now Kermit will scan through the document for tags containing the _data-analytics-interaction-description_ HTML attribute. It will find the tag name and if necessary the _type_ and _href_ attributes. For example an _input_ tag with _type="radio"_ and an _input_ with _type="text"_ will be in 2 different categories (click, change, blur). Therefore the tag name is not enough. Then Kermit will determine the category automatically and attach the appropriate event listener to the element. Kermit provides its own cross-browser event listener, it's written in plain vanilla Javascript.

For links that will result in loading a completely new page there could be a racing condition where the new page is trying to load and the analytics tracking request is trying to fire. Which one will happen first will be random so Kermit applies a 500 milliseconds delay to the new page loading to leave enough time for the tracking request to be sent out. This delay does not apply to any other interaction and this ensures more accurate analytics data. The delay duration can also be edited in the config section.

Supporting multiple attributes and lookups - added Sep 29th 2016:
-----------------------------------------------------------------

Adding a single attribute for a description is very limited. In many occasions the interaction can be described by several different attributes. Kermit now supports a couple of new custom HTML5 attributes:

* data-analytics-interaction-description
* _data-analytics-interaction-attribute-* (new)_
* _data-analytics-interaction-key (new)_

You can also rename these attributes in the config section. 

Now Kermit also supports additional attributes on the HTML tag itself just like the _data-analytics-interaction-description_ atribute. You can add more data points simply by adding _data-analytics-interaction-attribute-*_ where you replace * with the suffix of your choice. The values of these parameters will be passed along your tracking request. Example:

	<a href="javascript:void(0)"
		data-analytics-interaction-attribute-a="multipleClick-aaa-a"
		data-analytics-interaction-attribute-b="multipleClick-aaa-b"
		data-analytics-interaction-attribute-c="multipleClick-aaa-c"
	>Link</a>

The key attribute will do a lookup and attach one or several data points to the tracking request to describe the interaction such as the site section, whether the visitor was logged in etc. The lookup data can be either stored internally inside the Kermit library file in _kermit.config.maps_ in the form of an object containing key-value pairs. The name of the object should match the value you have used for your key attribute on the HTML element. Kermit will then replace in the tracking request the key attribute on the HTML element with the data linked to that key. Example:

	<select data-analytics-interaction-key="multipleInternalChange-eee">
		<option value="E">E</option>
		<option value="F">F</option>
		<option value="G">G</option>
	</select>

Kermit now also supports a second type of lookup where the lookup data is stored in an external Javascript file. The external lookup data file paths are defined in the _kermit.config.dependencies_ array. Example:

	<input type="radio" name="rb" checked="checked" data-analytics-interaction-key="multipleInternalChange-iii" />

Let's look at _kermit.config.maps.dependencies:

	dependencies:[
		"include.js"
	],

You can use all these methods together. You might use the HTML element description and additional attributes to describe unique attributes of a given interaction and an external file lookup for description attributes shared across interactions happening on different pages.

Although untested at this stage you should also be able to leverage the lookup key inside GTM. By default Kermit calls GA directly but you can also change this in the config section by setting _forceGTM_ to _true_ and _forceGA_ to _false_. When you do this Kermit will use the _dataLayer.push()_ function instead of the _ga("send", fieldsObject)_ command.


Configuring Kermit:
-------------------

I have already mentioned 2 settings above which you can edit in the config section

* The name of the HTML element attribute that will contain the description of the interaction for your web analytics reports
* The delay after which a new page will display after the visitor clicked on a link

There is also another item which I have mentioned briefly, the list of elements and the relevant HTML attribute which will be used to determine which category of the interaction belongs to:

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

added Sep 29th 2016:

You can now also rename the following HTML attributes:

* _data-analytics-interaction-key (new)_
* _data-analytics-interaction-attribute-* (new)_

You can also declare lookup data in _kermit.config.maps_ and list external lookup data files in _kermit.config.maps.dependencies_. These lookup files are JSONP files, structured Javascript data passed as the parameter of a call to a new function called _kermit.utils.processJSONP()_.

Controlling the number of server calls:
---------------------------------------

Some of you might want to use Kermit with an entreprise web analytics solution. Each time a tracking request is triggered a server call is generated and this incurs a cost. To be more precise this cost is deducted from a monthly server calls allowance. The business owners fearing that a key interaction would not be tracked tend to require all page element interactions to be tracked. Kermit would certainly make this easier than ever before but be prepared to discuss your server calls allowance with your web analytics provider sooner rather than later.

I recommend keeping track the number of page element interactions tracked on each page. You could use a page view attribute such as a _s.prop_ if you use Adobe Analytics. Examples:

    s.prop67 = document.querySelectorAll("[data-analytics-interaction-description]").length;

or if you prefer using Adobe processing rules:    

    s.contextData.kermitUse = document.querySelectorAll("[data-analytics-interaction-description]").length;

Then consider a 2-dimension quadrant to identify pages with:

* high number of page element interactions using Kermit
* high number of page views

This specific quadrant will generate most server calls.

![High traffic and many interactions](https://github.com/alban-gerome/kermit/blob/master/matrix.png)

Create a second custom metric with the following formula:

number of page elements using Kermit / number of page views

You can then create a page report, i.e each row will represent a page, with this custom metric. By ranking that report by the custom metric in descending order the pages at the top of the report will be pages with traffic and a large number of page element interactions tracked. Your next course of action is to review these page element interactions and remove the Kermit HTML attribute from page elements without business value.

Of course a better plan would be to require a review of which page element interactions represent a key interaction and using Kermit only on these elements. In a nutshell Kermit might not need a web analytics implementation expert but a web analyst is still required to keep your volume of server calls down.

How to use the demo files:
--------------------------

Copy all 3 files and open your browser with the Javascript console opened. Start interacting with the page elements or check it out in action here: http://www.albangerome.com/Kermit/test.php. Ideally you want to serve Kermit from your tag management system and if you use GTM use the data layer and push an event which then translates into an interaction. The demo serves Kermit to the page without DTM to keep the code transparent. I was able to use Kermit with Adobe Analytics and serve it on the web pages with a DTM page load rule. 

Alban Gérôme
22 August 2016

Follow me on Twitter: @albangerome