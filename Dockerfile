FROM node:10

RUN npm install -g nodemon

RUN npm install pm2 -g


#app directory
WORKDIR /home/Inao_app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]
