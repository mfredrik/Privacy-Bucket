
// expects:
// first argument to be the host whose demographics we scrape from quantcast
// second argment to be the output file to append to

var fs = require('fs');
var system = require('system');

var host = system.args[1];
var outfile = system.args[2];
fs.touch(outfile);
var fp = fs.open(outfile,"a");



var page = require('webpage').create();

page.onConsoleMessage = function (msg) { console.log(msg); }

console.log('The default user agent is ' + page.settings.userAgent);
console.log('Opening ' + 'http://www.quantcast.com/' + host + '/demographics');

// open up the quantcast page to scrape
page.open('http://www.quantcast.com/' + host + '/demographics',
    function (status) {
        if(status !== 'success')
            console.log('Unable to open quantcast.com');
        else {
			console.log('Starting...');		
            var ethresults = {};
			ethresults['domain'] = host
			
            // Scrape the age results
            ethresults['age'] = page.evaluate(function () {
			    var ret = {}
                var body = document.body;
                var list = body.querySelectorAll('div#panel-AGE * table[class=demographics-composition] * td[class~=index-digit]');
				var labels = ['<18', '18-24', '25-34', '35-44', '45-54', '55-64', '65+']
                for(var i = 0; i < list.length; i++)
                    ret[labels[i]] = parseInt(list[i].innerText);
                return ret;
            });
            
			//console.log('getting gender');
            // Scrape the gender results
            ethresults['gender'] = (page.evaluate(function () {
                var body = document.body;
                var list = body.querySelectorAll('div#panel-GENDER * table[class=demographics-composition]  * td[class~=index-digit]');
				console.log(list)
                return {'Male':parseInt(list[0].innerText), 'Female':parseInt(list[1].innerText)};
            }));

            // Scrape the children results
            ethresults['family'] = (page.evaluate(function () {
                var body = document.body;
                var list = body.querySelectorAll('div#panel-CHILDREN * table[class=demographics-composition]  * td[class~=index-digit]');
                return {'No kids':parseInt(list[0].innerText), 'Has kids':parseInt(list[1].innerText)};
            }));			
			//console.log(JSON.stringify(ethresults))


            // Scrape the income results
            ethresults['income'] = (page.evaluate(function () {
                var body = document.body;
                var list = body.querySelectorAll('div#panel-INCOME * table[class=demographics-composition]  * td[class~=index-digit]');
				//console.log(list);
				var labels = ['$0-50k', '$50-100k', '$100-150k', '$150k+'];
				var ret = {};
                for(var i = 0; i < list.length; i++)
                    ret[labels[i]] = parseInt(list[i].innerText);
				return ret;
            }));	


            // Scrape the income results
            ethresults['education'] = (page.evaluate(function () {
                var body = document.body;
                var list = body.querySelectorAll('div#panel-EDUCATION * table[class=demographics-composition]  * td[class~=index-digit]');
				//console.log(list);
				var labels = ['No College', 'College', 'Grad School'];
				var ret = {};
                for(var i = 0; i < list.length; i++)
                    ret[labels[i]] = parseInt(list[i].innerText);
				return ret;
            }));

            // Scrape the income results
            ethresults['ethnicity'] = (page.evaluate(function () {
                var body = document.body;
                var list = body.querySelectorAll('div#panel-ETHNICITY * table[class=demographics-composition]  * td[class~=index-digit]');
				//console.log(list);
				var labels = ['Caucasian', 'African American', 'Asian', 'Hispanic', 'Other' ];
				var ret = {};
                for(var i = 0; i < list.length; i++)
                    ret[labels[i]] = parseInt(list[i].innerText);
				return ret;
            }));			
			//console.log(JSON.stringify(ethresults))
			//console.log(host)
			page.evaluate(new Function('window.domain1="' + host + '";'));
			//console.log(page.evaluate(function() { return window.domain1; } ))
            // Scrape the reach results
            ethresults['reach'] = (page.evaluate(function () {
                var body = document.body;
				//console.log('Before domain...');
				var domain_list = window.domain1.split('.');
				
				//console.log('domain: ' + window.domain1);
				var selector = 'td[id="reach-wd:';
				for (i = domain_list.length - 1; i >= 0 ; i--) {
					if (i != domain_list.length -1) {
						selector = selector + '.';
					}
					selector = selector + domain_list[i];
				}
				selector = selector + '"]';
                var ret = parseFloat(body.querySelectorAll(selector)[0].innerText);
				//console.log(ret);
				return ret;
            }));			
			console.log(JSON.stringify(ethresults))            
            // write the gender results to the output file
            fp.write(JSON.stringify(ethresults))
            // signal end of host
            fp.write('\n');
        }
        fp.close();
        phantom.exit();
    }
);