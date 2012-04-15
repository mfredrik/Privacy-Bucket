import json
import urllib2
import sys

apikey = 'a7c87c3df930a92d940286f21169c843'
metrics = [ {'metric':'age', 'name':'age'}, {'metric':'gen', 'name':'gender'}, 
                {'metric':'inc', 'name':'income'} ];
url = 'http://apps.compete.com/sites/nytimes.com/trended/search/?apikey=%s&metrics=%s&latest=1';

def convert(str):
	tran = {'male':'Male', 'female':'Female'}
	return tran.get(str, str)

def get_data(domain):
    # fetch the complete data
    # can't get the demographic data in one URL so go through and get it...
    result = {'domain':domain}
    for m in metrics:
        data = json.loads(urllib2.urlopen(url % (apikey, m['metric'])).read())
        for key, value in data['data']['trends'].items():
            result.setdefault(m['name'], {})[convert(str(key))] = float(value[0]['value']);
    return result

if __name__ == '__main__':
    if len(sys.argv) > 3:
        print 'python %s domain outputfile' % system.argv[0]
    else:
        out = open(sys.argv[2], 'a')
        out.write(str(get_data(sys.argv[1])))
        out.close()