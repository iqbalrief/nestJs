FROM node:16.13

WORKDIR /app
COPY pakcage.json .
RUN npm install
COPY . .

CMD npm run start
