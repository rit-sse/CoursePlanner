FROM node:6.10.1

WORKDIR /usr/src/app

COPY ./package.json /usr/src/app/package.json
RUN npm install
RUN npm install -g gulp bower

COPY ./ /usr/src/app

RUN bower install --allow-root
RUN npm run prodGulp
RUN npm run setupSchools

EXPOSE 8080

CMD [ "node", "dist/server.js" ]

