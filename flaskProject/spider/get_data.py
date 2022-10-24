import requests
import json
import time
import random
import re
# ip代理池
ips = [{"HTTP": "175.42.129.105"}, {"HTTP": "121.232.148.97"}, {"HTTP": "121.232.148.72"}]
proxy = random.choice(ips)

# headers池
headers = [
    {
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.70 Safari/537.36'
    },
    {
        'user-agent': "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2227.0 Safari/537.36"
    },
    {
        'user-agent': "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:22.0) Gecko/20130328 Firefox/22.0"
    }
]
header = random.choice(headers)

# 返回历史数据和当日详细数据
def get_tencent_data():
    # 当日详情数据的url
    url1 = "https://api.inews.qq.com/newsqa/v1/query/inner/publish/modules/list?modules=localCityNCOVDataList,diseaseh5Shelf"
    # 历史数据的url
    url2 = "https://api.inews.qq.com/newsqa/v1/query/inner/publish/modules/list?modules=chinaDayListNew,chinaDayAddListNew&limit=30"

    r1 = requests.get(url=url1, headers=header,proxies=proxy).text
    r2 = requests.get(url=url2, headers=header,proxies=proxy).text

    # json字符串转字典
    data_all1 = json.loads(r1)['data']['diseaseh5Shelf']
    data_all2 = json.loads(r2)['data']

    # 历史数据
    history = {}
    for i in data_all2["chinaDayListNew"]:
        # 时间
        ds = i["y"] + '.' + i["date"]
        tup = time.strptime(ds, "%Y.%m.%d")  # 匹配时间  结果是时间元祖
        ds = time.strftime("%Y-%m-%d", tup)  # 改变时间输入格式，不然插入数据库会报错，数据库是datatime格式
        confirm = i["confirm"]
        local_confirm = i["localConfirm"]
        local_no_infect = i["noInfectH5"]
        heal = i["heal"]
        dead = i["dead"]
        history[ds] = {"confirm": confirm, "local_confirm": local_confirm, "local_no_infect": local_no_infect ,"heal": heal, "dead": dead}
    for i in data_all2["chinaDayAddListNew"]:
        ds = i["y"] + '.' + i["date"]
        tup = time.strptime(ds, "%Y.%m.%d")  # 匹配时间
        ds = time.strftime("%Y-%m-%d", tup)  # 改变时间输入格式，不然插入数据库会报错，数据库是datatime格式
        confirm_add = i["confirm"]
        local_confirm_add = i["localConfirmadd"]
        local_no_infect_add = i["localinfectionadd"]
        heal_add = i["heal"]
        dead_add = i["dead"]
        history[ds].update({"confirm_add": confirm_add, "local_confirm_add": local_confirm_add,"local_no_infect_add":local_no_infect_add, "heal_add": heal_add, "dead_add": dead_add})

    # 当日详细数据
    details = []
    update_time = data_all1["lastUpdateTime"]
    data_country = data_all1["areaTree"][0]
    data_province = data_country["children"]  # 中国各省
    for pro_infos in data_province:
        province = pro_infos["name"]  # 省名
        for city_infos in pro_infos["children"]:
            city = city_infos["name"]
            # 累计确珍人数
            confirm = city_infos["total"]["confirm"]
            # 现有确诊人数
            now_confime = city_infos["total"]["nowConfirm"]
            # 新增确诊人数
            confirm_add = city_infos["today"]["confirm"]
            # 新增无症状
            wzz_add = city_infos["today"]["wzz_add"]
            if wzz_add == '':
                wzz_add = 0
            else:
                wzz_add = int(wzz_add)
            # 累计治愈人数
            heal = city_infos["total"]["heal"]
            # 累计死亡人数
            dead = city_infos["total"]["dead"]
            details.append([update_time, province, city, confirm, now_confime, confirm_add,wzz_add, heal, dead])
    return history, details

# 获取百度数据
def get_baidu_data():
    url3 = "https://mss0.bdstatic.com/se/static/act/captain/bundles/458/a6dc3abe.a4bd61aa.js"
    js_data = requests.get(url=url3,headers=header,proxies=proxy).text
    # print(js_data)
    e = r".*resource_id=(\d+)&alr.*"
    resource_id = re.match(e,js_data).group(1)
    url4 = "https://opendata.baidu.com/data/inner?"
    params = {
        "tn": "reserved_all_res_tn",
        "dspName": "iphone",
        "from_sf": 1,
        "dsp": "iphone",
        "resource_id": resource_id,
        "alr": 1,
        "query": "国内新型肺炎最新动态"
    }
    data = requests.get(url=url4,params=params,headers=header,proxies=proxy).text
    dic_data = json.loads(data)["Result"][0]["items_v2"][0]["aladdin_res"]["DisplayData"]["result"]
    dataList = []
    for i in dic_data["items"]:
        ts = int(i["eventTime"])
        timeTup = time.localtime(ts)
        eventTime = time.strftime("%Y-%m-%d %H:%M:%S", timeTup)
        eventDescription = i["eventDescription"]
        dataList.append([eventTime,eventDescription])
    return dataList