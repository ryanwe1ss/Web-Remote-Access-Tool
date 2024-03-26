import './styles.scss';

function CaptureView(args)
{
  if (args.show) {
    return (
      <div className='capture-component'>
        <div className='modal'>
          <div className='modal-content'>
            <header>
              <h4>Viewing Screenshot - Captured in {(args.duration / 1000).toFixed(2)}s ({args.duration}ms)</h4>
              <span onClick={() => args.setCaptureView(false)} className='close'>&times;</span>
            </header>
            <hr/>
  
            <div className='body'>
              <img src={args.image.current.src} alt='screenshot' />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default CaptureView;