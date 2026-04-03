@echo off
setlocal EnableExtensions EnableDelayedExpansion
cd /d "%~dp0"
set "ROOT=%CD%"

title IPL — local stack launcher
echo.
echo ========================================
echo   IPL website — local setup ^& run
echo   Root: %ROOT%
echo ========================================
echo   Keeps running until you close each window
echo   (Ctrl+C in a window stops that service)
echo ========================================
echo.

where node >nul 2>&1
if errorlevel 1 (
  echo [ERROR] Node.js not found. Install LTS from https://nodejs.org/ then re-run.
  pause
  exit /b 1
)

set "HAS_PY="
where py >nul 2>&1 && set "HAS_PY=1"
where python >nul 2>&1 && set "HAS_PY=1"
if not defined HAS_PY (
  echo [ERROR] Python 3 not found. Install from https://www.python.org/ ^(check "Add to PATH"^) or install the "py" launcher.
  pause
  exit /b 1
)

if /i "%~1"=="noinstall" (
  set "SKIP_INSTALL=1"
  echo [INFO] SKIP_INSTALL: skip npm/pip unless venv is missing.
  echo.
) else (
  set "SKIP_INSTALL="
)

REM --- env files (safe defaults for same-machine browser) ---
if not exist "%ROOT%\backend\.env" (
  if exist "%ROOT%\backend\.env.example" (
    copy /Y "%ROOT%\backend\.env.example" "%ROOT%\backend\.env" >nul
    echo [OK] Created backend\.env from .env.example  ^(add CRICAPI_API_KEY for live scores^)
  )
)
if not exist "%ROOT%\frontend\.env.local" (
  if exist "%ROOT%\frontend\.env.example" (
    copy /Y "%ROOT%\frontend\.env.example" "%ROOT%\frontend\.env.local" >nul
    echo [OK] Created frontend\.env.local from .env.example
  )
)

REM --- install dependencies ---
if not exist "%ROOT%\ml-service\.venv\Scripts\python.exe" (
  set "NEED_VENV=1"
) else (
  set "NEED_VENV="
)

if not defined SKIP_INSTALL (
  echo [1/3] npm install — backend ...
  pushd "%ROOT%\backend"
  call npm install
  if errorlevel 1 popd & echo [ERROR] backend npm install failed. & pause & exit /b 1
  popd

  echo [2/3] npm install — frontend ...
  pushd "%ROOT%\frontend"
  call npm install
  if errorlevel 1 popd & echo [ERROR] frontend npm install failed. & pause & exit /b 1
  popd

  set "NEED_VENV=1"
)

if defined NEED_VENV (
  echo [3/3] Python venv + pip — ml-service ...
  echo       ^(needs Python 3.11–3.13 — 3.14 breaks pydantic-core builds^)
  REM --- Drop venv if it was made with Python 3.14+ (PyO3 / wheels not ready) ---
  if exist "%ROOT%\ml-service\.venv\Scripts\python.exe" (
    "%ROOT%\ml-service\.venv\Scripts\python.exe" -c "import sys; v=sys.version_info[:2]; raise SystemExit(0 if (3,11)<=v<=(3,13) else 1)" 2>nul
    if errorlevel 1 (
      echo       Removing incompatible venv ^(Python 3.14+^) ...
      rd /s /q "%ROOT%\ml-service\.venv" 2>nul
    )
  )
  if not exist "%ROOT%\ml-service\.venv\Scripts\python.exe" (
    echo       Creating ml-service\.venv with Python 3.12, 3.13, or 3.11 ...
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
      echo [ERROR] Install Python 3.12 or 3.13 from https://www.python.org/downloads/
      echo         ^(enable "py launcher" and "Add to PATH"^). Python 3.14 cannot run ml-service yet.
      pause
      exit /b 1
    )
  )
  pushd "%ROOT%\ml-service"
  call .venv\Scripts\activate.bat
  python -m pip install -q --upgrade pip
  python -m pip install -q -r requirements.txt
  if errorlevel 1 popd & echo [ERROR] pip install failed. If you still see pydantic errors, delete ml-service\.venv and re-run. & pause & exit /b 1
  popd
  echo.
)

REM --- start services (three windows; order: ML then API then UI) ---
echo Starting services in new windows ...
echo   ML API     http://127.0.0.1:8000  ^(health: /health^)
echo   Backend    http://127.0.0.1:3001
echo   Frontend   http://127.0.0.1:3000
echo.

start "IPL ML :8000" /D "%ROOT%\ml-service" cmd /k "call .venv\Scripts\activate.bat && uvicorn api.main:app --host 127.0.0.1 --port 8000"
timeout /t 2 /nobreak >nul

start "IPL Backend :3001" /D "%ROOT%\backend" cmd /k "npm run dev"
timeout /t 2 /nobreak >nul

start "IPL Frontend :3000" /D "%ROOT%\frontend" cmd /k "npm run dev"

echo.
echo Waiting ~10s for Next.js to boot, then opening the site in your browser ...
timeout /t 10 /nobreak >nul
start "" "http://127.0.0.1:3000"

echo.
echo Done. Leave the three titled windows open for your RDP session.
echo Tip: next time, run   start-ipl-local.bat noinstall   to skip installs and start faster.
echo.
pause

endlocal
exit /b 0
