use std::net::TcpStream;
use std::io::{Write, Read};

use crate::utilities;

pub fn upload_file(mut stream: &TcpStream) {
    stream.write_all("upload-file".as_bytes()).unwrap();

    /*
    let target_folder = utilities::read_bytes_as_string(&stream, 1024);

    stream.write_all("ok".as_bytes()).unwrap();

    let file_size = utilities::read_bytes_as_string(&stream, 1024).parse::<usize>().unwrap();
    stream.write_all("ok".as_bytes()).unwrap();

    let file_name = utilities::read_bytes_as_string(&stream, 1024);
    stream.write_all("ok".as_bytes()).unwrap();

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
    */
}