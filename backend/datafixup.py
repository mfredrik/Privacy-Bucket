from MySQLdb import Connect, Error, OperationalError, ProgrammingError
import sys
import string

def exec_sql(connection, sql):

    cursor = None
    rows = None

    cursor = connection.cursor()
    cursor.execute(sql)
    # materialize the cursor to avoid problems on next SQL operation
    rows = [r for r in cursor.fetchall()]    
    cursor.close() 
    connection.commit()   
    return rows

def escape(s):
    # do a little substitution for quotes otherwise SQL freaks out a bit  
    s = s.replace('\\', '\\\\')
    s = s.replace('\"', '\\\"')
    s = s.replace("\'", "\\\'")
    return s
    
def fixup(str):
    errors = {
              'eduation':'education',
              '"male':'"Male',  # need to include quote to stop conflict and updates to feMale
			  "'male":"'Male",
              'female':'Female',
              'has kids': 'Has Kids',
              'no kids': 'No Kids',
              }
    res = str
    for old, new in errors.items():
        res = string.replace(res, old, new)
    return res
    
def correct_data(host, db, user, passwd, table1, table2, swap=False):
    connection = Connect (host = host,
                user = user,
                passwd = passwd,
                db = db,
                use_unicode = True,
                charset = 'utf8')
    print 'creating table %s' % table2
    tbl_sql = '''
        create table %s(
            domain varchar(200) not null, 
            demos TEXT default NULL, 
            primary key (domain));
    ''' % table2
    
    exec_sql(connection, tbl_sql)
	
    print 'copying and fixing data from %s to %s...' % (table1, table2)
    for r in exec_sql(connection, 'select domain, demos from %s;' % table1):
        t = (table2, escape(r[0]), escape(fixup(r[1])))
        exec_sql(connection, "insert ignore into %s(domain, demos) values('%s', '%s')" % t)

    if swap:
        print 'swapping tables %s and %s...' % (table1, table2)		
        exec_sql(connection, 'alter TABLE %s RENAME %s_tmp' % (table1, table1))
        exec_sql(connection, 'alter TABLE %s RENAME %s' % (table2, table1))
        exec_sql(connection, 'alter TABLE %s_tmp RENAME %s' % (table1, table2))
        
    
if __name__ == '__main__':
    if len(sys.argv) < 7:
        print 'python %s host db user passwd table1 table2 [swap]' % sys.argv[0]
    else:
		swap = len(sys.argv) == 8 and sys.argv[7] == 'swap' 
		correct_data(*sys.argv[1:7], swap=swap)   
