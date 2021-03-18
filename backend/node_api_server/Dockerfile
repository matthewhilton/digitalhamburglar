FROM node:12.2.0-alpine

WORKDIR /app

# Install server node_modules
COPY ./package.json .
ENV NODE_ENV=production
RUN npm install --production

COPY . .

# Compile ts -> js
RUN npm run tsc

# Run server as cmd
CMD ["npm", "run", "start"]

# Expose server port
EXPOSE 4000