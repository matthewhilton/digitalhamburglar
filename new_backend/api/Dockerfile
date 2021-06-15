FROM node:alpine
LABEL description="NodeJS Api Endpoint and Processing Server"

WORKDIR /app

# Install server node_modules
COPY ./package.json .
ENV NODE_ENV=production

RUN npm install --production
RUN npm install tsc

COPY . .

RUN npm run tsc

RUN npx prisma generate

# Run server as cmd
CMD ["npm", "start"]

# Expose server port
EXPOSE 4000
