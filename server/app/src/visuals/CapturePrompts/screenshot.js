import './styles.scss';

function CaptureView(args)
{
  const text = (args.currentPreview == 'screenshot') ? 'Viewing Screenshot' : 'Viewing Webcam Capture';
  const duration = (args.currentPreview == 'screenshot')
    ? args.screenshotDuration
    : args.webcamDuration;

  if (args.show) {
    return (
      <div className='capture-component'>
        <div className='modal'>
          <div className='modal-content'>
            <header>
              <h4>{text} - Captured in {(duration / 1000).toFixed(2)}s ({duration}ms)</h4>
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