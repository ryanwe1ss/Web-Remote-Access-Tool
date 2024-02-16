# default libraries
from dotenv import load_dotenv
import threading
import os

# load environment variables
load_dotenv()

# local libraries
import tcp_server
import webapi

server_host = os.environ.get('SERVER_HOST')
server_port = int(os.environ.get('SERVER_PORT'))
api_port = int(os.environ.get('API_PORT'))

def run_flask_api():
    webapi.api.run(
      host=server_host,
      port=api_port,
      debug=False
    )

if __name__ == '__main__':
    t1 = threading.Thread(target=tcp_server.RemoteConnect, args=(server_host, server_port,))
    t1.daemon = True
    t1.start()

    run_flask_api()