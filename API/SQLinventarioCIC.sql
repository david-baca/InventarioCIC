-- Crear base de datos si no existe
CREATE DATABASE IF NOT EXISTS `inventariocic`
DEFAULT CHARACTER SET utf8mb4
COLLATE utf8mb4_spanish_ci;

-- Desactivar las restricciones temporales
SET @OLD_UNIQUE_CHECKS = @@UNIQUE_CHECKS, UNIQUE_CHECKS = 0;
SET @OLD_FOREIGN_KEY_CHECKS = @@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS = 0;
SET @OLD_SQL_MODE = @@SQL_MODE, SQL_MODE = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- Crear tabla Responsables
CREATE TABLE IF NOT EXISTS `inventariocic`.`Responsables` (
  `pk` INT NOT NULL AUTO_INCREMENT,
  `nombres` VARCHAR(100) NOT NULL,
  `apellido_p` VARCHAR(50) NOT NULL,
  `apellido_m` VARCHAR(50) NOT NULL,
  `disponible` TINYINT(1) NOT NULL,
  PRIMARY KEY (`pk`)
) ENGINE = InnoDB
DEFAULT CHARSET = utf8mb4
COLLATE = utf8mb4_spanish_ci;

-- Crear tabla Areas
CREATE TABLE IF NOT EXISTS `inventariocic`.`Areas` (
  `pk` INT NOT NULL AUTO_INCREMENT,
  `codigo` VARCHAR(45) NOT NULL,
  `descripcion` VARCHAR(250) NOT NULL,
  `disponible` TINYINT(1) NOT NULL,
  PRIMARY KEY (`pk`)
) ENGINE = InnoDB
DEFAULT CHARSET = utf8mb4
COLLATE = utf8mb4_spanish_ci;

-- Crear tabla Grupos
CREATE TABLE IF NOT EXISTS `inventariocic`.`Grupos` (
  `pk` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(50) NOT NULL,
  `descripcion` VARCHAR(250) NOT NULL,
  `disponible` TINYINT(1) NOT NULL,
  PRIMARY KEY (`pk`)
) ENGINE = InnoDB
DEFAULT CHARSET = utf8mb4
COLLATE = utf8mb4_spanish_ci;

-- Crear tabla Articulos
CREATE TABLE IF NOT EXISTS `inventariocic`.`Articulos` (
  `pk` INT NOT NULL AUTO_INCREMENT,
  `no_inventario` VARCHAR(100) NOT NULL,
  `nombre` VARCHAR(100) NOT NULL,
  `costo` DECIMAL(10,2) NOT NULL,
  `descripcion` VARCHAR(250) NOT NULL,
  `consumible` TINYINT(1) NOT NULL COMMENT '1 = consumible, 0 = no consumible',
  `Grupos_pk` INT DEFAULT NULL,
  `Area_pk` INT DEFAULT NULL,
  `disponible` TINYINT(1) NOT NULL,
  PRIMARY KEY (`pk`),
  INDEX `fk_Articulos_Grupos1_idx` (`Grupos_pk`),
  INDEX `fk_Articulos_Area1_idx` (`Area_pk`),
  CONSTRAINT `fk_Articulos_Grupos1`
    FOREIGN KEY (`Grupos_pk`) REFERENCES `inventariocic`.`Grupos` (`pk`)
    ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_Articulos_Area1`
    FOREIGN KEY (`Area_pk`) REFERENCES `inventariocic`.`Areas` (`pk`)
    ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB
DEFAULT CHARSET = utf8mb4
COLLATE = utf8mb4_spanish_ci;

-- Crear tabla Condiciones
CREATE TABLE IF NOT EXISTS `inventariocic`.`Condiciones` (
  `pk` INT NOT NULL AUTO_INCREMENT,
  `fecha` DATE NOT NULL,
  `Articulos_pk` INT NOT NULL,
  `disponible` TINYINT(1) NOT NULL,
  PRIMARY KEY (`pk`),
  INDEX `fk_Condiciones_Articulos_idx` (`Articulos_pk`),
  CONSTRAINT `fk_Condiciones_Articulos`
    FOREIGN KEY (`Articulos_pk`) REFERENCES `inventariocic`.`Articulos` (`pk`)
    ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB
DEFAULT CHARSET = utf8mb4
COLLATE = utf8mb4_spanish_ci;

-- Crear tabla Imagenes
CREATE TABLE IF NOT EXISTS `inventariocic`.`Imagenes` (
  `imagen` VARCHAR(250) NOT NULL,
  `Condiciones_pk` INT NOT NULL,
  INDEX `fk_Imagenes_Condiciones_idx` (`Condiciones_pk`),
  CONSTRAINT `fk_Imagenes_Condiciones`
    FOREIGN KEY (`Condiciones_pk`) REFERENCES `inventariocic`.`Condiciones` (`pk`)
    ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB
DEFAULT CHARSET = utf8mb4
COLLATE = utf8mb4_spanish_ci;


-- Crear tabla Asignaciones
CREATE TABLE IF NOT EXISTS `inventariocic`.`Asignaciones` (
  `pk` INT NOT NULL AUTO_INCREMENT,
  `fecha_recibido` DATE NOT NULL,
  `Responsables_pk` INT NOT NULL,
  `Articulos_pk` INT NOT NULL,
  `disponible` TINYINT(1) NOT NULL,
  PRIMARY KEY (`pk`),
  INDEX `fk_Asignaciones_Articulos_idx` (`Articulos_pk`),
  INDEX `fk_Asignaciones_Responsables_idx` (`Responsables_pk`),
  CONSTRAINT `fk_Asignaciones_Articulos`
    FOREIGN KEY (`Articulos_pk`) REFERENCES `inventariocic`.`Articulos` (`pk`)
    ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_Asignaciones_Responsables`
    FOREIGN KEY (`Responsables_pk`) REFERENCES `inventariocic`.`Responsables` (`pk`)
    ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB
DEFAULT CHARSET = utf8mb4
COLLATE = utf8mb4_spanish_ci;

-- Crear tabla Documentos
CREATE TABLE IF NOT EXISTS `inventariocic`.`Documentos` (
  `pk` INT NOT NULL AUTO_INCREMENT,
  `doc_firma` VARCHAR(250) NOT NULL,
  `fecha` DATE NOT NULL,
  `Asignaciones_pk` INT NOT NULL,
  `disponible` TINYINT(1) NOT NULL,
  PRIMARY KEY (`pk`),
  INDEX `fk_Documentos_Asignaciones_idx` (`Asignaciones_pk`),
  CONSTRAINT `fk_Documentos_Asignaciones`
    FOREIGN KEY (`Asignaciones_pk`) REFERENCES `inventariocic`.`Asignaciones` (`pk`)
    ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB
DEFAULT CHARSET = utf8mb4
COLLATE = utf8mb4_spanish_ci;

-- Crear tabla Funciones
CREATE TABLE IF NOT EXISTS `inventariocic`.`Funciones` (
  `pk` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`pk`)
) ENGINE = InnoDB
DEFAULT CHARSET = utf8mb4
COLLATE = utf8mb4_spanish_ci;

-- Crear tabla Usuarios
CREATE TABLE IF NOT EXISTS `inventariocic`.`Usuarios` (
  `pk` INT NOT NULL AUTO_INCREMENT,
  `nombres` VARCHAR(100) NOT NULL,
  `apellido_p` VARCHAR(50) NOT NULL,
  `apellido_m` VARCHAR(50) NOT NULL,
  `correo` VARCHAR(250) NOT NULL,
  `master` TINYINT(1) NOT NULL,
  `disponible` TINYINT(1) NOT NULL,
  PRIMARY KEY (`pk`)
) ENGINE = InnoDB
DEFAULT CHARSET = utf8mb4
COLLATE = utf8mb4_spanish_ci;

-- Crear tabla Permisos
CREATE TABLE IF NOT EXISTS `inventariocic`.`Permisos` (
  `Usuarios_pk` INT NOT NULL,
  `Funciones_pk` INT NOT NULL,
  INDEX `fk_Permisos_Usuarios_idx` (`Usuarios_pk`),
  INDEX `fk_Permisos_Funciones_idx` (`Funciones_pk`),
  CONSTRAINT `fk_Permisos_Usuarios`
    FOREIGN KEY (`Usuarios_pk`) REFERENCES `inventariocic`.`Usuarios` (`pk`)
    ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_Permisos_Funciones`
    FOREIGN KEY (`Funciones_pk`) REFERENCES `inventariocic`.`Funciones` (`pk`)
    ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB
DEFAULT CHARSET = utf8mb4
COLLATE = utf8mb4_spanish_ci;

-- Crear tabla Historial
CREATE TABLE IF NOT EXISTS `inventariocic`.`Historial` (
  `pk` INT NOT NULL AUTO_INCREMENT,
  `descripcion` VARCHAR(250) NOT NULL,
  `fecha_accion` DATE NOT NULL,
  `Usuarios_pk` INT NOT NULL,
  `disponible` TINYINT(1) NOT NULL,
  PRIMARY KEY (`pk`),
  INDEX `fk_Historial_Usuarios_idx` (`Usuarios_pk`),
  CONSTRAINT `fk_Historial_Usuarios`
    FOREIGN KEY (`Usuarios_pk`) REFERENCES `inventariocic`.`Usuarios` (`pk`)
    ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB
DEFAULT CHARSET = utf8mb4
COLLATE = utf8mb4_spanish_ci;

-- Activar nuevamente las restricciones
SET SQL_MODE = @OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS = @OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS = @OLD_UNIQUE_CHECKS;