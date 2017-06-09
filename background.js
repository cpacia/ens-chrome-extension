// Based off github.com/Tagide/chrome-bit-domain-extension
chrome.runtime.connectNative("enslite");
var transferUrl = "";

chrome.windows.onRemoved.addListener(function(windowId){
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:31313/resolver/dns/", false);
    xhr.send();
});

function sleep(milliseconds, bithost) {
	// synchronous XMLHttpRequests from Chrome extensions are not blocking event handlers. That's why we use this
	// pretty little sleep function to try to get the IP of a .eth domain before the request times out.
	var start = new Date().getTime();
	for (var i = 0; i < 1e7; i++) {
		if (((new Date().getTime() - start) > milliseconds) || (sessionStorage.getItem(bithost) != null)){
			break;
		}
	}
}

// run script when a request is about to occur
chrome.webRequest.onBeforeRequest.addListener(function (details) {
	// get the parts of the url (hostname, port) by creating an 'a' element
	var parser = document.createElement('a');
	parser.href = details.url;
	
	// Make sure the domain ends with .eth.
	var tld = parser.hostname.slice(-3);
	if (tld != 'eth') {
		return;
	};
	
	var bithost = parser.hostname;
	var port = (parser.protocol == "https:" ? "443" : "80");
	var access = (parser.protocol == "https:" ? "HTTPS" : "PROXY");

	// This .eth domain is not in cache, get the IP from the resolver
	var xhr = new XMLHttpRequest();
	var url = "http://localhost:31313/resolver/"+bithost;
	// synchronous XMLHttpRequest is actually asynchronous
	// check out https://developer.chrome.com/extensions/webRequest
	xhr.open("GET", url, false);
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			// Get the ip address returned from the DNS proxy server.
			var bitip = xhr.responseText;
			// store the IP for .eth hostname in the local cache which is reset on each browser restart
			sessionStorage.setItem(bithost, bitip);
		}
	}
	xhr.send();
	// block the request until the new proxy settings are set. Block for up to two seconds.
	sleep(2000, bithost);
        // 503 means were syncing with the ethereum network. Show loading screen.
        if (xhr.status == 503) {
            transferUrl = details.url;
            return {redirectUrl: chrome.extension.getURL("sync.html")};
        }
	
	// Get the IP from the session storage.
	var bitip = sessionStorage.getItem(bithost);
	var config = {
		mode: "pac_script",
		pacScript: {
			data: "function FindProxyForURL(url, host) {\n" +
			"  if (dnsDomainIs(host, '"+bithost+"'))\n" +
			"    return '"+access+" "+bitip+":"+port+"';\n" +
			"  return 'DIRECT';\n" +
			"}"
		}
	};
	chrome.proxy.settings.set({value: config, scope: 'regular'},function() {});
	console.log('IP '+bitip+' for '+bithost+' found, config is changed: '+JSON.stringify(config));
	
}, { urls: ["<all_urls>"] }, ["blocking"]);
