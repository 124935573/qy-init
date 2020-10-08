FROM registry.cn-hangzhou.aliyuncs.com/choerodon-tools/frontbase:0.7.0

ENV LANG en_US.UTF-8

ENV SERVER_NAME help-center-front.itdev2.quanyou.com.cn
RUN echo "Asia/shanghai" > /etc/timezone;

RUN rm /etc/nginx/conf.d/default.conf
ADD default.conf /etc/nginx/conf.d/

ADD dist /usr/share/nginx/html
COPY enterpoint.sh /usr/share/nginx/html
RUN chmod 777 /usr/share/nginx/html/enterpoint.sh
ENTRYPOINT ["/usr/share/nginx/html/enterpoint.sh"]
CMD ["nginx", "-g", "daemon off;"]

EXPOSE 80
EXPOSE 443
