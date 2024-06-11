import React, { useState } from 'react';

// Modals
import DownloadFile from '../../modals/Download/download-file';

function FileExplorer(args)
{
  const [showDownloadFile, setShowDownloadFile] = useState(false);
  const [file, setFile] = useState({});

  function ShowDownloadFileModal(file) {
    setShowDownloadFile(true);
    setFile(file);
  }

  return (
    <div className='file-explorer'>
      <div className='files'>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Size</th>
            </tr>
          </thead>

          <tbody>
            {args.files.map((file, index) => (
              <tr key={index}>
                <td className='name' onClick={file.type == 'folder' ? args.ChangeFolder : () => ShowDownloadFileModal(file)}>
                  <i className={file.type == 'folder' ? 'bi bi-folder' : 'bi bi-file-earmark'}></i>
                  &nbsp;{file.name}
                </td>
                <td className='size'>
                  {file.size == 0 ? '---' : file.size < 1024 ? `${file.size} B`
                    : file.size < 1048576 ? `${(file.size / 1024).toFixed(2)} KB`
                    : file.size < 1073741824 ? `${(file.size / 1048576).toFixed(2)} MB`
                    : `${(file.size / 1073741824).toFixed(2)} GB`
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <DownloadFile file={file} path={args.path} drive={args.drive} show={showDownloadFile} close={setShowDownloadFile} />
    </div>
  );
}
export default FileExplorer;