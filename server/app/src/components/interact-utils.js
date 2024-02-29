import { useRef } from 'react';

function InteractUtilities(args)
{
  const messageResponseBody = useRef(null);
  const messageResponse = useRef(null);
  const message = useRef(null);

  async function SendMessage() {
    if (!message.current.value) return;

    const startTime = new Date().getTime();
    const request = await fetch(`${args.route}/api/send-message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: message.current.value }),
    });

    const response = await request.json();
    const timeInMs = new Date().getTime() - startTime;

    messageResponse.current.innerHTML = (response.sent)
      ? `Message sent in ${(timeInMs / 1000).toFixed(2)}s (${timeInMs}ms)`
      : 'Failed to send message. Please try again.';

    messageResponseBody.current.style.display = 'block';
    message.current.value = null;
  }

  function AppendConnection() {
    fetch(`${args.route}/api/append-connection`, {
      method: 'POST'
    })
    .then(response => response.json())
    .then(response => {
      if (response.connected) {
        args.setTriggerReload(Math.floor(Math.random() * 1000000));
      }
    });
  }

  return (
    <>
      <div className='message-box'>
        <div className='elements'>
          <button onClick={AppendConnection}>
            <i className='bi bi-arrow-left-circle'></i>&nbsp;
            Append Connection
          </button>

          <hr/>
          <textarea placeholder='Type a message...' ref={message} maxLength={1023} />
          <div className='controls'>
            <button onClick={SendMessage}>
              <i className='bi bi-envelope-arrow-down'></i>&nbsp;
              Send Message
            </button>

            <div className='message-sent' ref={messageResponseBody}>
              <i className='bi bi-check-circle success'></i>&nbsp;
              <span ref={messageResponse}></span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default InteractUtilities;