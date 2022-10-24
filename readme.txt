flaskProject文件夹中
app.py是flask项目主运行文件
        sql_query.py是为flask项目封装的数据库操作文件
        请在sql_query.py中的get_conn()中修改数据库配置
     spider是项目所需的爬虫模块
         里面的main.py是爬虫主运行文件
         ex_sql.py是封装的存储爬取的数据的数据库操作文件，
         同样在get_conn()中修改数据库配置
     
前端js文件
  china.js,
  echarts.min.js,
  jquery.js
  flexible.js(是淘宝开发的一个用来适配移动端的js框架,这个是我手写的简易版源码)
  index.js(里面是项目定制的echarts以及一些ajax)

数据库用的三张表在covproject.sql中
