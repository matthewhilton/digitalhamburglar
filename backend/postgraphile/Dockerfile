FROM node:alpine
LABEL description="GraphQL API generator for Postgres"

# Install PostGraphile and PostGraphile connection filter plugin
RUN npm install -g postgraphile
RUN npm install -g postgraphile-plugin-connection-filter

EXPOSE 5433
ENTRYPOINT ["postgraphile", "--watch", "--retry-on-init-fail", "--port", "5433", "-n", "0.0.0.0"]