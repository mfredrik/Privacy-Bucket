
var demo_server = "http://ec2-184-72-211-4.compute-1.amazonaws.com/";

function getUnique(x){
   var u = {}, a = [];
   for(var i = 0, l = x.length; i < l; ++i){
      if(x[i] in u)
         continue;
      a.push(x[i]);
      u[x[i]] = 1;
   }
   return a;
};

Object.prototype.hasOwnProperty = function(property) {
    return typeof(this[property]) !== 'undefined'
};

// sends an update to the back-end demographic server,
// notifying it of a new host page/tracker observation.
// the demographics server should send us demographics
// for the site visited by the user, to cache on the client.
//
// arguments:
// userid: guid for this user
// req should have two members
// hostpage: the domain of the page hosting the trackers
// thirdparties: a list of tracker domains on hostpage
function updateDemographicServer(userid, req) {

    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {        
        
        // if we've already cached these demographics, don't worry about it
        if(localStorage["demo:" + req.hostpage] != undefined) {
            updateTrackerGuesses(req);
            return;
        }
        
        if(xhr.readyState == 4) {
            if(xhr.status == 200) {
                var demos = xhr.responseText;
                localStorage["demo:" + req.hostpage] = JSON.stringify(normalize(JSON.parse(demos)));                
                
                // This must be called from here, as the function expects
                // demographics for all host pages
                updateTrackerGuesses(req);
            }
        }
    }
    
    // TODO: map third-party domains to tracker names
    
    // we're an extension, so this request can go anywhere
    xhr.open("GET", demo_server + "update.php?domain=" + req.hostpage, true);
    xhr.send();
    
}

function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function doProd(A,B) {
        
    var C = {};
    for(var idx in init) {
        C[idx] = {};
        var sum = 0;
        for(var idx2 in init[idx]) {
            if(!isNumber(A[idx][idx2]) || !isNumber(B[idx][idx2])) {
                C[idx][idx2] = 1;
                continue;
            }
            
            var product = A[idx][idx2] * B[idx][idx2];
            C[idx][idx2] = product;
            sum += product;
        }
        for(var idx2 in init[idx]) {
            if(sum > 0) {
                C[idx][idx2] /= sum;
                C[idx][idx2] = C[idx][idx2]*100;
            }
        }
    }    
    
    return C;
}

// gets a tracker network name from a domain name
// returns the input domain name if it is not found in our list
function getNetworkFromDomain(domain) { 
    for(var el in ad_networks) {
        var a = ad_networks[el];
        if(a.domain == domain){
            //alert('matched ' + domain);
            return a.name;
        }
    }
    //console.log('mismatched' + domain);
    return domain;
}

function updateTrackerGuesses(req) {
   
    var hp_demos = localStorage["demo:" + req.hostpage];
    hp_demos = normalize(JSON.parse(hp_demos));
    hp_demos.domain = req.hostpage;
    
    var allGuessBlob = localStorage["guess:All"];
    if(!allGuessBlob) {
        localStorage["guess:All"] = JSON.stringify(hp_demos);
        localStorage["count:All"] = 1;
    } else {
        var curAll = normalize(JSON.parse(allGuessBlob));
        var prod = doProd(curAll,hp_demos);
        prod["domain"] = "All";        
        localStorage["guess:All"] = JSON.stringify(prod);
        localStorage["count:All"] = +localStorage["count:All"] + 1;
    }
    
    for(var tp in req.thirdparties) {
        var curtp = getNetworkFromDomain(req.thirdparties[tp]);
        
        
        var curGuessBlob = localStorage["guess:" + curtp];
        if(!curGuessBlob) {
            localStorage["guess:" + curtp] = JSON.stringify(hp_demos);
        } else {
            var curguess = normalize(JSON.parse(curGuessBlob));
            var prod = doProd(curguess,hp_demos);
            prod["domain"] = curguess.domain;            
            localStorage["guess:" + curtp] = JSON.stringify(prod);
        }
    }
}

// quick and dirty url parser
// this doesn't actually work for all domains - we will have to fix it
function parseURL(url) {
    var a =  document.createElement('a');
    a.href = url;
    var domsplits = a.hostname.split(".");
    var dom = domsplits[domsplits.length-2]+"."+domsplits[domsplits.length-1];
    return ret = {
        source: url,
        protocol: a.protocol.replace(':',''),
        hostdomain: dom
    };
}

// this is run once when the extension is installed.
// scans the user's history, and establishes host page/tracker
// links from the fourthparty data.
function seedDbFromHistory(maxResults) {    
    if(localStorage['seeded'] != undefined) return;
    
    // i wonder if there is a way to specify an unlimited number of results...
    var hist = chrome.history.search({"maxResults": maxResults, "text": ""},
        function (hist_items) {            
            for(var item in hist_items) {                                
                var url = hist_items[item].url;
                var hostdomain = parseURL(url).hostdomain;                
                var cur_trackers = trackers[hostdomain];
                
                cur_trackers = getUnique(cur_trackers);
                
                for(var tracker in cur_trackers) {                    
                    insertIntoDb({
                            "hostpage": hostdomain,
                            "thirdparties": [
                                getNetworkFromDomain(cur_trackers[tracker])]});
                    cur_trackers[tracker] = getNetworkFromDomain(cur_trackers[tracker]);
                    //updateDemographicServer(0,{hostpage: hostdomain, thirdparties: [cur_trackers[tracker]]});
                }
                
                updateDemographicServer(0,{hostpage: hostdomain, thirdparties: cur_trackers});                
                //updateTrackerGuesses({hostpage: hostdomain, thirdparties: cur_trackers});
            }
        }
    );
    
    localStorage['seeded'] = "true";
}

// insertIntoDb updates the local store with a new "link"
// between a host page and a tracker. a count of the number
// of times a tracker has witnessed a page visit is maintained.
//
// arguments:
// req should have two members
// hostpage: the domain of the page hosting the trackers
// thirdparties: a list of tracker domains on hostpage
//
// count (optional) is the number of times the connection was observed
// if count is undefined, then the link counter is incremented
// otherwise it is set to count
function insertIntoDb(req, count) {    
    for(var tp in req.thirdparties) {        
        var key = 'tracker:' + getNetworkFromDomain(req.thirdparties[tp]);
        var trackerBlob = localStorage[key];
        if(trackerBlob != undefined) {
            var curTracker = JSON.parse(trackerBlob);
        
            var found = 0;
            for(var i = 0; i < curTracker.length; i++) {
                if(curTracker[i].domain == req.hostpage) {
                    curTracker[i].count++;
                    found = 1;
                }                
            }
            
            if(found == 0)
                curTracker.push({"domain": req.hostpage, "count": 1});
            localStorage[key] = JSON.stringify(curTracker);
        } else {
            localStorage[key] = JSON.stringify([{"domain": req.hostpage, "count": 1}]);            
        }
    }
}

// activates when a new tab is created to inject the content script
function tabCreatedListener(tab) {
    if(tab.url == "chrome://newtab/" && tab.url != undefined) return;
    
    chrome.tabs.executeScript(tab.id, {"file": "content.js"});
    
}

chrome.tabs.onCreated.addListener(
    // activates when a new tab is created to inject the content script
    function tabCreatedListener(tab) {        
        if(tab.url == "chrome://newtab/" && tab.url != undefined) return;
        
        chrome.tabs.executeScript(tab.id, {"file": "content.js"});    
    }
);

chrome.tabs.onUpdated.addListener(
    // activates when a tab is updated (and finished loading) to inject the content script
    function(tabId, changeInfo, tab) {        
        if(changeInfo.hasOwnProperty("status") && changeInfo.status == "loading") return;    
        
        tabCreatedListener(tab);
    }
);

// receives notifications of observed trackers from the content script
chrome.extension.onRequest.addListener(function(req, sender, sendresp) {
    
    if(req.thirdparties){
        updateDemographicServer(0,req);
        //updateTrackerGuesses(req);
        insertIntoDb(req);
    }
});

seedDbFromHistory(10);