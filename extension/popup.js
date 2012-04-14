$(function() {
    $('div.tabs').tabs();
    //var imgURL = chrome.extension.getURL('images/bucket.jpg');
    //$('#tabs-right').css( { "background-image" : imgURL });

	//var fontURL = chrome.extension.getURL('fonts/REDCIRCL.ttf');
	//var resource = 'url ( ' + fontURL + ')';
	//$('.title').css('font-family', 'titleFont');
	//$('.title').css('font-size', 36);

	addTab( { 
    	advertiser : 'All',
    	network_id : -1, 
    	text : 'All data',
    	age : '25-35',
    	income : '20-40K',
    	gender : 'male',
    	education : 'college'
    } );

  	addTab( { 
    	advertiser : 'DoubleClick',
    	network_id : 37, 
    	text : 'DoubleClick data',
    	age : '25-35',
    	income : '20-40K',
    	gender : 'female',
    	education : 'college'
    } );

	addTab( { 
    	advertiser : 'Acxiom',
    	network_id : 3, 
    	text : 'Acxiom data',
    	age : '18-25',
    	income : '20-40K',
    	gender : 'female',
    	education : 'college'
    } );

    addTab( { 
    	advertiser : 'AudienceScience',
    	network_id : 16, 
    	text : '',
    	age : '18-25',
    	income : '20-40K',
    	gender : 'male',
    	education : 'college'
    } );

    processHistory();
});

tabCounter = 0;
function addTab(content){	
	tabCounter++;
	var contentTable = '<table class="demographic-table">' + 
		'<tr><td><b>Age</b></td><td>' + content.age + '</td><td><b>Income</b></td><td>' + content.income + '</td></tr>' + 
		'<tr><td><b>Gender</b></td><td>' + content.gender + '</td><td><b>Education</b></td><td>' + content.education + '</td></tr>' + 
		'</table>';
	var flattentedContent;
	if(content.network_id != -1){
	 	flattentedContent = 
			'<img src="http://images.privacychoice.org/images/network/' + content.network_id + '.jpg"> <p><b>' + 
			content.text + '</b></p><p>Here is a summary of demographic information ' + content.advertiser + ' may be able to calculated about you based on the porition of your browsing history they have access to:</p>' + contentTable;
	}else{
		flattentedContent = 
			'<p><b>' + content.text + '</b></p><p>Here is a summary of demographic information it may be able to calculated about you based on your browsing history:</p>' + contentTable;
	}
	var div = 
		'<div id="tabs-right-' + tabCounter + '" class="ui-tabs-panel ui-widget-content ui-corner-bottom">' +
		flattentedContent + '</div>';
	console.info(div);
	$('#tabs-right').append(div);
	$('#tabs-right').tabs('add', '#tabs-right-' + tabCounter, content.advertiser);
	var li = '<li class="ui-state-default ui-corner-top"><a href="#tabs-right- ' + tabCounter + '" name="tabs-right">' + content.advertiser + '</a></li>';
	console.info(li);
	//$('#tabs-right ul').append(li);	
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