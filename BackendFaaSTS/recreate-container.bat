@echo off

REM Delete old container, build new image and run new container

echo Stopping and removing old container...

docker container stop fatec-backend

docker container rm fatec-backend

echo Building new image and running new container...

docker image build -t fatec:backend .

docker container run -d -p 3000:3000 --name fatec-backend --env-file .env.development fatec:backend
