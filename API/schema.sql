Create table device (
    `name` varchar(300) NOT NULL,
    `zone` varchar(30) NOT NULL ,
    PRIMARY KEY (`name`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `User` (
    `uid` int NOT NULL AUTO_INCREMENT,
    `account` varchar(20) NOT NULL,
    `password` varchar(20) NOT NULL,
    PRIMARY KEY (`uid`)
)
