FROM node:22.3-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

CMD ["node", "dist/index.js"] # Ajuste o caminho para seu arquivo compilado