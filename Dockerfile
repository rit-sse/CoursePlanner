FROM node:6.10.1

WORKDIR /usr/src/app

COPY ./package.json /usr/src/app/package.json
RUN npm install
RUN npm install -g gulp bower

COPY ./ /usr/src/app

RUN bower install --allow-root
RUN npm run prodGulp
RUN npm run loadSecrets
RUN ./scripts/setup-schools.sh

EXPOSE 8080

CMD [ "./scripts/run-server.sh" ]

