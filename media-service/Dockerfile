FROM node:20.14.0-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

EXPOSE 3003

CMD ["node", "server.js"]