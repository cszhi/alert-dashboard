from flask import Flask, render_template, request, redirect, flash
from datetime import datetime, timedelta

import os
import requests

from dotenv import load_dotenv
load_dotenv('.env')

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev123')


@app.template_filter()
def format_datetime(date, fmt=None):
    try:
        dt = datetime.strptime(
            date, '%Y-%m-%dT%H:%M:%S.%fZ') + timedelta(hours=8)
    except ValueError:
        dt = datetime.strptime(date, '%Y-%m-%dT%H:%M:%SZ') + timedelta(hours=8)
    return dt.strftime('%Y-%m-%d %H:%M:%S')


@app.route('/')
def alert_dashboard():
    sound = True if request.cookies.get('sound') == '1' else False
    countdown = False if request.cookies.get('countdown') == '0' else True

    alertmanager_url = os.getenv('ALERTMANAGER_URL', 'http://127.0.0.1:9093')
    title = os.getenv('TITLE', '')

    w_num, c_num = 0, 0
    sorted_data = {}

    try:
        r = requests.get(alertmanager_url+'/api/v1/alerts?silenced=false&inhibited=false')
    except requests.exceptions.ConnectionError as errc:
        return render_template('index.html', alerts=sorted_data, title=title, w_num=w_num, c_num=c_num, t_num=-1)

    data = eval(str(r.json()['data']).replace(
        'critical', '4').replace('warning', '2'))

    sorted_data_tmp = sorted(data, key=lambda x: (
        x['labels']['alertname']))
    sorted_data = sorted(sorted_data_tmp, key=lambda x: (
        x['labels']['severity']), reverse=True)

    for i in sorted_data:
        severity = i['labels']['severity']
        w_num = w_num + 1 if severity == '2' else w_num
        c_num = c_num + 1 if severity == '4' else c_num

    return render_template('index.html', alerts=sorted_data, title=title, w_num=w_num, c_num=c_num, t_num=w_num + c_num, sound=sound, countdown=countdown)
