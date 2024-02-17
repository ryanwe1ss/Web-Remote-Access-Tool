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
]

@api.before_request
def before_request():
  if (request.path in connectionRequiredRoutes):
    if (connection is None):
      return jsonify({'status': 502, 'message': 'Not connected to a client.'})

# GET REQUESTS
@api.get('/api/clients')
def clients():
    clients = api.ManageConnections('clients')
    clientInfo = []
    
    for client in clients:
        clientInfo.append({
            'id': clients.index(client),
            'ip': client['socket'].getpeername()[0],
            'computer': client['computer_name'],
            'username': client['username'],
        })

    return jsonify(clientInfo)

@api.get('/api/client')
def getClient():
    return api.ClientInformation(connection)

# POST REQUESTS
@api.post('/api/connect-client/<id>')
def ConnectClient(id):
    global connection

    if connection is None:
        if (api.ManageConnections('connect', id)):
            connection = int(id)
            return jsonify({'status': 200, 'message': 'Connected to Client'})
        else:
            return jsonify({'status': 502, 'message': 'Unable to Connect'})
    else:
        return jsonify({'status': 502, 'message': 'Already connected to a client'})

# PUT REQUESTS
@api.put('/api/append-connection')
def AppendConnection():
    global connection

    if (api.ControlClient('append', connection)):
        message = 'Connection Appended'
        status = 200
    else:
        message = 'Unable to Append Connection, disconnected from client'
        status = 502

    connection = None
    return jsonify({'status': status, 'message': message})

# DELETE REQUESTS
# ...