package com.bharatshield.desktop;

import javafx.application.Application;

public class Main {
    public static void main(String[] args) {
        // Enforce GPU hardware acceleration & texture-based scrolling for JavaFX WebView
        if (System.getProperty("prism.order") == null) {
            System.setProperty("prism.order", "d3d,es2");
        }
        if (System.getProperty("prism.scrollmode") == null) {
            System.setProperty("prism.scrollmode", "texture");
        }
        if (System.getProperty("prism.targetvram") == null) {
            System.setProperty("prism.targetvram", "512m");
        }
        if (System.getProperty("prism.vsync") == null) {
            System.setProperty("prism.vsync", "true");
        }
        if (System.getProperty("prism.lcdtext") == null) {
            System.setProperty("prism.lcdtext", "true");
        }

        Application.launch(DesktopApp.class, args);
    }
}
