import { useState, useEffect, useRef } from 'react';
import {
  HttpPost,
} from '../../utilities/requests';

// Styles
import './file-operations.scss';

function FileOperations(args)
{
  const [deleted, setDeleted] = useState(false);
  const [file, setFile] = useState(null);
  const close = useRef(null);

  useEffect(() => {
    if (args.show) {
      const path = args.drive + args.path.join('/');

      setFile({
        ...args.file,
        path: path
      });
    }

  }, [args.file]);

  useEffect(() => {
    if (deleted) {
      args.reload(
        args.path.join('/'),
        args.drive,
      );
    }

  }, [deleted]);

  async function Download(event) {
    close.current.style.pointerEvents = 'none';
    event.target.value = 'Downloading...';

    const filePath = file.path + '/' + file.name;
    const response = await HttpPost(`/api/download-file`, {'path': filePath});
    const data = await response.json();

    const link = document.createElement('a');
    link.href = 'data:application/octet-stream;base64,' + data.file;
    link.download = file.name;
    link.click();

    if (data.downloaded) {
      event.target.style.backgroundColor = 'green';
      event.target.value = 'Downloaded';
    }
    else {
      event.target.style.backgroundColor = 'red';
      event.target.value = 'Failed Downloading';
    }

    setTimeout(() => {
      close.current.style.pointerEvents = 'auto';
      event.target.style.backgroundColor = '';
      event.target.value = 'Download';

    }, 2000);
  }

  async function Delete(event) {
    close.current.style.pointerEvents = 'none';
    event.target.value = 'Deleting...';
    setDeleted(false);

    const filePath = file.path + '/' + file.name;
    const response = await HttpPost(`/api/delete-file`, {'path': filePath});
    const data = await response.json();

    if (data.deleted) {
      event.target.style.backgroundColor = 'green';
      event.target.value = 'Deleted';
    }
    else {
      event.target.style.backgroundColor = 'red';
      event.target.value = 'Failed Deleting';
    }

    setTimeout(() => {
      close.current.style.pointerEvents = 'auto';
      event.target.style.backgroundColor = '';
      event.target.value = 'Delete';

      if (data.deleted) {
        setDeleted(true);
        CloseModal();
      }

    }, 2000);
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
                    <td>
                      {file.size == 0 ? '---' : file.size < 1024 ? `${file.size} B`
                        : file.size < 1048576 ? `${(file.size / 1024).toFixed(2)} KB`
                        : file.size < 1073741824 ? `${(file.size / 1048576).toFixed(2)} MB`
                        : `${(file.size / 1073741824).toFixed(2)} GB`
                      }
                    </td>
                    <td>{file.path}</td>
                  </tr>
                </tbody>
              </table>
              
              <div className='actions'>
                <input type='button' className='download' value='Download' onClick={Download} />
                <input type='button' className='delete' value='Delete' onClick={Delete} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default FileOperations;