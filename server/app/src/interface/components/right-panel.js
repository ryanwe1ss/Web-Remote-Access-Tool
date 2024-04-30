import { useState, useEffect, useRef } from 'react';
import {
  HttpPost
} from '../../utilities/requests';

// Components
import FileExplorer from '../components/file-explorer';

// Modals
import CreateFile from '../../modals/FileManipulatePrompts/create-file';

function RightPanel(args)
{
  const [showCreateFile, setShowCreateFile] = useState(false);

  const [lastPath, setLastPath] = useState('/');
  const [files, setFiles] = useState([]);

  const deleteFile = useRef(null);
  const deleteFolder = useRef(null);

  useEffect(() => {
    deleteFile.current.classList.add('disabled');
    deleteFolder.current.classList.add('disabled');

    FetchFiles();

  }, [args.client]);

  function FetchFiles() {
    const path = document.querySelector('.file-path').value || '/';

    HttpPost(`/api/files`, {path})
    .then(response => response.json())
    .then(data => {
      if (data.files == 'notexist') {
        return;
      }

      const result = data.files.split('\n');
      const files = [];

      result.forEach(file => {
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
      setLastPath(path);
    });
  }

  function ChangeFolder(event) {
    const path = event.target.innerText;

    if (path) {
      const filePath = document.querySelector('.file-path');
      filePath.value = (filePath.value + '\\' + path.trim());

      FetchFiles();
    }
  }

  function BackFolder() {
    const path = lastPath.split('\\');
    path.pop();

    const filePath = document.querySelector('.file-path');
    filePath.value = path.join('\\');

    FetchFiles();
  }

  function CreateFileOnClient() {
    setShowCreateFile(true);
  }

  return (
    <div className='right-panel'>
      <div className='elements'>
        <div className='filter'>
          <button className='back-btn' onClick={BackFolder}>
            <i className='bi bi-arrow-left'></i>&nbsp;
          </button>
          &nbsp;

          <input type='text' placeholder='File Path...' className='file-path' />
          <input type='button' value='Browse' className='search-btn' onClick={FetchFiles} />
        </div>

        <hr/>
        <div className='functions'>
          <button className='add-file' onClick={CreateFileOnClient}>
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
        </div>
        <hr/>

        <FileExplorer files={files} ChangeFolder={ChangeFolder} />
      </div>

      <CreateFile show={showCreateFile} close={setShowCreateFile} />
    </div>
  );
}
export default RightPanel;