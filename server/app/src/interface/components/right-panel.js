import { useState, useEffect, useRef } from 'react';
import {
  HttpPost,
} from '../../utilities/requests';

// Components
import FileExplorer from '../components/file-explorer';

// Modals
import UploadFile from '../../modals/FileManipulatePrompts/upload-file';

function RightPanel(args)
{
  const [showUploadFile, setShowUploadFile] = useState(null);
  const [drivesRetrieved, setDrivesRetrieved] = useState(false);

  const [path, setPath] = useState([]);
  const [drive, setDrive] = useState('/');

  const [drives, setDrives] = useState([]);
  const [files, setFiles] = useState([]);

  const filePath = useRef(null);
  const deleteFile = useRef(null);
  const deleteFolder = useRef(null);

  useEffect(() => {
    if (args.client?.connected) {
      deleteFile.current.classList.add('disabled');
      deleteFolder.current.classList.add('disabled');
      FetchFiles();
    }

  }, [args.client]);

  useEffect(() => {
    if (drive != '/') {
      FetchFiles();
    }

  }, [drive]);

  function FetchDrives() {
    HttpPost('/api/drives')
      .then(response => response.json())
      .then(data => {
        const drives = data.drives.split('|').filter(Boolean);
        
        setDrive(`${drives[0]}:/`);
        setDrives(drives);
      });
  }

  function FetchFiles(directory='/') {
    const fullPath = (drive + directory).replace('//', '/');

    HttpPost(`/api/files`, {'path': fullPath})
    .then(response => response.json())
    .then(data => {
      if (data.files == 'notexist') {
        return;
      }

      if (!drivesRetrieved) {
        FetchDrives();
        setDrivesRetrieved(true);
      }

      const files = [];
      data.files.split('\n').forEach(file => {
        if (file) {
          const entry = file.split('|');

          files.push({
            'name': entry[0],
            'type': entry[1],
            'size': entry[2],
          });
        }
      });

      setFiles(files);
    });
  }

  function ChangeFolder(event) {
    const input = event.target.innerText.trim();
    let fullPath = path.join('/') + '/' + input;

    if (fullPath.startsWith('/')) {
      fullPath = fullPath.slice(1);
    
    } filePath.current.value = fullPath;

    setPath([...path, input]);
    FetchFiles(fullPath);
  }

  function BackFolder() {
    path.pop();
    filePath.current.value = path.join('/');

    FetchFiles(path.join('/'));
  }
  
  function SwitchDrive(event) {
    filePath.current.value = null;

    setDrive(`${event.target.value}:/`);
    setPath([]);
  }

  function UploadFileOnClient() {
    setShowUploadFile(true);
  }

  return (
    <div className='right-panel'>
      <div className='elements'>
        <div className='filter'>
          <button className='back-btn' onClick={BackFolder}>
            <i className='bi bi-arrow-left'></i>&nbsp;
          </button>
          &nbsp;

          <input type='text' placeholder='File Path...' ref={filePath} className='file-path' />
          <input type='button' value='Browse' className='search-btn' onClick={FetchFiles} />
        </div>

        <hr/>
        <div className='functions'>
          <button className='add-file' onClick={UploadFileOnClient}>
            <i className='bi bi-file-earmark-plus'></i>&nbsp;
          </button>

          <button className='add-folder'>
            <i className='bi bi-folder-plus'></i>&nbsp;
          </button>

          <button className='delete-file' ref={deleteFile}>
            <i className='bi bi-file-earmark-x'></i>&nbsp;
          </button>

          <button className='delete-folder' ref={deleteFolder}>
            <i className='bi bi-folder-x'></i>&nbsp;
          </button>

          <select className='drive-select' onChange={SwitchDrive}>
            <option value={'C'}>C:/</option>
            <option value={'D'}>D:/</option>

            {/* {drives.map((drive, index) => {
              return <option key={index} value={drive}>{`${drive}:/`}</option>
            })} */}
          </select>
        </div>
        <hr/>

        <FileExplorer files={files} ChangeFolder={ChangeFolder} />
      </div>

      <UploadFile show={showUploadFile} close={setShowUploadFile} />
    </div>
  );
}
export default RightPanel;