import pymysql
import traceback
import time
from spider.get_data import get_tencent_data
from spider.get_data import get_baidu_data

# mysql建立连接
def get_con():
    # 建立连接
    con = pymysql.connect(host="127.0.0.1",
                          user="root",
                          password="660396",
                          db="covproject",
                          charset="utf8")
    # 创建游标
    cursor = con.cursor()
    return con, cursor


# mysql关闭连接
def close_con(con, cursor):
    if cursor:
        cursor.close()
    if con:
        con.close()


# 插入每日details数据
def insert_details():
    cursor = None
    con = None
    try:
        lis = get_tencent_data()[1]  # 0是历史数据，1是当日详细数据
        con, cursor = get_con()
        sql = "insert into details (update_time,province,city,confirm,now_confirm,confirm_add,wzz_add,heal,dead) values (%s,%s,%s,%s,%s,%s,%s,%s,%s)"
        sql_query = "select update_time from details order by id desc limit 1"
        # 执行sql语句
        cursor.execute(sql_query)
        query_data = cursor.fetchone()
        # 判断表中是否有数据以及对比当前最大时间是否相同
        # query_data[0] 中时间数据类型是datetime.datetime，li[0][0] 中时间数据类型是str
        if query_data == None or str(query_data[0]) != lis[0][0]:
            print(f"{time.asctime()} 开始更新数据")
            for item in lis:
                cursor.execute(sql, item)
            con.commit()  #提交事务
            print(f"{time.asctime()} 更新到最新数据")
        else:
            print(f"{time.asctime()} 已是最新数据！")
    except:
        #traceback模块不仅可以返回错误，还可以返回错误的具体位置
        traceback.print_exc()
    finally:
        close_con(con, cursor)


#插入history数据
def insert_history():
    cursor = None
    con = None
    try:
        dic = get_tencent_data()[0] #0代表历史数据字典
        print(f"{time.asctime()}  开始插入历史数据")
        conn,cursor = get_con()
        sql = "insert into history values (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)"
        for k,v in dic.items():
            cursor.execute(sql,[k, v.get("confirm"),v.get("confirm_add"),v.get("local_confirm"),
                           v.get("local_confirm_add"),v.get("local_no_infect"),v.get("local_no_infect_add"),
                           v.get("heal"),v.get("heal_add"),
                           v.get("dead"),v.get("dead_add")])
        conn.commit()
        print(f"{time.asctime()} 插入历史数据完毕")
    except:
        traceback.print_exc()
    finally:
        close_con(con,cursor)

#更新历史数据
def update_history():
    cursor = None
    con = None
    try:
        dic = get_tencent_data()[0]#0代表历史数据字典
        print(f"{time.asctime()} 开始更新历史数据")
        con,cursor = get_con()
        sql = "insert into history values (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)"
        sql_query = "select confirm from history where ds=%s"
        for k,v in dic.items():
            if not cursor.execute(sql_query,k):
                cursor.execute(sql, [k, v.get("confirm"), v.get("confirm_add"), v.get("local_confirm"),
                                     v.get("local_confirm_add"), v.get("local_no_infect"), v.get("local_no_infect_add"),
                                     v.get("heal"), v.get("heal_add"),
                                     v.get("dead"), v.get("dead_add")])
        con.commit()
        print(f"{time.asctime()} 历史数据更新完毕")
    except:
        traceback.print_exc()
    finally:
        close_con(con,cursor)

# 插入以及更新百度疫情资讯信息
def update_event():
    cursor = None
    con = None
    try:
        lis = get_baidu_data()
        print(f"{time.asctime()} 开始更新百度资讯数据")
        con, cursor = get_con()
        sql = "insert into event values (%s,%s)"
        sql_query = "select event_description from event where event_time=%s"
        for k in lis:
            if not cursor.execute(sql_query, k[0]):
                cursor.execute(sql,k)
        con.commit()
        print(f"{time.asctime()} 百度资讯数据数据更新完毕")
    except:
        traceback.print_exc()
    finally:
        close_con(con, cursor)