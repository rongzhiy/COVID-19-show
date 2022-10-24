from spider import ex_sql

def run():
    # 插入每日details数据
    ex_sql.insert_details()
    # # 插入历史数据   第一次执行一次即可,或者不用这个函数，更新历史数据的函数也可插入数据
    # ex_sql.insert_history()
    # 更新历史数据
    ex_sql.update_history()
    # 插入以及更新百度国内疫情资讯数据
    ex_sql.update_event()
