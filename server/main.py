# -*- coding: UTF-8 -*-

# import logging
import socketio
import eventlet
from flask import Flask
import json
from random import choice, shuffle
from string import ascii_uppercase


def gen_token():
    return ''.join(choice(ascii_uppercase) for i in range(12))


# logging.basicConfig(format='%(levelname)s: %(message)s', level=logging.DEBUG)
sio = socketio.Server()
app = Flask(__name__)
players = {}
board = []
turn = 0
max_players = 2


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
    per_player = len(all_pieces) / max_players
    for i, key in enumerate(players.keys()):
        players[key]['pieces'] = all_pieces[per_player*i:per_player*(i+1)]


def find_first_player():
    global players, turn

    for i, value in enumerate(players.values()):
        if [6, 6] in value['pieces']:
            turn = i
            return i
    return 0


def can_play(player):
    global board
    canPlay = False
    head = board[0][0]
    tail = board[-1][1]
    for piece in player['pieces']:
        if head in piece or tail in piece:
            canPlay = True
            break
    return canPlay


def end_game_checker():
    ''' Check tie, keep playing or winner'''
    global players, board

    res = None
    # Check winner
    cur_player_token = players.keys()[turn]
    if len(players[cur_player_token]['pieces']) == 0:
        res = {
            'status': 'winner',
            'winner_name': players[cur_player_token]['name'],
            'board': board
        }
    else:
        # Check tie
        tie = True
        for v in players.values():
            if can_play(v):
                tie = False
                break
        if tie:
            points = []
            for val in players.values():
                suma = sum([sum(x) for x in val['pieces']])
                points.append(suma)
            winner_idx = points.index(min(points))
            winner_name = players[players.keys()[winner_idx]]['name']
            res = {
                'status': 'tie',
                'winner_name': winner_name,
                'board': board,
                'players': [p['name'] for p in players.values()],
                'points': points
            }
    if res:
        sio.emit('game_over', json.dumps(res))
        return True
    return False


@sio.on('start_game')
def start_game(sid, data):
    global players

    print 'start_game', sid
    data = json.loads(data)

    if len(players) < max_players:
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
        sio.emit('start_game', json.dumps(res), room=sid)
        if len(players) == max_players:
            distribute_pieces()

            # update_game to initialize the game
            idx_first_player = find_first_player()
            turn_token = players.keys()[idx_first_player]
            turn_name = players[turn_token]['name']
            for value in players.values():
                res = {
                    'board': board,
                    'pieces': value['pieces'],
                    'turnToken': turn_token,
                    'players': [p['name'] for p in players.values()],
                    'turnName': turn_name
                }
                sio.emit('update_game', json.dumps(res), room=value['sid'])
    else:
        res = {
            'response': False,
            'message': 'Game is full, please wait'
        }
        sio.emit('start_game', json.dumps(res), room=sid)


@sio.on('disconnect')
def disconnect(sid):
    print 'disconnect', sid


@sio.on('move')
def player_move(sid, data):
    global board, turn
    data = json.loads(data)

    print 'move', sid, data
    if data['side'] != '':
        if (data['side'] == 'head'):
            board.insert(0, data['pieceSelected'])
        else:
            board.append(data['pieceSelected'])

        if data['pieceSelected'] in players[data['token']]['pieces']:
            players[data['token']]['pieces'].remove(data['pieceSelected'])
        else:
            d = data['pieceSelected'][::-1]
            players[data['token']]['pieces'].remove(d)

    print board
    if not end_game_checker():
        turn = (turn + 1) % max_players
        next_turn_token = players.keys()[turn]
        next_turn_name = players[next_turn_token]['name']
        print 'next player: {}. token: {}'.format(turn, next_turn_token)
        makePass = not can_play(players[next_turn_token])
        for value in players.values():
            res = {
                'board': board,
                'pieces': value['pieces'],
                'turnToken': next_turn_token,
                'turnName': next_turn_name,
                'players': [p['name'] for p in players.values()],
                'makePass': makePass
            }
            sio.emit('update_game', json.dumps(res), room=value['sid'])


if __name__ == '__main__':
    # wrap Flask application with socketio's middleware
    app = socketio.Middleware(sio, app)

    # deploy as an eventlet WSGI server
    eventlet.wsgi.server(eventlet.listen(('', 9000)), app)
