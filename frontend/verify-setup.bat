@echo off
REM Frontend Verification Checklist for Windows
REM Run this to verify all frontend files are properly set up

echo.
echo ======================================================================
echo FRONTEND VERIFICATION CHECKLIST
echo ======================================================================
echo.

REM Check files exist
echo Checking Core Files...
if exist package.json echo   [OK] package.json || echo   [MISSING] package.json
if exist vite.config.js echo   [OK] vite.config.js || echo   [MISSING] vite.config.js
if exist tailwind.config.js echo   [OK] tailwind.config.js || echo   [MISSING] tailwind.config.js
if exist postcss.config.cjs echo   [OK] postcss.config.cjs || echo   [MISSING] postcss.config.cjs
if exist index.html echo   [OK] index.html || echo   [MISSING] index.html
if exist .env echo   [OK] .env || echo   [MISSING] .env
echo.

echo Checking Source Files...
if exist src\main.jsx echo   [OK] src/main.jsx || echo   [MISSING] src/main.jsx
if exist src\App.jsx echo   [OK] src/App.jsx || echo   [MISSING] src/App.jsx
if exist src\api.js echo   [OK] src/api.js || echo   [MISSING] src/api.js
if exist src\index.css echo   [OK] src/index.css || echo   [MISSING] src/index.css
echo.

echo Checking Pages...
if exist src\pages\Login.jsx echo   [OK] src/pages/Login.jsx || echo   [MISSING] src/pages/Login.jsx
if exist src\pages\Main.jsx echo   [OK] src/pages/Main.jsx || echo   [MISSING] src/pages/Main.jsx
if exist src\pages\DatasetBrowser.jsx echo   [OK] src/pages/DatasetBrowser.jsx || echo   [MISSING] src/pages/DatasetBrowser.jsx
if exist src\pages\ModelMetrics.jsx echo   [OK] src/pages/ModelMetrics.jsx || echo   [MISSING] src/pages/ModelMetrics.jsx
if exist src\pages\ConfusionMatrix.jsx echo   [OK] src/pages/ConfusionMatrix.jsx || echo   [MISSING] src/pages/ConfusionMatrix.jsx
echo.

echo Checking Components...
if exist src\components\UploadDropzone.jsx echo   [OK] src/components/UploadDropzone.jsx || echo   [MISSING] src/components/UploadDropzone.jsx
echo.

echo Checking Dependencies...
if exist node_modules echo   [OK] node_modules (installed) || echo   [MISSING] node_modules
if exist package-lock.json echo   [OK] package-lock.json || echo   [MISSING] package-lock.json
echo.

echo Checking Configuration...
if exist .eslintrc.json echo   [OK] .eslintrc.json || echo   [MISSING] .eslintrc.json
if exist .prettierrc.json echo   [OK] .prettierrc.json || echo   [MISSING] .prettierrc.json
echo.

echo ======================================================================
echo QUICK START
echo ======================================================================
echo.
echo To start the frontend development server:
echo   npm run dev
echo.
echo Then open in your browser:
echo   http://localhost:5173
echo.
echo Default login credentials ^(any non-empty values work^):
echo   Username: demo
echo   Password: password
echo.
echo ======================================================================
echo.
pause
