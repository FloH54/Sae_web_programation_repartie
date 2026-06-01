-- =============================================================================
-- Script de création de la base de données : projet_d_application_repartie
-- SGBD : MariaDB
-- Description : Création des tables restaurant et reservation.
-- =============================================================================

-- 1. Création et sélection de la base de données
CREATE DATABASE IF NOT EXISTS `projet_d_application_repartie`
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE `projet_d_application_repartie`;

-- =============================================================================
-- 2. Création de la Table : restaurant
-- =============================================================================
CREATE TABLE IF NOT EXISTS `restaurant` (
    `id_restaurant` INT AUTO_INCREMENT,
    `nom` VARCHAR(150) NOT NULL,
    `coordonnee_gps` VARCHAR(100) DEFAULT NULL, -- Format texte ex: "48.8566, 2.3522"
    `adresse` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`id_restaurant`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- 3. Création de la Table : reservation
-- =============================================================================
CREATE TABLE IF NOT EXISTS `reservation` (
    `id_reservation` INT AUTO_INCREMENT,
    `id_restaurant` INT NOT NULL,
    `nb_personne` INT NOT NULL,
    `date` DATETIME NOT NULL, -- le jour et l'heure
    PRIMARY KEY (`id_reservation`),
    CONSTRAINT `fk_reservation_restaurant`
        FOREIGN KEY (`id_restaurant`) 
        REFERENCES `restaurant` (`id_restaurant`)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;