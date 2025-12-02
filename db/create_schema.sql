CREATE TABLE movies (
    id INTEGER AUTO_INCREMENT,
    title VARCHAR(256) NOT NULL,
    plot VARCHAR(1024),
    release_date DATE,
    runtime INTEGER,
    rating VARCHAR(16),
    genre VARCHAR(32),
    image_url VARCHAR(512),
    PRIMARY KEY (id)
);

CREATE TABLE people (
    id INTEGER AUTO_INCREMENT,
    name VARCHAR(256) NOT NULL,
    birth_date DATE,
    biography TEXT,
    image_url VARCHAR(512),
    PRIMARY KEY (id)
);

CREATE TABLE movie_people (
    id INTEGER AUTO_INCREMENT,
    movie_id INTEGER NOT NULL,
    person_id INTEGER NOT NULL,
    role VARCHAR(32) NOT NULL,
    character_name VARCHAR(256),
    PRIMARY KEY (id),
    FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
    FOREIGN KEY (person_id) REFERENCES people(id) ON DELETE CASCADE,
    INDEX idx_movie_id (movie_id),
    INDEX idx_person_id (person_id)
);

CREATE TABLE users (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
<<<<<<< HEAD
    username VARCHAR(20),
    active BOOLEAN,
);

CREATE TABLE reviews (
    user_id INTEGER FOREIGN KEY (users) REFERENCES users(id) ON DELETE CASCADE,
    movie_id INTEGER FOREIGN KEY (movies) REFERENCES movies(id) ON DELETE CASCADE,
    review_text TEXT,
    rating INTEGER,
    favorite BOOLEAN,
    PRIMARY KEY (user_id, movie_id)
=======
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE favorites (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    user_id INTEGER NOT NULL,
    movie_id INTEGER NOT NULL,
    UNIQUE KEY unique_fav (user_id, movie_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE
>>>>>>> 34f531a (add user authentication, users and favorites table, login/signup page)
);