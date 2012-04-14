$(function() {
	// layout setup
	$('#view-tabs').tabs();
	
	// add current trackers to nav
	var trackers = getAdvertisers();
	trackers.forEach(function(name, index) {
		var id = name.replace(/\W/g, '_'),
			checked = !index ? 'checked="checked"' : '';
		$('#tracker-tabs').append('<input type="radio" id="' + id + '" name="tracker" ' + checked + '/><label for="' + id +'">' + name + '</label>');
	});
	
	// set up nav functionality
	$('#tracker-tabs').buttonset();
	$('#tracker-tabs label')
		.removeClass('ui-corner-right ui-corner-left')
		.click(function() {
			var $label = $(this),
				key = $label.text(),
				data = getPerTrackerDemographics(key),
				networkId = data.network_id > 0 && data.network_id,
				networkUrl = networkId && ('http://privacychoice.org/companies/index/' + networkId);
			// set the title and image
			$('#tracker-title').html(key);
			if (networkId) {
				// add more info link
				$('#tracker-title')
					.append('<span class="moreinfo">(<a href="' + networkUrl + '" target="_blank">More Info</a>)</span>');
				// image
				$('#tracker-image').show();
				$('#tracker-image a')
					.attr('href', networkUrl);
				$('#tracker-image img')
					.attr('src', 'http://images.privacychoice.org/images/network/' + networkId + '.jpg')
					.attr('alt', key);
			} else {
				$('#tracker-image').hide();
			}
			$('#view-tabs').tabs("option", "selected", 0);
			
		})
		// run it for the first tracker (all data)
		.first().click();
});