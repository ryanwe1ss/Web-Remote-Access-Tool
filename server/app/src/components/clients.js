import React, { useState, useEffect, useRef } from 'react';
import LoadingBar from './../visuals/LoadingBar/loading-bar';
import {
  HttpPost,
  HttpGet,
} from './../utilities/requests';

function Clients(args)
{
  const [clients, setClients] = useState([]);
  const clientList = useRef(null);
  const noClients = useRef(null);

  useEffect(() => {
    const socket = new WebSocket(args.webSocketRoute);

    socket.onmessage = (event) => {
      const clients = JSON.parse(event.data.replace(/'/g, '"'));
      noClients.current.textContent = (clients.length == 0) ? 'Listening for Clients' : null;
      setClients(clients);
    };

  }, []);

  useEffect(() => {
    args.setClient(null);
    args.setSelectedClient(null);

    HttpGet('/api/clients')
      .then(response => response.json())
      .then(clients => {
        noClients.current.textContent = (clients.length == 0) ? 'Listening for Clients' : null;
        clientList.current.style.pointerEvents = 'all';
        setClients(clients);

        if (clients.length > 0) {
          HttpGet('/api/client')
            .then(response => response.json())
            .then(response => {
              if (response.connected) {
                args.setSelectedClient(response.client.connection_id);
                args.setClient(response.client.connection_id);
              }
            }
          );
        
        } else {
          HttpPost('/api/append-connection');
        }
      }
    );

  }, [args.triggerReload]);

  async function ClientConnect(client, index) {
    clientList.current.style.pointerEvents = 'none';
    document.getElementById(index).style.display = 'block';
    
    await HttpPost(`/api/connect-client/${client}`);
    const response = await HttpGet('/api/client');
    const data = await response.json();

    if (data.connected) {
      args.setClient(data);
      args.setSelectedClient(client);
    
    } else {
      args.setTriggerReload(Math.floor(Math.random() * 1000000));
    
    } document.getElementById(index).style.display = 'none';
  }
  
  return (
    <div className='client-container'>
      <header>
        Clients
        <i className='bi bi-list hamburger'></i>
      </header>

      <div className='client-list' ref={clientList}>
        {clients && clients.map((client, index) => (
          <div
            key={index}
            onClick={() => ClientConnect(client.connection_id, index)}
            className={`client ${args.selectedClient == client.connection_id ? 'selected' : ''}`}
            >
            <i className='bi bi-router status'></i>
            <i className='bi bi-person-circle icons'></i><div className='username'>{client.username}</div>
            <i className='bi bi-pc-display-horizontal icons'></i><div className='computer'>{client.computer}</div>
            <i className='bi bi-reception-4 icons'></i><div className='ip'>{client.ip_address}</div>

            <div className='loader' id={index}>
              <LoadingBar size={'tiny'}/>
            </div>
          </div>
        ))}

        <div className='no-clients' ref={noClients}></div>
      </div>
    </div>
  );
}
export default Clients;