@echo off
chcp 65001 >nul
echo.
echo ========================================
echo    说唱教学网站 - 预览生产版本
echo ========================================
echo.
echo 正在启动预览服务器...
echo.
cd /d "%~dp0"
start http://localhost:4173
npm run preview
