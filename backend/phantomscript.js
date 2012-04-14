
// expects:
// first argument to be the host whose demographics we scrape from quantcast
// second argment to be the output file to append to

var fs = require('fs');
var system = require('system');

var host = system.args[1];
var outfile = system.args[2];
fs.touch(outfile);
var fp = fs.open(outfile,"a");

// format: hostdomain,demographics vector
fp.write(host + ",");

var page = require('webpage').create();
console.log('The default user agent is ' + page.settings.userAgent);
console.log('Opening ' + 'http://www.quantcast.com/' + host + '/demographics');

// open up the quantcast page to scrape
page.open('http://www.quantcast.com/' + host + '/demographics',
    function (status) {
        if(status !== 'success')
            console.log('Unable to open quantcast.com');
        else {
            
            // Scrape the age results
            var ethresults = page.evaluate(function () {
                var body = document.body;
                var list = body.querySelectorAll('div#panel-AGE * table[class=demographics-composition] * td[class~=index-digit]');
                var ret = [];
                for(var i = 0; i < list.length; i++)
                    ret.push(list[i].innerText);
                return ret;
            });
            
            // write the age results to the output file
            for(var i = 0; i < ethresults.length; i++) {
                if(ethresults[i] == null) continue;
                
                fp.write(ethresults[i].replace('%',''));
                if(i < ethresults.length-1) fp.write(',');
                console.log(ethresults[i].replace('%',''));
            }
			console.log('getting gender');
            // Scrape the gender results
            var ethresults = page.evaluate(function () {
                var body = document.body;
                var list = body.querySelectorAll('div#panel-GENDER * table[class=demographics-composition]  * td[class~=index-digit]');
				console.log(list)
                var ret = [];
                for(var i = 0; i < list.length; i++)
                    ret.push(list[i].innerText);
                return ret;
            });
            
            // write the gender results to the output file
            for(var i = 0; i < ethresults.length; i++) {
                if(ethresults[i] == null) continue;
                
                fp.write(ethresults[i].replace('%',''));
                if(i < ethresults.length-1) fp.write(',');
                console.log(ethresults[i].replace('%',''));
            }
            
            // signal end of host
            fp.write('\n');
        }
        fp.close();
        phantom.exit();
    }
);