import { useState } from 'react';

import Clients from './components/clients';
import Panel from './components/panel';

const webSocketRoute = (parseInt(process.env.FETCH_WITH_PORT) == 1)
  ? `${process.env.WEBSOCKET_PROTOCOL}://${process.env.SERVER_HOST}:${process.env.WEBSOCKET_PORT}`
  : `${process.env.WEBSOCKET_PROTOCOL}://${process.env.SERVER_HOST}`;

function App()
{
  const [client, setClient] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [triggerReload, setTriggerReload] = useState(0);
  
  return (
    <div className='container'>
      <Clients
        webSocketRoute={webSocketRoute}
        triggerReload={triggerReload}
        setClient={setClient}
        setTriggerReload={setTriggerReload}
        selectedClient={selectedClient}
        setSelectedClient={setSelectedClient}
      />
      <Panel
        client={client}
        setTriggerReload={setTriggerReload}
      />
    </div>
  );
}
export default App;