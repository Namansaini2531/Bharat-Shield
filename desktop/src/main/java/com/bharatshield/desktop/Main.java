package com.bharatshield.desktop;

import javafx.application.Application;

public class Main {
    public static void main(String[] args) {
        // Enforce GPU hardware acceleration with Direct3D
        if (System.getProperty("prism.order") == null) {
            System.setProperty("prism.order", "d3d,es2");
        }
        if (System.getProperty("prism.targetvram") == null) {
            System.setProperty("prism.targetvram", "512m");
        }
        if (System.getProperty("prism.lcdtext") == null) {
            System.setProperty("prism.lcdtext", "true");
        }

        Application.launch(DesktopApp.class, args);
    }
}
