use std::process::Command;
use std::net::TcpStream;
use std::io::Write;

pub fn restart_computer(mut stream: &TcpStream) {
    Command::new("shutdown")
      .arg("/r")
      .arg("/t")
      .arg("0")
      .spawn()
      .unwrap();

    stream.write_all("restart".as_bytes()).unwrap();
}