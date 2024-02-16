# standard libraries
import threading
import socket
import json
import time
import os

# third-party libraries
from prettytable import PrettyTable
import webapi

# global variables
table = PrettyTable()
table.field_names = ["ID", "Computer", "IP Address", "Username"]

bufferSize = 1024
clients = []

# utility functions
def receive(client, decode=True):
   data = client.recv(bufferSize)
   return data.decode() if decode else data

def send_and_receive(client, data, decode=True):
   try:
      if (isinstance(data, bytes)): client.send(data)
      else: client.send(data.encode())
      return receive(client, decode)

   except socket.error:
      return False

def isConnected(client):
   try:
      response = send_and_receive(client, 'ping')
      if ('ping' in response):
         return True
      else:
         return False

   except socket.error:
      return False

# server functions
def ManageConnections(command, connection=None):
   try:
      if (command == 'clients'):
         deadClients = []

         for client in clients:
            try:
               response = send_and_receive(client['socket'], 'ping')
               if ('ping' in response):
                  continue
               
            except socket.error:
               deadClients.append(client)

         for client in deadClients:
            clients.remove(client)

         return [] if len(clients) < 1 else clients

      elif (command == 'connect' and connection is not None):
         client = None

         try:
            client = clients[int(connection)]
            response = send_and_receive(client['socket'], 'ping')

            if ('ping' in response):
               return True
            else:
               clients.remove(client)

         except (socket.error, ValueError, IndexError):
            return False

   except (ValueError, IndexError):
      return json.dumps({'status': 'error', 'message': 'Invalid Connection ID, try again'})

   finally:
      command = None

def ControlClient(command, connection):
   client = clients[connection]['socket']

   if (isConnected(client)):
      if (command == 'append'):
         response = send_and_receive(client, 'append')

         if ('append' in response):
            clients.remove(clients[connection])
            return True

   return None

def ClientInformation(connection):
   return {
      'connection_id': connection,
      'computer_name': clients[connection]['computer_name'],
      'username': clients[connection]['username'],
      'ip_address': clients[connection]['socket'].getpeername()[0],
   }

def RemoteConnect(server, port):
   objSocket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
   objSocket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
   objSocket.bind((server, port))
   objSocket.listen(socket.SOMAXCONN)

   while (True):
      try:
         client, _ = objSocket.accept()
         data = json.loads(receive(client))

         clients.append({
            'socket': client,
            'computer_name': data['computer_name'],
            'username': data['username'],
         })

      except socket.error:
         objSocket.close()
         del(objSocket)
         break

webapi.api.ManageConnections = ManageConnections
webapi.api.ControlClient = ControlClient
webapi.api.ClientInformation = ClientInformation