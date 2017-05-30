## daverss package

### How to install

`npm install daverss`

#### Story

This is where I put my JavaScript code to generate RSS feeds from my apps, running in the browser and in Node. 

I need to document the data structure, however in the meantime, here are examples of the two data structures you have to send to `buildRssFeed` to get it to build an RSS feed for you:

1. <a href="https://github.com/scripting/rss/blob/master/examples/radio3/headElements.json">headElements</a>

2. <a href="https://github.com/scripting/rss/blob/master/examples/radio3/historyArray.json">historyArray</a>

These examples are from a snapshot of the data for my Radio3 linkblog feed, which is built using this code.

#### Updates

##### v0.4.8 -- 5/29/17 by DW

Change name of rss.getRssEnclosureInfo to rss.getEnclosureInfo. 

##### v0.4.2 -- 5/29/17 by DW

Major code review, bring it up to date with my latest software. Also includes buildJsonFeed which generates a 1-1 equivalent of the RSS feed, but using JSON instead of XML. I plan to support this format in <a href="http://scripting.com/">Scripting News</a>.

