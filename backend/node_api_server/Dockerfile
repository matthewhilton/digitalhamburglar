FROM node:latest
LABEL description="NodeJS Api Endpoint and Processing Server"

WORKDIR /app

RUN npm i nodemon -g
RUN npm i ts-node -g

# Install server node_modules
COPY ./package.json .
ENV NODE_ENV=production

RUN npm install

COPY . .

# Run server as cmd
CMD ["nodemon", "./server.ts"]

# Expose server port
EXPOSE 4000