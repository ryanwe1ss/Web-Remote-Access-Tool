# standard libraries
import threading
import socket
import random
import json
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

def send_and_receive(connection, data, decode=True):
   try:
      client = None

      for c in clients:
         if (c['connection_id'] == int(connection)):
            client = c['socket']
            break

      if (isinstance(data, bytes)):
         client.send(data)
      else:
         client.send(data.encode())
         
      return receive(client, decode)

   except (IndexError, AttributeError, socket.error):
      return list()

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

         return [] if len(clients) < 1 else clients

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
      return None

   for client in clients:
      if (client['connection_id'] == connection):
         return {
            'connection_id': client['connection_id'],
            'computer_name': client['computer_name'],
            'username': client['username'],
            'ip_address': client['socket'].getpeername()[0],
         }

   return None

def SendMessage(connection, message):
   response = send_and_receive(connection, 'message')
   if ('message' in response):
      status = send_and_receive(connection, message)
      return status

def RemoteConnect(server, port):
   objSocket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
   objSocket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
   objSocket.bind((server, port))
   objSocket.listen(socket.SOMAXCONN)

   while (True):
      try:
         client, _ = objSocket.accept()
         data = json.loads(receive(client))
         connectionId = random.randint(100000000, 999999999)

         clients.append({
            'socket': client,
            'computer_name': data['computer_name'],
            'username': data['username'],
            'connection_id': connectionId,
         })

      except socket.error:
         objSocket.close()
         del(objSocket)
         break

webapi.api.ManageConnections = ManageConnections
webapi.api.ControlClient = ControlClient
webapi.api.ClientInformation = ClientInformation
webapi.api.SendMessage = SendMessage