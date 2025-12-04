DROP TABLE IF EXISTS favorites;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS movie_people;
DROP TABLE IF EXISTS movies;
DROP TABLE IF EXISTS people;
DROP TABLE IF EXISTS users;

SOURCE create_schema.sql;
SOURCE initialize_data.sql;