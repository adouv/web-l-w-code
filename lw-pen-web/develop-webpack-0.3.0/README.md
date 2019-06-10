# vue-multi-pages

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

# run gulp
./build/electron.build.js

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).


########################### 在kafka目录下执行 ##################################

# 启动zookeeper kafka/
.\bin\windows\zookeeper-server-start.bat .\config\zookeeper.properties


# 启动kafka kafka/
.\bin\windows\kafka-server-start.bat .\config\server.properties

# 创建kafkatopic  kafka/
.\bin\windows\kafka-topics.bat --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic lwk


########################### flume bin目录执行 ##################################
# 启动命令
flume-ng.cmd  agent -conf ../conf  -conf-file ../conf/flume.conf  -name a1  -property flume.root.logger=INFO,console 