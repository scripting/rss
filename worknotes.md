#### 11/10/25; 11:09:22 AM by DW

Support source:markdown.

When building a feed, if there's headElement.flSourceMarkdown and it's true, and there is a text value for the item, we generate a source:markdown element by calling turndown to convert it. 

Note, there was previous source:markdown support dating back to 2022, which looked for item.markdowntext. It's good in case the feed is being generated for an editor where the user wrote in markdown, it's not being generated. 

In package.json, the version of turndown is 7.2.2. Learned the lesson many times the hard way to always require the version of a package that you used to implement the functionality and not to use "*" because developers implement breaking changes in the most trivial packages (not that turndown is trivial but it may include them). 

#### 6/4/25; 11:02:52 AM by DW

When building the <image> element, we were adding the description twice. Fixed.

#### 12/4/24; 10:54:13 AM by DW

Added support for <webmaster>.

#### 6/17/24; 5:49:33 PM by DW

Add support for <itunes:author> and <itunes:type>.

#### 5/20/24; 5:00:37 PM by DW

Add support for <source:self>.

#### 3/14/24; 1:23:03 PM by DW

Support for <source:blogroll> element.

#### 4/4/23; 10:05:50 AM by DW

Stopped generating a <source:outline> element for enclosures that are images. 

#### 3/21/23; 9:48:11 AM by DW

Allow for source:account elements for items that are not twitter identifiers.

#### 12/29/21; 9:16:55 AM by DW

Changed the value of rssCloudDefaults.path to /ping. Andrew Shell posted an issue saying that the path previously specified there was incorrect. Andrew operates the server, so is the authority on this. 

#### 7/31/19; 11:00:42 AM by DW

Add support for <author> sub-element of item.

#### 5/16/19; 12:46:50 PM by DW

Don't write out a subs att for source:outline elements. 

#### 12/18/18; 10:19:04 AM by DW

support source:account for items

support category element

must provide an array called categories

each item in the array is a category

#### 7/4/17; 12:39:05 PM by DW

Bring in support for Facebook Instant Articles feeds. 

#### 6/28/17; 10:25:32 AM by DW

In buildOutlineXml we only looked for four atts: type, text, created and name. But there are other types. I don't see any notes explaining why we were only exporting these. So I've changed it to export all atts that are present. 

#### 6/9/17; 7:45:09 AM by DW

Per Dan MacTough's suggestion, in the JSON version, the length attribute on enclosure should be a number. If it coerces to a number, great, if there's an error, leave out the length att. 

#### 5/28/17; 2:00:55 PM by DW

Forked from buildrss.js in libraries. There was lots of buggy cruft in here, I wanted to fix stuff, but without taking chances on breaking basically frozen apps like Radio3, LCE.

Removed rssCloudPing.

#### 3/8/17; 4:24:13 PM by DW

Copied rssCloudPing from Radio3. I didn't want to copy the code into ElectricPork.

Use rssCloudDefaults in producing your RSS feed. If you don't specify a server URL in the call to rssCloudPing, we'll use what's in rssCloudDefaults to form the URL.

