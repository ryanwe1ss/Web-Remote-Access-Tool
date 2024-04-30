import React from 'react';

// Components
import LeftPanel from './components/left-panel';
import RightPanel from './components/right-panel';

function InteractUtilities(args)
{
  return (
    <React.Fragment>
      <LeftPanel DisconnectPanel={args.DisconnectPanel} />
      <RightPanel />
    </React.Fragment>
  );
}
export default InteractUtilities;