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
players = {}


@sio.on('connect')
def connect(sid, environ):
    print 'connect', sid


def update_num_players():
    if len(players) < 4:
        if len(players) == 3:
            message = 'Waiting for another player'
        else:
            message = 'Waiting for another {} players'.format(4 - len(players))
        res = {
            'response': False,
            'message': message
        }
    print '==> Num players: {}'.format(message)
    sio.emit('update_num_players', json.dumps(res))


@sio.on('start_game')
def start_game(sid, data):
    global players

    print 'start_game', sid
    data = json.loads(data)

    if len(players) < 4:
        token = gen_token()
        players[token] = {
            'sid': sid,
            'name': data['username']
        }
        res = {
            'response': True,
            'message': 'Accepted in the game',
            'token': token
        }
    else:
        res = {
            'response': False,
            'message': 'Game is full, please wait'
        }
    print '==> Players: {}'.format(players)
    sio.emit('start_game', json.dumps(res), room=sid)
    if res['response']:
        update_num_players()


@sio.on('disconnect')
def disconnect(sid):
    print 'disconnect', sid


@sio.on('back')
def back(sid, data):
    global players

    data = json.loads(data)
    if data['token'] in players:
        players[data['token']]['sid'] = sid
        res = {
            'response': True,
            'message': 'Welcome back!'
        }
    else:
        res = {
            'response': False,
            'message': 'Session expired'
        }
    print '===> Players: {}'.format(players)
    sio.emit('back', json.dumps(res), room=sid)


if __name__ == '__main__':
    # wrap Flask application with socketio's middleware
    app = socketio.Middleware(sio, app)

    # deploy as an eventlet WSGI server
    eventlet.wsgi.server(eventlet.listen(('', 9000)), app)
