@echo off
title PTE Speaking Practice - Server
echo.
echo  Starting PTE Speaking Practice App...
echo.
powershell -ExecutionPolicy Bypass -File "%~dp0serve.ps1"
pause
