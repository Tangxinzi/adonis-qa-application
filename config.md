# 服务器配置 Centos

## NGINX 安装运行

1. 在路径下建立 nginx.repo 文件，/etc/yum.repos.d/nginx.repo，添加一下内容。

```bash
[nginx]
name=nginx repo
baseurl=http://nginx.org/packages/mainline/centos/7/$basearch/
gpgcheck=0
enabled=1
```

2. 执行命令安装 Nginx
```bash
yum install nginx -y
systemctl start nginx
systemctl enable nginx
```

3. 运行 IP，出现欢迎界面

## 安装工具
