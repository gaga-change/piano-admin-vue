## 发布流程

### 测试

添加 tag 后自动发布

### 预发&正式

在 CI/CD -> 流水线（或作业）中手动触发更新


## 相关域名以及账号

### #测试

#### 域名&账号

shark测试：http://testshark.csjmro.com  账号：serviceadmin@csjscm.com   密码：Aa12345678

#### 域名代理地址

192.168.1.37  -  nginx

rancher : static-web:csj-shark-vue-test

### #预发

#### 域名&账号

shark预发：http://stabletiger.csjmro.com  账号：serviceadmin@csjscm.com   密码：Aa12345678

#### 域名代理地址

192.168.1.33  -  nginx

rancher : static-web:csj-shark-vue-rel

### #正式

#### 域名&账号

shark正式：http://shark.csjmro.com   账号：serviceadmin@csjscm.com   密码：Aa12345678


#### 域名代理地址

总控 nginx

rancher : static-web:csj-shark-vue-prod


## 二、启动方式

```
npm install
npm run start

```

