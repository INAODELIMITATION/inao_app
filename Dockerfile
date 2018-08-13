FROM node:8

RUN MKDIR /home/Inao_app

RUN npm install -g nodemon
#app directory
WORKDIR /home/Inao_app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]
