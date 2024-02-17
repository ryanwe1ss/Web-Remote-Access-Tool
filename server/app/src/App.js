import Clients from './components/clients';
import Panel from './components/panel';

import { useState } from 'react';

// ENV Variables
const server = process.env.SERVER_HOST;
const port = process.env.API_PORT;

function App()
{
  const [client, setClient] = useState(null);

  return (
    <div className='container'>
      <Clients apiHost={server} apiPort={port} setClient={setClient} />
      <Panel client={client} />
    </div>
  );
}
export default App;