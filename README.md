﻿# COVID-19-show

使用代理的时候出现如下错误：
ssl.SSLEOFError: EOF occurred in violation of protocol (_ssl.c:1129)

将urllib3的版本降级到1.25.11就可以解决问题
pip install urllib3==1.25.11


