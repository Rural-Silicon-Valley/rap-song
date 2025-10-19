@echo off
chcp 65001 >nul
echo.
echo ========================================
echo    说唱教学网站 - 启动服务器
echo ========================================
echo.
echo 正在启动开发服务器...
echo.
cd /d "%~dp0"
start http://localhost:3000
npm run dev
