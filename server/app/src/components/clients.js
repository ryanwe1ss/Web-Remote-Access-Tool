import React, { useState, useEffect, useRef } from 'react';

function Clients(args)
{
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const noClients = useRef(null);

  useEffect(() => {
    fetch(`http://${args.apiHost}:${args.apiPort}/api/clients`)
      .then(response => response.json())
      .then(clients => {
        noClients.current.style.display = (clients.length == 0) ? 'block' : 'none';
        setClients(clients);
      }
    );

  }, []);

  async function ClientConnect(client) {
    await fetch(`http://${args.apiHost}:${args.apiPort}/api/connect-client/${client}`, {
      method: 'POST'
    });

    const response = await fetch(`http://${args.apiHost}:${args.apiPort}/api/client`);
    const data = await response.json();

    args.setClient(data);
    setSelectedClient(client);
  }
  
  return (
    <div className='client-container'>
      <header>Clients</header>

      <div className='client-list'>
        {clients && clients.map((client, index) => (
          <div
            key={index}
            onClick={() => ClientConnect(index)}
            className={`client ${selectedClient == index ? 'selected' : ''}`}
            >
            <i className='bi bi-router status'></i>

            <div className='username'>{client.username}</div>
            <div className='computer'>{client.computer}</div>
            <div className='ip'>{client.ip}</div>
          </div>
        ))}

        <div className='no-clients' ref={noClients}>Listening for Clients</div>
      </div>
    </div>
  );
}
export default Clients;