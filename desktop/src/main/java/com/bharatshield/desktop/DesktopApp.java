package com.bharatshield.desktop;

import javafx.application.Application;
import javafx.application.Platform;
import javafx.concurrent.Worker;
import javafx.scene.Scene;
import javafx.scene.image.Image;
import javafx.scene.layout.BorderPane;
import javafx.scene.web.WebEngine;
import javafx.scene.web.WebView;
import javafx.stage.Stage;
import netscape.javascript.JSObject;

import java.io.File;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;

public class DesktopApp extends Application {

    private static final String APP_TITLE = "Bharat-Shield Sentinel";
    private static final int DEFAULT_WIDTH = 1400;
    private static final int DEFAULT_HEIGHT = 900;
    private static final String DEV_URL = "http://localhost:5173";

    private WebView webView;
    private WebEngine webEngine;
    private SidecarManager sidecarManager;

    @Override
    public void start(Stage primaryStage) {
        // 1. Initialize Sidecar Manager and start Python backend
        sidecarManager = new SidecarManager();
        sidecarManager.startSidecar();

        // 2. Setup WebView and WebEngine
        webView = new WebView();
        webEngine = webView.getEngine();
        webEngine.setJavaScriptEnabled(true);

        // Customize User Agent so React app knows it is in the desktop client
        String defaultUA = webEngine.getUserAgent();
        webEngine.setUserAgent(defaultUA + " BharatShieldDesktop/1.0.0 (JavaFX)");

        // 3. Setup JS to Java Native Bridge
        NativeBridge nativeBridge = new NativeBridge(primaryStage);
        webEngine.getLoadWorker().stateProperty().addListener((obs, oldState, newState) -> {
            if (newState == Worker.State.SUCCEEDED) {
                try {
                    JSObject window = (JSObject) webEngine.executeScript("window");
                    window.setMember("bharatShieldNative", nativeBridge);
                    window.setMember("__BHARAT_SHIELD_API_URL__", "http://127.0.0.1:8000");
                    window.setMember("__BHARAT_SHIELD_WS_URL__", "ws://127.0.0.1:8000");
                    System.out.println("[Desktop] Native bridge successfully injected into DOM.");
                } catch (Exception e) {
                    System.err.println("[Desktop] Failed to inject native bridge: " + e.getMessage());
                }
            }
        });

        // 4. Load Application URL (check if local dev server or packaged build)
        loadAppContent();

        // 5. Layout and Scene Setup
        BorderPane root = new BorderPane();
        root.setCenter(webView);

        Scene scene = new Scene(root, DEFAULT_WIDTH, DEFAULT_HEIGHT);
        primaryStage.setTitle(APP_TITLE);
        primaryStage.setScene(scene);
        primaryStage.setMinWidth(1024);
        primaryStage.setMinHeight(720);

        // Try loading application icon
        try (InputStream iconStream = getClass().getResourceAsStream("/icons/icon.png")) {
            if (iconStream != null) {
                primaryStage.getIcons().add(new Image(iconStream));
            }
        } catch (Exception ignored) {}

        // 6. Handle Window Closing - Cleanly kill child processes
        primaryStage.setOnCloseRequest(event -> {
            System.out.println("[Desktop] Application closing. Terminating backend sidecar...");
            if (sidecarManager != null) {
                sidecarManager.stopSidecar();
            }
            Platform.exit();
            System.exit(0);
        });

        primaryStage.show();
    }

    private void loadAppContent() {
        // First check if Vite dev server is running on localhost:5173
        new Thread(() -> {
            boolean isDevServerOnline = checkServer("http://localhost:5173");
            Platform.runLater(() -> {
                if (isDevServerOnline) {
                    System.out.println("[Desktop] Connecting to live Vite dev server: " + DEV_URL);
                    webEngine.load(DEV_URL);
                } else {
                    // Check if local dist/index.html exists
                    File distIndex = new File("../frontend/dist/index.html");
                    if (!distIndex.exists()) {
                        distIndex = new File("frontend/dist/index.html");
                    }

                    if (distIndex.exists()) {
                        System.out.println("[Desktop] Loading local production bundle: " + distIndex.toURI());
                        webEngine.load(distIndex.toURI().toString());
                    } else {
                        System.out.println("[Desktop] Vite dev server offline and dist not found. Pointing to dev URL...");
                        webEngine.load(DEV_URL);
                    }
                }
            });
        }).start();
    }

    private boolean checkServer(String urlString) {
        try {
            URL url = new URL(urlString);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("GET");
            connection.setConnectTimeout(1500);
            connection.setReadTimeout(1500);
            int code = connection.getResponseCode();
            return code >= 200 && code < 400;
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public void stop() {
        if (sidecarManager != null) {
            sidecarManager.stopSidecar();
        }
    }
}
