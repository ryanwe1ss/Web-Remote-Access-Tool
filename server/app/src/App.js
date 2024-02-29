import Clients from './components/clients';
import Panel from './components/panel';

import { useState } from 'react';

// ENV Variables
const protocol = process.env.PROTOCOL;
const server = process.env.SERVER_HOST;
const port = process.env.API_PORT;

const route = (parseInt(process.env.FETCH_WITH_PORT) == 1)
  ? `${protocol}://${server}:${port}`
  : `${protocol}://${server}`;

function App()
{
  const [client, setClient] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [triggerReload, setTriggerReload] = useState(0);

  return (
    <div className='container'>
      <Clients
        route={route}
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