
Object.prototype.hasOwnProperty = function(property) {
    return typeof(this[property]) !== 'undefined'
};

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

// gets a tracker network name from a domain name
// returns the input domain name if it is not found in our list
function getNetworkFromDomain(domain) {
    
    for(var el in ad_networks) {
        
        if(el.domain == domain)
            return el.name;
    }
    
    return domain;
}

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

    for(var tp in req.thirdparties) {
        xhr.onreadystatechange = function() {
            
            // if we've already cached these demographics, don't worry about it
            if(localStorage[host + ":demos"] != undefined)
                return;
            
            if(xhr.readyState == 4) {
                if(xhr.status == 200) {
                    var demos = xhr.responseText;
                    localStorage[req.hostpage + ":demos"] = demos;
                }
            }
        }
        
        // we're an extension, so this request can go anywhere
        xhr.open("GET", "https://demo-server/update.php?domain=" +
                 req.hostpage +
                 "&" +
                 getNetworkFromDomain(req.thirdparties[tp]),
                 true);
        xhr.send();
    }
}

// this is run once when the extension is installed.
// scans the user's history, and establishes host page/tracker
// links from the fourthparty data.
function seedDbFromHistory() {
    
    // i wonder if there is a way to specify an unlimited number of results...
    var hist = chrome.history.search({"maxResults": 10000},
        function (hist_items) {
            
            for(var item in hist_items) {
                                
                var url = hist_items[item].url;
                var hostdomain = parseURL(url).hostdomain;
                
                var cur_trackers = trackers[hostdomain];
                
                for(var tracker in cur_trackers) {
                    
                    insertIntoDb({"hostpage": hostdomain,
                                  "thirdparties": [getNetworkFromDomain(cur_trackers[tracker])]},
                                 hist_item[item].visit_count);
                }
                
            }
        }
    );
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
        
        var key = req.hostpage + ';' + getNetworkFromDomain(req.thirdparties[tp]);
        var cur = localStorage[key];
            
        if(cur == undefined)
            localStorage[key] = (count == undefined) ? 1 : count;
        else
            localStorage[key] = (count == undefined) ? parseInt(localStorage[key]) + 1 : count;
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
   
    sendAjax(req.hostpage);
   
    insertIntoDb(req);
});