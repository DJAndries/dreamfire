FROM node:12-alpine

EXPOSE 80

WORKDIR /usr/src/app

COPY package.json /usr/src/app
COPY package-lock.json /usr/src/app

RUN npm install

COPY src /usr/src/app/src
COPY tsconfig.json /usr/src/app

RUN npm run build

RUN npm prune --production
RUN rm -rf /usr/src/app/src

CMD ["npm", "run", "start:prod"]