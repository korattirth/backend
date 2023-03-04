FROM node:16.13.2-alpine3.14
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
COPY ./ ./
RUN npm ci

CMD ["npm", "start"]
