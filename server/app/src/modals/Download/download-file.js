import { useState, useEffect, useRef } from 'react';
import {
  HttpPost,
} from '../../utilities/requests';

// Styles
import './download-file.scss';

function DownloadFile(args)
{
  const [file, setFile] = useState(null);
  const close = useRef(null);

  useEffect(() => {
    if (args.show) {
      const path = args.drive + args.path.join('/');

      setFile({
        ...args.file,
        path: path
      });

      console.log({
        ...args.file,
        path: path
      });
    }

  }, [args.file]);

  function Download(event) {
    close.current.style.pointerEvents = 'none';
    event.target.classList.add('disabled');
    event.target.value = 'Downloading...';

    const filePath = file.path + '/' + file.name;

    HttpPost(`/api/download-file`, {'path': filePath})
      .then(response => response.json())
      .then(data => {
        console.log(data);

        if (data.downloaded) {
          event.target.style.backgroundColor = 'green';
          event.target.value = 'Downloaded';
        
        } else {
          event.target.style.backgroundColor = 'red';
          event.target.value = 'Failed Downloading';
        }

        setTimeout(() => {
          close.current.style.pointerEvents = 'auto';
          event.target.classList.remove('disabled');
          event.target.style.backgroundColor = '';
          event.target.value = 'Download';
        
        }, 3000);
      }
    );
  }

  function CloseModal() {
    args.close(false);
  }

  if (args.show && file) {
    return (
      <div className='download-file-component'>
        <div className='modal'>
          <div className='modal-content'>
            <header>
              <h4>{file.name}</h4>
              <span className='close' onClick={CloseModal} ref={close}>&times;</span>
            </header>
            <hr/>
  
            <div className='body'>
              <table>
                <thead>
                  <tr>
                    <th>File Name</th>
                    <th>Size</th>
                    <th>Path</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{file.name}</td>
                    <td>{file.size}</td>
                    <td>{file.path}</td>
                  </tr>
                </tbody>
              </table>
              
              <input type='button' className='download' value='Download' onClick={Download} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default DownloadFile;