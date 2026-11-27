package com.bharatshield.desktop;

import java.io.BufferedReader;
import java.io.File;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

public class SidecarManager {

    private Process sidecarProcess;
    private final int port = 8000;

    public void startSidecar() {
        // If Python server is already running, reuse it
        if (isSidecarHealthy()) {
            System.out.println("[Sidecar] FastAPI server is already running on port " + port);
            return;
        }

        new Thread(() -> {
            try {
                // Determine paths
                File baseDir = new File(".").getCanonicalFile();
                File pythonExe = new File(baseDir, "backend/venv/Scripts/python.exe");
                File runnerScript = new File(baseDir, "backend/desktop_runner.py");

                // Fallback check
                if (!pythonExe.exists()) {
                    pythonExe = new File("python");
                }

                System.out.println("[Sidecar] Starting FastAPI sidecar using: " + pythonExe.getAbsolutePath());

                ProcessBuilder pb = new ProcessBuilder(
                        pythonExe.getAbsolutePath(),
                        runnerScript.getAbsolutePath(),
                        String.valueOf(port)
                );
                pb.directory(baseDir);
                pb.redirectErrorStream(true);

                sidecarProcess = pb.start();

                // Pipe sidecar logs to Java standard output
                try (BufferedReader reader = new BufferedReader(new InputStreamReader(sidecarProcess.getInputStream()))) {
                    String line;
                    while ((line = reader.readLine()) != null) {
                        System.out.println("[Sidecar Backend] " + line);
                    }
                }

            } catch (Exception e) {
                System.err.println("[Sidecar] Failed to start sidecar: " + e.getMessage());
            }
        }, "sidecar-thread").start();

        // Register JVM shutdown hook to kill process tree on unexpected exit
        Runtime.getRuntime().addShutdownHook(new Thread(this::stopSidecar));
    }

    public boolean isSidecarHealthy() {
        try {
            URL url = new URL("http://127.0.0.1:" + port + "/health");
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setConnectTimeout(1000);
            conn.setReadTimeout(1000);
            return conn.getResponseCode() == 200;
        } catch (Exception e) {
            return false;
        }
    }

    public void stopSidecar() {
        if (sidecarProcess != null && sidecarProcess.isAlive()) {
            System.out.println("[Sidecar] Forcibly stopping Python backend process tree...");
            try {
                // Kill descendants first, then root process
                sidecarProcess.descendants().forEach(ProcessHandle::destroyForcibly);
                sidecarProcess.destroyForcibly();
            } catch (Exception e) {
                System.err.println("[Sidecar] Error stopping process: " + e.getMessage());
            }
        }
    }
}
