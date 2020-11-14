-- 0000.sql: CREATE TABLE article and user

CREATE TABLE `users` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(16) NOT NULL UNIQUE,
    `displayName` VARCHAR(32) NOT NULL UNIQUE,
    `password` VARCHAR(160) NOT NULL,
    `dateJoined` TIMESTAMP NOT NULL DEFAULT current_timestamp(),
    `isActive` TINYINT(1) NOT NULL DEFAULT 1,
    `isStaff` TINYINT(1) NOT NULL DEFAULT 0,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `articles` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(32) NOT NULL,
    `content` TEXT NOT NULL,
    `author` INT NOT NULL,
    `createdAt` TIMESTAMP NOT NULL DEFAULT current_timestamp(),
    `lastUpdated` TIMESTAMP NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
    `isActive` TINYINT(1) NOT NULL DEFAULT 1,
    `isDeleted` TINYINT(1) NOT NULL DEFAULT 0,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`author`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
