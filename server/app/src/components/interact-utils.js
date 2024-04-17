import { useEffect, useRef, useState } from 'react';
import StatePrompt from '../visuals/SystemStateActionsModal/state-prompt';
import {
  HttpPost,
}
from '../utilities/requests';

function InteractUtilities(args)
{
  const [statePrompt, setStatePrompt] = useState(false);
  const [systemAction, setSystemAction] = useState(null);

  const messageResponseBody = useRef(null);
  const messageResponse = useRef(null);
  const message = useRef(null);

  useEffect(() => {
    messageResponseBody.current.style.display = 'none';

  }, [args.client]);

  async function SendMessage() {
    if (!message.current.value) return;

    const startTime = new Date().getTime();
    const request = await HttpPost('/api/send-message', {
        message: message.current.value
    });

    const response = await request.json();
    const timeInMs = new Date().getTime() - startTime;

    messageResponse.current.innerHTML = (response.sent)
      ? `Sent in ${(timeInMs / 1000).toFixed(2)}s (${timeInMs}ms)`
      : 'Failed to send message';

    messageResponseBody.current.style.display = 'block';
    message.current.value = null;

    if (response.connected == false)
      setTimeout(() => args.DisconnectPanel(), 2000);
  }

  function AppendConnection() {
    HttpPost('/api/append-connection')
      .then(() => args.DisconnectPanel());
  }

  function HandleSystemAction(action) {
    setSystemAction(action);
    setStatePrompt(true);
  }

  return (
    <div className='left-panel'>
      <div className='elements'>
        <button className='append-btn' onClick={AppendConnection}>
          <i className='bi bi-arrow-left-circle'></i>&nbsp;
          Append Connection
        </button>

        <div className='system-buttons'>
          <button className='shutdown' onClick={() => HandleSystemAction('shutdown')}>
            <i className='bi bi-power'></i>&nbsp;
            <label>Shutdown</label>
          </button>

          <button className='restart' onClick={() => HandleSystemAction('restart')}>
            <i className='bi bi-arrow-repeat'></i>&nbsp;
            <label>Restart</label>
          </button>

          <button className='lock' onClick={() => HandleSystemAction('lock')}>
            <i className='bi bi-box-arrow-left'></i>&nbsp;
            <label>Lock</label>
          </button>
        </div>

        <hr/>
        <textarea placeholder='Type a message...' ref={message} maxLength={1023} />
        <div className='controls'>
          <button onClick={SendMessage}>
            <i className='bi bi-envelope-arrow-down'></i>&nbsp;
            Send Message
          </button>

          <div className='message-sent' ref={messageResponseBody}>
            <i className='bi bi-info-circle success'></i>&nbsp;
            <span ref={messageResponse}></span>
          </div>
        </div>
      </div>

      <StatePrompt
        route={args.route}
        show={statePrompt}
        switchOn={setStatePrompt}
        systemAction={systemAction}
        DisconnectPanel={args.DisconnectPanel}
      />
    </div>
  );
}
export default InteractUtilities;