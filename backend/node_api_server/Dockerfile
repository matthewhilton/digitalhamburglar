FROM node:alpine
LABEL description="NodeJS Api Endpoint and Processing Server"

WORKDIR /app

#RUN npm i nodemon -g
#RUN npm i ts-node -g

# Install server node_modules
COPY ./package.json .
ENV NODE_ENV=production

RUN npm install

COPY . .

RUN npm run tsc

# Run server as cmd
CMD ["npm", "run", "start"]

# Expose server port
EXPOSE 4000
