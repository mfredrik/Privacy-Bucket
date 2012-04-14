function processLocalStore(){
	for(var tracker in localStorage) {
		var trackerBlob = localStorage[tracker];
		var curTracker = JSON.parse(trackerBlob);
		var count = 0;
		for(var pairIndex in curTracker){
			 var pair = curTracker[pairIndex];

			 count += pair.count;
		}

        console.log(tracker + ' : ' + count);
    }
}