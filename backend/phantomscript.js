
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
			
/*			
			var components = [
				{
					'selector': 'div#panel-AGE * table[class=demographics-composition] * td[class~=index-digit]',
					'labels': ['<18', '18-24', '25-34', '35-44', '45-54', '55-64', '65+'],
					'category': 'age'
				},
				{
					'selector':'div#panel-GENDER * table[class=demographics-composition]  * td[class~=index-digit]',
					'category': 'gender',
					'labels': ['Male', 'Female']
				}
			];
			
			console.log('Starting2...');
			for(var j = 0; j < components.length; j++) {
				console.log('Processing ' + components[j]['category']);
				ethresults[components[j]]['category'] = page.evaluate(function () {
					var ret = {};

					var body = document.body;
					var list = body.querySelectorAll(components[j]['selector']);
					for(var i = 0; i < list.length; i++)
						ret[components[j]['labels'][i]] = parseInt(list[i].innerText);
					return ret;

				});			
			};
*/
			

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
            
			console.log('getting gender');
            // Scrape the gender results
            ethresults['gender'] = (page.evaluate(function () {
                var body = document.body;
                var list = body.querySelectorAll('div#panel-GENDER * table[class=demographics-composition]  * td[class~=index-digit]');
				console.log(list)
                return {'male':parseInt(list[0].innerText), 'female':parseInt(list[1].innerText)};
            }));

            // Scrape the children results
            ethresults['family'] = (page.evaluate(function () {
                var body = document.body;
                var list = body.querySelectorAll('div#panel-CHILDREN * table[class=demographics-composition]  * td[class~=index-digit]');
                return {'no kids':parseInt(list[0].innerText), 'has kids':parseInt(list[1].innerText)};
            }));			
			console.log(JSON.stringify(ethresults))


            // Scrape the income results
            ethresults['income'] = (page.evaluate(function () {
                var body = document.body;
                var list = body.querySelectorAll('div#panel-INCOME * table[class=demographics-composition]  * td[class~=index-digit]');
				console.log(list);
				var labels = ['$0-50k', '$50-100k', '$100-150k', '$150k+'];
				var ret = {};
                for(var i = 0; i < list.length; i++)
                    ret[labels[i]] = parseInt(list[i].innerText);
				return ret;
            }));	


            // Scrape the income results
            ethresults['eduation'] = (page.evaluate(function () {
                var body = document.body;
                var list = body.querySelectorAll('div#panel-EDUCATION * table[class=demographics-composition]  * td[class~=index-digit]');
				console.log(list);
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
				console.log(list);
				var labels = ['Caucasian', 'African American', 'Asian', 'Hispanic', 'Other' ];
				var ret = {};
                for(var i = 0; i < list.length; i++)
                    ret[labels[i]] = parseInt(list[i].innerText);
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