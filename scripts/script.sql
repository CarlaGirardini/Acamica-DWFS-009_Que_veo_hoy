CREATE DATABASE IF NOT EXISTS queveohoy;
USE queveohoy;
CREATE TABLE `pelicula`(
    `id` INT NOT NULL auto_increment,
    `titulo` VARCHAR(100),
    `duracion` INT,
    `director` VARCHAR(400),
    `anio` INT,
    `fecha_lanzamiento` DATE,
    `puntuacion` INT,
    `poster` VARCHAR(300),
    `trama` VARCHAR(700),
    PRIMARY KEY (`id`)
);