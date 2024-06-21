import { useState, useEffect, useRef } from 'react';
import {
  HttpPost,
} from '../../utilities/requests';

// Components
import FileExplorer from '../components/file-explorer';

// Modals
import UploadFile from '../../modals/Upload/upload-file';

function RightPanel(args)
{
  const [showUploadFile, setShowUploadFile] = useState(null);
  const [drivesRetrieved, setDrivesRetrieved] = useState(false);
  
  const [path, setPath] = useState([]);
  const [drive, setDrive] = useState('/');

  const [drives, setDrives] = useState([]);
  const [files, setFiles] = useState([]);

  const [fileCount, setFileCount] = useState(0);
  const [folderCount, setFolderCount] = useState(0);

  const filePath = useRef(null);

  useEffect(() => {
    if (args.client.connected) {
      FetchFiles();
    }

  }, [args.client]);

  function FetchDrives() {
    HttpPost('/api/drives')
      .then(response => response.json())
      .then(data => {
        if (!data.drives) return FetchDrives();
        const drives = data.drives.split('|').filter(Boolean);
        
        setDrive(`${drives[0]}:/`);
        setDrives(drives);
      }
    );
  }

  function FetchFiles(directory='/', optionalDrive=null) {
    const fullPath = ((optionalDrive != null ? optionalDrive : drive) + directory).replace('//', '/');

    HttpPost(`/api/files`, {'path': fullPath})
    .then(response => response.json())
    .then(data => {
      if (data.files == 'notexist') {
        return;
      }

      if (!drivesRetrieved) {
        setDrivesRetrieved(true);
        FetchDrives();
      }

      const newFiles = [];
      data.files.split('\n').forEach(file => {
        if (file) {
          const entry = file.split('|');
          newFiles.push({
            'name': entry[0],
            'type': entry[1],
            'size': entry[2],
          });
        }
      });

      const newFilesArray = newFiles.map(f => f.name).toString();
      const oldFilesArray = files.map(f => f.name).toString();

      if (newFilesArray != oldFilesArray) {
        setFolderCount(newFiles.filter(file => file.type == 'folder').length);
        setFileCount(newFiles.filter(file => file.type == 'file').length);
        setFiles(newFiles);
      }
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

  function BrowseFolder() {
    if (filePath.current.value.length > 0) {
      setPath(filePath.current.value.split('/'));

    } else if (filePath.current.value.length == 0) {
      return;

    } FetchFiles(filePath.current.value);
  }

  function BackFolder() {
    path.pop();
    filePath.current.value = path.join('/');

    FetchFiles(path.join('/'));
  }
  
  function SwitchDrive(event) {
    const newDrive = `${event.target.value}:/`;
    filePath.current.value = null;

    FetchFiles('/', newDrive);
    setDrive(newDrive);
    setPath([]);
  }

  function ShowUploadFileModal() {
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
          <input type='button' value='Browse' className='search-btn' onClick={BrowseFolder} />
        </div>

        <hr/>
        <div className='functions'>
          <button className='add-file' onClick={ShowUploadFileModal}>
            <i className='bi bi-file-earmark-plus'></i>&nbsp;
          </button>

          <button className='add-folder'>
            <i className='bi bi-folder-plus'></i>&nbsp;
          </button>

          <button className='refresh' onClick={() => FetchFiles(path.join('/'), drive)}>
            <i className='bi bi-arrow-clockwise'></i>&nbsp;
          </button>

          <select className='drive-select' onChange={SwitchDrive}>
            {drives.map((drive, index) => {
              return <option key={index} value={drive}>{`${drive}:/`}</option>
            })}
          </select>

          <div className='folder-properties'>
            {fileCount} Files
            <br/>
            {folderCount} Folders
          </div>
        </div>
        <hr/>

        <FileExplorer path={path} drive={drive} reload={FetchFiles} files={files} ChangeFolder={ChangeFolder} />
      </div>

      <UploadFile show={showUploadFile} path={path} drive={drive} reload={FetchFiles} close={setShowUploadFile} />
    </div>
  );
}
export default RightPanel;