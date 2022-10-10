# Northcoders News API

## .env.* files

The POSTGRES_* environment variables are used to define the way that the databases get created and connected. If you have an existing database, you need to define the PG* environment variables so that you can connect to it.

You will need to create two .env files for your project: `.env.test` and `.env.development`. Into each, add `PGDATABASE=`, with the correct database name for that environment (see `/db/setup.sql` for the database names). Double check that these .env files are .gitignored.