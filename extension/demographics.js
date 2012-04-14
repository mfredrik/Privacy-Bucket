function getPerTrackerDemographics(key){
	//return getPerTrackerDemographics(key);
	return tracker2Demographics[key];
}

stub = { 
    	'All data' : 
    	{
	    	network_id : -1,
			support: 20,
	    	text : 'All data',
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
	    },
	    'DoubleClick' : 
    	{
	    	network_id : 37, 
	    	text : 'DoubleClick',
			support: 10,
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
	    },
	    'Acxiom' : 
    	{
	    	network_id : 3, 
	    	text : 'DoubleClick',
			support: 8,
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
	    },
	    'Audience Science' : 
    	{
	    	network_id : 16, 
			support: 4,
	    	text : 'Audience Science',
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
	}
};

function getPerTrackerDemographicsStub(key){
	return stub[key];
}

function getAdvertisers(){
	var result = new Array();
	for(var o in tracker2Demographics) {
		result.push(o);
	}
	console.log("advertisers " + result);
	return result;	
}

function getDemographicsFromLocalStore(url){
	console.log('Processing ' + url);
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
	console.log('in processURLs');
	for(var index in urls){
		var url = urls[index];		
		var aggregate = null;
		var dem = normalize(getDemographicsFromLocalStore(url));
		console.log('normalized ' + JSON.stringify(dem));
		
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
	}
	//console.log('Aggregate demographics: ' + JSON.stringify(aggregate));
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
	for(var index in aggregate){
		C[index] /= sum;
		C[index] *= 100;
	}
	return C;
}	


var tracker2Demographics;

// will contain code that examines that local store
// containing tracker/host page links, computes probabilities,
// and displays them in popup.html
function processTrackersFromLocalStore(){
	tracker2Demographics = {};
	var allUrls = new Array();
	for(var domain in localStorage){
		//alert('domain: ' + domain);
		if(domain.substr(0,8) == 'tracker:'){
			var urls = new Array();
			var trackerUrl = domain.substr(8, domain.length-7);
			 json = JSON.parse(localStorage[domain]);
			 for (var index in json) {
				for(i = 0; i < json.length ; i++){
					allUrls.push(json[index].domain);
					urls.push(json[index].domain);
				}
			}
			
			var result = processURLs(urls);
			if(result){
				console.log(trackerUrl + ' : ' + JSON.stringify(result));
				tracker2Demographics[trackerUrl] = result;
			}else{
				console.log(trackerUrl + ' : no data');
			}
		}
	}
	var allResults = processURLs(allUrls);
	if(allResults){
		console.log('All : ' + JSON.stringify(allResults));
		tracker2Demographics['All'] = allResults;
	}else{
		console.log('All : ' + ' : no data');
	}
}

//processTrackersFromLocalStore();