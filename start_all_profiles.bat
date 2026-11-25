@echo off
title BHARAT-SHIELD SENTINEL - 4-Profile Localhost Cluster
echo ======================================================================
echo 🛡️  Starting BHARAT-SHIELD Sentinel with 4 User Profiles on Localhost
echo ======================================================================
echo  [1] Super Admin (Naman Saini)        -> http://localhost:5173
echo  [2] Investigation Bureau (IB / LEA)   -> http://localhost:5174
echo  [3] Corporate Enterprise (Tata Sons) -> http://localhost:5175
echo  [4] Journalist Media (Press Desk)    -> http://localhost:5176
echo ======================================================================
node scripts\start_4_profiles.mjs
pause
