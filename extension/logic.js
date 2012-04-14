// history manipulation
function processHistory(){
	var histories = [];
	var visits = [];

	chrome.history.search({text : '', maxResults:0}, function(historyItems) {
	    var historiesProcessed = 0;
	    for (var i = 0; i < historyItems.length; i++) {
	        histories.push(historyItems[i]);
	        chrome.history.getVisits({url: historyItems[i].url}, function(visitItems) {
	            for (var i = 0; i < visitItems.length; i++) {
	                visits.push(visitItems[i]);
	            }
	            historiesProcessed++;
	            if (historiesProcessed === historyItems.length) {
	                console.log(visits.length + ' visits');
	            }
	        });
	    }
	    console.log(histories.length + ' histories');
	});
}

// request processing
//chrome.webRequest.onRequest.addListener( 
//	function(request) 
//	{
//		console.log("outgoing URL: " + request.url);
//	});

// will contain code that examines that local store
// containing tracker/host page links, computes probabilities,
// and displays them in popup.html
function processTrackersFromLocalStore(){
	for(var domain in localStorage){
		if(domain.startsWith('tracker:')){
			var urls = new Array();
			if(domain.substr(7, domain.length-7) == url){
				var json = JSON.parse(localStorage[domain]);
				for (var index in json) {
					for(i = 0; i < json.count ; i++){
						urls.push(json[index].domain);
					}
				}
			}
			processURLs(urls);
		}
	}
}

processTrackersFromLocalStore();