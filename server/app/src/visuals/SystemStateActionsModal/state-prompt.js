import { useEffect, useState, useRef } from 'react';
import {
  HttpPost,
}
from '../../utilities/requests';
import './state-prompt.scss';

function StatePrompt(args)
{
  const [status, setStatus] = useState({
    message: 'Waiting for action',
    hasEnded: false
  });

  const shutdownYes = useRef();
  const shutdownNo = useRef();

  const restartYes = useRef();
  const restartNo = useRef();

  const lockYes = useRef();
  const lockNo = useRef();

  useEffect(() => {
    setStatus({
      message: 'Waiting for action',
      hasEnded: false
    });

  }, [args.show]);

  function ShutdownComputer() {
    shutdownYes.current.disabled = true;
    shutdownNo.current.disabled = true;
    setStatus({
      message: 'Shutting down computer',
      hasEnded: false
    });

    HttpPost('/api/shutdown-computer')
      .then(response => response.json())
      .then(response => {
        if (response.connected == false) {
          throw new Error();
        }

        if (response.shutdown) {
          setStatus({
            message: 'Computer shutdown',
            hasEnded: true
          });
          setTimeout(() => args.switchOn(false), 2000);
        }
      })
      .catch(() => {
        shutdownYes.current.disabled = false;
        shutdownNo.current.disabled = false;

        setStatus({
          message: 'Failed to shutdown computer',
          hasEnded: true
        });

        setTimeout(() => args.DisconnectPanel(), 2000);
      }
    );
  } 

  function RestartComputer() {
    restartYes.current.disabled = true;
    restartNo.current.disabled = true;
    setStatus({
      message: 'Restarting computer',
      hasEnded: false
    });

    HttpPost('/api/restart-computer')
      .then(response => response.json())
      .then(response => {
        if (response.connected == false) {
          throw new Error();
        }

        if (response.restarted) {
          setStatus({
            message: 'Computer restarted',
            hasEnded: true
          });
          setTimeout(() => args.switchOn(false), 2000);
        }
      })
      .catch(() => {
        restartYes.current.disabled = false;
        restartNo.current.disabled = false;

        setStatus({
          message: 'Failed to restart computer',
          hasEnded: true
        });

        setTimeout(() => args.DisconnectPanel(), 2000);
      }
    );
  }

  function LockComputer() {
    lockYes.current.disabled = true;
    lockNo.current.disabled = true;
    setStatus({
      message: 'Locking computer',
      hasEnded: false
    });

    HttpPost('/api/lock-computer')
      .then(response => response.json())
      .then(response => {
        console.log(response);
        if (response.connected == false) {
          throw new Error();
        }
        
        if (response.locked) {
          setStatus({
            message: 'Computer locked',
            hasEnded: true
          });
          setTimeout(() => args.switchOn(false), 2000);
        }
      })
      .catch(() => {
        lockYes.current.disabled = false;
        lockNo.current.disabled = false;

        setStatus({
          message: 'Failed to lock computer',
          hasEnded: true
        });

        setTimeout(() => args.DisconnectPanel(), 2000);
      }
    );
  }

  if (args.show) {
    return (
      <div className='state-prompt-component'>
        <div className='modal'>
          <div className='modal-content'>
            <header>
              <h4>System Actions</h4>
            </header>
            <hr/>
  
            <div className='body'>
              {
                (args.systemAction == 'shutdown')
                ? (
                  <>
                    <center>Are you sure you want to shutdown the computer?</center>
                    <div className='options'>
                      <button className='yes' ref={shutdownYes} onClick={ShutdownComputer}>
                        Yes
                      </button>
                      <button className='no' ref={shutdownNo} onClick={() => args.switchOn(false)}>
                        No
                      </button>
                    </div>
                  </>
                )
                : (args.systemAction == 'restart')
                ? (
                  <>
                    <center>Are you sure you want to restart the computer?</center>
                    <div className='options'>
                      <button className='yes' ref={restartYes} onClick={RestartComputer}>
                        Yes
                      </button>
                      <button className='no' ref={restartNo} onClick={() => args.switchOn(false)}>
                        No
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <center>Are you sure you want to lock the computer?</center>
                    <div className='options'>
                      <button className='yes' ref={lockYes} onClick={LockComputer}>
                        Yes
                      </button>
                      <button className='no' ref={lockNo} onClick={() => args.switchOn(false)}>
                        No
                      </button>
                    </div>
                  </>
                )
              }
              <hr/>
              <div className='result'>
                Remote Computer: <span className='online'>Online</span>
                <br/>
                Status: <span className='status'>
                  {
                    status.hasEnded
                      ? <span className='response'>{status.message}</span>
                      : status.message
                  }
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default StatePrompt;