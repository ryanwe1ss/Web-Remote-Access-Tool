import React, { useState, useEffect, useRef } from 'react';

function Clients(args)
{
  const [clients, setClients] = useState([]);
  const clientList = useRef(null);
  const noClients = useRef(null);

  useEffect(() => {
    const socket = new WebSocket('ws://192.168.2.220:5007');

    socket.onmessage = (event) => {
      const clients = JSON.parse(event.data.replace(/'/g, '"'));
      noClients.current.textContent = (clients.length == 0) ? 'Listening for Clients' : null;
      setClients(clients);

      console.log(clients);
      const uniqueData = Object.values(clients.reduce((acc, item) => (acc[`${item.ip}-${item.username}-${item.computer}`] = item, acc), {}));
      console.log(uniqueData);

      // prevent duplicate connections (add date check too maybe?)
    };

    args.setClient(null);
    args.setSelectedClient(null);

    fetch(`${args.route}/api/clients`)
      .then(response => response.json())
      .then(clients => {
        noClients.current.textContent = (clients.length == 0) ? 'Listening for Clients' : null;
        setClients(clients);

        if (clients.length > 0) {
          fetch(`${args.route}/api/client`)
            .then(response => response.json())
            .then(response => {
              if (response.connected) {
                args.setSelectedClient(response.client.connection_id);
                args.setClient(response.client.connection_id);
              }
            }
          );
        
        } else {
          fetch(`${args.route}/api/append-connection`, {
            method: 'POST',
          });
        }
      }
    );

  }, [args.triggerReload]);

  async function ClientConnect(client) {
    clientList.current.style.pointerEvents = 'none';

    await fetch(`${args.route}/api/connect-client/${client}`, {
      method: 'POST'
    });

    const response = await fetch(`${args.route}/api/client`);
    const data = await response.json();

    args.setClient(data);
    args.setSelectedClient(client);
    clientList.current.style.pointerEvents = 'all';
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
            onClick={() => ClientConnect(client.connection_id)}
            className={`client ${args.selectedClient == client.connection_id ? 'selected' : ''}`}
            >
            <i className='bi bi-router status'></i>

            <div className='username'>{client.username}</div>
            <div className='computer'>{client.computer}</div>
            <div className='ip'>{client.ip_address}</div>
          </div>
        ))}

        <div className='no-clients' ref={noClients}></div>
      </div>
    </div>
  );
}
export default Clients;