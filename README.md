# PandaE 部分仓库和消息系统

本系统是版本1.0.0，只是初步的完成了一部分接口。

X-Powered-By: Express

Database support : mongodb

## Installation

```
git clone git@github.com:crazyshakalaka/-.git

npm install

nodemon app.js //没有安装nodemon就直接node app.js

//前提是必须mongodb数据库

```

然后访问http://localhost:3001



#### 文件目录

|   文件目录   |          作用           |
| :----------: | :---------------------: |
|    model     | mongodb数据库db和Schema |
|    router    |     系统的api(路由)     |
|     text     |     像postman的测试     |
|    app.js    |        启动文档         |
| package.json |          依赖           |




#### 测试

可以安装一个REST Client插件来进行测试

test文件夹里面有一个test.http文件，进去后可以点击Send Request就可以发送请求测试，就可以返回请求的数据。

