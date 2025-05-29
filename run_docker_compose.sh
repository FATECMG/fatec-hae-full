#!/bin/bash

# Check if docker-compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "Error: docker-compose is not installed."
    echo "Please install docker-compose before running this script."
    exit 1
fi

docker-compose up --build --wait && docker-compose alpha watch
