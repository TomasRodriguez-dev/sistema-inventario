-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: sistema_gestion
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `estadopago`
--

DROP TABLE IF EXISTS `estadopago`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `estadopago` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estadopago`
--

LOCK TABLES `estadopago` WRITE;
/*!40000 ALTER TABLE `estadopago` DISABLE KEYS */;
INSERT INTO `estadopago` VALUES (1,'Pendiente','Pago pendiente de procesamiento'),(2,'Rechazado','Pago rechazado'),(3,'Aprobado','Pago aprobado y procesado');
/*!40000 ALTER TABLE `estadopago` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `metodopago`
--

DROP TABLE IF EXISTS `metodopago`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `metodopago` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `metodopago`
--

LOCK TABLES `metodopago` WRITE;
/*!40000 ALTER TABLE `metodopago` DISABLE KEYS */;
INSERT INTO `metodopago` VALUES (1,'Efectivo','Pago en efectivo'),(2,'Débito','Pago con tarjeta de débito'),(3,'Crédito','Pago con tarjeta de crédito');
/*!40000 ALTER TABLE `metodopago` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pago`
--

DROP TABLE IF EXISTS `pago`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pago` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `idusuario` int(11) NOT NULL,
  `monto` decimal(10,2) NOT NULL,
  `fecha_pago` date NOT NULL,
  `idmetodopago` int(11) NOT NULL,
  `idestadopago` int(11) NOT NULL,
  `idrecibo` int(11) DEFAULT NULL,
  `fecha_creacion` datetime NOT NULL,
  `fecha_actualizacion` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idusuario` (`idusuario`),
  KEY `idmetodopago` (`idmetodopago`),
  KEY `idestadopago` (`idestadopago`),
  CONSTRAINT `pago_ibfk_1` FOREIGN KEY (`idusuario`) REFERENCES `usuario` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `pago_ibfk_2` FOREIGN KEY (`idmetodopago`) REFERENCES `metodopago` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `pago_ibfk_3` FOREIGN KEY (`idestadopago`) REFERENCES `estadopago` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pago`
--

LOCK TABLES `pago` WRITE;
/*!40000 ALTER TABLE `pago` DISABLE KEYS */;
INSERT INTO `pago` VALUES (1,1,100.50,'2024-10-02',1,1,1,'2024-10-02 21:00:13',NULL);
/*!40000 ALTER TABLE `pago` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recibo`
--

DROP TABLE IF EXISTS `recibo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recibo` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `idpago` int(11) NOT NULL,
  `path_archivo` varchar(255) NOT NULL,
  `fecha_subida` datetime NOT NULL,
  `estado_recibo` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idpago` (`idpago`),
  CONSTRAINT `recibo_ibfk_1` FOREIGN KEY (`idpago`) REFERENCES `pago` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recibo`
--

LOCK TABLES `recibo` WRITE;
/*!40000 ALTER TABLE `recibo` DISABLE KEYS */;
INSERT INTO `recibo` VALUES (1,1,'uploads/recibo-2024-10-02-238a8fb0-6da5-455a-98bd-73270e57a02b.pdf','2024-10-02 21:03:22','Subido');
/*!40000 ALTER TABLE `recibo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'superusuario','Control total del sistema','2024-10-02 20:54:35','2024-10-02 20:54:35'),(2,'admin','Administración de usuarios y contenido','2024-10-02 20:54:35','2024-10-02 20:54:35'),(3,'usuario','Usuario estándar','2024-10-02 20:54:35','2024-10-02 20:54:35');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `idrol` int(11) NOT NULL DEFAULT 3,
  `estado` tinyint(1) NOT NULL DEFAULT 1,
  `creado_por` int(11) DEFAULT NULL,
  `ultima_conexion` datetime DEFAULT NULL,
  `fecha_creacion` datetime NOT NULL,
  `fecha_actualizacion` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `idrol` (`idrol`),
  KEY `creado_por` (`creado_por`),
  CONSTRAINT `usuario_ibfk_1` FOREIGN KEY (`idrol`) REFERENCES `roles` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `usuario_ibfk_2` FOREIGN KEY (`creado_por`) REFERENCES `usuario` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (1,'SuperAdmin','superadmin@gmail.com','$2b$10$l21DRjcf9Wo7pGkfz1B.heRqz2Tfthe4DS6ve0PLq5v/Wy1JENbkW',1,1,NULL,NULL,'2024-10-02 20:57:20',NULL);
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-10-02 19:20:43
