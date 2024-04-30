import './create-file.scss';

function CreateFile(args)
{
  if (args.show) {
    return (
      <div className='create-file-component'>
        <div className='modal'>
          <div className='modal-content'>
            <header>
              <h4>Create / Upload - File</h4>
              <span className='close' onClick={() => args.close(false)}>&times;</span>
            </header>
            <hr/>
  
            <div className='body'>
              Body
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default CreateFile;