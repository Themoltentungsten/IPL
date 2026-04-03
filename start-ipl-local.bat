@echo off
setlocal EnableExtensions EnableDelayedExpansion
cd /d "%~dp0"
set "ROOT=%CD%"

title IPL 2026 — Local Stack Launcher
echo.
echo =========================================================
echo   IPL 2026 — Live Scores ^& AI Predictions
echo   Root: %ROOT%
echo =========================================================
echo   This script sets up and runs the entire IPL website
echo   locally on your RDP. All three services will start
echo   in separate windows. Close them with Ctrl+C.
echo =========================================================
echo.

REM --- Check Node.js ---
where node >nul 2>&1
if errorlevel 1 (
  echo [ERROR] Node.js not found. Install LTS from https://nodejs.org/ then re-run.
  pause
  exit /b 1
)
for /f "tokens=1" %%v in ('node -v') do echo [OK] Node.js %%v

REM --- Check npm ---
where npm >nul 2>&1
if errorlevel 1 (
  echo [ERROR] npm not found. Reinstall Node.js LTS from https://nodejs.org/
  pause
  exit /b 1
)
for /f "tokens=1" %%v in ('npm -v') do echo [OK] npm %%v

REM --- Check Python ---
set "HAS_PY="
where py >nul 2>&1 && set "HAS_PY=1"
where python >nul 2>&1 && set "HAS_PY=1"
if not defined HAS_PY (
  echo [WARN] Python 3 not found. ML service will be skipped.
  echo        Install from https://www.python.org/ to enable AI predictions.
  set "SKIP_ML=1"
) else (
  set "SKIP_ML="
)

REM --- Parse arguments ---
if /i "%~1"=="noinstall" (
  set "SKIP_INSTALL=1"
  echo [INFO] SKIP_INSTALL mode: skipping npm/pip installs.
  echo.
) else (
  set "SKIP_INSTALL="
)

REM --- Create .env files if missing ---
if not exist "%ROOT%\backend\.env" (
  if exist "%ROOT%\backend\.env.example" (
    copy /Y "%ROOT%\backend\.env.example" "%ROOT%\backend\.env" >nul
    echo [OK] Created backend\.env from .env.example
  ) else (
    (
      echo PORT=3001
      echo CRICAPI_API_KEY=
      echo IPL_SERIES_ID=87c62aac-bc3c-4738-ab93-19da0690488f
    ) > "%ROOT%\backend\.env"
    echo [OK] Created backend\.env with defaults
  )
)
if not exist "%ROOT%\frontend\.env.local" (
  echo NEXT_PUBLIC_BACKEND_URL=http://127.0.0.1:3001> "%ROOT%\frontend\.env.local"
  echo [OK] Created frontend\.env.local
)
echo.

REM --- Prompt for API key if empty ---
for /f "tokens=1,2 delims==" %%a in ('findstr /i "CRICAPI_API_KEY" "%ROOT%\backend\.env"') do (
  set "APIKEY_VAL=%%b"
)
if "!APIKEY_VAL!"=="" (
  echo [NOTICE] No CRICAPI_API_KEY set in backend\.env
  echo          Get a free key at https://cricketdata.org/
  echo          The site will run but show placeholder data without it.
  echo.
)

REM --- Install dependencies ---
if not defined SKIP_INSTALL (
  echo ============================================
  echo   [1/3] Installing backend dependencies...
  echo ============================================
  pushd "%ROOT%\backend"
  call npm install
  if errorlevel 1 (
    popd
    echo [ERROR] Backend npm install failed.
    pause
    exit /b 1
  )
  popd
  echo [OK] Backend dependencies installed.
  echo.

  echo ============================================
  echo   [2/3] Installing frontend dependencies...
  echo ============================================
  pushd "%ROOT%\frontend"
  call npm install
  if errorlevel 1 (
    popd
    echo [ERROR] Frontend npm install failed.
    pause
    exit /b 1
  )
  popd
  echo [OK] Frontend dependencies installed.
  echo.
)

REM --- Verify node_modules exist ---
if not exist "%ROOT%\backend\node_modules" (
  echo [ERROR] backend\node_modules missing. Run without "noinstall" first.
  pause
  exit /b 1
)
if not exist "%ROOT%\frontend\node_modules" (
  echo [ERROR] frontend\node_modules missing. Run without "noinstall" first.
  pause
  exit /b 1
)

REM --- Verify next binary exists ---
if not exist "%ROOT%\frontend\node_modules\.bin\next.cmd" (
  if not exist "%ROOT%\frontend\node_modules\.bin\next" (
    echo [ERROR] Next.js binary not found. Re-running npm install for frontend...
    pushd "%ROOT%\frontend"
    call npm install
    popd
    if not exist "%ROOT%\frontend\node_modules\.bin\next.cmd" (
      echo [ERROR] Still missing. Delete frontend\node_modules and run again.
      pause
      exit /b 1
    )
  )
)
echo [OK] All node_modules verified.
echo.

REM --- ML service venv setup ---
if not defined SKIP_ML (
  if not exist "%ROOT%\ml-service\.venv\Scripts\python.exe" (
    set "NEED_VENV=1"
  ) else (
    set "NEED_VENV="
  )

  if not defined SKIP_INSTALL set "NEED_VENV=1"

  if defined NEED_VENV (
    echo ============================================
    echo   [3/3] Setting up ML service (Python)...
    echo ============================================
    echo   Requires Python 3.11-3.13 ^(3.14 breaks pydantic-core^)

    REM Drop venv if built with Python 3.14+
    if exist "%ROOT%\ml-service\.venv\Scripts\python.exe" (
      "%ROOT%\ml-service\.venv\Scripts\python.exe" -c "import sys; v=sys.version_info[:2]; raise SystemExit(0 if (3,11)<=v<=(3,13) else 1)" 2>nul
      if errorlevel 1 (
        echo   Removing incompatible venv ^(Python 3.14+^)...
        rd /s /q "%ROOT%\ml-service\.venv" 2>nul
      )
    )

    if not exist "%ROOT%\ml-service\.venv\Scripts\python.exe" (
      echo   Creating venv with Python 3.12, 3.13, or 3.11...
      set "VENV_MADE="
      py -3.12 -m venv "%ROOT%\ml-service\.venv" 2>nul
      if exist "%ROOT%\ml-service\.venv\Scripts\python.exe" set "VENV_MADE=1"
      if not defined VENV_MADE (
        rd /s /q "%ROOT%\ml-service\.venv" 2>nul
        py -3.13 -m venv "%ROOT%\ml-service\.venv" 2>nul
        if exist "%ROOT%\ml-service\.venv\Scripts\python.exe" set "VENV_MADE=1"
      )
      if not defined VENV_MADE (
        rd /s /q "%ROOT%\ml-service\.venv" 2>nul
        py -3.11 -m venv "%ROOT%\ml-service\.venv" 2>nul
        if exist "%ROOT%\ml-service\.venv\Scripts\python.exe" set "VENV_MADE=1"
      )
      if not defined VENV_MADE (
        echo [WARN] Could not create Python venv. ML service will be skipped.
        echo        Install Python 3.12 from https://www.python.org/downloads/
        set "SKIP_ML=1"
      )
    )

    if not defined SKIP_ML (
      pushd "%ROOT%\ml-service"
      call .venv\Scripts\activate.bat
      python -m pip install -q --upgrade pip
      python -m pip install -q -r requirements.txt
      if errorlevel 1 (
        popd
        echo [WARN] pip install failed. ML predictions will be unavailable.
        set "SKIP_ML=1"
      ) else (
        popd
      )
    )
    echo.
  )
)

REM --- Create launcher helper scripts so windows stay open on crash ---
echo @echo off> "%ROOT%\backend\_run.cmd"
echo title IPL Backend :3001>> "%ROOT%\backend\_run.cmd"
echo cd /d "%ROOT%\backend">> "%ROOT%\backend\_run.cmd"
echo echo.>> "%ROOT%\backend\_run.cmd"
echo echo ==========================================>> "%ROOT%\backend\_run.cmd"
echo echo   IPL Backend starting on port 3001...>> "%ROOT%\backend\_run.cmd"
echo echo ==========================================>> "%ROOT%\backend\_run.cmd"
echo echo.>> "%ROOT%\backend\_run.cmd"
echo call npm run dev>> "%ROOT%\backend\_run.cmd"
echo echo.>> "%ROOT%\backend\_run.cmd"
echo echo [ERROR] Backend stopped unexpectedly.>> "%ROOT%\backend\_run.cmd"
echo echo         Check the error above.>> "%ROOT%\backend\_run.cmd"
echo pause>> "%ROOT%\backend\_run.cmd"

echo @echo off> "%ROOT%\frontend\_run.cmd"
echo title IPL Frontend :3000>> "%ROOT%\frontend\_run.cmd"
echo cd /d "%ROOT%\frontend">> "%ROOT%\frontend\_run.cmd"
echo echo.>> "%ROOT%\frontend\_run.cmd"
echo echo ==========================================>> "%ROOT%\frontend\_run.cmd"
echo echo   IPL Frontend starting on port 3000...>> "%ROOT%\frontend\_run.cmd"
echo echo   (Next.js takes ~10-15s to compile)>> "%ROOT%\frontend\_run.cmd"
echo echo ==========================================>> "%ROOT%\frontend\_run.cmd"
echo echo.>> "%ROOT%\frontend\_run.cmd"
echo call npm run dev>> "%ROOT%\frontend\_run.cmd"
echo echo.>> "%ROOT%\frontend\_run.cmd"
echo echo [ERROR] Frontend stopped unexpectedly.>> "%ROOT%\frontend\_run.cmd"
echo echo         Check the error above.>> "%ROOT%\frontend\_run.cmd"
echo pause>> "%ROOT%\frontend\_run.cmd"

if not defined SKIP_ML (
  echo @echo off> "%ROOT%\ml-service\_run.cmd"
  echo title IPL ML Service :8000>> "%ROOT%\ml-service\_run.cmd"
  echo cd /d "%ROOT%\ml-service">> "%ROOT%\ml-service\_run.cmd"
  echo echo.>> "%ROOT%\ml-service\_run.cmd"
  echo echo ==========================================>> "%ROOT%\ml-service\_run.cmd"
  echo echo   IPL ML Service starting on port 8000...>> "%ROOT%\ml-service\_run.cmd"
  echo echo ==========================================>> "%ROOT%\ml-service\_run.cmd"
  echo echo.>> "%ROOT%\ml-service\_run.cmd"
  echo call .venv\Scripts\activate.bat>> "%ROOT%\ml-service\_run.cmd"
  echo uvicorn api.main:app --host 127.0.0.1 --port 8000>> "%ROOT%\ml-service\_run.cmd"
  echo echo.>> "%ROOT%\ml-service\_run.cmd"
  echo echo [ERROR] ML service stopped unexpectedly.>> "%ROOT%\ml-service\_run.cmd"
  echo echo         Check the error above.>> "%ROOT%\ml-service\_run.cmd"
  echo pause>> "%ROOT%\ml-service\_run.cmd"
)

REM --- Start services ---
echo =========================================================
echo   Starting services...
echo =========================================================
echo.

if not defined SKIP_ML (
  echo   [ML API]     http://127.0.0.1:8000
  start "IPL ML :8000" cmd /c "%ROOT%\ml-service\_run.cmd"
  timeout /t 3 /nobreak >nul
) else (
  echo   [ML API]     SKIPPED ^(no Python or venv failed^)
)

echo   [Backend]    http://127.0.0.1:3001
start "IPL Backend :3001" cmd /c "%ROOT%\backend\_run.cmd"
timeout /t 4 /nobreak >nul

echo   [Frontend]   http://127.0.0.1:3000
start "IPL Frontend :3000" cmd /c "%ROOT%\frontend\_run.cmd"

echo.
echo =========================================================
echo   All services starting...
echo   Waiting ~15s for Next.js to compile, then opening browser.
echo =========================================================
timeout /t 15 /nobreak >nul
start "" "http://127.0.0.1:3000"

echo.
echo =========================================================
echo   IPL 2026 is running!
echo.
echo   Leave the titled windows open for your RDP session.
echo   Each service runs in its own window.
echo   If a service crashes, the window will stay open
echo   showing the error message.
echo.
echo   TIP: Next time run  start-ipl-local.bat noinstall
echo        to skip installs and start faster.
echo =========================================================
echo.
pause

endlocal
exit /b 0
