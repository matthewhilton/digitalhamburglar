FROM node:12.2.0-alpine

WORKDIR /app

# Install frontend node_modules
COPY ./package.json .
COPY ./yarn.lock .
ENV NODE_ENV=production
RUN yarn install --production

# Copy the rest of the code
COPY . .

# Install Doppler CLI
RUN (curl -Ls https://cli.doppler.com/install.sh || wget -qO- https://cli.doppler.com/install.sh) | sh

RUN yarn global add serve
# Wrap the serve command in the doppler run command 
# Doppler will inject the environment variables

ARG DOPPLER_TOKEN
ENV DOPPLER_TOKEN $DOPPLER_TOKEN
RUN doppler run -- npm run build

CMD ["npm", "run", "serve"]

# Expose html serve port
EXPOSE 5000