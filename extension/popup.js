$(function() {
	// var demographics = demographicsStub;
	
	var fields = ['age', 'income', 'gender', 'education', 'ethnicity', 'family'],
		fieldColors = d3.scale.category10();
	
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
					.append('<span class="moreinfo">(<a href="' + networkUrl + '" target="_blank">PrivacyChoice summary</a>)</span>');
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
			updateReports(data, key);
		
		});
	
	// toggle only network id
    var filterNetworks = function() {
		var toggle = !$('#network-toggle').prop('checked'),
			notNetwork = trackers.filter(function(d) {
				var data = demographics.getPerTrackerDemographics(d);
				return !data || !data.network_id;
			});
		// toggle tabs
		notNetwork.forEach(function(name) {
			var id = toId(name);
			$('label[for="nav' + id + '"]')
				.toggle(toggle);
		});
		// select remaining tab, if any
		$('#tracker-tabs label:visible')
			.first().click();
	}
	$('#network-toggle').click(filterNetworks);
        
    // initial kick off
    filterNetworks();

	function updateReports(data, domain) {
		// update support count
		var supportCount = data.obscount ? data.obscount : data.support && data.support.length || 0;
		$('span.support-count').html(supportCount);
		
		function toTitle(field) {
			return field.replace(/\w\S*/g, function(txt){
				return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
			});
		}
		
		// create tables (first time)
		$('table.data-table').each(function() {
			var $this = $(this);
			if (!$('tbody tr', $this).length) {
				fields.forEach(function(field) {
					// slightly ugly title case conversion
					var title = toTitle(field);
					// add rows
					$('tbody', $this).append(
						'<tr class="' + field + '"><th>' + title + '</th><td class="guess"></td><td class="likelihood"></td><td class="likelihood-graph"></td></tr>'
					);
				});
			}
		});
		
		// create detail panes
		$('div#details-table').each(function() {
			var $this = $(this);
			if (!$('div.details', $this).length) {
				fields.forEach(function(field) {
					// slightly ugly title case conversion
					var title = toTitle(field);
					// add rows
					$this.append(
						'<div class="details ' + field + '"><div class="likelihood-graph"></div><h3>' + title + '</h3></div>'
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
					.text(toTitle(guess.key));
					
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
					.attr('fill', fieldColors(d))
					.attr('height', 15)
					.attr('width', 0);
				
				// transition bar
				svg.selectAll('rect')
					.transition()
						.attr('width', function(d) { return length(guess.value) })
						.duration(250);
			});
			
		// update details
		fields.forEach(function(field) {
			d3.selectAll('#details-table div.details.' + field)
				.data([field])
				.each(function(d) {
					var row = d3.select(this),
						guess = guesses[d];
						
					var entries = d3.entries(data[d]),
						bw = 100,
						lw = 120;
						
					var svg = row.select('div.likelihood-graph').selectAll('svg')
						.data([1]);
						
					var entry = svg.enter().append('svg:svg')
						.attr('height', 18 * entries.length)
						.attr('width', bw + lw);
						
					entry.append('svg:line')
						.attr('y1', 0)
						.attr('y2', 18 * entries.length)
						.attr('x1', lw)
						.attr('x2', lw)
						.style('stroke', '#999');
					
					var container = svg.selectAll('g.bar')
						.data(entries);
						
					entry = container.enter().append('svg:g')
						.attr('class', 'bar')
						.attr('transform', function(d, i) { return 'translate(0,' + (18 * i) + ')'});
					
					entry.append('svg:rect')
						.attr('x', lw)
						.attr('y', 0)
						.attr('fill', fieldColors(field))
						.attr('height', 15)
						.attr('width', 0);
						
					entry.append('svg:text')
						.attr('x', lw)
						.attr('dx', -3)
						.attr('dy', '1em')
						.attr('text-anchor', 'end')
						.text(function(d) { return toTitle(d.key) });
						
					entry.append('svg:text')
						.attr('class', 'datalabel')
						.attr('x', lw)
						.attr('dx', 3)
						.attr('dy', '1.1em')
						.attr('fill', '#666')
						.style('font-size', '.8em')
						.text('0');
						
					// update data 
					svg.selectAll('rect')
						.data(entries);
						
					svg.selectAll('text.datalabel')
						.data(entries)
						.text(function(d) { return ~~d.value + '%' });
					
					// transition bar
					svg.selectAll('rect')
						.transition()
							.attr('fill', function(d) { 
								return d.key == guess.key ? 
									d3.rgb(fieldColors(field)).brighter() : 
									fieldColors(field) 
								})
							.attr('width', function(d) { return length(d.value) })
							.duration(250);
					
					// transition label
					svg.selectAll('text.datalabel')
						.transition()
							.attr('fill', function(d) { 
								return length(d.value) > 30 ?  '#fff' : '#666' 
							})
							.attr('dx', function(d) { 
								return length(d.value) > 30 ?  -3 : 3 
							})
							.attr('text-anchor', function(d) { 
								return length(d.value) > 30 ?  'end' : 'start' 
							})
							.attr('x', function(d) { return length(d.value) + lw })
							.duration(250);
				});
			
			// update observations tab
			if (supportCount && data.support) {
				$('#tabs-observations div.description').html(
					"You were observed on " + supportCount + " sites by " + domain
				);
				var midPoint = ~~(data.support.length/2)+1,
					support = { 
						left: data.support.slice(0, midPoint),
						right: data.support.slice(midPoint)
					};
				['left','right'].forEach(function(side) {
					$('#tabs-observations div.details-container.' + side)
						.empty();
					support[side].forEach(function(observation) {
						$('#tabs-observations div.details-container.' + side)
							.append('<p>' + 
								(observation.domain ? observation.domain + ' (' + observation.count +')' : observation) 
								+ '</p>'
							);
					})
				})
			} else {
				$('#tabs-observations div.description').html(
					"No observations found for domain " + domain
				)
			}
		});
	}

		
});
