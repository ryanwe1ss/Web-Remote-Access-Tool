import React, { useState, useEffect, useRef } from 'react';

function Clients(args)
{
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);

  const clientList = useRef(null);
  const noClients = useRef(null);

  useEffect(() => {
    fetch(`http://${args.apiHost}:${args.apiPort}/api/clients`)
      .then(response => response.json())
      .then(clients => {
        noClients.current.textContent = (clients.length == 0) ? 'Listening for Clients' : null;
        setClients(clients);

        if (clients.length > 0) {
          fetch(`http://${args.apiHost}:${args.apiPort}/api/client`)
            .then(response => response.json())
            .then(response => {
              if (response.connected) {
                setSelectedClient(response.client.connection_id);
                args.setClient(response.client.connection_id);
              }
            }
          );
        
        } else {
          fetch(`http://${args.apiHost}:${args.apiPort}/api/append-connection`, {
            method: 'POST',
          });
        }
      }
    );

  }, []);

  async function ClientConnect(client) {
    clientList.current.style.pointerEvents = 'none';

    await fetch(`http://${args.apiHost}:${args.apiPort}/api/connect-client/${client}`, {
      method: 'POST'
    });

    const response = await fetch(`http://${args.apiHost}:${args.apiPort}/api/client`);
    const data = await response.json();

    args.setClient(data);
    setSelectedClient(client);
    clientList.current.style.pointerEvents = 'all';
  }
  
  return (
    <div className='client-container'>
      <header>Clients</header>

      <div className='client-list' ref={clientList}>
        {clients && clients.map((client, index) => (
          <div
            key={index}
            onClick={() => ClientConnect(client.connection_id)}
            className={`client ${selectedClient == client.connection_id ? 'selected' : ''}`}
            >
            <i className='bi bi-router status'></i>

            <div className='username'>{client.username}</div>
            <div className='computer'>{client.computer}</div>
            <div className='ip'>{client.ip}</div>
          </div>
        ))}

        <div className='no-clients' ref={noClients}></div>
      </div>
    </div>
  );
}
export default Clients;