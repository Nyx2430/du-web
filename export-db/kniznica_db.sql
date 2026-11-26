-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: kniznica_db
-- ------------------------------------------------------
-- Server version	10.11.16-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `kniznica_db`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `kniznica_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;

USE `kniznica_db`;

--
-- Table structure for table `knihy`
--

DROP TABLE IF EXISTS `knihy`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `knihy` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Nazov` varchar(150) NOT NULL,
  `Autor` varchar(120) NOT NULL,
  `Rok` int(11) NOT NULL,
  `cena` decimal(10,2) NOT NULL DEFAULT 0.00,
  `vymazana` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `knihy`
--

LOCK TABLES `knihy` WRITE;
/*!40000 ALTER TABLE `knihy` DISABLE KEYS */;
INSERT INTO `knihy` VALUES (11,'The Great Gatsby','F. Scott Fitzgerald',1925,13.00,0),(12,'The Catcher in the Rye','J.D.Salinger',1951,10.95,0),(13,'Pride and Prejudice','Jana Austen',1813,10.89,0),(14,'Dracula','Bram Stoker',1897,10.29,0),(15,'Jane Eyre','Charlotte Bronter',1847,10.39,0),(16,'Animal Farm','George Orwell',1945,11.49,0),(17,'Of Mice And Men','John Steinbeck',1937,12.00,0),(18,'The Outsider','Albert Camus',1942,10.95,0),(19,'Crime and Punishment','Fyodor Dostoevsky',1866,11.99,0);
/*!40000 ALTER TABLE `knihy` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-11-26 16:28:42
-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: kniznica_db
-- ------------------------------------------------------
-- Server version	10.11.16-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `pouzivatelia`
--

DROP TABLE IF EXISTS `pouzivatelia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pouzivatelia` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `meno` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `heslo_hash` varchar(255) NOT NULL,
  `vytvoreny` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pouzivatelia`
--
-- WHERE:  email LIKE '%@example.com'

LOCK TABLES `pouzivatelia` WRITE;
/*!40000 ALTER TABLE `pouzivatelia` DISABLE KEYS */;
INSERT INTO `pouzivatelia` VALUES (20,'Ján Testovací','jan.testovaci@example.com','$2b$10$42Bmd2jaR3RH0O8r2rtyOexioKppCPrPIC5ZIpI1yqICogZri3VtO','2026-11-26 14:28:36'),(21,'Mária Ukážková','maria.ukazkova@example.com','$2b$10$448qK5YOt5FIigax8wxPuehEUA0ADqFV/iLltwVHUu67SehppxKNW','2026-11-26 14:28:36');
/*!40000 ALTER TABLE `pouzivatelia` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-11-26 16:28:42
