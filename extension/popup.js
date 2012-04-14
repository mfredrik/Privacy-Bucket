$(function() {
	// layout setup
	$('#tracker-tabs').buttonset();
	$('#tracker-tabs label').removeClass('ui-corner-right ui-corner-left');
	$('#view-tabs').tabs();
	
	// nav setup
	$('#tracker-tabs label').click(function() {
		var $label = $(this),
			id = $label.attr('for'),
			title =  $label.text();
			
		$('#report-pane h2').html(title);
		$('#view-tabs').tabs("option", "selected", 0);
	})
});