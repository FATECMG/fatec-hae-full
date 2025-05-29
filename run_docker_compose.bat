@echo off

REM Check if docker-compose is installed
where /q docker-compose
if %errorlevel% neq 0 (
    echo Error: docker-compose is not installed.
    echo Please install docker-compose before running this script.
    exit /b 1
)

docker-compose up --build --wait

docker-compose alpha watch
