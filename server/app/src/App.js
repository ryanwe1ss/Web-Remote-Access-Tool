import Clients from './components/clients';
import Panel from './components/panel';

import { useState } from 'react';

// ENV Variables
const wsProtocol = process.env.WEBSOCKET_PROTOCOL;
const webProtocol = process.env.WEB_PROTOCOL;
const server = process.env.SERVER_HOST;
const apiPort = process.env.API_PORT;
const wsPort = process.env.WEBSOCKET_PORT;

const route = (parseInt(process.env.FETCH_WITH_PORT) == 1)
  ? `${webProtocol}://${server}:${apiPort}`
  : `${webProtocol}://${server}`;

const webSocketRoute = (parseInt(process.env.FETCH_WITH_PORT) == 1)
  ? `${wsProtocol}://${server}:${wsPort}`
  : `${wsProtocol}://${server}`;

function App()
{
  const [client, setClient] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [triggerReload, setTriggerReload] = useState(0);

  return (
    <div className='container'>
      <Clients
        route={route}
        webSocketRoute={webSocketRoute}
        triggerReload={triggerReload}
        setClient={setClient}
        setTriggerReload={setTriggerReload}
        selectedClient={selectedClient}
        setSelectedClient={setSelectedClient}
      />
      <Panel
        route={route}
        client={client}
        setTriggerReload={setTriggerReload}
      />
    </div>
  );
}
export default App;