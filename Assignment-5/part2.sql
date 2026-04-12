
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    userName VARCHAR(50) UNIQUE,
    firstName VARCHAR(50),
    lastName VARCHAR(50),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255),
    role VARCHAR(20)
);


CREATE TABLE user_phones (
    user_id INT,
    phone VARCHAR(20),
    PRIMARY KEY (user_id, phone),
    FOREIGN KEY (user_id) REFERENCES users(id)
);


CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    stock INT,
    price DECIMAL(10,2),
    isDeleted BOOLEAN DEFAULT FALSE,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES users(id)
);