import ScreenshotAndWebcamComponent from "./screenshot-webcam";
import InteractUtilities from "./interact-utils";

function Panel(args)
{
  if (args.client) {
    return (
      <div className='panel-container'>
        <ScreenshotAndWebcamComponent />

        <div className='lower-functions'>
          <InteractUtilities apiHost={args.apiHost} apiPort={args.apiPort} />
        </div>
      </div>
    );
  }

  return (
    <div className='panel-container'>
      Select a Client to Control
    </div>
  );
}
export default Panel;