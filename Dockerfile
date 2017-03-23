FROM node:4

WORKDIR /usr/src/app

COPY ./package.json /usr/src/app/package.json
RUN npm install
RUN npm install -g gulp bower

COPY ./ /usr/src/app

RUN bower install --allow-root
RUN gulp

EXPOSE 8080

CMD [ "node", "dist/server.js" ]

