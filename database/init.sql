-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 23-07-2025 a las 05:18:12
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `contactform`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `contactos`
--

CREATE TABLE `contactos` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `mensaje` text NOT NULL,
  `estado` varchar(20) DEFAULT 'pendiente',
  `createdAt` datetime DEFAULT current_timestamp(),
  `updatedAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `contactos`
--

INSERT INTO `contactos` (`id`, `nombre`, `email`, `mensaje`, `estado`, `createdAt`, `updatedAt`) VALUES
(2, 'Juan Pérez autenticado', 'juan.perez@example.com', 'Hola, quiero información sobre los servicios.', 'contactado', '2025-07-10 09:27:44', '2025-07-18 00:14:57'),
(3, 'Juan Pérez pendejos', 'juan.perez@example.com', 'Hola, quiero información sobre los servicios.', 'descartado', '2025-07-13 22:39:11', '2025-07-18 00:22:11'),
(4, 'Roberto Gomez Bolaños', 'gabo3000lizama@gmail.com', 'adadadadadad', 'pendiente', '2025-07-16 01:13:41', '2025-07-16 01:13:41'),
(5, 'Roberto Gomez Bolaños', 'gabo3000lizama@gmail.com', 'fsfsfsfsfsfsfs', 'pendiente', '2025-07-18 00:17:20', '2025-07-18 00:17:20'),
(6, 'Roberto Gomez Bolaños', 'gabo3000lizama@gmail.com', 'me haces mal yo solo te quiero a ti', 'pendiente', '2025-07-18 00:18:04', '2025-07-18 00:18:04'),
(7, 'Roberto Gomez Bolaños', 'xxgabrielagxx@gmail.com', 'CUETNAOS OSBRE TU EMRPEAA', 'pendiente', '2025-07-18 02:06:15', '2025-07-18 02:06:15'),
(8, 'OMIAGA', 'gabo3000lizama@gmail.com', 'cuetnaos sobre tue mpresa', 'nuevo', '2025-07-18 02:06:53', '2025-07-19 02:37:02'),
(9, 'Roberto Gomez Bolaños', 'gabo3000lizama@gmail.com', 'putoooooooooo', 'descartado', '2025-07-18 23:14:05', '2025-07-18 23:14:54'),
(10, 'Roberto Gomez Bolaños', 'gabo3000lizama@gmail.com', 'emial js prueba', 'descartado', '2025-07-22 00:51:36', '2025-07-22 00:54:58'),
(11, 'Roberto Gomez Bolaños cambio', 'gabo3000lizama@gmail.com', 'emial js prueba', 'pendiente', '2025-07-22 23:39:51', '2025-07-22 23:39:51'),
(12, 'Emmanuel', 'fco3190@gmail.com', 'Si esta aqui', 'pendiente', '2025-07-22 23:41:21', '2025-07-22 23:41:21'),
(13, 'Emmanuel', 'fco3190@gmail.com', 'otra prueba de que todo este bien', 'pendiente', '2025-07-22 23:46:01', '2025-07-22 23:46:01');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `refreshToken` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `username`, `password`, `createdAt`, `updatedAt`, `refreshToken`) VALUES
(1, 'GabrieLag00', '$2b$10$Zx7tR780n7zZsSa8um9IQ.FjwvVOADnv9.Vn9MvIWVriccOKLreha', '2025-07-10 09:25:04', '2025-07-10 09:25:04', NULL),
(2, 'Gleirbag', '$2b$10$9vkaV7XFjAm0WRX6pQUCf.3NVeNE0yeFrmrpjroPbZoYLBRH9W3FC', '2025-07-11 21:21:36', '2025-07-11 21:21:36', NULL),
(3, 'DavidDuroChingon', '$2b$10$.wS3yHyKmXW6f2.B67dzD.rtZ37ewDRQyO1enDE8snyIHcaqHFq2.', '2025-07-11 21:26:02', '2025-07-22 23:44:10', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywidXNlcm5hbWUiOiJEYXZpZER1cm9DaGluZ29uIiwiaWF0IjoxNzUzMjI3ODUwLCJleHAiOjE3NTM4MzI2NTB9.VW04SZp80r1_g0yetzyakfK54RDFR57mVgjkflU58Io');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `contactos`
--
ALTER TABLE `contactos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `contactos`
--
ALTER TABLE `contactos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
