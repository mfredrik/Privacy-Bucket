
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

function contains(a, obj) {
    var i = a.length;
    while (i--) {
       if (a[i] === obj) {
           return true;
       }
    }
    return false;
}

var hostpage = parseURL(document.location).hostdomain;

var thirdparties = [];

// look for script elements with foreign src domains
scrEls = document.getElementsByTagName("script");
for(var el in scrEls) {

    var curhost = parseURL(scrEls[el].src).hostdomain;
    if(hostpage != curhost && !contains(thirdparties,curhost)) thirdparties.push(curhost);
}

// look for img elements with foreign src domains
imgEls = document.getElementsByTagName("img");
for(var el in imgEls) {

    var curhost = parseURL(imgEls[el].src).hostdomain;
    if(hostpage != curhost && !contains(thirdparties,curhost)) thirdparties.push(curhost);
}


// send a message to our background script containing all the third parties we witnessed
chrome.extension.sendRequest({thirdparties: thirdparties, hostpage: parseURL(document.location.toString()).hostdomain});

// todo: iframes

// another caveat: trackers can be embedded in iframes.
// we may need to do a recursive traversal of iframes.

// another possible way, use the chrome experimental request hooking api:
// http://code.google.com/chrome/extensions/trunk/experimental.webRequest.html
