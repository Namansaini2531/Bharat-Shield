package com.bharatshield.desktop;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.file.Files;

public class LocalStaticServer {

    private HttpServer server;
    private int port;
    private final File webRoot;

    public LocalStaticServer(File webRoot) {
        this.webRoot = webRoot;
    }

    public int start() throws IOException {
        // Bind to localhost on an ephemeral free port (0)
        server = HttpServer.create(new InetSocketAddress("127.0.0.1", 0), 0);
        port = server.getAddress().getPort();

        server.createContext("/", new StaticFileHandler(webRoot));
        server.setExecutor(null); // default executor
        server.start();

        System.out.println("[LocalServer] Serving " + webRoot.getAbsolutePath() + " on http://127.0.0.1:" + port);
        return port;
    }

    public void stop() {
        if (server != null) {
            server.stop(0);
            System.out.println("[LocalServer] Stopped.");
        }
    }

    public int getPort() {
        return port;
    }

    private static class StaticFileHandler implements HttpHandler {
        private final File baseDir;

        public StaticFileHandler(File baseDir) {
            this.baseDir = baseDir;
        }

        @Override
        public void handle(HttpExchange exchange) throws IOException {
            String path = exchange.getRequestURI().getPath();
            if (path == null || path.equals("/") || path.isEmpty()) {
                path = "/index.html";
            }

            File targetFile = new File(baseDir, path.substring(1)).getCanonicalFile();

            // Prevent path traversal
            if (!targetFile.getPath().startsWith(baseDir.getCanonicalPath())) {
                send404(exchange);
                return;
            }

            // SPA fallback: If requesting a route without file extension, serve index.html
            if (!targetFile.exists() || targetFile.isDirectory()) {
                File fallback = new File(baseDir, "index.html");
                if (fallback.exists()) {
                    targetFile = fallback;
                } else {
                    send404(exchange);
                    return;
                }
            }

            String mime = getMimeType(targetFile.getName());
            exchange.getResponseHeaders().set("Content-Type", mime);
            exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");

            byte[] bytes = Files.readAllBytes(targetFile.toPath());
            exchange.sendResponseHeaders(200, bytes.length);
            try (OutputStream os = exchange.getResponseBody()) {
                os.write(bytes);
            }
        }

        private void send404(HttpExchange exchange) throws IOException {
            byte[] msg = "404 Not Found".getBytes();
            exchange.sendResponseHeaders(404, msg.length);
            try (OutputStream os = exchange.getResponseBody()) {
                os.write(msg);
            }
        }

        private String getMimeType(String filename) {
            String lower = filename.toLowerCase();
            if (lower.endsWith(".html")) return "text/html; charset=utf-8";
            if (lower.endsWith(".js") || lower.endsWith(".mjs")) return "application/javascript; charset=utf-8";
            if (lower.endsWith(".css")) return "text/css; charset=utf-8";
            if (lower.endsWith(".json")) return "application/json";
            if (lower.endsWith(".png")) return "image/png";
            if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
            if (lower.endsWith(".svg")) return "image/svg+xml";
            if (lower.endsWith(".ico")) return "image/x-icon";
            if (lower.endsWith(".woff2")) return "font/woff2";
            if (lower.endsWith(".woff")) return "font/woff";
            if (lower.endsWith(".ttf")) return "font/ttf";
            return "application/octet-stream";
        }
    }
}
