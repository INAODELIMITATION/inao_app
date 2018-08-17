FROM node:10

RUN npm install -g nodemon

RUN npm install pm2 -g

RUN mkdir -p /home/Inao_app

RUN mkdir -p /home/Inao_app/config


#app directory
WORKDIR /home/Inao_app

COPY package*.json /home/Inao_app/

RUN npm install

COPY . /home/Inao_app/

VOLUME /home/Inao_app/config

EXPOSE 3000

CMD [ "npm", "start" ]
