FROM node:20
WORKDIR /usr/src/
COPY package*.json ./
COPY yarn.lock ./
RUN yarn install
COPY . .
COPY .env ./
EXPOSE 5173
CMD ["yarn", "dev", "--host"]
