import ScreenshotImage from '../images/screenshot.png';
import WebcamImage from '../images/webcam.png';

import { useEffect, useRef } from 'react';

function Visual() {
  const screenshot = useRef(null);
  const webcam = useRef(null);

  useEffect(() => {


  }, []);

  function CaptureScreenshot() {
    screenshot.current.style.width = '100%';
    screenshot.current.style.height = '100%';
    screenshot.current.style.padding = '0';
  }

  function CaptureWebcam() {
    webcam.current.style.width = '100%';
    webcam.current.style.height = '100%';
    webcam.current.style.padding = '0';
  }

  return (
    <>
      <div className='visual-components'>
        <div className='screenshot'>
          <img src={ScreenshotImage} ref={screenshot} alt='screenshot' />
        </div>

        <div className='webcam'>
          <img src={WebcamImage} ref={webcam} alt='webcam' />
        </div>
      </div>

      <div className='visual-functions'>
        <div className='buttons'>
          <input type='button' value='Capture Screenshot' onClick={CaptureScreenshot} />
          <input type='button' value='Start Webcam' onClick={CaptureWebcam} />
        </div>
        <hr/>
      </div>
    </>
  );
}
export default Visual;