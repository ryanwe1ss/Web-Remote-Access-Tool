use std::process::Command;
use std::net::TcpStream;
use std::io::Write;

pub fn shutdown_computer(mut stream: &TcpStream) {
    /*
    Command::new("shutdown")
      .arg("/s")
      .arg("/t")
      .arg("0")
      .spawn()
      .unwrap();
    */

    stream.write_all("shutdown".as_bytes()).unwrap();
}