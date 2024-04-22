use std::net::TcpStream;
use std::fs;

use crate::utilities;

pub fn get_files(stream: &TcpStream) {
  utilities::send_bytes(&stream, "files".as_bytes());
  let file_path = utilities::read_bytes_as_string(&stream, 1024);
  let mut files = String::new();
  
  let paths = match fs::read_dir(file_path) {
    Ok(paths) => paths,
    Err(_) => {
      utilities::send_bytes(&stream, "error".as_bytes());
      return;
    }
  };

  utilities::send_bytes(&stream, "ok".as_bytes());
  for path in paths {
    let entry = path.unwrap();
    let metadata = entry.metadata().unwrap();
    let filename = entry.file_name();
    let file_type_indicator = if metadata.is_file() { "file" } else { "folder" };
    let file_size = metadata.len();
    files.push_str(&format!("{}|{}|{}\n", filename.to_string_lossy(), file_type_indicator, file_size));
  }

  utilities::wait_for_packet(&stream);

  utilities::send_bytes(&stream, files.len().to_string().as_bytes());
  utilities::wait_for_packet(&stream);

  utilities::send_bytes(&stream, files.as_bytes());
}