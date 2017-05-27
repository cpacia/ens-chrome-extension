var background = chrome.extension.getBackgroundPage();
var ws = new WebSocket("ws://localhost:31313/ws");
ws.onmessage = function (evt) { 
    if (evt.data != "Node initializing..." && evt.data != "Fully synced") {
        document.getElementById("syncProgress").value = evt.data;
    } else if (evt.data == "Fully synced") {
        chrome.tabs.getCurrent(function (tab) {
			chrome.tabs.update(tab.id, {url: background.transferUrl});
            ws.close()
		});
    }
};
