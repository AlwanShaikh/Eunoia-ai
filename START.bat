@echo off
title Eunoia AI Launcher

echo Starting Backend...
start "Backend" cmd /k "cd /d C:\Eunoia_Ai\backend && .venv\Scripts\activate && uvicorn app.main:app --reload"

timeout /t 3 >nul

echo Starting Frontend...
start "Frontend" cmd /k "cd /d C:\Eunoia_Ai && npm run dev"

exit