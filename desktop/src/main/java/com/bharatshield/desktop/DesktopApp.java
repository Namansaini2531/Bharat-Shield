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
    private LocalStaticServer staticServer;

    @Override
    public void start(Stage primaryStage) {
        // 1. Initialize Sidecar Manager and start Python backend
        sidecarManager = new SidecarManager();
        sidecarManager.startSidecar();

        // 2. Setup WebView and WebEngine
        webView = new WebView();
        webEngine = webView.getEngine();
        webEngine.setJavaScriptEnabled(true);

        // Hardware-amplified smooth mouse wheel scroll filter for native browser speed
        webView.addEventFilter(javafx.scene.input.ScrollEvent.SCROLL, event -> {
            if (event.getDeltaY() != 0 || event.getDeltaX() != 0) {
                // JavaFX wheel delta per notch is ~30px; 2.5x matches Chrome/Brave 100-120px speed
                double deltaX = -event.getDeltaX() * 2.5;
                double deltaY = -event.getDeltaY() * 2.5;
                try {
                    webEngine.executeScript(String.format(java.util.Locale.US,
                        "(function(dx, dy, x, y) {" +
                        "  var el = document.elementFromPoint(x, y);" +
                        "  while (el && el !== document.body && el !== document.documentElement) {" +
                        "    var s = window.getComputedStyle(el);" +
                        "    var sy = (s.overflowY === 'auto' || s.overflowY === 'scroll') && el.scrollHeight > el.clientHeight;" +
                        "    var sx = (s.overflowX === 'auto' || s.overflowX === 'scroll') && el.scrollWidth > el.clientWidth;" +
                        "    if (sy || sx) {" +
                        "      if (sy) el.scrollTop += dy;" +
                        "      if (sx) el.scrollLeft += dx;" +
                        "      return;" +
                        "    }" +
                        "    el = el.parentElement;" +
                        "  }" +
                        "  window.scrollBy(dx, dy);" +
                        "})(%f, %f, %f, %f);",
                        deltaX, deltaY, event.getX(), event.getY()
                    ));
                    event.consume();
                } catch (Exception ignored) {}
            }
        });

        // Customize User Agent so React app knows it is in the desktop client
        String defaultUA = webEngine.getUserAgent();
        webEngine.setUserAgent(defaultUA + " BharatShieldDesktop/1.0.0 (JavaFX)");

        // 3. Setup JS Error and Alert Listeners
        webEngine.setOnError(event -> System.err.println("[WebEngine Error]: " + event.getMessage()));
        webEngine.setOnAlert(event -> System.out.println("[WebEngine Alert]: " + event.getData()));

        // 4. Setup JS to Java Native Bridge
        NativeBridge nativeBridge = new NativeBridge(primaryStage);
        webEngine.getLoadWorker().stateProperty().addListener((obs, oldState, newState) -> {
            if (newState == Worker.State.SUCCEEDED) {
                try {
                    JSObject window = (JSObject) webEngine.executeScript("window");
                    window.setMember("bharatShieldNative", nativeBridge);
                    window.setMember("__BHARAT_SHIELD_API_URL__", "http://127.0.0.1:8000");
                    window.setMember("__BHARAT_SHIELD_WS_URL__", "ws://127.0.0.1:8000");

                    // Forward client JavaScript errors and console logs to Java terminal
                    webEngine.executeScript(
                        "window.onerror = function(message, source, lineno, colno, error) {" +
                        "  var details = message + ' (' + source + ':' + lineno + ')';" +
                        "  if (window.bharatShieldNative) { window.bharatShieldNative.logError(details); }" +
                        "  return false;" +
                        "};" +
                        "var _origLog = console.log; console.log = function() {" +
                        "  _origLog.apply(console, arguments);" +
                        "  if (window.bharatShieldNative) {" +
                        "    var args = Array.prototype.slice.call(arguments).join(' ');" +
                        "    window.bharatShieldNative.logToConsole(args);" +
                        "  }" +
                        "};" +
                        "var _origErr = console.error; console.error = function() {" +
                        "  _origErr.apply(console, arguments);" +
                        "  if (window.bharatShieldNative) {" +
                        "    var args = Array.prototype.slice.call(arguments).join(' ');" +
                        "    window.bharatShieldNative.logError(args);" +
                        "  }" +
                        "};"
                    );

                    System.out.println("[Desktop] Native bridge and console logger successfully injected.");
                } catch (Exception e) {
                    System.err.println("[Desktop] Bridge injection warning: " + e.getMessage());
                }
            } else if (newState == Worker.State.FAILED) {
                System.err.println("[Desktop] Load failed: " + webEngine.getLoadWorker().getException());
            }
        });

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

        // 6. Handle Window Closing - Cleanly kill child processes and static server
        primaryStage.setOnCloseRequest(event -> {
            System.out.println("[Desktop] Application closing. Terminating backend sidecar...");
            cleanup();
            Platform.exit();
            System.exit(0);
        });

        primaryStage.show();

        // 7. Load Application Content
        loadAppContent();
    }

    private void loadAppContent() {
        new Thread(() -> {
            // First check if Vite dev server is running on localhost:5173
            boolean isDevServerOnline = checkServer("http://localhost:5173");
            if (isDevServerOnline) {
                System.out.println("[Desktop] Connected to live Vite dev server: " + DEV_URL);
                Platform.runLater(() -> webEngine.load(DEV_URL));
                return;
            }

            // Otherwise, check if frontend/dist exists to serve via internal HTTP server
            File distDir = new File("frontend/dist");
            if (!distDir.exists()) {
                distDir = new File("../frontend/dist");
            }

            if (distDir.exists() && new File(distDir, "index.html").exists()) {
                try {
                    staticServer = new LocalStaticServer(distDir);
                    int port = staticServer.start();
                    String localUrl = "http://127.0.0.1:" + port;
                    System.out.println("[Desktop] Serving production frontend on " + localUrl);
                    Platform.runLater(() -> webEngine.load(localUrl));
                } catch (Exception e) {
                    System.err.println("[Desktop] Failed to start local static server: " + e.getMessage());
                    Platform.runLater(() -> webEngine.load(DEV_URL));
                }
            } else {
                System.out.println("[Desktop] Neither Vite server nor frontend/dist found. Waiting on " + DEV_URL);
                Platform.runLater(() -> webEngine.load(DEV_URL));
            }
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

    private void cleanup() {
        if (sidecarManager != null) {
            sidecarManager.stopSidecar();
        }
        if (staticServer != null) {
            staticServer.stop();
        }
    }

    @Override
    public void stop() {
        cleanup();
    }
}
