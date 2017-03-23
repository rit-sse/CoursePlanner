FROM node:4

WORKDIR /usr/src/app

COPY ./package.json /usr/src/app/package.json
RUN npm install
RUN npm install -g gulp
RUN gulp
RUN bower install


COPY ./ /usr/src/app

EXPOSE 8080

CMD [ "node", "server.js" ]

