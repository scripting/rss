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
exports.cloudPing = cloudPing;

function filledString (ch, ct) {
	var s = "";
	for (var i = 0; i < ct; i++) {
		s += ch;
		}
	return (s);
	}
function encodeXml (s) { 
	if (s === undefined) { //1/9/16 by DW
		return ("");
		}
	else {
		var charMap = {
			'<': '&lt;',
			'>': '&gt;',
			'&': '&amp;',
			'"': '&'+'quot;'
			};
		s = s.toString();
		s = s.replace(/\u00A0/g, " ");
		var escaped = s.replace(/[<>&"]/g, function(ch) {
			return charMap [ch];
			});
		return escaped;
		}
	}
function trimWhitespace (s) { 
	function isWhite (ch) {
		switch (ch) {
			case " ": case "\r": case "\n": case "\t":
				return (true);
			}
		return (false);
		}
	if (s === undefined) { //9/10/14 by DW
		return ("");
		}
	while (isWhite (s.charAt (0))) {
		s = s.substr (1);
		}
	while (s.length > 0) {
		if (!isWhite (s.charAt (0))) {
			break;
			}
		s = s.substr (1);
		}
	while (s.length > 0) {
		if (!isWhite (s.charAt (s.length - 1))) {
			break;
			}
		s = s.substr (0, s.length - 1);
		}
	return (s);
	}
function twTwitterDateToGMT (twitterDate) { 
	return (new Date (twitterDate).toGMTString ());
	}
function getBoolean (val) { 
	switch (typeof (val)) {
		case "string":
			if (val.toLowerCase () == "true") {
				return (true);
				}
			break;
		case "boolean":
			return (val);
		case "number":
			if (val == 1) {
				return (true);
				}
			break;
		}
	return (false);
	}

var urlGetRssEnclosureInfo = "http://pub2.fargo.io:5347/getEnclosureInfo?url=";


var rssCloudDefaults = { //6/5/15 by DW
	domain: "rpc.rsscloud.io",
	port: 5337,
	path: "/pleaseNotify"
	}
function rssCloudPing (urlServer, urlFeed) { //6/5/15 by DW
	if (urlServer === undefined) {
		urlServer = "http://" + rssCloudDefaults.domain + ":" + rssCloudDefaults.port + rssCloudDefaults.path;
		}
	$.post (urlServer, {url: urlFeed}, function (data, status) {
		console.log ("rssCloudPing: urlServer == " + urlServer + ", urlFeed == " + urlFeed + ", status == " + status);
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
function buildRssFeed (headElements, historyArray) {
	function encode (s) {
		var lines = encodeXml (s).split (String.fromCharCode (10));
		var returnedstring = "";
		for (var i = 0; i < lines.length; i++) {
			returnedstring += trimWhitespace (lines [i]);
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
			htmltext += filledString ("\t", indentlevel) + s + "\n";
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
	function whenMostRecentTweet () {
		if (historyArray.length > 0) {
			return (new Date (historyArray [0].when));
			}
		else {
			return (new Date (0));
			}
		}
	function buildOutlineXml (theOutline) {
		function addOutline (outline) {
			var s = "<source:outline";
			function hasSubs (outline) {
				return (outline.subs != undefined) && (outline.subs.length > 0);
				}
			function addAtt (name) {
				if (outline [name] != undefined) {
					s += " " + name + "=\"" + encode (outline [name]) + "\" ";
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
	function markdownProcess (s) { //7/24/15 by DW
		var md = new Markdown.Converter (), theList = s.split ("</p><p>"), markdowntext = "";
		for (var i = 0; i < theList.length; i++) {
			var lt = theList [i];
			if ((lt.length > 0) && (lt != "<p>") && (lt != "</p>")) {
				markdowntext += "<p>" + md.makeHtml (lt) + "</p>";
				}
			}
		return (markdowntext);
		}
	var xmltext = "", indentlevel = 0, starttime = new Date (); nowstring = starttime.toGMTString ();
	var username = headElements.twitterScreenName, maxitems = headElements.maxFeedItems, contentNamespaceDecl = "", facebookNamespaceDecl = "";
	function add (s) {
		xmltext += filledString ("\t", indentlevel) + s + "\n";
		}
	function addAccount (servicename, username) {
		if ((username != undefined) && (username.length > 0)) { 
			add ("<source:account service=\"" + encode (servicename) + "\">" + encode (username) + "</source:account>");
			}
		}
	add ("<?xml version=\"1.0\"?>")
	add ("<!-- RSS generated by " + headElements.generator + " on " + nowstring + " -->")
	
	if (getBoolean (headElements.flUseContentEncoded)) { //2/22/16 by DW
		contentNamespaceDecl = " xmlns:content=\"http://purl.org/rss/1.0/modules/content/\"";
		}
	if (getBoolean (headElements.flFacebookEncodeContent)) { //3/7/16 by DW
		facebookNamespaceDecl = " xmlns:IA=\"http://rss2.io/ia/\"";
		}
	
	add ("<rss version=\"2.0\" xmlns:source=\"http://source.smallpict.com/2014/07/12/theSourceNamespace.html\"" + contentNamespaceDecl + facebookNamespaceDecl + ">"); indentlevel++
	add ("<channel>"); indentlevel++;
	//add header elements
		add ("<title>" + encode (headElements.title) + "</title>");
		add ("<link>" + encode (headElements.link) + "</link>");
		add ("<description>" + encode (headElements.description) + "</description>");
		add ("<pubDate>" + whenMostRecentTweet ().toUTCString () + "</pubDate>"); 
		add ("<lastBuildDate>" + nowstring + "</lastBuildDate>");
		add ("<language>" + encode (headElements.language) + "</language>");
		add ("<generator>" + headElements.generator + "</generator>");
		add ("<docs>" + headElements.docs + "</docs>");
		
		//<cloud> element -- 6/5/15 by DW
			if (headElements.flRssCloudEnabled) {
				add ("<cloud domain=\"" + headElements.rssCloudDomain + "\" port=\"" + headElements.rssCloudPort + "\" path=\"" + headElements.rssCloudPath + "\" registerProcedure=\"" + headElements.rssCloudRegisterProcedure + "\" protocol=\"" + headElements.rssCloudProtocol + "\" />")
				}
		
		addAccount ("twitter", username); 
	//add items
		var ctitems = 0;
		for (var i = 0; (i < historyArray.length) && (ctitems < maxitems); i++) {
			var item = historyArray [i];
			if ((!getBoolean (headElements.flTitledItemsOnly)) || (item.title !== undefined)) { //2/22/16 by DW
				var itemcreated = twTwitterDateToGMT (item.when), itemtext = encode (item.text);
				var linktotweet = encode ("https://twitter.com/" + username + "/status/" + item.idTweet);
				add ("<item>"); indentlevel++;
				if (item.title !== undefined) { //3/4/15 by DW
					add ("<title>" + encode (item.title) + "</title>"); 
					}
				//description -- 3/26/15 by DW
					function addDescriptionElement (s) {
						add ("<description>" + encode (s) + "</description>");
						if (getBoolean (headElements.flUseContentEncoded)) {
							add ("<content:encoded><![CDATA["); indentlevel++;
							if (getBoolean (headElements.flFacebookEncodeContent)) {
								s = facebookEncodeContent (item, s);
								}
							add (s);
							add ("]]></content:encoded>"); indentlevel--;
							}
						}
					if (getBoolean (item.flMarkdown)) {
						if (getBoolean (item.flPgfLevelMarkdown)) { //7/24/15 by DW
							addDescriptionElement (markdownProcess (item.text));
							}
						else {
							addDescriptionElement (new Markdown.Converter ().makeHtml (item.text));
							}
						}
					else {
						addDescriptionElement (item.text);
						}
				add ("<pubDate>" + itemcreated + "</pubDate>"); 
				//link -- 8/12/14 by DW
					if (item.link != undefined) {
						add ("<link>" + encode (item.link) + "</link>"); 
						}
					else {
						add ("<link>" + linktotweet + "</link>"); 
						}
				//source:linkShort -- 8/26/14 by DW
					if (item.linkShort != undefined) {
						add ("<source:linkShort>" + encode (item.linkShort) + "</source:linkShort>"); 
						}
				//guid -- 8/12/14 by DW
					if (item.guid != undefined) {
						if (getBoolean (item.guid.flPermalink)) {
							add ("<guid>" + encode (item.guid.value) + "</guid>"); 
							}
						else {
							add ("<guid isPermaLink=\"false\">" + encode (item.guid.value) + "</guid>"); 
							}
						}
					else {
						add ("<guid>" + linktotweet + "</guid>"); 
						}
				//enclosure -- 8/11/14 by DW
					if (item.enclosure != undefined) {
						var enc = item.enclosure;
						if ((enc.url != undefined) && (enc.type != undefined) && (enc.length != undefined)) {
							add ("<enclosure url=\"" + enc.url + "\" type=\"" + enc.type + "\" length=\"" + enc.length + "\"/>");
							}
						}
				//source:markdown -- 3/26/15 by DW
					if (getBoolean (item.flMarkdown)) {
						add ("<source:markdown>" + itemtext + "</source:markdown>"); 
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


function cloudPing (urlServer, urlFeed) {
	var outgoingData = {
		url: urlFeed
		};
	var rq = {
		uri: urlServer,
		body: querystring.stringify (outgoingData)
		};
	request.post (rq, function (err, res, body) {
		});
	pingCommunityServer (urlFeed); //4/3/16 by DW
	}
