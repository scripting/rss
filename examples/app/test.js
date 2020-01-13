const fs = require ("fs");
const rss = require ("daverss");

var headElements = { 
	"title": "Dave Winer",
	"link": "http://scripting.com/",
	"description": "I started up blogging, podcasting, RSS 2.0, and software for all of that. I love outliners, JavaScript. I love to make new media. Read my blog! :-)",
	"language": "en-us",
	"generator": "Radio3 v0.76d",
	"docs": "http://cyber.law.harvard.edu/rss/rss.html",
	"twitterScreenName": "davewiner",
	"facebookPageName": "Scripting News",
	"maxFeedItems": 25,
	"appDomain": "radio3.io",
	"flRssCloudEnabled": true,
	"rssCloudDomain": "rpc.rsscloud.io",
	"rssCloudPort": 5337,
	"rssCloudPath": "/pleaseNotify",
	"rssCloudRegisterProcedure": "",
	"rssCloudProtocol": "http-post"
	};
var historyArray = [
	{
		"text": "The Associated Press is adding user-generated social content into its wire services.",
		"title": "",
		"link": "http://www.niemanlab.org/2017/05/the-associated-press-is-adding-user-generated-social-content-verified-of-course-into-its-wire-services/?utm_source=feedburner&utm_medium=feed&utm_campaign=Feed:+NiemanJournalismLab+(Nieman+Journalism+Lab)",
		"linkShort": "http://bit.ly/2qoz8i6",
		"whenLastEdit": "2017-05-16T17:11:14.375Z",
		"flDirty": false,
		"when": "2017-05-16T16:47:07.045Z",
		"guid": {
			"flPermalink": true,
			"value": "http://www.niemanlab.org/2017/05/the-associated-press-is-adding-user-generated-social-content-verified-of-course-into-its-wire-services/?utm_source=feedburner&utm_medium=feed&utm_campaign=Feed:+NiemanJournalismLab+(Nieman+Journalism+Lab)"
			},
		"fname": "posts/0016043.json",
		"idTweet": "864522615880380419",
		"twitterScreenName": "davewiner",
		"ctSends": 2,
		"whenLastSend": "2017-05-16T17:10:39.178Z",
		"idFacebookPost": "270259793181433_577437899130286",
		"urlFacebookPost": "https://www.facebook.com/dave.winer.12/posts/577437899130286"
		},
	{
		"text": "If Donald Trump Were a C.E.O., He'd Probably Be Fired Today.",
		"title": "",
		"link": "http://www.newyorker.com/news/john-cassidy/if-donald-trump-were-a-c-e-o-hed-probably-be-fired-today?mbid=rss",
		"linkShort": "http://bit.ly/2qoxxce",
		"whenLastEdit": "2017-05-16T16:44:25.731Z",
		"flDirty": false,
		"when": "2017-05-16T16:44:25.731Z",
		"guid": {
			"flPermalink": true,
			"value": "http://www.newyorker.com/news/john-cassidy/if-donald-trump-were-a-c-e-o-hed-probably-be-fired-today?mbid=rss"
			},
		"fname": "posts/0016042.json",
		"ctSends": 1,
		"whenLastSend": "2017-05-16T16:44:26.761Z",
		"idTweet": "864521938814857216",
		"twitterScreenName": "davewiner",
		"idFacebookPost": "270259793181433_577436092463800",
		"urlFacebookPost": "https://www.facebook.com/dave.winer.12/posts/577436092463800"
		},
	{
		"text": "\"The national media and the Democratic Party have gone stark raving mad over President Trump's election victory.\"",
		"title": "Articles: The Media-Democratic Party Suicide Pact",
		"link": "http://www.americanthinker.com/articles/2017/05/the_mediademocratic_party_suicide_pact.html",
		"linkShort": "http://bit.ly/2qo7Jga",
		"whenLastEdit": "2017-05-16T15:15:41.455Z",
		"flDirty": false,
		"when": "2017-05-16T15:15:22.150Z",
		"guid": {
			"flPermalink": true,
			"value": "http://www.americanthinker.com/articles/2017/05/the_mediademocratic_party_suicide_pact.html"
			},
		"ctSends": 2,
		"whenLastSend": "2017-05-16T15:15:42.122Z",
		"fname": "posts/0016041.json",
		"idTweet": "864499528577187840",
		"twitterScreenName": "davewiner",
		"idFacebookPost": "270259793181433_577400499134026",
		"urlFacebookPost": "https://www.facebook.com/dave.winer.12/posts/577400499134026"
		},
	{
		"text": "El Presidente or Baby Huey?",
		"title": "",
		"link": "https://en.wikipedia.org/wiki/Baby_Huey",
		"linkShort": "http://bit.ly/2rmsfen",
		"whenLastEdit": "2017-05-16T15:11:04.882Z",
		"flDirty": false,
		"when": "2017-05-16T15:09:13.816Z",
		"guid": {
			"flPermalink": true,
			"value": "https://en.wikipedia.org/wiki/Baby_Huey"
			},
		"ctSends": 2,
		"whenLastSend": "2017-05-16T15:11:05.193Z",
		"fname": "posts/0016040.json",
		"idTweet": "864497981080383488",
		"twitterScreenName": "davewiner",
		"idFacebookPost": "270259793181433_577399142467495",
		"urlFacebookPost": "https://www.facebook.com/dave.winer.12/posts/577399142467495"
		},
	{
		"text": "McConnell: Trump 'Drama' Distracts From Taxes, Deregulation, Health Care. #silverlining",
		"title": "",
		"link": "http://talkingpointsmemo.com/livewire/mitch-mcconnell-trump-drama?utm_content=buffer53d00&utm_medium=social&utm_source=twitter.com&utm_campaign=buffer",
		"linkShort": "http://bit.ly/2qo8iGS",
		"whenLastEdit": "2017-05-16T15:04:20.583Z",
		"flDirty": false,
		"when": "2017-05-16T15:04:20.583Z",
		"guid": {
			"flPermalink": true,
			"value": "http://talkingpointsmemo.com/livewire/mitch-mcconnell-trump-drama?utm_content=buffer53d00&utm_medium=social&utm_source=twitter.com&utm_campaign=buffer"
			},
		"ctSends": 1,
		"whenLastSend": "2017-05-16T15:04:21.237Z",
		"fname": "posts/0016039.json",
		"idTweet": "864496750853226497",
		"twitterScreenName": "davewiner",
		"idFacebookPost": "270259793181433_577397742467635",
		"urlFacebookPost": "https://www.facebook.com/dave.winer.12/posts/577397742467635"
		}
	]

var xmltext = rss.buildRssFeed (headElements, historyArray);
fs.writeFile ("rss.xml", xmltext, function (err) {
	if (err) {
		console.log (err.message);
		}
	});


