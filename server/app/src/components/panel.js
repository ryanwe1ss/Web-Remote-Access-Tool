import ScreenshotAndWebcamComponent from "./screenshot-webcam";
import InteractUtilities from "./interact-utils";

function Panel(args)
{
  if (args.client) {
    return (
      <div className='panel-container'>
        <ScreenshotAndWebcamComponent />

        <div className='lower-functions'>
          <InteractUtilities
            route={args.route}
            client={args.client}
            setTriggerReload={args.setTriggerReload}
          />
        </div>
      </div>
    );
  }

  return (
    <div className='panel-container'>
      <div className='no-client'>
        <i className='bi bi-wifi-off'></i>&nbsp;
        No Client Connected
      </div>
    </div>
  );
}
export default Panel;