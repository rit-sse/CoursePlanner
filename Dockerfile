FROM node:boron

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY node_modules/ /usr/src/app/node_modules
COPY dist/ /usr/src/app


EXPOSE 8080

CMD [ "node", "server.js" ]

