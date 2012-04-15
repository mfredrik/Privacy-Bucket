import csv
import urllib2
import time
import random

data = csv.reader(open('c:\\Users\\Vlad\\Desktop\\top-1m.csv', 'r'))
random.seed()

cnt = 0
for i in data:
    if cnt >= 10000:
        break
    if cnt > -1:
        print i

        delay = 1.0 * random.random()
        time.sleep(delay)
        retry = 0
        while retry < 3:
            try:
                urllib2.urlopen('http://ec2-184-72-211-4.compute-1.amazonaws.com/update.php?domain=%s'%i[1])
                break
            except:
                print 'Error...'
                retry += 1
    cnt  += 1