$(function() {
	// layout setup
	$('#view-tabs').tabs();
	processTrackersFromLocalStore();

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
			// update report tabs
			updateOverview(data);
			$('#view-tabs').tabs("option", "selected", 0);
			
		})
		// run it for the first tracker (all data)
		.first().click();
		
});

function updateOverview(data) {
	// update support count
	$('#support-count').html(data.support);
	// update overview table
	$('#overview-table tbody').empty();
	
	// scales for overview data
	var width = d3.scale.linear()
			.domain([0,100])
			.range([0, 80]),
		color = d3.scale.linear()
			.domain([0,100])
			.range(['red', 'blue']);
	
	// add overview rows
	['age', 'income', 'gender', 'education', 'family', 'ethnicity'].forEach(function(field) {
	
		// slightly ugly title case conversion
		var title = field.replace(/\w\S*/g, function(txt){
				return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
			}),
			// get the top guess
			entries = d3.entries(data[field]);
		entries.sort(function(a,b) { return d3.descending(a.value, b.value)});
		var top = entries[0];
		
		// add rows
		$('#overview-table tbody').append(
			'<tr class="' + field + '"><th>' + title + '</th><td>' + top.key + '</td><td class="confidence">' + top.value + '%</td></tr>'
		);
		
		// color value and add bar
		var visCell = d3.select('#overview-table tr.' + field + ' td.confidence');
		visCell.style('color', color(top.value));
		visCell.append('svg:svg')
				.attr('height', 12)
				.attr('width', 100)
			.append('svg:rect')
				.attr('x', 10)
				.attr('height', 15)
				.attr('width', width(top.value))
				.attr('fill', color(top.value));
	})
}
