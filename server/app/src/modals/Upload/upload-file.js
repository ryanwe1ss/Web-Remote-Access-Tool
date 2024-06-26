import { useState, useRef, useEffect } from 'react';
import {
  HttpPost
} from '../../utilities/requests';

// Styles
import './upload-file.scss';

function UploadFile(args)
{
  const fileSubmit = useRef(null);
  const fileInput = useRef(null);
  const dropZone = useRef(null);
  const close = useRef(null);

  const [fileName, setFileName] = useState('Drop File Here');
  const [uploaded, setUploaded] = useState(false);
  const [fileData, setFileData] = useState({});

  useEffect(() => {
    if (!args.show) {
      setFileName('Drop File Here');
    }

  }, [args.show]);

  useEffect(() => {
    if (uploaded) {
      args.reload(
        args.path.join('/'),
        args.drive,
      );
    }

  }, [uploaded]);

  const handleDragOver = (event) => {
    event.preventDefault();
    dropZone.current.classList.add('drag-over');
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    dropZone.current.classList.remove('drag-over');
  };

  const handleDrop = (event) => {
    event.preventDefault();
    dropZone.current.classList.remove('drag-over');
    fileSubmit.current.classList.remove('disabled');
  };

  const handleUpload = (event) => {
    event.preventDefault();
    fileSubmit.current.classList.remove('disabled');

    const file = fileInput.current.files[0];
    setFileName(file.name);
    setFileData(file);
  };

  async function UploadFile(event) {
    event.target.value = 'Uploading...';
    event.target.classList.add('disabled');
    close.current.style.pointerEvents = 'none';

    const path = args.drive + args.path.join('/');
    const formData = new FormData();

    formData.append('file', fileData);
    formData.append('path', path);
   
    const response = await HttpPost('/api/upload-file', formData, false, false);
    const data = await response.json();

    if (data.message == 'Permission Denied') {
      event.target.style.backgroundColor = 'red';
      event.target.value = 'Permission Denied, folder is not writable';
    }
    else {
      setUploaded(true);
      event.target.style.backgroundColor = 'green';
      event.target.value = 'File has been uploaded successfully';
    }

    setTimeout(() => {
      event.target.value = 'Upload File to Client';
      event.target.style.backgroundColor = '';

      close.current.style.pointerEvents = 'auto';
      fileInput.current.value = null;
      setFileName('Drop File Here');
      setUploaded(false);

    }, 3000);
  }

  function CloseModal() {
    args.close(false);
  }

  if (args.show) {
    return (
      <div className='upload-file-component'>
        <div className='modal'>
          <div className='modal-content'>
            <header>
              <h4>Upload File</h4>
              <span className='close' onClick={CloseModal} ref={close}>&times;</span>
            </header>
            <hr/>
  
            <div className='body'>
              <div
                className='drop-file'
                onClick={() => fileInput.current.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                ref={dropZone}
              >
                <i className='bi bi-file-earmark-plus'></i>
                <p>{fileName}</p>
              </div>

              <input
                type='button'
                value='Upload File to Client'
                className='upload-btn disabled'
                onClick={UploadFile}
                ref={fileSubmit}
              />
              <input
                type='file'
                className='file-input'
                onChange={handleUpload}
                ref={fileInput}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default UploadFile;