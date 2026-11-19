@echo off
setlocal
cd /d "%~dp0"

echo ========================================================
echo Starting Firebase Google Auth Demo Server...
echo ========================================================

set "PY_EXE=C:\Users\BHAVANA M K\AppData\Local\Programs\Python\Python314\python.exe"
if exist "%PY_EXE%" goto RUN_PY

for /f "tokens=*" %%i in ('where python 2^>nul') do (
    "%%i" --version >nul 2>nul
    if not errorlevel 1 (
        set "PY_EXE=%%i"
        goto RUN_PY
    )
)

echo [ERROR] Working Python interpreter could not be found!
pause
exit /b 1

:RUN_PY
echo Using Python at: "%PY_EXE%"
start "" powershell -WindowStyle Hidden -Command "Start-Sleep -Seconds 1; Start-Process 'http://localhost:8000'"

echo Running local web server on http://localhost:8000 ...
"%PY_EXE%" -m http.server 8000 --bind 127.0.0.1
pause
