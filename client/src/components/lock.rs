use std::process::Command;
use std::net::TcpStream;
use std::io::Write;

pub fn lock_computer(mut stream: &TcpStream) {
    Command::new("rundll32")
        .arg("user32.dll,LockWorkStation")
        .spawn()
        .unwrap();

    stream.write_all("lock".as_bytes()).unwrap();
}