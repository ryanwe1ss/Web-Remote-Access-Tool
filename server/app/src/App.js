import { useState } from 'react';

import Clients from './interface/clients';
import Panel from './interface/panel';

const webSocketRoute = (parseInt(process.env.FETCH_WITH_PORT) == 1)
  ? `${process.env.WEBSOCKET_PROTOCOL}://${process.env.SERVER_HOST}:${process.env.WEBSOCKET_PORT}`
  : `${process.env.WEBSOCKET_PROTOCOL}://${process.env.SERVER_HOST}`;

function App()
{
  const [client, setClient] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [triggerReload, setTriggerReload] = useState(0);

  function DisconnectPanel() {
    setTriggerReload(Math.floor(Math.random() * 1000000));
  }
  
  return (
    <div className='container'>
      <Clients
        webSocketRoute={webSocketRoute}
        triggerReload={triggerReload}
        setClient={setClient}
        DisconnectPanel={DisconnectPanel}
        selectedClient={selectedClient}
        setSelectedClient={setSelectedClient}
      />
      <Panel
        client={client}
        DisconnectPanel={DisconnectPanel}
      />
    </div>
  );
}
export default App;