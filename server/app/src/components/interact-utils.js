import { useRef } from 'react';

function InteractUtilities(args)
{
  const message = useRef(null);

  function SendMessage() {
    if (!message.current.value) return;

    fetch(`http://${args.apiHost}:${args.apiPort}/api/send-message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: message.current.value }),
    })
    .then(response => response.json())
    .then(response => {
      console.log(response);
    });

    message.current.value = null;
  }

  return (
    <>
      <div className='message-box'>
        <div className='elements'>
          <textarea placeholder='Type a message...' ref={message} />
          <input type='button' value='Send Message' onClick={SendMessage}/>
        </div>
      </div>
    </>
  );
}
export default InteractUtilities;