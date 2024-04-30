function FileExplorer(args)
{
  return (
    <div className='file-explorer'>
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
              <td className='name' onClick={file.type == 'folder' ? args.ChangeFolder : undefined}>
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
  );
}
export default FileExplorer;