from flask import Flask,request
from flask import render_template
from flask import jsonify
import time
# 导入数据库操作文件
import sql_query
#导入爬虫主运行文件
from spider import main

app = Flask(__name__)
@app.route('/')
def index():
   # 判断是否执行爬虫
    res = sql_query.exSpider()
    # event表不空
    if len(res) != 0:
        dateTup = time.strptime(str(res[0][0]), "%Y-%m-%d %H:%M:%S")
        date = time.strftime("%Y-%m-%d", dateTup)
        # 当前时间
        nowTimeTup = time.localtime(time.time())
        nowDate = time.strftime("%Y-%m-%d", nowTimeTup)
        # 如果当前日期不等于event表中最后一条数据的日期
        if nowDate != date:
            # 执行爬虫
            main.run()
    # event表空，执行爬虫
    else:
        main.run()

    data = sql_query.getFinalData()
    dic_data = {"confirm": data[0],
                "heal": data[1],
                "dead": data[2],
                "now_local_confirm": data[3],
                "local_confirm_add": data[4],
                "local_no_infect_add": data[5]
                }
    # 将中间红色字体的统计数据也传到前端
    return render_template('index.html',**dic_data)

# 柱状图1路由
@app.route('/getBarData1',methods=["get","post"])
def get_Bar_Data1():
    res = []
    province = []
    datalist = []
    for tup in sql_query.getBarData1():
        province.append(tup[0])
        datalist.append(tup[1])
    res.append(province),res.append(datalist)
    return jsonify({"data": res})

# 柱状图2（动态向上滑动）路由
@app.route('/getBarData2',methods=["get","post"])
def get_Bar_Data2():
    res = []
    for tup in sql_query.getBarData2():
        t = time.strptime(str(tup[0]), "%Y-%m-%d %H:%M:%S")
        event_time = str(t.tm_mon) + '-' + str(t.tm_mday) + " " + str(t.tm_hour) + ":" + str(t.tm_min)
        res.append(event_time + " " + tup[1])
    return jsonify({"data": res})

# 中间红色统计数据路由
@app.route('/finalData',methods=["get","post"])
def get_final_Data():
    data = sql_query.getFinalData()
    return jsonify({"confirm": data[0], "heal": data[1], "dead": data[2],
                    "now_local_confirm": data[3],"local_confirm_add": data[4],
                    "local_no_infect_add": data[5]})

# 地图数据路由
@app.route("/getMapData",methods=["get","post"])
def get_Map_Data():
    # post请求参数在request.form中
    id = request.form.get("id")
    res = []
    for tup in sql_query.getMapData(id):
        res.append({"name": tup[0], "value": int(tup[1])})
    return jsonify({"data": res})

# 折线图1路由
@app.route("/getLineData1",methods=["get","post"])
def get_Line_Data1():
    res = []
    ds = []
    heal_add = []
    dead_add = []
    for tup in sql_query.getLineData1():
        # datetime.datetime要转换为str
        t = time.strptime(str(tup[0]), "%Y-%m-%d %H:%M:%S")
        ds.append(str(t.tm_mon) + '.' + str(t.tm_mday))
        heal_add.append(tup[1])
        dead_add.append(tup[2])
    res.append(ds),res.append(heal_add),res.append(dead_add)
    return jsonify({"data": res})

# 折现图2路由
@app.route("/getLineData2",methods=["get","post"])
def get_Line_Data2():
    res = []
    ds = []
    local_confirm_add = []
    local_no_infect_add = []
    for tup in sql_query.getLineData2():
        # datetime.datetime要转换为str
        t = time.strptime(str(tup[0]), "%Y-%m-%d %H:%M:%S")
        ds.append(str(t.tm_mon) + '.' + str(t.tm_mday))
        local_confirm_add.append(tup[1])
        local_no_infect_add.append(tup[2])
    res.append(ds),res.append(local_confirm_add),res.append(local_no_infect_add)
    return jsonify({"data": res})

# 饼形图路由
@app.route("/getPieData",methods=["get","post"])
def get_Pie_Data():
    res = []
    for tup in sql_query.getPieData():
        res.append({"value":tup[1],"name":tup[0]})
    return jsonify({"data": res})

#定时执行爬虫的路由
@app.route("/setMessage",methods=["get","post"])
def set_Message():
   # 执行爬虫
    try:
        main.run()
        return jsonify({"success": 200})
    except:
        return jsonify({"success": 500})


if __name__ == '__main__':
    app.run(port=80)