@echo off
if /I "%1"=="run" if /I "%2"=="development" (
  npm run development
  exit /b %errorlevel%
)
if /I "%1"=="run" (
  npm run %2
  exit /b %errorlevel%
)
npm %*
exit /b %errorlevel%
