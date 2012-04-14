$(function() {
	$('#tracker-tabs').buttonset();
	$('#tracker-tabs label').removeClass('ui-corner-right ui-corner-left');
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