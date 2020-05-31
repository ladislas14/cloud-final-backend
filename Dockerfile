FROM node:12-alpine

WORKDIR /app

ADD package.json /app/package.json

RUN npm config set registry http://registry.npmjs.org

RUN npm install

ADD . /app

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]