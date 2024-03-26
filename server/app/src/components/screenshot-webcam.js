import { useState, useRef } from 'react';

import ScreenshotImage from '../images/screenshot.png';
import WebcamImage from '../images/webcam.png';

import LoadingBar from '../visuals/LoadingBar/loading-bar';
import CaptureView from '../visuals/CapturePrompts/screenshot';

import {
  HttpPost,
}
from '../utilities/requests';

function Visual()
{
  const [screenshotLoading, setScreenshotLoading] = useState(false);
  const screenshot = useRef(null);
  const webcam = useRef(null);

  const [captureView, setCaptureView] = useState(false);
  const [captureDuration, setCaptureDuration] = useState({});

  async function CaptureScreenshot(event) {
    screenshot.current.style.width = '0';
    event.target.disabled = true;
    setScreenshotLoading(true);

    const start = Date.now();
    const response = await HttpPost('/api/screenshot');
    const data = await response.json();

    screenshot.current.src = `data:image/png;base64,${data.image}`;
    screenshot.current.classList.remove('default');
    screenshot.current.style.width = 'initial';

    event.target.disabled = false;
    setScreenshotLoading(false);
    setCaptureDuration(Date.now() - start);
  }

  function CaptureWebcam() {
    // ...
  }

  function RenderCapture() {
    if (!screenshot.current.classList.contains('default')) {
      setCaptureView(true);
    }
  }

  return (
    <>
      <div className='visual-components'>
        <div className='screenshot' onClick={RenderCapture}>
          {screenshotLoading && <LoadingBar size={'small'} height={110} />}
          <img src={ScreenshotImage} className='default' ref={screenshot} alt='screenshot' />
        </div>

        <div className='webcam'>
          <img src={WebcamImage} className='default' ref={webcam} alt='webcam' />
        </div>
      </div>

      <div className='visual-functions'>
        <div className='buttons'>
          <input type='button' value='Capture Screenshot' onClick={CaptureScreenshot} />
          <input type='button' value='Start Webcam' onClick={CaptureWebcam} />
        </div>
        <hr/>
      </div>
      <CaptureView
        show={captureView}
        image={screenshot}
        duration={captureDuration}
        setCaptureView={setCaptureView}
      />
    </>
  );
}
export default Visual;