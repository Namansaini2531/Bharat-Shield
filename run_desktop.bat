@echo off
title Bharat-Shield Sentinel Desktop Launcher
echo ========================================================
echo   Starting Bharat-Shield Sentinel Desktop (JavaFX + React)
echo ========================================================
echo.

"%~dp0tools\maven\bin\mvn.cmd" -f "%~dp0desktop\pom.xml" javafx:run
