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