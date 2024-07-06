# Dark Intel

Quickly and Safely search cyber criminal forums for data breaches and leaks 

## Setup

In the [server](server) directory create a virtual environment to install the required packages

`python3 -m venv venv`

`source ./venv/bin/activate`

`pip3 install -r requirements.txt`

Then in the [root](.) folder run 

`npm i` to install all react and bootstrap dependancies

## Start

In the [server](server) directory run

`uvicorn main:app --reload` to start the backend and the web scrapper

Then in the [root](.) folder run 

`npm run dev` 

## Docker 

If you have Docker installed you can quick start the application by running

```sh
./start.sh
```

## Endpoints

Frontend is avaliable at [localhost:5173](http://localhost:5173)

Backend is avaliable at [localhost:8000](http://localhost:8000)
## Note

The `cookies.json` are account cookies from one of these cyber crime forums that I was able to extract and his required to scrape the website

## Authors

- [@snowkluster](https://github.com/snowkluster)