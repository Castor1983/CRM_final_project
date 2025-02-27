FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install -- production

COPY . .

RUN npm run build

EXPOSE 3001

CMD ["npm", "run", "start:prod"]