Beavis.js and md5.js
====================

Introduction:
-------------

MD5 is a one-way encryption algorithm which means that you can use this to encrypt anything you do not need to decrypt. For example a password can and probably should be encrypted and stored in encrypted format. If your database gets compromised by hacker they will have to decrypt the passwords. The downside is that as a user who forgot their password nobody can tell you what your password is. You can only have it reset to a temporary password and you get to pick a new one. There are several one-way encryption algorithms available, some are available in Javascript, some not. MD5 takes content of any length and generates a fixed length hexadecimal code of 32 characters. Kermit uses a MD5.js version I have found at http://www.myersdaily.org/joseph/javascript/md5.js. For this reason this a separate module.

The Beavis module generates unique identifiers and verification codes and requires the md5.js module. Here is a quick look at what you can use Beavis for:

* page views : Beavis will generate a temporary description for you while you figure out a naming convention
* interactions : Beavis generates a unique identifier for each interaction element already tagged with Kermit
* Kermit tags : Beavis generates a verification code which will change if the page body and/or the Kermit tags change


How to load beavis.js and md5.js?
-------------------------------------

Let's have a refresher on how to load a module in Kermit core:

    kermit.config.dependencies = [
      "../kermit/beavis.js",
      // other modules
    ]


Beavis and page views:
----------------------

If you want to track a page view using Kermit here's an example to refresh your memory:

    <div data-analytics-pageview-description="homepage"></div>

If you have a large number of pages you will need a naming convention which may lead to a lot of back and forth discussions between different stakeholders and take time. With Beavis you can get a temporary value for the page view description. Just change the code example above to this:

    <div data-analytics-pageview-description></div>

Now you can move on with this Kermit tagging project and when the naming convention has been agreed upon you can pass a page view description to your tags.

One thing to watch out for though is that if the contents of the HTML body change, even by as little as 1 character, the temporary page description will change. The web analytics tool might expect a page view description that no longer exists.


Beavis and interactions:
------------------------

Some heatmapping tools require a unique identifier for the elements you want to report on. Beavis will find all page elements tagged with a Kermit interaction description tag and give them a unique identifier.

The child nodes of the element can change, for example the text copy of a link can change but the identifier generated by Beavis will not change. IF the rest of the HTML changes though, a paragraph was added for example the Beavis identifier may change. This is because Beavis generates that identifier from the CSS selector of the element. If the CSS selector for an element changes the unique identifier generated by Beavis will also change.


Beavis and verification codes:
------------------------------

A common cause of frustration with web developers is sudden losses of analytics reporting. The developers have made changes, they did not thing that the analytics code would be impacted so the analytics team was not informed of these impending changes. The testers also found no Javascript errors so nobody thought that analytics would stop collecting data for one or more reports. We need somthing that will throw at least a warning when the HTML and/or the analytics tag have changed. Kermit core already provides handy function to see all Kermit tags at a glance:

* kermit.utils.getSummary : this will return a Javascript array of all HTML elements with Kermit tags
* kermit.utils.getAttributes : this will return a JSON object with all the Kermit data for a given HTML element

Beavis will generate a verification code of checksum which will change when:

* the Kermit tags have been modified
* the HTML body has been modified

You can add a test in your test suite to check the current verification code generated by the page against the expected verification code. If both do not match the test suite should thrown a warning or an error asking to verify the Kermit tags. Unfotunately if your developers have removed Kermit core or the Beavis module you will not have any verification code to compare against.


Additions to Kermit core:
-------------------------

Beavis introduce this new HTML5 _data-_ attributes automatically:

* data-analytics-interaction-id

Beavis will also add a property in your pageviews and interactions JSON objects:

* pageViewAttributes._checksum_

If you are relying on the temporary page view description generated by Beavis the pageViewAttributes._description_ and pageViewAttributes._checksum_ will be identical. This is normal. Once you use a more friendly page view description the checksum property will not change unless the HTML also changed.


Beavis.js and md5.js properties:
--------------------------------

* kermit.utils.getMD5 : pass a string and get the MD5 hash
* kermit.utils.getSelector : pass a DOM element and get the CSS selector back
* kermit.utils.getCheckSum : calculate the verification code for the visible elements in the HTML body


Alban Gérôme
27 Mar 2017

Follow me on Twitter: @albangerome