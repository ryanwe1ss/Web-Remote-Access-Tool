use std::io::Read;
use std::net::TcpStream;

pub fn read_bytes_as_string(mut stream: &TcpStream, size: usize) -> String {
  let mut buffer = vec![0; size];

  match stream.read(&mut buffer) {
      Ok(bytes_read) => {
          String::from_utf8_lossy(&buffer[0..bytes_read]).to_string()
      }
      Err(_) => String::new(),
  }
}