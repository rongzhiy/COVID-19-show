import pymysql

# 创建连接
#return: 连接，游标
def get_conn():

    # 创建连接
    conn = pymysql.connect(host="127.0.0.1",
                           user="root",
                           password="123456",
                           db="covproject",
                           charset="utf8")
    # 创建游标
    cursor = conn.cursor()# 执行完毕返回的结果集默认以元组显示
    return conn, cursor


# 关闭游标，连接
def close_conn(conn, cursor):
    cursor.close()
    conn.close()


def query(sql,*args):
    """
    封装通用查询
    :param sql:
    :param args:
    :return: 返回查询到的结果，((),(),)的形式
    """
    conn, cursor = get_conn()
    cursor.execute(sql,args)
    res = cursor.fetchall()
    close_conn(conn, cursor)
    return res

def getFinalData():
    """
    :return: 返回大屏中间统计的总的数据
    """
    # 因为会更新多次数据，取时间戳最新的那组数据
    sql = "select confirm,heal,dead,local_confirm,local_confirm_add,local_no_infect_add from history order by ds desc limit 1"
    res = query(sql)
    return res[0]

def getMapData(args):
    """
    :return: 返回大屏中间地图上对应的数据
    """
    #各省新增
    if args == '0':
        sql = "select province,sum(confirm_add) from details where update_time=(select update_time from details  order by update_time desc limit 1) group by province"
    #各省现有
    if args == '1':
        sql = "select province,sum(now_confirm) from details where update_time=(select update_time from details order by update_time desc limit 1) group by province"
    #各省累计
    if args == '2':
        sql = "select province,sum(confirm) from details where update_time=(select update_time from details order by update_time desc limit 1) group by province"

    res = query(sql)
    return res

def getLineData1():
    """
    :return: 返回折线图1对应的数据
    """
    sql = "select ds,heal_add,dead_add from history order by ds desc limit 30"
    res = list(query(sql))
    # 由于是倒序查询，要将顺序反过来
    res.reverse()
    return res

def getLineData2():
    """
    :return: 返回折线图2对应的数据
    """
    sql = "select ds,local_confirm_add,local_no_infect_add from history order by ds desc limit 30"
    res = list(query(sql))
    # 由于是倒序查询，要将顺序反过来
    res.reverse()
    return res

def getBarData1():
    """
    :return: 返回柱状图1对应的数据
    """
    sql = "select province,sum(now_confirm) as proNowCon from details where province not in('台湾','香港','澳门') and update_time=(select update_time from details order by update_time desc limit 1) group by province order by proNowCon desc limit 7"
    res = query(sql)
    return res

def getBarData2():
    """
    :return: 返回动态柱状图2对应的数据
    """
    sql = "select event_time,event_description from event order by event_time desc limit 20"
    res = query(sql)
    return res

def getPieData():
    """
    :return: 返回饼形图对应的数据
    """
    sql = "select province, sum(now_confirm) from details where province in ('台湾','香港','澳门') and  update_time=(select update_time from details order by update_time desc limit 1) group by province"
    res  = query(sql)
    return res

def exSpider():
    """
    :return: 返回event表最后一条数据的时间
    """
    # 数据库表event最后一条数据的时间
    sql = "select event_time from event order by event_time desc limit 1"
    res = query(sql)
    return res
