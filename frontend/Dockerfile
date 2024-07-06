FROM node:latest

WORKDIR /var/www/app

COPY . /var/www/app/

RUN npm i

RUN npm run build

EXPOSE 5173

CMD [ "npm", "run", "dev" ]