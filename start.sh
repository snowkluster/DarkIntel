#!/bin/sh

Green="\e[32m"
Red="\033[0;31m"
Blue='\033[0;34m'
NC='\033[0m'

networks=$(sudo docker network ls)

if [ "$1" = "stop" ]; then
    echo "${Red}Stopping API containers and shutting down frontend${NC}"
    sudo docker compose down --rmi local
    exit 0
fi

if [ "$1" = "clean" ]; then
  echo "${Blue} Removing <none> images to clean system"
  sudo docker rmi $(sudo docker images -f "dangling=true" -q)
  exit 0
fi

if echo "$networks" | grep -q "dark_network"; then
  echo "${Green}The 'dark_network' network already exists."
else
  echo "${Red}The 'dark_network' network does not exist."
  echo "${Green}creating network"
  sudo docker network create dark_network
fi

echo "${Green}starting server build"

sudo docker compose build

echo "${Green}starting server in deattached mode"

sudo docker compose up -d