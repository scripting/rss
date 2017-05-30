/*  The MIT License (MIT)
	Copyright (c) 2014-2017 Dave Winer
	
	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:
	
	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.
	
	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	SOFTWARE.
	*/

exports.buildRssFeed = buildRssFeed;
exports.buildJsonFeed = buildJsonFeed;
exports.getEnclosureInfo = getRssEnclosureInfo;
exports.cloudPing = cloudPing;

const utils = require ("daveutils");
const dateFormat = require ("dateformat");
const marked = require ("marked"); 
const querystring = require ("querystring");
const request = require ("request");

var urlSourceNamespace = "http://source.scripting.com/";
var urlGetRssEnclosureInfo = "http://pub2.fargo.io:5347/getEnclosureInfo?url=";
var rssCloudDefaults = { 
	domain: "rpc.rsscloud.io",
	port: 5337,
	path: "/pleaseNotify"
	}
var localTimeFormat = "ddd, mmmm d, yyyy h:MM TT Z";

function cloudPing (urlServer, urlFeed) {
	if (urlServer === undefined) {
		urlServer = "http://" + rssCloudDefaults.domain + ":" + rssCloudDefaults.port + rssCloudDefaults.path;
		}
	var outgoingData = {
		url: urlFeed
		};
	var rq = {
		uri: urlServer,
		body: querystring.stringify (outgoingData)
		};
	request.post (rq, function (err, res, body) {
		});
	}
function getRssEnclosureInfo (obj, callback) {
	var jxhr = $.ajax ({ 
		url: urlGetRssEnclosureInfo + encodeURIComponent (obj.enclosure.url),
		dataType: "jsonp", 
		timeout: 30000,
		jsonpCallback : "getData"
		}) 
	.success (function (data, status) { 
		if (data.flError != undefined) { //2/15/14 by DW
			obj.enclosure.flError = true;
			}
		else {
			obj.enclosure.type = data.type;
			obj.enclosure.length = data.length;
			if (callback != undefined) {
				callback ();
				}
			}
		}) 
	.error (function (status) { 
		console.log ("getEnclosureInfo: Error getting type and length -- " + jsonStringify (status));
		obj.enclosure.flError = true;
		});
	}
function markdownProcess (s) {
	var renderer = new marked.Renderer ();
	renderer.paragraph = function (s) {
		return (s);
		};
	var options = {
		renderer: renderer
		};
	return (marked (s, options));
	}
function whenMostRecentItem (historyArray) {
	var ixMostRecent, whenMostRecent = new Date (0);
	for (var i = 0; i < historyArray.length; i++) {
		var when = new Date (historyArray [i].when);
		if (when > whenMostRecent) {
			whenMostRecent = when;
			ixMostRecent = i;
			}
		}
	return (whenMostRecent);
	}
function timeToString (when) {
	return (new Date (when).toGMTString ());
	}
function buildRssFeed (headElements, historyArray) {
	function encode (s) {
		var lines = utils.encodeXml (s).split (String.fromCharCode (10));
		var returnedstring = "";
		for (var i = 0; i < lines.length; i++) {
			returnedstring += utils.trimWhitespace (lines [i]);
			if (i < (lines.length - 1)) {
				returnedstring += "&#10;";
				}
			}
		return (returnedstring);
		}
	function facebookEncodeContent (item, bodystring) {
		
		var htmltext = "";
		function multipleReplaceAll (s, adrTable, flCaseSensitive, startCharacters, endCharacters) { 
			if(flCaseSensitive===undefined){
				flCaseSensitive = false;
				}
			if(startCharacters===undefined){
				startCharacters="";
				}
			if(endCharacters===undefined){
				endCharacters="";
				}
			for( var item in adrTable){
				var replacementValue = adrTable[item];
				var regularExpressionModifier = "g";
				if(!flCaseSensitive){
					regularExpressionModifier = "gi";
					}
				var regularExpressionString = (startCharacters+item+endCharacters).replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
				var regularExpression = new RegExp(regularExpressionString, regularExpressionModifier);
				s = s.replace(regularExpression, replacementValue);
				}
			return s;
			}
		function massageHtml (s) {
			var replaceTable = {
				"<h4>": "<h2>",
				"</h4>": "</h2>",
				"<p></p>": ""
				};
			return (multipleReplaceAll (s, replaceTable, false)); 
			}
		function add (s) {
			htmltext += utils.filledString ("\t", indentlevel) + s + "\n";
			}
		function formatDate (d) {
			
			return (""); //temp hack
			
			d = new Date (d);
			return (d.toLocaleDateString () + "; " + d.toLocaleTimeString ());
			}
		add ("");
		add ("<!doctype html>");
		add ("<html lang=\"en\" prefix=\"op: http://media.facebook.com/op#\">"); indentlevel++;
		//head
			add ("<head>"); indentlevel++;
			add ("<meta charset=\"utf-8\">");
			add ("<meta property=\"op:markup_version\" content=\"v1.0\">");
			add ("<meta property=\"fb:article_style\" content=\"default\">"); //2/24/16 by DW
			add ("<link rel=\"canonical\" href=\"" + item.link + "\">");
			add ("</head>"); indentlevel--;
		//body
			add ("<body>"); indentlevel++;
			add ("<article>"); indentlevel++;
			add ("<header>"); indentlevel++;
			add ("<h1>" + item.title + "</h1>");
			add ("<time class=\"op-published\" datetime=\"" + new Date (item.when).toISOString () + "\">" + formatDate (item.when) + "</time>");
			if (item.whenupdate !== undefined) {
				add ("<time class=\"op-modified\" dateTime=\"" + new Date (item.whenupdate).toISOString () + "\">" + formatDate (item.whenupdate) + "</time>");
				}
			add ("<address><a>" + item.name + "</a></address>"); //2/24/16 by DW
			add (massageHtml (bodystring));
			add ("</header>"); indentlevel--;
			add ("</article>"); indentlevel--;
			add ("</body>"); indentlevel--;
		add ("</html>"); indentlevel--;
		return (htmltext);
		}
	function buildOutlineXml (theOutline) {
		function addOutline (outline) {
			var s = "<source:outline";
			function hasSubs (outline) {
				return (outline.subs != undefined) && (outline.subs.length > 0);
				}
			function addAtt (name) {
				if (outline [name] != undefined) {
					s += " " + name + "=\"" + encode (outline [name]) + "\"";
					}
				}
			addAtt ("text");
			addAtt ("type");
			addAtt ("created");
			addAtt ("name");
			
			if (hasSubs (outline)) {
				add (s + ">");
				indentlevel++;
				for (var i = 0; i < outline.subs.length; i++) {
					addOutline (outline.subs [i]);
					}
				add ("</source:outline>");
				indentlevel--;
				}
			else {
				add (s + "/>");
				}
			
			}
		addOutline (theOutline);
		return (xmltext);
		}
	var xmltext = "", indentlevel = 0, now = new Date (); nowstring = now.toGMTString ();
	var username = headElements.twitterScreenName, maxitems = headElements.maxFeedItems, contentNamespaceDecl = "", facebookNamespaceDecl = "";
	function add (s) {
		xmltext += utils.filledString ("\t", indentlevel) + s + "\n";
		}
	function addAccount (servicename, username) {
		if ((username != undefined) && (username.length > 0)) { 
			add ("<source:account service=\"" + encode (servicename) + "\">" + encode (username) + "</source:account>");
			}
		}
	add ("<?xml version=\"1.0\"?>")
	add ("<!-- RSS generated by " + headElements.generator + " on " + nowstring + " -->")
	
	if (utils.getBoolean (headElements.flUseContentEncoded)) { //2/22/16 by DW
		contentNamespaceDecl = " xmlns:content=\"http://purl.org/rss/1.0/modules/content/\"";
		}
	if (utils.getBoolean (headElements.flFacebookEncodeContent)) { //3/7/16 by DW
		facebookNamespaceDecl = " xmlns:IA=\"http://rss2.io/ia/\"";
		}
	
	add ("<rss version=\"2.0\" xmlns:source=\"" + urlSourceNamespace + "\"" + contentNamespaceDecl + facebookNamespaceDecl + ">"); indentlevel++
	add ("<channel>"); indentlevel++;
	//add header elements
		
		function addIfDefined (name, value) {
			if (value !== undefined) {
				add ("<" + name + ">" + encode (value) + "</" + name + ">");
				}
			}
		addIfDefined ("title", headElements.title);
		addIfDefined ("link", headElements.link);
		addIfDefined ("description", headElements.description);
		add ("<pubDate>" + whenMostRecentItem (historyArray).toUTCString () + "</pubDate>"); 
		addIfDefined ("language", headElements.language);
		addIfDefined ("generator", headElements.generator);
		addIfDefined ("copyright", headElements.copyright);
		addIfDefined ("docs", headElements.docs);
		add ("<lastBuildDate>" + nowstring + "</lastBuildDate>");
		//<cloud> element -- 6/5/15 by DW
			if (headElements.flRssCloudEnabled) {
				add ("<cloud domain=\"" + headElements.rssCloudDomain + "\" port=\"" + headElements.rssCloudPort + "\" path=\"" + headElements.rssCloudPath + "\" registerProcedure=\"" + headElements.rssCloudRegisterProcedure + "\" protocol=\"" + headElements.rssCloudProtocol + "\" />")
				}
		addAccount ("twitter", username); 
		addAccount ("facebook", headElements.ownerFacebookAccount); 
		addAccount ("github", headElements.ownerGithubAccount); 
		addAccount ("linkedin", headElements.ownerLinkedinAccount); 
		add ("<source:localTime>" + dateFormat (now, localTimeFormat) + "</source:localTime>");
	//add items
		var ctitems = 0;
		for (var i = 0; (i < historyArray.length) && (ctitems < maxitems); i++) {
			var item = historyArray [i];
			if ((!utils.getBoolean (headElements.flTitledItemsOnly)) || (item.title !== undefined)) { //2/22/16 by DW
				var itemcreated = timeToString (item.when), itemtext = encode (item.text);
				var linktotweet = encode ("https://twitter.com/" + username + "/status/" + item.idTweet);
				add ("<item>"); indentlevel++;
				if (item.title !== undefined) {
					add ("<title>" + encode (item.title) + "</title>"); 
					}
				if (item.text !== undefined) {
					var theDescription = item.text;
					if (item.outline !== undefined) {
						switch (item.outline.type) {
							case "markdown":
								theDescription = markdownProcess (theDescription);
								break;
							}
						}
					add ("<description>" + encode (theDescription) + "</description>"); 
					}
				add ("<pubDate>" + itemcreated + "</pubDate>"); 
				if (item.link !== undefined) {
					add ("<link>" + encode (item.link) + "</link>"); 
					}
				//source:linkShort -- 8/26/14 by DW
					if (item.linkShort !== undefined) {
						add ("<source:linkShort>" + encode (item.linkShort) + "</source:linkShort>"); 
						}
				//guid -- 8/12/14 by DW
					if (item.guid != undefined) {
						if (utils.getBoolean (item.guid.flPermalink)) {
							add ("<guid>" + encode (item.guid.value) + "</guid>"); 
							}
						else {
							add ("<guid isPermaLink=\"false\">" + encode (item.guid.value) + "</guid>"); 
							}
						}
				//enclosure -- 8/11/14 by DW
					if (item.enclosure != undefined) {
						var enc = item.enclosure;
						if ((enc.url != undefined) && (enc.type != undefined) && (enc.length != undefined)) {
							add ("<enclosure url=\"" + enc.url + "\" type=\"" + enc.type + "\" length=\"" + enc.length + "\"/>");
							}
						}
				//source:jsonUrl -- 3/24/15 by DW
					if (item.linkJson !== undefined) {
						add ("<source:linkJson>" + encode (item.linkJson) + "</source:linkJson>"); 
						}
				//source:outline
					if (item.outline != undefined) { //10/15/14 by DW
						buildOutlineXml (item.outline);
						}
					else {
						var outlineTextAtt = itemtext; //12/14/16 by DW
						if (item.title !== undefined) {
							if (item.title.length > 0) {
								outlineTextAtt = encode (item.title);
								}
							}
						if (item.idTweet != undefined) {
							add ("<source:outline text=\"" + outlineTextAtt + "\" created=\"" + itemcreated + "\" type=\"tweet\" tweetId=\"" + item.idTweet + "\" tweetUserName=\"" + encode (item.twitterScreenName) + "\"/>");
							}
						else { //12/14/16 by DW
							if (item.enclosure != undefined) { //9/23/14 by DW
								var enc = item.enclosure;
								if (enc.type != undefined) { //10/25/14 by DW
									if (beginsWith (enc.type.toLowerCase (), "image")) {
										add ("<source:outline text=\"" + outlineTextAtt + "\" created=\"" + itemcreated + "\" type=\"image\" url=\"" + enc.url + "\"/>");
										}
									}
								}
							}
						}
				add ("</item>"); indentlevel--;
				ctitems++;
				}
			}
	add ("</channel>"); indentlevel--;
	add ("</rss>"); indentlevel--;
	return (xmltext);
	}
function buildJsonFeed (headElements, historyArray) {
	var now = new Date (); nowstring = now.toGMTString ();
	var username = headElements.twitterScreenName, maxitems = headElements.maxFeedItems;
	function addAccount (servicename, username) {
		if ((username != undefined) && (username.length > 0)) { 
			var accounts;
			if (jstruct.rss.channel ["source:account"] === undefined) {
				jstruct.rss.channel ["source:account"] = new Array ();
				}
			accounts = jstruct.rss.channel ["source:account"];
			accounts [accounts.length] = {
				service: servicename,
				"#value": username
				};
			}
		}
	var jstruct = {
		rss: {
			version: "2.0",
			"xmlns:source": urlSourceNamespace,
			channel: {
				title: headElements.title,
				link: headElements.link,
				description: headElements.description,
				pubDate: whenMostRecentItem (historyArray).toUTCString (),
				lastBuildDate: nowstring,
				language: headElements.language,
				copyright: headElements.copyright,
				docs: headElements.docs,
				"source:localTime": dateFormat (now, localTimeFormat)
				}
			}
		};
	if (headElements.flRssCloudEnabled) {
		jstruct.rss.channel.cloud = {
			domain: headElements.rssCloudDomain,
			port: headElements.rssCloudPort,
			path: headElements.rssCloudPath,
			registerProcedure: headElements.rssCloudRegisterProcedure,
			protocol: headElements.rssCloudProtocol
			};
		}
	addAccount ("twitter", username); 
	addAccount ("facebook", headElements.ownerFacebookAccount); 
	addAccount ("github", headElements.ownerGithubAccount); 
	addAccount ("linkedin", headElements.ownerLinkedinAccount); 
	//add items
		var ctitems = 0, items = jstruct.rss.channel.item = new Array ();
		for (var i = 0; (i < historyArray.length) && (ctitems < maxitems); i++) {
			var item = historyArray [i], feedItem = new Object ();
			if ((!utils.getBoolean (headElements.flTitledItemsOnly)) || (item.title !== undefined)) { //2/22/16 by DW
				var itemcreated = timeToString (item.when);
				feedItem.title = item.title;
				feedItem.link = item.link;
				//description
					feedItem.description  = item.text;
					if (item.outline !== undefined) {
						switch (item.outline.type) {
							case "markdown":
								feedItem.description = markdownProcess (feedItem.description);
								break;
							}
						}
				feedItem.pubDate = itemcreated;
				
				//guid
					if (item.guid !== undefined) {
						if (utils.getBoolean (item.guid.flPermalink)) {
							feedItem.guid = item.guid.value;
							}
						else {
							feedItem.guid = {
								isPermaLink: false,
								"#value": item.guid.value
								};
							}
						}
				//enclosure
					if (item.enclosure !== undefined) {
						var enc = item.enclosure;
						if ((enc.url !== undefined) && (enc.type !== undefined) && (enc.length !== undefined)) {
							feedItem.enclosure = {
								url: enc.url,
								type: enc.type,
								length: enc.length
								};
							}
						}
				//source:markdown
					if (utils.getBoolean (item.flMarkdown)) {
						feedItem ["source:markdown"] = item.text;
						}
				//source:jsonUrl
					if (item.linkJson !== undefined) {
						feedItem ["source:linkJson"] = item.linkJson;
						}
				//source:outline
				
				feedItem ["source:linkShort"] = item.linkShort;
				feedItem ["source:outline"] = item.outline;
				jstruct.rss.channel.item.push (feedItem);
				ctitems++;
				}
			}
	return (utils.jsonStringify (jstruct));
	}
