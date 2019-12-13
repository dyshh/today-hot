# Dockerfile

FROM node:10-slim
# 创建项目代码的目录
RUN mkdir -p /workspace

# 指定RUN、CMD与ENTRYPOINT命令的工作目录
WORKDIR /workspace

# 复制宿主机当前路径下所有文件到docker的工作目录
COPY . /workspace
# 清除npm缓存文件
RUN npm cache clean --force && npm cache verify
# 如果设置为true，则当运行package scripts时禁止UID/GID互相切换
# RUN npm config set unsafe-perm true

RUN npm config set registry "https://registry.npm.taobao.org"

RUN npm install -g pm2@latest

RUN npm install puppeteer --unsafe-perm=true --allow-root

# RUN yarn

# 设置时区
RUN rm -rf /etc/localtime && ln -s /usr/share/zoneinfo/Asia/Shanghai /etc/localtime

EXPOSE 8888

CMD [ "pm2-docker", "start", "pm2.json" ]

