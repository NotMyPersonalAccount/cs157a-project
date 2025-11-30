# CS157A Project

## Dependencies
- MariaDB (database)
- Python (api)
- Node.js/pnpm (website)

## Instructions

### Database
- Install and setup MariaDB server
- Enter mariadb shell: `mariadb -u <user> -p`
- Create new database: `CREATE DATABASE cs157a;`
- Change database to newly created database: `USE cs157a;`
- Run create schema SQL queries: `SOURCE db/create_schema.sql;`
- Run initialize data SQL queries: `SOURCE db/initialize_data.sql;`

### API
- Install [MariaDB Connector/C](https://mariadb.com/docs/connectors/mariadb-connector-c/mariadb-connector-c-guide)
- Install python dependencies: `pip install -r requirements.txt`
- Set up the `.env` file based off the `.env.example` template
- Start server: `fastapi dev main.py`

### Website
- Install dependencies: `pnpm i`
- Set up the `.env` file based off the `.env.example` template
- Start server: `pnpm run dev`
