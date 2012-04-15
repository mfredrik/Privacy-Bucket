$(function() {
	// var demographics = demographicsStub;
	
	var fields = ['age', 'income', 'gender', 'education', 'family', 'ethnicity'];
	
	function toId(name) {
		return name.replace(/\W/g, '_')
	}

	demographics.processTrackersFromLocalStore();
	
	// layout setup
	$('#view-tabs').tabs();
	
	// add current trackers to nav
	var trackers = demographics.getAdvertisers();
	trackers.forEach(function(name, index) {
		var id = toId(name),
			checked = !index ? 'checked="checked"' : '';
		$('#tracker-tabs').append('<input type="radio" id="nav' + id + '" name="tracker" ' + checked + '/><label for="nav' + id +'">' + name + '</label>');
	});
	
	// toggle only network id
	$('#network-toggle').click(function() {
		var toggle = !$(this).prop('checked'),
			notNetwork = trackers.filter(function(d) {
				var data = demographics.getPerTrackerDemographics(d);
				return !data.network_id;
			});
		notNetwork.forEach(function(name) {
			var id = toId(name);
			$('label[for="nav' + id + '"]')
				.toggle(toggle);
		})
	});
	
	// set up nav functionality
	$('#tracker-tabs').buttonset();
	$('#tracker-tabs label')
		.removeClass('ui-corner-right ui-corner-left')
		.click(function() {
			var $label = $(this),
				key = $label.text(),
				data = demographics.getPerTrackerDemographics(key),
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
			updateReports(data);
		
		});//.first().click();

	function updateReports(data) {
		// update support count
		console.log(JSON.stringify(data));
		$('span.support-count').html(data.support ? data.support.length : 0);
		
		// create tables (first time)
		$('table.data-table').each(function() {
			var $this = $(this);
			if (!$('tbody tr', $this).length) {
				fields.forEach(function(field) {
					// slightly ugly title case conversion
					var title = field.replace(/\w\S*/g, function(txt){
						return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
					});
					// add rows
					$('tbody', $this).append(
						'<tr class="' + field + '"><th>' + title + '</th><td class="guess"></td><td class="likelihood"></td><td class="likelihood-graph"></td></tr>'
					);
				});
			}
		});
		
		// scales for overview data
		var length = d3.scale.linear()
				.domain([0,100])
				.range([0, 80]);
		
		// transition to current values
		var guesses = fields.reduce(function(agg, field) {
			// get the top guess
			var entries = d3.entries(data[field]);
			entries.sort(function(a,b) { return d3.descending(a.value, b.value)});
			// set it
			agg[field] = entries[0];
			return agg;
		}, {});
			
		
		// update overview
		d3.selectAll('#overview-table tbody tr')
			.data(fields)
			.each(function(d) {
				var row = d3.select(this),
					guess = guesses[d];
				
				// update guess
				row.select('td.guess')
					.text(guess.key);
					
				// update likelihood
				var visCell = row.select('td.likelihood')
					.text(~~guess.value + '%');
					
				var svg = row.select('td.likelihood-graph').selectAll('svg')
					.data([d]);
					
				svg.enter().append('svg:svg')
					.attr('height', 12)
					.attr('width', 100)
				.append('svg:rect')
					.attr('x', 5)
					.attr('fill', 'steelblue')
					.attr('height', 15)
					.attr('width', 0);
				
				// transition bar
				svg.selectAll('rect')
					.transition()
						.attr('width', function(d) { return length(guess.value) })
						.duration(250);
			});
			
		// update details
		d3.selectAll('#details-table tbody tr')
			.data(fields)
			.each(function(d) {
				var row = d3.select(this),
					guess = guesses[d];
				
				// update guess
				row.select('td.guess')
					.text('Best guess: ' + guess.key);
					
				var entries = d3.entries(data[d]),
					bw = 100,
					lw = 120,
					maxh = d3.max(entries, function(d) { return length(d.value) });
					
				row.select('th')
					.style('padding-top', (maxh + 5) + 'px');
				
				row.select('td.guess')
					.style('padding-top', (maxh + 5) + 'px');
					
				var svg = row.select('td.likelihood-graph').selectAll('svg')
					.data([1]);
					
				var entry = svg.enter().append('svg:svg')
					.attr('width', 18 * entries.length + lw - 30)
					.attr('height', maxh + lw)
				.append('svg:g')
					.attr('transform', 'translate(0,' + -(bw-maxh) + ')');
					
				entry.append('svg:line')
					.attr('x1', 70)
					.attr('x2', 18 * entries.length + 72)
					.attr('y1', bw + 12)
					.attr('y2', bw + 12)
					.style('stroke', '#999');
				
				var container = svg.selectAll('g.bar')
					.data(entries);
					
				console.log(entries);
					
				entry = container.enter().append('svg:g')
					.attr('class', 'bar')
					.attr('transform', function(d, i) { return 'translate(' + (18 * i + 70) + ',' + (-(bw-maxh) + 12) + ')'});
				
				entry.append('svg:rect')
					.attr('x', 5)
					.attr('y', bw)
					.attr('fill', 'steelblue')
					.attr('width', 15)
					.attr('height', 0);
					
				entry.append('svg:text')
					.attr('y', bw + 7)
					.attr('x', 15)
					.attr('text-anchor', 'end')
					.attr('transform', 'rotate(-60 15,' + (bw + 7) + ')')
					.text(function(d) { return d.key });
					
				var container = svg.selectAll('rect')
					.data(entries);
				
				// transition bar
				svg.selectAll('rect')
					.transition()
						.attr('height', function(d) { return length(d.value) })
						.attr('y', function(d) { return bw - length(d.value) })
						.duration(250);
			});
	}

		
});
