Consent.js and cookie.js
========================

Introduction:
-------------

In Europe many countries require the visitors consent for cookies and web analytics data collection. The customers will see a one-time message on their first visit and allow the visitors to opt-out. Until consent is provided the customer can still interact with the page. Depending on which page element was interacted with this can represent an implicit form of consent. Other page elements can be interacted with without being interpreted as a form of consent. The visitors opt-in status is then stored in a cookie.


How to load consent.js and cookie.js?
-------------------------------------

Cookies are used for a large variety of cases and not only for cookie consent. For this reason the _cookie.js_ module exists as a stand-alone module. The _consent.js_ module however requires the _cookie.js_ module at all times. When you load the _consent.js_ module in _kermit.config.dependencies_ in Kermit core you do not need to load _cookie.js_. Now let's have a refresher on how to load a module in Kermit core:

    kermit.config.dependencies = [
      "../kermit/consent.js",
      // other modules
    ]


Cookie.js:
----------

* _write_
* _read_
* delete_
* _update_
* _touch_ - postpones the expiry date of the cookie based on the current date


Consent.js:
-----------

The _consent.js_ module introduces new Kermit tags to identify the page elements that will set the cookie opt-in to yes or no:

* data-analytics-consent-withheld
* data-analytics-consent-implicit

When the cookie consent one-time message is displayed Kermit does not generate a page view or interaction JSON and the web analytics tracking is also suspended. The opt-in can only be the result of an interaction with a page element which was tagged for implicit consent.

The visitor has opted-out:

* the one-time message disappears
* the opt-out is stored in a cookie
* Kermit generates no JSON for any page views or interactions
* Kermit does not call your web analytics tool
* Any subsequent page views and interactions are not tracked

The visitor has opted-in:

* he one-time message disappears
* the opt-in is stored in a cookie
* the page view has not been tracked so far, Kermit generates the page view JSON and logs a page view with your web analytics tool
* the implicit consent was the result of an interaction with a page element, Kermit generates te interaction JSON and logs the interaction with your web analytics tool
* if interacting with the page element that yielded the opt-in results in a page load Kermit will delay the page load if your web analytics tool requires this. Without the delay the page about to be loaded might stop the interaction tracking request.

This module makes additions to _kermit.config_ in Kermit core:

* kermit.config.cookie.name
* kermit.config.cookie.domain
* kermit.config.cookie.expiry

This module expands the _kermit.utils_ object wikth the following methods:

* kermit.utils.cookie.status.becomes - sets the opt-in or opt-out
* kermit.utils.cookie.status.is - get the opt-in or opt-out status
* kermit.utils.cookie.status.resets - deletes the opt-in status


Alban Gérôme
27 Mar 2017

Follow me on Twitter: @albangerome