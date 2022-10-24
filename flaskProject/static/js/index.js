//右上角时间
var t = null;
t = setTimeout(time, 1000); //开始运行
function time() {
    clearTimeout(t); //清除定时器
    dt = new Date();
    var y = dt.getFullYear();
    var mt = dt.getMonth() + 1;
    var day = dt.getDate();
    var h = dt.getHours(); //获取时
    var m = dt.getMinutes(); //获取分
    var s = dt.getSeconds(); //获取秒
    document.querySelector(".showTime").innerHTML = "当前时间：" + y + "年" + mt + "月" +day + "-" + h + "时" + m + "分" + s +"秒";
    t = setTimeout(time, 1000); //设定定时器，循环运行
};

//中间红色字体的统计数据获取
//这个函数初始不调用，放在定时器中调用
function get_final_data() {
    $.ajax({
        url: "/finalData",
        type:"POST",
        success: function(data) {
            $("#on li").eq(0).text(data.confirm);
            $("#on li").eq(1).text(data.heal);
            $("#on li").eq(2).text(data.dead);
            $("#under li").eq(0).text(data.local_confirm_add);
            $("#under li").eq(1).text(data.now_local_confirm);
            $("#under li").eq(2).text(data.local_no_infect_add);
        },
        error: function(xhr, type, errorThrown) {

        }
    })
};


// echarts部分

//柱状图
 // 绘制图
  // 实例化对象
var barChart1 = echarts.init(document.querySelector(".bar1 .chart"));
   // 指定数据
var barOption1 = {
     color: ["#2f89cf"],
     tooltip: {
         trigger: 'axis',
         axisPointer: { // 坐标轴指示器，坐标轴触发有效
             type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
         }
     },
     // 修改图表的大小
     grid: {
         left: "0%",
         top: "10px",
         right: "0%",
         bottom: "4%",
         containLabel: true
     },
     xAxis: {
         type: "category",
         data: [],
         axisTick: {
             alignWithLabel: true
         },
         // 修改刻度标签 相关样式
         axisLabel: {
             color: "rgba(255,255,255,.6) ",
             fontSize: 13
         },
         // 不显示x坐标轴的样式
         axisLine: {
             show: false
         }
     },
     yAxis: {
         type: "value",
         // 修改刻度标签 相关样式
         axisLabel: {
             color: "rgba(255,255,255,.6) ",
             fontSize: "12"
         },
         // y轴的线条改为了 2像素
         axisLine: {
             lineStyle: {
                 color: "rgba(255,255,255,.1)",
                 width: 2
             }
         },
         // y轴分割线的颜色
         splitLine: {
             show: false, //去掉Y轴分割线
             // lineStyle: {
             //     color: "#57617B"
             // }
         }
     },
     series: [{
         type: "bar",
         barWidth: "35%",
         data: [],
         itemStyle: {
             // 修改柱子圆角
             barBorderRadius: 5
         }
     }]
 };
// 把配置项给实例对象
barChart1.setOption(barOption1);
// 让图表跟随屏幕自动的去适应
window.addEventListener("resize", function() {
     barChart1.resize();
});

  //数据获取
function getBarData1(){
    $.ajax({
        url: "/getBarData1",
        type:"POST",
        success: function(data) {
            barOption1.xAxis.data=data.data[0];
            barOption1.series[0].data=data.data[1];
            barChart1.setOption(barOption1);
        },
        error: function(xhr, type, errorThrown) {

        }
    })
};
getBarData1();


//柱状图2(动态向上滑动)
// 1. 实例化对象
var barChart2 = echarts.init(document.querySelector(".bar2 .chart"));
var barOption2 = {
    legend: {
        show: false,
    },
    tooltip: {
        show:false
    },
    grid: {
        left: "3%",
        right: "4%",
        top: "5%",
        bottom: "3%",
        containLabel: true,
    },
    xAxis: {
        type: "value",
        //坐标轴两边留白策略
        boundaryGap: true,
        //是否显示坐标轴刻度
        axisTick: { show: false },
        //坐标轴线线的颜色
        axisLine: {
            show: false,
        },
        axisLabel: {
            show: false,
        },
        //是否显示网格线。默认数值轴显示
        splitLine: {
            show: false,
        },
    },
    dataZoom: [{
        //滑动条
        yAxisIndex: 0, //这里是从X轴的0刻度开始
        show: false, //是否显示滑动条，不影响使用
        type: "slider", // 这个 dataZoom 组件是 slider 型 dataZoom 组件
        startValue: 0, // 从头开始。
        endValue: 4, // 一次性展示5个。
    },],
    yAxis: {
        type: "category",
        inverse: true, //是否是反向坐标轴
        axisLabel: {
            show: true,
            inside:true,
            fontSize:14,
            lineHeight:20,
            color:"#fff",
            width:330,
            overflow: "break"
        },
        //是否显示分隔线。默认数值轴显示
        splitLine: {
            show: false,
        },
        axisTick: {
            show: false
        },
        //坐标轴线线的颜色
        axisLine: {
            show: false
        },
        data:[]
    },
    series: [{
        type: "bar",
        barWidth: "65%",
        data: [100, 100, 100, 100, 100, 100, 100, 100, 100,
               100,100,100,100,100,100,100,100,100,100,100],
        itemStyle:{
            color:"rgba(141,162,223,0.3)",
            borderRadius:20

        }
    },],
    animation: true,
    // 将初始动画的时长关掉
    animationDuration: 0,
};
barChart2.setOption(barOption2);
// 让图表跟随屏幕自动的去适应
window.addEventListener("resize", function() {
    barChart2.resize();
});

//获取数据
function getBarData2(){
    $.ajax({
        url: "/getBarData2",
        type:"POST",
        success: function(data) {
            barOption2.yAxis.data=data.data;
            barChart2.setOption(barOption2);
        },
        error: function(xhr, type, errorThrown) {

        }
    })
};
getBarData2();

//自动滚动
var timeOut = setInterval(()=>{
    if (barOption2.dataZoom[0].endValue == barOption2.series[0].data.length ) {
        barOption2.dataZoom[0].endValue = 4;
        barOption2.dataZoom[0].startValue = 0;
    } else {
        barOption2.dataZoom[0].endValue = barOption2.dataZoom[0].endValue + 1;
        barOption2.dataZoom[0].startValue = barOption2.dataZoom[0].startValue + 1;
    }
    barChart2.setOption(barOption2);
},2000)


// 折线图1
// 绘制图表
// 1. 实例化对象
var lineChart1 = echarts.init(document.querySelector(".line1 .chart"));
// 2.指定配置
var lineOption1 = {
    // 通过这个color修改两条线的颜色
    color: ["#00f2f1","#ed3f35"],
    tooltip: {
        trigger: "axis"
    },
    legend: {
        // 如果series 对象有name 值，则 legend可以不用写data
        // 修改图例组件 文字颜色
        textStyle: {
            color: "#4c9bfd"
        },
    },
    grid: {
        top: "20%",
        left: "3%",
        right: "4%",
        bottom: "3%",
        show: true, // 显示边框
        borderColor: "#012f4a", // 边框颜色
        containLabel: true // 包含刻度文字在内
    },

    xAxis: {
        type: "category",
        boundaryGap: false,
        data: [],
        axisTick: {
            show: false // 去除刻度线
        },
        axisLabel: {
            color: "#4c9bfd" // 文本颜色
        },
        axisLine: {
            show: false // 去除轴线
        }
    },
    yAxis: {
        type: "value",
        axisTick: {
            show: false // 去除刻度线
        },
        axisLabel: {
            color: "#4c9bfd" // 文本颜色
        },
        axisLine: {
            show: false // 去除轴线
        },
        splitLine: {
            lineStyle: {
                color: "#012f4a" // 分割线颜色
            }
        }
    },
    series: [{
            name: "治愈人数增加",
            type: "line",
            // true 可以让我们的折线显示带有弧度
            smooth: true,
        // 设置拐点
            symbol: "circle",
            // 拐点大小
            symbolSize: 5,
            // 开始不显示拐点， 鼠标经过显示
            showSymbol: false,
            // 设置拐点颜色以及边框
            itemStyle: {
                borderColor: "rgba(221, 220, 107, .1)",
                borderWidth: 8
            },
            data: []
        },
        {
            name: "死亡人数增加",
            type: "line",
            smooth: true,
            // 设置拐点
            symbol: "circle",
            // 拐点大小
            symbolSize: 5,
            // 开始不显示拐点， 鼠标经过显示
            showSymbol: false,
            // 设置拐点颜色以及边框
            itemStyle: {
                borderColor: "rgba(221, 220, 107, .1)",
                borderWidth: 8
            },
            data: []
        }
    ]
};

// 3. 把配置给实例对象
lineChart1.setOption(lineOption1);
// 4. 让图表跟随屏幕自动的去适应
window.addEventListener("resize", function() {
    lineChart1.resize();
});
//折线图1数据获取
function getLineData1(){
    $.ajax({
        url: "/getLineData1",
        type:"POST",
        success: function(data) {
            lineOption1.xAxis.data=data.data[0];
            lineOption1.series[0].data=data.data[1];
            lineOption1.series[1].data=data.data[2];
            lineChart1.setOption(lineOption1);
        },
        error: function(xhr, type, errorThrown) {

        }
    })
};
getLineData1();



// 折线图2
// 绘制图
var lineChart2 = echarts.init(document.querySelector(".line2 .chart"));
var lineOption2 = {
    tooltip: {
        trigger: "axis"
    },
    legend: {
        top: "0%",
        textStyle: {
            color: "#4c9bfd"
        },
    },

    grid: {
        left: "10",
        top: "30",
        right: "10",
        bottom: "10",
        containLabel: true
    },
    xAxis: {
        type: "category",
        boundaryGap: false,
        // x轴更换数据
        data: [],
        // 文本颜色为rgba(255,255,255,.6)  文字大小为 12
        axisLabel: {
            textStyle: {
                color: "rgba(255,255,255,.6)",
                fontSize: 12
            }
        },
        // x轴线的颜色为   rgba(255,255,255,.2)
        axisLine: {
            lineStyle: {
                color: "rgba(255,255,255,.2)"
            }
        }
    },
    yAxis: {
        type: "value",
        axisTick: { show: false },
        axisLine: {
            lineStyle: {
                color: "rgba(255,255,255,.1)"
            }
        },
        axisLabel: {
            textStyle: {
                color: "rgba(255,255,255,.6)",
                fontSize: 12
            }
        },
        // 修改分割线的颜色
        splitLine: {
            lineStyle: {
                color: "rgba(255,255,255,.1)"
            }
        }
    },
    series: [{
            name: "本土确诊人数增加",
            type: "line",
            smooth: true,
            // 单独修改当前线条的样式
            lineStyle: {
             normal: {
                color: "#0184d5",
                width: 2
              }
            },
            // 填充颜色设置
            areaStyle: {
              normal:{
                 color: new echarts.graphic.LinearGradient(
                    0,
                    0,
                    0,
                    1, [{
                            offset: 0,
                            color: "rgba(1, 132, 213, 0.4)" // 渐变色的起始颜色
                        },
                        {
                            offset: 0.8,
                            color: "rgba(1, 132, 213, 0.1)" // 渐变线的结束颜色
                        }
                    ],
                    false
                ),
                shadowColor: "rgba(0, 0, 0, 0.1)"
              }
            },
            // 设置拐点
            symbol: "circle",
            // 拐点大小
            symbolSize: 8,
            // 开始不显示拐点， 鼠标经过显示
            showSymbol: false,
            // 设置拐点颜色以及边框
            itemStyle: {
                color: "#0184d5",
                borderColor: "rgba(221, 220, 107, .1)",
                borderWidth: 12
            },
            data: []
        },
        {
            name: "本土无症状人数增加",
            type: "line",
            smooth: true,
            lineStyle: {
                normal: {
                    color: "#00d887",
                    width: 2
                }
            },
            areaStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(
                        0,
                        0,
                        0,
                        1, [{
                                offset: 0,
                                color: "rgba(0, 216, 135, 0.4)"
                            },
                            {
                                offset: 0.8,
                                color: "rgba(0, 216, 135, 0.1)"
                            }
                        ],
                        false
                    ),
                    shadowColor: "rgba(0, 0, 0, 0.1)"
                }
            },
            // 设置拐点 小圆点
            symbol: "circle",
            // 拐点大小
            symbolSize: 5,
            // 设置拐点颜色以及边框
            itemStyle: {
                color: "#00d887",
                borderColor: "rgba(221, 220, 107, .1)",
                borderWidth: 12
            },
            // 开始不显示拐点， 鼠标经过显示
            showSymbol: false,
            data: []
        }
    ]
};
lineChart2.setOption(lineOption2);
// 4. 让图表跟随屏幕自动的去适应
window.addEventListener("resize", function() {
    lineChart2.resize();
});
//折线图2数据获取
function getLineData2(){
    $.ajax({
        url: "/getLineData2",
        type:"POST",
        success: function(data) {
            lineOption2.xAxis.data=data.data[0];
            lineOption2.series[0].data=data.data[1];
            lineOption2.series[1].data=data.data[2];
            lineChart2.setOption(lineOption2);
        },
        error: function(xhr, type, errorThrown) {

        }
    })
};
getLineData2();



// 饼形图
var pieChart = echarts.init(document.querySelector(".pie .chart"));
var pieOption = {
    color: [
        "#006cff",
        "#60cda0",
        "red",
    ],
    tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
        bottom: "0%",
        itemWidth: 15,
        itemHeight: 15,
        textStyle: {
            color: "rgba(255,255,255,.5)",
            fontSize: "14"
        }
    },
    series: [{
        name: "地区分布",
        type: "pie",
        radius: ["40%", "70%"],
        center: ["50%", "45%"],
        // 图形的文字标签
        label: {
            fontSize: 10
        },
        // 链接图形和文字的线条
        labelLine: {
            // length 链接图形的线条
            length: 8,
            // length2 链接文字的线条
            length2: 8
        },
        data: []
    }]
};
pieChart.setOption(pieOption);
// 监听浏览器缩放，图表对象调用缩放resize函数
window.addEventListener("resize", function() {
    pieChart.resize();
});

// 饼形图数据获取
function getPieData(){
    $.ajax({
        url: "/getPieData",
        type:"POST",
        success: function(data) {
            pieOption.series[0].data=data.data;
            pieChart.setOption(pieOption);
        },
        error: function(xhr, type, errorThrown) {

        }
    })
};
getPieData();


// 疫情地图模块
// 疫情地图
var mapChart = echarts.init(document.querySelector(".map .chart"));
var mapOption = {
    tooltip: {
        trigger: 'item'
    },
    //左侧小导航图标
    visualMap: {
        show: true,
        left: 'left',
        bottom: '8%',
        textStyle: {
            color:"#fff",
            fontSize: 10,
        },
        pieces: [
                    {start: 1,end: 9 },
                    {start: 10, end: 99 },
                    {start: 100, end: 999 },
                    {start: 1000, end: 9999 },
                    {start: 10000 }],
        color: ['#8A3310', '#C64918', '#E55B25', '#F2AD92', '#F9DCD1']
    },
    //配置属性
    series: [{
        name: '人数',
        type: 'map',
        mapType: 'china',
        // 把中国地图放大了1.1倍
        zoom: 1.1,
        roam: false, //拖动和缩放
        itemStyle: {
            normal: {
                borderWidth: 1, //区域边框宽度
                areaColor: "rgba(20, 41, 87,0.6)",
                borderColor: "rgba(42, 213, 222,0.5)",
            },
            emphasis: { //鼠标滑过地图高亮的相关设置
                borderWidth: 1,
                borderColor: '#4b0082',
                areaColor: "#2B91B7",
            }
        },
        label: {
            normal: {
                show: true, //省份名称
                fontSize: 10,
                color:"#fff"
            },
            emphasis: {
                show: true,
                fontSize: 10,
            }
        },
        data: [] //数据
    }]
};
mapChart.setOption(mapOption);
// 监听浏览器缩放，图表对象调用缩放resize函数
window.addEventListener("resize", function() {
    mapChart.resize();
});

// 疫情地图模块数据获取操作
var index = 0;
function getMapData(index){
    $.ajax({
        url: "/getMapData",
        type:"POST",
        data:{id:index},
        dataType:'json',
        success: function(data) {
            mapOption.series[0].data=data.data;
            mapChart.setOption(mapOption);
        },
        error: function(xhr, type, errorThrown) {
//             console.log(index)
        }
    })
};
getMapData(index);

// 实现点击切换数据重新渲染
$(function(){
    $(".buttons li").click(function(){
            $(this).css("background-color","rgba(43, 145, 183,0.5)").siblings().css("background-color","");
            index = $(this).index();
            getMapData(index);
        }
    )
});

//向后台每两小时55分发送数据让其运行爬虫更新数据
function setMessage(){
    $.ajax({
        url: "/setMessage",
        type:"POST",
        success: function(data) {

        },
        error: function(xhr, type, errorThrown) {

        }
    })
}

setInterval(setMessage,175*60*1000);

//定时器，每三小时更新数据
setInterval(function(){
        get_final_data();
        getMapData(index);
        getBarData1();
        getBarData2();
        getLineData1();
        getLineData2();
        getPieData();
},3600*1000*3);