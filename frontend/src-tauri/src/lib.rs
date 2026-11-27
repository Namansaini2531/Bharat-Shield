use tauri::Manager;
#[cfg(not(debug_assertions))]
use tauri_plugin_shell::ShellExt;

#[tauri::command]
fn get_desktop_version() -> String {
    "Bharat-Shield Sentinel Desktop v1.0.0".to_string()
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_log::Builder::default().build())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![get_desktop_version])
        .setup(|app| {
            #[cfg(debug_assertions)]
            {
                // In Development mode, we use the live uvicorn server on localhost:8000
                println!("[Desktop Supervisor] Dev mode active: connecting to live FastAPI server on http://127.0.0.1:8000");
            }

            #[cfg(not(debug_assertions))]
            {
                // In Production / Release mode, spawn the bundled Python sidecar binary
                println!("[Desktop Supervisor] Release mode: spawning Python sidecar...");
                let shell = app.shell();
                match shell.sidecar("bharat-shield-server") {
                    Ok(sidecar_cmd) => {
                        let sidecar_cmd = sidecar_cmd.args(["8000"]);
                        match sidecar_cmd.spawn() {
                            Ok((mut rx, _child)) => {
                                println!("[Desktop Supervisor] Sidecar spawned successfully.");
                                tauri::async_runtime::spawn(async move {
                                    use tauri_plugin_shell::process::CommandEvent;
                                    while let Some(event) = rx.recv().await {
                                        if let CommandEvent::Stdout(line) = event {
                                            println!("[Sidecar stdout]: {}", String::from_utf8_lossy(&line));
                                        } else if let CommandEvent::Stderr(line) = event {
                                            eprintln!("[Sidecar stderr]: {}", String::from_utf8_lossy(&line));
                                        }
                                    }
                                });
                            }
                            Err(e) => {
                                eprintln!("[Desktop Supervisor] Failed to spawn sidecar: {}", e);
                            }
                        }
                    }
                    Err(e) => {
                        eprintln!("[Desktop Supervisor] Sidecar configuration error: {}", e);
                    }
                }
            }

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running Bharat-Shield desktop application");
}
