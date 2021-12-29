# rss

This is where I put my JavaScript code to generate RSS feeds from my apps, running in the browser and in Node. 

### Example app

I put together a simple <a href="https://github.com/scripting/rss/blob/master/examples/app/test.js">test app</a> that includes an example of the data you would send to daverss, as a pair of JavaScript objects, to build a feed. 

It comes from my Radio3 linkblog, which is a <a href="http://radio3.io/users/davewiner/rss.xml">real feed</a>, still updated daily in January 2020. 

### Updates

#### v0.5.31 -- 12/29/21 by DW

Change the value of rssCloudDefaults.path to /ping, which according to Andrew Shell is the actual path rpc.rsscloud.io responds to. Andrew runs that server.

#### v0.5.30 -- 10/11/21 by DW

In  package.json  we now require dateformat 4.5.1 because they updated the package to not work with older versions of Node. 

#### v0.5.29 -- 4/4/20 by DW

I wanted to get the Cuomo podcast feed to validate through iTunes, so I added the needed features. 

1. Support for the &lt;channel> level &lt;image> element.

2. Two elements of the itunes namespace: category and explicit. 

#### v0.5.20 -- 1/14/20 by DW

Added a <a href="https://github.com/scripting/rss/blob/master/examples/app/test.js">test app</a> that illustrates how to use the <a href="https://www.npmjs.com/package/daverss">package</a> in a Node app. 

#### v0.5.4 -- 7/4/17 by DW

Bring in support for Facebook Instant Articles feeds. 

#### v0.4.14 -- 6/9/17 by DW

Per Dan MacTough's suggestion, in the JSON version, the length attribute on enclosure should be a number. If it coerces to a number, great, if there's an error, leave out the length property. 

#### v0.4.8 -- 5/29/17 by DW

Change name of rss.getRssEnclosureInfo to rss.getEnclosureInfo. 

#### v0.4.2 -- 5/29/17 by DW

Major code review, bring it up to date with my latest software. Also includes buildJsonFeed which generates a 1-1 equivalent of the RSS feed, but using JSON instead of XML. I plan to support this format in <a href="http://scripting.com/">Scripting News</a>.

