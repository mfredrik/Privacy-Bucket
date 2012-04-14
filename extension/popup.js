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
	
	var fields = ['age', 'income', 'gender', 'education', 'family', 'ethnicity'];
	
	// create overview table (first time)
	if (!$('#overview-table tbody tr').length) {
		fields.forEach(function(field) {
			// slightly ugly title case conversion
			var title = field.replace(/\w\S*/g, function(txt){
				return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
			});
			// add rows
			$('#overview-table tbody').append(
				'<tr class="' + field + '"><th>' + title + '</th><td class="guess"></td><td class="likelihood"></td></tr>'
			);
		});
	}
	
	// scales for overview data
	var width = d3.scale.linear()
			.domain([0,100])
			.range([0, 80]),
		color = d3.scale.linear()
			.domain([0,100])
			.range(['red', 'blue']);
		
	// row
	var rows = d3.selectAll('#overview-table tbody tr')
		.data(fields);
	
	// transition to current values
	var guesses = fields.reduce(function(agg, field) {
		// get the top guess
		var entries = d3.entries(data[field]);
		entries.sort(function(a,b) { return d3.descending(a.value, b.value)});
		// set it
		agg[field] = entries[0];
		return agg;
	}, {});
	
	// update to current guess
	rows.each(function(d) {
		var row = d3.select(this),
			guess = guesses[d];
		
		// update guess
		row.select('td.guess')
			.text(guess.key);
			
		// update likelihood
		var visCell = row.select('td.likelihood')
			.style('color', color(guess.value))
			.text(guess.value + '%');
			
		var bar = visCell.selectAll('svg')
			.data([d])
		.enter().append('svg:svg')
			.attr('height', 12)
			.attr('width', 100)
		.selectAll('rect')
			.data([d]);
			
		bar.enter().append('svg:rect')
			.attr('x', 10)
			.style('fill', color(guess.value))
			.attr('height', 15)
			.attr('width', function(d) {
				console.log(d);
				return 0
			});
		
		// transition bar
		bar.transition()
			.attr('width', width(guesses[d].value))
			.duration(250);
	});
}