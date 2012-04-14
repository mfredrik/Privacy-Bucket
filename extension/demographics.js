addTotals = true;
function getPerTrackerDemographics(key){
	return getTrackerFromLocalStore(key);
}

function getPerTrackerDemographicsStub(key){
	return stub[key];
}

function getAdvertisersStub() {
	return d3.keys(stub);
}

stub = {"gaug.es":{"network_id": 3, "domain":"github.com","age":{"18-24":9,"25-34":27,"35-44":21,"45-54":12,"55-64":9,"65+":4,"<18":17,"< 18":0},"gender":{"female":44,"male":56,"Male":0,"Female":0},"family":{"has kids":51,"no kids":49,"No kids":0,"Has kids":0},"income":{"$0-50k":44,"$100-150k":17,"$150k+":12,"$50-100k":26},"eduation":{"College":41,"Grad School":11,"No College":48},"ethnicity":{"African American":8,"Asian":5,"Caucasian":76,"Hispanic":10,"Other":2},"education":{"No College":0,"College":0,"Grad School":0},"support":['a.com','b.com']},"google-analytics.com":{"domain":"jquery.com","age":{"< 18":0,"18-24":0,"25-34":0,"35-44":0,"45-54":0,"55-64":0,"65+":0},"gender":{"Male":0,"Female":0},"family":{"No kids":0,"Has kids":0},"income":{"$0-50k":0,"$50-100k":0,"$100-150k":0,"$150k+":0},"eduation":{},"ethnicity":{"Caucasian":0,"African American":0,"Asian":0,"Hispanic":0,"Other":0},"education":{"No College":0,"College":0,"Grad School":0},"support":['a.com','b.com']},"sstatic.net":{"domain":"stackoverflow.com","age":{"18-24":18,"25-34":23,"35-44":25,"45-54":18,"55-64":8,"65+":2,"<18":5,"< 18":0},"gender":{"female":25,"male":75,"Male":0,"Female":0},"family":{"has kids":56,"no kids":44,"No kids":0,"Has kids":0},"income":{"$0-50k":43,"$100-150k":15,"$150k+":10,"$50-100k":32},"eduation":{"College":51,"Grad School":20,"No College":29},"ethnicity":{"African American":7,"Asian":10,"Caucasian":76,"Hispanic":6,"Other":1},"education":{"No College":0,"College":0,"Grad School":0},"support":['a.com','b.com']},"disqus.com":{"domain":"jquery.com","age":{"< 18":0,"18-24":0,"25-34":0,"35-44":0,"45-54":0,"55-64":0,"65+":0},"gender":{"Male":0,"Female":0},"family":{"No kids":0,"Has kids":0},"income":{"$0-50k":0,"$50-100k":0,"$100-150k":0,"$150k+":0},"eduation":{},"ethnicity":{"Caucasian":0,"African American":0,"Asian":0,"Hispanic":0,"Other":0},"education":{"No College":0,"College":0,"Grad School":0},"support":['a.com','b.com']},"adzerk.net":{"domain":"stackoverflow.com","age":{"18-24":18,"25-34":23,"35-44":25,"45-54":18,"55-64":8,"65+":2,"<18":5,"< 18":0},"gender":{"female":25,"male":75,"Male":0,"Female":0},"family":{"has kids":56,"no kids":44,"No kids":0,"Has kids":0},"income":{"$0-50k":43,"$100-150k":15,"$150k+":10,"$50-100k":32},"eduation":{"College":51,"Grad School":20,"No College":29},"ethnicity":{"African American":7,"Asian":10,"Caucasian":76,"Hispanic":6,"Other":1},"education":{"No College":0,"College":0,"Grad School":0},"support":['a.com','b.com']},"googleapis.com":{"domain":"stackoverflow.com","age":{"18-24":18,"25-34":23,"35-44":25,"45-54":18,"55-64":8,"65+":2,"<18":5,"< 18":0},"gender":{"female":25,"male":75,"Male":0,"Female":0},"family":{"has kids":56,"no kids":44,"No kids":0,"Has kids":0},"income":{"$0-50k":43,"$100-150k":15,"$150k+":10,"$50-100k":32},"eduation":{"College":51,"Grad School":20,"No College":29},"ethnicity":{"African American":7,"Asian":10,"Caucasian":76,"Hispanic":6,"Other":1},"education":{"No College":0,"College":0,"Grad School":0},"support":['a.com','b.com']},"gravatar.com":{"domain":"github.com","age":{"18-24":9,"25-34":27,"35-44":21,"45-54":12,"55-64":9,"65+":4,"<18":17,"< 18":0},"gender":{"female":44,"male":56,"Male":0,"Female":0},"family":{"has kids":51,"no kids":49,"No kids":0,"Has kids":0},"income":{"$0-50k":44,"$100-150k":17,"$150k+":12,"$50-100k":26},"eduation":{"College":41,"Grad School":11,"No College":48},"ethnicity":{"African American":8,"Asian":5,"Caucasian":76,"Hispanic":10,"Other":2},"education":{"No College":0,"College":0,"Grad School":0},"support":['a.com','b.com']},"quantserve.com":{"domain":"stackoverflow.com","age":{"18-24":18,"25-34":23,"35-44":25,"45-54":18,"55-64":8,"65+":2,"<18":5,"< 18":0},"gender":{"female":25,"male":75,"Male":0,"Female":0},"family":{"has kids":56,"no kids":44,"No kids":0,"Has kids":0},"income":{"$0-50k":43,"$100-150k":15,"$150k+":10,"$50-100k":32},"eduation":{"College":51,"Grad School":20,"No College":29},"ethnicity":{"African American":7,"Asian":10,"Caucasian":76,"Hispanic":6,"Other":1},"education":{"No College":0,"College":0,"Grad School":0},"support":['a.com','b.com']},"akamai.net":{"domain":"github.com","age":{"18-24":9,"25-34":27,"35-44":21,"45-54":12,"55-64":9,"65+":4,"<18":17,"< 18":0},"gender":{"female":44,"male":56,"Male":0,"Female":0},"family":{"has kids":51,"no kids":49,"No kids":0,"Has kids":0},"income":{"$0-50k":44,"$100-150k":17,"$150k+":12,"$50-100k":26},"eduation":{"College":41,"Grad School":11,"No College":48},"ethnicity":{"African American":8,"Asian":5,"Caucasian":76,"Hispanic":10,"Other":2},"education":{"No College":0,"College":0,"Grad School":0},"support":['a.com','b.com']}};

function getAdvertisers(){
	var result = new Array();
	for(var o in tracker2Demographics) {
		if(o != 'All'){
			result.push(o);
		}
	}
	result.sort(function(a, b) {
		return d3.descending(
			tracker2Demographics[a].support ? tracker2Demographics[a].support : tracker2Demographics[a].support.length, 
			tracker2Demographics[b].support ? tracker2Demographics[b].support : tracker2Demographics[b].support.length
			);
	} );
	//console.log("advertisers " + result);
	if(addTotals) result.unshift('All');
	return result;	
}

function getDemographicsFromLocalStore(url){
	if(DEBUG) console.log('Processing ' + url);
	for(var domain in localStorage){		
		if(domain.substr(0, 5) == 'demo:'){
			var siteURL = domain.substr(5, domain.length-5);
			//console.log('considering ' + siteURL);

			if(siteURL == url){
				var blob = localStorage[domain];
				var json = JSON.parse(blob);
				return json;
			}
		}else{
			//console.log('chunk: ' + domain.substr(0, 5));
		}
	}
	return null;
}

var init = {
	age : {
	    		'< 18' : 9,
				'18-24' : 16,
				'25-34' : 20, 
				'35-44': 25,
				'45-54' : 20,
				'55-64' : 7,
				'65+' : 3
	    	},
	    	income : {
				'$0-50k' : 17,
				'$50-100k' : 22,
				'$100-150k' : 27,
				'$150k+' : 34
	    	},
	    	gender : {
	    		'Male' : 54,
	    		'Female' : 46
	    	},
	    	education : {
		    	'No College' : 67,
		 		'College' : 10,
		 		'Grad School' : 4
	 		},
	    	family : {
	    		'No kids' : 73,
	    		'Has kids' : 27
	    	},
	    	ethnicity : {
		    	'Caucasian' : 63,
				'African American':	 18,
				'Asian':	 8,
				'Hispanic':	 10,
				'Other': 1
	    	}
		};

function normalize(A){
	if(A.eduation) {
		A.education = A.eduation;
		delete A.eduation;
	}
	if(!A.support) A.support = new Array();
	for(index in init){
		var initBlob = init[index];
		if(!A[index]) {
			A[index] = {};
		}
		for(index2 in initBlob){
			if(!A[index][index2]) {
				A[index][index2] = 0;
			}
		}
	}
	return A;
}

// resurn a blob that is the combined distribution across the range of URLs
function processURLs(urls){
	if(DEBUG) console.log('in processURLs');
	var aggregate = null;
	for(var index in urls){
		var url = urls[index];		
		var dem = normalize(getDemographicsFromLocalStore(url));
		//console.log('normalized ' + JSON.stringify(dem));
		
		if (aggregate) {
			for(index in aggregate){
				var aggBlob = aggregate[index];
				var demBlob = dem[index];
				if($.isPlainObject(aggBlob) ) {
					aggregate[index] = product(aggBlob, demBlob);
				}
			}
		} else {
			aggregate = dem;
		}
		aggregate.support.push(url);
	}
	if(DEBUG) console.log('Support: ' + aggregate.support.length);	//JSON.stringify(aggregate)
	return aggregate;
}

function product(A, B){
	var C = {};
	var sum = 0;
	// product
	for(var index in A){
		var product =  A[index] * B[index];
		C[index] = product;
		sum += product;
	}
	// normalize
	for(var index in C){
		C[index] /= sum;
		C[index] *= 100;
	}
	return C;
}	

var tracker2Demographics = {};
var allUrls = new Array();
var domainToIdMap = getDomainToId();
function processTrackersFromLocalStore(){
	for(var domain in localStorage){
		if(domain.substr(0,6) == 'guess:'){
			var urls = new Array();
			var trackerUrl = domain.substr(6, domain.length-6);
			var json = JSON.parse(localStorage[domain]);
			tracker2Demographics[trackerUrl] = json;
			console.log('Setting ' + trackerUrl + ' = ' + JSON.stringify(json));
			if(tracker2Demographics[trackerUrl] && tracker2Demographics[trackerUrl].support){
				var support = tracker2Demographics[trackerUrl].support;				
				tracker2Demographics[trackerUrl].support = support;
			}
		}
		if(domain.substr(0,8) == 'tracker:'){
		 	var urls = new Array();
		 	var trackerUrl = domain.substr(8, domain.length-8);
		 	var json = JSON.parse(localStorage[domain]);

		 	if(!tracker2Demographics[trackerUrl]){
		 		tracker2Demographics[trackerUrl] = {};
		 	}
			tracker2Demographics[trackerUrl].support = json;

			var network_id = domainToIdMap[trackerUrl];
			if(network_id) {				
				tracker2Demographics[trackerUrl].network_id = network_id;
				//console.log("adding id " + tracker2Demographics[trackerUrl].network_id + " for " + trackerUrl);
			}else{
				//console.log("missing " + trackerUrl  + " in network_id map");
			}
		}
	}
	for(var domain in tracker2Demographics){
		if(!tracker2Demographics[domain].support || !Array.isArray(tracker2Demographics[domain].support)){
			console.log('no support for ' + domain + ' ' + tracker2Demographics[domain]);
		}
	}
}

// will contain code that examines that local store
// containing tracker/host page links, computes probabilities,
// and displays them in popup.html
function getTrackerFromLocalStore(tracker){
	if(DEBUG) console.log('getTrackerFromLocalStore ' + tracker);
	if(tracker2Demographics[tracker] && tracker2Demographics[tracker].support && Array.isArray(tracker2Demographics[tracker].support)){
		console.log('In cache ' + tracker);
		console.log(JSON.stringify(tracker2Demographics[tracker]));
		return tracker2Demographics[tracker];
	}
	console.log('Not in cache ' + tracker);
	for(var domain in localStorage){
		//alert('domain: ' + domain);
		if(domain.substr(0,8) == 'tracker:'){
			var urls = new Array();
			if(tracker != 'All'){
				var trackerUrl = domain.substr(8, domain.length-7);
				if(trackerUrl == tracker){
					 var json = JSON.parse(localStorage[domain]);
					 for (var index in json) {
						for(i = 0; i < json.length ; i++){
							urls.push(json[index].domain);
						}
					}
					var result = processURLs(urls);	
					if(result){
						if(DEBUG) console.log(trackerUrl + ' : ' + JSON.stringify(result));
						tracker2Demographics[trackerUrl] = result;
					}else{
						if(DEBUG) console.log(trackerUrl + ' : no data');
					}

					return result;
				}
			}else{
				var json = JSON.parse(localStorage[domain]);
				for (var index in json) {
					for(i = 0; i < json.length ; i++){
						allUrls.push(json[index].domain);
					}
				}				
			}
		}
	}
	if(addTotals){
		if(tracker == 'All'){
			var result = processURLs(allUrls);	
			if(result){
				if(DEBUG) console.log('All' + ' : ' + JSON.stringify(result));				
				result.support = -1;	// allUrls.length;
				result.network_id = -1;
				tracker2Demographics['All'] = result;
			}else{
				if(DEBUG) console.log('All' + ' : no data');
			}
			return result;
		}
	}

	return null;
}
/*
	if(addTotals){
		var allResults = processURLs(allUrls);
		if(allResults){
			if(DEBUG) console.log('All : ' + JSON.stringify(allResults));
			tracker2Demographics['All'] = allResults;
		}else{
			if(DEBUG) console.log('All : ' + ' : no data');
		}
	}
*/

var demographics = {
	getPerTrackerDemographics: getPerTrackerDemographics,
	getAdvertisers: getAdvertisers,
	processTrackersFromLocalStore: processTrackersFromLocalStore
};

var demographicsStub = {
	getPerTrackerDemographics: getPerTrackerDemographicsStub,
	getAdvertisers: getAdvertisersStub,
	processTrackersFromLocalStore: function() {}
};
