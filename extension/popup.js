$(function() {
    $('div.tabs').tabs();
    var imgURL = chrome.extension.getURL('images/bucket.jpg');
    //document.getElementById('bucket-img').src = imgURL;
    //console.log(imgURL);
    $('#tabs-right').css("background-image" : imgURL);
});

// will contain code that examines that local store
// containing tracker/host page links, computes probabilities,
// and displays them in popup.html