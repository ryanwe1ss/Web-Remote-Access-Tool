import { useState, useRef } from 'react';

import ScreenshotImage from '../images/screenshot.png';
import WebcamImage from '../images/webcam.png';

import LoadingBar from '../visuals/LoadingBar/loading-bar';
import CaptureView from '../visuals/CapturePrompts/screenshot';

import {
  HttpPost,
}
from '../utilities/requests';

function Visual(args)
{
  const [screenshotLoading, setScreenshotLoading] = useState(false);
  const [webcamLoading, setWebcamLoading] = useState(false);

  const screenshotBtn = useRef(null);
  const screenshot = useRef(null);
  const webcamBtn = useRef(null);
  const webcam = useRef(null);

  const [captureView, setCaptureView] = useState(false);
  const [currentPreview, setCurrentPreview] = useState(null);

  const [webcamCaptureDuration, setWebcamCaptureDuration] = useState({});
  const [screenshotCaptureDuration, setScreenshotCaptureDuration] = useState({});

  async function CaptureScreenshot(event) {
    screenshot.current.style.width = '0';
    setScreenshotLoading(true);

    const start = Date.now();
    const response = await HttpPost('/api/screenshot');
    const data = await response.json();

    if (data.connected == false) {
      setTimeout(() => args.DisconnectPanel(), 2000);
      return;
    }

    screenshot.current.src = `data:image/png;base64,${data.image}`;
    screenshot.current.classList.remove('default');
    screenshot.current.style.width = 'initial';

    setScreenshotLoading(false);
    setScreenshotCaptureDuration(Date.now() - start);
  }

  async function CaptureWebcam() {
    webcam.current.style.width = '0';
    setWebcamLoading(true);

    const start = Date.now();
    const response = await HttpPost('/api/webcam');
    const data = await response.json();

    if (data.connected == false) {
      setTimeout(() => args.DisconnectPanel(), 2000);
      return;
    }

    webcam.current.src = (data.captured) ? `data:image/png;base64,${data.image}` : WebcamImage;
    if (data.captured) {
      webcam.current.classList.remove('default');
    }

    webcam.current.style.width = 'initial';
    setWebcamLoading(false);
    setWebcamCaptureDuration(Date.now() - start);
  }

  function RenderCapture(type) {
    if (type == 'screenshot') {
      if (!screenshot.current.classList.contains('default')) {
        setCurrentPreview('screenshot');
        setCaptureView(true);
      }
    
    } else {
      if (!webcam.current.classList.contains('default')) {
        setCurrentPreview('webcam');
        setCaptureView(true);
      }
    }
  }

  return (
    <>
      <div className='visual-components'>
        <div className='screenshot' onClick={() => RenderCapture('screenshot')}>
          {screenshotLoading && <LoadingBar size={'small'} height={110} />}
          <img src={ScreenshotImage} className='default' ref={screenshot} alt='screenshot' />
        </div>

        <div className='webcam' onClick={() => RenderCapture('webcam')}>
          {webcamLoading && <LoadingBar size={'small'} height={110} />}
          <img src={WebcamImage} className='default' ref={webcam} alt='webcam' />
        </div>
      </div>

      <div className='visual-functions'>
        <div className='buttons'>
          <input type='button' ref={screenshotBtn} value='Capture Screenshot' onClick={CaptureScreenshot} />
          <input type='button' ref={webcamBtn} value='Start Webcam' onClick={CaptureWebcam} />
        </div>
        <hr/>
      </div>
      <CaptureView
        show={captureView}
        setCaptureView={setCaptureView}
        currentPreview={currentPreview}
        webcamDuration={webcamCaptureDuration}
        screenshotDuration={screenshotCaptureDuration}
        image={currentPreview == 'screenshot' ? screenshot : webcam}
      />
    </>
  );
}
export default Visual;