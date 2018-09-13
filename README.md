Application created by [ThinkJS](http://www.thinkjs.org)

## Install dependencies

```
npm install
```

## Start server

```
npm start
```

## Deploy with pm2

Use pm2 to deploy app on production enviroment.

```
pm2 startOrReload pm2.json
```

<!-- 开发规则 -->

<!--
页面目录 view 的命名
文件夹 home 为前端页面相关内容
-->

<!-- 模块、页面和样式命名规则 -->

<!--
1.模块命名
模块命名统一添加前缀 module*_.pug 或 inc*_.pug 放在文件夹 view/home/module 中；
页面命名统一为*_*.pug 的格式 ；

2.样式名与模块名对应
如：模块名 index_index.pug 那么 styl 文件名 index.styl

3.样式布局尽量采用flex布局方式
-->
