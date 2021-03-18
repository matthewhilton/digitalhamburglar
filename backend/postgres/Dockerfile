FROM postgres
ENV POSTGRES_DB my_database
COPY pg_schema.sql /docker-entrypoint-initdb.d/
COPY database.env .env