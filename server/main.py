# -*- coding: UTF-8 -*-

import logging
import socketio
import eventlet
from flask import Flask
import json
from random import choice
from string import ascii_uppercase


def gen_token():
    return ''.join(choice(ascii_uppercase) for i in range(12))


logging.basicConfig(format='%(levelname)s: %(message)s', level=logging.DEBUG)
sio = socketio.Server()
app = Flask(__name__)
logged_users = {}
players = []


@sio.on('connect')
def connect(sid, environ):
    print('connect ', sid)


@sio.on('start-game')
def start_game(sid, data):
    print 'start-game'


@sio.on('message')
def message(sid, data):
    print('message ', data)
    sio.emit('news', '1.2 en distribuidos para el que lo lea', sid)


@sio.on('disconnect')
def disconnect(sid):
    print('disconnect ', sid)


@sio.on('back')
def back(sid, data):
    global logged_users
    data = json.loads(data)
    logged_users[data['token']] = sid
    print 'USERS', logged_users


if __name__ == '__main__':
    # wrap Flask application with socketio's middleware
    app = socketio.Middleware(sio, app)

    # deploy as an eventlet WSGI server
    eventlet.wsgi.server(eventlet.listen(('', 9000)), app)
