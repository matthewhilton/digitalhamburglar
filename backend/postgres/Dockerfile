FROM postgres
ENV POSTGRES_DB my_database
COPY database.env .env
COPY pg_schema.sql /docker-entrypoint-initdb.d/