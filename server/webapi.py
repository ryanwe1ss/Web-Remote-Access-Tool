from flask import Flask, jsonify, request
from flask_cors import CORS
import logging
import sys
import os

log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)
cli = sys.modules['flask.cli']
cli.show_server_banner = lambda *x: None

api = Flask(__name__)
CORS(api)

connection = None
connectionRequiredRoutes = [
    '/api/client',
    '/api/append-connection',
    '/api/send-message',
]

@api.before_request
def before_request():
    if (request.path in connectionRequiredRoutes):
        if (connection is None):
            return jsonify({'connected': False, 'message': 'Not connected to a client.'})

# GET REQUESTS
@api.get('/api/clients')
def clients():
    clients = api.ManageConnections('clients')
    clientInfo = []
    
    for client in clients:
        clientInfo.append({
            'ip': client['socket'].getpeername()[0],
            'computer': client['computer_name'],
            'username': client['username'],
            'connection_id': client['connection_id'],
        })

    return jsonify(clientInfo)

@api.get('/api/client')
def getClient():
    global connection

    info = api.ClientInformation(connection)
    if (info is None):
        connection = None
        return jsonify({'connected': False, 'message': 'Not connected to a client.'})

    return {
        'connected': connection is not None,
        'client': api.ClientInformation(connection),
    }

# POST REQUESTS
@api.post('/api/connect-client/<id>')
def ConnectClient(id):
    global connection

    if (api.ManageConnections('connect', id)):
        connection = int(id)
        return jsonify({'connected': True, 'message': 'Connected to Client'})
    else:
        return jsonify({'connected': False, 'message': 'Unable to Connect'})

@api.post('/api/append-connection')
def AppendConnection():
    global connection

    if (api.ControlClient('append', connection)):
        message = 'Connection Appended'
        connected = True
    else:
        message = 'Unable to Append Connection, disconnected from client'
        connected = False

    connection = None
    return jsonify({'connected': connected, 'message': message})

@api.post('/api/send-message')
def SendMessage():
    global connection

    message = request.json['message']
    if (api.SendMessage(connection, message)):
        return jsonify({'sent': True, 'message': 'Message Sent'})
    else:
        return jsonify({'sent': False, 'message': 'Unable to Send Message'})