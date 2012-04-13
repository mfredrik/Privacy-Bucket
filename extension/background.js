
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
        
        // TODO: map third-party domains to tracker names
        
        // we're an extension, so this request can go anywhere
        xhr.open("GET", "https://demo-server/update.php?domain=" + req.hostpage + "&" + req.thirdparties[tp], true);
        xhr.send();
    }
}


// insertIntoDb updates the local store with a new "link"
// between a host page and a tracker. a count of the number
// of times a tracker has witnessed a page visit is maintained.
//
// arguments:
// req should have two members
// hostpage: the domain of the page hosting the trackers
// thirdparties: a list of tracker domains on hostpage
function insertIntoDb(req) {
    
    for(var tp in req.thirdparties) {
        
        // TODO: map third-party domains to tracker names
        
        var key = req.hostpage + ';' + req.thirdparties[tp];
        var cur = localStorage[key];
            
        if(cur == undefined)
            localStorage[key] = 1;
        else
            localStorage[key] = parseInt(localStorage[key]) + 1;
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