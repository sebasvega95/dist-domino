# -*- coding: UTF-8 -*-

import logging
import socketio
import eventlet
from flask import Flask
import json
from random import choice, shuffle
from string import ascii_uppercase


def gen_token():
    return ''.join(choice(ascii_uppercase) for i in range(12))


logging.basicConfig(format='%(levelname)s: %(message)s', level=logging.DEBUG)
sio = socketio.Server()
app = Flask(__name__)
players = {}
board = []
turn = 0


@sio.on('connect')
def connect(sid, environ):
    print 'connect', sid

def distribute_pieces():
    global players
    all_pieces = [
        [0, 0], [0, 1], [1, 1], [0, 2], [1, 2], [2, 2], [0, 3],
        [1, 3], [2, 3], [3, 3], [0, 4], [1, 4], [2, 4], [3, 4],
        [4, 4], [0, 5], [1, 5], [2, 5], [3, 5], [4, 5], [5, 5],
        [0, 6], [1, 6], [2, 6], [3, 6], [4, 6], [5, 6], [6, 6]
    ]
    shuffle(all_pieces)
    for i, key in enumerate(players.keys()):
        players[key]['pieces'] = all_pieces[7*i:7*(i+1)]


def find_first_player():
    global players
    for i, value in players.values():
        if [6, 6] in value['pieces']:
            return i


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
        if len(players) == 4:
            distribute_pieces()
            # update_board to initialize the game
            idx_first_player = find_first_player()
            turn_token = players.keys()[idx_first_player]
            turn_name  = players[turn_token]['name']
            res = {
                'board': board,
                'turnToken': turn_token,
                'turnName' : turn_name
            }
            sio.emit('update_board', json.dumps(res))
    else:
        res = {
            'response': False,
            'message': 'Game is full, please wait'
        }
    print '==> Players: {}'.format(players)
    sio.emit('start_game', json.dumps(res), room=sid)


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


@sio.on('move')
def player_move(sid, data):
    global board, turn
    data = json.loads(data)
    if (data.side == 'head'):
        board.insert(0, data.piece_selected)
    else:
        board.append(data.piece_selected)
    turn = (turn + 1) % 4
    next_turn_token = players.keys()[turn]
    next_turn_name  = player[next_turn_name][name]
    res = {
        'board': board,
        'turnToken': next_turn_token,
        'turnName' : next_turn_name
    }
    print 'next player: {}. token: {}'.format(turn, next_turn_token)
    sio.emit('update_board', json.dumps(res))
    # next turn


if __name__ == '__main__':
    # wrap Flask application with socketio's middleware
    app = socketio.Middleware(sio, app)

    # deploy as an eventlet WSGI server
    eventlet.wsgi.server(eventlet.listen(('', 9000)), app)
