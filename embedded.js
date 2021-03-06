function qfdefer(method) {
	if (window.qfjq && qfjq) {
		setTimeout(function() { method() }, 250);
	} else {
		setTimeout(function() { qfdefer(method) }, 50);
	}
}

var go2anywhereIsShowing1 = false;
var lastFocused;
var sc = document.createElement("script");
sc.setAttribute("src", chrome.runtime.getURL('jquery-1.10.2.js'));
sc.setAttribute("type", "text/javascript");
document.head.appendChild(sc);

function messageHandler(request, sender, sendResponse){
	if (request.toggleGo2Anywhere == "true"){
		if(go2anywhereIsShowing1){
			document.getElementById("go2anywherePopup").remove();
			go2anywhereIsShowing1 = false;
			if(lastFocused)
				lastFocused.focus();
		}else{
			chrome.storage.local.get(['go2anywhere/selected_theme'], function(selected) {
				var iframe = document.createElement('iframe');
				var theme = selected['go2anywhere/selected_theme'];
				var w = "600px";
				var h = "450px";
				var ot = "10%";
				if(theme == 'fullscreen' || theme == 'previews' || theme == 'linepreviews'){
					w = "100%";
					h = "100%";
					ot = "0px";
				}
				iframe.id = "go2anywherePopup";
				iframe.src = chrome.runtime.getURL('ipopup.html');
				iframe.style.cssText = 'visibility:visible;position:fixed;top:'+ot+';left:0;right:0;display:block; background:#ffffff;' +
										'width:'+w+';height:'+h+';z-index:99999;margin-left: auto; margin-right: auto; overflow: hidden;';
				document.body.appendChild(iframe);
				go2anywhereIsShowing1 = true;

				lastFocused = document.activeElement;
				iframe.contentWindow.focus();
			});
		}
	}
}

chrome.runtime.onMessage.addListener(messageHandler);
