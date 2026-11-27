package com.bharatshield.desktop;

import javafx.application.Platform;
import javafx.stage.FileChooser;
import javafx.stage.Stage;

import java.io.File;
import java.io.FileWriter;

/**
 * Native bridge methods accessible from React via window.bharatShieldNative
 */
public class NativeBridge {

    private final Stage stage;

    public NativeBridge(Stage stage) {
        this.stage = stage;
    }

    public String getAppVersion() {
        return "1.0.0-JavaFX";
    }

    public String getPlatformName() {
        return System.getProperty("os.name") + " (" + System.getProperty("os.arch") + ")";
    }

    public void logToConsole(String message) {
        System.out.println("[React Client]: " + message);
    }

    public void saveEvidenceFile(String defaultFilename, String content) {
        Platform.runLater(() -> {
            try {
                FileChooser fileChooser = new FileChooser();
                fileChooser.setTitle("Export Tamper-Proof Evidence Package");
                fileChooser.setInitialFileName(defaultFilename);
                fileChooser.getExtensionFilters().addAll(
                        new FileChooser.ExtensionFilter("JSON Evidence (*.json)", "*.json"),
                        new FileChooser.ExtensionFilter("All Files", "*.*")
                );

                File file = fileChooser.showSaveDialog(stage);
                if (file != null) {
                    try (FileWriter writer = new FileWriter(file)) {
                        writer.write(content);
                        System.out.println("[NativeBridge] Evidence exported to: " + file.getAbsolutePath());
                    }
                }
            } catch (Exception e) {
                System.err.println("[NativeBridge] Failed to export evidence: " + e.getMessage());
            }
        });
    }
}
