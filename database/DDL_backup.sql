-- MariaDB dump 10.19  Distrib 10.4.25-MariaDB, for Linux (x86_64)
--
-- Host: classmysql.engr.oregonstate.edu    Database: cs340_millegeo
-- ------------------------------------------------------
-- Server version	10.6.10-MariaDB-log

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
-- Table structure for table `Car_orders`
--

DROP TABLE IF EXISTS `Car_orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Car_orders` (
  `order_id` int(11) NOT NULL AUTO_INCREMENT,
  `order_date` date NOT NULL,
  `dealership_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`order_id`),
  KEY `dealership_id` (`dealership_id`),
  CONSTRAINT `Car_orders_ibfk_1` FOREIGN KEY (`dealership_id`) REFERENCES `Dealerships` (`dealership_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Car_orders`
--

LOCK TABLES `Car_orders` WRITE;
/*!40000 ALTER TABLE `Car_orders` DISABLE KEYS */;
INSERT INTO `Car_orders` VALUES (1,'2022-10-20',1),(2,'2022-10-08',3),(3,'2022-01-13',4);
/*!40000 ALTER TABLE `Car_orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Cars`
--

DROP TABLE IF EXISTS `Cars`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Cars` (
  `car_id` int(11) NOT NULL AUTO_INCREMENT,
  `model_name` varchar(255) NOT NULL,
  `color` varchar(255) NOT NULL,
  `order_id` int(11) NOT NULL,
  PRIMARY KEY (`car_id`),
  KEY `order_id` (`order_id`),
  CONSTRAINT `Cars_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `Car_orders` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Cars`
--

LOCK TABLES `Cars` WRITE;
/*!40000 ALTER TABLE `Cars` DISABLE KEYS */;
INSERT INTO `Cars` VALUES (4,'Tacome','White',2),(7,'Tundra','Black',2),(11,'Kia','Blue',3),(13,'1','1',3),(15,'ljad','412',2),(16,'1e2','av',1),(17,'','',1),(18,'','',2),(20,'abc','ww',1),(21,'New Car 2','PURPLE',1),(22,'Toyoyo','Green',2);
/*!40000 ALTER TABLE `Cars` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Cars_Parts`
--

DROP TABLE IF EXISTS `Cars_Parts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Cars_Parts` (
  `car_part_id` int(11) NOT NULL AUTO_INCREMENT,
  `car_id` int(11) DEFAULT NULL,
  `part_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`car_part_id`),
  KEY `car_id` (`car_id`),
  KEY `part_id` (`part_id`),
  CONSTRAINT `Cars_Parts_ibfk_1` FOREIGN KEY (`car_id`) REFERENCES `Cars` (`car_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Cars_Parts_ibfk_2` FOREIGN KEY (`part_id`) REFERENCES `Parts` (`part_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Cars_Parts`
--

LOCK TABLES `Cars_Parts` WRITE;
/*!40000 ALTER TABLE `Cars_Parts` DISABLE KEYS */;
INSERT INTO `Cars_Parts` VALUES (4,4,4);
/*!40000 ALTER TABLE `Cars_Parts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Dealerships`
--

DROP TABLE IF EXISTS `Dealerships`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Dealerships` (
  `dealership_id` int(11) NOT NULL AUTO_INCREMENT,
  `dealership_name` varchar(255) NOT NULL,
  `dealership_email` varchar(255) NOT NULL,
  `dealership_phone` varchar(15) NOT NULL,
  PRIMARY KEY (`dealership_id`),
  UNIQUE KEY `dealership_name` (`dealership_name`),
  UNIQUE KEY `dealership_email` (`dealership_email`),
  UNIQUE KEY `dealership_phone` (`dealership_phone`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Dealerships`
--

LOCK TABLES `Dealerships` WRITE;
/*!40000 ALTER TABLE `Dealerships` DISABLE KEYS */;
INSERT INTO `Dealerships` VALUES (1,'Toyoyo','orders@toyoyo.com','(506)123-4567'),(2,'Fork','orders@fork.com','(778)765-4321'),(3,'Hyondai','procurement@hyondai.com','(999)999-9999'),(4,'Chevrostand','proc@chevrostand.com','(555)544-5444'),(5,'VolksSedan','orders@volkssedan.com','(654)111-2233');
/*!40000 ALTER TABLE `Dealerships` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Parts`
--

DROP TABLE IF EXISTS `Parts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Parts` (
  `part_id` int(11) NOT NULL AUTO_INCREMENT,
  `part_name` varchar(255) NOT NULL,
  `supplier_id` int(11) NOT NULL,
  PRIMARY KEY (`part_id`),
  KEY `supplier_id` (`supplier_id`),
  CONSTRAINT `Parts_ibfk_1` FOREIGN KEY (`supplier_id`) REFERENCES `Suppliers` (`supplier_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Parts`
--

LOCK TABLES `Parts` WRITE;
/*!40000 ALTER TABLE `Parts` DISABLE KEYS */;
INSERT INTO `Parts` VALUES (1,'Piston',2),(2,'Cam shaft',2),(3,'Tie Rod',3),(4,'Engine Block',4);
/*!40000 ALTER TABLE `Parts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Suppliers`
--

DROP TABLE IF EXISTS `Suppliers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Suppliers` (
  `supplier_id` int(11) NOT NULL AUTO_INCREMENT,
  `supplier_name` varchar(255) DEFAULT NULL,
  `supplier_email` varchar(255) DEFAULT NULL,
  `supplier_phone` varchar(15) DEFAULT NULL,
  PRIMARY KEY (`supplier_id`),
  UNIQUE KEY `supplier_name` (`supplier_name`),
  UNIQUE KEY `supplier_email` (`supplier_email`),
  UNIQUE KEY `supplier_phone` (`supplier_phone`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Suppliers`
--

LOCK TABLES `Suppliers` WRITE;
/*!40000 ALTER TABLE `Suppliers` DISABLE KEYS */;
INSERT INTO `Suppliers` VALUES (1,'Napa','vending@napa.com','(888)894-8888'),(2,'Greggs','vending@greggs.com','(101)100-0110'),(3,'123 Build','vending@123build.com','(223)322-2232'),(4,'Parts\'R\'Us','vending@partsrus.com','(666)999-6669');
/*!40000 ALTER TABLE `Suppliers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `diagnostic`
--

DROP TABLE IF EXISTS `diagnostic`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `diagnostic` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `text` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `diagnostic`
--

LOCK TABLES `diagnostic` WRITE;
/*!40000 ALTER TABLE `diagnostic` DISABLE KEYS */;
INSERT INTO `diagnostic` VALUES (1,'MySQL is working!');
/*!40000 ALTER TABLE `diagnostic` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-11-15 10:01:48
