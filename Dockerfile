FROM python:3.10.5-alpine
COPY ./alert-dashboard /app

WORKDIR /app
RUN pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple
RUN pip install gunicorn -i https://pypi.tuna.tsinghua.edu.cn/simple
RUN cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
EXPOSE 5000
ENTRYPOINT [ "gunicorn","-w","4","-b","0.0.0.0:5000","diffmonitor:app","--log-level","info","--access-logfile","/app/log/acess.log","--error-logfile","/app/log/error.log" ]