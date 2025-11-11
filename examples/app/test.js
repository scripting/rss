const fs = require ("fs");
const rss = require ("daverss");

var headElements = { 
	"title": "Dave's Radio3 linkblog feed",
	"link": "http://scripting.com/?tab=links",
	"description": "Just an example for the daverss package.",
	"language": "en-us",
	"generator": "Radio3 v0.7.6",
	"docs": "http://cyber.law.harvard.edu/rss/rss.html",
	"twitterScreenName": "davewiner",
	"facebookPageName": "Scripting News",
	"maxFeedItems": 25,
	"flRssCloudEnabled": true,
	"rssCloudDomain": "rpc.rsscloud.io",
	"rssCloudPort": 5337,
	"rssCloudPath": "/pleaseNotify",
	"rssCloudRegisterProcedure": "",
	"rssCloudProtocol": "http-post",
	"flSourceMarkdown": true //11/10/25 by DW
	};
var historyArray = [
	{
		"text": "The <b>Associated</b> <i>Press</i> is adding user-generated social content into its wire services.",
		"title": "",
		"link": "http://www.niemanlab.org/2017/05/the-associated-press-is-adding-user-generated-social-content-verified-of-course-into-its-wire-services/?utm_source=feedburner&utm_medium=feed&utm_campaign=Feed:+NiemanJournalismLab+(Nieman+Journalism+Lab)",
		"linkShort": "http://bit.ly/2qoz8i6",
		"when": "2017-05-16T16:47:07.045Z",
		"guid": {
			"flPermalink": true,
			"value": "http://www.niemanlab.org/2017/05/the-associated-press-is-adding-user-generated-social-content-verified-of-course-into-its-wire-services/?utm_source=feedburner&utm_medium=feed&utm_campaign=Feed:+NiemanJournalismLab+(Nieman+Journalism+Lab)"
			},
		"idTweet": "864522615880380419",
		"twitterScreenName": "davewiner",
		},
	{
		"text": "If Donald Trump Were a C.E.O., He'd Probably Be Fired Today.",
		"title": "",
		"link": "http://www.newyorker.com/news/john-cassidy/if-donald-trump-were-a-c-e-o-hed-probably-be-fired-today?mbid=rss",
		"linkShort": "http://bit.ly/2qoxxce",
		"when": "2017-05-16T16:44:25.731Z",
		"guid": {
			"flPermalink": true,
			"value": "http://www.newyorker.com/news/john-cassidy/if-donald-trump-were-a-c-e-o-hed-probably-be-fired-today?mbid=rss"
			},
		"idTweet": "864521938814857216",
		"twitterScreenName": "davewiner"
		},
	{
		"text": "\"The national media and the Democratic Party have gone stark raving mad over President Trump's election victory.\"",
		"title": "Articles: The Media-Democratic Party Suicide Pact",
		"link": "http://www.americanthinker.com/articles/2017/05/the_mediademocratic_party_suicide_pact.html",
		"linkShort": "http://bit.ly/2qo7Jga",
		"when": "2017-05-16T15:15:22.150Z",
		"guid": {
			"flPermalink": true,
			"value": "http://www.americanthinker.com/articles/2017/05/the_mediademocratic_party_suicide_pact.html"
			},
		"idTweet": "864499528577187840",
		"twitterScreenName": "davewiner"
		},
	{
		"text": "El Presidente or Baby Huey?",
		"title": "",
		"link": "https://en.wikipedia.org/wiki/Baby_Huey",
		"linkShort": "http://bit.ly/2rmsfen",
		"when": "2017-05-16T15:09:13.816Z",
		"guid": {
			"flPermalink": true,
			"value": "https://en.wikipedia.org/wiki/Baby_Huey"
			},
		"idTweet": "864497981080383488",
		"twitterScreenName": "davewiner"
		},
	{
		"text": "McConnell: Trump 'Drama' Distracts From Taxes, Deregulation, Health Care. #silverlining",
		"title": "",
		"link": "http://talkingpointsmemo.com/livewire/mitch-mcconnell-trump-drama?utm_content=buffer53d00&utm_medium=social&utm_source=twitter.com&utm_campaign=buffer",
		"linkShort": "http://bit.ly/2qo8iGS",
		"when": "2017-05-16T15:04:20.583Z",
		"guid": {
			"flPermalink": true,
			"value": "http://talkingpointsmemo.com/livewire/mitch-mcconnell-trump-drama?utm_content=buffer53d00&utm_medium=social&utm_source=twitter.com&utm_campaign=buffer"
			},
		"idTweet": "864496750853226497",
		"twitterScreenName": "davewiner"
		}
	]

var xmltext = rss.buildRssFeed (headElements, historyArray); //generate the RSS feed from the data
fs.writeFile ("rss.xml", xmltext, function (err) {
	if (err) {
		console.log (err.message);
		}
	else {
		console.log ("rss.xml successfully created.");
		}
	});

