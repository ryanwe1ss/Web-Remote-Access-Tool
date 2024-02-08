from flask import Flask, jsonify, request
import logging
import sys
import os

log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)
cli = sys.modules['flask.cli']
cli.show_server_banner = lambda *x: None
api = Flask(__name__)

api.connection = None
api.clients = None

connectionRequiredRoutes = [
    "/api/create-message/<message>",
    "/api/get-connected-webcams",
    "/api/get-client",
]

@api.before_request
def before_request():
  if (request.path in connectionRequiredRoutes):
    if (api.connection is None):
      return jsonify({'status': 'error', message: 'Not connected to a client.'})

@api.get('/api/clients')
def clients():
    clientInfo = []

    for client in api.clients:
        clientInfo.append({
            'id': api.clients.index(client),
            'ip': client['socket'].getpeername()[0],
            'computer': client['computer_name'],
            'username': client['username'],
        })

    return jsonify(clientInfo)