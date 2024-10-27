FROM node:20-alpine

COPY package.json /app/
COPY nodemon.json /app/
COPY jest.config.js /app/
COPY tsconfig.json /app/
COPY src /app/src

WORKDIR /app

RUN npm install

CMD ["npm", "run", "dev"]
