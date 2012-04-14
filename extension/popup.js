$(function() {
	// layout setup
	$('#view-tabs').tabs();
	
	// add current trackers to nav
	var trackers = getAdvertisers();
	trackers.forEach(function(name, index) {
		var id = name.replace(/\W/g, '_'),
			checked = !index ? 'checked="checked"' : '';
		$('#tracker-tabs').append('<input type="radio" id="' + id + '" name="tracker" ' + checked + ' /><label for="' + id +'">' + name + '</label>');
	});
	
	// set up nav functionality
	$('#tracker-tabs').buttonset();
	$('#tracker-tabs label')
		.removeClass('ui-corner-right ui-corner-left')
		.click(function() {
			var $label = $(this),
				id = $label.attr('for'),
				title =  $label.text();
				
			$('#report-pane h2').html(title);
			$('#view-tabs').tabs("option", "selected", 0);
		});
});