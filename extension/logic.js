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
