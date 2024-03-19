import ScreenshotImage from '../images/screenshot.png';
import WebcamImage from '../images/webcam.png';
import LoadingBar from '../visuals/LoadingBar/loading-bar';

import { useState, useRef } from 'react';

function Visual(args)
{
  const [screenshotLoading, setScreenshotLoading] = useState(false);
  const screenshot = useRef(null);
  const webcam = useRef(null);

  function CaptureScreenshot(event) {
    screenshot.current.style.width = '0';
    event.target.disabled = true;
    setScreenshotLoading(true);

    fetch(`${args.route}/api/screenshot`, {
      method: 'POST'
    })
    .then(response => response.json())
    .then(data => {
      screenshot.current.src = `data:image/png;base64,${data.image}`;
      screenshot.current.style.width = '100%';
      screenshot.current.style.height = '100%';
      screenshot.current.style.padding = '0';

      event.target.disabled = false;
      setScreenshotLoading(false);
    });
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
          {screenshotLoading ? <LoadingBar size={'medium'} height={22} /> : null}
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