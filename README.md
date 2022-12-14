# alert-dashboard
## 说明
- 从 `Prometheus Alertmanager` 中获取告警数据展示
- 不同告警级别使用不同颜色展示，`warning` - 黄色， `critical` - 红色
- 自动刷新
- 告警声音（critical）


## 大屏
![大屏](/static/1.png)

## 设置
![设置](/static/2.png)

## 部署(Docker)
```
mkdir /data/alert-dashboard -p && cd /data/alert-dashboard
echo "SECRET_KEY=`uuidgen | sed 's/-//g'`" >.env
echo "ALERTMANAGER_URL='http://192.168.100.100:9093'" >>.env # ALERTMANAGER地址
echo "TITLE='Alert Dashboard'" >>.env # 网站title，可为空
docker run -it -d --name alert-dashboard \
    -p 5000:5000 \
    -v /data/alert-dashboard/.env:/app/.env \
    -v /data/alert-dashboard/log:/app/log \
    cszhi/alert-dashboard
```

## 部署(手动)
```
mkdir /data && cd /data
git clone https://github.com/cszhi/alert-dashboard.git
python3 -m venv env
source env/bin/activate
pip3 install -r requirements.txt
echo "SECRET_KEY=`uuidgen | sed 's/-//g'`" >.env
echo "ALERTMANAGER_URL='http://192.168.100.100:9093'" >>.env # ALERTMANAGER地址
echo "TITLE='Alert Dashboard'" >>.env # 网站title，可为空
gunicorn -w 4 -b 0.0.0.0:5000 app:app -D
```