$(function() {
    $('div.tabs').tabs();
    var imgURL = chrome.extension.getURL('images/bucket.jpg');
    //document.getElementById('bucket-img').src = imgURL;
    //console.log(imgURL);
    $('#tabs-right').css( { "background-image" : imgURL });
    addTab('AdvertiserZ', '<p> XXX </p>');
    processHistory();
});

tabCounter = 3;
function addTab(advertiser, content){
	if(true || !$('#tabs-right').tabs('exists', advertiser)){
		tabCounter++;
		var div = 
			'<div id="tabs-right-' + tabCounter + '" class="ui-tabs-panel ui-widget-content ui-corner-bottom">' +
			content + '</div>';
		console.info(div);
		$('#tabs-right').append(div);
		$('#tabs-right').tabs('add', '#tabs-right-' + tabCounter, advertiser);
		var li = '<li class="ui-state-default ui-corner-top"><a href="#tabs-right- ' + tabCounter + '" name="tabs-right">' + advertiser + '</a></li>';
		console.info(li);
		//$('#tabs-right ul').append(li);
	}
}

function processHistory(){
	var histories = [];
	var visits = [];

	chrome.history.search({text:'', maxResults:0}, function(historyItems) {
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


// will contain code that examines that local store
// containing tracker/host page links, computes probabilities,
// and displays them in popup.html